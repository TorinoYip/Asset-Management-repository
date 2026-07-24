function stationCatalog(type = state.assetFilter) {
  return stationRecords.filter(record => type === "distributed" ? false : record.type === type);
}

function scopedRecords(type = state.assetFilter) {
  if (type === "distributed") return [];
  let records = stationRecords.filter(record => record.type === type);
  if (state.province !== "all") records = records.filter(record => record.province === state.province);
  if (state.station !== "all") records = records.filter(record => record.id === state.station);
  return records;
}

function financialRecord(record) {
  const typeRecords = stationRecords.filter(item => item.type === record.type);
  const data = businessData[record.type];
  const raw = typeRecords.reduce((sum, item) => {
    sum.revenue += item.revenue;
    sum.cost += item.cost;
    sum.margin += item.margin;
    sum.target += item.margin / (item.attainment / 100);
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, target: 0 });
  return {
    ...record,
    revenue: record.revenue * data.revenue / raw.revenue,
    cost: record.cost * data.cost / raw.cost,
    margin: record.margin * data.actual / raw.margin,
    marginTarget: (record.margin / (record.attainment / 100)) * data.target / raw.target
  };
}

function currentMonthIndex() {
  const month = Number(state.month.split("-")[1]) || 7;
  return Math.max(0, Math.min(month - 1, 6));
}

function financialSlice(type = state.assetFilter) {
  const data = businessData[type];
  const records = scopedRecords(type).map(financialRecord);
  if (!data) {
    return {
      type, records: [], actual: 0, target: 0, annual: 0, revenue: 0, cost: 0,
      attainment: 0, annualProgress: 0, actualFactor: 0, targetFactor: 0,
      monthIndex: currentMonthIndex(), scopeShare: 0, targetScopeShare: 0
    };
  }
  const monthIndex = currentMonthIndex();
  const actualFactor = data.monthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.monthly.reduce((sum, value) => sum + value, 0);
  const targetFactor = data.targetMonthly.slice(0, monthIndex + 1).reduce((sum, value) => sum + value, 0) /
    data.targetMonthly.reduce((sum, value) => sum + value, 0);
  const july = records.reduce((sum, record) => {
    sum.revenue += record.revenue;
    sum.cost += record.cost;
    sum.margin += record.margin;
    sum.target += record.marginTarget;
    return sum;
  }, { revenue: 0, cost: 0, margin: 0, target: 0 });
  const actual = july.margin * actualFactor;
  const target = july.target * targetFactor;
  const revenue = july.revenue * actualFactor;
  const cost = july.cost * actualFactor;
  const annual = july.target * (data.annual / data.target);
  return {
    type, records, data, actual, target, annual, revenue, cost,
    attainment: target ? actual / target * 100 : 0,
    annualProgress: annual ? actual / annual * 100 : 0,
    actualFactor, targetFactor, monthIndex,
    scopeShare: data.actual ? july.margin / data.actual : 0,
    targetScopeShare: data.target ? july.target / data.target : 0
  };
}

function assetScale(records) {
  return records.reduce((sum, record) => {
    if (record.type === "wind") {
      sum.wind += 1;
      sum.windCapacity += record.capacity || 0;
      sum.turbines += record.turbines || 0;
    } else if (record.type === "storage") {
      sum.storage += 1;
      sum.storagePower += record.power || 0;
      sum.storageEnergy += record.energy || 0;
    }
    if (record.status === "good") sum.normal += 1;
    else sum.risk += 1;
    return sum;
  }, { wind: 0, storage: 0, windCapacity: 0, turbines: 0, storagePower: 0, storageEnergy: 0, normal: 0, risk: 0 });
}

function formatCapacity(mw) {
  return mw >= 1000 ? `${(mw / 1000).toFixed(2)} GW` : `${mw} MW`;
}
