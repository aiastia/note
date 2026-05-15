---
title: Google Colab 常用命令与技巧
date: 2022-03-02
categories:
  - 工具使用
tags:
  - colab
  - google
  - python
  - 文件处理
---

# Google Colab 常用命令与技巧

> 整合自 [#65](https://github.com/aiastia/note/issues/65)、[#71](https://github.com/aiastia/note/issues/71)

## 挂载 Google 云盘

```python
from google.colab import drive
drive.mount('/content/drive')
```

挂载后文件路径为 `/content/drive/MyDrive/`（个人盘）或 `/content/drive/Shareddrives/`（共享盘）。

## 文件与目录操作

### 统计文件数量

```bash
# 当前目录文件数
ls -l | grep "^-" | wc -l

# 递归统计所有文件数
ls -lR | grep "^-" | wc -l
```

### 批量移动文件

```bash
# 移动前 N 个文件到目标目录
ls -Q /content/drive/Shareddrives/源目录 | head -800 | xargs -i mv "/content/drive/Shareddrives/源目录/{}" /content/drive/Shareddrives/目标目录/
```

### 文件切割

```bash
# 按大小切割文件（每个 20MB）
split -b 20m log.txt log_part_
```

## 7z 批量解压

```bash
%cd "/content/drive/Shareddrives/目录路径"
!for i in *.7z; do 7z x -p密码 "$i"; done
```

### 示例

```bash
%cd "/content/drive/Shareddrives/zip/压缩包目录/"
!for i in *.7z; do 7z x -p1346 "$i"; done
```

## 文件编码转换

### 检查文件编码

```bash
enca -L zh_CN file.txt
```

### 单文件转换

```bash
enca -L zh_CN -x UTF-8 file.txt
```

### 批量转换

```bash
# 当前目录所有文件
enca -L zh_CN -x utf-8 *

# 递归批量转换
find -type f | xargs enca -L zh_CN -x UTF-8

# 指定文件类型
find -type f -name "*.txt" | xargs -i enca -L zh_CN -x UTF-8 "{}"
```

## TXT 合并（带书名标记）

```bash
a=0
cd 目录名
for i in *.txt
do
    echo $i
    a=$(($a + 1))
    echo "第$a 本书:" >> ../合并结果.txt
    echo ${i%*${i:(-4)}} >> ../合并结果.txt
    cat "$i" | iconv -f GBK -t UTF-8 >> ../合并结果.txt
    echo " " >> ../合并结果.txt
done
```

### 自动检测编码并合并

```bash
a=0
cd 目录名
find -type f -name "*.txt" -print0 | while read -d $'\0' i; do
    echo "$i"
    a=$(($a + 1))
    echo "第$a 本书:" >> ../合并结果.txt
    echo ${i%*${i:(-4)}} >> ../合并结果.txt
    f=`enca -L zh_CN "$i" | cut -d ';' -f 2`
    if [[ $f == *GB* ]]; then h="GB18030"
    elif [[ $f == *UTF* ]]; then h="UTF-8"
    else h="UTF-16"; fi
    cat "$i" | iconv -f $h -t UTF-8 >> ../合并结果.txt
    echo " " >> ../合并结果.txt
done
```

## Python 速算

```python
url = 1
print(1 + url)  # 输出: 2
```

## Ubuntu 修改 IP（netplan）

配置文件位于 `/etc/netplan/`。

### DHCP 模式

```yaml
network:
  ethernets:
    ens18:
      dhcp4: true
  version: 2
```

### 静态 IP 模式

```yaml
network:
  ethernets:
    ens18:
      dhcp4: false
      addresses:
        - 192.168.0.213/24
      routes:
        - to: default
          via: 192.168.0.31
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4, 192.168.0.31]
    version: 2
```

应用配置：

```bash
sudo netplan apply
```

## 参考资料

- [Colab 7z 解压示例](https://colab.research.google.com/drive/1j2eRCfNc2hUseFqQFhvevhbbfHXhaqRV)
- [Linux 文件编码批量转换 - enca](https://www.cnblogs.com/cxt-janson/p/10769009.html)
