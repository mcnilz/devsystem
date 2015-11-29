#!/bin/bash -e

curl -sSL http://download.netbeans.org/netbeans/8.1/final/bundles/netbeans-8.1-php-linux-x64.sh > nb-inst.tmp.sh
sh nb-inst.tmp.sh --silent -J-Dnb-base.installation.location=${HOME}/netbeans81
rm nb-inst.tmp.sh
