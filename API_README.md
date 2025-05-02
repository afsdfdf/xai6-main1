# XAI Finance API服务

这是XAI Finance应用的Python Flask后端API服务器，提供加密货币数据、用户资产和NFT信息的接口。

## 主要功能

- 📊 获取热门代币数据和价格走势
- 💰 提供模拟钱包资产信息
- 🖼️ 管理NFT资产元数据
- 🔒 用户认证和授权
- 📈 市场行情和交易数据

## 安装设置

### 系统要求

- Python 3.8+
- pip

### 安装依赖

```bash
# 创建并激活虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
```

## 运行服务器

### 开发环境

```bash
python api_server.py
```

服务将在 http://localhost:5000 启动，并开启调试模式。

### 生产环境

对于生产环境，推荐使用WSGI服务器：

```bash
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

或者使用uWSGI：

```bash
uwsgi --http 0.0.0.0:5000 --module api_server:app --processes 4 --threads 2
```

## API端点说明

### 代币数据

#### GET /api/token-boosts

获取热门代币列表及其相关数据。

**响应格式：**

```json
{
  "tokens": [
    {
      "name": "Bitcoin",
      "symbol": "BTC",
      "address": "0x...",
      "logo": "https://example.com/btc.png",
      "price": 65000.50,
      "chain": "ethereum",
      "change24h": 2.5,
      "marketCap": 1250000000000
    },
    ...
  ],
  "count": 20,
  "success": true,
  "timestamp": 1658912345.67
}
```

#### GET /api/tokens/price/:address

获取指定代币的价格信息。

**参数：**
- `address`: 代币合约地址

**响应：**

```json
{
  "symbol": "ETH",
  "name": "Ethereum",
  "price": 3500.75,
  "change24h": -1.2,
  "success": true
}
```

### NFT数据

#### GET /api/nfts/user/:address

获取指定用户的NFT资产。

**参数：**
- `address`: 用户钱包地址

**响应：**

```json
{
  "nfts": [
    {
      "id": "1",
      "name": "PVP Gameplay #1",
      "collection": "XAI Gaming Collection",
      "image": "/nft-images/pvp-gameplay.jpg",
      "floorPrice": 0.15,
      "currency": "ETH"
    },
    ...
  ],
  "success": true
}
```

### 系统状态

#### GET /health

健康检查端点。

**响应：**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": 1658912345.67
}
```

## 缓存机制

API实现了一个简单的内存缓存，缓存有效期为5分钟，以减少对外部API的调用频率。

## 错误处理

API返回适当的HTTP状态码和错误消息：

- 200: 成功响应
- 400: 请求参数错误
- 404: 资源未找到
- 500: 服务器错误

错误响应格式：

```json
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "success": false
}
```

## 与前端集成

### 在Next.js中使用API

在前端React组件中调用API示例：

```typescript
// 获取热门代币
async function fetchHotTokens() {
  try {
    const response = await fetch('/api/token-boosts');
    const data = await response.json();
    if (data.success) {
      return data.tokens;
    }
    throw new Error(data.error || '获取数据失败');
  } catch (error) {
    console.error('API错误:', error);
    return [];
  }
}

// 组件中使用
useEffect(() => {
  fetchHotTokens().then(tokens => {
    setTokenData(tokens);
  });
}, []);
```

### 环境配置

在Next.js的`.env.local`中配置API地址：

```
# 本地开发
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"

# 生产环境
# NEXT_PUBLIC_API_BASE_URL="https://api.你的域名.com"
```

## 开发扩展

### 添加新端点

要添加新的API端点，请按照以下步骤：

1. 在`api_server.py`中定义新的路由和处理函数
2. 实现数据获取和处理逻辑
3. 返回标准格式的JSON响应
4. 更新文档

示例:

```python
@app.route('/api/new-endpoint', methods=['GET'])
def new_endpoint():
    try:
        # 实现逻辑
        data = {"result": "数据"}
        return jsonify({"data": data, "success": True})
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500
```

## 许可证

MIT 