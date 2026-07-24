window.AssetApp.templates.revenue = `<section class="route-page" data-route="revenue" aria-labelledby="revenueTitle" hidden="">
          <header class="page-heading">
            <div><p class="eyebrow">BUSINESS PERFORMANCE</p><h1 id="revenueTitle">营收总览</h1><p class="page-intro">围绕收入、成本与毛利，统一呈现实际 YTD、截至当月累计目标和全年目标进度。</p></div>
            <button class="back-link" data-go="overview">← 返回资产看板</button>
          </header>

          <div class="asset-tabs" role="tablist" aria-label="经营资产类型">
            <button role="tab" data-business-tab="wind" aria-selected="true">风电经营</button>
            <button role="tab" data-business-tab="storage" aria-selected="false">储能经营</button>
          </div>

          <section class="business-focus">
            <article class="margin-hero">
              <div class="metric-label"><span>核心经营结果</span><b id="businessAssetLabel">风电组合</b></div>
              <p>实际 YTD 毛利</p>
              <div class="money" id="marginActual">¥ 2.74 亿</div>
              <div class="target-line"><span>截至当月累计目标 <b id="marginTarget">¥ 2.88 亿</b></span><span class="negative" id="marginGap">差距 −4.9%</span></div>
              <div class="progress-track"><i id="marginProgress" style="width:95.1%"></i><span class="target-tick"></span></div>
              <div class="hero-foot"><span>全年目标 <b id="annualTarget">¥ 5.10 亿</b></span><span>全年完成进度 <b id="annualProgress">53.7%</b></span></div>
            </article>
            <div class="business-drivers">
              <button class="driver-card active" data-business-metric="margin"><span>总毛利</span><strong id="driverMargin">¥ 2.74 亿</strong><small class="negative" id="driverMarginDelta">距累计目标 −4.9%</small></button>
              <button class="driver-card" data-business-metric="revenue"><span>总收入</span><strong id="driverRevenue">¥ 6.92 亿</strong><small class="positive" id="driverRevenueDelta">距累计目标 +1.8%</small></button>
              <button class="driver-card" data-business-metric="cost"><span>总成本</span><strong id="driverCost">¥ 4.18 亿</strong><small class="negative" id="driverCostDelta">超累计目标 +6.9%</small></button>
            </div>
          </section>

          <section class="business-detail">
            <article class="panel trend-panel">
              <div class="panel-head"><div><p class="section-kicker">ACTUAL VS TARGET</p><h2 id="trendTitle">毛利 · 月度与累计趋势</h2></div><div class="legend"><span><i class="actual-bar"></i>月度实际</span><span><i class="actual-line"></i>累计实际</span><span><i class="target-line-key"></i>累计目标</span></div></div>
              <div class="chart-wrap"><svg id="businessChart" viewBox="0 0 780 280" role="img" aria-label="经营月度与累计趋势图"></svg></div>
            </article>
            <article class="panel composition-panel">
              <div class="panel-head compact"><div><p class="section-kicker">MARGIN BRIDGE</p><h2>经营构成</h2></div></div>
              <div class="bridge-list" id="bridgeList"></div>
            </article>
          </section>

          <article class="panel rank-panel">
            <div class="panel-head"><div><p class="section-kicker">ASSET RANKING</p><h2 id="businessRankTitle">风电项目经营排名</h2></div><span class="table-note">按实际 YTD 毛利排序</span></div>
            <div class="table-scroll"><table><thead><tr><th>资产</th><th>实际 YTD</th><th>累计目标</th><th>差距</th><th>完成率</th><th>全年进度</th><th>状态</th></tr></thead><tbody id="businessTable"></tbody></table></div>
          </article>

          <article class="panel monthly-finance-panel">
            <div class="panel-head">
              <div><p class="section-kicker">MONTHLY FINANCIAL COMPARISON</p><h2>可选月份财务对比</h2></div>
              <label class="metric-select">对比月份
                <select id="compareMonthFilter">
                  <option value="6">2025 年 6 月</option>
                  <option value="5">2025 年 5 月</option>
                  <option value="4">2025 年 4 月</option>
                  <option value="3">2025 年 3 月</option>
                  <option value="2">2025 年 2 月</option>
                  <option value="1">2025 年 1 月</option>
                </select>
              </label>
            </div>
            <div class="table-scroll">
              <table class="month-comparison-table">
                <thead><tr><th>指标</th><th>当前月</th><th id="comparisonMonthLabel">2025 年 6 月</th><th>变化额</th><th>变化率</th><th>判断</th></tr></thead>
                <tbody id="monthComparisonTable"></tbody>
              </table>
            </div>
          </article>
        </section>`;
