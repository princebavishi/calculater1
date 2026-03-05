// Format number to Indian numbering system  (₹1,23,456)
export function formatIndian(num) {
  if (!num && num !== 0) return '0';
  const n = Math.round(num);
  const s = n.toString();
  if (n < 1000) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  return formatted;
}

// Format to compact: ₹1.23L, ₹1.23Cr
export function formatCompact(num) {
  if (num >= 1e7) return (num / 1e7).toFixed(2) + ' Cr';
  if (num >= 1e5) return (num / 1e5).toFixed(2) + ' L';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.round(num).toString();
}

// SIP future value
export function calcSIP(monthly, rate, years) {
  const n = years * 12;
  const r = rate / 12 / 100;
  if (r === 0) return monthly * n;
  return monthly * (((1 + r) ** n - 1) / r) * (1 + r);
}

// Lump sum future value
export function calcLumpSum(principal, rate, years) {
  return principal * (1 + rate / 100) ** years;
}

// SWP: calculates how long money lasts OR corpus needed
export function calcSWP(corpus, monthly, rate) {
  const r = rate / 12 / 100;
  if (r === 0) return corpus / monthly;
  const months = Math.log(monthly / (monthly - corpus * r)) / Math.log(1 + r);
  return isFinite(months) ? months : Infinity;
}

// CAGR from start to end value
export function cagr(start, end, years) {
  if (start <= 0 || years <= 0) return 0;
  return ((end / start) ** (1 / years) - 1) * 100;
}

// SIP grow chart data
export function sipChartData(monthly, rate, years) {
  const data = [];
  for (let y = 1; y <= years; y++) {
    const total = calcSIP(monthly, rate, y);
    const invested = monthly * y * 12;
    data.push({ year: `Yr ${y}`, invested: Math.round(invested), value: Math.round(total) });
  }
  return data;
}

// Lump sum grow chart data
export function lumpSumChartData(principal, rate, years) {
  const data = [];
  for (let y = 0; y <= years; y++) {
    const value = calcLumpSum(principal, rate, y);
    data.push({ year: `Yr ${y}`, value: Math.round(value) });
  }
  return data;
}

// SWP monthly chart data (balance left each year)
export function swpChartData(corpus, monthly, rate, maxYears = 30) {
  const data = [];
  let balance = corpus;
  const r = rate / 12 / 100;
  for (let y = 1; y <= maxYears; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) - monthly;
      if (balance <= 0) { data.push({ year: `Yr ${y}`, balance: 0 }); return data; }
    }
    data.push({ year: `Yr ${y}`, balance: Math.round(balance) });
  }
  return data;
}

// Step-Up SIP
export function calcStepUpSIP(monthly, rate, years, stepUpPercent) {
  let total = 0;
  let currentMonthly = monthly;
  const r = rate / 12 / 100;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const monthsLeft = (years - y) * 12 - m;
      total += currentMonthly * (1 + r) ** monthsLeft;
    }
    currentMonthly *= (1 + stepUpPercent / 100);
  }
  return total;
}

// Goal-based: how much SIP needed to reach target
export function sipForGoal(target, rate, years) {
  const n = years * 12;
  const r = rate / 12 / 100;
  if (r === 0) return target / n;
  return target * r / (((1 + r) ** n - 1) * (1 + r));
}


export function yearlyBreakdown(monthly, rate, years) {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const totalValue = calcSIP(monthly, rate, y);
    const invested = monthly * y * 12;
    const gains = totalValue - invested;
    rows.push({
      year: y,
      invested: Math.round(invested),
      gains: Math.round(gains),
      total: Math.round(totalValue),
      cagr: y > 0 ? cagr(invested, totalValue, y).toFixed(2) : '—',
    });
  }
  return rows;
}
