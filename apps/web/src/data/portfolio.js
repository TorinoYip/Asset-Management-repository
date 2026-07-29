const state = {
  route: "overview",
  month: "2025-07",
  province: "all",
  station: "all",
  assetFilter: "wind",
  businessType: "wind",
  businessMetric: "margin",
  operationsType: "wind",
  operationsMetric: "availability",
  compareMonth: 6,
  typeAsset: "wind",
  typePeriod: "ytd",
  tableProvince: "all",
  tableStation: "all",
  mapStation: null,
  mapOwnedVisible: true,
  mapManagedVisible: true,
  mapMarginLayer: true,
  selectedAssets: new Set()
};

const routes = ["overview", "revenue", "types", "stations", "mengxi"];

const provinceMeta = {
  all: { label: "全部省份", factor: 1 },
  hebei: { label: "河北省", factor: .31 },
  "inner-mongolia": { label: "内蒙古", factor: .28 },
  shandong: { label: "山东省", factor: .22 },
  zhejiang: { label: "浙江省", factor: .19 },
  guangxi: { label: "广西", factor: 0 },
  henan: { label: "河南省", factor: 0 },
  anhui: { label: "安徽省", factor: 0 },
  gansu: { label: "甘肃省", factor: 0 },
  heilongjiang: { label: "黑龙江省", factor: 0 },
  jiangsu: { label: "江苏省", factor: 0 },
  qinghai: { label: "青海省", factor: 0 },
  ningxia: { label: "宁夏", factor: 0 },
  yunnan: { label: "云南省", factor: 0 }
};

const typeLabels = {
  wind: "风电",
  storage: "储能",
  distributed: "分布式"
};

