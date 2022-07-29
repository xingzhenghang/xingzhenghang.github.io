#!/usr/bin/env bash
export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export LANG=en_US.UTF-8

red(){ echo -e "\033[31m\033[01m$1\033[0m";}
green(){ echo -e "\033[32m\033[01m$1\033[0m";}
yellow(){ echo -e "\033[33m\033[01m$1\033[0m";}
blue(){ echo -e "\033[36m\033[01m$1\033[0m";}
white(){ echo -e "\033[37m\033[01m$1\033[0m";}
bblue(){ echo -e "\033[34m\033[01m$1\033[0m";}
rred(){ echo -e "\033[35m\033[01m$1\033[0m";}
readtp(){ read -t5 -n26 -p "$(yellow "$1")" $2;}
readp(){ read -p "$(yellow "$1")" $2;}

[[ $EUID -ne 0 ]] && yellow "请以root模式运行脚本" && exit 1
if [[ -f /etc/redhat-release ]]; then
release="Centos"
elif cat /etc/issue | grep -q -E -i "debian"; then
release="Debian"
elif cat /etc/issue | grep -q -E -i "ubuntu"; then
release="Ubuntu"
elif cat /etc/issue | grep -q -E -i "centos|red hat|redhat"; then
release="Centos"
elif cat /proc/version | grep -q -E -i "debian"; then
release="Debian"
elif cat /proc/version | grep -q -E -i "ubuntu"; then
release="Ubuntu"
elif cat /proc/version | grep -q -E -i "centos|red hat|redhat"; then
release="Centos"
else 
red "不支持你当前系统，请选择使用Ubuntu,Debian,Centos系统。请向作者反馈 https://github.com/lwd-temp/warp/issues" && rm -f CFwarp.sh && exit 1
fi
vsid=`grep -i version_id /etc/os-release | cut -d \" -f2 | cut -d . -f1`
sys(){
[ -f /etc/os-release ] && grep -i pretty_name /etc/os-release | cut -d \" -f2 && return
[ -f /etc/lsb-release ] && grep -i description /etc/lsb-release | cut -d \" -f2 && return
[ -f /etc/redhat-release ] && awk '{print $0}' /etc/redhat-release && return;}
op=`sys`
version=`uname -r | awk -F "-" '{print $1}'`
main=`uname  -r | awk -F . '{print $1 }'`
minor=`uname -r | awk -F . '{print $2}'`
bit=`uname -m`
[[ $bit = x86_64 ]] && cpu=AMD64
[[ $bit = aarch64 ]] && cpu=ARM64
vi=`systemd-detect-virt`
if [[ -n $(sysctl net.ipv4.tcp_congestion_control 2>/dev/null | awk -F ' ' '{print $3}') ]]; then
bbr=`sysctl net.ipv4.tcp_congestion_control | awk -F ' ' '{print $3}'`
elif [[ -n $(ping 10.0.0.2 -c 2 | grep ttl) ]]; then
bbr="openvz版bbr-plus"
else
bbr="暂不支持显示"
fi
[[ $(type -P yum) ]] && yumapt='yum -y' || yumapt='apt -y'
[[ $(type -P curl) ]] || (yellow "检测到curl未安装，升级安装中" && $yumapt update;$yumapt install curl)
 
ud4='sed -i "5 s/^/PostUp = ip -4 rule add from $(ip route get 162.159.192.1 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf && sed -i "6 s/^/PostDown = ip -4 rule delete from $(ip route get 162.159.192.1 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf'
ud6='sed -i "7 s/^/PostUp = ip -6 rule add from $(ip route get 2606:4700:d0::a29f:c001 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf && sed -i "8 s/^/PostDown = ip -6 rule delete from $(ip route get 2606:4700:d0::a29f:c001 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf'
ud4ud6='sed -i "5 s/^/PostUp = ip -4 rule add from $(ip route get 162.159.192.1 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf && sed -i "6 s/^/PostDown = ip -4 rule delete from $(ip route get 162.159.192.1 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf && sed -i "7 s/^/PostUp = ip -6 rule add from $(ip route get 2606:4700:d0::a29f:c001 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf && sed -i "8 s/^/PostDown = ip -6 rule delete from $(ip route get 2606:4700:d0::a29f:c001 | grep -oP '"'src \K\S+') lookup main\n/"'" wgcf-profile.conf'
c1="sed -i '/0\.0\.0\.0\/0/d' wgcf-profile.conf"
c2="sed -i '/\:\:\/0/d' wgcf-profile.conf"
c3="sed -i 's/engage.cloudflareclient.com/162.159.192.1/g' wgcf-profile.conf"
c4="sed -i 's/engage.cloudflareclient.com/2606:4700:d0::a29f:c001/g' wgcf-profile.conf"
c5="sed -i 's/1.1.1.1/8.8.8.8,2001:4860:4860::8888/g' wgcf-profile.conf"
c6="sed -i 's/1.1.1.1/2001:4860:4860::8888,8.8.8.8/g' wgcf-profile.conf"
yellow " 请稍等3秒……正在扫描vps类型及参数中……"

