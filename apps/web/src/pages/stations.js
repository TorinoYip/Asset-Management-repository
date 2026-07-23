function selectedStation() {
  return stationRecords.find(record => record.id === state.station) || null;
}

function renderStations() {
  const station = selectedStation();
  const selectedType = station?.type || state.assetFilter;
  const month = currentMonthIndex() + 1;
  const contextProvince = station ? provinceMeta[station.province].label : provinceMeta[state.province].label;

  if (selectedType === "distributed") {
    $("#stationContextName").textContent = "分布式资产";
    $("#stationContextMeta").textContent = `${contextProvince} · 截至 2025 年 ${month} 月`;
    $("#stationStatus").textContent = "待接入";
    $("#stationStatus").className = "";
    $("#stationAttainment").textContent = "—";
    ["stationRevenue", "stationCost", "stationMargin", "stationAnnualProgress"].forEach(id => { $(`#${id}`).textContent = "—"; });
    $("#opsKpis").innerHTML = `<article class="empty-state">分布式运营口径将在资产条目确认后接入。</article>`;
    $("#comparisonList").innerHTML = `<p class="empty-state">暂无可比较资产</p>`;
    $("#settlementTable").innerHTML = `<tr><td colspan="7" class="empty-state">暂无结算数据</td></tr>`;
    return;
  }

  state.operationsType = selectedType;
  const data = operationsData[selectedType];
  const slice = financialSlice(selectedType);
  const records = slice.records;
  const normalizedStation = station ? financialRecord(station) : null;
  const actual = normalizedStation ? normalizedStation.margin * slice.actualFactor : slice.actual;
  const target = normalizedStation ? normalizedStation.marginTarget * slice.targetFactor : slice.target;
  const revenue = normalizedStation ? normalizedStation.revenue * slice.actualFactor : slice.revenue;
  const cost = normalizedStation ? normalizedStation.cost * slice.actualFactor : slice.cost;
  const attainment = target ? actual / target * 100 : 0;
  const annual = normalizedStation
    ? normalizedStation.marginTarget * (businessData[selectedType].annual / businessData[selectedType].target)
    : slice.annual;
  const annualProgress = annual ? actual / annual * 100 : 0;
  const contextName = station?.name || `${contextProvince} · ${typeLabels[selectedType]}组合`;
  const attentionRecords = records.filter(record => record.status !== "good");
  const hasAbnormal = attentionRecords.some(record => record.status === "bad");

  $("#stationContextName").textContent = contextName;
  $("#stationContextMeta").textContent = `${contextProvince} · ${typeLabels[selectedType]} · 截至 2025 年 ${month} 月`;
  $("#stationStatus").textContent = station
    ? statusLabel(station.status)
    : hasAbnormal ? "存在异常" : attentionRecords.length ? "存在关注" : records.length ? "整体正常" : "暂无资产";
  $("#stationStatus").className = hasAbnormal || attentionRecords.length ? "negative" : "positive";
  $("#stationAttainment").textContent = records.length ? `${attainment.toFixed(1)}%` : "—";
  $("#stationRevenue").textContent = formatMoney(revenue);
  $("#stationCost").textContent = formatMoney(cost);
  $("#stationMargin").textContent = formatMoney(actual);
  $("#stationAnnualProgress").textContent = records.length ? `${annualProgress.toFixed(1)}%` : "—";

  $$("[data-operations-tab]").forEach(button => button.setAttribute("aria-selected", button.dataset.operationsTab === selectedType));
  const parsedOperations = records
    .map(record => Number((record.ops.match(/[\d.]+/) || [])[0]))
    .filter(Number.isFinite);
  const primaryValue = station
    ? Number((station.ops.match(/[\d.]+/) || [data.primary.value])[0])
    : parsedOperations.length
      ? parsedOperations.reduce((sum, value) => sum + value, 0) / parsedOperations.length
      : Number(data.primary.value);
  $("#opsPrimaryOverline").textContent = data.primary.overline;
  $("#opsPrimaryValue").textContent = records.length ? primaryValue.toFixed(1) : "—";
  $("#opsPrimaryUnit").textContent = data.primary.unit;
  $("#opsPrimaryName").textContent = data.primary.name;
  $("#opsPrimaryDelta").textContent = records.length ? (primaryValue >= Number(data.primary.value) ? "达到组合参考值" : "低于组合参考值") : "当前范围无资产";
  $("#opsPrimaryDelta").className = primaryValue >= Number(data.primary.value) ? "positive" : "negative";
  $("#opsPrimaryContext").textContent = station ? station.name : `${contextProvince} · ${records.length} 座电站`;
  $("#benchmarkFill").style.width = `${Math.max(0, Math.min(100, primaryValue))}%`;
  renderScopedOpsKpis(selectedType, records, slice);
  renderOpsMetricSelect(data);
  renderOperationsComparison(data, records);

  const riskRecord = records.find(record => record.status === "bad") || records.find(record => record.status === "watch");
  $("#maintenanceCount").textContent = attentionRecords.length;
  $("#maintenanceMttr").textContent = attentionRecords.length ? data.maintenance[1] : "—";
  $("#maintenanceLoss").textContent = attentionRecords.length ? data.maintenance[2] : "—";
  $("#anomalyAsset").textContent = riskRecord?.name || "当前范围无异常资产";
  $("#anomalyReason").textContent = riskRecord ? riskRecord.ops : "当前筛选范围运行正常";
  $("#settlementTable").innerHTML = settlementData[selectedType].map(row => `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td><td class="${row[3].startsWith("+") ? "positive" : "negative"}">${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td><td>${row[6]}</td></tr>`).join("");
}

