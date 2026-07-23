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
  detailType: "all",
  detailSearch: "",
  mapProvince: "hebei",
  selectedAssets: new Set()
};

const routes = ["overview", "revenue", "types", "stations", "mengxi"];

const provinceMeta = {
  all: { label: "全部省份", factor: 1 },
  hebei: { label: "河北省", factor: .31 },
  "inner-mongolia": { label: "内蒙古", factor: .28 },
  shandong: { label: "山东省", factor: .22 },
  zhejiang: { label: "浙江省", factor: .19 }
};

const typeLabels = {
  wind: "风电",
  storage: "储能",
  distributed: "分布式"
};

const stationRecords = [
  { id: "beichen-wind", name: "北辰风电场", type: "wind", province: "hebei", size: "160 MW", capacity: 160, turbines: 25, revenue: .86, cost: .50, margin: .36, attainment: 105.4, ops: "可利用率 98.1%", status: "good" },
  { id: "fengning-wind", name: "丰宁风电场", type: "wind", province: "hebei", size: "140 MW", capacity: 140, turbines: 22, revenue: .77, cost: .46, margin: .31, attainment: 101.6, ops: "可利用率 97.8%", status: "good" },
  { id: "baiyunxia-wind", name: "白云峡风电场", type: "wind", province: "hebei", size: "100 MW", capacity: 100, turbines: 17, revenue: .55, cost: .34, margin: .21, attainment: 98.8, ops: "可利用率 97.3%", status: "good" },
  { id: "fengning-storage", name: "丰宁储能电站", type: "storage", province: "hebei", size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .75, cost: .43, margin: .32, attainment: 109.7, ops: "综合效率 88.6%", status: "good" },

  { id: "wulan-wind", name: "乌兰风电场", type: "wind", province: "inner-mongolia", size: "180 MW", capacity: 180, turbines: 29, revenue: .92, cost: .57, margin: .35, attainment: 103.2, ops: "可利用率 97.6%", status: "good" },
  { id: "damao-wind", name: "达茂风电场", type: "wind", province: "inner-mongolia", size: "160 MW", capacity: 160, turbines: 25, revenue: .83, cost: .53, margin: .30, attainment: 99.1, ops: "可利用率 96.9%", status: "good" },
  { id: "ordos-storage", name: "鄂尔多斯储能电站", type: "storage", province: "inner-mongolia", size: "80 MW / 160 MWh", power: 80, energy: 160, revenue: .61, cost: .36, margin: .25, attainment: 103.6, ops: "综合效率 87.9%", status: "good" },
  { id: "mengxi-storage", name: "蒙西调频储能电站", type: "storage", province: "inner-mongolia", size: "60 MW / 120 MWh", power: 60, energy: 120, revenue: .46, cost: .29, margin: .17, attainment: 97.2, ops: "综合效率 86.7%", status: "watch" },

  { id: "haiyue-wind", name: "海岳风电场", type: "wind", province: "shandong", size: "150 MW", capacity: 150, turbines: 24, revenue: .75, cost: .50, margin: .25, attainment: 84.0, ops: "可利用率 94.8%", status: "bad" },
  { id: "lingang-wind", name: "临港风电场", type: "wind", province: "shandong", size: "120 MW", capacity: 120, turbines: 19, revenue: .64, cost: .40, margin: .24, attainment: 96.5, ops: "可利用率 96.2%", status: "watch" },
  { id: "lingang-storage", name: "临港储能电站", type: "storage", province: "shandong", size: "80 MW / 160 MWh", power: 80, energy: 160, revenue: .58, cost: .34, margin: .24, attainment: 104.0, ops: "综合效率 88.2%", status: "good" },

  { id: "zhoushan-wind", name: "舟山风电场", type: "wind", province: "zhejiang", size: "130 MW", capacity: 130, turbines: 20, revenue: .68, cost: .42, margin: .26, attainment: 102.1, ops: "可利用率 97.5%", status: "good" },
  { id: "haining-wind", name: "海宁风电场", type: "wind", province: "zhejiang", size: "120 MW", capacity: 120, turbines: 18, revenue: .63, cost: .38, margin: .25, attainment: 100.4, ops: "可利用率 97.1%", status: "good" },
  { id: "shaoxing-storage", name: "绍兴储能电站", type: "storage", province: "zhejiang", size: "100 MW / 200 MWh", power: 100, energy: 200, revenue: .71, cost: .43, margin: .28, attainment: 101.8, ops: "综合效率 87.6%", status: "good" }
];

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

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const formatMoney = value => `¥ ${value.toFixed(2)} 亿`;
const statusLabel = status => status === "good" ? "正常" : status === "watch" ? "关注" : "异常";

function stationCatalog(type = state.assetFilter) {
  return stationRecords.filter(record => type === "distributed" ? false : record.type === type);
}

function scopedRecords(type = state.assetFilter) {
  if (type === "distributed") return [];
  let records = stationRecords.filter(record => record.type === type);
  if (state.province !== "all") records = records.filter(record => record.province === state.province);
  if (state.station !== "all") records = records.filter(record => record.id === state.station);
  return records;
}

function financialRecord(record) {
  const typeRecords = stationRecords.filter(item => item.type === record.type);
  const data = businessData[record.type];
  const raw = typeRecords.reduce((sum, item) => {
    sum.revenue += item.revenue;
    sum.cost += item.cost;
    sum.margin += item.margin;
    sum.target += item.margin / (item.attainment / 100);
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, target: 0 });
  return {
    ...record,
    revenue: record.revenue * data.revenue / raw.revenue,
    cost: record.cost * data.cost / raw.cost,
    margin: record.margin * data.actual / raw.margin,
    marginTarget: (record.margin / (record.attainment / 100)) * data.target / raw.target
  };
}

