var Docker = require('dockerode');
var fs = require('fs');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats = fs.statSync(socket);
if (!stats.isSocket()) {
    throw new Error("Are you sure the docker is running?");
}

function runExec(container, cmd, callback) {
    container.exec({
        "AttachStdout": true,
        "AttachStderr": true,
        "Tty": false,
        Cmd: cmd
    }, function (err, exec) {
        var data = '';
        if (err) {
            if (typeof callback === 'function') {
                callback(null);
            }
            return;
        }
        exec.start(function (err, stream) {
            if (err) {
                if (typeof callback === 'function') {
                    callback(null);
                }
                return;
            }
//            stream.setEncoding('utf8');
            stream.on('data', function (chunk) {
                data = data + chunk;
            });
            stream.on('end', function () {
                if (typeof callback === 'function') {
                    callback(data);
                }
            });
            stream.on('error', function () {
                if (typeof callback === 'function') {
                    callback(null);
                }
            });
        });
    });
}

var containerPortToLocal = function (containerInspect, port) {
    var key = port + '/tcp';
    var mapPort = null;
    if (key in containerInspect.NetworkSettings.Ports) {
        var portConfig = containerInspect.NetworkSettings.Ports[key];
        portConfig.forEach(function (config) {
            if (config.HostIp === '0.0.0.0') {
                mapPort = config.HostPort;
            }
        });
    }
    return mapPort;
};

var apache2CtlParser = function (data, containerInspect) {
    var hosts = [];
    var checkDup = [];
    var regexVirtualhost = /VirtualHost configuration:[ \t\n\r]*[a-zA-Z0-9_\-.*]+:(\d+)[ \t\n\r]+([a-zA-Z0-9_\-.]+)/m;
    var regexNameVirtualHost = /port \d+ namevhost [a-zA-Z0-9_\-.]+[ \t\n\r]*(\([^(]*\)([ \t\n\r]*alias [a-zA-Z0-9_\-.]+)+)?/g;
    var regexPortHost = /port (\d+) namevhost ([a-zA-Z0-9_\-.]+)/;
    var regexAliases = /alias ([a-zA-Z0-9_\-.]+)/g;

    var addHost = function (host, port) {
        var localPort = containerPortToLocal(containerInspect, port);
        var key;
        if (localPort) {
            key = host + ':' + port;
            if (checkDup.indexOf(key) < 0) {
                checkDup.push(key);
                hosts.push({
                    localPort: localPort,
                    port: port,
                    host: host,
                    localUrl: 'http://' + host + (localPort !== 80 ? ':' + localPort : ''),
                    url: 'http://' + host + (port !== 80 ? ':' + port : '')
                });
            }

            return true;
        }

        return false;
    };

    var nameVirtualHost = data.match(regexNameVirtualHost);
    if (nameVirtualHost) {
        nameVirtualHost.forEach(function (i) {
            var matchLoop, key;
            var portHost = regexPortHost.exec(i);
            var port = parseInt(portHost[1]);
            var host = portHost[2];
            if (addHost(host, port)) {
                do
                {
                    matchLoop = regexAliases.exec(i);
                    if (matchLoop !== null) {
                        host = matchLoop[1];
                        addHost(host, port);
                    }
                } while (null !== matchLoop);
            }
        });
    } else {
        var virtualHost = regexVirtualhost.exec(data);
        if (virtualHost) {
            var port = parseInt(virtualHost[1]);
            var host = virtualHost[2];
            addHost(host, port);
        }
    }

    return hosts;
};

var generateNginx = function (vhost) {
    var config = '';

    config += 'server {\n';
    config += '  listen      80;\n';
    config += '  server_name ' + vhost.host + ';\n';
    config += '  location    / {\n';
    config += '    proxy_pass  http://localhost: ' + vhost.localPort + ';\n';
    config += '    proxy_http_version 1.1;\n';
    config += '    proxy_set_header Upgrade $http_upgrade;\n';
    config += '    proxy_set_header Connection "upgrade";\n';
    config += '    proxy_set_header Host $http_host;\n';
    config += '    proxy_set_header X-Forwarded-For $remote_addr;\n';
    config += '  }\n';
    config += '}\n\n';

    return config;
};

var docker = new Docker({socketPath: socket});
docker.listContainers({all: false}, function (err, containers) {
    var nginxConfigByContainer = {};
    var todo = containers.length;
    var final = function () {
        if (--todo === 0) {
            console.log(nginxConfigByContainer);
        }
    };

    if (todo) {
        containers.forEach(function (container_data) {
            var container = docker.getContainer(container_data.Id);
            container.inspect(function (err, data) {
                if (!err) {
                    var hasRun = false;
                    data.Config.Env.forEach(function (env) {
                        if (env.indexOf('HOSTS_BY_APACHE2CTL=') === 0) {
                            var cmd = env.substr(20);
                            hasRun = true;
                            runExec(container, [cmd, '-S'], function (output) {
                                if (output !== null) {
                                    var apacheVhosts = apache2CtlParser(output, data);
                                    var nginxConfig = '';
                                    apacheVhosts.forEach(function (vhost) {
                                        nginxConfig += generateNginx(vhost);
                                    });
                                    if (nginxConfig) {
                                        nginxConfigByContainer[container_data.Id] = nginxConfig;
                                    }
                                }
                                final();
                            });
                        }
                    });
                    if (!hasRun) {
                        final();
                    }
                } else {
                    final();
                }
            });
        });
    }
});

