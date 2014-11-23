#!/bin/sh

REPLACE="s,devuser=.*,devuser=`echo $USER`,g;s,devhome=.*,devhome=`echo $HOME`,g"
sed $REPLACE ansible/hosts.tpl > ansible/hosts
