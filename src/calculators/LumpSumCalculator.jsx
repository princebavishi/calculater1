import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { calcLumpSum, lumpSumChartData, formatCompact, cagr } from '../utils/finance';
import { Info } from 'lucide-react';

const C = { bright: '#0466c8', mid: '#0353a4', deep: '#023e7d', muted: '#979dac', slate: '#5c677d', light: '#4da3ff' };

const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#001233', border: '1px solid rgba(51,65,92,0.6)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
            <p style={{ color: '#5c677d', marginBottom: 4, fontSize: 11 }}>{label}</p>
            {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 700 }}>₹{formatCompact(p.value)}</p>)}
        </div>
    );
};

export default function LumpSumCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const totalValue = useMemo(() => calcLumpSum(principal, rate, years), [principal, rate, years]);
    const gains = totalValue - principal;
    const gainPct = ((gains / principal) * 100).toFixed(1);
    const cagrVal = cagr(principal, totalValue, years).toFixed(2);
    const chartData = useMemo(() => lumpSumChartData(principal, rate, years), [principal, rate, years]);

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card">
                <div className="glass-card-title">💰 Lump Sum Calculator</div>
                <div className="glass-card-subtitle">Invest once — watch compounding multiply your wealth</div>

                <Slider label="Investment Amount" value={principal} onChange={setPrincipal} min={1000} max={10000000} step={1000} formatDisplay={v => '₹' + formatCompact(v)} />
                <Slider label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
                <Slider label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} formatDisplay={v => v + ' Years'} />

                {/* Rule of 72 */}
                <div className="rule-box">
                    <div className="rule-box-label">💡 Rule of 72</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        At <strong style={{ color: 'var(--text-primary)' }}>{rate}% p.a.</strong>, money doubles in ~
                        <strong style={{ color: 'var(--p-0)' }}> {(72 / rate).toFixed(1)} years</strong>
                    </div>
                </div>

                <div className="info-box" style={{ marginTop: '1rem' }}>
                    <Info size={14} />
                    Assumes constant rate of return. Actual market returns can be volatile.
                </div>
            </div>

            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Growth Projection</div>
                    <div className="glass-card-subtitle">₹{formatCompact(principal)} over {years} years at {rate}% p.a.</div>

                    <div className="results-summary">
                        <ResultCard label="Principal" value={principal} type="blue" subtext="One-time investment" />
                        <ResultCard label="Gains" value={gains} type="green" subtext={`+${gainPct}% absolute`} />
                        <ResultCard label="Maturity" value={totalValue} type="purple" subtext={`CAGR: ${cagrVal}%`} />
                    </div>

                    <div className="chart-container">
                        <div className="chart-title">Wealth Compounding Journey</div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="lsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.bright} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={C.bright} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" />
                                <XAxis dataKey="year" tick={{ fill: '#5c677d', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={v => '₹' + formatCompact(v)} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                                <Tooltip content={<Tip />} />
                                <ReferenceLine y={principal} stroke="rgba(3,83,164,0.5)" strokeDasharray="4 4"
                                    label={{ value: 'Principal', position: 'insideTopLeft', fill: '#0353a4', fontSize: 10 }} />
                                <Area type="monotone" dataKey="value" name="Value" stroke={C.bright} strokeWidth={2.5} fill="url(#lsGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Instrument comparison */}
                <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>📊 Compare Instruments</div>
                    <table className="comparison-table">
                        <thead>
                            <tr><th>Instrument</th><th>Rate</th><th>₹{formatCompact(principal)} becomes...</th></tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Fixed Deposit', r: 7 },
                                { name: 'RD / PPF', r: 7.5 },
                                { name: 'Equity MF (your rate)', r: rate },
                                { name: 'Nifty 50 hist. avg', r: 13 },
                            ].map(row => {
                                const val = calcLumpSum(principal, row.r, years);
                                return (
                                    <tr key={row.name}>
                                        <td>{row.name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{row.r}%</td>
                                        <td className={row.r === rate ? 'badge-positive' : ''} style={{ fontWeight: row.r === rate ? 800 : 500 }}>
                                            ₹{formatCompact(val)} {row.r === rate && <span style={{ color: 'var(--p-9)', fontSize: '0.75rem' }}>← you</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
