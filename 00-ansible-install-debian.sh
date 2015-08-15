#!/bin/sh
sudo apt-get install python-markupsafe &&
sudo apt-get remove python-pip &&
sudo easy_install -U pip &&
sudo pip install ansible
