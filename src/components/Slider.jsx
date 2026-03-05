import React, { useCallback } from 'react';

export default function Slider({
    label, value, onChange, min, max, step = 1,
    prefix = '', suffix = '', displayValue, formatDisplay
}) {
    const display = formatDisplay ? formatDisplay(value) : (prefix + value.toLocaleString('en-IN') + suffix);

    const pct = ((value - min) / (max - min)) * 100;
    const trackStyle = {
        background: `linear-gradient(to right, #3b82f6 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`
    };

    return (
        <div className="field-group">
            <div className="field-label">
                <span>{label}</span>
                <span className="field-value-badge">{displayValue || display}</span>
            </div>
            <div className="range-wrap">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    style={trackStyle}
                    onChange={e => onChange(Number(e.target.value))}
                />
            </div>
            <div className="range-limits">
                <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
                <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
            </div>
        </div>
    );
}
