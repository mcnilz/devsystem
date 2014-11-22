#!/bin/bash -e

curl -sSL http://download.netbeans.org/netbeans/8.0.1/final/bundles/netbeans-8.0.1-php-linux.sh > nb-inst.tmp.sh
sh nb-inst.tmp.sh --silent -J-Dnb-base.installation.location=${HOME}/netbeans8
rm nb-inst.tmp.sh
