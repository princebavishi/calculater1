import React from 'react';
import { formatCompact } from '../utils/finance';

export default function ResultCard({ label, value, type = 'blue', subtext }) {
    return (
        <div className={`result-card ${type}`}>
            <div className="result-label">{label}</div>
            <div className={`result-value ${type}`}>₹{formatCompact(value)}</div>
            {subtext && <div className="result-subtext">{subtext}</div>}
        </div>
    );
}
