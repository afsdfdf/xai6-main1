# XAI Finance Web App

一个基于Next.js的Web3金融应用，提供加密货币行情跟踪、K线分析和Web3应用发现等功能。

## 特点

- 🌙 支持深色/浅色模式
- 📊 加密货币价格和趋势追踪
- 📈 实时K线图和市场分析
- 👤 用户个人资料管理
- 🔍 Web3应用发现和热门排名
- 📱 响应式设计，适合移动端使用
- 🔄 Python API后端，提供实时代币数据

## 主要页面

- 首页：热门代币、搜索、最新行情
- 市场页：详细价格图表和交易数据
- K线页：专业图表分析工具
- 发现页：Web3应用分类和热门排行
- 用户个人页：账户设置和管理

## 技术栈

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui组件库
- Python Flask API服务
- Vercel部署

## 安装和运行

1. 克隆项目仓库：

```bash
git clone https://github.com/你的用户名/xai6.git
cd xai6
```

2. 安装依赖：

```bash
npm install
```

### 只运行前端

3. 运行开发服务器：

```bash
npm run dev
```

4. 打开浏览器访问：http://localhost:3000

### 运行前端和Python API后端

3. 安装Python依赖：

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

4. 启动开发环境（使用脚本启动两个服务器）：

```bash
# Windows
start.bat

# Linux/macOS
chmod +x start.sh
./start.sh
```

5. 打开浏览器访问：http://localhost:3000

### Python API后端

Python Flask服务提供以下API端点：

- `/api/token-boosts` - 获取热门代币数据
- `/health` - 健康检查接口

详细信息请查看 [API_README.md](API_README.md)

## 构建生产版本

```bash
npm run build
npm start
```

## 部署

该项目可以部署到Vercel或其他支持Next.js的平台。Python API后端可以部署到支持Python的平台，如Heroku、AWS Lambda等。

## Vercel部署

本项目可以轻松部署到Vercel平台。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F你的用户名%2Fxai6)

### 部署步骤

1. 将代码推送到GitHub仓库
2. 在Vercel上导入项目
3. 选择GitHub仓库
4. 配置部署选项
   - 构建命令: `pnpm run build`
   - 输出目录: `.next`
   - 安装命令: `pnpm install`
5. 设置环境变量
   - `NEXT_PUBLIC_API_BASE_URL`: API基础URL（默认为空）
   - `NEXT_PUBLIC_APP_URL`: 应用URL
6. 点击部署

## 环境变量

创建一个`.env.local`文件，并设置以下环境变量：

```
NEXT_PUBLIC_API_BASE_URL=""
NEXT_PUBLIC_APP_URL="https://你的域名.vercel.app"
```

## API接口

项目使用Ave.ai API获取代币数据。API密钥已包含在代码中。

## 贡献指南

1. Fork本仓库
2. 创建特性分支: `git checkout -b my-new-feature`
3. 提交更改: `git commit -am 'Add some feature'`
4. 推送到分支: `git push origin my-new-feature`
5. 提交Pull Request

## 许可证

MIT