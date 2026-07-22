const state = {
  route: "overview",
  month: "2025-07",
  region: "all",
  assetFilter: "all",
  businessType: "wind",
  businessMetric: "margin",
  operationsType: "wind",
  operationsMetric: "availability"
};

const regionMeta = {
  all: { label: "全部区域", factor: 1 },
  north: { label: "北部区域", factor: .46 },
  east: { label: "东部区域", factor: .31 },
  west: { label: "西部区域", factor: .23 }
};

const businessData = {
  wind: {
    label: "风电组合", actual: 2.74, target: 2.88, annual: 5.10, revenue: 6.92, cost: 4.18,
    monthly: [31, 35, 39, 40, 43, 40, 46], targetMonthly: [33, 36, 40, 42, 42, 45, 50],
    bridge: [["电量收入", 5.91, 85], ["其他收入", 1.01, 15], ["运营成本", 4.18, 60]],
    ranks: [
      ["北辰风电项目", .78, .74, "+5.4%", "105.4%", "61.2%", "good"],
      ["云岭风电项目", .64, .63, "+1.6%", "101.6%", "56.4%", "good"],
      ["临港风电项目", .55, .57, "−3.5%", "96.5%", "52.1%", "watch"],
      ["海岳风电项目", .42, .50, "−16.0%", "84.0%", "43.7%", "bad"]
    ]
  },
  storage: {
    label: "储能组合", actual: 1.08, target: 1.04, annual: 1.86, revenue: 2.84, cost: 1.76,
    monthly: [12, 14, 15, 16, 17, 16, 18], targetMonthly: [13, 14, 15, 15, 16, 16, 15],
    bridge: [["容量租赁", 1.64, 58], ["峰谷套利", 1.20, 42], ["运营成本", 1.76, 62]],
    ranks: [
      ["北辰储能站", .34, .31, "+9.7%", "109.7%", "64.8%", "good"],
      ["云岭储能站", .29, .28, "+3.6%", "103.6%", "59.2%", "good"],
      ["临港储能站", .26, .25, "+4.0%", "104.0%", "57.1%", "good"],
      ["海岳储能站", .19, .20, "−5.0%", "95.0%", "48.0%", "watch"]
    ]
  }
};

