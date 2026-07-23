$("#mainContent").innerHTML = routes.map(route => AssetApp.templates[route]).join("");

function initialize() {
  updateStationFilter();
  bindEvents();
  const initialRoute = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : "overview";
  setRoute(initialRoute, false);
}

initialize();
