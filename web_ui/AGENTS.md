# WeMP RSS 前端项目说明（Cursor / 开发者参考）

本文档描述 `web_ui` 的构成与约定，便于 AI 与开发者快速定位与修改逻辑。详细安装与运行说明见 [README.md](./README.md)。

---

## OVERVIEW

WeMP RSS 前端应用基于 Vue 3 和 Vite 构建，提供微信公众号订阅管理的用户界面。采用现代化前端技术栈，支持响应式设计（桌面/移动端自适应）与国际化能力，通过 REST API（Axios）与 FastAPI 后端交互。

**核心特性：**
- 用户认证与权限管理（JWT Token，localStorage 存储）
- 文章列表展示与筛选（桌面/移动端自适应，入口 `ArticleList.vue`，桌面实现在 `views/article/ArticleListDesktop.vue`）
- 公众号订阅管理（WeChatMpManagement）
- 配置管理与定时任务（ConfigList/ConfigDetail、MessageTask）
- 文章导出（PDF/DOCX/MD/JSON/CSV，ExportModal + ExportRecords）
- 系统监控与资源展示（SysInfo、SystemResources）
- 标签管理（TagList/TagForm）、AccessKey 管理、小说阅读器（NovelReader）

---

## STRUCTURE

```
web_ui/
├── src/
│   ├── api/                    # API 调用模块（按功能分组）
│   │   ├── http.ts             # Axios 实例、baseURL 为 VITE_API_BASE_URL + api/v1/
│   │   ├── auth.ts             # 认证（登录、验证 Token）
│   │   ├── user.ts             # 用户信息、修改密码等
│   │   ├── article.ts          # 文章列表、详情
│   │   ├── subscription.ts    # 订阅相关
│   │   ├── configManagement.ts # 配置 CRUD
│   │   ├── export.ts           # 导出
│   │   ├── messageTask.ts      # 消息定时任务
│   │   ├── sysInfo.ts          # 系统信息
│   │   ├── tagManagement.ts    # 标签
│   │   ├── accessKey.ts        # AccessKey
│   │   ├── file.ts             # 文件相关
│   │   ├── tools.ts            # 工具类 API
│   │   └── ...
│   ├── views/                  # 页面组件（与路由对应）
│   │   ├── Login.vue
│   │   ├── ArticleList.vue     # 文章列表入口（按宽度切换桌面/移动）
│   │   ├── article/            # 文章相关子视图
│   │   │   ├── ArticleListDesktop.vue
│   │   │   ├── ArticleListMobile.vue
│   │   │   └── ArticleTimeListMobile.vue
│   │   ├── WeChatMpManagement.vue
│   │   ├── AddSubscription.vue
│   │   ├── ConfigList.vue, ConfigDetail.vue
│   │   ├── ExportRecords.vue
│   │   ├── MessageTaskList.vue, MessageTaskForm.vue
│   │   ├── TagList.vue, TagForm.vue
│   │   ├── AccessKeyManagement.vue
│   │   ├── SysInfo.vue
│   │   ├── NovelReader.vue
│   │   ├── ChangePassword.vue, EditUser.vue
│   │   └── ...
│   ├── components/             # 可复用组件
│   │   ├── Layout/
│   │   │   ├── BasicLayout.vue # 主布局（侧栏/内容区）
│   │   │   └── Navbar.vue
│   │   ├── ExportModal.vue     # 导出格式与执行
│   │   ├── ExportRecords.vue   # 导出记录展示
│   │   ├── CronExpressionPicker.vue
│   │   ├── TaskList.vue, MpMultiSelect.vue
│   │   ├── CustomPieChart.vue, SystemResources.vue
│   │   ├── ACodeEditor.vue, ResponsiveTable.vue
│   │   ├── WechatAuthQrcode.vue, TextIcon.vue
│   │   └── ...
│   ├── router/
│   │   └── index.ts            # 路由表、beforeEach 认证与权限
│   ├── utils/
│   │   ├── auth.ts             # Token 存取
│   │   ├── date.ts             # 日期处理
│   │   ├── constants.ts        # 常量
│   │   ├── translate.ts        # 翻译
│   │   └── i18n/               # 国际化（i18n-jsautotranslate）
│   ├── types/                  # TypeScript 类型
│   │   ├── configManagement.ts / .d.ts
│   │   ├── tagManagement.ts
│   │   └── messageTask.ts
│   ├── assets/                 # 静态资源
│   ├── App.vue
│   └── main.ts                 # 入口：Vue、Arco、Router 注册
├── public/                     # 公共静态资源（可选）
├── dist/                       # 构建输出（build.sh 会复制到 ../static/）
├── package.json
├── vite.config.ts              # 别名 @ -> src、开发端口 3000、代理
├── tsconfig.json
├── .env.development
├── .env.production
├── build.sh                    # yarn install && yarn build && 复制到 ../static/
└── build.bat                   # Windows 构建脚本
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|--------|
| **应用启动** | `src/main.ts` | 注册 Vue、Arco、Router，挂载 #app |
| **路由与权限** | `src/router/index.ts` | 路由表、beforeEach 认证守卫、meta.permissions |
| **API 基础配置** | `src/api/http.ts` | Axios 实例、baseURL=env + `api/v1/`、请求/响应拦截器 |
| **环境变量** | `.env.development`, `.env.production` | VITE_API_BASE_URL、VITE_DEBUG_MODE、VITE_APP_TITLE 等 |
| **构建与代理** | `vite.config.ts` | 别名、端口 3000、代理 /api、/rss 等 |
| **布局** | `src/components/Layout/BasicLayout.vue` | 主框架；顶部/侧栏见 Navbar |
| **认证** | `src/utils/auth.ts`, `src/api/auth.ts` | Token 存储与校验、登录/登出 |
| **文章列表入口** | `src/views/ArticleList.vue` | 按宽度切换桌面/移动；内部引用 article/ 下组件 |
| **文章列表（桌面）** | `src/views/article/ArticleListDesktop.vue` | 桌面端主列表与筛选 |
| **文章列表（移动）** | `src/views/article/ArticleListMobile.vue`, `ArticleTimeListMobile.vue` | 移动端展示 |
| **导出** | `src/components/ExportModal.vue` | 格式选择与触发；记录列表见 ExportRecords.vue |

---

## CONVENTIONS

### 开发约定

- **包管理**：使用 `yarn`（`yarn install`，不要用 npm 安装依赖，与 build.sh 一致）
- **开发服务器**：`yarn dev`，默认 http://localhost:3000（见 vite.config.ts server.port）
- **生产构建**：`yarn build` 生成 `dist/`；完整流程执行 `build.sh`（安装依赖 + 构建 + 复制到 `../static/`）
- **路径别名**：`@` 指向 `src/`，导入示例：`@/api/http`、`@/views/ArticleList.vue`

### 环境变量

- 以 `VITE_` 开头，通过 `import.meta.env.VITE_*` 访问。
- 常用项：
  - `VITE_API_BASE_URL`：后端基地址（开发多为 `http://localhost:8001/`，生产多为 `/`）
  - `VITE_DEBUG_MODE`：调试开关
  - `VITE_APP_TITLE`、`VITE_APP_LOGIN_TITLE`：标题文案

