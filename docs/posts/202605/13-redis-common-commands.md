---
title: Redis 常用命令速查
date: 2026-05-13
categories:
  - Redis
tags:
  - Redis
  - 数据库
  - 速查
---

## 前言

最近在项目中用到了 Redis，整理一份常用命令速查表，方便随时翻阅。Redis 是一个基于内存的键值存储，支持多种数据结构，广泛用于缓存、消息队列、会话管理等场景。

## 连接与基本操作

```bash
# 连接 Redis
redis-cli
redis-cli -h 127.0.0.1 -p 6379 -a your_password

# 测试连接
PING
# => PONG

# 查看服务信息
INFO
INFO memory
INFO stats

# 切换数据库（0-15，共 16 个）
SELECT 1

# 查看当前数据库 key 数量
DBSIZE

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL
```

## Key 通用操作

```bash
# 查看所有 key（生产慎用）
KEYS *

# 按模式查找
KEYS user:*

# 判断 key 是否存在
EXISTS mykey

# 查看 key 的类型
TYPE mykey

# 删除 key
DEL mykey
DEL key1 key2

# 设置过期时间（秒）
EXPIRE mykey 60

# 设置过期时间（毫秒）
PEXPIRE mykey 60000

# 查看剩余过期时间（秒，-1 表示永不过期，-2 表示已过期）
TTL mykey

# 移除过期时间，变为永久 key
PERSIST mykey

# 重命名 key
RENAME oldkey newkey
```

## String 字符串

最基础的数据类型，可以存字符串、数字、JSON 等。

```bash
# 设置值
SET name "hello"
SET name "hello" EX 60        # 带 60 秒过期
SETNX name "hello"            # 仅当 key 不存在时设置
SET name "hello" XX           # 仅当 key 存在时设置

# 获取值
GET name

# 批量设置/获取
MSET key1 "v1" key2 "v2"
MGET key1 key2

# 追加字符串
APPEND name " world"

# 获取字符串长度
STRLEN name

# 数字操作（值为整数时）
SET counter 0
INCR counter          # +1
INCRBY counter 10     # +10
DECR counter          # -1
DECRBY counter 5      # -5
INCRBYFLOAT price 2.5 # 浮点数 +2.5
```

## Hash 哈希

适合存储对象，类似字典/结构体。

```bash
# 设置/获取字段
HSET user:1 name "Tom" age 25
HGET user:1 name

# 批量设置/获取
HMSET user:2 name "Jerry" age 30
HMGET user:2 name age

# 获取所有字段和值
HGETALL user:1

# 获取所有字段名
HKEYS user:1

# 获取所有字段值
HVALS user:1

# 判断字段是否存在
HEXISTS user:1 name

# 删除字段
HDEL user:1 age

# 字段数字增减
HINCRBY user:1 age 1

# 获取字段数量
HLEN user:1
```

## List 列表

有序可重复，常用于消息队列、最新列表。

```bash
# 从左/右推入
LPUSH messages "msg3"
LPUSH messages "msg2" "msg1"
RPUSH messages "msg4"

# 从左/右弹出
LPOP messages
RPOP messages

# 获取列表长度
LLEN messages

# 按索引范围获取（不会删除）
LRANGE messages 0 -1    # 获取全部
LRANGE messages 0 4     # 前 5 个

# 按索引获取单个元素
LINDEX messages 0

# 按索引设置值
LSET messages 0 "updated"

# 裁剪列表，只保留指定范围
LTRIM messages 0 99     # 只保留前 100 个

# 阻塞弹出（用于消息队列）
BLPOP queue:tasks 30    # 30 秒超时
BRPOP queue:tasks 0     # 无限等待
```

## Set 集合

无序不重复，适合去重、标签、共同好友等。

```bash
# 添加成员
SADD tags "redis" "database" "cache"

# 获取所有成员
SMEMBERS tags

# 判断成员是否存在
SISMEMBER tags "redis"

# 获取成员数量
SCARD tags

# 删除成员
SREM tags "cache"

# 随机获取成员
SRANDMEMBER tags 2       # 随机取 2 个，不删除

# 随机弹出成员
SPOP tags

# 集合运算
SADD set:a 1 2 3
SADD set:b 2 3 4
SINTER set:a set:b      # 交集：2 3
SUNION set:a set:b      # 并集：1 2 3 4
SDIFF set:a set:b       # 差集：1
```

## Sorted Set 有序集合

