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
    state.assetFilter = button.dataset.typeTab;
    state.typeAsset = state.assetFilter;
    state.station = "all";
    if (state.assetFilter !== "distributed") state.operationsType = state.assetFilter;
    $("#assetFilter").value = state.assetFilter;
    updateStationFilter();
    updateScope();
    renderTypes();
  }));
  $("#typePeriodFilter").addEventListener("change", event => {
    state.typePeriod = event.target.value;
    renderTypes();
  });

  $$("[data-operations-tab]").forEach(button => button.addEventListener("click", () => {
    state.operationsType = button.dataset.operationsTab;
    state.assetFilter = state.operationsType;
    state.typeAsset = state.assetFilter;
    state.station = "all";
    $("#assetFilter").value = state.assetFilter;
    updateStationFilter();
    updateScope();
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
      $("#provincePopover").classList.add("is-visible");
      $("#provincePopover").setAttribute("aria-hidden", "false");
      $$(".province-point").forEach(item => item.classList.toggle("active", item === point));
    }));
  });
  $("#provinceMap").addEventListener("mouseleave", () => {
    $("#provincePopover").classList.remove("is-visible");
    $("#provincePopover").setAttribute("aria-hidden", "true");
    $$(".province-point").forEach(point => point.classList.remove("active"));
  });
  $("#provinceMap").addEventListener("focusout", event => {
    if ($("#provinceMap").contains(event.relatedTarget)) return;
    $("#provincePopover").classList.remove("is-visible");
    $("#provincePopover").setAttribute("aria-hidden", "true");
    $$(".province-point").forEach(point => point.classList.remove("active"));
  });
}
