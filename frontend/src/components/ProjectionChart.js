import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8, 15, 30, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '10px', padding: '12px 16px',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Year {label}</div>
      {payload.map((item) => (
        <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: item.color }}>{item.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: item.color }}>{formatINR(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function ProjectionChart({ sip, horizon, avgReturn }) {
  // Build year-by-year projection data
  const data = [];
  const monthlyRate = (parseFloat(avgReturn) / 100) / 12;
  for (let year = 0; year <= parseInt(horizon); year++) {
    const months = year * 12;
    const invested = sip * months;
    const projected = months === 0 ? 0 : Math.round(
      sip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    );
    data.push({ year, invested, projected });
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f0b429" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: '#4a5878', fontFamily: 'var(--font-mono)' }}
          tickLine={false} axisLine={false}
          tickFormatter={v => `Y${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#4a5878', fontFamily: 'var(--font-mono)' }}
          tickLine={false} axisLine={false}
          tickFormatter={v => formatINR(v)}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}
        />
        <Area
          type="monotone" dataKey="invested" name="Amount Invested"
          stroke="#f0b429" strokeWidth={1.5}
          fill="url(#investedGrad)" dot={false}
        />
        <Area
          type="monotone" dataKey="projected" name="Expected Value"
          stroke="#3b82f6" strokeWidth={2}
          fill="url(#projectedGrad)" dot={false}
          activeDot={{ r: 4, fill: '#3b82f6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}