function currentMonthIndex() {
  const month = Number(state.month.split("-")[1]) || 7;
  return Math.max(0, Math.min(month - 1, 6));
}

function financialSlice(type = state.assetFilter) {
  const data = businessData[type];
  const records = scopedRecords(type).map(financialRecord);
  if (!data) {
    return {
      type, records: [], actual: 0, target: 0, annual: 0, revenue: 0, cost: 0,
      attainment: 0, annualProgress: 0, actualFactor: 0, targetFactor: 0,
      monthIndex: currentMonthIndex(), scopeShare: 0, targetScopeShare: 0
    };
  }
  const monthIndex = currentMonthIndex();
  const actualFactor = data.monthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.monthly.reduce((sum, value) => sum + value, 0);
  const targetFactor = data.targetMonthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.targetMonthly.reduce((sum, value) => sum + value, 0);
  const july = records.reduce((sum, record) => {
    sum.revenue += record.revenue;
    sum.cost += record.cost;
    sum.margin += record.margin;
    sum.target += record.marginTarget;
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, target: 0 });
  const actual = july.margin * actualFactor;
  const target = july.target * targetFactor;
  const revenue = july.revenue * actualFactor;
  const cost = july.cost * actualFactor;
  const annual = july.target * (data.annual / data.target);
  return {
    type, records, data, actual, target, annual, revenue, cost,
    attainment: target ? actual / target * 100 : 0,
    annualProgress: annual ? actual / annual * 100 : 0,
    actualFactor, targetFactor, monthIndex,
    scopeShare: data.actual ? july.margin / data.actual : 0,
    targetScopeShare: data.target ? july.target / data.target : 0
  };
}

function assetScale(records) {
  return records.reduce((sum, record) => {
    if (record.type === "wind") {
      sum.wind += 1;
      sum.windCapacity += record.capacity || 0;
      sum.turbines += record.turbines || 0;
    } else if (record.type === "storage") {
      sum.storage += 1;
      sum.storagePower += record.power || 0;
      sum.storageEnergy += record.energy || 0;
    }
    if (record.status === "good") sum.normal += 1;
    else sum.risk += 1;
    return sum;
  }, { wind: 0, storage: 0, windCapacity: 0, turbines: 0, storagePower: 0, storageEnergy: 0, normal: 0, risk: 0 });
}

function formatCapacity(mw) {
  return mw >= 1000 ? `${(mw / 1000).toFixed(2)} GW` : `${mw} MW`;
}