ShowWGCF(){
v6=$(curl -s6m6 https://ip.gs -k)
v4=$(curl -s4m6 https://ip.gs -k)
isp4=`curl -s https://api.ip.sb/geoip/$v4 -k | awk -F "isp" '{print $2}' | awk -F "offset" '{print $1}' | sed "s/[,\":]//g"`
isp6=`curl -s https://api.ip.sb/geoip/$v6 -k | awk -F "isp" '{print $2}' | awk -F "offset" '{print $1}' | sed "s/[,\":]//g"`
UA_Browser="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
[[ -e /etc/wireguard/wgcf+p.log ]] && cfplus="WARP+普通账户(有限WARP+流量)，设备名称：$(grep -s 'Device name' /etc/wireguard/wgcf+p.log | awk '{ print $NF }')" || cfplus="WARP+Teams账户(无限WARP+流量)"
AE="阿联酋（United Arab Emirates）";AU="澳大利亚（Australia）";BG="保加利亚（Bulgaria）";BR="巴西（Brazil）";CA="加拿大（Canada）";CH="瑞士（Switzerland）";CL="智利（Chile)";CN="中国（China）";CO="哥伦比亚（Colombia）";DE="德国（Germany)";ES="西班牙（Spain)";FI="芬兰（Finland）";FR="法国（France）";GB="英国（United Kingdom）";HK="香港（Hong Kong）";ID="印度尼西亚（Indonesia）";IE="爱尔兰（Ireland）";IL="以色列（Israel）";IN="印度（India）";IT="意大利（Italy）";JP="日本（Japan）";KR="韩国（South Korea）";LU="卢森堡（Luxembourg）";MX="墨西哥（Mexico）";MY="马来西亚（Malaysia）";NL="荷兰（Netherlands）";NZ="新西兰（New Zealand）";PH="菲律宾（Philippines）";RO="罗马尼亚（Romania）";RU="俄罗斯（Russian）";SA="沙特（Saudi Arabia）";SE="瑞典（Sweden）";SG="新加坡（Singapore）";TW="台湾（Taiwan）";US="美国（United States）";VN="越南（Vietnam）";ZA="南非（South Africa）"
if [[ -n $v4 ]]; then
result4=$(curl -4 --user-agent "${UA_Browser}" -fsL --write-out %{http_code} --output /dev/null --max-time 10 "https://www.netflix.com/title/81215567" 2>&1)
[[ "$result4" == "404" ]] && NF="遗憾哦，当前IP仅解锁奈飞Netflix自制剧..."
[[ "$result4" == "403" ]] && NF="死心了，当前IP不支持解锁奈飞Netflix....."
[[ "$result4" == "000" ]] && NF="检测到网络有问题，再次进入脚本可能就好了.."
[[ "$result4" == "200" ]] && NF="恭喜呀，当前IP可解锁奈飞Netflix流媒体..."
g4=$(eval echo \$$(curl -s https://api.ip.sb/geoip/$v4 -k | awk -F "country_code" '{print $2}' | awk -F "region_code" '{print $1}' | sed "s/[,\":}]//g"))
wgcfv4=$(curl -s4 https://www.cloudflare.com/cdn-cgi/trace -k | grep warp | cut -d= -f2) 
case ${wgcfv4} in 
plus) 
WARPIPv4Status=$(white "IPV4 WARP+状态：\c" ; rred "运行中，$cfplus" ; white " [ Cloudflare服务商 ]获取IPV4：\c" ; rred "$v4" ; white " IPV4 奈飞NF解锁情况：\c" ; rred "$NF  \c"; white " IPV4 所在地区：\c" ; rred "$g4");;  
on) 
WARPIPv4Status=$(white "IPV4 WARP状态：\c" ; green "运行中，WARP普通账户(无限WARP流量)" ; white " [ Cloudflare服务商 ]获取IPV4：\c" ; green "$v4" ; white " IPV4 奈飞NF解锁情况：\c" ; green "$NF  \c"; white " IPV4 所在地区：\c" ; green "$g4");;
off) 
WARPIPv4Status=$(white "IPV4 WARP状态：\c" ; yellow "关闭中" ; white " [ $isp4服务商 ]获取IPV4：\c" ; yellow "$v4" ; white " IPV4 奈飞NF解锁情况：\c" ; yellow "$NF  \c"; white " IPV4 所在地区：\c" ; yellow "$g4");; 
esac 
else
WARPIPv4Status=$(white "IPV4 状态：\c" ; red "不存在IPV4地址 ")
fi 
if [[ -n $v6 ]]; then
result6=$(curl -6 --user-agent "${UA_Browser}" -fsL --write-out %{http_code} --output /dev/null --max-time 10 "https://www.netflix.com/title/81215567" 2>&1)
[[ "$result6" == "404" ]] && NF="遗憾哦，当前IP仅解锁奈飞Netflix自制剧..."
[[ "$result6" == "403" ]] && NF="死心了，当前IP不支持解锁奈飞Netflix....."
[[ "$result6" == "000" ]] && NF="检测到网络有问题，再次进入脚本可能就好了.."
[[ "$result6" == "200" ]] && NF="恭喜呀，当前IP可解锁奈飞Netflix流媒体..."
g6=$(eval echo \$$(curl -s https://api.ip.sb/geoip/$v6 -k | awk -F "country_code" '{print $2}' | awk -F "region_code" '{print $1}' | sed "s/[,\":}]//g"))
wgcfv6=$(curl -s6 https://www.cloudflare.com/cdn-cgi/trace -k | grep warp | cut -d= -f2) 
case ${wgcfv6} in 
plus) 
WARPIPv6Status=$(white "IPV6 WARP+状态：\c" ; rred "运行中，$cfplus" ; white " [ Cloudflare服务商 ]获取IPV6：\c" ; rred "$v6" ; white " IPV6 奈飞NF解锁情况：\c" ; rred "$NF  \c"; white " IPV6 所在地区：\c" ; rred "$g6");;  
on) 
WARPIPv6Status=$(white "IPV6 WARP状态：\c" ; green "运行中，WARP普通账户(无限WARP流量)" ; white " [ Cloudflare服务商 ]获取IPV6：\c" ; green "$v6" ; white " IPV6 奈飞NF解锁情况：\c" ; green "$NF  \c"; white " IPV6 所在地区：\c" ; green "$g6");;
off) 
WARPIPv6Status=$(white "IPV6 WARP状态：\c" ; yellow "关闭中" ; white " [ $isp6服务商 ]获取IPV6：\c" ; yellow "$v6" ; white " IPV6 奈飞NF解锁情况：\c" ; yellow "$NF  \c"; white " IPV6 所在地区：\c" ; yellow "$g6");;
esac 
else
WARPIPv6Status=$(white "IPV6 状态：\c" ; red "不存在IPV6地址 ")
fi 
}

ShowSOCKS5(){
if [[ $(systemctl is-active warp-svc) = active ]]; then
mport=`warp-cli --accept-tos settings 2>/dev/null | grep 'Proxy listening on' | awk -F "127.0.0.1:" '{print $2}'`
AE="阿联酋（United Arab Emirates）";AU="澳大利亚（Australia）";BG="保加利亚（Bulgaria）";BR="巴西（Brazil）";CA="加拿大（Canada）";CH="瑞士（Switzerland）";CL="智利（Chile)";CN="中国（China）";CO="哥伦比亚（Colombia）";DE="德国（Germany)";ES="西班牙（Spain)";FI="芬兰（Finland）";FR="法国（France）";GB="英国（United Kingdom）";HK="香港（Hong Kong）";ID="印度尼西亚（Indonesia）";IE="爱尔兰（Ireland）";IL="以色列（Israel）";IN="印度（India）";IT="意大利（Italy）";JP="日本（Japan）";KR="韩国（South Korea）";LU="卢森堡（Luxembourg）";MX="墨西哥（Mexico）";MY="马来西亚（Malaysia）";NL="荷兰（Netherlands）";NZ="新西兰（New Zealand）";PH="菲律宾（Philippines）";RO="罗马尼亚（Romania）";RU="俄罗斯（Russian）";SA="沙特（Saudi Arabia）";SE="瑞典（Sweden）";SG="新加坡（Singapore）";TW="台湾（Taiwan）";US="美国（United States）";VN="越南（Vietnam）";ZA="南非（South Africa）"
result=$(curl -sx socks5h://localhost:$mport -fsL --write-out %{http_code} --output /dev/null --max-time 10 "https://www.netflix.com/title/81215567" 2>&1)
[[ "$result" == "404" ]] && NF="遗憾哦，当前IP仅解锁奈飞Netflix自制剧..."
[[ "$result" == "403" ]] && NF="死心了，当前IP不支持解锁奈飞Netflix....."
[[ "$result" == "000" ]] && NF="检测到网络有问题，再次进入脚本可能就好了.."
[[ "$result" == "200" ]] && NF="恭喜呀，当前IP可解锁奈飞Netflix流媒体..."
socks5=$(curl -sx socks5h://localhost:$mport www.cloudflare.com/cdn-cgi/trace -k --connect-timeout 2 | grep warp | cut -d= -f2) 
s5ip=`curl -sx socks5h://localhost:$mport ip.gs -k`
s5gj=$(eval echo \$$(curl -s https://api.ip.sb/geoip/$S5ip -k | awk -F "country_code" '{print $2}' | awk -F "region_code" '{print $1}' | sed "s/[,\":}]//g"))
case ${socks5} in 
plus) 
S5Status=$(white "Socks5 WARP+状态：\c" ; rred "运行中，WARP+普通账户(剩余WARP+流量:$((`warp-cli --accept-tos account | grep Quota | awk '{ print $(NF) }'`/1000000000))GiB)" ; white " Socks5 端口：\c" ; rred "$mport" ; white " [ Cloudflare服务商 ]获取IPV4：\c" ; rred "$s5ip" ; white " IPV4 奈飞NF解锁情况：\c" ; rred "$NF  \c" ; white " IPV4 所在地区：\c" ; rred "$s5gj");;  
on) 
S5Status=$(white "Socks5 WARP状态：\c" ; green "运行中，WARP普通账户(无限WARP流量)" ; white " Socks5 端口：\c" ; green "$mport" ; white " [ Cloudflare服务商 ]获取IPV4：\c" ; green "$s5ip" ; white " IPV4 奈飞NF解锁情况：\c" ; green "$NF  \c"; white " IPV4 所在地区：\c" ; green "$s5gj");;  
*) 
S5Status=$(white "Socks5 WARP状态：\c" ; yellow "已安装Socks5-WARP客户端，但端口处于关闭状态")
esac 
else
S5Status=$(white "Socks5 WARP状态：\c" ; red "未安装Socks5-WARP客户端")
fi
}

STOPwgcf(){
if [[ $(type -P warp-cli) ]]; then
red "已安装Socks5-WARP(+)，不支持当前选择的Wgcf-WARP(+)安装方案" 
systemctl start wg-quick@wgcf >/dev/null 2>&1 ; bash CFwarp.sh
fi
}
WGCFv4(){
systemctl stop wg-quick@wgcf >/dev/null 2>&1
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf || \cp -f /etc/resolv.conf /root/resolv.conf
ShowWGCF
if [[ -n $v4 && -n $v6 ]]; then
green "vps真IP特征:原生v4+v6双栈vps\n现添加Wgcf-WARP-IPV4单栈"
ABC1=$ud4 && ABC2=$c2 && ABC3=$c5 && WGCFins
fi
if [[ -n $v6 && -z $v4 ]]; then
green "vps真IP特征:原生v6单栈vps\n现添加Wgcf-WARP-IPV4单栈"
ABC1=$c2 && ABC2=$c4 && ABC3=$c5 && WGCFins
fi
if [[ -z $v6 && -n $v4 ]]; then
green "vps真IP特征:原生v4单栈vps\n现添加Wgcf-WARP-IPV4单栈"
STOPwgcf ; ABC1=$ud4 && ABC2=$c2 && ABC3=$c3 && ABC4=$c5 && WGCFins
fi
}

WGCFv6(){
systemctl stop wg-quick@wgcf >/dev/null 2>&1
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf || \cp -f /etc/resolv.conf /root/resolv.conf
ShowWGCF
if [[ -n $v4 && -n $v6 ]]; then
green "vps真IP特征:原生v4+v6双栈vps\n现添加Wgcf-WARP-IPV6单栈"
ABC1=$ud6 && ABC2=$c1 && ABC3=$c5 && WGCFins
fi
if [[ -n $v6 && -z $v4 ]]; then
green "vps真IP特征:原生v6单栈vps\n现添加Wgcf-WARP-IPV6单栈 (无IPV4！！！)"
STOPwgcf ; ABC1=$ud6 && ABC2=$c1 && ABC3=$c4 && ABC4=$c6 && WGCFins
fi
if [[ -z $v6 && -n $v4 ]]; then
green "vps真IP特征:原生v4单栈vps\n现添加Wgcf-WARP-IPV6单栈"
ABC1=$c1 && ABC2=$c3 && ABC3=$c5 && WGCFins
fi
}

WGCFv4v6(){
systemctl stop wg-quick@wgcf >/dev/null 2>&1
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf || \cp -f /etc/resolv.conf /root/resolv.conf
ShowWGCF
if [[ -n $v4 && -n $v6 ]]; then
green "vps真IP特征:原生v4+v6双栈vps\n现添加Wgcf-WARP-IPV4+IPV6双栈"
STOPwgcf ; ABC1=$ud4ud6 && ABC2=$c5 && WGCFins
fi
if [[ -n $v6 && -z $v4 ]]; then
green "vps真IP特征:原生v6单栈vps\n现添加Wgcf-WARP-IPV4+IPV6双栈"
STOPwgcf ; ABC1=$ud6 && ABC2=$c4 && ABC3=$c5 && WGCFins
fi
if [[ -z $v6 && -n $v4 ]]; then
green "vps真IP特征:原生v4单栈vps\n现添加Wgcf-WARP-IPV4+IPV6双栈"
STOPwgcf ; ABC1=$ud4 && ABC2=$c3 && ABC3=$c5 && WGCFins
fi
}

WGCFmenu(){
white "------------------------------------------------------------------------------------------------"
white " 当前VPS IPV4接管出站流量情况如下 "
blue " ${WARPIPv4Status}"
white "------------------------------------------------------------------------------------------------"
white " 当前VPS IPV6接管出站流量情况如下"
blue " ${WARPIPv6Status}"
white "------------------------------------------------------------------------------------------------"
}
S5menu(){
white "------------------------------------------------------------------------------------------------"
white " 当前Socks5-WARP客户端本地代理127.0.0.1情况如下"
blue " ${S5Status}"
white "------------------------------------------------------------------------------------------------"
}
back(){
white "------------------------------------------------------------------------------------------------"
white " 回主菜单，请按任意键"
white " 退出脚本，请按Ctrl+C"
get_char && bash CFwarp.sh
}

IP_Status_menu(){
white "------------------------------------------------------------------------------------------------"
WGCFmenu;S5menu 
}

checkwgcf(){
wgcfv6=$(curl -s6m6 https://www.cloudflare.com/cdn-cgi/trace -k | grep warp | cut -d= -f2) 
wgcfv4=$(curl -s4m6 https://www.cloudflare.com/cdn-cgi/trace -k | grep warp | cut -d= -f2) 
}

CheckWARP(){
yellow "获取WARP的IP中…………"
i=0
wg-quick down wgcf >/dev/null 2>&1
systemctl start wg-quick@wgcf >/dev/null 2>&1
while [ $i -le 4 ]; do let i++
systemctl restart wg-quick@wgcf >/dev/null 2>&1
checkwgcf
[[ $wgcfv4 =~ on|plus || $wgcfv6 =~ on|plus ]] && green "恭喜！WARP的IP获取成功！" && break || red "遗憾！WARP的IP获取失败"
done
checkwgcf
if [[ ! $wgcfv4 =~ on|plus && ! $wgcfv6 =~ on|plus ]]; then
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf
green "失败建议如下："
[[ $release = Centos && ${vsid} -lt 7 ]] && yellow "当前系统版本号：Centos $vsid \n建议使用 Centos 7 以上系统 " 
[[ $release = Ubuntu && ${vsid} -lt 18 ]] && yellow "当前系统版本号：Ubuntu $vsid \n建议使用 Ubuntu 18 以上系统 " 
[[ $release = Debian && ${vsid} -lt 10 ]] && yellow "当前系统版本号：Debian $vsid \n建议使用 Debian 10 以上系统 "
if [[ $vi = openvz ]]; then
TUN=$(cat /dev/net/tun 2>&1)
[[ ${TUN} != "cat: /dev/net/tun: File descriptor in bad state" ]] && red "检测完毕：未开启TUN，不支持安装WARP(+)，请与VPS厂商沟通或后台设置以开启TUN"
fi
yellow "强烈建议使用官方源升级系统及内核加速！如已使用第三方源及内核加速，请务必更新到最新版，或重置为官方源"
yellow "有疑问请向作者反馈 https://github.com/lwd-temp/warp/issues"
rm -rf resolv.conf && exit 0
fi
}

dns(){
if [[ -n $v6 && -z $v4 ]]; then
echo -e "nameserver 2001:4860:4860::8888\nnameserver 8.8.8.8" > /etc/resolv.conf
else
echo -e "nameserver 8.8.8.8\nnameserver 2001:4860:4860::8888" > /etc/resolv.conf
fi
}
get_char(){
SAVEDSTTY=`stty -g`
stty -echo
stty cbreak
dd if=/dev/tty bs=1 count=1 2> /dev/null
stty -raw
stty echo
stty $SAVEDSTTY
}

Macka(){
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
wget -P /root -N --no-check-certificate "https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh" && chmod 700 /root/install.sh && /root/install.sh
}

Netflix(){
wget -N --no-check-certificate https://cdn.jsdelivr.net/gh/missuo/SimpleNetflix/nf.sh && chmod +x nf.sh && ./nf.sh
back
}

up4(){
wget -N --no-check-certificate https://raw.githubusercontent.com/lwd-temp/warp/main/CFwarp.sh && chmod +x CFwarp.sh && ./CFwarp.sh
}

WGCFins(){
rm -rf /usr/local/bin/wgcf /etc/wireguard/wgcf.conf /etc/wireguard/wgcf-profile.conf /etc/wireguard/wgcf-account.toml /etc/wireguard/wgcf+p.log /etc/wireguard/ID /usr/bin/wireguard-go wgcf-account.toml wgcf-profile.conf
ShowWGCF
if [[ $release = Centos ]]; then
yum install epel-release -y;yum install iproute iptables wireguard-tools -y
elif [[ $release = Debian ]]; then
apt install lsb-release -y
echo "deb http://deb.debian.org/debian $(lsb_release -sc)-backports main" | tee /etc/apt/sources.list.d/backports.list
apt update -y;apt install iproute2 openresolv dnsutils iptables -y;apt install wireguard-tools --no-install-recommends -y      		
elif [[ $release = Ubuntu ]]; then
apt update -y;apt install iproute2 openresolv dnsutils iptables -y;apt install wireguard-tools --no-install-recommends -y			
fi
[[ $cpu = AMD64 ]] && wget -N https://cdn.jsdelivr.net/gh/lwd-temp/warp/wgcf_2.2.9_amd64 -O /usr/local/bin/wgcf && chmod +x /usr/local/bin/wgcf         
[[ $cpu = ARM64 ]] && wget -N https://cdn.jsdelivr.net/gh/lwd-temp/warp/wgcf_2.2.9_arm64 -O /usr/local/bin/wgcf && chmod +x /usr/local/bin/wgcf
if [[ $main -lt 5 || $minor -lt 6 ]] || [[ $vi =~ lxc|openvz ]]; then
[[ -e /usr/bin/wireguard-go ]] || wget -N https://cdn.jsdelivr.net/gh/lwd-temp/warp/wireguard-go -O /usr/bin/wireguard-go && chmod +x /usr/bin/wireguard-go
fi
echo | wgcf register
until [[ -e wgcf-account.toml ]]
do
yellow "申请WARP普通账户过程中可能会多次提示：429 Too Many Requests，请等待30秒" && sleep 1
echo | wgcf register
done
wgcf generate
yellow "开始自动设置WARP的MTU最佳网络吞吐量值，以优化WARP网络！"
MTUy=1500
MTUc=10
if [[ -n $v6 && -z $v4 ]]; then
ping='ping6'
IP1='2606:4700:4700::1111'
IP2='2001:4860:4860::8888'
else
ping='ping'
IP1='1.1.1.1'
IP2='8.8.8.8'
fi
while true; do
if ${ping} -c1 -W1 -s$((${MTUy} - 28)) -Mdo ${IP1} >/dev/null 2>&1 || ${ping} -c1 -W1 -s$((${MTUy} - 28)) -Mdo ${IP2} >/dev/null 2>&1; then
MTUc=1
MTUy=$((${MTUy} + ${MTUc}))
else
MTUy=$((${MTUy} - ${MTUc}))
[[ ${MTUc} = 1 ]] && break
fi
[[ ${MTUy} -le 1360 ]] && MTUy='1360' && break
done
MTU=$((${MTUy} - 80))
green "MTU最佳网络吞吐量值= $MTU 已设置完毕"
sed -i "s/MTU.*/MTU = $MTU/g" wgcf-profile.conf
echo $ABC1 | sh
echo $ABC2 | sh
echo $ABC3 | sh
echo $ABC4 | sh
dns
cp -f wgcf-profile.conf /etc/wireguard/wgcf.conf >/dev/null 2>&1
mv -f wgcf-profile.conf /etc/wireguard >/dev/null 2>&1
mv -f wgcf-account.toml /etc/wireguard >/dev/null 2>&1
systemctl enable wg-quick@wgcf >/dev/null 2>&1
CheckWARP
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
ShowWGCF && WGCFmenu && back
}

SOCKS5ins(){
[[ $(warp-cli --accept-tos status 2>/dev/null) =~ 'Connected' ]] && red "当前Socks5-WARP已经在运行中" && bash CFwarp.sh
systemctl stop wg-quick@wgcf >/dev/null 2>&1
ShowWGCF
if [[ -n $v6 && -z $v4 ]]; then
systemctl start wg-quick@wgcf >/dev/null 2>&1
red "纯IPV6的VPS目前不支持安装Socks5-WARP" && bash CFwarp.sh
elif [[ -n $v4 && -z $v6 ]]; then
systemctl start wg-quick@wgcf >/dev/null 2>&1
[[ $wgcfv4 =~ on|plus && ! $wgcfv6 =~ on|plus ]] && red "纯IPV4的VPS已安装Wgcf-WARP-IPV4(选项1)，不支持安装Socks5-WARP" && bash CFwarp.sh
fi
systemctl start wg-quick@wgcf >/dev/null 2>&1
[[ $wgcfv4 =~ on|plus && $wgcfv6 =~ on|plus ]] && red "已安装Wgcf-WARP-IPV4+IPV6(选项3)，不支持安装Socks5-WARP" && bash CFwarp.sh
if [[ $release = Centos ]]; then 
yum -y install epel-release && yum -y install net-tools
rpm -ivh http://pkg.cloudflareclient.com/cloudflare-release-el$vsid.rpm
yum -y install cloudflare-warp
fi
if [[ $release = Debian ]]; then
[[ ! $(type -P gpg) ]] && apt update && apt install gnupg -y
[[ ! $(apt list 2>/dev/null | grep apt-transport-https | grep installed) ]] && apt update && apt install apt-transport-https -y
fi
if [[ $release != Centos ]]; then 
apt install net-tools -y
curl https://pkg.cloudflareclient.com/pubkey.gpg | apt-key add -
echo "deb http://pkg.cloudflareclient.com/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/cloudflare-client.list
apt update;apt install cloudflare-warp -y
fi
warp-cli --accept-tos register >/dev/null 2>&1 && sleep 2
warp-cli --accept-tos set-mode proxy >/dev/null 2>&1
warp-cli --accept-tos enable-always-on >/dev/null 2>&1
ShowSOCKS5
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
S5menu && back
}

WARPup(){
ab="1.升级Wgcf-WARP+账户\n2.升级Socks5-WARP+账户\n3.更换Socks5端口\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in 
1 )
[[ ! $(type -P wg-quick) ]] && red "未安装Wgcf-WARP，无法升级到Wgcf-WARP+账户" && bash CFwarp.sh
ShowWGCF
[[ $wgcfv4 = plus || $wgcfv6 = plus ]] && red "当前已是Wgcf-WARP+账户，无须再升级" && bash CFwarp.sh 
cd /etc/wireguard
readp "按键许可证秘钥(26个字符):" ID
[[ -n $ID ]] && sed -i "s/license_key.*/license_key = \"$ID\"/g" wgcf-account.toml && readp "设备名称重命名(直接回车随机命名)：" sbmc || (red "未输入按键许可证秘钥(26个字符)" && bash CFwarp.sh)
[[ -n $sbmc ]] && SBID="--name $(echo $sbmc | sed s/[[:space:]]/_/g)"
wgcf update $SBID > /etc/wireguard/wgcf+p.log 2>&1
wgcf generate
sed -i "2s#.*#$(sed -ne 2p wgcf-profile.conf)#;4s#.*#$(sed -ne 4p wgcf-profile.conf)#" wgcf.conf
checkwgcf
[[ $wgcfv4 = plus || $wgcfv6 = plus ]] && green "已升级为Wgcf-WARP+账户\nWgcf-WARP+账户设备名称：$(grep -s 'Device name' /etc/wireguard/wgcf+p.log | awk '{ print $NF }')\nWgcf-WARP+账户剩余流量：$(grep -s Quota /etc/wireguard/wgcf+p.log | awk '{ print $(NF-1), $NF }')"
ShowWGCF && WGCFmenu && back;;
2 )
[[ ! $(type -P warp-cli) ]] && red "未安装Socks5-WARP，无法升级到Socks5-WARP+账户" && bash CFwarp.sh
[[ $(warp-cli --accept-tos account) =~ 'Limited' ]] && red "当前已是Socks5-WARP+账户，无须再升级" && bash CFwarp.sh
mkdir -p /etc/wireguard/ >/dev/null 2>&1
readp "按键许可证秘钥(26个字符):" ID
[[ -n $ID ]] && warp-cli --accept-tos set-license $ID >/dev/null 2>&1 || (red "未输入按键许可证秘钥(26个字符)" && bash CFwarp.sh)
yellow "如提示Error: Too many devices.说明超过了最多绑定4台设备限制"
[[ $(warp-cli --accept-tos account) =~ 'Limited' ]] && green "已升级为Socks5-WARP+账户\nSocks5-WARP+账户剩余流量：$((`warp-cli --accept-tos account | grep Quota | awk '{ print $(NF) }'`/1000000000))GB" && echo $ID >/etc/wireguard/ID
ShowSOCKS5 && S5menu && back;;
3 )
[[ ! $(type -P warp-cli) ]] && red "未安装Socks5-WARP(+)，无法更改端口" && bash CFwarp.sh
if readp "请输入自定义socks5端口(1024～65535):" port ; then
if [[ -n $(netstat -ntlp | grep "$port") ]]; then
until [[ -z $(netstat -ntlp | grep "$port") ]]
do
[[ -n $(netstat -ntlp | grep "$port") ]] && yellow "\n端口被占用，请重新输入端口" && readp "自定义Socks5端口:" port
done
fi
fi
[[ -n $port ]] && warp-cli --accept-tos set-proxy-port $port >/dev/null 2>&1
ShowSOCKS5 && S5menu && back;;
0 ) WARPupre
esac
}

WARPupre(){
[[ ! $(type -P python3) ]] && yellow "检测到python3未安装，升级安装中" && $yumapt install python3
[[ ! $(type -P screen) ]] && yellow "检测到screen未安装，升级安装中" && $yumapt install screen
ab="1.Wgcf-WARP(+)账户升级到Teams账户\n2.Wgcf-WARP升级到WARP+账户、Wgcf-Socks5升级到WARP+账户、更换Socks5端口\n3.在线前台刷WARP+普通账户流量\n4.离线后台刷WARP+普通账户流量\n5.screen管理设置\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in 
1 )
[[ ! -e /etc/wireguard/wgcf.conf ]] && red "无法找到Wgcf-WARP(+)配置文件，建议重装Wgcf-WARP(+)" && bash CFwarp.sh
readp "请复制privateKey(44个字符）：" Key
readp "请复制IPV6的Address：" Add
if [[ -n $Key && -n $Add ]]; then
sed -i "s#PrivateKey.*#PrivateKey = $Key#g;s#Address.*128#Address = $Add/128#g" /etc/wireguard/wgcf.conf
systemctl restart wg-quick@wgcf >/dev/null 2>&1
checkwgcf
if [[ $wgcfv4 = plus || $wgcfv6 = plus ]]; then
rm -rf /etc/wireguard/wgcf+p.log && green "Wgcf-WARP+Teams账户已生效" && ShowWGCF && WGCFmenu && back
else
red "开启Wgcf-WARP+Teams账户失败，恢复使用WARP普通账户" && cp -f /etc/wireguard/wgcf-profile.conf /etc/wireguard/wgcf.conf >/dev/null 2>&1 && systemctl restart wg-quick@wgcf && ShowWGCF && WGCFmenu && back
fi
else 
red "未复制privateKey或Address，恢复使用WARP普通账户" && cp -f /etc/wireguard/wgcf-profile.conf /etc/wireguard/wgcf.conf >/dev/null 2>&1 && systemctl restart wg-quick@wgcf && ShowWGCF && WGCFmenu && back
fi;;
2 ) WARPup;;
3 ) wget -N --no-check-certificate https://cdn.jsdelivr.net/gh/kkkyg/warp-plus/wp.py && python3 wp.py;;
4 )
wget -N --no-check-certificate https://cdn.jsdelivr.net/gh/kkkyg/warp-plus/wp.py
sed -i "27 s/[(][^)]*[)]//g" wp.py
readp "客户端配置ID(36个字符)：" ID
sed -i "27 s/input/'$ID'/" wp.py
readp "设置screen窗口名称，回车默认名称为'wp'：" wpp
[[ -z $wpp ]] && wpp='wp'
screen -dmS $wpp bash -c '/usr/bin/python3 /root/wp.py' && back;;
5 ) bash <(curl -sSL https://cdn.jsdelivr.net/gh/kkkyg/screen-script/screen.sh) && back;;
0 ) bash CFwarp.sh
esac
}

