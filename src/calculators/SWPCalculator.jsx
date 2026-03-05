import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Slider from '../components/Slider';
import { swpChartData, formatCompact, formatIndian } from '../utils/finance';
import { Info } from 'lucide-react';

const C = { bright: '#0466c8', mid: '#0353a4', muted: '#979dac', slate: '#5c677d', light: '#4da3ff' };

const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#001233', border: '1px solid rgba(51,65,92,0.6)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
            <p style={{ color: '#5c677d', marginBottom: 4, fontSize: 11 }}>{label}</p>
            <p style={{ color: C.light, fontWeight: 700 }}>Balance: ₹{formatCompact(payload[0]?.value)}</p>
        </div>
    );
};

export default function SWPCalculator() {
    const [corpus, setCorpus] = useState(5000000);
    const [monthly, setMonthly] = useState(30000);
    const [rate, setRate] = useState(10);

    const chartData = useMemo(() => swpChartData(corpus, monthly, rate, 40), [corpus, monthly, rate]);
    const lastBalance = chartData[chartData.length - 1]?.balance ?? 0;
    const depleted = lastBalance === 0;
    const sustainYear = depleted ? chartData.findIndex(d => d.balance === 0) + 1 : null;
    const monthlyInterest = (corpus * rate) / 12 / 100;
    const isSafe = monthly <= monthlyInterest;

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card">
                <div className="glass-card-title">🏦 SWP Calculator</div>
                <div className="glass-card-subtitle">Plan your monthly income in retirement from a corpus</div>

                <Slider label="Total Corpus" value={corpus} onChange={setCorpus} min={100000} max={50000000} step={100000} formatDisplay={v => '₹' + formatCompact(v)} />
                <Slider label="Monthly Withdrawal" value={monthly} onChange={setMonthly} min={1000} max={500000} step={1000} formatDisplay={v => '₹' + formatIndian(v)} />
                <Slider label="Expected Return on Corpus (p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" />

                {/* Sustainability */}
                <div className={isSafe ? 'status-safe' : 'status-danger'} style={{ marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: 6 }}>
                        <span className={isSafe ? 'status-tag-safe' : 'status-tag-danger'}>
                            {isSafe ? '✅ SUSTAINABLE WITHDRAWAL' : '⚠️ CORPUS WILL DEPLETE'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        Monthly interest at {rate}%: <strong style={{ color: 'var(--text-primary)' }}>₹{formatIndian(Math.round(monthlyInterest))}</strong>
                        {!isSafe && (
                            <span style={{ color: 'var(--p-9)', marginLeft: 8 }}>
                                (₹{formatIndian(monthly - Math.round(monthlyInterest))} more than interest earned)
                            </span>
                        )}
                    </div>
                </div>

                <div className="info-box" style={{ marginTop: '1rem' }}>
                    <Info size={14} />
                    SWP lets you withdraw fixed monthly amounts while the corpus continues to earn returns.
                </div>
            </div>

            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Corpus Trajectory</div>
                    <div className="glass-card-subtitle">
                        {depleted ? `⚠️ Corpus depletes in Year ${sustainYear}` : `✅ Corpus sustains 30+ years`}
                    </div>

                    <div className="results-summary">
                        <div className="result-card invested">
                            <div className="result-label">Starting Corpus</div>
                            <div className="result-value blue">₹{formatCompact(corpus)}</div>
                        </div>
                        <div className="result-card returns">
                            <div className="result-label">Monthly Withdrawal</div>
                            <div className="result-value green">₹{formatIndian(monthly)}</div>
                        </div>
                        <div className="result-card total">
                            <div className="result-label">{depleted ? 'Corpus Lasts' : 'Balance (30yr)'}</div>
                            <div className="result-value purple" style={{ color: depleted ? 'var(--p-9)' : undefined }}>
                                {depleted ? `${sustainYear} Yrs` : '₹' + formatCompact(lastBalance)}
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <div className="chart-title">Remaining Corpus Over Time</div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" />
                                <XAxis dataKey="year" tick={{ fill: '#5c677d', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={v => '₹' + formatCompact(v)} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                                <Tooltip content={<Tip />} />
                                <ReferenceLine y={0} stroke="rgba(151,157,172,0.5)" strokeWidth={2} />
                                <Line type="monotone" dataKey="balance" name="Balance" stroke={C.light} strokeWidth={2.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>💡 Optimisation Tips</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {[
                            { label: 'Safe Withdrawal Rate', text: `Keep withdrawals ≤ 4% of corpus/year (= ₹${formatIndian(Math.round(corpus * 0.04 / 12))}/mo here).` },
                            { label: 'Inflation Hedge', text: 'Increase withdrawals by 6–7% annually to beat inflation over time.' },
                            { label: 'Diversify', text: 'Keep equity+debt mix — equity for growth, debt for stability.' },
                        ].map(t => (
                            <div key={t.label} className="tip-box">
                                <strong>{t.label}:</strong> {t.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
