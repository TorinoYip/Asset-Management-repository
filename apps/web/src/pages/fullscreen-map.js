function hideFullscreenStationPopover() {
  state.mapStation = null;
  $("#stationPopover").classList.remove("is-visible");
  $("#stationPopover").setAttribute("aria-hidden", "true");
}

function initializeFullscreenMap() {
  const params = new URLSearchParams(location.search);
  const requestedMonth = params.get("month");
  const requestedType = params.get("type");
  if (["2025-06", "2025-07"].includes(requestedMonth)) state.month = requestedMonth;
  if (["wind", "storage"].includes(requestedType)) state.assetFilter = requestedType;
  state.province = "all";
  state.station = "all";

  $("#fullscreenMonthFilter").value = state.month;
  $("#fullscreenMonthFilter").addEventListener("change", event => {
    state.month = event.target.value;
    hideFullscreenStationPopover();
    renderProvinceRevenueMap();
  });

  $$("[data-map-asset-type]").forEach(button => button.addEventListener("click", () => {
    state.assetFilter = button.dataset.mapAssetType;
    hideFullscreenStationPopover();
    renderProvinceRevenueMap();
  }));
  $("#mapOwnedToggle").addEventListener("change", event => {
    state.mapOwnedVisible = event.target.checked;
    hideFullscreenStationPopover();
    renderProvinceRevenueMap();
  });
  $("#mapManagedToggle").addEventListener("change", event => {
    state.mapManagedVisible = event.target.checked;
    hideFullscreenStationPopover();
    renderProvinceRevenueMap();
  });
  $("#mapMarginToggle").addEventListener("change", event => {
    state.mapMarginLayer = event.target.checked;
    renderProvinceRevenueMap();
  });

  $("#chinaMapObject").addEventListener("load", () => paintProvinceMap(mapRevenueContext()));
  $("#stationMapLayer").addEventListener("pointerover", event => {
    const marker = event.target.closest("[data-map-station]");
    if (!marker) return;
    state.mapStation = marker.dataset.mapStation;
    renderStationPopover(state.mapStation);
  });
  $("#stationMapLayer").addEventListener("pointerout", event => {
    const marker = event.target.closest("[data-map-station]");
    const nextMarker = event.relatedTarget && event.relatedTarget.closest
      ? event.relatedTarget.closest("[data-map-station]")
      : null;
    if (!marker || nextMarker) return;
    hideFullscreenStationPopover();
  });
  $("#stationMapLayer").addEventListener("focusin", event => {
    const marker = event.target.closest("[data-map-station]");
    if (!marker) return;
    state.mapStation = marker.dataset.mapStation;
    renderStationPopover(state.mapStation);
  });
  $("#provinceMap").addEventListener("mouseleave", hideFullscreenStationPopover);
  $("#provinceMap").addEventListener("focusout", event => {
    if ($("#provinceMap").contains(event.relatedTarget)) return;
    hideFullscreenStationPopover();
  });

  renderProvinceRevenueMap();
}

initializeFullscreenMap();
