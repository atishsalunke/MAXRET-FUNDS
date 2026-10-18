import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10d9a0', '#f0b429', '#f43f5e', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8, 15, 30, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px', padding: '10px 14px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 600 }}>{payload[0].name}</div>
      <div style={{ color: payload[0].payload.fill, fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
        {payload[0].value}%
      </div>
    </div>
  );
};

export default function SectorChart({ sectorAllocation }) {
  const data = Object.entries(sectorAllocation || {}).map(([name, value], i) => ({
    name, value,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
            paddingAngle={2} dataKey="value" startAngle={90} endAngle={450}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.fill, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.name}</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: item.fill, fontWeight: 600 }}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}