function renderScopedOpsKpis(type, records, slice) {
  const scale = assetScale(records);
  if (!records.length) {
    $("#opsKpis").innerHTML = `<article class="empty-state">当前时间、省份和电站条件下暂无运营数据。</article>`;
    return;
  }
  const risk = records.filter(record => record.status !== "good").length;
  const kpis = type === "wind"
    ? [
      ["YTD 上网电量", `${Math.round(scale.windCapacity * 1.46 * slice.actualFactor)} GWh`, `截至 ${slice.monthIndex + 1} 月`, "positive"],
      ["限电率", `${(2.2 + risk * .9).toFixed(1)}%`, risk ? "存在受限资产" : "组合稳定", risk ? "negative" : "positive"],
      ["计划损失率", `${(1.0 + risk * .2).toFixed(1)}%`, `${records.length} 座风电场`, "positive"],
      ["非计划损失率", `${(1.1 + risk * .7).toFixed(1)}%`, risk ? `${risk} 座需要关注` : "目标内", risk ? "negative" : "positive"]
    ]
    : [
      ["YTD 充电量", `${Math.round(scale.storageEnergy * 1.15 * slice.actualFactor)} GWh`, `截至 ${slice.monthIndex + 1} 月`, "positive"],
      ["YTD 放电量", `${Math.round(scale.storageEnergy * 1.01 * slice.actualFactor)} GWh`, `${records.length} 座储能站`, "positive"],
      ["容量可利用率", `${(93.4 - risk * 1.8).toFixed(1)}%`, risk ? "存在关注资产" : "组合稳定", risk ? "negative" : "positive"],
      ["时间可利用率", `${(98.6 - risk * .7).toFixed(1)}%`, risk ? `${risk} 座需要关注` : "目标内", risk ? "negative" : "positive"]
    ];
  $("#opsKpis").innerHTML = kpis.map(([name, value, note, status]) => `<article class="ops-kpi"><span>${name}</span><strong>${value}</strong><small class="${status}">${note}</small></article>`).join("");
}

function renderOpsMetricSelect(data) {
  const select = $("#opsMetricSelect");
  if (!data.metrics[state.operationsMetric]) state.operationsMetric = Object.keys(data.metrics)[0];
  select.innerHTML = Object.entries(data.metrics).map(([value, [label]]) => `<option value="${value}">${label}</option>`).join("");
  select.value = state.operationsMetric;
}

function renderOperationsComparison(data, records) {
  const [label, unit] = data.metrics[state.operationsMetric];
  const allowedNames = new Set(records.map(record => record.name));
  const allowedProvinces = new Set(records.map(record => provinceMeta[record.province].label));
  const rows = data.comparison[state.operationsMetric].filter(row => {
    if (state.operationsType === "wind") return allowedNames.has(row[1]);
    return records.some(record => row[0].includes(record.name.replace("电站", ""))) || (state.station === "all" && allowedProvinces.has(row[1]));
  });
  $("#comparisonTitle").textContent = `${state.operationsType === "wind" ? "单机" : "单站"}月度对比 · ${label} · 2025 年 ${currentMonthIndex() + 1} 月`;
  if (!rows.length) {
    $("#comparisonList").innerHTML = `<p class="empty-state">当前范围暂无可比较资产</p>`;
    return;
  }
  const max = Math.max(...rows.map(row => row[2]));
  const lowerIsBetter = state.operationsMetric === "curtailment" || state.operationsMetric === "mttr" || state.operationsMetric === "unplanned";
  $("#comparisonList").innerHTML = rows.map((row, index) => {
    const risk = lowerIsBetter ? row[2] === max : row[2] < max * .97;
    return `<div class="comparison-row ${risk ? "risk" : ""}"><div class="comparison-name"><strong>${row[0]}</strong><small>${row[1]}</small></div><div class="comparison-track"><i style="width:${Math.max(12, row[2] / max * 100)}%"></i></div><div class="comparison-value">${row[2]}${unit}</div><div class="comparison-rank">#${index + 1}</div></div>`;
  }).join("");
}
