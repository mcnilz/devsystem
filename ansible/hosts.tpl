[local]
127.0.0.1 ansible_connection=local

[local:vars]
devuser=TEMPLATE
devhome=TEMPLATE
devuid=TEMPLATE
devgid=TEMPLATE

virtualbox_guest_enabled=false
samba_enabled=false

# false, nginx or docker-nginx-proxy
proxy=nginx
# for docker-nginx-proxy (see https://github.com/jwilder/nginx-proxy#wildcard-hosts)
virtual_host='"*.localdomain"'
