#!/bin/sh

if [ ! "$(uname -m)" = "mips"]; then
	echo "device not support"
	return
fi

cp /extdisks/sda1/config/phddns/oraysl /etc/oray_phddns
cp /extdisks/sda1/config/phddns/oraynewph /etc/oray_phddns

chmod 777 /extdisks/sda1/init.d/oray_phddns

/etc/rc.common /etc/init.d/oray_phddns enable

/extdisks/sda1/init.d/oray_phddns start

USER_DATA="/extdisks/sda1/oraysl.status"

echo "Installing ..."
while [ ! -e $USER_DATA ]
do
	printf "> "
	sleep 1
done

SN=`head -n 2 $USER_DATA  | tail -n 1 | cut -d= -f2-`
echo "Phddns Service install success."
if [ $USER_DATA ]; then
	echo ""
	echo "+----------------------------------------------------+"
	echo "|             Oray PeanutHull Linux 3.0              |"
	echo "+----------------------------------------------------+"
	echo "|  SN: $SN   Default password: admin    |"
	echo "+----------------------------------------------------+"
	echo "| Management Address: "$SN".xmly.oray.net |"
	echo "+----------------------------------------------------+"
fi

chmod +x /extdisks/sda1/oray_phddns/*

