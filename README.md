# Barsan International Freight Forwarding

摩洛哥货运官网与配套内容管理后台。紫色品牌风格，适配桌面与手机，已部署至阿里云迪拜服务器。

正式官网为 https://ma.barsan.com.cn/ ，管理后台为 https://ma.barsan.com.cn/admin 。生产部署记录见 [DEPLOYMENT-2026-11-06.md](DEPLOYMENT-2026-11-06.md)，访问统计与 WhatsApp 更新见 [UPDATE-ANALYTICS-2026-11-06.md](UPDATE-ANALYTICS-2026-11-06.md)。

## 打开网站

- 官网：http://127.0.0.1:3000/en
- 法语：http://127.0.0.1:3000/fr
- Darija：http://127.0.0.1:3000/ary
- 中文后台：http://127.0.0.1:3000/admin
- 后台用户名与初始密码见同目录 `LOCAL_ACCESS.md`。密码使用随机值生成，不写在源码中；可在后台「账户安全」修改。

如果服务器没有运行，在 macOS 双击 `start.command`。也可以在此目录执行：

```sh
node server.mjs
```

需要 Node.js 24 或更新版本。首次安装或迁移源码后先运行 `npm ci` 安装锁定版本的 HTML 处理依赖；当前电脑已安装。当前电脑的启动脚本也会尝试使用 Codex 自带的 Node。运行中保持终端窗口打开；按 Ctrl+C 停止。端口 3000 已被使用时，先停止旧进程，或使用 `PORT=3001 node server.mjs`。

## 已有功能

- 英语、法语、Darija 三语网站；Darija 使用阿拉伯字母与 RTL 排版。语言选择保存在当前浏览器，直接访问语言网址优先。
- 首页、运输与清关服务、公司介绍、新闻列表、文章详情、联系、询价和隐私说明。
- 新闻分类与搜索、千问自动翻译同步、草稿与发布、按摩洛哥日期展示未来文章。
- 中文后台：工作台、新闻与软文、询价管理、三语页面文案、公司信息、密码修改。
- 文章正文可插入多张图片，支持 HTML 文件导入和实时预览；封面与正文图片可从素材库重复选用。
- 素材库统一收录历史和新上传的 JPEG / PNG / WebP 图片（单张最大 4MB）及 MP4 视频（最大 12MB），支持预览、搜索、修改名称与说明。
- 询价真实保存、生成参考编号，支持状态跟进、详情查看及 CSV 导出。
- 网站标题、服务文案、主要按钮、页脚、联系方式、Logo 和页面配图可在后台可视化编辑；页面结构和版式通过源码调整。
- WhatsApp 号码配置后，联系页及手机端悬浮按钮使用该号码跳转聊天。
- 后台提供访问统计，包括今日访客、浏览量、来源国家或地区、IP明细及多语言合并的文章阅读排行，可查看最近90天。
- SQLite 持久化，重启后内容、询价、账号和登录会话保留；登录会话有效期为八小时。

## 后台操作

1. 在「公司与联系方式」填写公司邮箱、电话、WhatsApp 与办公地址。未填写时不会展示虚构号码。
2. 在「可视化页面编辑」选择页面和语言，直接点击官网预览中的文字或图片，在右侧编辑面板修改，确认效果后点击「保存修改」。
3. 在「新闻与软文」新建或编辑文章，填写一种语言的标题、摘要和正文，保存时由千问自动生成其他语言内容。网址使用小写英文与短横线。
4. 可先保存为草稿。配置千问后，选择日期与「发布」状态，保存时自动翻译并同步全部语言。日期按 `Africa/Casablanca` 的日历日期控制可见性。
5. 示例文章带有「示例」标识，正式发布自有内容时取消该勾选。正文支持 ## 小标题、- 清单、空行分段及安全的网页参考链接。
6. 访客发送询价后，在「询价管理」中查看并标记为待处理、已联系、已报价或已完成。

后台保存后，已打开的官网通过实时通知获取最新内容。填写中的询价表单在后续页面切换时使用新文案。

## 数据与备份

默认数据在 `data/barsan.sqlite`，上传图片在 `data/uploads/`。这些内容不会提交到 Git，也不会被打进 Docker 镜像。迁移时同时迁移数据库与上传目录。