const stationRecords = [
  { id: "beichen-wind", name: "北辰风电场", type: "wind", province: "hebei", ownership: "owned", mapX: 65.5, mapY: 42.7, size: "160 MW", capacity: 160, turbines: 25, revenue: .86, cost: .50, margin: .36, attainment: 105.4, ops: "可利用率 98.1%", status: "good" },
  { id: "fengning-wind", name: "丰宁风电场", type: "wind", province: "hebei", ownership: "managed", mapX: 66.5, mapY: 41.6, size: "140 MW", capacity: 140, turbines: 22, revenue: .77, cost: .46, margin: .31, attainment: 101.6, ops: "可利用率 97.8%", status: "good" },
  { id: "baiyunxia-wind", name: "白云峡风电场", type: "wind", province: "hebei", ownership: "owned", mapX: 67.2, mapY: 43.6, size: "100 MW", capacity: 100, turbines: 17, revenue: .55, cost: .34, margin: .21, attainment: 98.8, ops: "可利用率 97.3%", status: "good" },
  { id: "fengning-storage", name: "丰宁储能电站", type: "storage", province: "hebei", ownership: "owned", mapX: 66.2, mapY: 43.2, size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .75, cost: .43, margin: .32, attainment: 109.7, ops: "综合效率 88.6%", status: "good" },

  { id: "wulan-wind", name: "乌兰风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 122.05, latitude: 46.08, size: "180 MW", capacity: 180, turbines: 29, revenue: .92, cost: .57, margin: .35, attainment: 103.2, ops: "可利用率 97.6%", status: "good" },
  { id: "damao-wind", name: "达茂风电场", type: "wind", province: "inner-mongolia", ownership: "managed", mapX: 62.2, mapY: 29.1, size: "160 MW", capacity: 160, turbines: 25, revenue: .83, cost: .53, margin: .30, attainment: 99.1, ops: "可利用率 96.9%", status: "good" },
  { id: "ordos-storage", name: "鄂尔多斯储能电站", type: "storage", province: "inner-mongolia", ownership: "owned", mapX: 59.2, mapY: 31.0, size: "80 MW / 160 MWh", power: 80, energy: 160, revenue: .61, cost: .36, margin: .25, attainment: 103.6, ops: "综合效率 87.9%", status: "good" },
  { id: "mengxi-storage", name: "蒙西调频储能电站", type: "storage", province: "inner-mongolia", ownership: "managed", mapX: 63.3, mapY: 27.1, size: "60 MW / 120 MWh", power: 60, energy: 120, revenue: .46, cost: .29, margin: .17, attainment: 97.2, ops: "综合效率 86.7%", status: "watch" },

  { id: "haiyue-wind", name: "海岳风电场", type: "wind", province: "shandong", ownership: "owned", mapX: 71.0, mapY: 46.5, size: "150 MW", capacity: 150, turbines: 24, revenue: .75, cost: .50, margin: .25, attainment: 84.0, ops: "可利用率 94.8%", status: "bad" },
  { id: "lingang-wind", name: "临港风电场", type: "wind", province: "shandong", ownership: "managed", mapX: 73.0, mapY: 48.0, size: "120 MW", capacity: 120, turbines: 19, revenue: .64, cost: .40, margin: .24, attainment: 96.5, ops: "可利用率 96.2%", status: "watch" },
  { id: "lingang-storage", name: "临港储能电站", type: "storage", province: "shandong", ownership: "owned", mapX: 72.0, mapY: 49.5, size: "80 MW / 160 MWh", power: 80, energy: 160, revenue: .58, cost: .34, margin: .24, attainment: 104.0, ops: "综合效率 88.2%", status: "good" },

  { id: "zhoushan-wind", name: "舟山风电场", type: "wind", province: "zhejiang", ownership: "owned", mapX: 77.2, mapY: 67.5, size: "130 MW", capacity: 130, turbines: 20, revenue: .68, cost: .42, margin: .26, attainment: 102.1, ops: "可利用率 97.5%", status: "good" },
  { id: "haining-wind", name: "海宁风电场", type: "wind", province: "zhejiang", ownership: "managed", mapX: 74.8, mapY: 67.8, size: "120 MW", capacity: 120, turbines: 18, revenue: .63, cost: .38, margin: .25, attainment: 100.4, ops: "可利用率 97.1%", status: "good" },
  { id: "shaoxing-storage", name: "绍兴储能电站", type: "storage", province: "zhejiang", ownership: "managed", mapX: 75.8, mapY: 69.2, size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .71, cost: .43, margin: .28, attainment: 101.8, ops: "综合效率 87.6%", status: "good" }
];

/*
 * 地图专用扩展示例。该数据集只参与省份收入分档、点位和悬浮卡片，
 * 不进入经营、运营、资产构成与资产明细页面。
 */
const additionalMapStations = [
  { id: "qingshuihe-wind", name: "清水河风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 111.65, latitude: 39.92, size: "120 MW", capacity: 120, turbines: 20, revenue: .66, cost: .40, margin: .26, attainment: 103.5, ops: "可利用率 97.4%", status: "good", mapOnly: true },
  { id: "lingshan-wind", name: "灵山风电场", type: "wind", province: "guangxi", ownership: "owned", longitude: 109.29, latitude: 22.42, size: "100 MW", capacity: 100, turbines: 17, revenue: .60, cost: .39, margin: .21, attainment: 101.8, ops: "可利用率 96.9%", status: "good", mapOnly: true },
  { id: "sanmenxia-wind", name: "三门峡风电场", type: "wind", province: "henan", ownership: "owned", longitude: 111.20, latitude: 34.78, size: "150 MW", capacity: 150, turbines: 25, revenue: .78, cost: .51, margin: .27, attainment: 98.4, ops: "可利用率 96.5%", status: "watch", mapOnly: true },
  { id: "anhui-binzhou-wind", name: "安徽滨州风电场", type: "wind", province: "anhui", ownership: "owned", longitude: 117.38, latitude: 33.05, size: "100 MW", capacity: 100, turbines: 17, revenue: .57, cost: .36, margin: .21, attainment: 102.2, ops: "可利用率 97.0%", status: "good", mapOnly: true },
  { id: "minqin-wind", name: "民勤风电场", type: "wind", province: "gansu", ownership: "owned", longitude: 103.09, latitude: 38.62, size: "200 MW", capacity: 200, turbines: 32, revenue: .96, cost: .64, margin: .32, attainment: 96.8, ops: "可利用率 96.1%", status: "watch", mapOnly: true },
  { id: "puyang-wind", name: "濮阳风电场", type: "wind", province: "henan", ownership: "managed", longitude: 115.03, latitude: 35.76, size: "120 MW", capacity: 120, turbines: 20, revenue: .65, cost: .43, margin: .22, attainment: 101.1, ops: "可利用率 97.1%", status: "good", mapOnly: true },
  { id: "bameng-wind", name: "巴盟风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 107.39, latitude: 40.75, size: "180 MW", capacity: 180, turbines: 29, revenue: .89, cost: .58, margin: .31, attainment: 100.7, ops: "可利用率 97.0%", status: "good", mapOnly: true },
  { id: "siziwang-wind", name: "四子王风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 111.71, latitude: 41.53, size: "160 MW", capacity: 160, turbines: 26, revenue: .76, cost: .51, margin: .25, attainment: 94.6, ops: "可利用率 95.7%", status: "bad", mapOnly: true },
  { id: "ximeng-wind", name: "锡盟风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 116.05, latitude: 43.95, size: "220 MW", capacity: 220, turbines: 35, revenue: 1.08, cost: .70, margin: .38, attainment: 104.3, ops: "可利用率 97.8%", status: "good", mapOnly: true },
  { id: "wuhai-wind", name: "乌海风电场", type: "wind", province: "inner-mongolia", ownership: "owned", longitude: 106.82, latitude: 39.66, size: "100 MW", capacity: 100, turbines: 17, revenue: .48, cost: .33, margin: .15, attainment: 92.7, ops: "可利用率 95.2%", status: "bad", mapOnly: true },
  { id: "gushanliang-wind", name: "谷山梁风电场", type: "wind", province: "inner-mongolia", ownership: "managed", longitude: 109.62, latitude: 39.08, size: "150 MW", capacity: 150, turbines: 24, revenue: .73, cost: .48, margin: .25, attainment: 99.3, ops: "可利用率 96.6%", status: "watch", mapOnly: true },
  { id: "wuzhongqi-storage", name: "乌中旗储能电站", type: "storage", province: "inner-mongolia", ownership: "owned", longitude: 108.52, latitude: 41.57, size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .73, cost: .45, margin: .28, attainment: 102.4, ops: "综合效率 88.1%", status: "good", mapOnly: true },
  { id: "anhui-jingtai-storage", name: "安徽景泰储能电站", type: "storage", province: "anhui", ownership: "owned", longitude: 117.23, latitude: 31.82, size: "80 MW / 160 MWh", power: 80, energy: 160, revenue: .55, cost: .36, margin: .19, attainment: 97.8, ops: "综合效率 87.3%", status: "watch", mapOnly: true },
  { id: "longjiang-wind", name: "龙江风电场", type: "wind", province: "heilongjiang", ownership: "owned", longitude: 123.20, latitude: 47.34, size: "200 MW", capacity: 200, turbines: 32, revenue: 1.02, cost: .65, margin: .37, attainment: 103.8, ops: "可利用率 97.7%", status: "good", mapOnly: true },
  { id: "rongshui-wind", name: "融水风配储项目·风电", type: "wind", province: "guangxi", ownership: "owned", longitude: 109.22, latitude: 25.09, size: "120 MW", capacity: 120, turbines: 20, revenue: .67, cost: .43, margin: .24, attainment: 101.2, ops: "可利用率 97.0%", status: "good", mapOnly: true },
  { id: "rongshui-storage", name: "融水风配储项目·储能", type: "storage", province: "guangxi", ownership: "owned", longitude: 109.34, latitude: 25.00, size: "40 MW / 80 MWh", power: 40, energy: 80, revenue: .30, cost: .19, margin: .11, attainment: 100.5, ops: "综合效率 87.8%", status: "good", mapOnly: true },
  { id: "guiping-wind", name: "桂平风电场", type: "wind", province: "guangxi", ownership: "owned", longitude: 110.08, latitude: 23.39, size: "100 MW", capacity: 100, turbines: 17, revenue: .56, cost: .37, margin: .19, attainment: 95.9, ops: "可利用率 96.0%", status: "watch", mapOnly: true },
  { id: "jiangyin-wind", name: "江阴风电场", type: "wind", province: "jiangsu", ownership: "owned", longitude: 120.28, latitude: 31.91, size: "100 MW", capacity: 100, turbines: 16, revenue: .63, cost: .39, margin: .24, attainment: 104.6, ops: "可利用率 97.9%", status: "good", mapOnly: true },
  { id: "sheyang-wind", name: "射阳风电场", type: "wind", province: "jiangsu", ownership: "owned", longitude: 120.25, latitude: 33.77, size: "200 MW", capacity: 200, turbines: 32, revenue: 1.18, cost: .75, margin: .43, attainment: 102.7, ops: "可利用率 97.5%", status: "good", mapOnly: true },
  { id: "gonghe-storage", name: "共和储能电站", type: "storage", province: "qinghai", ownership: "owned", longitude: 100.62, latitude: 36.28, size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .69, cost: .43, margin: .26, attainment: 101.5, ops: "综合效率 88.0%", status: "good", mapOnly: true },
  { id: "yanchi-wind", name: "盐池风电场", type: "wind", province: "ningxia", ownership: "owned", longitude: 107.41, latitude: 37.78, size: "150 MW", capacity: 150, turbines: 24, revenue: .72, cost: .49, margin: .23, attainment: 97.1, ops: "可利用率 96.4%", status: "watch", mapOnly: true },
  { id: "dali-wind", name: "大理风电场", type: "wind", province: "yunnan", ownership: "managed", longitude: 100.27, latitude: 25.61, size: "120 MW", capacity: 120, turbines: 20, revenue: .70, cost: .44, margin: .26, attainment: 103.0, ops: "可利用率 97.2%", status: "good", mapOnly: true }
];

const mapStationRecords = [...stationRecords, ...additionalMapStations];

const provincePortfolio = {
  hebei: { label: "河北省", status: "整体正常", margin: "¥ 1.20 亿", attainment: "103.8%", operations: "风电 97.7% / 储能 88.6%" },
  "inner-mongolia": { label: "内蒙古", status: "1 项关注", margin: "¥ 1.07 亿", attainment: "100.6%", operations: "风电 97.3% / 储能 87.3%" },
  shandong: { label: "山东省", status: "2 项关注", margin: "¥ 0.73 亿", attainment: "93.7%", operations: "风电 95.5% / 储能 88.2%" },
  zhejiang: { label: "浙江省", status: "整体正常", margin: "¥ 0.79 亿", attainment: "101.5%", operations: "风电 97.3% / 储能 87.6%" }
};

const compositionRows = [
  { province: "hebei", wind: 3, storage: 1, total: 4, windCapacity: "400 MW", turbines: "64 台", storagePower: "100 MW", storageCapacity: "200 MWh", windShare: 75 },
  { province: "inner-mongolia", wind: 2, storage: 2, total: 4, windCapacity: "340 MW", turbines: "54 台", storagePower: "140 MW", storageCapacity: "280 MWh", windShare: 50 },
  { province: "shandong", wind: 2, storage: 1, total: 3, windCapacity: "270 MW", turbines: "42 台", storagePower: "80 MW", storageCapacity: "160 MWh", windShare: 67 },
  { province: "zhejiang", wind: 2, storage: 1, total: 3, windCapacity: "250 MW", turbines: "39 台", storagePower: "100 MW", storageCapacity: "200 MWh", windShare: 67 }
];

const businessData = {
  wind: {
    label: "风电组合", actual: 2.74, target: 2.88, annual: 5.10, revenue: 6.92, cost: 4.18,
    monthly: [31, 35, 39, 40, 43, 40, 46], targetMonthly: [33, 36, 40, 42, 42, 45, 50],
    bridge: [["电量收入", 5.91, 85], ["其他收入", 1.01, 15], ["运营成本", 4.18, 60]],
    ranks: [
      ["北辰风电场", .36, .34, "+5.9%", "105.9%", "61.2%", "good"],
      ["乌兰风电场", .35, .34, "+2.9%", "102.9%", "58.4%", "good"],
      ["丰宁风电场", .31, .31, "0.0%", "100.0%", "56.4%", "good"],
      ["临港风电场", .24, .25, "−4.0%", "96.0%", "52.1%", "watch"],
      ["海岳风电场", .25, .30, "−16.7%", "83.3%", "43.7%", "bad"]
    ]
  },
  storage: {
    label: "储能组合", actual: 1.08, target: 1.04, annual: 1.86, revenue: 2.84, cost: 1.76,
    monthly: [12, 14, 15, 16, 17, 16, 18], targetMonthly: [13, 14, 15, 15, 16, 16, 15],
    bridge: [["容量租赁", 1.64, 58], ["峰谷套利", 1.20, 42], ["运营成本", 1.76, 62]],
    ranks: [
      ["丰宁储能电站", .32, .29, "+10.3%", "110.3%", "64.8%", "good"],
      ["绍兴储能电站", .28, .27, "+3.7%", "103.7%", "59.2%", "good"],
      ["鄂尔多斯储能电站", .25, .24, "+4.2%", "104.2%", "57.1%", "good"],
      ["临港储能电站", .24, .23, "+4.3%", "104.3%", "55.0%", "good"],
      ["蒙西调频储能电站", .17, .18, "−5.6%", "94.4%", "48.0%", "watch"]
    ]
  }
};

const operationsData = {
  wind: {
    primary: { overline: "风电核心运营指标", value: "97.2", unit: "%", name: "风机可利用率", delta: "高于目标 +0.4pp", context: "组合加权，199 台风机" },
    kpis: [["YTD 上网电量", "1,846 GWh", "距累计目标 −1.6%", "negative"], ["限电率", "3.1%", "环比下降 0.3pp", "positive"], ["计划损失率", "1.2%", "目标内 0.2pp", "positive"], ["非计划损失率", "1.6%", "高于目标 0.4pp", "negative"]],
    metrics: { availability: ["可利用率", "%"], curtailment: ["限电率", "%"], mttr: ["故障 MTTR", "h"], unplanned: ["非计划损失率", "%"] },
    comparison: {
      availability: [["WT-03", "北辰风电场", 99.1], ["WT-11", "乌兰风电场", 98.2], ["WT-08", "舟山风电场", 97.6], ["WT-21", "丰宁风电场", 96.8], ["WT-17", "海岳风电场", 94.8]],
      curtailment: [["WT-03", "北辰风电场", 1.3], ["WT-11", "乌兰风电场", 2.1], ["WT-08", "舟山风电场", 2.7], ["WT-21", "丰宁风电场", 3.5], ["WT-17", "海岳风电场", 6.8]],
      mttr: [["WT-03", "北辰风电场", 2.2], ["WT-11", "乌兰风电场", 3.1], ["WT-08", "舟山风电场", 4.0], ["WT-21", "丰宁风电场", 5.4], ["WT-17", "海岳风电场", 9.6]],
      unplanned: [["WT-03", "北辰风电场", .4], ["WT-11", "乌兰风电场", .8], ["WT-08", "舟山风电场", 1.3], ["WT-21", "丰宁风电场", 1.8], ["WT-17", "海岳风电场", 4.7]]
    },
    maintenance: ["6", "5.8h", "21.4h", "海岳 · WT-17", "可利用率连续两月低于目标"]
  },
  storage: {
    primary: { overline: "储能核心运营指标", value: "87.8", unit: "%", name: "储能综合效率", delta: "低于目标 −0.7pp", context: "组合加权，5 座储能电站" },
    kpis: [["YTD 充电量", "697 GWh", "距累计目标 +0.8%", "positive"], ["YTD 放电量", "612 GWh", "距累计目标 +1.8%", "positive"], ["容量可利用率", "92.6%", "低于目标 0.5pp", "negative"], ["时间可利用率", "98.3%", "高于目标 0.3pp", "positive"]],
    metrics: { efficiency: ["综合效率", "%"], capacity: ["容量可利用率", "%"], time: ["时间可利用率", "%"], mttr: ["故障 MTTR", "h"] },
    comparison: {
      efficiency: [["丰宁储能", "河北省", 89.4], ["临港储能", "山东省", 88.6], ["鄂尔多斯储能", "内蒙古", 87.9], ["绍兴储能", "浙江省", 87.6], ["蒙西调频储能", "内蒙古", 85.5]],
      capacity: [["丰宁储能", "河北省", 95.2], ["临港储能", "山东省", 94.1], ["鄂尔多斯储能", "内蒙古", 92.8], ["绍兴储能", "浙江省", 91.7], ["蒙西调频储能", "内蒙古", 88.4]],
      time: [["丰宁储能", "河北省", 99.1], ["临港储能", "山东省", 98.8], ["鄂尔多斯储能", "内蒙古", 98.2], ["绍兴储能", "浙江省", 97.9], ["蒙西调频储能", "内蒙古", 96.7]],
      mttr: [["丰宁储能", "河北省", 2.4], ["临港储能", "山东省", 3.2], ["鄂尔多斯储能", "内蒙古", 4.1], ["绍兴储能", "浙江省", 4.8], ["蒙西调频储能", "内蒙古", 7.3]]
    },
    maintenance: ["2", "4.4h", "12.6h", "蒙西调频储能 · PCS-06", "综合效率与容量可利用率低于目标"]
  }
};

const settlementData = {
  wind: [
    ["电量结算收入", "1,080", "1,045", "+35", "6,260", "6,140", "上网电量与综合电价共同影响"],
    ["绿色权益收入", "118", "105", "+13", "662", "630", "绿证及其他权益"],
    ["运维成本", "−316", "−298", "−18", "−1,842", "−1,780", "非计划检修成本偏高"],
    ["其他成本", "−94", "−96", "+2", "−536", "−552", "总体稳定"]
  ],
  storage: [
    ["容量租赁收入", "465", "452", "+13", "2,680", "2,610", "容量租赁兑现"],
    ["充放电价差", "342", "326", "+16", "1,920", "1,845", "峰谷价差与日均次数共同影响"],
    ["辅助服务收入", "126", "119", "+7", "714", "690", "调频与备用服务"],
    ["运营成本", "−378", "−362", "−16", "−2,218", "−2,140", "电损与维护成本"]
  ]
};
