window.AssetApp.templates.stations = `<section class="route-page" data-route="stations" aria-labelledby="stationsTitle" hidden="">
          <header class="page-heading">
            <div><p class="eyebrow">STATION PERFORMANCE</p><h1 id="stationsTitle">按站点分析</h1><p class="page-intro">选中一个电站后，在同一页查看经营、运营、运维和结算拆解。</p></div>
            <button class="back-link" data-go="overview">← 返回资产看板</button>
          </header>

          <article class="station-context">
            <div><span>当前站点</span><strong id="stationContextName">全部电站</strong><small id="stationContextMeta">全部省份 · 风电 · 截至 2025 年 7 月</small></div>
            <div class="station-context-stats"><span><small>运行状态</small><b class="positive" id="stationStatus">正常</b></span><span><small>数据完整度</small><b>100%</b></span><span><small>经营达成</small><b id="stationAttainment">97.4%</b></span></div>
          </article>

          <div class="asset-tabs" role="tablist" aria-label="站点资产类型">
            <button role="tab" data-operations-tab="wind" aria-selected="true">风电 · 单机</button>
            <button role="tab" data-operations-tab="storage" aria-selected="false">储能 · 单站</button>
          </div>

          <section class="station-finance">
            <article><span>YTD 收入</span><strong id="stationRevenue">¥ 0.92 亿</strong><small class="positive">累计目标 +1.8%</small></article>
            <article><span>YTD 成本</span><strong id="stationCost">¥ 0.54 亿</strong><small class="negative">累计目标 +4.1%</small></article>
            <article><span>YTD 毛利</span><strong id="stationMargin">¥ 0.38 亿</strong><small class="negative">累计目标 −2.6%</small></article>
            <article><span>全年进度</span><strong id="stationAnnualProgress">54.2%</strong><small>全年目标 ¥ 0.70 亿</small></article>
          </section>

          <section class="operations-lead">
            <article class="ops-primary">
              <span class="metric-overline" id="opsPrimaryOverline">风电组合核心指标</span>
              <div class="ops-value"><strong id="opsPrimaryValue">97.2</strong><span id="opsPrimaryUnit">%</span></div>
              <h2 id="opsPrimaryName">风机可利用率</h2>
              <p><span class="positive" id="opsPrimaryDelta">高于目标 +0.4pp</span> · <span id="opsPrimaryContext">组合加权，199 台风机</span></p>
              <div class="benchmark"><span>风险线 95%</span><i><b id="benchmarkFill" style="width:82%"></b></i><span>目标 96.8%</span></div>
            </article>
            <div class="ops-kpis" id="opsKpis"></div>
          </section>

          <section class="operations-detail">
            <article class="panel comparison-panel">
              <div class="panel-head"><div><p class="section-kicker">MONTHLY ASSET COMPARISON</p><h2 id="comparisonTitle">单机月度对比 · 可利用率</h2></div><label class="metric-select">对比指标 <select id="opsMetricSelect"></select></label></div>
              <div class="comparison-list" id="comparisonList"></div>
            </article>
            <aside class="maintenance-stack">
              <article class="panel maintenance-card">
                <p class="section-kicker">MAINTENANCE SUMMARY</p><h2>运维异常摘要</h2>
                <div class="maintenance-number"><strong id="maintenanceCount">6</strong><span>个资产<br>需要关注</span></div>
                <div class="maintenance-grid"><div><small>MTTR</small><b id="maintenanceMttr">5.8h</b></div><div><small>非计划损失</small><b id="maintenanceLoss">21.4h</b></div></div>
                <p class="quiet">当前只披露运维摘要，不展开告警与工单闭环。</p>
              </article>
              <article class="panel anomaly-card">
                <div><span class="risk-pulse"></span><p><strong id="anomalyAsset">海岳 · WT-17</strong><small id="anomalyReason">可利用率连续两月低于目标</small></p></div>
                <button id="focusAnomaly">定位资产 →</button>
              </article>
            </aside>
          </section>

          <article class="panel settlement-panel">
            <div class="panel-head"><div><p class="section-kicker">FINANCIAL BREAKDOWN</p><h2>结算单拆解</h2><p class="panel-description">用同一张明细表承接财务结果与运营贡献，示例口径以后续实际结算字段为准。</p></div><span class="table-note">单位：万元</span></div>
            <div class="table-scroll">
              <table><thead><tr><th>结算项目</th><th>本月实际</th><th>本月目标</th><th>差异</th><th>YTD 实际</th><th>YTD 目标</th><th>说明</th></tr></thead><tbody id="settlementTable"></tbody></table>
            </div>
          </article>
        </section>`;
