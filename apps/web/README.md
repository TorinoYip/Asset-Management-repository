# Web 应用

这里是资产看板前端应用的预留入口。

在确定技术栈前，不提交一次性页面代码。建议后续初始化为 TypeScript 前端应用，并遵循：

- 页面路由与 `docs/product/information-architecture.md` 对齐；
- 指标字段与 `packages/domain` 中的领域模型对齐；
- 通用卡片、图表容器、筛选器与表格放入 `packages/ui`；
- 页面只负责组合组件和调用数据服务，不在视图中重复计算业务指标。
