import React from 'react';
import { TrendingUp } from 'lucide-react';

const COLORS = [
  '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ef4444', '#10b981', '#06b6d4', '#6366f1',
  '#14b8a6', '#6b7280'
];

const SpendingChart = ({ categoryTotals }) => {
  const hasData = categoryTotals && Object.keys(categoryTotals).length > 0;
  const entries = hasData ? Object.entries(categoryTotals) : [];
  const total = entries.reduce((sum, [, val]) => sum + Number(val), 0);

  const circumference = 2 * Math.PI * 45;
  let cumOffset = 0;
  const segments = entries.map(([cat, value], i) => {
    const numVal = Number(value);
    const pct = total > 0 ? (numVal / total) * 100 : 0;
    const dash = (pct / 100) * circumference;
    const seg = { cat, value: numVal, pct, dash, offset: -cumOffset, color: COLORS[i % COLORS.length] };
    cumOffset += dash;
    return seg;
  });

  const fmt = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return Math.round(v).toLocaleString();
    return String(v);
  };

  const top = segments.length > 0 ? segments.reduce((a, b) => a.value > b.value ? a : b) : null;

  return (
    <div className="dashboard-card spending-card">
      <div className="card-top-bar">
        <h3>Spending</h3>
        <select className="period-dropdown" disabled>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="card-body">
        {hasData ? (
          <div className="spending-content">
            <div className="donut-wrapper">
              <svg viewBox="0 0 120 120" className="donut-svg">
                {segments.map((s) => (
                  <circle
                    key={s.cat}
                    cx="60" cy="60" r="45"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="18"
                    strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                    strokeDashoffset={s.offset}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'all 0.6s ease' }}
                  />
                ))}
              </svg>
              <div className="donut-center-label">
                <span className="donut-amount">{fmt(total)}</span>
                <span className="donut-sublabel">Total</span>
              </div>
            </div>
            <div className="spending-legend">
              {segments.map((s) => (
                <div className="legend-row" key={s.cat}>
                  <span className="legend-dot" style={{ backgroundColor: s.color }} />
                  <span className="legend-name">{s.cat}</span>
                  <span className="legend-pct">{s.pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
            {top && (
              <div className="spending-insight">
                <TrendingUp size={14} />
                <span>Highest: <strong>{top.cat}</strong> at {top.pct.toFixed(0)}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className="spending-empty">
            <div className="donut-wrapper">
              <svg viewBox="0 0 120 120" className="donut-svg">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#252530" strokeWidth="18" />
              </svg>
              <div className="donut-center-label">
                <span className="donut-amount">--</span>
                <span className="donut-sublabel">Total</span>
              </div>
            </div>
            <p className="empty-msg">Upload a statement to see spending breakdown</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingChart;
