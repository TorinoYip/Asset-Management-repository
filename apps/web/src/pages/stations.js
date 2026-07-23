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
