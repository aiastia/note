---
title: SQLite 常用查询语句速查
date: 2026-03-28
categories:
  - 数据库
tags:
  - SQLite
  - SQL
  - 数据库
  - 速查
---

# SQLite 常用查询语句速查

日常使用 SQLite 时最常用的查询语句，按场景分类整理。

## 基础查询

### 查询所有数据

```sql
SELECT * FROM table_name;
```

### 查询指定列

```sql
SELECT name, age, email FROM users;
```

### 限制结果数量

```sql
SELECT * FROM users LIMIT 10;
```

### 去重查询

```sql
SELECT DISTINCT column_name FROM table_name;
```

## 条件查询

### 基本条件

```sql
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE name = '张三';
```

### 多条件组合

```sql
-- AND：同时满足
SELECT * FROM users WHERE age > 18 AND city = '北京';

-- OR：满足其一
SELECT * FROM users WHERE city = '北京' OR city = '上海';

-- NOT：排除
SELECT * FROM users WHERE NOT city = '北京';
```

### 模糊查询

```sql
-- 包含关键词
SELECT * FROM users WHERE name LIKE '%张%';

-- 以指定内容开头
SELECT * FROM users WHERE name LIKE '张%';

-- 以指定内容结尾
SELECT * FROM users WHERE name LIKE '%三';
```

### 范围查询

```sql
-- 数值范围
SELECT * FROM users WHERE age BETWEEN 18 AND 30;

-- 日期范围
SELECT * FROM orders WHERE created_at BETWEEN '2026-01-01' AND '2026-03-31';

-- IN 查询
SELECT * FROM users WHERE city IN ('北京', '上海', '广州');
```

### 空值判断

```sql
-- 查询为空的记录
SELECT * FROM users WHERE email IS NULL;

-- 查询不为空的记录
SELECT * FROM users WHERE email IS NOT NULL;

-- 同时排除空字符串和 NULL
SELECT * FROM users WHERE email IS NOT NULL AND email != '';
```

## 排序与分页

### 排序

```sql
-- 升序（默认）
SELECT * FROM users ORDER BY age ASC;

-- 降序
SELECT * FROM users ORDER BY age DESC;

-- 多字段排序
SELECT * FROM users ORDER BY city ASC, age DESC;
```

### 分页

```sql
-- 跳过前 10 条，取 10 条（第 2 页，每页 10 条）
SELECT * FROM users LIMIT 10 OFFSET 10;

-- 简写形式
SELECT * FROM users LIMIT 10, 10;
```

## 聚合与分组

### 聚合函数

```sql
-- 总数
SELECT COUNT(*) FROM users;

-- 某列非空数量
SELECT COUNT(email) FROM users;

-- 求和
SELECT SUM(amount) FROM orders;

-- 平均值
SELECT AVG(age) FROM users;

-- 最大值 / 最小值
SELECT MAX(age), MIN(age) FROM users;
```

### 分组统计

```sql
-- 按城市统计人数
SELECT city, COUNT(*) as count FROM users GROUP BY city;

-- 按多个字段分组
SELECT city, gender, COUNT(*) as count FROM users GROUP BY city, gender;

-- 分组后筛选（HAVING）
SELECT city, COUNT(*) as count FROM users GROUP BY city HAVING count > 10;
```

## 多表查询

### 内连接（INNER JOIN）

```sql
SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

### 左连接（LEFT JOIN）

```sql
-- 即使没有订单也会显示所有用户
SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

### 子查询

```sql
-- 查询订单金额高于平均值的用户
SELECT name FROM users
WHERE id IN (
  SELECT user_id FROM orders WHERE amount > (SELECT AVG(amount) FROM orders)
);
```

## 数据操作

### 插入数据

```sql
-- 插入单条
INSERT INTO users (name, age, city) VALUES ('张三', 25, '北京');

-- 插入多条
INSERT INTO users (name, age, city) VALUES
  ('张三', 25, '北京'),
  ('李四', 30, '上海'),
  ('王五', 28, '广州');
```

### 更新数据

```sql
-- 更新指定记录
UPDATE users SET city = '深圳' WHERE name = '张三';

-- 更新多个字段
UPDATE users SET age = 26, city = '深圳' WHERE name = '张三';
```

### 删除数据

```sql
-- 删除指定记录
DELETE FROM users WHERE name = '张三';

-- 删除所有记录（保留表结构）
DELETE FROM users;
```

## 表操作

### 查看表结构

```sql
-- 查看建表语句
.schema table_name

-- 查看所有表
.tables

-- 查看表信息
PRAGMA table_info(table_name);
```

### 创建表

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 0,
  email TEXT UNIQUE,
  city TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);
```

### 修改表

```sql
-- 添加列
ALTER TABLE users ADD COLUMN phone TEXT;

-- 重命名表
ALTER TABLE users RENAME TO members;
```

### 删除表

```sql
DROP TABLE IF EXISTS users;
```

## 常用函数

### 字符串函数

```sql
-- 拼接
SELECT first_name || ' ' || last_name AS full_name FROM users;

-- 长度
SELECT name, LENGTH(name) FROM users;

-- 大小写转换
SELECT UPPER(name), LOWER(name) FROM users;

-- 截取子串
SELECT SUBSTR(name, 1, 3) FROM users;

-- 替换
SELECT REPLACE(name, '张', '王') FROM users;
```

### 日期函数

```sql
-- 当前日期时间
SELECT datetime('now', 'localtime');

-- 当前日期
SELECT date('now', 'localtime');

-- 日期计算
SELECT date('now', '+7 days');           -- 7 天后
SELECT date('now', '-1 month');          -- 1 个月前
SELECT date('now', 'start of month');    -- 本月第一天

-- 格式化日期
SELECT strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime');

-- 计算时间差
SELECT julianday('now') - julianday('2026-01-01') AS days_passed;
```

### 条件函数

```sql
-- CASE WHEN
SELECT name,
  CASE
    WHEN age < 18 THEN '未成年'
    WHEN age < 30 THEN '青年'
    WHEN age < 50 THEN '中年'
    ELSE '老年'
  END AS age_group
FROM users;

-- IFNULL / COALESCE
SELECT name, IFNULL(email, '未填写') FROM users;
SELECT name, COALESCE(phone, email, '无联系方式') FROM users;
```

## 实用技巧

### 导出查询结果

```bash
# 命令行导出为 CSV
sqlite3 -header -csv database.db "SELECT * FROM users;" > users.csv

# 导出为 JSON（需要 jq）
sqlite3 database.db "SELECT json_group_array(json_object('name', name, 'age', age)) FROM users;"
```

### 批量操作

```sql
-- 批量更新基于另一张表
UPDATE users SET city = (
  SELECT city FROM user_backup WHERE user_backup.id = users.id
);
```

### 性能优化

```sql
-- 查看查询计划
EXPLAIN QUERY PLAN SELECT * FROM users WHERE name = '张三';

-- 创建索引
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_city_age ON users(city, age);

-- 查看已有索引
SELECT name FROM sqlite_master WHERE type = 'index';
```

## 配合 Docker 使用

推荐使用 [sqlite-web](https://github.com/coleifer/sqlite-web) 提供 Web 界面管理：

```yaml
services:
  sqlite-web:
    image: coleifer/sqlite-web
    container_name: sqlite-web
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /path/to/data:/data
    environment:
      - SQLITE_DATABASE=your_database.db
```

启动后浏览器访问 `http://IP:8080`，可以直接在页面上执行 SQL 语句、浏览数据。
