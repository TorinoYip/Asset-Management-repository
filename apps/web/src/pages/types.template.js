window.AssetApp.templates.types = `<section class="route-page" data-route="types" aria-labelledby="typesTitle" hidden="">
          <header class="page-heading">
            <div><p class="eyebrow">ASSET TYPE BENCHMARK</p><h1 id="typesTitle">按类型分析</h1><p class="page-intro">在相同资产类型和相同时间尺度下横向比较站点，识别表现分层与相对差距。</p></div>
            <button class="back-link" data-go="overview">← 返回资产看板</button>
          </header>

          <div class="analysis-toolbar">
            <div class="asset-tabs type-tabs" role="tablist" aria-label="分析资产类型">
              <button role="tab" data-type-tab="wind" aria-selected="true">风电</button>
              <button role="tab" data-type-tab="storage" aria-selected="false">储能</button>
              <button role="tab" data-type-tab="distributed" aria-selected="false">分布式</button>
            </div>
            <label class="period-selector">时间尺度
              <select id="typePeriodFilter">
                <option value="ytd">YTD · 截至 2025 年 7 月</option>
                <option value="7">2025 年 7 月</option>
                <option value="6">2025 年 6 月</option>
                <option value="5">2025 年 5 月</option>
                <option value="4">2025 年 4 月</option>
                <option value="3">2025 年 3 月</option>
                <option value="2">2025 年 2 月</option>
                <option value="1">2025 年 1 月</option>
              </select>
            </label>
          </div>

          <section class="type-summary" id="typeSummary"></section>

          <section class="type-analysis-grid">
            <article class="panel type-comparison-panel">
              <div class="panel-head"><div><p class="section-kicker">PEER COMPARISON</p><h2 id="typeComparisonTitle">风电站点横向比较 · YTD</h2></div><span class="table-note">柱长表示目标达成率</span></div>
              <div class="comparison-list" id="typeComparisonList"></div>
            </article>
            <article class="panel type-rank-panel">
              <div class="panel-head"><div><p class="section-kicker">PERFORMANCE DISTRIBUTION</p><h2>同类资产分布</h2></div></div>
              <div class="distribution-box" id="typeDistribution"></div>
            </article>
          </section>

          <article class="panel rank-panel">
            <div class="panel-head"><div><p class="section-kicker">PEER TABLE</p><h2 id="typeTableTitle">风电站点经营数据</h2></div><span class="table-note">统一口径，支持 YTD / 具体月份切换</span></div>
            <div class="table-scroll">
              <table><thead><tr><th>站点</th><th>省份</th><th>时间尺度</th><th>收入</th><th>成本</th><th>毛利</th><th>目标达成率</th><th>核心运营指标</th><th>状态</th></tr></thead><tbody id="typeAnalysisTable"></tbody></table>
            </div>
          </article>
        </section>`;
