function renderMengxi() {
  const station = selectedStation();
  const province = provinceMeta[state.province]?.label || "全部省份";
  const stationName = station?.name || "全部电站";
  const type = typeLabels[state.assetFilter] || "风电";
  const month = currentMonthIndex() + 1;
  const isMengxiScope = state.province === "inner-mongolia" || station?.province === "inner-mongolia";
  $("#mengxiScopeTitle").textContent = isMengxiScope
    ? `${station?.name || "蒙西资产组合"} · 日报入口`
    : "蒙西日度经营与运营视图";
  $("#mengxiScopeMeta").textContent = `${province} · ${stationName} · ${type} · 当前月度上下文截至 2025 年 ${month} 月。${isMengxiScope ? "后续日度页面将继承当前省份、电站与资产类型。" : "蒙西日报仅对内蒙古范围资产启用，当前筛选条件下暂不展开。"}`
}
