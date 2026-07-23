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