function filteredStations({ respectDetail = false } = {}) {
  let records = scopedRecords();
  if (respectDetail) {
    if (state.detailType !== "all") records = records.filter(record => record.type === state.detailType);
    if (state.detailSearch) {
      const query = state.detailSearch.trim().toLowerCase();
      records = records.filter(record => record.name.toLowerCase().includes(query));
    }
  }
  return records;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setRoute(route, updateHash = true) {
  state.route = routes.includes(route) ? route : "overview";
  $$(".route-page").forEach(page => {
    page.hidden = page.dataset.route !== state.route;
  });
  $$("[data-route-link]").forEach(link => {
    link.classList.toggle("active", link.dataset.routeLink === state.route);
  });
  if (updateHash && location.hash !== `#${state.route}`) location.hash = state.route;
  renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCurrentRoute() {
  updateScope();
  if (state.route === "overview") renderOverview();
  if (state.route === "revenue") renderRevenue();
  if (state.route === "types") renderTypes();
  if (state.route === "stations") renderStations();
}

function updateScope() {
  const station = stationRecords.find(record => record.id === state.station);
  const province = provinceMeta[state.province]?.label || "全部省份";
  const stationName = station?.name || "全部电站";
  const type = typeLabels[state.assetFilter] || "风电";
  $$("[data-scope]").forEach(node => { node.textContent = `${province} · ${stationName} · ${type}`; });
}

function updateStationFilter() {
  const select = $("#stationFilter");
  const options = stationCatalog().filter(record => state.province === "all" || record.province === state.province);
  select.innerHTML = `<option value="all">全部电站</option>${options.map(record => `<option value="${record.id}">${record.name}</option>`).join("")}`;
  if (!options.some(record => record.id === state.station)) state.station = "all";
  select.value = state.station;
}

function renderOverview() {
  renderOverviewSummary();
  renderComposition();
  renderAssetRegister();
  renderProvincePopover(state.mapProvince);
  $$(".province-point").forEach(point => {
    const provinceCount = scopedRecords().filter(record => record.province === point.dataset.mapProvince).length;
    const countLabel = point.querySelector("small");
    if (countLabel) countLabel.textContent = `${provinceCount} 站`;
    point.setAttribute("aria-label", `${provinceMeta[point.dataset.mapProvince].label}，${provinceCount} 座当前范围电站`);
    point.classList.toggle("active", point.dataset.mapProvince === state.mapProvince);
    point.classList.toggle("empty", provinceCount === 0);
    point.classList.toggle("filtered", state.province !== "all" && point.dataset.mapProvince === state.province);
    point.classList.toggle("dimmed", state.province !== "all" && point.dataset.mapProvince !== state.province);
  });
}

function renderOverviewSummary() {
  const slice = financialSlice();
  const records = scopedRecords();
  const scale = assetScale(records);
  const total = records.length;
  const monthLabel = `截至 2025 年 ${slice.monthIndex + 1} 月`;
  const reached = slice.attainment >= 100;

  $("#overviewPeriodLabel").textContent = `实际 YTD 毛利 · ${monthLabel}`;
  $("#overviewMargin").textContent = formatMoney(slice.actual);
  $("#overviewTarget").textContent = formatMoney(slice.target);
  $("#overviewAttainment").textContent = total ? `${slice.attainment.toFixed(1)}%` : "—";
  $("#overviewRevenue").textContent = formatMoney(slice.revenue);
  $("#overviewCost").textContent = formatMoney(slice.cost);
  $("#overviewTargetStatus").textContent = !total ? "当前范围无资产" : reached ? "达到累计目标" : "未达累计目标";
  $("#overviewTargetStatus").className = `status-chip ${reached ? "good" : "watch"}`;

  $("#overviewStationCount").textContent = total;
  $("#overviewAssetDescriptor").textContent = state.assetFilter === "wind"
    ? `${scale.turbines} 台风机`
    : state.assetFilter === "storage"
      ? `${scale.storagePower} MW / ${scale.storageEnergy} MWh`
      : "待接入资产";
  $("#overviewWindCapacity").textContent = formatCapacity(scale.windCapacity);
  $("#overviewStoragePower").textContent = `${scale.storagePower} MW`;
  $("#overviewStorageEnergy").textContent = `${scale.storageEnergy} MWh`;
  $("#overviewNormalAssets").textContent = `${scale.normal} / ${total}`;

  $("#windStationCount").textContent = `${scale.wind} 座`;
  $("#windScaleSummary").textContent = `${formatCapacity(scale.windCapacity)} · ${scale.turbines} 台风机`;
  $("#storageStationCount").textContent = `${scale.storage} 座`;
  $("#storageScaleSummary").textContent = `${scale.storagePower} MW / ${scale.storageEnergy} MWh`;
  const totalTypes = scale.wind + scale.storage;
  $("#windScaleProgress").style.width = `${totalTypes ? scale.wind / totalTypes * 100 : 0}%`;
  $("#storageScaleProgress").style.width = `${totalTypes ? scale.storage / totalTypes * 100 : 0}%`;

  const health = total ? scale.normal / total * 100 : 0;
  $("#assetHealthRate").textContent = total ? `${health.toFixed(1)}%` : "—";
  $("#normalAssetLabel").textContent = `${scale.normal} 正常`;
  $("#riskAssetLabel").textContent = `${scale.risk} 关注`;
  $("#assetStatusDots").innerHTML = records.map(record => `<i class="${record.status === "good" ? "" : "risk"}" title="${record.name} · ${statusLabel(record.status)}"></i>`).join("");
}

function renderProvincePopover(provinceKey) {
  const portfolio = provincePortfolio[provinceKey];
  let records = scopedRecords().filter(record => record.province === provinceKey);
  if (!portfolio) return;
  const financialRecords = records.map(financialRecord);
  const data = businessData[state.assetFilter];
  const monthIndex = currentMonthIndex();
  const actualFactor = data
    ? data.monthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) / data.monthly.reduce((sum, value) => sum + value, 0)
    : 0;
  const targetFactor = data
    ? data.targetMonthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) / data.targetMonthly.reduce((sum, value) => sum + value, 0)
    : 0;
  const margin = financialRecords.reduce((sum, record) => sum + record.margin, 0) * actualFactor;
  const target = financialRecords.reduce((sum, record) => sum + record.marginTarget, 0) * targetFactor;
  const attainment = target ? margin / target * 100 : 0;
  const attention = records.filter(record => record.status !== "good").length;
  const status = records.length ? (attention ? `${attention} 项关注` : "整体正常") : "当前范围无资产";
  const operations = records.length ? records.slice(0, 2).map(record => record.ops).join(" / ") : "—";
  $("#provincePopover").innerHTML = `
    <div class="popover-heading">
      <div><span>PROVINCE SUMMARY</span><h3>${portfolio.label}</h3></div>
      <b class="${status.includes("正常") ? "positive" : "negative"}">${status}</b>
    </div>
    <div class="popover-summary">
      <div><small>YTD 毛利</small><strong>${formatMoney(margin)}</strong></div>
      <div><small>目标达成率</small><strong>${records.length ? `${attainment.toFixed(1)}%` : "—"}</strong></div>
      <div><small>运营摘要</small><strong>${operations}</strong></div>
    </div>
    <div class="province-stations">
      ${records.length ? financialRecords.map(record => `
        <button data-view-station="${record.id}">
          <span><i class="${record.type}"></i><b>${record.name}</b><small>${typeLabels[record.type]} · ${record.size}</small></span>
          <span><small>YTD 毛利</small><b>${formatMoney(record.margin * actualFactor)}</b><em class="${record.status === "good" ? "positive" : "negative"}">${record.ops}</em></span>
        </button>
      `).join("") : `<p class="popover-empty">当前筛选范围在该省暂无资产</p>`}
    </div>
  `;
}

function renderComposition() {
  const records = scopedRecords();
  const provinceKeys = Object.keys(provinceMeta).filter(key => key !== "all");
  const rows = provinceKeys.map(province => {
    const provinceRecords = records.filter(record => record.province === province);
    const scale = assetScale(provinceRecords);
    return { province, ...scale, total: provinceRecords.length };
  }).filter(row => row.total);
  $("#compositionTable").innerHTML = rows.map(row => `
    <tr>
      <td><strong>${provinceMeta[row.province].label}</strong></td>
      <td>${row.wind}</td><td>${row.storage}</td><td><b>${row.total}</b></td>
      <td>${row.windCapacity} MW</td><td>${row.turbines} 台</td><td>${row.storagePower} MW</td><td>${row.storageEnergy} MWh</td>
      <td><div class="mix-bar" title="风电 ${row.total ? Math.round(row.wind / row.total * 100) : 0}% · 储能 ${row.total ? Math.round(row.storage / row.total * 100) : 0}%"><i style="width:${row.total ? row.wind / row.total * 100 : 0}%"></i><b></b></div></td>
    </tr>
  `).join("") || `<tr><td colspan="9" class="empty-state">当前筛选范围暂无资产构成数据</td></tr>`;
  const total = assetScale(records);
  const totalAssets = records.length;
  $("#compositionTableFoot").innerHTML = `
    <tr><td>组合合计</td><td>${total.wind}</td><td>${total.storage}</td><td>${totalAssets}</td><td>${total.windCapacity} MW</td><td>${total.turbines} 台</td><td>${total.storagePower} MW</td><td>${total.storageEnergy} MWh</td><td><span class="mix-label">风电 ${totalAssets ? Math.round(total.wind / totalAssets * 100) : 0}% · 储能 ${totalAssets ? Math.round(total.storage / totalAssets * 100) : 0}%</span></td></tr>
  `;
}

