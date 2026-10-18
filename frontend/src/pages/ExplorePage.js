import React, { useEffect, useState } from 'react';
import { getAllFunds } from '../utils/api';
import { formatPercent, getRiskColor, getCategoryIcon, formatINR } from '../utils/formatters';

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Hybrid', 'Flexi Cap'];
const RISK_LEVELS = ['All', 'Moderate', 'Moderate-High', 'High'];

export default function ExplorePage({ onNavigate }) {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [risk, setRisk] = useState('All');
  const [sortBy, setSortBy] = useState('returns3y');

  useEffect(() => {
    getAllFunds()
      .then(data => { setFunds(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = funds
    .filter(f => category === 'All' || f.category === category)
    .filter(f => risk === 'All' || f.riskLevel === risk)
    .sort((a, b) => {
      if (sortBy === 'returns3y') return b.returns['3y'] - a.returns['3y'];
      if (sortBy === 'sharpe') return b.sharpeRatio - a.sharpeRatio;
      if (sortBy === 'expense') return a.expenseRatio - b.expenseRatio;
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }} className="animate-fade-up">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '10px' }}>
            Explore Mutual Funds
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Browse and compare funds by category, risk level, and performance metrics.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }} className="animate-fade-up delay-1">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '7px 14px', border: '1px solid',
                borderColor: category === c ? 'var(--accent-blue)' : 'var(--border)',
                background: category === c ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: category === c ? 'var(--accent-blue)' : 'var(--text-muted)',
                borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}>{c}</button>
            ))}
          </div>

          <select className="select-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', padding: '7px 36px 7px 12px', fontSize: '13px' }}>
            <option value="returns3y">Sort: 3Y Returns</option>
            <option value="sharpe">Sort: Sharpe Ratio</option>
            <option value="expense">Sort: Expense Ratio</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <div className="loader" />
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '10px', color: 'var(--accent-rose)' }}>
            ⚠️ {error} — Make sure backend is running.
          </div>
        )}

        {/* Fund Table */}
        {!loading && !error && (
          <div className="card animate-fade-up delay-2" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Fund', 'Category', 'Risk', '1Y', '3Y', '5Y', 'Sharpe', 'Expense', 'AUM', 'Min SIP'].map(h => (
                      <th key={h} style={{
                        padding: '14px 16px', textAlign: 'left',
                        fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase',
                        letterSpacing: '0.08em', fontWeight: 600, whiteSpace: 'nowrap',
                        background: 'rgba(8,15,30,0.5)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((fund, i) => (
                    <tr key={fund.id} style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                      animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{getCategoryIcon(fund.category)}</span>
                          <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.3 }}>{fund.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="tag tag-blue" style={{ fontSize: '10px' }}>{fund.category}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '12px', color: getRiskColor(fund.riskLevel), fontWeight: 600 }}>{fund.riskLevel}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        {formatPercent(fund.returns['1y'])}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                        {formatPercent(fund.returns['3y'])}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {formatPercent(fund.returns['5y'])}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-blue)' }}>
                        {fund.sharpeRatio}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: fund.expenseRatio < 0.6 ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                        {fund.expenseRatio}%
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        ₹{fund.aum}Cr
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        ₹{fund.minSIP.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No funds match your current filters.
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Want personalized recommendations from these funds?</p>
          <button className="btn btn-primary" onClick={() => onNavigate('analyze')}>
            🎯 Get My Personalized Match
          </button>
        </div>
      </div>
    </div>
  );
}