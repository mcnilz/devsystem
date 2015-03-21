#!/bin/sh

# detect user account variables
REPLACE="s,devuser=.*,devuser=`echo $USER`,g;s,devhome=.*,devhome=`echo $HOME`,g;s,devuid=.*,devuid=`id -u $USER`,g;s,devgid=.*,devgid=`id -g $USER`,g"
sed $REPLACE ansible/hosts.tpl > ansible/hosts

# enable virtualbox guest and samba when inside virtualbox
sudo dmidecode | grep -i "product name: virtualbox" && 
  sed -i "s/virtualbox_guest_enabled=false/virtualbox_guest_enabled=true/g;s/samba_enabled=false/samba_enabled=true/g" ansible/hosts