最简单的本地备份：停止服务器，然后复制整个 `data/` 目录，再启动。运行中直接只复制 SQLite 主文件可能遗漏 WAL 数据，不能作为完整备份。

`LOCAL_ACCESS.md` 含本地初始密码，请勿上传到公开仓库或网站。修改密码后此文件不会自动更新，需要记住新密码；旧密码将失效。

## 部署与运行

本项目使用 Node.js 24 HTTP 服务和 SQLite。当前生产环境通过 systemd 管理服务，并由 Nginx 提供 HTTPS 访问。配套配置位于 `deploy/`，同时提供 Dockerfile 供其他环境使用。

正式环境建议使用 Node 24、持久化数据目录和 HTTPS 反向代理。`NODE_ENV=production` 时登录 Cookie 带有 Secure 标记，因此必须通过 HTTPS 访问后台。首次启动生产数据库前须设置至少 16 字符的 `ADMIN_PASSWORD`；已有数据库不会因环境变量改变而重置密码。

Docker 构建示例：

```sh
docker build -t barsan-freight .
docker run --env-file /secure/path/barsan.env \
  -p 127.0.0.1:3000:3000 \
  -v barsan-data:/app/data \
  --restart unless-stopped \
  --name barsan barsan-freight
```

`/secure/path/barsan.env` 由你在服务器准备，至少包含 `ADMIN_PASSWORD`。域名与 TLS 交给 Nginx / Caddy 等反向代理；不要把初始密码写入镜像或公开配置。迁移现有数据时，保留现有管理员密码。健康检查使用 `/healthz`。配套配置和步骤见 `deploy/README.md`；应用端口仅绑定服务器本机，由 HTTPS 反向代理对外提供服务。

上线前还需要补齐真实联系方式、业务服务范围、正式公司及隐私文案，并由熟悉摩洛哥 Darija 的同事校对本地表达。询价目前只在后台保存，未接入邮件、短信或 WhatsApp 自动通知；新闻模块支持手动编辑与发布，不自动获得实时新闻。

## 技术与验证

- Node.js 24 原生 HTTP、SQLite、加盐 scrypt 密码哈希、HttpOnly / SameSite 会话 Cookie。
- 管理接口鉴权、跨站写入检查、登录与表单频率限制、长度与语言完整性校验、基础安全响应头、CSV 公式转义。
- 客户资料留在本地数据库；没有广告追踪、第三方分析脚本或远程字体依赖。图片资产已存本地。
- 目录：`server.mjs` 后端；`seed.mjs` 初始三语内容；`public/app.js` 官网；`public/admin.js` 后台；对应 CSS 控制布局。
- 测试：`npm test`，或 `node --test tests/integration.test.mjs`。测试使用独立临时数据库，不写入正式数据。
- 语法检查：`npm run check`。

## 资产

Logo 由用户提供：`public/assets/logo.png`。

集装箱堆场图片来自 Unsplash，已下载为 `public/assets/port.jpg`：
https://images.unsplash.com/photo-1494412519320-aa613dfb7738

地图采用 Natural Earth 1:110m 的真实海岸线数据（公共领域），已保存本地并转换为 SVG。线路按义乌、广州及目的地经纬度绘制大圆连接线，至摩洛哥卡萨布兰卡的两条连接线以亮橙色突出；这是一张地理连接示意图，不代表船舶实际航迹、实时货量或已确认的业务网络。集装箱图形为本项目绘制的示意图。内容库已补齐三篇四语实用指南，主题为发货文件、整柜与拼箱、摩洛哥到港至派送。它们属于常青实用内容，不是实时港口、市场或海关新闻。

## 前台语言开关与中文编辑

后台「前台语言」（http://127.0.0.1:3000/admin#languages）可单独开关英语、法语、Darija 和中文，设置新访客默认语言。至少开启一种语言，默认语言必须已开启。保存后官网语言菜单与顶部语言提示即时更新；访问关闭语言的旧链接时，保留页面路径与查询参数，跳转至默认语言。