ReIP(){
ab="1.手动刷新Wgcf-WARP(+)奈飞IP\n2.手动刷新Socks5-WARP(+)奈飞IP\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in 
1 )
[[ ! $(type -P wg-quick) ]] && red "未安装Wgcf-WARP(+)，无法刷新IP" && bash CFwarp.sh
ShowWGCF
ab="1.刷新IPV4的奈飞IP\n2.刷新IPV6的奈飞IP\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in 
1 )
[[ $wgcfv4 = plus || $wgcfv4 = on ]] || (yellow "未开启Wgcf-WARP(+)-IPV4" && CFwarp.sh)
i=0
yellow "共刷新10次IP"
while [ $i -le 9 ]; do let i++
ShowWGCF
[[ "$result4" == "200" ]] && yellow "第$i次刷新IP \c" && green "恭喜，此IP：$v4 支持奈飞" && break || (yellow "第$i次刷新IP \c" && CheckWARP && red "当前IP：$v4 $NF" && sleep 3)
done
ShowWGCF && WGCFmenu && back;;
2 )
[[ $wgcfv6 = plus || $wgcfv6 = on ]] || (yellow "未开启Wgcf-WARP(+)-IPV6" && CFwarp.sh)
i=0
yellow "共刷新10次IP"
while [ $i -le 9 ]; do let i++
ShowWGCF
[[ "$result6" == "200" ]] && yellow "第$i次刷新IP \c" && green "恭喜，此IP：$v6 支持奈飞" && break || (yellow "第$i次刷新IP \c" && CheckWARP && red "当前IP：$v6 $NF" && sleep 3)
done
ShowWGCF && WGCFmenu && back;;
0 ) ReIP
esac;;
2 )
[[ ! $(type -P warp-cli) ]] && red "未安装Socks5-WARP(+)，无法刷新IP" && bash CFwarp.sh
s5c(){
warp-cli --accept-tos register >/dev/null 2>&1 && sleep 2
[[ -e /etc/wireguard/ID ]] && warp-cli --accept-tos set-license $(cat /etc/wireguard/ID) >/dev/null 2>&1
}
i=0
yellow "共刷新10次IP"
while [ $i -le 9 ]; do let i++
ShowSOCKS5
[[ "$result" == "200" ]] && yellow "第$i次刷新IP \c" && green "恭喜，此IP：$s5ip 支持奈飞" && break || (yellow "第$i次刷新IP \c" && s5c && red "当前IP：$s5i $NF" && sleep 3)
done
ShowSOCKS5 && S5menu && back;;
0 ) REnfwarp
esac
}

