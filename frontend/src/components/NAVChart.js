import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getFundNAVHistory } from '../utils/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8, 15, 30, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      padding: '10px 14px',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '15px' }}>
        ₹{payload[0].value.toFixed(2)}
      </div>
    </div>
  );
};

export default function NAVChart({ fundId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fundId) return;
    setLoading(true);
    getFundNAVHistory(fundId)
      .then(history => {
        // Sample to ~60 data points for performance
        const sampled = history.filter((_, i) => i % 6 === 0);
        setData(sampled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fundId]);

  if (loading) return (
    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader" />
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10d9a0" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10d9a0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#4a5878', fontFamily: 'var(--font-mono)' }}
          tickFormatter={d => d.slice(5)}
          tickLine={false} axisLine={false}
          interval={Math.floor(data.length / 5)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#4a5878', fontFamily: 'var(--font-mono)' }}
          tickLine={false} axisLine={false}
          tickFormatter={v => `₹${v.toFixed(0)}`}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone" dataKey="nav"
          stroke="#10d9a0" strokeWidth={2}
          fill="url(#navGrad)"
          dot={false} activeDot={{ r: 4, fill: '#10d9a0' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}