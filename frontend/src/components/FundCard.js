import React, { useState } from 'react';
import ScoreRing from './ScoreRing';
import { formatINR, formatPercent, getRiskColor, getCategoryIcon } from '../utils/formatters';

export default function FundCard({ fund, rank, onClick }) {
  const [expanded, setExpanded] = useState(false);

  const rankColors = ['var(--accent-gold)', '#c0c0c0', '#cd7f32'];
  const rankLabel = ['#1 Best Match', '#2 Strong Pick', '#3 Recommended'];

  return (
    <div
      className="card animate-fade-up"
      style={{
        padding: '28px',
        cursor: 'pointer',
        animationDelay: `${rank * 0.15}s`,
        border: rank === 0 ? '1px solid rgba(240, 180, 41, 0.25)' : undefined,
        boxShadow: rank === 0 ? 'var(--glow-gold)' : undefined,
      }}
      onClick={() => onClick && onClick(fund)}
    >
      {/* Rank badge */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 12px',
          background: `${rankColors[rank]}18`,
          border: `1px solid ${rankColors[rank]}30`,
          borderRadius: '20px',
          fontSize: '12px', fontWeight: 700,
          color: rankColors[rank],
          letterSpacing: '0.04em',
        }}>
          {rank === 0 ? '⭐' : rank === 1 ? '🥈' : '🥉'} {rankLabel[rank]}
        </div>
        <ScoreRing score={fund.matchScore} size={64} strokeWidth={6} />
      </div>

      {/* Fund identity */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '22px' }}>{getCategoryIcon(fund.category)}</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', lineHeight: 1.3 }}>
            {fund.name}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="tag tag-blue">{fund.category}</span>
          <span className="tag" style={{
            background: `${getRiskColor(fund.riskLevel)}18`,
            color: getRiskColor(fund.riskLevel),
            border: `1px solid ${getRiskColor(fund.riskLevel)}30`,
          }}>{fund.riskLevel} Risk</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: '1Y Return', value: formatPercent(fund.returns['1y']), color: fund.returns['1y'] > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
          { label: '3Y CAGR', value: formatPercent(fund.returns['3y']), color: 'var(--accent-gold)' },
          { label: 'Sharpe', value: fund.sharpeRatio, color: 'var(--accent-blue)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(8,15,30,0.6)', borderRadius: '10px', padding: '12px',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Match reasons */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Why it matches you</div>
        {fund.matchReasons?.map((reason, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '1px' }}>✓</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{reason}</span>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        className="btn btn-outline"
        style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
      >
        {expanded ? '▲ Less Details' : '▼ More Details'}
      </button>

      {/* Expanded holdings */}
      {expanded && (
        <div style={{ marginTop: '18px', animation: 'fadeInUp 0.3s ease-out' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Holdings</div>
          {fund.holdings?.map((holding, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{holding.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{holding.sector}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '80px', height: '4px', background: 'rgba(59,130,246,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${holding.weight * 5}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold)', width: '36px', textAlign: 'right' }}>{holding.weight}%</span>
              </div>
            </div>
          ))}

          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            {[
              { k: 'AUM', v: `₹${(fund.aum / 100).toFixed(0)}Cr` },
              { k: 'Expense Ratio', v: `${fund.expenseRatio}%` },
              { k: 'Beta', v: fund.beta },
              { k: 'Alpha', v: `+${fund.alpha}%` },
            ].map(item => (
              <div key={item.k}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.k}: </span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}