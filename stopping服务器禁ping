# stopping
1、通过修改配置文件

这个方法需要ROOT权限，且设置成功后别人无法Ping本机，本机也无法Ping他人，可能会带来一点麻烦。

(1)直接修改/proc/sys/net/ipv4/icmp_echo_ignore_all 文件（这个文件默认是只读的）
该文件只有一个数值：
将该值改“1”后为开启（运行）禁止PING
将该值改“0”后为关闭（停止）禁止PING

(2)直接输入命令行设置（这个方法需要ROOT权限）
直接在命令行输入以下指令
运行：禁止Ping


    echo 1 > /proc/sys/net/ipv4/icmp_echo_igore_all
停止：禁止Ping


    echo 0 > /proc/sys/net/ipv4/icmp_echo_igore_all

附：设置开机自动禁止Ping方法
想开机后立即禁止ping响应，将运行语句添加到/etc/rc.d/rc.local即可。
2、使用iptables限制（推荐）
这个方法在OpenVZ下VPS、也在虚拟机中测试通过，禁止他人Ping本机的同时，本机也可以Ping他人。

(1)设置方法很简单，在SSH中输入以下命令，回车后直接生效无需重启iptables。

    iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP

以上操作是利用iptables丢弃掉来自外网请求的ICMP包，达到禁Ping的效果。反之请看下面。

(2)解除设置方法（即删除本规则）


    iptables -D INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
