# Asset Management Dashboard

面向风电与储能资产经营管理的内部透视看板。当前 V2 聚焦清晰呈现资产组合、经营结果和运营表现，支持从组合到站点及风机单机月度对比；诊断、工单和行动闭环作为后续扩展。

## V2 架构预览

[![资产看板 V2 主架构、相对布局与信息流](design/exports/asset-dashboard-v2-navigation.svg)](design/drawio/asset-dashboard-v2-navigation.drawio)

> 点击图片可查看对应的 draw.io 可编辑源稿。图中实线表示 V2 当前交互，灰色虚线表示后续 +1/+2 诊断与行动闭环。

## 快速入口

- [V2 信息架构](docs/product/information-architecture.md)
- [V2 页面与交互规范](docs/product/v2-page-specification.md)
- [指标字典](docs/data/metric-dictionary.md)
- [Draw.io 可编辑源稿](design/drawio/asset-dashboard-v2-navigation.drawio)
- [V1 原始参考图](资产看板_V1.png)

## 仓库结构

```text
.
├── apps/
│   └── web/                  # 前端应用入口（实现阶段初始化）
├── packages/
│   ├── domain/               # 指标、资产层级、筛选上下文与业务模型
│   └── ui/                   # KPI、地图、趋势、排名、表格等共享组件
├── docs/
│   ├── product/
│   │   ├── information-architecture.md
│   │   └── v2-page-specification.md
│   └── data/
│       └── metric-dictionary.md
├── design/
│   ├── drawio/
│   │   └── asset-dashboard-v2-navigation.drawio
│   └── exports/
│       └── asset-dashboard-v2-navigation.svg
└── 资产看板_V1.png           # V1 需求基线，不覆盖
```

## V2 当前状态

已确定：

- 三个一级页面：资产总览、经营看板、运营看板；
- 月度为最小分析粒度，日度日报不属于本架构；
- 经营同时使用全年目标、截至当月累计目标和实际 YTD；
- 经营看板按风电/储能切换，包含 YTD、逐月趋势和逐站对比；
- 运营看板按风电/储能切换，包含站点聚合、风机单机月度或储能电站月度对比；
- 首页使用站点经纬度构建资产地图；
- 运维作为运营页中的次级异常摘要，不与运营并列；
- 全局筛选与同比/环比保留为后续交互能力。

暂不纳入 V2：

- 日度日报；
- 设备诊断与根因分析；
- 告警—工单—处置闭环；
- 合同、质保、保险、合规和服务商责任归因；
- 技术损失的严格货币化评估。

## 版本约定

- V1 图片只作为需求基线，不直接覆盖。
- Draw.io 是架构、布局和交互关系的可编辑源稿。
- SVG 是 README 展示文件，不直接编辑。
- 指标口径先更新指标字典，再更新设计稿和代码。