Rewarp(){
ab="1.启用：离线后台+重启VPS自动刷NF功能\n2.启用：离线后台+重启VPS自动刷区域IP功能\n3.关闭：重启VPS自动刷奈飞IP或区域IP功能\n（离线Screen窗口请在Screen管理设置中删除）\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in  
1 )
[[ -e /root/WARP-CR.sh ]] && yellow "经检测，你正在使用自动刷区域IP功能，请关闭后再启动刷NF功能" && REnfwarp
[[ ! $(type -P screen) ]] && yellow "检测到screen未安装，升级安装中" && $yumapt install screen
wget -N --no-check-certificate https://raw.githubusercontent.com/kkkyg/Netflix-WARP/main/check.sh
readp "输入国家区域简称（例：新加坡，输入大写SG;美国，输入大写US）:" gj
[[ -n $gj ]] && sed -i "s/dd/$gj/g" check.sh || (sed -i "s/dd/\$region/g" check.sh && green "当前设置WARP默认随机分配的国家区域: $g4 ")
readp "已是奈飞IP时，重新检测间隔时间（回车默认45秒）,请输入间隔时间（例：50秒，输入50）:" stop
[[ -n $stop ]] && sed -i "s/45s/${stop}s/g" check.sh || green "默认45秒"
readp "非奈飞IP时，继续检测间隔时间（回车默认30秒）,请输入间隔时间（例：50秒，输入50）:" goon
[[ -n $goon ]] && sed -i "s/30s/${goon}s/g" check.sh || green "默认30秒"
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
green "设置screen窗口名称'aw'，离线后台自动刷奈飞IP" && sleep 2
grep -qE "^ *@reboot root screen -dmS aw bash -c '/bin/bash /root/check.sh' >/dev/null 2>&1" /etc/crontab || echo "@reboot root screen -dmS aw bash -c '/bin/bash /root/check.sh' >/dev/null 2>&1" >> /etc/crontab
green "添加VPS重启后自动刷奈飞IP功能，重启VPS后自动生效（目前不支持纯IPV6的VPS）"
back;;
2 )
[[ -e /root/check.sh ]] && yellow "经检测，你正在使用自动刷NF功能，请关闭后再启动刷区域IP功能" && REnfwarp
[[ ! $(type -P screen) ]] && yellow "检测到screen未安装，升级安装中" && $yumapt install screen
wget -N --no-check-certificate https://raw.githubusercontent.com/kkkyg/WARP-CR/main/WARP-CR.sh
readp "输入国家区域简称（例：新加坡，输入大写SG;美国，输入大写US）:" gj
[[ -n $gj ]] && sed -i "s/dd4/$gj/g" WARP-CR.sh || (sed -i "s/dd4/\$eg4/g" WARP-CR.sh && green "IPV4当前设置WARP默认分配的国家区域: $g4 ")
[[ -n $gj ]] && sed -i "s/dd6/$gj/g" WARP-CR.sh || (sed -i "s/dd6/\$eg6/g" WARP-CR.sh && green "IPV6当前设置WARP默认分配的国家区域: $g6 ")
[[ -n $gj ]] && sed -i "s/ddj/$gj/g" WARP-CR.sh || (sed -i "s/ddj/\$egj/g" WARP-CR.sh && green "Socks5当前设置WARP默认分配的国家区域: $s5gj ")
readp "已是指定IP区域，重新检测间隔时间（回车默认60秒）,请输入间隔时间（例：50秒，输入50）:" stop
[[ -n $stop ]] && sed -i "s/60s/${stop}s/g" WARP-CR.sh || green "默认60秒"
readp "非指定IP区域，重新检测间隔时间（回车默认30秒）,请输入间隔时间（例：50秒，输入50）:" goon
[[ -n $goon ]] && sed -i "s/30s/${goon}s/g" WARP-CR.sh || green "默认30秒"
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
green "设置screen窗口名称'cr'，离线后台自动刷WARP指定区域IP" && sleep 2
grep -qE "^ *@reboot root screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh' >/dev/null 2>&1" /etc/crontab || echo "@reboot root screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh' >/dev/null 2>&1" >> /etc/crontab
green "添加VPS重启后自动刷IP功能，重启VPS后自动生效（目前不支持纯IPV6的VPS）";;
3 )
sed -i '/check.sh/d' /etc/crontab >/dev/null 2>&1 ; sed -i '/WARP-CR.sh/d' /etc/crontab >/dev/null 2>&1
green "卸载完成";;
0 ) REnfwarp
esac
}

