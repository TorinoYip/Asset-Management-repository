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
  if (state.route === "mengxi") renderMengxi();
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
