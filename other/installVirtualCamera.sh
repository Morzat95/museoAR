#!/bin/bash
sudo apt-get -y install ffmpeg v4l-utils;
git clone https://github.com/umlaeute/v4l2loopback.git;
cd v4l2loopback;
sudo make && make install;
sudo cp v4l2loopback.ko /lib/modules/`uname -r`
sudo depmod -a
cd ..;
sh ./runVirtualCamera.sh;
