# AIGC数据分析平台

AIGC数据分析平台是一个基于大模型驱动的智能数据分析系统，集成了易步分析、同步分析、代码分析、图表分析、报告分析等多种智能分析能力，助力用户高效完成数据洞察与决策。

## 平台特色
- **易步分析**：通过自然语言描述，平台自动理解并分步完成数据分析任务。
- **同步分析**：支持多用户协同、实时同步分析，提升团队协作效率。
- **代码分析**：自动解析、理解和优化数据分析相关代码。
- **图表分析**：智能生成可视化图表，辅助数据洞察。
- **报告分析**：自动生成结构化分析报告，便于成果沉淀与分享。

## 技术亮点
- **大模型驱动**：依赖 chatgpt4o-mini 模型，具备强大的自然语言理解与推理能力。
- **开放API接入**：采用 [openapi.933999.xyz](https://openapi.933999.xyz) 提供的免费大模型接口，无需自建模型服务。
- **现代技术栈**：后端基于 Spring Boot，前端采用 React，界面美观、交互流畅。

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/shuguangnet/Aigc-Analysis.git
```

### 2. 安装依赖
#### 前端
```bash
cd frontend
npm install
```
#### 后端
```bash
cd backend
./mvnw clean install
```

### 3. 启动项目
#### 启动后端
```bash
cd backend
./mvnw spring-boot:run
```
#### 启动前端
```bash
cd frontend
npm start
```

### 4. 访问平台
浏览器访问 [http://localhost:3000](http://localhost:3000) 即可体验。

## 主要依赖
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Ant Design](https://ant.design/)
- [@umijs/max](https://umijs.org/)
- [openapi.933999.xyz](https://openapi.933999.xyz)
- [chatgpt4o-mini](https://openai.com/)

## 开源协议
本项目采用 MIT 开源协议，欢迎学习与二次开发。

---

如有问题或建议，欢迎提交 Issue 或 PR 参与共建！
