#!/bin/sh

REPLACE="s,devuser=.*,devuser=`echo $USER`,g;s,devhome=.*,devhome=`echo $HOME`,g;s,devuid=.*,devuid=`id -u $USER`,g;s,devgid=.*,devgid=`id -g $USER`,g"
sed $REPLACE ansible/hosts.tpl > ansible/hosts
