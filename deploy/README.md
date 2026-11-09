# Barsan 生产部署

本目录为待部署配置；本地检查不替代目标服务器的 Docker 构建和 HTTPS 验收。域名及服务器信息确认后再执行正式部署。

本次目标为 `ma.barsan.com.cn`，服务器为 `8.209.58.190`。该服务器已有 Nginx，先按 `TARGET.md` 检查现有环境，并使用新增的 Nginx 虚拟主机模板；下面的 Caddy 步骤仅适用于没有既有反向代理的独立安装环境。

1. 将源码放到服务器的独立目录，例如 `/srv/barsan`，使用 Docker Engine 和 Compose。源码包不包含数据库、上传素材、后台密码或千问密钥。
2. 将已验证的私有备份通过 SSH / SFTP 迁入项目的 `data/`，保留 `barsan.sqlite`、`uploads/` 及 `translation-config.json`。第一次迁入必须使用新的空目录；不要覆盖仍运行的网站数据。已有数据库会保留现有后台密码和语言开关。
3. 将 `deploy/production.env.example` 复制到项目根目录 `.env`，设置权限 `600`。空数据库首次启动时填写至少 16 字符的管理员密码；已有数据库无需改密码。Docker 中 Node 用户为 UID 1000，需赋予该用户 `data/` 的读写权限。
4. 在项目目录运行 `docker compose -f deploy/compose.yaml build`，构建成功后运行 `docker compose -f deploy/compose.yaml up -d`。确认 `docker compose -f deploy/compose.yaml ps` 显示健康，再请求 `http://127.0.0.1:3000/healthz`。
5. 在服务器配置 Caddy，参考 `Caddyfile.example` 将示例域名替换为真实域名。域名解析到服务器后，先运行 `caddy validate --config /etc/caddy/Caddyfile`，验证成功再启动 / 重新加载 Caddy。对外开放 80/443；应用 3000 端口仅绑定本机。
6. 经真实 HTTPS 域名测试：后台登录与退出、中文隐藏与后台中文编辑、文章发布翻译、HTML 图片/表格、询价提交和后台跟进、视频播放、手机布局。后台 Cookie 在生产环境为 Secure，需要 HTTPS。
7. 验收通过后安排定期备份。运行 `docker compose -f deploy/compose.yaml exec app node scripts/backup.mjs` 可生成一致性的 SQLite、上传文件及千问配置备份，位置为数据目录 `backups/`。备份含敏感配置，应在私有位置保存并同步至另一台受控设备，不能放进公开网站目录。

回退时保留新旧两个数据目录，停止应用后把已验证的备份复制到新的空目录，再调整挂载并启动。不要在运行中的 SQLite 数据库上直接覆盖文件，也不要只复制数据库主文件而遗漏 WAL 数据。

`TRUST_PROXY=1` 仅用于本配置中受信任的反向代理环境，不能将应用端口直接公开。Caddy 保留原始 Host 并设置转发客户端信息；实时事件接口排除压缩，避免缓冲影响更新。翻译等待时间单独放宽，避免较长文章同步时被普通代理超时截断。

参考：[Caddy reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)、[Node.js SQLite backup](https://nodejs.org/docs/latest-v24.x/api/sqlite.html#sqlitebackupsourceDb-path-options)。