function renderAssetRegister() {
  const slice = financialSlice();
  const financialMap = new Map(slice.records.map(record => [record.id, record]));
  const records = filteredStations({ respectDetail: true }).map(record => financialMap.get(record.id) || financialRecord(record));
  const tbody = $("#assetRegisterTable");
  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty-state">当前条件下暂无电站</td></tr>`;
  } else {
    tbody.innerHTML = records.map(record => `
      <tr class="${state.selectedAssets.has(record.id) ? "selected" : ""}">
        <td><input type="checkbox" data-select-asset="${record.id}" aria-label="选择 ${record.name}" ${state.selectedAssets.has(record.id) ? "checked" : ""}></td>
        <td><strong>${record.name}</strong></td>
        <td><span class="type-pill ${record.type}">${typeLabels[record.type]}</span></td>
        <td>${provinceMeta[record.province].label}</td>
        <td>${record.size}</td>
        <td>${formatMoney(record.margin * slice.actualFactor)}</td>
        <td class="${record.marginTarget && record.margin * slice.actualFactor / (record.marginTarget * slice.targetFactor) >= 1 ? "positive" : "negative"}">${record.marginTarget && slice.targetFactor ? `${(record.margin * slice.actualFactor / (record.marginTarget * slice.targetFactor) * 100).toFixed(1)}%` : "—"}</td>
        <td>${record.ops}</td>
        <td><span class="status-pill ${record.status}">${statusLabel(record.status)}</span></td>
        <td><button class="row-action" data-view-station="${record.id}">查看详情</button></td>
      </tr>
    `).join("");
  }
  $("#selectedAssetCount").textContent = state.selectedAssets.size;
  const visibleIds = records.map(record => record.id);
  $("#selectAllAssets").checked = visibleIds.length > 0 && visibleIds.every(id => state.selectedAssets.has(id));
  $("#selectAllAssets").indeterminate = visibleIds.some(id => state.selectedAssets.has(id)) && !$("#selectAllAssets").checked;
}

function renderRevenue() {
  const slice = financialSlice(state.businessType);
  const station = selectedStation();
  const scopeLabel = station?.type === state.businessType
    ? station.name
    : state.province === "all"
      ? `${typeLabels[state.businessType]}组合`
      : `${provinceMeta[state.province].label} · ${typeLabels[state.businessType]}`;
  const attainment = slice.attainment;
  const revenueTarget = slice.revenue / (state.businessType === "wind" ? 1.018 : 1.025);
  const costTarget = slice.cost / (state.businessType === "wind" ? 1.069 : 1.015);
  const revenueGap = revenueTarget ? (slice.revenue / revenueTarget - 1) * 100 : 0;
  const costGap = costTarget ? (slice.cost / costTarget - 1) * 100 : 0;
  $("#businessAssetLabel").textContent = scopeLabel;
  $("#marginActual").textContent = formatMoney(slice.actual);
  $("#marginTarget").textContent = formatMoney(slice.target);
  $("#marginGap").textContent = slice.records.length ? `差距 ${attainment >= 100 ? "+" : "−"}${Math.abs(attainment - 100).toFixed(1)}%` : "当前范围无资产";
  $("#marginGap").className = attainment >= 100 ? "positive" : "negative";
  $("#marginProgress").style.width = `${Math.min(attainment, 100)}%`;
  $("#annualTarget").textContent = formatMoney(slice.annual);
  $("#annualProgress").textContent = slice.records.length ? `${slice.annualProgress.toFixed(1)}%` : "—";
  $("#driverMargin").textContent = formatMoney(slice.actual);
  $("#driverRevenue").textContent = formatMoney(slice.revenue);
  $("#driverCost").textContent = formatMoney(slice.cost);
  $("#driverMarginDelta").textContent = slice.records.length ? `距累计目标 ${attainment >= 100 ? "+" : "−"}${Math.abs(attainment - 100).toFixed(1)}%` : "当前范围无资产";
  $("#driverMarginDelta").className = attainment >= 100 ? "positive" : "negative";
  $("#driverRevenueDelta").textContent = slice.records.length ? `距累计目标 ${revenueGap >= 0 ? "+" : ""}${revenueGap.toFixed(1)}%` : "当前范围无资产";
  $("#driverRevenueDelta").className = revenueGap >= 0 ? "positive" : "negative";
  $("#driverCostDelta").textContent = slice.records.length ? `相对累计目标 ${costGap >= 0 ? "+" : ""}${costGap.toFixed(1)}%` : "当前范围无资产";
  $("#driverCostDelta").className = costGap <= 0 ? "positive" : "negative";
  $("#businessRankTitle").textContent = `${typeLabels[state.businessType]}项目经营排名`;
  $$("[data-business-tab]").forEach(button => button.setAttribute("aria-selected", button.dataset.businessTab === state.businessType));
  $$("[data-business-metric]").forEach(button => button.classList.toggle("active", button.dataset.businessMetric === state.businessMetric));
  renderBusinessChart(slice);
  renderBusinessBridge(slice);
  renderBusinessTable(slice);
  updateCompareMonthOptions(slice.monthIndex);
  renderMonthComparison(slice);
}

