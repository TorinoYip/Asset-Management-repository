# Asset Management Dashboard

面向风电、储能资产经营与运营管理的看板设计仓库。当前阶段以 V2 信息架构、指标口径和可编辑设计源稿为核心，为后续前端开发保留清晰边界。

## 快速入口

- [V2 信息架构](docs/product/information-architecture.md)
- [指标字典](docs/data/metric-dictionary.md)
- [Draw.io 可编辑源稿](design/drawio/asset-dashboard-v2-navigation.drawio)
- [V1 原始参考图](资产看板_V1.png)

## 仓库结构

```text
.
├── apps/
│   └── web/                  # 前端应用入口（技术栈确认后初始化）
├── packages/
│   ├── domain/               # 指标、资产与业务领域模型
│   └── ui/                   # 可复用看板组件与设计令牌
├── docs/
│   ├── product/              # 页面层级、用户路径与范围定义
│   └── data/                 # 指标口径、维度、刷新频率与数据责任
├── design/
│   ├── drawio/               # 可编辑设计源稿
│   └── exports/              # 由源稿导出的 PNG / SVG / PDF
└── 资产看板_V1.png           # V1 需求基线，暂不覆盖
```

## 版本约定

- V1 图片只作为需求基线，不在原文件上直接覆盖。
- Draw.io 文件是信息架构与导览关系的唯一可编辑源稿。
- 导出图片放入 `design/exports/`，文件名使用 `asset-dashboard-v{n}-{view}.{ext}`。
- 指标名称或公式变更先更新指标字典，再更新设计稿和代码。
- 页面、组件和领域模型分别归入 `apps/web`、`packages/ui`、`packages/domain`，避免业务口径散落在视图代码中。

## 当前状态

本分支完成 V2 仓库骨架与第一版导览关系图。下一步是在 V2 设计稿中补齐页面级线框、筛选器、钻取路径和交互状态，再决定前端技术栈。