REnfwarp(){
ab="1.在线前台临时刷奈飞NF\n2.离线后台+重启VPS自动刷奈飞NF及WARP区域\n3.screen管理设置\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in
1 ) ReIP;;
2 ) Rewarp;;
3 ) bash <(curl -sSL https://cdn.jsdelivr.net/gh/kkkyg/screen-script/screen.sh) && back;;
0 ) bash CFwarp.sh
esac
}

WARPonoff(){
ab="1.开启或者关闭Wgcf-WARP(+)\n2.开启或关闭Socks5-WARP(+)\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in  
1 )
[[ ! $(type -P wg-quick) ]] && red "WARP(+)未安装，无法启动或关闭，建议重新安装WARP(+)" && bash CFwarp.sh
checkwgcf
if [[ $wgcfv4 =~ on|plus || $wgcfv6 =~ on|plus ]]; then
yellow "当前WARP(+)：已运行中状态，现执行:临时关闭……"
wg-quick down wgcf >/dev/null 2>&1
systemctl disable wg-quick@wgcf >/dev/null 2>&1
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
checkwgcf
[[ $wgcfv6 = off || $wgcfv4 = off ]] && green "关闭WARP(+)成功" || red "关闭WARP(+)失败"
elif [[ $wgcfv6 = off || $wgcfv4 = off ]]; then
yellow "当前WARP(+)：临时关闭状态，现执行:恢复运行……"
dns && systemctl enable wg-quick@wgcf >/dev/null 2>&1
CheckWARP
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
fi
ShowWGCF && WGCFmenu && back;;
2 )
[[ ! $(type -P warp-cli) ]] && red "WARP(+)未安装，无法启动或关闭，建议重新安装WARP(+)" && bash CFwarp.sh
if [[ $(warp-cli --accept-tos status) =~ 'Connected' ]]; then
yellow "当前WARP(+)：已开启状态，现执行：临时关闭……" && sleep 1
warp-cli --accept-tos disable-always-on >/dev/null 2>&1
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
[[ $(warp-cli --accept-tos status) =~ 'Disconnected' ]] && green "临时关闭WARP(+)成功" || red "临时关闭WARP(+)失败"
elif [[ $(warp-cli --accept-tos status) =~ 'Disconnected' ]]; then
yellow "当前WARP(+)：临时关闭状态，现执行：恢复运行……" && sleep 1
warp-cli --accept-tos enable-always-on >/dev/null 2>&1
[[ -e /root/check.sh ]] && screen -S aw -X quit ; screen -dmS aw bash -c '/bin/bash /root/check.sh'
[[ -e /root/WARP-CR.sh ]] && screen -S cr -X quit ; screen -dmS cr bash -c '/bin/bash /root/WARP-CR.sh'
fi
ShowSOCKS5 && S5menu && back;;
0 ) WARPOC
esac
}

