import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    RadialBarChart, RadialBar, PolarAngleAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import Slider from '../components/Slider';
import { sipForGoal, formatCompact, formatIndian } from '../utils/finance';
import { Target } from 'lucide-react';

const C = { bright: '#0466c8', mid: '#0353a4', deep: '#023e7d', muted: '#979dac', slate: '#5c677d', light: '#4da3ff' };

export default function GoalPlannerCalculator() {
    const [goal, setGoal] = useState(5000000);
    const [existing, setExisting] = useState(0);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const existingGrows = useMemo(() => existing * (1 + rate / 100) ** years, [existing, rate, years]);
    const remaining = Math.max(0, goal - existingGrows);
    const sipNeeded = useMemo(() => sipForGoal(remaining, rate, years), [remaining, rate, years]);
    const progressPct = Math.min(100, (existingGrows / goal) * 100);

    const milestones = [0.25, 0.5, 0.75, 1].map(f => ({
        label: `${f * 100}%`,
        sipNeeded: Math.max(0, sipForGoal(Math.max(0, goal * f - existingGrows), rate, years)),
    }));

    const radialData = [{ name: 'Progress', value: progressPct, fill: C.bright }];

    const PRESETS = [
        { label: '🚨 Emergency Fund', val: 500000 },
        { label: '🚗 Dream Car', val: 1500000 },
        { label: '🏠 Home Down Payment', val: 5000000 },
        { label: '🎓 Child Education', val: 10000000 },
        { label: '🌅 Retirement Corpus', val: 50000000 },
    ];

    return (
        <motion.div className="calculator-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card">
                <div className="glass-card-title"><Target size={18} color={C.bright} /> Goal Planner</div>
                <div className="glass-card-subtitle">How much SIP do you need to reach your financial goal?</div>

                <Slider label="Target Goal Amount" value={goal} onChange={setGoal} min={100000} max={100000000} step={100000} formatDisplay={v => '₹' + formatCompact(v)} />
                <Slider label="Existing Savings (Lump Sum)" value={existing} onChange={setExisting} min={0} max={10000000} step={10000} formatDisplay={v => '₹' + formatCompact(v)} />
                <Slider label="Expected Return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
                <Slider label="Time to Goal" value={years} onChange={setYears} min={1} max={40} step={1} formatDisplay={v => v + ' Yrs'} />

                {/* Presets */}
                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                        🎯 Quick Presets
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {PRESETS.map(p => (
                            <button key={p.label} onClick={() => setGoal(p.val)} style={{
                                padding: '4px 11px', borderRadius: 100, fontSize: '0.73rem', fontWeight: 500,
                                cursor: 'pointer', border: '1px solid',
                                borderColor: goal === p.val ? C.bright : 'rgba(51,65,92,0.6)',
                                background: goal === p.val ? C.bright : 'rgba(3,83,164,0.1)',
                                color: goal === p.val ? '#fff' : 'var(--text-secondary)',
                                transition: '0.2s ease',
                            }}>{p.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div className="glass-card-title">Your Goal Plan</div>
                    <div className="glass-card-subtitle">Reach ₹{formatCompact(goal)} in {years} years</div>

                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {/* Radial */}
                        <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(51,65,92,0.25)' }} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Coverage % */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Covered by Existing Savings</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: C.bright }}>{progressPct.toFixed(1)}%</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>₹{formatCompact(existingGrows)} of ₹{formatCompact(goal)}</div>
                        </div>
                        {/* SIP needed pill */}
                        <div style={{ flex: 1, minWidth: 150 }}>
                            <div style={{ background: `linear-gradient(135deg, ${C.deep}, ${C.bright})`, borderRadius: 16, padding: '1.1rem', textAlign: 'center', boxShadow: '0 8px 24px rgba(4,102,200,0.35)' }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Monthly SIP Required</div>
                                <div style={{ fontSize: '1.65rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>₹{formatCompact(sipNeeded)}</div>
                                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>to reach ₹{formatCompact(goal)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Milestones chart */}
                    <div className="chart-container">
                        <div className="chart-title">SIP Required at Each Milestone</div>
                        <ResponsiveContainer width="100%" height={175}>
                            <BarChart data={milestones} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,92,0.3)" />
                                <XAxis dataKey="label" tick={{ fill: '#5c677d', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={v => '₹' + formatCompact(v)} tick={{ fill: '#5c677d', fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                                <Tooltip formatter={v => ['₹' + formatCompact(v), 'Monthly SIP']} contentStyle={{ background: '#001233', border: '1px solid rgba(51,65,92,0.6)', borderRadius: 10, fontSize: 13 }} />
                                <Bar dataKey="sipNeeded" name="SIP Needed" fill={C.bright} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* What-if scenarios */}
                <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ What-If Scenarios</div>
                    <table className="comparison-table">
                        <thead><tr><th>If Return is...</th><th>Monthly SIP needed</th></tr></thead>
                        <tbody>
                            {[8, 10, 12, 15, 18].map(r => {
                                const eg = existing * (1 + r / 100) ** years;
                                const rem = Math.max(0, goal - eg);
                                const s = sipForGoal(rem, r, years);
                                return (
                                    <tr key={r}>
                                        <td style={{ color: 'var(--text-secondary)' }}>{r}% p.a.</td>
                                        <td className={r === rate ? 'badge-positive' : ''} style={{ fontWeight: r === rate ? 800 : 500 }}>
                                            ₹{formatCompact(s)} {r === rate && <span style={{ color: 'var(--p-9)', fontSize: '0.72rem' }}>← current</span>}
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
