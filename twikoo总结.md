# Twikoo 评论系统维护手册 (tianfei.chat)

## 1. 系统概览

本文档旨在为部署在 NotionNext 项目中的 Twikoo 评论系统提供一份全面的技术维护参考。

- **核心功能**: 为博客提供评论、审核与通知功能。
- **部署方式**: 后端服务通过 `systemd` 进行管理，运行一个全局安装的 `tkserver` Node.js 包。
- **运行用户**: `www`
- **监听端口**: `3001` (仅限本地 `127.0.0.1`)
- **前端访问**: 通过 Nginx 反向代理 `https://tianfei.chat/twikoo/` 到 `http://127.0.0.1:3001`。

---

## 2. 关键文件与目录清单

以下是维护、排错和备份时需要关注的核心文件和目录路径。

| 类别 | 路径 | 说明 |
| :--- | :--- | :--- |
| **服务配置文件** | `/etc/systemd/system/twikoo.service` | 定义了服务的启动命令、用户、环境变量和日志位置。 |
| **数据目录 (核心)** | `/www/wwwroot/twikoo/data` | **最重要**。存储所有评论数据。**必须定期备份**。 |
| **标准日志** | `/www/wwwroot/twikoo/logs/twikoo.log` | 记录常规运行日志。 |
| **错误日志** | `/www/wwwroot/twikoo/logs/twikoo-error.log` | **排错首选**。记录服务启动失败或运行时的错误信息。 |
| **工作目录** | `/www/wwwroot/twikoo` | 服务运行的根目录。 |
| **可执行命令** | `/usr/local/nodejs/bin/tkserver` | `systemd` 调用的启动命令，是全局 `tkserver` 包的入口。 |
| **Nginx 配置** | (宝塔面板网站配置中) | 反向代理 `location /twikoo/` 的具体配置。 |

---

## 3. 日常服务管理

使用 `systemctl` 命令管理 Twikoo 服务的生命周期。

- **查看服务状态**:
  ```bash
  systemctl status twikoo
  ```
  *(可快速查看服务是否 `active (running)`)*

- **启动服务**:
  ```bash
  systemctl start twikoo
  ```

- **停止服务**:
  ```bash
  systemctl stop twikoo
  ```

- **重启服务**:
  ```bash
  systemctl restart twikoo
  ```
  *(修改配置或更新后执行此命令)*

- **设置开机自启**:
  ```bash
  systemctl enable twikoo
  ```

- **实时查看日志**:
  ```bash
  # 实时查看错误日志
  tail -f /www/wwwroot/twikoo/logs/twikoo-error.log

  # 实时查看运行日志
  tail -f /www/wwwroot/twikoo/logs/twikoo.log
  ```

---

## 4. 备份与恢复

定期备份是防止数据丢失的最重要措施。

#### **备份步骤**

1.  登录服务器。
2.  执行以下命令将数据目录打包并以当前日期命名：
    ```bash
    cd /www/wwwroot/twikoo
    tar -czvf twikoo-backup-$(date +%Y-%m-%d).tar.gz data
    ```
3.  将生成的 `twikoo-backup-xxxx-xx-xx.tar.gz` 文件下载到本地或其他安全的存储位置。

#### **恢复步骤**

1.  将备份文件 `twikoo-backup-xxxx-xx-xx.tar.gz` 上传到服务器的 `/www/wwwroot/twikoo` 目录下。
2.  **停止 Twikoo 服务**:
    ```bash
    systemctl stop twikoo
    ```
3.  删除或重命名旧的数据目录（以防万一）：
    ```bash
    mv data data-old
    ```
4.  解压备份文件，恢复 `data` 目录：
    ```bash
    tar -xzvf twikoo-backup-xxxx-xx-xx.tar.gz
    ```
5.  **重启 Twikoo 服务**:
    ```bash
    systemctl start twikoo
    ```
6.  检查网站评论是否恢复正常。

---

## 5. 更新流程

Twikoo 后端 `tkserver` 的更新流程如下。

1.  **全局更新 `tkserver` 包**:
    ```bash
    npm install -g tkserver@latest
    ```
2.  **重启 Twikoo 服务使新版生效**:
    ```bash
    systemctl restart twikoo
    ```
3.  访问博客评论区，检查功能是否正常。

---

## 6. 配置管理

#### **后端配置 (Admin Panel)**

Twikoo 的绝大部分功能配置（如审核、邮件通知、垃圾评论过滤等）都在其 Web 管理面板中完成。

- **访问方式**:
  1.  在评论区点击**设置图标 (⚙️)** > **管理**。
  2.  输入管理员密码登录。

- **关键配置项**:
    - **评论审核**: 在“垃圾评论过滤”中，将 `AKISMET_KEY` 设为 `MANUAL_REVIEW`。
    - **邮件通知**: 在“邮件通知”中，配置 SMTP 服务器信息和授权码。具体配置如下：
        - `SENDER_EMAIL`: `[请手动填写您的126邮箱地址]`
        - `SENDER_NAME`: `tianfei.chat`
        - `SMTP_SERVICE`: `126`
        - `SMTP_USER`: `[请手动填写您的126邮箱地址]`
        - `SMTP_PASS`: `[请手动填写您的126邮箱授权码]`
        - `MAIL_SUBJECT`: `tianfei.chat 博客有新评论了`
        - `MAIL_TO`: `[请手动填写接收通知的邮箱]`

#### **前端配置 (NotionNext)**

- **文件路径**: `conf/comment.config.js`
- **关键配置**:
  ```javascript
  COMMENT_TWIKOO_ENV_ID: process.env.NEXT_PUBLIC_COMMENT_ENV_ID || 'https://tianfei.chat/twikoo/',
  ```
  确保此处的 URL 与 Nginx 反向代理的路径一致。

---

## 7. 故障排查 (Troubleshooting)

| 常见问题 | 排查步骤 |
| :--- | :--- |
| **评论区加载失败 / 502 Bad Gateway** | 1. `systemctl status twikoo` 检查服务是否运行。<br>2. 查看错误日志 `tail -n 100 /www/wwwroot/twikoo/logs/twikoo-error.log`，分析错误原因。 |
| **评论提交后不显示** | 1. 登录管理后台，检查评论是否处于“待审核”状态。<br>2. 检查浏览器开发者工具 (F12) 的网络请求，看是否有报错。 |
| **无法收到邮件通知** | 1. 在管理后台点击“测试”按钮，看是否成功。<br>2. 检查 SMTP 配置，特别是**授权码**是否正确且未过期。<br>3. 查看运行日志，可能有相关错误信息。 |
| **服务无法启动** | 1. `systemctl status twikoo` 查看简要状态。<br>2. `journalctl -u twikoo -n 50 --no-pager` 查看详细的 systemd 启动日志。<br>3. 重点分析 `/www/wwwroot/twikoo/logs/twikoo-error.log` 中的内容。 |