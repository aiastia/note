---
title: 删除空文件夹
date: 2023-09-08
categories:
  - 工具使用
tags:
  - Python
  - Windows
  - 文件管理
---

# 删除空文件夹

递归扫描指定目录，自动删除所有空文件夹。提供 Python 和 BAT 两种实现方式。

## Python 实现

```python
import os

def remove_empty_folders(folder):
    # 遍历文件夹中的所有子文件夹和文件
    for root, dirs, files in os.walk(folder, topdown=False):
        # 删除空文件夹
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            if not os.listdir(dir_path):  # 检查文件夹是否为空
                try:
                    os.rmdir(dir_path)
                    print(f"已删除空文件夹：{dir_path}")
                except OSError as e:
                    print(f"删除文件夹时出错：{dir_path}, 错误信息：{e}")

# 获取当前文件夹路径
current_folder = os.getcwd()

# 调用函数清理空文件夹
remove_empty_folders(current_folder)
```

### 说明

- 使用 `os.walk` 以 `topdown=False` 自底向上遍历，确保先删除子目录再删除父目录
- `os.listdir()` 检查目录是否为空
- `os.rmdir()` 只能删除空目录，不会误删有内容的文件夹

## BAT 批处理实现

```bat
@echo off

setlocal

REM 设置当前文件夹路径
set "current_folder=%cd%"

REM 调用递归函数清理空文件夹
call :remove_empty_folders "%current_folder%"

endlocal
exit /b

:remove_empty_folders
REM 遍历文件夹中的所有子文件夹和文件
for /f "delims=" %%d in ('dir /ad /b /s "%~1"') do (
    REM 检查文件夹是否为空
    dir /a /b "%%d" | findstr "^" >nul
    if errorlevel 1 (
        REM 删除空文件夹
        rmdir "%%d"
        echo 已删除空文件夹："%%d"
    )
)
exit /b
```

## 使用方法

**Python 方式：**
将脚本保存为 `clean_empty.py`，放到目标目录下运行：

```bash
python clean_empty.py
```

**BAT 方式：**
将脚本保存为 `clean_empty.bat`，放到目标目录下双击运行即可。

## 注意事项

- 操作不可逆，建议先备份重要数据
- Python 版本的 `os.rmdir()` 只删除空目录，相对安全
- BAT 版本可能需要多次运行才能删除嵌套的空目录