function renderBusinessChart(slice) {
  const metricNames = { margin: "毛利", revenue: "收入", cost: "成本" };
  const multiplier = state.businessMetric === "revenue" ? 2.52 : state.businessMetric === "cost" ? 1.52 : 1;
  if (!slice.records.length) {
    $("#businessChart").innerHTML = `<text x="390" y="140" text-anchor="middle" fill="#758298" font-size="13">当前筛选范围暂无经营数据</text>`;
    $("#trendTitle").textContent = `${metricNames[state.businessMetric]} · 月度与累计趋势`;
    return;
  }
  const actual = slice.data.monthly.slice(0, slice.monthIndex + 1).map(value => value * multiplier * slice.scopeShare);
  const target = slice.data.targetMonthly.slice(0, slice.monthIndex + 1).map(value => value * multiplier * slice.targetScopeShare);
  const cumulative = actual.map((_, index) => actual.slice(0, index + 1).reduce((sum, value) => sum + value, 0));
  const cumulativeTarget = target.map((_, index) => target.slice(0, index + 1).reduce((sum, value) => sum + value, 0));
  const max = Math.max(...cumulative, ...cumulativeTarget, 1) * 1.08;
  const width = 780, height = 280, left = 48, right = 24, top = 20, bottom = 40;
  const chartWidth = width - left - right, chartHeight = height - top - bottom;
  const intervals = Math.max(actual.length - 1, 1);
  const x = index => left + index * chartWidth / intervals;
  const y = value => top + chartHeight - value / max * chartHeight;
  const line = values => values.map((value, index) => `${index ? "L" : "M"} ${x(index)} ${y(value)}`).join(" ");
  const grid = [0, .25, .5, .75, 1].map(ratio => `<line x1="${left}" y1="${top + chartHeight * ratio}" x2="${width - right}" y2="${top + chartHeight * ratio}" stroke="#e8ecee"/><text x="4" y="${top + chartHeight * ratio + 4}" fill="#7b8794" font-size="9">${Math.round(max * (1 - ratio))}</text>`).join("");
  const bars = actual.map((value, index) => {
    const barHeight = value / max * chartHeight;
    return `<rect x="${x(index) - 12}" y="${top + chartHeight - barHeight}" width="24" height="${barHeight}" rx="4" fill="#c6d8f5"/>`;
  }).join("");
  const labels = actual.map((_, index) => `<text x="${x(index)}" y="${height - 12}" text-anchor="middle" fill="#7b8794" font-size="10">${index + 1}月</text>`).join("");
  $("#businessChart").innerHTML = `${grid}${bars}<path d="${line(cumulativeTarget)}" fill="none" stroke="#d28b2e" stroke-width="2" stroke-dasharray="5 5"/><path d="${line(cumulative)}" fill="none" stroke="#1767e8" stroke-width="3"/>${cumulative.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="4" fill="#fff" stroke="#1767e8" stroke-width="2"/>`).join("")}${labels}`;
  $("#trendTitle").textContent = `${metricNames[state.businessMetric]} · 月度与累计趋势`;
}

function renderBusinessBridge(slice) {
  if (!slice.records.length) {
    $("#bridgeList").innerHTML = `<p class="empty-state">当前筛选范围暂无经营构成</p>`;
    return;
  }
  const shares = state.businessType === "wind"
    ? [["电量收入", .85], ["其他收入", .15]]
    : [["容量租赁", .58], ["峰谷套利及其他", .42]];
  const bridge = [
    ...shares.map(([label, share]) => [label, slice.revenue * share, share * 100]),
    ["运营成本", slice.cost, slice.revenue ? slice.cost / slice.revenue * 100 : 0]
  ];
  $("#bridgeList").innerHTML = bridge.map(([label, value, share]) => `
    <div class="bridge-item">
      <div><span>${label}</span><b>${formatMoney(value)}</b></div>
      <div class="bridge-bar"><i style="width:${share}%"></i></div>
    </div>
  `).join("") + `<div class="bridge-foot">实际 YTD 口径 · 收入构成与成本同时披露，便于识别经营结果来自哪里。</div>`;
}

function renderBusinessTable(slice) {
  if (!slice.records.length) {
    $("#businessTable").innerHTML = `<tr><td colspan="7" class="empty-state">当前筛选范围暂无可排名资产</td></tr>`;
    return;
  }
  const annualRatio = slice.data.annual / slice.data.target;
  const rows = slice.records.map(record => {
    const actual = record.margin * slice.actualFactor;
    const target = record.marginTarget * slice.targetFactor;
    const attainment = target ? actual / target * 100 : 0;
    const annual = record.marginTarget * annualRatio;
    const progress = annual ? actual / annual * 100 : 0;
    const status = attainment >= 100 ? "good" : attainment >= 95 ? "watch" : "bad";
    return { record, actual, target, attainment, progress, status };
  }).sort((a, b) => b.actual - a.actual);
  $("#businessTable").innerHTML = rows.map(row => `
    <tr><td><strong>${row.record.name}</strong></td><td>${formatMoney(row.actual)}</td><td>${formatMoney(row.target)}</td><td class="${row.attainment >= 100 ? "positive" : "negative"}">${row.attainment >= 100 ? "+" : "−"}${Math.abs(row.attainment - 100).toFixed(1)}%</td><td>${row.attainment.toFixed(1)}%</td><td>${row.progress.toFixed(1)}%</td><td><span class="status-pill ${row.status}">${statusLabel(row.status)}</span></td></tr>
  `).join("");
}

function updateCompareMonthOptions(currentIndex) {
  const select = $("#compareMonthFilter");
  const currentMonth = currentIndex + 1;
  const months = Array.from({ length: Math.max(currentMonth - 1, 0) }, (_, index) => currentMonth - index - 1);
  if (!months.includes(Number(state.compareMonth))) state.compareMonth = months[0] || 1;
  select.innerHTML = months.length
    ? months.map(month => `<option value="${month}">2025 年 ${month} 月</option>`).join("")
    : `<option value="1">暂无可比月份</option>`;
  select.value = String(state.compareMonth);
  select.disabled = !months.length;
}

function renderMonthComparison(slice) {
  if (!slice.records.length) {
    $("#monthComparisonTable").innerHTML = `<tr><td colspan="6" class="empty-state">当前筛选范围暂无月份对比数据</td></tr>`;
    return;
  }
  const currentIndex = slice.monthIndex;
  const compareIndex = Math.max(0, Math.min(Number(state.compareMonth) - 1, Math.max(currentIndex - 1, 0)));
  const margin = slice.data.monthly.map(value => value * slice.scopeShare);
  const revenue = margin.map((value, index) => value * (state.businessType === "wind" ? 2.52 + index * .015 : 2.62 + index * .01));
  const cost = revenue.map((value, index) => value - margin[index]);
  const rows = [
    ["收入", revenue[currentIndex], revenue[compareIndex], false],
    ["成本", cost[currentIndex], cost[compareIndex], true],
    ["毛利", margin[currentIndex], margin[compareIndex], false]
  ];
  $("#comparisonMonthLabel").textContent = `2025 年 ${compareIndex + 1} 月`;
  $("#monthComparisonTable").innerHTML = rows.map(([label, current, compare, reverse]) => {
    const diff = current - compare;
    const change = compare === 0 ? 0 : diff / compare * 100;
    const favorable = reverse ? diff <= 0 : diff >= 0;
    return `<tr><td><strong>${label}</strong></td><td>¥ ${(current / 100).toFixed(2)} 亿</td><td>¥ ${(compare / 100).toFixed(2)} 亿</td><td class="${favorable ? "positive" : "negative"}">${diff >= 0 ? "+" : "−"}¥ ${(Math.abs(diff) / 100).toFixed(2)} 亿</td><td class="${favorable ? "positive" : "negative"}">${change >= 0 ? "+" : ""}${change.toFixed(1)}%</td><td><span class="status-pill ${favorable ? "good" : "watch"}">${favorable ? "改善" : "承压"}</span></td></tr>`;
  }).join("");
}

function periodLabel(period) {
  return period === "ytd" ? "YTD" : `2025 年 ${period} 月`;
}

function periodAdjusted(record) {
  if (state.typePeriod === "ytd") return { ...record };
  const month = Number(state.typePeriod);
  const factor = [.115, .12, .13, .135, .14, .145, .155][month - 1] || .14;
  const nameFactor = (record.name.charCodeAt(0) % 7 - 3) * .008;
  const attainmentDelta = ((month + record.name.length) % 5 - 2) * 1.6;
  return {
    ...record,
    revenue: record.revenue * (factor + nameFactor),
    cost: record.cost * (factor + nameFactor * .7),
    margin: record.margin * (factor + nameFactor * 1.2),
    attainment: Math.max(78, record.attainment + attainmentDelta)
  };
}

function renderTypes() {
  $$("[data-type-tab]").forEach(button => button.setAttribute("aria-selected", button.dataset.typeTab === state.typeAsset));
  const records = stationRecords.filter(record => record.type === state.typeAsset).map(periodAdjusted);
  const label = typeLabels[state.typeAsset];
  const period = periodLabel(state.typePeriod);
  $("#typeComparisonTitle").textContent = `${label}站点横向比较 · ${period}`;
  $("#typeTableTitle").textContent = `${label}站点经营数据`;
  if (!records.length) {
    $("#typeSummary").innerHTML = `<article class="empty-state">分布式资产条目将在数据口径确认后接入。</article>`;
    $("#typeComparisonList").innerHTML = `<p class="empty-state">暂无可比较的资产</p>`;
    $("#typeDistribution").innerHTML = `<p class="empty-state">暂无分布数据</p>`;
    $("#typeAnalysisTable").innerHTML = `<tr><td colspan="9" class="empty-state">暂无数据</td></tr>`;
    return;
  }
  const totals = records.reduce((sum, record) => {
    sum.revenue += record.revenue; sum.cost += record.cost; sum.margin += record.margin; sum.attainment += record.attainment;
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, attainment: 0 });
  const average = totals.attainment / records.length;
  $("#typeSummary").innerHTML = [
    ["同类资产", `${records.length} 座`, `${label}范围`],
    ["收入", formatMoney(totals.revenue), period],
    ["毛利", formatMoney(totals.margin), period],
    ["平均达成率", `${average.toFixed(1)}%`, average >= 100 ? "高于目标" : "低于目标"]
  ].map(([name, value, note]) => `<article><span>${name}</span><strong>${value}</strong><small>${note}</small></article>`).join("");
  const sorted = [...records].sort((a, b) => b.attainment - a.attainment);
  $("#typeComparisonList").innerHTML = sorted.map((record, index) => `
    <div class="comparison-row ${record.attainment < 95 ? "risk" : ""}">
      <div class="comparison-name"><strong>${record.name}</strong><small>${provinceMeta[record.province].label}</small></div>
      <div class="comparison-track"><i style="width:${Math.min(record.attainment / 110 * 100, 100)}%"></i><span class="target-marker" style="left:90.9%"></span></div>
      <div class="comparison-value">${record.attainment.toFixed(1)}%</div>
      <div class="comparison-rank">#${index + 1}</div>
    </div>
  `).join("");
  const groups = [
    ["达成目标", records.filter(record => record.attainment >= 100).length, "good"],
    ["接近目标", records.filter(record => record.attainment >= 95 && record.attainment < 100).length, "watch"],
    ["低于 95%", records.filter(record => record.attainment < 95).length, "bad"]
  ];
  $("#typeDistribution").innerHTML = groups.map(([name, count, status]) => `<div class="distribution-row"><span><i class="${status}"></i>${name}</span><strong>${count}</strong><b style="width:${count / records.length * 100}%"></b></div>`).join("") + `<p>分层基于当前选择的 ${period} 目标达成率。</p>`;
  $("#typeAnalysisTable").innerHTML = sorted.map(record => `
    <tr><td><strong>${record.name}</strong></td><td>${provinceMeta[record.province].label}</td><td>${period}</td><td>${formatMoney(record.revenue)}</td><td>${formatMoney(record.cost)}</td><td>${formatMoney(record.margin)}</td><td class="${record.attainment >= 100 ? "positive" : "negative"}">${record.attainment.toFixed(1)}%</td><td>${record.ops}</td><td><span class="status-pill ${record.status}">${statusLabel(record.status)}</span></td></tr>
  `).join("");
}

function selectedStation() {
  return stationRecords.find(record => record.id === state.station) || null;
}

function renderStations() {
  const station = selectedStation();
  const type = station?.type || state.operationsType;
  if (type !== "distributed") state.operationsType = type;
  const data = operationsData[state.operationsType];
  const contextName = station?.name || `${typeLabels[state.operationsType]}组合`;
  const contextProvince = station ? provinceMeta[station.province].label : provinceMeta[state.province].label;
  $("#stationContextName").textContent = contextName;
  $("#stationContextMeta").textContent = `${contextProvince} · ${typeLabels[state.operationsType]} · 截至 2025 年 7 月`;
  $("#stationStatus").textContent = station ? statusLabel(station.status) : "整体稳健";
  $("#stationStatus").className = station?.status === "bad" || station?.status === "watch" ? "negative" : "positive";
  $("#stationAttainment").textContent = `${(station?.attainment || (state.operationsType === "wind" ? 97.4 : 103.8)).toFixed(1)}%`;
  if (station) {
    $("#stationRevenue").textContent = formatMoney(station.revenue);
    $("#stationCost").textContent = formatMoney(station.cost);
    $("#stationMargin").textContent = formatMoney(station.margin);
    $("#stationAnnualProgress").textContent = `${Math.min(72, station.attainment * .54).toFixed(1)}%`;
  } else {
    const business = businessData[state.operationsType];
    $("#stationRevenue").textContent = formatMoney(business.revenue);
    $("#stationCost").textContent = formatMoney(business.cost);
    $("#stationMargin").textContent = formatMoney(business.actual);
    $("#stationAnnualProgress").textContent = `${(business.actual / business.annual * 100).toFixed(1)}%`;
  }
  $$("[data-operations-tab]").forEach(button => button.setAttribute("aria-selected", button.dataset.operationsTab === state.operationsType));
  $("#opsPrimaryOverline").textContent = data.primary.overline;
  $("#opsPrimaryValue").textContent = data.primary.value;
  $("#opsPrimaryUnit").textContent = data.primary.unit;
  $("#opsPrimaryName").textContent = data.primary.name;
  $("#opsPrimaryDelta").textContent = data.primary.delta;
  $("#opsPrimaryDelta").className = data.primary.delta.includes("低于") ? "negative" : "positive";
  $("#opsPrimaryContext").textContent = station ? station.name : data.primary.context;
  $("#benchmarkFill").style.width = state.operationsType === "wind" ? "82%" : "69%";
  $("#opsKpis").innerHTML = data.kpis.map(([name, value, note, status]) => `<article class="ops-kpi"><span>${name}</span><strong>${value}</strong><small class="${status}">${note}</small></article>`).join("");
  renderOpsMetricSelect(data);
  renderOperationsComparison(data);
  const [count, mttr, loss, anomaly, reason] = data.maintenance;
  $("#maintenanceCount").textContent = count;
  $("#maintenanceMttr").textContent = mttr;
  $("#maintenanceLoss").textContent = loss;
  $("#anomalyAsset").textContent = anomaly;
  $("#anomalyReason").textContent = reason;
  $("#settlementTable").innerHTML = settlementData[state.operationsType].map(row => `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td><td class="${row[3].startsWith("+") ? "positive" : "negative"}">${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td><td>${row[6]}</td></tr>`).join("");
}

function renderOpsMetricSelect(data) {
  const select = $("#opsMetricSelect");
  if (!data.metrics[state.operationsMetric]) state.operationsMetric = Object.keys(data.metrics)[0];
  select.innerHTML = Object.entries(data.metrics).map(([value, [label]]) => `<option value="${value}">${label}</option>`).join("");
  select.value = state.operationsMetric;
}

function renderOperationsComparison(data) {
  const [label, unit] = data.metrics[state.operationsMetric];
  const rows = data.comparison[state.operationsMetric];
  const max = Math.max(...rows.map(row => row[2]));
  const lowerIsBetter = state.operationsMetric === "curtailment" || state.operationsMetric === "mttr" || state.operationsMetric === "unplanned";
  $("#comparisonTitle").textContent = `${state.operationsType === "wind" ? "单机" : "单站"}月度对比 · ${label}`;
  $("#comparisonList").innerHTML = rows.map((row, index) => {
    const risk = lowerIsBetter ? index === rows.length - 1 : row[2] < max * .97;
    return `<div class="comparison-row ${risk ? "risk" : ""}"><div class="comparison-name"><strong>${row[0]}</strong><small>${row[1]}</small></div><div class="comparison-track"><i style="width:${Math.max(12, row[2] / max * 100)}%"></i></div><div class="comparison-value">${row[2]}${unit}</div><div class="comparison-rank">#${index + 1}</div></div>`;
  }).join("");
}

