#!/bin/bash
sudo depmod -a;
sudo modprobe v4l2loopback;
ffmpeg -loop 1 -re -i kanji2.jpeg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video$1;