WARPun(){
cwg(){
wg-quick down wgcf >/dev/null 2>&1
systemctl disable wg-quick@wgcf >/dev/null 2>&1
$yumapt autoremove wireguard-tools
[[ -n $(grep 8.8.8.8 /etc/resolv.conf) && -e /root/resolv.conf ]] && cat /root/resolv.conf > /etc/resolv.conf
}
cso(){
warp-cli --accept-tos disconnect >/dev/null 2>&1
warp-cli --accept-tos disable-always-on >/dev/null 2>&1
warp-cli --accept-tos delete >/dev/null 2>&1
[[ $release = Centos ]] && (yum autoremove cloudflare-warp -y) || (apt purge cloudflare-warp -y && rm -f /etc/apt/sources.list.d/cloudflare-client.list)
}
wj="rm -rf /usr/local/bin/wgcf /etc/wireguard/wgcf.conf /etc/wireguard/wgcf-profile.conf /etc/wireguard/wgcf-account.toml /etc/wireguard/wgcf+p.log /etc/wireguard/ID /usr/bin/wireguard-go wgcf-account.toml wgcf-profile.conf resolv.conf"
ab="1.仅卸载Wgcf-WARP(+)\n2.仅卸载Socks5-WARP(+)\n3.彻底卸载并清除所有WARP及脚本文件\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in     
1 ) [[ $(type -P wg-quick) ]] && (cwg ; $wj ; sed -i '/check.sh/d' /etc/crontab >/dev/null 2>&1 ; sed -i '/WARP-CR.sh/d' /etc/crontab >/dev/null 2>&1 ; green "Wgcf-WARP(+)卸载完成" && ShowWGCF && WGCFmenu && back) || (yellow "并未安装Wgcf-WARP(+)，无法卸载" && bash CFwarp.sh);;
2 ) [[ $(type -P warp-cli) ]] && (cso ; green "Socks5-WARP(+)卸载完成" && ShowSOCKS5 && S5menu && back) || (yellow "并未安装Socks5-WARP(+)，无法卸载" && bash CFwarp.sh);;
3 ) [[ ! $(type -P wg-quick) && ! $(type -P warp-cli) ]] && (red "并没有安装任何的WARP功能，无法卸载" && CFwarp.sh) || (cwg ; cso ; $wj ; rm -rf CFwarp.sh check.sh WARP-CR.sh ; sed -i '/check.sh/d' /etc/crontab >/dev/null 2>&1 ; sed -i '/WARP-CR.sh/d' /etc/crontab >/dev/null 2>&1 ; green "WARP已全部卸载完成" && ShowSOCKS5 && ShowWGCF && WGCFmenu && S5menu && back);;
0 ) WARPOC
esac
}

