---
title: 腾讯云/阿里云 监控组件卸载
date: 2025-01-20
categories:
  - 云服务器
tags:
  - 腾讯云
  - 阿里云
  - 监控卸载
  - agent
---

# 腾讯云/阿里云 监控组件卸载

## 腾讯云

### 卸载监控组件

```bash
/usr/local/qcloud/stargate/admin/uninstall.sh
/usr/local/qcloud/YunJing/uninst.sh
/usr/local/qcloud/monitor/barad/admin/uninstall.sh
```

### 卸载 TAT 自动化助手

```bash
systemctl stop tat_agent
systemctl disable tat_agent
rm -f /etc/systemd/system/tat_agent.service
```

### 清理残留（谨慎可选）

```bash
rm -fr /usr/local/qcloud
```

### 检查 agent 进程

```bash
ps -A | grep agent
```

---

## 阿里云

### 卸载云监控插件

```bash
# 停止
bash /usr/local/cloudmonitor/cloudmonitorCtl.sh stop

# 卸载
bash /usr/local/cloudmonitor/cloudmonitorCtl.sh uninstall

# 删除目录
rm -rf /usr/local/cloudmonitor
```

### 卸载安骑士（安盾）

```bash
wget http://update.aegis.aliyun.com/download/uninstall.sh && chmod +x uninstall.sh && ./uninstall.sh
```

### 卸载云助手

```bash
wget http://update.aegis.aliyun.com/download/quartz_uninstall.sh && chmod +x quartz_uninstall.sh && ./quartz_uninstall.sh
```

### 检查阿里云残留进程

```bash
ps -aux | grep -E 'aliyun|AliYunDun'
```

::: warning 注意
卸载监控组件后，云平台控制台将无法获取服务器运行数据，请确认是否需要保留监控功能。
:::
