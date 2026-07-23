function periodLabel(period) {
  return period === "ytd"
    ? `YTD · 截至 2025 年 ${currentMonthIndex() + 1} 月`
    : `2025 年 ${period} 月`;
}

function updateTypePeriodOptions() {
  const select = $("#typePeriodFilter");
  const cutoffMonth = currentMonthIndex() + 1;
  if (state.typePeriod !== "ytd" && Number(state.typePeriod) > cutoffMonth) {
    state.typePeriod = "ytd";
  }
  select.innerHTML = [
    `<option value="ytd">YTD · 截至 2025 年 ${cutoffMonth} 月</option>`,
    ...Array.from({ length: cutoffMonth }, (_, index) => cutoffMonth - index)
      .map(month => `<option value="${month}">2025 年 ${month} 月</option>`)
  ].join("");
  select.value = state.typePeriod;
}

function periodAdjusted(record) {
  const normalized = financialRecord(record);
  const data = businessData[record.type];
  if (!data) return { ...record, revenue: 0, cost: 0, margin: 0, attainment: 0 };
  const actualTotal = data.monthly.reduce((sum, value) => sum + value, 0);
  const targetTotal = data.targetMonthly.reduce((sum, value) => sum + value, 0);
  const cutoffIndex = currentMonthIndex();
  const periodIndex = state.typePeriod === "ytd"
    ? cutoffIndex
    : Math.max(0, Math.min(Number(state.typePeriod) - 1, cutoffIndex));
  const actualFactor = state.typePeriod === "ytd"
    ? data.monthly.slice(0, periodIndex + 1).reduce((sum, value) => sum + value, 0) / actualTotal
    : data.monthly[periodIndex] / actualTotal;
  const targetFactor = state.typePeriod === "ytd"
    ? data.targetMonthly.slice(0, periodIndex + 1).reduce((sum, value) => sum + value, 0) / targetTotal
    : data.targetMonthly[periodIndex] / targetTotal;
  const margin = normalized.margin * actualFactor;
  const target = normalized.marginTarget * targetFactor;
  return {
    ...record,
    revenue: normalized.revenue * actualFactor,
    cost: normalized.cost * actualFactor,
    margin,
    attainment: target ? margin / target * 100 : 0
  };
}

function renderTypes() {
  state.typeAsset = state.assetFilter;
  updateTypePeriodOptions();
  $$("[data-type-tab]").forEach(button => button.setAttribute("aria-selected", button.dataset.typeTab === state.assetFilter));
  const records = scopedRecords(state.assetFilter).map(periodAdjusted);
  const label = typeLabels[state.assetFilter];
  const period = periodLabel(state.typePeriod);
  $("#typeComparisonTitle").textContent = `${label}站点横向比较 · ${period}`;
  $("#typeTableTitle").textContent = `${label}站点经营数据`;
  if (!records.length) {
    const scope = state.assetFilter === "distributed" ? "分布式资产条目将在数据口径确认后接入。" : "当前时间、省份和电站条件下暂无资产。";
    $("#typeSummary").innerHTML = `<article class="empty-state">${scope}</article>`;
    $("#typeComparisonList").innerHTML = `<p class="empty-state">暂无可比较的资产</p>`;
    $("#typeDistribution").innerHTML = `<p class="empty-state">暂无分布数据</p>`;
    $("#typeAnalysisTable").innerHTML = `<tr><td colspan="9" class="empty-state">暂无数据</td></tr>`;
    return;
  }
  const totals = records.reduce((sum, record) => {
    sum.revenue += record.revenue;
    sum.cost += record.cost;
    sum.margin += record.margin;
    sum.attainment += record.attainment;
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, attainment: 0 });
  const average = totals.attainment / records.length;
  $("#typeSummary").innerHTML = [
    ["同类资产", `${records.length} 座`, `${provinceMeta[state.province].label} · ${label}`],
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