有序不重复，每个成员关联一个分数（score），适合排行榜、延时队列。

```bash
# 添加成员（带分数）
ZADD leaderboard 100 "Alice" 200 "Bob" 150 "Charlie"

# 获取成员分数
ZSCORE leaderboard "Alice"

# 按分数范围获取（升序）
ZRANGE leaderboard 0 -1 WITHSCORES

# 按分数范围获取（降序）
ZREVRANGE leaderboard 0 -1 WITHSCORES

# 按分数区间获取
ZRANGEBYSCORE leaderboard 100 200 WITHSCORES

# 获取排名（升序，从 0 开始）
ZRANK leaderboard "Alice"

# 获取排名（降序）
ZREVRANK leaderboard "Alice"

# 增减分数
ZINCRBY leaderboard 50 "Alice"

# 获取成员数量
ZCARD leaderboard

# 统计分数区间内的成员数
ZCOUNT leaderboard 100 200

# 删除成员
ZREM leaderboard "Charlie"

# 按排名范围删除
ZREMRANGEBYRANK leaderboard 0 2

# 按分数范围删除
ZREMRANGEBYSCORE leaderboard 0 99
```

## 发布订阅（Pub/Sub）

简单的消息广播机制。

```bash
# 订阅频道
SUBSCRIBE channel:news

# 订阅多个频道
SUBSCRIBE channel:news channel:alerts

# 按模式订阅
PSUBSCRIBE channel:*

# 发布消息
PUBLISH channel:news "Hello World"

# 退订
UNSUBSCRIBE channel:news
```

## 查看具体内容

`KEYS *` 只返回 key 名，要看具体内容需要两步：

### 1. 先看类型

```bash
TYPE mykey
```

### 2. 根据类型取值

```bash
# string
GET mykey

# hash
HGETALL mykey

# list
LRANGE mykey 0 -1

# set
SMEMBERS mykey

# sorted set
ZRANGE mykey 0 -1 WITHSCORES
```

> `TYPE` 不支持通配符，只能查单个 key。要批量查类型可以用：

```bash
redis-cli KEYS "sit*" | xargs -I {} sh -c 'echo "=== {} ===" && redis-cli TYPE "{}"'
```

### 示例

先写入测试数据：

```bash
SET site:name "我的博客"
SET site:count 1024
HSET user:1 name "西米露" role "admin" level 5
LPUSH logs "第三次登录" "第二次登录" "第一次登录"
SADD tags "Redis" "Docker" "Linux"
ZADD score:rank 100 "Alice" 200 "Bob" 150 "Charlie"
```

查看所有 key：

```bash
KEYS *
# => site:name, site:count, user:1, logs, tags, score:rank
```

逐个查看：

```bash
TYPE site:name       # => string
GET site:name        # => "我的博客"

TYPE user:1          # => hash
HGETALL user:1       # => name:"西米露" role:"admin" level:"5"

TYPE logs            # => list
LRANGE logs 0 -1     # => "第一次登录" "第二次登录" "第三次登录"

TYPE tags            # => set
SMEMBERS tags        # => "Redis" "Docker" "Linux"

TYPE score:rank      # => zset
ZRANGE score:rank 0 -1 WITHSCORES  # => Alice:100 Charlie:150 Bob:200
```

## 实用技巧

### 批量删除匹配的 Key

```bash
# 方法一：xargs
redis-cli KEYS "temp:*" | xargs redis-cli DEL

# 方法二：使用 SCAN（生产推荐，不会阻塞）
redis-cli --scan --pattern "temp:*" | xargs redis-cli DEL
```

### SCAN 增量遍历

`KEYS *` 会阻塞，生产环境用 SCAN 代替：

```bash
SCAN 0 MATCH user:* COUNT 100
# 返回下一个游标和匹配的 key，游标为 0 表示遍历结束
```

### 查看内存占用

```bash
# 查看 key 占用的内存
MEMORY USAGE mykey

# 查看整体内存
INFO memory
```

### 慢查询日志

```bash
# 获取慢查询
SLOWLOG GET 10

# 查看慢查询配置
CONFIG GET slowlog-log-slower-than
```

## 小结

Redis 的命令很多，但常用的就这些。建议按数据类型来记，实际用到的时候再查具体参数。生产环境注意几点：

- 不要用 `KEYS *`，用 `SCAN` 代替
- 给 key 设置合理的过期时间
- 大 key 要拆分，避免阻塞
- 开启持久化（RDB/AOF）防止数据丢失
