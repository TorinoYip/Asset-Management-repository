window.AssetApp.templates.overview = `<section class="route-page" data-route="overview" aria-labelledby="overviewTitle">
          <header class="page-heading overview-heading">
            <div>
              <p class="eyebrow">PORTFOLIO EXECUTIVE OVERVIEW</p>
              <h1 id="overviewTitle">资产看板</h1>
              <p class="page-intro">一级总览先呈现经营结果与资产状态，再通过省份、电站和资产类型进入二级视图。</p>
            </div>
            <div class="scope-stamp"><span>当前范围</span><strong data-scope="">全部省份 · 全部电站 · 风电</strong></div>
          </header>

          <section class="overview-primary" aria-label="一级资产大屏">
            <button class="executive-card revenue-card" data-go="revenue">
              <span class="card-sequence">01 / 经营摘要</span>
              <div class="executive-title"><div><p id="overviewPeriodLabel">实际 YTD 毛利 · 截至 2025 年 7 月</p><strong id="overviewMargin">¥ 2.74 亿</strong></div><span class="status-chip watch" id="overviewTargetStatus">未达累计目标</span></div>
              <div class="executive-metrics">
                <div><small>累计目标</small><b id="overviewTarget">¥ 2.88 亿</b></div>
                <div><small>达成率</small><b id="overviewAttainment">95.1%</b></div>
                <div><small>YTD 收入</small><b id="overviewRevenue">¥ 6.92 亿</b></div>
                <div><small>YTD 成本</small><b id="overviewCost">¥ 4.18 亿</b></div>
              </div>
              <span class="card-entry">进入营收总览 →</span>
            </button>

            <article class="executive-card asset-card">
              <span class="card-sequence">02 / 资产概况</span>
              <div class="asset-headline"><strong id="overviewStationCount">9</strong><span>座电站<br><b id="overviewAssetDescriptor">199 台风机</b></span></div>
              <div class="asset-overview-grid">
                <div><small>风电装机</small><b id="overviewWindCapacity">1.26 GW</b></div>
                <div><small>储能功率</small><b id="overviewStoragePower">0 MW</b></div>
                <div><small>储能容量</small><b id="overviewStorageEnergy">0 MWh</b></div>
                <div><small>正常运行</small><b id="overviewNormalAssets">7 / 9</b></div>
              </div>
            </article>
          </section>

          <section class="overview-secondary" aria-label="二级资产概况">
            <article class="overview-mini-card">
              <span>风电规模</span><strong id="windStationCount">9 座</strong>
              <p id="windScaleSummary">1.26 GW · 199 台风机</p>
              <div class="mini-progress"><i id="windScaleProgress" style="width:100%"></i></div>
            </article>
            <article class="overview-mini-card storage">
              <span>储能规模</span><strong id="storageStationCount">0 座</strong>
              <p id="storageScaleSummary">0 MW / 0 MWh</p>
              <div class="mini-progress"><i id="storageScaleProgress" style="width:0%"></i></div>
            </article>
            <article class="overview-mini-card health">
              <span>资产状态</span><strong id="assetHealthRate">77.8%</strong>
              <p><b class="positive" id="normalAssetLabel">7 正常</b> · <b class="negative" id="riskAssetLabel">2 关注</b></p>
              <div class="status-dots" id="assetStatusDots"></div>
            </article>
          </section>

          <section class="panel province-map-panel">
            <div class="panel-head">
              <div><h2>资产明细 · 省份分布</h2></div>
            </div>
            <div class="province-map-layout">
              <div class="province-map" id="provinceMap" aria-label="中国省份资产分布交互地图">
                <object class="china-map-base" id="chinaMapObject" type="image/svg+xml" data="assets/china-map.svg" tabindex="-1" aria-hidden="true">
                  <img src="assets/china-map.svg" alt="">
                </object>
                <aside class="map-overlay map-revenue-legend" id="provinceRevenueLegend" aria-label="省份单位兆瓦收入图例"></aside>
                <aside class="map-overlay map-control-panel" aria-label="地图图层控制">
                  <div class="map-control-heading"><strong>地图图层</strong><span id="mapPeriodLabel">截至 7 月</span></div>
                  <div class="map-control-group">
                    <span>资产类型</span>
                    <div class="map-segmented">
                      <button data-map-asset-type="wind" class="active">风电</button>
                      <button data-map-asset-type="storage">储能</button>
                    </div>
                  </div>
                  <div class="map-control-group map-checks">
                    <span>权属范围</span>
                    <label><input type="checkbox" id="mapOwnedToggle" checked><i class="shape-owned"></i>自持</label>
                    <label><input type="checkbox" id="mapManagedToggle" checked><i class="shape-managed"></i>代管</label>
                  </div>
                  <div class="map-control-group map-layer-toggle">
                    <label><input type="checkbox" id="mapMarginToggle" checked><span>毛利达标图层</span></label>
                  </div>
                  <div class="map-status-legend" id="mapStatusLegend">
                    <span><i class="good"></i>≥ 100%</span>
                    <span><i class="watch"></i>95–100%</span>
                    <span><i class="bad"></i>&lt; 95%</span>
                  </div>
                </aside>
                <div class="station-map-layer" id="stationMapLayer" aria-label="电站点位"></div>
                <aside class="station-popover" id="stationPopover" aria-live="polite" aria-hidden="true"></aside>
              </div>
            </div>
          </section>

          <div class="asset-table-scope-bar" aria-label="资产表格筛选">
            <span>资产表筛选</span>
            <label>省份
              <select id="tableProvinceFilter">
                <option value="all">全部省份</option>
              </select>
            </label>
            <label>电站
              <select id="tableStationFilter">
                <option value="all">全部电站</option>
              </select>
            </label>
          </div>

          <section class="panel portfolio-table-panel">
            <div class="panel-head">
              <div><p class="section-kicker">ASSET COMPOSITION</p><h2>资产构成</h2></div>
              <span class="table-note">口径：截至当前统计期的在运资产</span>
            </div>
            <div class="table-scroll">
              <table class="composition-table">
                <thead><tr><th>省份</th><th>风电场</th><th>储能站</th><th>总电站</th><th>风电装机</th><th>风机数量</th><th>储能功率</th><th>储能容量</th><th>构成</th></tr></thead>
                <tbody id="compositionTable"></tbody>
                <tfoot id="compositionTableFoot"></tfoot>
              </table>
            </div>
          </section>

          <section class="panel asset-detail-panel">
            <div class="panel-head asset-detail-head">
              <div><p class="section-kicker">ASSET REGISTER</p><h2>资产明细</h2></div>
            </div>
            <div class="selection-summary"><span><b id="selectedAssetCount">0</b> 个条目已选择</span><button id="clearAssetSelection">清除选择</button></div>
            <div class="table-scroll">
              <table class="asset-register-table">
                <thead><tr><th><input id="selectAllAssets" type="checkbox" aria-label="选择全部电站"></th><th>电站</th><th>类型</th><th>所属省份</th><th>装机 / 容量</th><th>YTD 毛利</th><th>累计目标达成率</th><th>核心运营指标</th><th>状态</th><th>操作</th></tr></thead>
                <tbody id="assetRegisterTable"></tbody>
              </table>
            </div>
          </section>
        </section>`;
