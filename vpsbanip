# vpsbanip

在设置中国时区使用亚洲/上海（+8）

cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

vps 禁止密码登陆 
用 cat /var/log/auth.log命令查看

centos对应cat /var/log/secure

找了两条防暴力破解的命令

    iptables -I INPUT -p tcp --dport 22 -i eth0 -m state --state NEW -m recent --set


    iptables -I INPUT -p tcp --dport 22 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP


第一句是说，对于外来数据，如果是 TCP 协议，目标端口号是 22，网络接口是 eth0，状态是新连接，那么把它加到最近列表中。
第二句是说，对于这样的连接，如果在最近列表中，并且在 60 秒内达到或者超过四次，那么丢弃该数据。其中的-m是模块的意思。
也就是说，如果有人从一个 IP 一分钟内连接尝试四次 ssh 登录的话，那么它就会被加入黑名单，后续连接将会被丢弃。




SSH服务的配置文件位于/etc/ssh/sshd_config，我们的安全设置都是围绕此文件展开，所以修改前最好先备份一次，以免出现无法登陆的情况。



修改完不要忘了执行
service sshd restart


III. 禁止ROOT用户登陆

# vim /etc/ssh/sshd_config
PermitRootLogin no


IV. 限制其他用户登陆

# vim /etc/ssh/sshd_config 
AllowUsers fsmythe bnice swilson
DenyUsers jhacker joebadguy jripper

V. 使用 Chroot SSHD 将 SFTP 用户局限于其自己的主目录：


# vim /etc/ssh/sshd_config 
ChrootDirectory /home/%u
X11Forwarding no
AllowTcpForwarding no


VI. 登陆IP限制

# vim /etc/hosts.deny
ALL: 192.168.200.09     # 希望禁止的IP


VII. 禁止空密码登陆

# vim /etc/ssh/sshd_config
PermitEmptyPasswords no


VIII. 禁用基于主机的身份验证

# vim /etc/ssh/sshd_config
HostbasedAuthentication no

XI. 指纹登陆

生成4096位密钥

ssh-keygen -t rsa -b 4096
将公钥拷贝至服务器对应用户的.ssh下，重命名为authorized_keys

scp -P xxxxx ~/.ssh/id_rsa.pub server:/root/.ssh/authorized_keys
如果已经存在authorized_keys，需要将公钥追加至authorized_keys

scp -P xxxxx ~/.ssh/id_rsa.pub server:/root/.ssh/tmp.pub

# 在服务器端执行

cat /root/.ssh/tmp.pub >> /root/.ssh/authorized_keys


XII. 禁止使用密码登陆

# vim /etc/ssh/sshd_config
PasswordAuthentication no


XIII. 报错

WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!

删除~/.ssh/known_hosts文件

rm ~/.ssh/known_hosts



XIV. 检查登录日志

如果你的服务器一直很正常，那也可能不正常的表现，最好的办法就是定期查询ssh的登录日志，手动发现系统的异常！

# vim /etc/ssh/sshd_config
# add
LogLevel DEBUG

# 查看最近100条登录日志
tail -100 /var/log/secure

# 登录成功日志
who /var/log/wtmp

last

