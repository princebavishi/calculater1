import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { calcSIP, calcStepUpSIP, formatCompact, formatIndian } from '../utils/finance';
import { Info, ArrowUp } from 'lucide-react';

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

export default function StepUpSIPCalculator() {
    const [monthly, setMonthly] = useState(10000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(15);
    const [stepUp, setStepUp] = useState(10);

    const regularSIP = useMemo(() => calcSIP(monthly, rate, years), [monthly, rate, years]);
    const stepUpSIP = useMemo(() => calcStepUpSIP(monthly, rate, years, stepUp), [monthly, rate, years, stepUp]);
    const regularInvested = monthly * years * 12;
    const stepUpInvested = useMemo(() => {
        let total = 0, cur = monthly;
        for (let y = 0; y < years; y++) { total += cur * 12; cur *= (1 + stepUp / 100); }
        return total;
    }, [monthly, years, stepUp]);
    const extra = stepUpSIP - regularSIP;

    const chartData = useMemo(() => {
        const data = [];
        for (let y = 1; y <= years; y++) {
            data.push({ year: `Yr ${y}`, Regular: Math.round(calcSIP(monthly, rate, y)), 'Step-Up': Math.round(calcStepUpSIP(monthly, rate, y, stepUp)) });
        }
        return data;
    }, [monthly, rate, years, stepUp]);

    const finalSIP = Math.round(monthly * (1 + stepUp / 100) ** (years - 1));

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card">
                <div className="glass-card-title"><ArrowUp size={18} color={C.bright} /> Step-Up SIP Calculator</div>
                <div className="glass-card-subtitle">Increase your SIP every year — supercharge wealth building</div>

                <Slider label="Starting Monthly SIP" value={monthly} onChange={setMonthly} min={500} max={200000} step={500} formatDisplay={v => '₹' + formatIndian(v)} />
                <Slider label="Annual Step-Up (%)" value={stepUp} onChange={setStepUp} min={1} max={50} step={1} suffix="%" />
                <Slider label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
                <Slider label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} formatDisplay={v => v + ' Yrs'} />

                <div className="rule-box">
                    <div className="rule-box-label">📈 SIP in Year {years}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        Grows from <strong style={{ color: 'var(--text-primary)' }}>₹{formatIndian(monthly)}</strong> →{' '}
                        <strong style={{ color: 'var(--p-0)' }}>₹{formatIndian(finalSIP)}</strong>/month
                    </div>
                </div>

                <div className="info-box" style={{ marginTop: '1rem' }}>
                    <Info size={14} />
                    Step-up SIP increases your monthly investment by {stepUp}% each year, in line with income growth.
                </div>
            </div>

            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Step-Up vs Regular SIP</div>
                    <div className="glass-card-subtitle">Extra wealth from stepping up annually</div>

                    <div className="results-summary">
                        <ResultCard label="Regular SIP" value={regularSIP} type="blue" subtext={`Invested ₹${formatCompact(regularInvested)}`} />
                        <ResultCard label="Step-Up SIP" value={stepUpSIP} type="green" subtext={`Invested ₹${formatCompact(stepUpInvested)}`} />
                        <ResultCard label="Bonus Wealth" value={extra} type="purple" subtext="Step-Up advantage" />
                    </div>

                    <div className="chart-container">
                        <div className="chart-title">Growth Comparison Over {years} Years</div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="suG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.bright} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={C.bright} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="regG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.deep} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={C.deep} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" />
                                <XAxis dataKey="year" tick={{ fill: '#5c677d', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={v => '₹' + formatCompact(v)} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                                <Tooltip content={<Tip />} />
                                <Legend wrapperStyle={{ fontSize: 12, color: '#7d8597' }} />
                                <Area type="monotone" dataKey="Regular" stroke={C.deep} strokeWidth={2} fill="url(#regG)" />
                                <Area type="monotone" dataKey="Step-Up" stroke={C.bright} strokeWidth={2.5} fill="url(#suG)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Summary</div>
                    <table className="comparison-table">
                        <thead><tr><th>Metric</th><th>Regular SIP</th><th>Step-Up SIP</th></tr></thead>
                        <tbody>
                            <tr><td style={{ color: 'var(--text-secondary)' }}>Total Invested</td><td>₹{formatCompact(regularInvested)}</td><td className="badge-positive">₹{formatCompact(stepUpInvested)}</td></tr>
                            <tr><td style={{ color: 'var(--text-secondary)' }}>Maturity Value</td><td>₹{formatCompact(regularSIP)}</td>    <td className="badge-positive">₹{formatCompact(stepUpSIP)}</td>    </tr>
                            <tr><td style={{ color: 'var(--text-secondary)' }}>Total Gains</td>   <td>₹{formatCompact(regularSIP - regularInvested)}</td><td className="badge-positive">₹{formatCompact(stepUpSIP - stepUpInvested)}</td></tr>
                            <tr><td style={{ color: 'var(--text-secondary)' }}>Advantage</td>     <td colSpan={2} style={{ color: 'var(--p-0)', fontWeight: 800 }}>+₹{formatCompact(extra)} extra wealth 🚀</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
