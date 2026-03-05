import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { calcSIP, sipChartData, formatIndian, formatCompact, yearlyBreakdown } from '../utils/finance';
import { Info, TrendingUp } from 'lucide-react';

// Palette
const C = { bright: '#0466c8', mid: '#0353a4', deep: '#023e7d', muted: '#979dac', slate: '#5c677d', light: '#4da3ff' };

const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#001233', border: '1px solid rgba(51,65,92,0.6)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
            <p style={{ color: '#5c677d', marginBottom: 4, fontSize: 11 }}>{label}</p>
            {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: ₹{formatCompact(p.value)}</p>)}
        </div>
    );
};

export default function SIPCalculator() {
    const [monthly, setMonthly] = useState(10000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(15);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const totalValue = useMemo(() => calcSIP(monthly, rate, years), [monthly, rate, years]);
    const invested = monthly * years * 12;
    const gains = totalValue - invested;
    const gainPct = ((gains / invested) * 100).toFixed(1);
    const chartData = useMemo(() => sipChartData(monthly, rate, years), [monthly, rate, years]);
    const breakdown = useMemo(() => yearlyBreakdown(monthly, rate, years), [monthly, rate, years]);

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Controls */}
            <div className="glass-card">
                <div className="glass-card-title"><TrendingUp size={18} color={C.bright} /> SIP Calculator</div>
                <div className="glass-card-subtitle">Monthly investing — let compounding do the heavy lifting</div>

                <Slider label="Monthly SIP Amount" value={monthly} onChange={setMonthly} min={500} max={200000} step={500} formatDisplay={v => '₹' + formatIndian(v)} />
                <Slider label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
                <Slider label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} formatDisplay={v => v + (v === 1 ? ' Year' : ' Years')} />

                <div className="info-box">
                    <Info size={14} />
                    Returns are projected. Actual returns depend on market performance. <strong>Not financial advice.</strong>
                </div>
            </div>

            {/* Results */}
            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Projected Wealth after {years} {years === 1 ? 'Year' : 'Years'}</div>
                    <div className="glass-card-subtitle">₹{formatIndian(monthly)}/mo at {rate}% p.a.</div>

                    <div className="results-summary">
                        <ResultCard label="Invested" value={invested} type="blue" subtext={`${years * 12} installments`} />
                        <ResultCard label="Total Gains" value={gains} type="green" subtext={`+${gainPct}% growth`} />
                        <ResultCard label="Maturity Value" value={totalValue} type="purple" subtext={`After ${years} yrs`} />
                    </div>

                    <div className="chart-container">
                        <div className="chart-title">Investment Growth Over Time</div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="sipV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.bright} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={C.bright} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="sipI" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.deep} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={C.deep} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" />
                                <XAxis dataKey="year" tick={{ fill: '#5c677d', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={v => '₹' + formatCompact(v)} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                                <Tooltip content={<Tip />} />
                                <Legend wrapperStyle={{ fontSize: 12, color: '#7d8597' }} />
                                <Area type="monotone" dataKey="invested" name="Invested" stroke={C.deep} strokeWidth={2} fill="url(#sipI)" />
                                <Area type="monotone" dataKey="value" name="Total Value" stroke={C.bright} strokeWidth={2.5} fill="url(#sipV)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Yearly Breakdown</span>
                        <button className="btn btn-ghost" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                            onClick={() => setShowBreakdown(v => !v)}>
                            {showBreakdown ? 'Hide' : 'Show'} Table
                        </button>
                    </div>
                    {showBreakdown ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="comparison-table">
                                <thead>
                                    <tr><th>Year</th><th>Invested</th><th>Returns</th><th>Total Value</th><th>XIRR</th></tr>
                                </thead>
                                <tbody>
                                    {breakdown.map(row => (
                                        <tr key={row.year}>
                                            <td style={{ color: 'var(--text-secondary)' }}>Yr {row.year}</td>
                                            <td>₹{formatCompact(row.invested)}</td>
                                            <td className="badge-positive">+₹{formatCompact(row.gains)}</td>
                                            <td style={{ fontWeight: 700 }}>₹{formatCompact(row.total)}</td>
                                            <td className="badge-positive">{row.cagr}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem', textAlign: 'center', padding: '0.5rem 0' }}>
                            Click "Show Table" to see year-by-year breakdown
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
