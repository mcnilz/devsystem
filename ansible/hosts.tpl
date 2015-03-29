[local]
127.0.0.1 ansible_connection=local

[local:vars]
devuser=TEMPLATE
devhome=TEMPLATE
devuid=TEMPLATE
devgid=TEMPLATE

virtualbox_guest_enabled=false
samba_enabled=false
tools_enabled=true
grunt_enabled=true
bower_enabled=true
composer_enabled=true
projects_php_enabled=true

# disable or select java oracle version (ex. oracle-java7-installer)
java=oracle-java7-installer

# bind services
bind_apache=127.0.0.1:8081
bind_mysql=0.0.0.0:3306
bind_elasticsearch_9200=0.0.0.0:9200
bind_elasticsearch_9300=0.0.0.0:9300

# false, nginx or docker-nginx-proxy
proxy=nginx
# for docker-nginx-proxy (see https://github.com/jwilder/nginx-proxy#wildcard-hosts)
virtual_host='"*.localdomain"'
