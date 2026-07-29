function renderOverview() {
  updateAssetTableFilters();
  renderOverviewSummary();
  renderProvinceRevenueMap();
  renderComposition();
  renderAssetRegister();
}

function assetTableBaseRecords() {
  if (state.assetFilter === "distributed") return [];
  return stationRecords.filter(record =>
    record.type === state.assetFilter &&
    (state.province === "all" || record.province === state.province)
  );
}

function updateAssetTableFilters() {
  const provinceSelect = $("#tableProvinceFilter");
  const stationSelect = $("#tableStationFilter");
  const baseRecords = assetTableBaseRecords();
  const provinceKeys = [...new Set(baseRecords.map(record => record.province))];

  if (state.tableProvince !== "all" && !provinceKeys.includes(state.tableProvince)) {
    state.tableProvince = "all";
    state.tableStation = "all";
  }
  provinceSelect.innerHTML = `<option value="all">全部省份</option>${provinceKeys
    .map(province => `<option value="${province}">${provinceMeta[province].label}</option>`)
    .join("")}`;
  provinceSelect.value = state.tableProvince;

  const stationOptions = baseRecords.filter(record =>
    state.tableProvince === "all" || record.province === state.tableProvince
  );
  if (!stationOptions.some(record => record.id === state.tableStation)) {
    state.tableStation = "all";
  }
  stationSelect.innerHTML = `<option value="all">全部电站</option>${stationOptions
    .map(record => `<option value="${record.id}">${record.name}</option>`)
    .join("")}`;
  stationSelect.value = state.tableStation;
}

