import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cagr, formatCompact, formatIndian } from '../utils/finance';
import { Info } from 'lucide-react';

const C = { bright: '#0466c8', mid: '#0353a4', deep: '#023e7d', light: '#4da3ff', muted: '#979dac', slate: '#5c677d' };

function NumberInput({ label, value, onChange, prefix = '₹', step = 1000 }) {
    return (
        <div className="field-group">
            <div className="field-label"><span>{label}</span></div>
            <div className="number-input-wrap">
                <span className="input-prefix">{prefix}</span>
                <input type="number" value={value} min={0} step={step}
                    onChange={e => onChange(Number(e.target.value))} />
            </div>
        </div>
    );
}

export default function CAGRCalculator() {
    const [startValue, setStartValue] = useState(100000);
    const [endValue, setEndValue] = useState(350000);
    const [years, setYears] = useState(5);

    const cagrVal = cagr(startValue, endValue, years);
    const isPositive = cagrVal >= 0;
    const absoluteRet = endValue - startValue;
    const absolutePct = startValue > 0 ? ((absoluteRet / startValue) * 100) : 0;

    const benchmarks = [
        { name: 'Savings A/c', cagr: 4, highlight: false },
        { name: 'Fixed Deposit', cagr: 7, highlight: false },
        { name: 'PPF', cagr: 7.5, highlight: false },
        { name: 'Your Investment', cagr: parseFloat(cagrVal.toFixed(2)), highlight: true },
        { name: 'Nifty 50 hist. avg', cagr: 13, highlight: false },
        { name: 'Sensex hist. avg', cagr: 14, highlight: false },
    ].sort((a, b) => a.cagr - b.cagr);

    const timelineData = [1, 2, 3, 5, 7, 10].map(y => ({
        year: `${y}yr`,
        cagrNeeded: parseFloat(cagr(startValue, endValue, y).toFixed(2)),
    }));

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card">
                <div className="glass-card-title">📊 CAGR Calculator</div>
                <div className="glass-card-subtitle">Measure the true annualised performance of any investment</div>

                <NumberInput label="Initial Investment Value" value={startValue} onChange={setStartValue} />
                <NumberInput label="Final / Current Value" value={endValue} onChange={setEndValue} />
                <NumberInput label="Number of Years" prefix="Yrs" value={years} onChange={v => setYears(Math.max(0.1, v))} step={0.5} />

                {/* Big CAGR display */}
                <div style={{
                    marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem 1rem',
                    background: 'rgba(2,62,125,0.2)', borderRadius: 16,
                    border: '1px solid rgba(4,102,200,0.2)',
                }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Your CAGR</div>
                    <div style={{
                        fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1,
                        color: isPositive ? C.bright : C.muted,
                    }}>
                        {isPositive ? '+' : ''}{cagrVal.toFixed(2)}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.65rem' }}>
                        per year, over <strong style={{ color: 'var(--text-primary)' }}>{years} years</strong>
                    </div>
                </div>

                <div className="info-box" style={{ marginTop: '1rem' }}>
                    <Info size={14} />
                    CAGR smooths volatility — it's the single rate at which your investment must grow every year to reach its final value.
                </div>
            </div>

            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Performance Snapshot</div>
                    <div className="glass-card-subtitle">How your investment stacks up</div>

                    <div className="results-summary">
                        <div className="result-card invested">
                            <div className="result-label">Initial Value</div>
                            <div className="result-value blue">₹{formatCompact(startValue)}</div>
                        </div>
                        <div className="result-card returns">
                            <div className="result-label">Absolute Return</div>
                            <div className="result-value green" style={{ color: isPositive ? C.light : C.muted }}>
                                {isPositive ? '+' : ''}₹{formatCompact(absoluteRet)}
                            </div>
                            <div className="result-subtext">{absolutePct.toFixed(1)}% total</div>
                        </div>
                        <div className="result-card total">
                            <div className="result-label">Final Value</div>
                            <div className="result-value purple">₹{formatCompact(endValue)}</div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-title">Your CAGR vs Benchmarks</div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={benchmarks} layout="vertical" margin={{ top: 5, right: 48, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" horizontal={false} />
                                <XAxis type="number" tickFormatter={v => v + '%'} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#7d8597', fontSize: 10 }} tickLine={false} axisLine={false} width={120} />
                                <Tooltip formatter={v => [v + '%', 'CAGR']} contentStyle={{ background: '#001233', border: '1px solid rgba(51,65,92,0.6)', borderRadius: 10, fontSize: 13 }} />
                                <Bar dataKey="cagr" radius={[0, 6, 6, 0]}
                                    label={{ position: 'right', fill: '#7d8597', fontSize: 10, formatter: v => v + '%' }}>
                                    {benchmarks.map((b, i) => (
                                        <Cell key={i} fill={b.highlight ? C.bright : C.mid} opacity={b.highlight ? 1 : 0.6} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>⏱ CAGR at Different Horizons</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginBottom: '1rem' }}>
                        To turn ₹{formatCompact(startValue)} → ₹{formatCompact(endValue)}
                    </div>
                    <table className="comparison-table">
                        <thead><tr><th>Horizon</th><th>CAGR Needed</th><th>Difficulty</th></tr></thead>
                        <tbody>
                            {timelineData.map(row => {
                                const d = row.cagrNeeded < 10 ? { label: 'Easy', color: C.light }
                                    : row.cagrNeeded < 20 ? { label: 'Moderate', color: C.muted }
                                        : { label: 'Aggressive', color: '#7d8597' };
                                return (
                                    <tr key={row.year}>
                                        <td style={{ color: 'var(--text-secondary)' }}>{row.year}</td>
                                        <td style={{ fontWeight: 700 }}>{row.cagrNeeded > 0 ? row.cagrNeeded + '%' : 'N/A'}</td>
                                        <td><span style={{ color: d.color, fontWeight: 600, fontSize: '0.78rem' }}>{d.label}</span></td>
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
