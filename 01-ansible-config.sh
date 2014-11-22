#!/bin/sh
sed s/devuser=.*/devuser=`echo $USER`/g ansible/hosts.tpl > ansible/hosts
