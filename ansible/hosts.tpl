[local]
127.0.0.1 ansible_connection=local

[local:vars]
devuser=TEMPLATE
devhome=TEMPLATE
devuid=TEMPLATE
devgid=TEMPLATE

# create user on target system, usefull on fresh created vms
user_enabled=false

virtualbox_guest_enabled=false
samba_enabled=false
tools_enabled=true
grunt_enabled=true
bower_enabled=true
composer_enabled=true
projects_php_enabled=true

# install tools (composer, uglify) in projects-php image
projects_php_tools=true

# elasticsearch
projects_php_elasticsearch=true
# kibana
projects_php_kibana=false

# disable or select java oracle version (ex. oracle-java7-installer)
java=oracle-java7-installer

# bind services
bind_apache=127.0.0.1:8081
bind_mysql=0.0.0.0:3306
bind_memcached=127.0.0.1:11211
bind_elasticsearch_9200=0.0.0.0:9200
bind_elasticsearch_9300=0.0.0.0:9300
bind_kibana=127.0.0.1:5601

# false, nginx or docker-nginx-proxy
proxy=nginx
# for docker-nginx-proxy (see https://github.com/jwilder/nginx-proxy#wildcard-hosts)
virtual_host='"*.localdomain"'
