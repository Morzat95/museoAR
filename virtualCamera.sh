sudo apt-get -y install ffmpeg v4l-utils;
git clone https://github.com/umlaeute/v4l2loopback.git;
cd v4l2loopback;
sudo make && make install;
cp v4l2loopback.ko /lib/modules/`uname -r`
sudo depmod -a
sudo modprobe v4l2loopback;
cd ..;
ffmpeg -loop 1 -re -i kanji-marker.png -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video1;