关闭中文不会删除文案和文章，也不会移除后台中文页签或中文可视化预览。后台始终保留四种编辑语言；可持续以中文编辑网页、导入 HTML 和上传文章。配置千问后保存时同步各语言，前台仅展示开启的语言，因此重新开启某种语言时，无需重新上传内容。未配置千问时可先保存文章草稿。

语言开关不依赖翻译服务，修改显示语言不会调用千问或改写正文。`enabledLanguages` 与公司配置一同持久化，原有数据升级后默认保留四种语言的开启状态。

## 世界线路地图

首页和关于页面共享 `public/assets/freight-map.js`。其中 `ORIGINS` 配置义乌、广州的地理位置，`DESTINATIONS` 配置全球代表性目的地；`featured` 标识摩洛哥线路。地图文案适配英语、法语、Darija 和中文。

底图来源：[Natural Earth](https://www.naturalearthdata.com/)，[公共领域使用说明](https://www.naturalearthdata.com/about/terms-of-use/)。原始海岸线 GeoJSON 保存在 `scripts/map-data/ne_110m_land.geojson`，运行 `python3 scripts/build-world-map.py` 可重新生成本地底图模块 `public/assets/world-land.js`，网站加载不依赖在线地图服务或 API Key。

## 服务卡片摄影配图

首页与服务详情页展示六项服务，使用白底、品牌紫色图标、标题、介绍和功能标签的卡片样式。原有服务照片仍保留在素材库，后台修改文案方式不变。

- 海运（集装箱船）：`public/assets/service-sea.jpg`，来源 https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg
- 空运（机场飞机）：`public/assets/service-air.jpg`，来源 https://images.unsplash.com/photo-1569154941061-e231b4725ef1
- 清关协调（文件处理）：`public/assets/service-customs.jpg`，来源 https://images.unsplash.com/photo-1450101499163-c8848c66ca85
- 本地派送（公路货车）：`public/assets/service-delivery.jpg`，来源 https://images.unsplash.com/photo-1601584115197-04ecc0da31d7

后续替换背景可更新对应图片，或在 `public/app.js` 的 `servicePhotos` 调整映射。卡片样式位于 `public/style.css` 中的 `.service-card-photo` 相关规则。

## 官网原样可视化编辑

入口：http://127.0.0.1:3000/admin#content ，使用当前后台账号登录。后台「可视化页面编辑」已取代原来的文案列表。预览直接加载官网相同的页面、样式和组件。

1. 顶部选择页面与语言，可打开首页、服务、关于、新闻列表、任一现有文章、联系、询价和隐私页面。
2. 在「点选编辑」模式点击标题、段落、导航或按钮文字，右侧显示对应编辑框；输入时预览即时更新，保存时由千问翻译并同步其他语言。
3. 点击 Logo、视频封面、服务背景图、关于配图或文章封面，选择 JPG / PNG / WebP（最大 4MB）替换，也可恢复默认图片。页面图片为全站共用，文章文字按语言保存。
4. 页面下拉框切换页面；「定位」菜单可快速跳到服务卡片、地图、流程、新闻和页脚。「浏览预览」可在预览内使用网站导航，预览里的询价表单不会发送真实询价。
5. 可切换电脑、平板、手机宽度，缩放按钮在适应宽度和 100% 之间切换。输入修改可撤销、重做；离开前会提示未保存的内容。
6. 点击「保存修改」后更新数据库。已打开的普通官网会实时获取保存结果。新闻创建、分类、发布日期和发布状态仍使用「新闻与软文」。

可视化预览使用需登录的 `/admin/preview/…` 路由，只允许同源后台嵌入。普通官网仍保留禁止嵌入的响应头。源码：`public/visual-editor.js`（后台工作区）、`public/visual-preview.js`（点选桥接）及对应 CSS；预览复用 `public/app.js`，不维护另一份官网布局。

## 完整货运指南内容

三篇指南的完整四语初始内容位于 `article-content.mjs`，并在首页、新闻列表和详情页使用对应的文件处理、集装箱船及公路派送照片。文章含分节、操作清单、咨询入口和官方参考链接。正文排版由 `public/article-format.js` 安全渲染，原始 HTML 会被转义。

升级只在首次启动时替换这三个网址下仍标为示例的文章，保留文章 ID 和网址，并将原值保存在数据库 `article_content_backups` 表中。版本记录在 `migrations` 表中；后续重启不会覆盖后台的新修改。已经自定义并取消示例标识的文章不会被自动替换。新建文章仍通过后台发布。

参考资料：
- PortNet 进口凭证服务：https://www.portnet.ma/titre-d-importation
- Maersk 整柜与拼箱定义：https://www.maersk.com/support/faqs/what-is-fcl
- PortNet 摩洛哥对外贸易程序：https://www.portnet.ma/fr/portnet-commerce-exterieur


## 首页海上货轮视频

首页首屏使用约 8 秒、1280×720 的本地 H.264 MP4（约 1.8MB），静音自动循环，支持手机内联播放，右上角可暂停。尊重系统减少动态效果的设置；加载前或播放受限时显示同场景封面。服务器支持视频字节范围请求，便于浏览器加载和拖动播放。

- 视频：`public/assets/hero-ship-loop.mp4`
- 封面：`public/assets/hero-ship-poster.jpg`
- 实拍素材：[Aerial View of a Container Ship Sailing through the Ocean — 8 K / Pexels](https://www.pexels.com/video/aerial-view-of-a-container-ship-sailing-through-the-ocean-26893764/)，依据 [Pexels 许可](https://www.pexels.com/license/)剪辑使用。素材仅用于物流场景展示。

后台「可视化页面编辑」点击货轮视频可上传 MP4 替换（最大 12MB，建议 5–10 秒），也可恢复默认视频；面板内「修改视频封面」支持独立替换封面。所有语言共享视频。点击「保存修改」后更新官网。


## 文章插图、HTML 导入与素材库

后台入口：http://127.0.0.1:3000/admin ，「素材库」直达 http://127.0.0.1:3000/admin#media 。

1. **正文插图**：在「新闻与软文」编辑文章，把光标放到需要插图的位置（也可选中要替换的内容），点击「正文插图」，上传或从素材库选择图片，填写可选图片说明后点击「使用所选图片」。正文下方实时显示图片与排版，最后保存文章。
2. **HTML 导入**：在当前语言页签点击「导入 HTML 文件」，选择一个 UTF-8 编码的 `.html` / `.htm` 文件，可同时选择配套的 JPG / PNG / WebP 图片。相对图片路径按文件名匹配附带图片，HTML 内嵌的 base64 图片自动转为本地素材；已存在的 `/media/…` 与网站默认图片可直接复用。HTML 最大 12MB，导入后正文最大 60,000 字符，单张图片最大 4MB。
3. 导入只替换当前语言正文。标题和摘要为空时会自动提取，其他语言保留。常见标题、段落、加粗、列表、引用、链接、表格、图片和图注按官网主题排版。HTML 的脚本、表单、整页样式与嵌入页面不作为文章内容执行。没有附带的本地图片和外链图片显示「待补充图片」标记；可附带图片重新导入，或选中标记后通过「正文插图」替换。网站不会自动下载远程图片。
4. **素材库**：上传后即时入库，无需先保存文章。已有 `data/uploads` 图片和视频自动列出，网站默认图片也可选用。修改素材名称和说明不改变文件地址；每次插图时可填写该次使用的图注，修改素材说明不会自动改写已经发布文章的图注。封面和官网可视化编辑都可从素材库选图；可视化编辑的文章正文也提供插图按钮。
5. 新增文章先保存为草稿即可；配置千问后，只需填写一种语言，保存时自动翻译其余语言并发布。正文格式按语言独立保存在 `bodyFormat`；旧文章保持原有文字格式。

示例 HTML：`examples/article-template.html`。素材名称和说明保存在 SQLite `media_assets` 表，上传文件仍在 `data/uploads`，备份时两者都需要保留。

HTML 处理使用锁定版本的 `sanitize-html`（服务端）与 DOMPurify（预览及官网显示）；浏览器模块与许可证位于 `public/vendor/`，不依赖在线 CDN。新增测试覆盖 HTML 导入、脚本过滤、图片位置、历史素材发现、元数据保存和重启持久化。


## 阿里云千问自动翻译

入口：http://127.0.0.1:3000/admin#translation 。填写 API Key 所属地域、Base URL、模型及百炼 API Key，保存后点击「测试连接并翻译样例」。默认模型 `qwen-plus`。支持北京、新加坡 DashScope 地址，也可填写百炼提供的业务空间专属 Base URL。地域与 API Key 需匹配。接口依据 [阿里云兼容接口文档](https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope)及 [JSON 输出文档](https://help.aliyun.com/zh/model-studio/qwen-structured-output)接入。

文章或可视化文案只需编辑一种语言。保存时自动识别修改语言并翻译到其他编辑语言，包含英语、法语、阿拉伯字母的摩洛哥 Darija 及中文。HTML、图片地址和 Markdown 链接的结构会保留。文案没有变化时复用已有内容与翻译缓存。新文章在配置密钥前可保存为「待自动翻译」草稿。

各语言译文准备完成后统一写入数据库。接口失败时当前编辑仍保留，可以重试；多窗口的旧版本保存会提示刷新。可视化页面与文章修改共用一次提交。官网通过 `/api/site/events` 接收保存通知并更新显示。

密钥位于 `data/translation-config.json`（权限 `0600`），后台查询只返回配置状态。该文件随数据目录一起保管，迁移时需要保留，也可改用服务器环境变量 `DASHSCOPE_API_KEY`、`QWEN_BASE_URL`、`QWEN_MODEL` 配置。翻译缓存位于 SQLite `translation_cache` 表。

自动化检查使用本地模拟的千问协议验证同步、HTML 结构保留、失败回滚、并发冲突和实时通知。真实千问连接与译文效果需填写自己的 API Key 后通过后台测试验证。


## 六项服务卡片

首页与服务页按「国际海运、国际空运、集装箱陆运、仓储服务、报关报检、双清包税」展示六项服务，桌面三列两行、平板两列、手机单列，采用白底图标卡片，完整显示服务介绍。名称、介绍、英文标识及功能标签均可在可视化后台编辑，并接入千问同步翻译。询价表单与后台跟进列表使用相同服务分类。

`public/services.js` 定义服务顺序和字段键，`service-content.mjs` 提供四语初始文案。首次升级前的配置保存在 SQLite `config_content_backups`，升级记录为 `2026-11-05-six-service-cards`；后续重启保留后台修改。参考图中的车队与仓库规模没有作为公司数据写入服务介绍，文案按服务流程和可编辑的功能标签编写。

新增配图均用于服务场景展示，来源为 Pexels：
- 集装箱陆运：`public/assets/service-land.jpg`，[集装箱拖车照片](https://www.pexels.com/photo/yang-ming-shipping-container-on-freight-truck-31723807/)。
- 仓储服务：`public/assets/service-warehouse.jpg`，[仓库货架照片](https://www.pexels.com/photo/photo-of-warehouse-4277794/)。
- 双清包税：`public/assets/service-ddp.jpg`，[装货配送照片](https://www.pexels.com/photo/delivery-man-carrying-boxes-6169670/)。


## 公司新闻动态

新增四篇根据用户提供资料整理的公司文章，归入「公司新闻」：斯里兰卡分公司成立（2025-11-18）、义乌智慧仓储中心投运（2025-06-08）、广州分公司成立（2025-03-18）、摩洛哥双清包税专线开通（2021-08-25）。每篇包含中、英、法、Darija 标题、摘要和分节正文，保留事件原始日期，可在后台文章管理中编辑。`company-news.mjs` 的升级仅补充缺失文章，保留原有文章及后续编辑；删除后不会在重启时重新添加。


## 最终验收与生产维护

2026-11-05 最终验收结果见 `PRELAUNCH-REPORT.md`。本轮修复代理限流、异常网址请求、前台语言残留、后台列表刷新与窄屏 RTL 溢出，并加入生产健康检查和一致性备份脚本。

运行 `npm run backup`（或 `node scripts/backup.mjs`）可在线备份数据库、上传素材与千问配置。默认保存在 `data/backups/`，可用 `BACKUP_DIR` 指定私有位置。备份包含敏感配置，不应公开；迁移与回退步骤见 `deploy/README.md`。
