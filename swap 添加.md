# swap
输入执行这个命令，即可看到你的VPS当前磁盘大小和使用情况：

df -m

我们可以先查看一下当前的SWAP大小（单位 MB）。

free -m

 bs=1024 B=1 KB，512000 * 1 KB=512000 KB / 1024 ≈ 512 MB （为了直观的看，就按1000来算了 :lol: ）

dd if=/dev/zero of=/var/swapfile1 bs=1024 count=512000

查看文件是否创建成功，大小是否正确(因为按1000计算，所以会不足 512MB)

du -ah /var|grep "swapfile1"

mkswap /var/swapfile1

swapon /var/swapfile1


swapon -s
free -m


机启动加载

echo "/var/swapfile1 swap swap defaults 0 0" >> /etc/fstab


取消 SWAP文件

swapoff /var/swapfile1

取消 开机启动加载

sed -i "/swapfile1/d" /etc/fstab

删除 SWAP文件

rm -rf /var/swapfile1

```
https://github.com/zhucaidan/swap.sh
wget https://raw.githubusercontent.com/zhucaidan/swap.sh/main/swap.sh && bash swap.sh
```