### 路由与权限

- **认证**：`router.beforeEach` 根据 `meta.requiresAuth` 检查 `localStorage` 中的 token；无 token 跳转 `/login`，并带 `redirect` 以便登录后回跳。
- **权限**：`meta.permissions` 数组（如 `['wechat:manage']`、`['config:view']`、`['admin']`）用于控制可访问性；具体校验逻辑在路由或布局中按需使用。
- **登录页**：`/login` 不需认证；其余业务路由均在 BasicLayout 的 children 下。

### UI 框架

- **唯一 UI 库**：Arco Design Vue（`@arco-design/web-vue`），全局在 main.ts 中注册（含 Arco 图标 `@arco-design/web-vue/es/icon`）。项目已移除 Ant Design Vue，**不要**再引入 `ant-design-vue` 或其它 UI 组件库，新功能统一使用 Arco 组件与图标。

### API 调用

- **客户端**：Axios，实例在 `src/api/http.ts`；baseURL = `VITE_API_BASE_URL + 'api/v1/'`。
- **请求头**：拦截器自动添加 `Authorization: Bearer {token}`（token 来自 `utils/auth`）。
- **响应**：后端格式多为 `{ code, data, detail }`；code 为 0 时返回 data/detail，401 时拦截器会跳转登录并提示。

### TypeScript

- **类型**：在 `src/types/` 按模块组织（configManagement、tagManagement、messageTask 等）。
- **组件**：Props 与 emits 建议用接口/类型定义，保持与 API 类型一致。

### 国际化

- **当前**：`utils/i18n` 使用 `i18n-jsautotranslate`（自动翻译，质量有限）。
- **建议**：正式多语言可考虑迁移到 `vue-i18n` 等方案。

---

以上内容已与当前仓库（api/views/components/router/utils/types、vite、build、env）核对并同步。若新增页面或 API 模块，建议同步更新本文件中的 STRUCTURE 与 WHERE TO LOOK。