const operationsData = {
  wind: {
    primary: { overline: "风电组合核心指标", value: "97.2", unit: "%", name: "风机可利用率", delta: "高于目标 +0.4pp", context: "组合加权，186 台风机" },
    kpis: [["YTD 上网电量", "1,846 GWh", "距累计目标 −1.6%", "negative"], ["限电率", "3.1%", "较上月改善 0.5pp", "positive"], ["非计划损失率", "1.4%", "高于目标 0.2pp", "negative"], ["故障 MTTR", "5.8 h", "较上月减少 0.7h", "positive"]],
    metrics: { availability: ["可利用率", "%", 95, 100], curtailment: ["限电率", "%", 0, 6], mttr: ["MTTR", "h", 0, 10] },
    rows: [["WT-03", "北辰", 99.1], ["WT-08", "云岭", 98.4], ["WT-12", "临港", 97.8], ["WT-21", "北辰", 97.1], ["WT-09", "海岳", 95.6], ["WT-17", "海岳", 93.8]],
    maintenance: ["6", "5.8h", "21.4h", "海岳 · WT-17", "可利用率连续两月低于目标"]
  },
  storage: {
    primary: { overline: "储能组合核心指标", value: "88.6", unit: "%", name: "充放电效率", delta: "高于目标 +1.1pp", context: "4 个储能电站加权" },
    kpis: [["YTD 放电量", "612 GWh", "距累计目标 +1.8%", "positive"], ["时间可利用率", "98.1%", "高于目标 0.6pp", "positive"], ["容量可利用率", "92.7%", "低于目标 1.3pp", "negative"], ["日均充放次数", "1.72 次", "较上月增加 0.08", "positive"]],
    metrics: { efficiency: ["充放电效率", "%", 82, 92], time: ["时间可利用率", "%", 94, 100], capacity: ["容量可利用率", "%", 85, 98] },
    rows: [["北辰储能站", "北部", 90.2], ["云岭储能站", "西部", 89.4], ["临港储能站", "东部", 88.7], ["海岳储能站", "东部", 85.9]],
    maintenance: ["2", "4.1h", "13.6h", "海岳储能站", "容量可利用率低于组合基线"]
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `¥ ${value.toFixed(2)} 亿`;
const monthFactor = () => state.month === "2025-06" ? .88 : 1;
const scopeFactor = () => regionMeta[state.region].factor * monthFactor();

function navigate(route, options = {}) {
  if (options.assetType && options.assetType !== "all") {
    state.businessType = options.assetType;
    state.operationsType = options.assetType;
  }
  if (location.hash !== `#${route}`) location.hash = route;
  else showRoute(route);
}

function showRoute(route) {
  const valid = ["overview", "business", "operations"];
  state.route = valid.includes(route) ? route : "overview";
  $$(".route-page").forEach(page => { page.hidden = page.dataset.route !== state.route; });
  $$("[data-route-link]").forEach(link => link.classList.toggle("active", link.dataset.routeLink === state.route));
  if (state.route === "overview") renderOverview();
  if (state.route === "business") renderBusiness();
  if (state.route === "operations") renderOperations();
  document.title = `${$("[data-route-link].active span:last-child")?.childNodes[0]?.textContent?.trim() || "资产看板"} · Northstar V2`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderScope() {
  const assetLabel = state.assetFilter === "wind" ? "风电" : state.assetFilter === "storage" ? "储能" : "全部资产";
  $$('[data-scope]').forEach(el => { el.textContent = `${regionMeta[state.region].label} · ${assetLabel}`; });
}

function renderOverview() {
  renderScope();
  const factor = scopeFactor();
  const set = (name, value) => $$(`[data-bind="${name}"]`).forEach(el => { el.textContent = value; });
  set("capacity", (1.26 * regionMeta[state.region].factor).toFixed(2));
  set("wind-count", Math.round(186 * regionMeta[state.region].factor));
  set("storage-power", Math.round(420 * regionMeta[state.region].factor));
  set("storage-capacity", Math.round(840 * regionMeta[state.region].factor));
  set("wind-energy", Math.round(1846 * factor).toLocaleString("zh-CN"));
  set("storage-energy", Math.round(612 * factor).toLocaleString("zh-CN"));
  set("attention-count", Math.max(2, Math.round(9 * regionMeta[state.region].factor)));
  set("normal-count", Math.round(191 * regionMeta[state.region].factor));
  set("margin", money(3.82 * factor));
}

function cumulative(values) {
  let sum = 0;
  return values.map(v => +(sum += v).toFixed(1));
}

function chartPath(values, max, width = 700, height = 210, left = 45, top = 20) {
  const step = width / (values.length - 1);
  return values.map((v, i) => `${i ? "L" : "M"}${left + i * step},${top + height - (v / max) * height}`).join(" ");
}

function drawBusinessChart(data) {
  const svg = $("#businessChart");
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月"];
  const end = state.month === "2025-06" ? 6 : 7;
  const monthly = data.monthly.slice(0, end);
  const targetMonthly = data.targetMonthly.slice(0, end);
  const actualCum = cumulative(monthly);
  const targetCum = cumulative(targetMonthly);
  const max = Math.max(...targetCum, ...actualCum) * 1.08;
  const w = 700 / Math.max(1, end - 1);
  const bars = monthly.map((v, i) => {
    const x = 45 + i * w - 11;
    const h = (v / max) * 210;
    return `<rect x="${x}" y="${230 - h}" width="22" height="${h}" rx="4" fill="#8bb3f5" opacity=".78"/>`;
  }).join("");
  const labels = months.slice(0, end).map((m, i) => `<text x="${45 + i * w}" y="260" text-anchor="middle" fill="#758298" font-size="10">${m}</text>`).join("");
  const grid = [0,1,2,3].map(i => `<line x1="45" y1="${20 + i * 70}" x2="745" y2="${20 + i * 70}" stroke="#e5e9ed"/><text x="35" y="${24 + i * 70}" text-anchor="end" fill="#9aa5b3" font-size="9">${Math.round(max - i * max / 3)}</text>`).join("");
  svg.innerHTML = `${grid}${bars}<path d="${chartPath(actualCum,max,700,210)}" fill="none" stroke="#1767e8" stroke-width="3"/><path d="${chartPath(targetCum,max,700,210)}" fill="none" stroke="#c47a13" stroke-width="2" stroke-dasharray="6 5"/>${actualCum.map((v,i)=>`<circle cx="${45+i*w}" cy="${230-(v/max)*210}" r="4" fill="#fff" stroke="#1767e8" stroke-width="2"/>`).join("")}${labels}`;
}

function renderBusiness() {
  if (state.assetFilter !== "all") state.businessType = state.assetFilter;
  const type = state.businessType;
  const data = businessData[type];
  const factor = scopeFactor();
  const actual = data.actual * factor;
  const target = data.target * factor;
  const annual = data.annual * regionMeta[state.region].factor;
  const gap = (actual / target - 1) * 100;
  const annualProgress = actual / annual * 100;
  $$('[data-business-tab]').forEach(btn => btn.setAttribute("aria-selected", String(btn.dataset.businessTab === type)));
  $("#businessAssetLabel").textContent = `${regionMeta[state.region].label} · ${data.label}`;
  $("#marginActual").textContent = money(actual);
  $("#marginTarget").textContent = money(target);
  $("#marginGap").textContent = `差距 ${gap >= 0 ? "+" : "−"}${Math.abs(gap).toFixed(1)}%`;
  $("#marginGap").className = gap >= 0 ? "positive" : "negative";
  $("#marginProgress").style.width = `${Math.min(actual / target * 100, 100)}%`;
  $("#annualTarget").textContent = money(annual);
  $("#annualProgress").textContent = `${annualProgress.toFixed(1)}%`;
  $("#driverMargin").textContent = money(actual);
  $("#driverRevenue").textContent = money(data.revenue * factor);
  $("#driverCost").textContent = money(data.cost * factor);
  $("#businessRankTitle").textContent = type === "wind" ? "风电项目经营排名" : "储能单站经营排名";
  const labels = { margin: "毛利", revenue: "收入", cost: "成本" };
  $("#trendTitle").textContent = `${labels[state.businessMetric]} · 月度与累计趋势`;
  $$('[data-business-metric]').forEach(btn => btn.classList.toggle("active", btn.dataset.businessMetric === state.businessMetric));
  drawBusinessChart(data);
  $("#bridgeList").innerHTML = data.bridge.map(([label,value,share]) => `<div class="bridge-item"><div><span>${label}</span><b>${money(value * factor)}</b></div><div class="bridge-bar"><i style="width:${share}%"></i></div></div>`).join("") + `<p class="bridge-foot">分项用于解释总收入与总成本；正式版需与现有字段表逐项对账。</p>`;
  $("#businessTable").innerHTML = data.ranks.map((row, index) => {
    const [name,a,t,gapText,rate,progress,status] = row;
    const statusText = status === "good" ? "达标" : status === "watch" ? "关注" : "异常";
    return `<tr data-rank-row="${index}"><td><strong>${name}</strong></td><td>${money(a * factor)}</td><td>${money(t * factor)}</td><td class="${status === "good" ? "positive" : "negative"}">${gapText}</td><td>${rate}</td><td>${progress}</td><td><span class="status-pill ${status}">${statusText}</span></td></tr>`;
  }).join("");
  $$('[data-rank-row]').forEach(row => row.addEventListener("click", () => navigate("operations", { assetType: type })));
}

function metricValue(type, metric, raw) {
  if (type === "wind") {
    if (metric === "availability") return raw;
    if (metric === "curtailment") return +(6.2 - (raw - 93.5) * .55).toFixed(1);
    return +(9.5 - (raw - 93.5) * .65).toFixed(1);
  }
  if (metric === "efficiency") return raw;
  if (metric === "time") return +(94 + (raw - 84) * .55).toFixed(1);
  return +(86 + (raw - 84) * .7).toFixed(1);
}

function renderOperations() {
  if (state.assetFilter !== "all") state.operationsType = state.assetFilter;
  const type = state.operationsType;
  const data = operationsData[type];
  if (!data.metrics[state.operationsMetric]) state.operationsMetric = Object.keys(data.metrics)[0];
  $$('[data-operations-tab]').forEach(btn => btn.setAttribute("aria-selected", String(btn.dataset.operationsTab === type)));
  $("#opsPrimaryOverline").textContent = data.primary.overline;
  $("#opsPrimaryValue").textContent = data.primary.value;
  $("#opsPrimaryUnit").textContent = data.primary.unit;
  $("#opsPrimaryName").textContent = data.primary.name;
  $("#opsPrimaryDelta").textContent = data.primary.delta;
  $("#opsPrimaryContext").textContent = data.primary.context;
  $("#opsKpis").innerHTML = data.kpis.map(([label,value,delta,tone]) => `<article class="ops-kpi"><span>${label}</span><strong>${value}</strong><small class="${tone}">${delta}</small></article>`).join("");
  const select = $("#opsMetricSelect");
  select.innerHTML = Object.entries(data.metrics).map(([key,[name]]) => `<option value="${key}" ${key === state.operationsMetric ? "selected" : ""}>${name}</option>`).join("");
  const [metricName,unit,min,max] = data.metrics[state.operationsMetric];
  $("#comparisonTitle").textContent = `${type === "wind" ? "单机" : "单站"}月度对比 · ${metricName}`;
  const rows = data.rows.map(([name,group,raw]) => [name,group,metricValue(type,state.operationsMetric,raw)]).sort((a,b) => {
    const lowerBetter = state.operationsMetric === "curtailment" || state.operationsMetric === "mttr";
    return lowerBetter ? a[2]-b[2] : b[2]-a[2];
  });
  $("#comparisonList").innerHTML = rows.map(([name,group,value],index) => {
    const pct = Math.max(5, Math.min(100,(value-min)/(max-min)*100));
    const risk = index >= rows.length - (type === "wind" ? 2 : 1);
    return `<div class="comparison-row ${risk ? "risk" : ""}" data-asset-name="${name}"><div class="comparison-name"><strong>${name}</strong><small>${group}</small></div><div class="comparison-track"><i style="width:${pct}%"></i></div><div class="comparison-value">${value}${unit}</div><div class="comparison-rank">#${index+1} / ${rows.length}</div></div>`;
  }).join("");
  $("#maintenanceCount").textContent = data.maintenance[0];
  $("#maintenanceMttr").textContent = data.maintenance[1];
  $("#maintenanceLoss").textContent = data.maintenance[2];
  $("#anomalyAsset").textContent = data.maintenance[3];
  $("#anomalyReason").textContent = data.maintenance[4];
}

function flash(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  window.addEventListener("hashchange", () => showRoute(location.hash.slice(1)));
  $$('[data-go]').forEach(button => button.addEventListener("click", () => navigate(button.dataset.go, { assetType: button.dataset.type })));
  $("#monthFilter").addEventListener("change", event => { state.month = event.target.value; showRoute(state.route); flash(`统计期已切换为 ${event.target.selectedOptions[0].text}`); });
  $("#regionFilter").addEventListener("change", event => { state.region = event.target.value; showRoute(state.route); flash(`范围已切换为 ${regionMeta[state.region].label}`); });
  $("#assetFilter").addEventListener("change", event => {
    state.assetFilter = event.target.value;
    if (state.assetFilter !== "all") { state.businessType = state.assetFilter; state.operationsType = state.assetFilter; }
    showRoute(state.route);
  });
  $$('[data-business-tab]').forEach(button => button.addEventListener("click", () => { state.businessType = button.dataset.businessTab; state.assetFilter = "all"; $("#assetFilter").value = "all"; renderBusiness(); }));
  $$('[data-operations-tab]').forEach(button => button.addEventListener("click", () => { state.operationsType = button.dataset.operationsTab; state.assetFilter = "all"; $("#assetFilter").value = "all"; state.operationsMetric = button.dataset.operationsTab === "wind" ? "availability" : "efficiency"; renderOperations(); }));
  $$('[data-business-metric]').forEach(button => button.addEventListener("click", () => { state.businessMetric = button.dataset.businessMetric; renderBusiness(); }));
  $("#opsMetricSelect").addEventListener("change", event => { state.operationsMetric = event.target.value; renderOperations(); });
  $$('.map-point').forEach(point => point.addEventListener("click", () => {
    const type = point.classList.contains("storage") ? "storage" : "wind";
    const status = point.classList.contains("risk") ? "需关注" : "运行正常";
    $("#mapSelection").innerHTML = `<small>${type === "wind" ? "风电项目" : "储能电站"}</small><strong>${point.dataset.asset}</strong><span>${status} · 点击进入对应运营视图</span><button type="button" data-map-go>查看运营 →</button>`;
    $('[data-map-go]').addEventListener("click", () => navigate("operations", { assetType: type }));
  }));
  $("#focusAnomaly").addEventListener("click", () => {
    const name = $("#anomalyAsset").textContent;
    const row = $$('[data-asset-name]').find(item => name.includes(item.dataset.assetName));
    if (row) { row.scrollIntoView({ behavior: "smooth", block: "center" }); row.animate([{background:"#fdebea"},{background:"transparent"}],{duration:1400}); }
    flash(`已定位：${name}`);
  });
}

bindEvents();
showRoute(location.hash.slice(1) || "overview");
