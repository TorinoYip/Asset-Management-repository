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
    <div class="province-stations table-scroll">
      <table class="province-asset-table">
        <thead><tr><th>机组资产</th><th>类型</th><th>装机 / 容量</th><th>YTD 毛利</th><th>累计目标达成率</th><th>核心运营指标</th><th>状态</th><th></th></tr></thead>
        <tbody>${records.length ? financialRecords.map(record => {
          const recordTarget = record.marginTarget * targetFactor;
          const recordActual = record.margin * actualFactor;
          const recordAttainment = recordTarget ? recordActual / recordTarget * 100 : 0;
          return `<tr>
            <td><strong>${record.name}</strong></td>
            <td><span class="type-pill ${record.type}">${typeLabels[record.type]}</span></td>
            <td>${record.size}</td>
            <td>${formatMoney(recordActual)}</td>
            <td class="${recordAttainment >= 100 ? "positive" : "negative"}">${recordAttainment.toFixed(1)}%</td>
            <td>${record.ops}</td>
            <td><span class="status-pill ${record.status}">${statusLabel(record.status)}</span></td>
            <td><button class="row-action" data-view-station="${record.id}">查看</button></td>
          </tr>`;
        }).join("") : `<tr><td colspan="8" class="popover-empty">当前筛选范围在该省暂无资产</td></tr>`}</tbody>
      </table>
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
