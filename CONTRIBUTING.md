# 贡献指南

感谢您考虑为XAI Finance项目贡献代码！本文档将指导您完成贡献流程。

## 开发流程

1. 分叉(Fork)项目仓库
2. 克隆您的分叉到本地
3. 创建一个新的分支
4. 进行开发工作
5. 提交您的更改
6. 创建Pull Request

## 详细步骤

### 1. 分叉(Fork)仓库

在GitHub上访问[XAI Finance仓库](https://github.com/xai-finance/xai-finance)，点击右上角的"Fork"按钮创建属于您的分叉。

### 2. 克隆您的分叉

```bash
git clone https://github.com/您的用户名/xai-finance.git
cd xai-finance
```

### 3. 添加原始仓库作为远程源

```bash
git remote add upstream https://github.com/xai-finance/xai-finance.git
```

### 4. 创建新分支

为您的功能或修复创建新分支：

```bash
git checkout -b feature/your-feature-name
# 或者
git checkout -b fix/your-bugfix-name
```

分支命名约定：
- `feature/` - 用于新功能
- `fix/` - 用于错误修复
- `docs/` - 用于文档更改
- `refactor/` - 用于代码重构

### 5. 进行开发

现在您可以开始进行代码开发。请确保遵循我们的代码规范。

### 6. 提交您的更改

```bash
# 添加更改的文件
git add .

# 提交更改
git commit -m "feat: 添加新功能的描述"
```

**提交消息格式:**

我们使用[约定式提交](https://www.conventionalcommits.org/)规范：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

类型包括：
- `feat:` - 新功能
- `fix:` - Bug修复
- `docs:` - 文档更改
- `style:` - 不影响代码含义的更改（空格、格式化等）
- `refactor:` - 既不修复bug也不添加功能的代码更改
- `perf:` - 性能改进
- `test:` - 添加缺失的测试或修正现有测试
- `chore:` - 构建过程或辅助工具的变动

### 7. 保持您的分支与主仓库同步

```bash
git fetch upstream
git rebase upstream/main
```

### 8. 推送到您的分叉

```bash
git push origin feature/your-feature-name
```

### 9. 创建Pull Request

1. 在GitHub上导航到您的分叉
2. 点击"Pull Request"按钮
3. 选择您的分支和要合并到的目标分支
4. 填写PR模板，提供清晰的描述
5. 提交PR

## 代码规范

### 前端规范

- 使用TypeScript类型定义
- 使用函数组件和React Hooks
- 遵循ESLint规则
- CSS使用Tailwind工具类

### 后端规范

- 遵循PEP 8风格指南
- 为所有函数添加文档字符串
- 编写单元测试

## 开发环境设置

请参考[README.md](README.md)中的"开发环境设置"部分。

## 测试

在提交PR之前，请确保：

1. 所有已有测试都能通过：
```bash
npm test
```

2. 为新功能或修复添加适当的测试
3. 代码格式检查通过：
```bash
npm run lint
```

## 文档

如果您的更改影响用户体验或添加新功能，请更新相关文档：

- README.md - 项目概述和基本说明
- API_README.md - API文档
- 组件或页面的注释

## 问题和讨论

如果您有任何问题或想法，请：

1. 查看现有问题(Issues)和讨论(Discussions)
2. 如果没有找到相关话题，创建一个新的Issue

## 行为准则

- 尊重所有项目贡献者
- 提供建设性的反馈
- 接受建设性的批评
- 关注项目的最佳利益

感谢您的贡献！ 