WARPOC(){
ab="1.停止与启用WARP(+)功能\n2.卸载WARP(+)功能\n0.返回上一层\n 请选择："
readp "$ab" cd
case "$cd" in
1 ) WARPonoff;;
2 ) WARPun;;
0 ) bash CFwarp.sh
esac
}

start_menu(){
ShowWGCF;ShowSOCKS5
clear
red "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
bblue " WARP-WGCF/SOCKS5安装脚本：2022.2.4更新 Beta 4 版本"
yellow " 详细说明 https://github.com/lwd-temp/warp  YouTube频道：甬哥侃侃侃"    
yellow " 切记：进入脚本快捷方式 bash CFwarp.sh "
white " =================二、WARP功能选择（更新中）============================================="
yellow " 选项（1、2、3）为安装WARP三个配置方案，可随意切换安装。选项（5）与选项（2、3、4）在特定情况下可共存"
green "  1. 安装Wgcf-WARP:虚拟IPV4"      
green "  2. 安装Wgcf-WARP:虚拟IPV6"      
green "  3. 安装Wgcf-WARP:虚拟IPV4+IPV6" 
[[ $cpu != AMD64 ]] && red "4. 提示：当前VPS的CPU并非AMD64架构，目前不支持安装Socks5-WARP(+)" || green "  4. 安装Socks5-WARP：IPV4本地Socks5代理"
white " -------------------------------------------------------------------------------------------"    
green "  5. WARP账户升级：WARP+账户与WARP+Teams账户"
green "  6. WARPR解锁NF奈飞：自动识别WARP配置环境" 
green "  7. WARP开启、停止、卸载"
green "  0. 退出脚本 "
red "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
white " VPS系统信息如下："
white " VPS操作系统: $(blue "$op") \c" && white " 内核版本: $(blue "$version") \c" && white " CPU架构 : $(blue "$cpu") \c" && white " 虚拟化类型: $(blue "$vi") \c" && white " TCP算法: $(blue "$bbr")"
IP_Status_menu
echo
readp "请输入数字:" Input
case "$Input" in     
 1 ) WGCFv4;;
 2 ) WGCFv6;;
 3 ) WGCFv4v6;;
 4 ) [[ $cpu = AMD64 ]] && SOCKS5ins || bash CFwarp.sh;; 
 5 ) WARPupre;;
 6 ) REnfwarp;;	
 7 ) WARPOC;;
 0 ) exit 0
esac
}
start_menu "first"