function openStation(stationId) {
  const station = stationRecords.find(record => record.id === stationId);
  if (!station) return;
  state.station = station.id;
  state.province = station.province;
  state.assetFilter = station.type;
  state.operationsType = station.type;
  $("#provinceFilter").value = state.province;
  $("#assetFilter").value = state.assetFilter;
  updateStationFilter();
  $("#stationFilter").value = station.id;
  setRoute("stations");
}

function handleRouteAction(button) {
  const route = button.dataset.go;
  if (!route) return;
  if (button.dataset.type) {
    state.assetFilter = button.dataset.type;
    $("#assetFilter").value = state.assetFilter;
    updateStationFilter();
  }
  setRoute(route);
}

function bindEvents() {
  document.addEventListener("click", event => {
    const navLink = event.target.closest("[data-route-link]");
    if (navLink) {
      event.preventDefault();
      setRoute(navLink.dataset.routeLink);
      return;
    }
    const routeButton = event.target.closest("[data-go]");
    if (routeButton) {
      event.preventDefault();
      handleRouteAction(routeButton);
      return;
    }
    const stationButton = event.target.closest("[data-view-station]");
    if (stationButton) {
      event.preventDefault();
      openStation(stationButton.dataset.viewStation);
      return;
    }
    const mapPoint = event.target.closest("[data-map-province]");
    if (mapPoint) {
      state.mapProvince = mapPoint.dataset.mapProvince;
      renderOverview();
    }
  });

  window.addEventListener("hashchange", () => setRoute(location.hash.slice(1), false));

  $("#monthFilter").addEventListener("change", event => {
    state.month = event.target.value;
    renderCurrentRoute();
  });
  $("#provinceFilter").addEventListener("change", event => {
    state.province = event.target.value;
    if (state.province !== "all") state.mapProvince = state.province;
    updateStationFilter();
    renderCurrentRoute();
  });
  $("#assetFilter").addEventListener("change", event => {
    state.assetFilter = event.target.value;
    state.businessType = state.assetFilter;
    state.typeAsset = state.assetFilter;
    if (state.assetFilter !== "distributed") state.operationsType = state.assetFilter;
    state.detailType = "all";
    $("#detailTypeFilter").value = "all";
    updateStationFilter();
    renderCurrentRoute();
  });
  $("#stationFilter").addEventListener("change", event => {
    state.station = event.target.value;
    renderCurrentRoute();
  });

  $$("[data-business-tab]").forEach(button => button.addEventListener("click", () => {
    state.businessType = button.dataset.businessTab;
    state.assetFilter = state.businessType;
    state.station = "all";
    $("#assetFilter").value = state.assetFilter;
    updateStationFilter();
    updateScope();
    renderRevenue();
  }));
  $$("[data-business-metric]").forEach(button => button.addEventListener("click", () => {
    state.businessMetric = button.dataset.businessMetric;
    renderRevenue();
  }));
  $("#compareMonthFilter").addEventListener("change", event => {
    state.compareMonth = Number(event.target.value);
    renderRevenue();
  });

  $$("[data-type-tab]").forEach(button => button.addEventListener("click", () => {
    state.typeAsset = button.dataset.typeTab;
    renderTypes();
  }));
  $("#typePeriodFilter").addEventListener("change", event => {
    state.typePeriod = event.target.value;
    renderTypes();
  });

  $$("[data-operations-tab]").forEach(button => button.addEventListener("click", () => {
    state.operationsType = button.dataset.operationsTab;
    state.station = "all";
    renderStations();
  }));
  $("#opsMetricSelect").addEventListener("change", event => {
    state.operationsMetric = event.target.value;
    renderStations();
  });
  $("#focusAnomaly").addEventListener("click", () => showToast("已定位当前异常资产；日度诊断将在后续版本接入。"));

  $("#detailTypeFilter").addEventListener("change", event => {
    state.detailType = event.target.value;
    renderAssetRegister();
  });
  $("#assetSearch").addEventListener("input", event => {
    state.detailSearch = event.target.value;
    renderAssetRegister();
  });
  $("#assetRegisterTable").addEventListener("change", event => {
    const checkbox = event.target.closest("[data-select-asset]");
    if (!checkbox) return;
    if (checkbox.checked) state.selectedAssets.add(checkbox.dataset.selectAsset);
    else state.selectedAssets.delete(checkbox.dataset.selectAsset);
    renderAssetRegister();
  });
  $("#selectAllAssets").addEventListener("change", event => {
    const visible = filteredStations({ respectDetail: true });
    visible.forEach(record => event.target.checked ? state.selectedAssets.add(record.id) : state.selectedAssets.delete(record.id));
    renderAssetRegister();
  });
  $("#clearAssetSelection").addEventListener("click", () => {
    state.selectedAssets.clear();
    renderAssetRegister();
  });

  $$("[data-map-province]").forEach(point => {
    ["mouseenter", "focus"].forEach(eventName => point.addEventListener(eventName, () => {
      state.mapProvince = point.dataset.mapProvince;
      renderProvincePopover(state.mapProvince);
      $$(".province-point").forEach(item => item.classList.toggle("active", item === point));
    }));
  });
}

function initialize() {
  updateStationFilter();
  bindEvents();
  const initialRoute = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : "overview";
  setRoute(initialRoute, false);
}

initialize();
