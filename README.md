# XAI Finance Web App

一个基于Next.js的Web3金融应用，提供加密货币行情跟踪、K线分析、NFT展示和Web3应用发现等功能。

## 功能特点

- 🌙 支持深色/浅色模式
- 📊 加密货币价格和趋势追踪
- 📈 实时K线图和市场分析
- 👤 用户个人资料和钱包管理
- 🖼️ NFT展示和管理功能
- 🔍 Web3应用发现和热门排名
- 📱 响应式设计，适合移动端使用
- 🔄 Python API后端，提供实时代币数据

## 主要页面

- **首页**：热门代币、搜索、最新行情
- **市场页**：详细价格图表和交易数据
- **K线页**：专业图表分析工具
- **钱包页**：资产管理、代币和NFT展示
- **发现页**：Web3应用分类和热门排行
- **用户个人页**：账户设置和管理

## 技术栈

- **前端**：
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - shadcn/ui组件库
  - recharts图表库
- **后端**：
  - Python Flask API服务
- **部署**：
  - Vercel (前端)
  - 可选后端部署：Heroku、AWS Lambda、Vercel Serverless Functions

## 开发环境设置

### 前提条件

- Node.js 18+ 
- pnpm 8+（推荐）或npm
- Python 3.8+（如果运行后端）
- Git

### 安装和运行

1. **克隆项目仓库**：

```bash
git clone https://github.com/你的用户名/xai-finance.git
cd xai-finance
```

2. **安装前端依赖**：

```bash
# 使用pnpm（推荐）
pnpm install

# 或使用npm
npm install
```

3. **配置环境变量**：

创建`.env.local`文件：

```
NEXT_PUBLIC_API_BASE_URL=""  # 本地开发时留空
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 运行方式

#### 只运行前端

```bash
# 开发模式
pnpm dev

# 或使用npm
npm run dev
```

访问：http://localhost:3000

#### 运行前端和Python API后端

1. **设置Python环境**：

```bash
# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **启动开发环境**：

```bash
# Windows
start.bat

# Linux/macOS
chmod +x start.sh
./start.sh
```

访问：http://localhost:3000

## 项目结构

```
xai-finance/
├── app/                 # Next.js 应用目录
│   ├── api/             # API路由
│   ├── trade/           # 交易页面
│   ├── wallet/          # 钱包页面
│   └── ...              # 其他页面
├── components/          # React组件
│   ├── ui/              # UI基础组件
│   └── ...              # 其他组件
├── public/              # 静态资源
│   ├── nft-images/      # NFT图片
│   └── web3/            # Web3相关资源
├── lib/                 # 工具函数和库
├── api_server.py        # Python API服务器
├── ...                  # 其他配置文件
└── README.md            # 项目文档
```

## 开发指南

### 代码规范

- 遵循TypeScript类型安全规范
- 使用函数组件和React Hooks
- 文件命名采用kebab-case（小写连字符）
- 组件命名采用PascalCase
- CSS使用Tailwind工具类

### 贡献流程

1. 创建功能分支
2. 提交代码时使用清晰的提交信息
3. 创建Pull Request
4. 通过代码审查后合并

## 构建和部署

### 本地构建测试

```bash
# 构建
pnpm build

# 启动生产环境服务器
pnpm start
```

### Vercel部署（推荐）

1. 在Vercel上导入GitHub项目
2. 配置环境变量
3. 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F你的用户名%2Fxai-finance)

### 自定义服务器部署

如果您使用自己的服务器部署：

1. 构建项目：`pnpm build`
2. 将`.next`、`public`目录和`package.json`复制到服务器
3. 安装生产环境依赖：`pnpm install --production`
4. 启动服务：`pnpm start`

### 部署Python API后端

1. 将`api_server.py`和`requirements.txt`部署到支持Python的服务器
2. 安装依赖：`pip install -r requirements.txt`
3. 使用生产级WSGI服务器运行：
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
   ```

## Git使用指南

### 初始设置

```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/xai-finance.git
```

### 日常开发流程

```bash
# 获取最新代码
git pull origin main

# 创建功能分支
git checkout -b feature/your-feature-name

# 添加更改
git add .

# 提交更改
git commit -m "feat: 添加新功能描述"

# 推送到远程仓库
git push origin feature/your-feature-name
```

### 提交规范

使用语义化的提交消息：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 仅文档更改
- `style:` 不影响代码含义的更改（空格、格式化等）
- `refactor:` 既不修复bug也不添加功能的代码更改
- `perf:` 改进性能的代码更改
- `test:` 添加或修正测试
- `chore:` 对构建过程或辅助工具的更改

## API文档

查看[API_README.md](API_README.md)了解后端API的详细信息。

## 常见问题解答

### 如何添加新页面？

在`app`目录下创建新的目录和page.tsx文件。详细请参考Next.js官方文档。

### 如何添加新组件？

在`components`目录下添加新的组件文件，遵循相同的结构和命名规范。

### 如何管理NFT图像？

将新的NFT图像放在`public/nft-images`目录下，然后在钱包页面引用它们。

## 许可证

MIT