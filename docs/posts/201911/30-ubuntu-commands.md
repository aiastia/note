---
title: Ubuntu 常用命令
date: 2019-11-30
categories:
  - Linux
tags:
  - Ubuntu
  - BBR
  - 运维
---

# Ubuntu 常用命令

日常使用 Ubuntu 系统时积累的常用命令和技巧，涵盖系统更新、网络配置、磁盘管理等方面。

## 系统更新与升级

```bash
# 更新软件源列表
sudo apt-get update

# 更新已安装的包
sudo apt-get upgrade -y

# 发行版升级
sudo apt-get dist-upgrade

# 重启系统
sudo reboot
```

## 查看内核版本

```bash
uname -r
```

## 开启 BBR 加速

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

::: warning 注意
如果先安装了 Docker 再安装 BBR，可能导致 Docker 无法启动。解决方法：

```bash
rm -rf /var/lib/docker/aufs
```
:::

## 升级内核

```bash
sudo apt list | grep linux-generic*
sudo apt-get install linux-generic-hwe-18.04-edge
sudo reboot
```

![内核升级](https://user-images.githubusercontent.com/19776350/111970476-48c07780-8b36-11eb-9120-545362940fab.png)

## 时区设置

```bash
sudo cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 或
sudo ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 或
sudo timedatectl set-timezone Asia/Shanghai
```

## 用户管理

```bash
adduser 用户名
service sshd restart
```

## 配置 SSH 密钥登录

```bash
wget https://raw.githubusercontent.com/aiastia/key/master/us.pub
mkdir -p ~/.ssh
mv ~/us.pub ~/.ssh/authorized_keys
```

## 更换软件源

```bash
wget -O /etc/apt/sources.list https://raw.githubusercontent.com/aiastia/note/master/sources.list
wget -O /etc/apt/sources.list https://raw.githubusercontent.com/aiastia/note/master/aws-sources.list
wget -O /etc/apt/sources.list https://raw.githubusercontent.com/aiastia/note/master/orc-sources.list
```

## APT 包管理

| 命令 | 说明 |
|------|------|
| `apt-get purge <pkg>` | 删除包（不保留配置） |
| `apt-get autoremove <pkg>` | 删除不需要的依赖 |
| `apt-get remove <pkg>` | 删除包（保留配置） |
| `apt-get autoclean` | 清理过期 deb |
| `apt-get clean` | 清理所有 deb |

### 彻底卸载

```bash
apt-get --purge remove <package>
apt-get autoremove <package>
dpkg -l | grep ^rc | awk '{print $2}' | sudo xargs dpkg -P
```

### 解决锁定文件

```bash
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock
```

## 网络相关

### 端口转发

```bash
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
service iptables save
```

### 临时 HTTP 文件服务器

```bash
python -m SimpleHTTPServer 8000
python3 -m http.server 8000
```

### 网络测速

```bash
sudo apt-get install iperf3
iperf3 -s          # 服务端
iperf3 -c 192.168.2.165  # 客户端
```

### 甲骨文云开放端口

```bash
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
iptables -F
apt-get purge netfilter-persistent
reboot
```

端口检测：[ping.pe](http://port.ping.pe/)

## IPv6 相关

### 优先使用 IPv4

```bash
sudo vi /etc/gai.conf
# 取消注释并修改：
# precedence ::ffff:0:0/96  100
```

### 禁用 IPv6

```bash
# 临时
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1

# 永久（写入 /etc/sysctl.conf）
net.ipv6.conf.all.disable_ipv6=1
net.ipv6.conf.default.disable_ipv6=1
net.ipv6.conf.lo.disable_ipv6=1
```

## 磁盘扩容

```bash
# 使用 cfdisk 扩容分区后，扩容文件系统
resize2fs -p /dev/sda2
```

## 系统信息

```bash
sudo apt install neofetch -y
neofetch
```

![neofetch](https://user-images.githubusercontent.com/19776350/187899578-846294fa-00ee-48cf-827b-9ba6ba14b8fb.jpeg)

## Ubuntu 安装微信

### 优麒麟版（简单）

下载安装：http://archive.ubuntukylin.com/software/pool/partner/weixin_2.1.4_amd64.deb

### Wine 安装 Windows 版微信/QQ

```bash
sudo dpkg --add-architecture i386
sudo add-apt-repository universe
sudo apt install -y wine cabextract exe-thumbnailer
sudo -E wget -O /usr/local/bin/winetricks-zh https://raw.fastgit.org/hillwoodroc/winetricks-zh/dev/winetricks-zh
sudo chmod +x /usr/local/bin/winetricks-zh
winetricks-zh wechat   # 安装微信
winetricks-zh qq       # 安装 QQ
```

独立容器安装：

```bash
env WINEPREFIX=~/.wine-qq winetricks-zh wechat
env WINEPREFIX=~/.wine-qq winetricks-zh qq
```

## 关闭 Ubuntu 22 重启提醒

```bash
sed -i "/#\$nrconf{restart} = 'i';/s/.*/\$nrconf{restart} = 'a';/" /etc/needrestart/needrestart.conf