function assetTableRecords() {
  let records = assetTableBaseRecords();
  if (state.tableProvince !== "all") {
    records = records.filter(record => record.province === state.tableProvince);
  }
  if (state.tableStation !== "all") {
    records = records.filter(record => record.id === state.tableStation);
  }
  return records;
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

const mapHeatColors = ["#ffffcc", "#fed976", "#fd8d3c", "#f03b20", "#bd0026"];
const mapEmptyColor = "#dce9e4";
const mapProvinceNames = {
  hebei: "河北",
  "inner-mongolia": "内蒙古",
  shandong: "山东",
  zhejiang: "浙江"
};

function mapPeriodFactors(type) {
  const data = businessData[type];
  const monthIndex = currentMonthIndex();
  if (!data) return { monthIndex, actualFactor: 0, targetFactor: 0 };
  const actualFactor = data.monthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.monthly.reduce((sum, value) => sum + value, 0);
  const targetFactor = data.targetMonthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.targetMonthly.reduce((sum, value) => sum + value, 0);
  return { monthIndex, actualFactor, targetFactor };
}

function mapCapacity(record) {
  return record.type === "wind" ? record.capacity || 0 : record.power || 0;
}

function mapVisibleRecords() {
  if (state.assetFilter === "distributed") return [];
  return stationRecords.filter(record =>
    record.type === state.assetFilter &&
    ((record.ownership === "owned" && state.mapOwnedVisible) ||
      (record.ownership === "managed" && state.mapManagedVisible))
  );
}

function mapRevenueContext() {
  const records = mapVisibleRecords().map(financialRecord);
  const { monthIndex, actualFactor, targetFactor } = mapPeriodFactors(state.assetFilter);
  const totalMw = records.reduce((sum, record) => sum + mapCapacity(record), 0);
  const totalRevenue = records.reduce((sum, record) => sum + record.revenue * actualFactor, 0);
  const benchmark = totalMw ? totalRevenue * 10000 / totalMw : 0;
  const provinces = Object.keys(mapProvinceNames).reduce((result, province) => {
    const provinceRecords = records.filter(record => record.province === province);
    const mw = provinceRecords.reduce((sum, record) => sum + mapCapacity(record), 0);
    const revenue = provinceRecords.reduce((sum, record) => sum + record.revenue * actualFactor, 0);
    const intensity = mw ? revenue * 10000 / mw : 0;
    const ratio = benchmark ? intensity / benchmark : 0;
    const band = !mw ? -1 : ratio < .8 ? 0 : ratio < .9 ? 1 : ratio < 1 ? 2 : ratio < 1.1 ? 3 : 4;
    result[province] = { records: provinceRecords, mw, revenue, intensity, ratio, band };
    return result;
  }, {});
  return { records, provinces, benchmark, monthIndex, actualFactor, targetFactor };
}

function paintProvinceMap(context) {
  const mapObject = $("#chinaMapObject");
  if (!mapObject || !mapObject.contentDocument) return;
  const svg = mapObject.contentDocument;
  svg.querySelectorAll("[data-province]").forEach(path => {
    path.style.fill = mapEmptyColor;
    path.style.stroke = "#b8d2c9";
    path.style.strokeWidth = "1";
    path.style.transition = "fill .22s ease";
  });
  Object.entries(mapProvinceNames).forEach(([key, label]) => {
    const path = svg.querySelector(`[data-province="${label}"]`);
    const province = context.provinces[key];
    if (!path || !province) return;
    path.style.fill = province.band >= 0 ? mapHeatColors[province.band] : mapEmptyColor;
    if (state.province === key) {
      path.style.stroke = "#17395f";
      path.style.strokeWidth = "2.4";
    }
  });
}

function formatMapNumber(value) {
  return Number(value).toLocaleString("zh-CN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function renderMapRevenueLegend(context) {
  const benchmark = context.benchmark;
  const ranges = benchmark ? [
    `< ${formatMapNumber(benchmark * .8)}`,
    `${formatMapNumber(benchmark * .8)}–${formatMapNumber(benchmark * .9)}`,
    `${formatMapNumber(benchmark * .9)}–${formatMapNumber(benchmark)}`,
    `${formatMapNumber(benchmark)}–${formatMapNumber(benchmark * 1.1)}`,
    `≥ ${formatMapNumber(benchmark * 1.1)}`
  ] : ["—", "—", "—", "—", "—"];
  $("#provinceRevenueLegend").innerHTML = `
    <div class="map-legend-title"><strong>省份平均单位 MW 收入</strong><span>万元 / MW</span></div>
    <p>${typeLabels[state.assetFilter] || "当前"}组合基准 <b>${benchmark ? formatMapNumber(benchmark) : "—"}</b></p>
    <ol>${ranges.map((range, index) => `<li><i style="background:${mapHeatColors[index]}"></i><span>${range}</span></li>`).join("")}</ol>
    <div class="map-empty-key"><i></i><span>当前范围无场站</span></div>
  `;
}

function stationMarginAttainment(record, context) {
  const target = record.marginTarget * context.targetFactor;
  return target ? record.margin * context.actualFactor / target * 100 : 0;
}

function renderStationMap(context) {
  const layer = $("#stationMapLayer");
  layer.innerHTML = context.records.map(record => {
    const attainment = stationMarginAttainment(record, context);
    const status = attainment >= 100 ? "good" : attainment >= 95 ? "watch" : "bad";
    const selected = state.station !== "all" && state.station === record.id;
    const dimmed = state.province !== "all" && state.province !== record.province;
    return `<button
      class="station-marker ${record.ownership} ${state.mapMarginLayer ? status : "neutral"}${selected ? " selected" : ""}${dimmed ? " dimmed" : ""}"
      style="--station-left:${record.mapX}%;--station-top:${record.mapY}%"
      data-map-station="${record.id}"
      data-view-station="${record.id}"
      aria-label="${record.name}，${record.ownership === "owned" ? "自持" : "代管"}，毛利目标达成率 ${attainment.toFixed(1)}%">
        <i></i><span>${record.name}</span>
    </button>`;
  }).join("");
}

function renderStationPopover(stationId) {
  const source = stationRecords.find(record => record.id === stationId);
  const popover = $("#stationPopover");
  if (!source || source.type !== state.assetFilter) {
    popover.classList.remove("is-visible");
    popover.setAttribute("aria-hidden", "true");
    return;
  }
  const context = mapRevenueContext();
  const record = financialRecord(source);
  const capacity = mapCapacity(record);
  const revenue = record.revenue * context.actualFactor;
  const intensity = capacity ? revenue * 10000 / capacity : 0;
  const margin = record.margin * context.actualFactor;
  const target = record.marginTarget * context.targetFactor;
  const attainment = target ? margin / target * 100 : 0;
  const status = attainment >= 100 ? "good" : attainment >= 95 ? "watch" : "bad";
  popover.style.setProperty("--station-left", `${record.mapX}%`);
  popover.style.setProperty("--station-top", `${record.mapY}%`);
  popover.innerHTML = `
    <div class="station-popover-head">
      <div><span>${provinceMeta[record.province].label} · ${typeLabels[record.type]}</span><h3>${record.name}</h3></div>
      <b>${record.ownership === "owned" ? "自持" : "代管"}</b>
    </div>
    <dl>
      <div><dt>规模</dt><dd>${capacity} MW</dd></div>
      <div><dt>结算收入</dt><dd>${formatMoney(revenue)}</dd></div>
      <div><dt>单位 MW 收入</dt><dd>${formatMapNumber(intensity)} 万元/MW</dd></div>
      <div><dt>YTD 毛利</dt><dd>${formatMoney(margin)}</dd></div>
      <div><dt>累计目标</dt><dd>${formatMoney(target)}</dd></div>
      <div><dt>毛利达成率</dt><dd class="${status}">${attainment.toFixed(1)}%</dd></div>
    </dl>
  `;
  popover.classList.add("is-visible");
  popover.setAttribute("aria-hidden", "false");
}

function renderProvinceRevenueMap() {
  const context = mapRevenueContext();
  $("#mapPeriodLabel").textContent = `截至 ${context.monthIndex + 1} 月`;
  $$("[data-map-asset-type]").forEach(button =>
    button.classList.toggle("active", button.dataset.mapAssetType === state.assetFilter)
  );
  $("#mapOwnedToggle").checked = state.mapOwnedVisible;
  $("#mapManagedToggle").checked = state.mapManagedVisible;
  $("#mapMarginToggle").checked = state.mapMarginLayer;
  $("#mapStatusLegend").classList.toggle("is-muted", !state.mapMarginLayer);
  renderMapRevenueLegend(context);
  renderStationMap(context);
  paintProvinceMap(context);
  if (state.mapStation) renderStationPopover(state.mapStation);
}

function renderComposition() {
  const records = assetTableRecords();
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
  const records = assetTableRecords().map(record => financialMap.get(record.id) || financialRecord(record));
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
