import React, { useState } from 'react';
import FundCard from '../components/FundCard';
import ProjectionChart from '../components/ProjectionChart';
import NAVChart from '../components/NAVChart';
import SectorChart from '../components/SectorChart';
import { formatINR, getRiskColor } from '../utils/formatters';

export default function DashboardPage({ results, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState(results?.topFunds?.[0] || null);

  if (!results) return null;
  const { topFunds, portfolio, profile, suggestions } = results;

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'funds', label: '🏆 Top Funds' },
    { id: 'projections', label: '📈 Projections' },
    { id: 'suggestions', label: '💡 Suggestions' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }} className="animate-fade-up">
          <div>
            <div style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 500, marginBottom: '6px', letterSpacing: '0.06em' }}>
              ✓ ANALYSIS COMPLETE
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>
              Your Portfolio Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Tailored for {profile.investmentGoal} · {profile.investmentHorizon} years ·{' '}
              <span style={{ color: getRiskColor(profile.riskTolerance) }}>{profile.riskTolerance} Risk</span>
            </p>
          </div>
          <button className="btn btn-outline" onClick={onReset} style={{ fontSize: '14px' }}>
            ← New Analysis
          </button>
        </div>

        {/* Portfolio Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }} className="animate-fade-up delay-1">
          {[
            { label: 'Monthly SIP', value: formatINR(portfolio.totalInvested / (profile.investmentHorizon * 12)), color: 'blue' },
            { label: 'Total Invested', value: formatINR(portfolio.totalInvested), color: 'gold' },
            { label: 'Expected Value', value: formatINR(portfolio.projectedValue), color: 'emerald' },
            { label: 'Wealth Gain', value: `+${portfolio.expectedGrowth}%`, color: 'emerald' },
            { label: 'Avg Expected Return', value: `${portfolio.avgExpectedReturn}% p.a.`, color: 'blue' },
            { label: 'Funds Matched', value: topFunds.length, color: 'gold' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', background: 'rgba(8,15,30,0.6)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)', width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '9px 18px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--bg-card-hover)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
              border: activeTab === tab.id ? '1px solid var(--border-glow)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="animate-fade-in">
            {/* Top recommended fund detail */}
            <div className="card" style={{ padding: '28px', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>⭐ TOP PICK</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{selectedFund?.name}</h2>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {topFunds.map((f, i) => (
                    <button key={f.id} onClick={() => setSelectedFund(f)} style={{
                      padding: '6px 12px', borderRadius: '8px', border: '1px solid',
                      borderColor: selectedFund?.id === f.id ? 'var(--accent-blue)' : 'var(--border)',
                      background: selectedFund?.id === f.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                      color: selectedFund?.id === f.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                      fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}>#{i + 1} {f.name.split(' ').slice(0, 2).join(' ')}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NAV History (1 Year)</div>
                  <NAVChart fundId={selectedFund?.id} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sector Allocation</div>
                  <SectorChart sectorAllocation={selectedFund?.sectorAllocation} />
                </div>
              </div>
            </div>

            {/* Returns comparison */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px' }}>Returns Comparison</h3>
              {topFunds.map((fund, i) => (
                <div key={fund.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{fund.name.split(' ').slice(0, 3).join(' ')}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 600 }}>+{fund.returns['3y']}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(fund.returns['3y'] / 45) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Risk metrics */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px' }}>Risk Metrics — {selectedFund?.name?.split(' ').slice(0, 2).join(' ')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { k: 'Beta', v: selectedFund?.beta, hint: '<1 is lower than market', color: selectedFund?.beta < 1 ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
                  { k: 'Alpha', v: `+${selectedFund?.alpha}%`, hint: 'Excess return vs benchmark', color: 'var(--accent-gold)' },
                  { k: 'Std Dev', v: `${selectedFund?.stdDeviation}%`, hint: 'Volatility measure', color: 'var(--text-secondary)' },
                  { k: 'Sharpe', v: selectedFund?.sharpeRatio, hint: 'Risk-adjusted return', color: 'var(--accent-blue)' },
                ].map(item => (
                  <div key={item.k} style={{ background: 'rgba(8,15,30,0.6)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{item.k}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: item.color }}>{item.v}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.hint}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Top Funds */}
        {activeTab === 'funds' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }} className="animate-fade-in">
            {topFunds.map((fund, i) => (
              <FundCard key={fund.id} fund={fund} rank={i} onClick={setSelectedFund} />
            ))}
          </div>
        )}

        {/* Tab: Projections */}
        {activeTab === 'projections' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="animate-fade-in">
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>SIP Growth Projection</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Monthly SIP of {formatINR(profile.monthlySIP)} over {profile.investmentHorizon} years at ~{portfolio.avgExpectedReturn}% expected return
              </p>
              <ProjectionChart
                sip={parseFloat(profile.monthlySIP)}
                horizon={parseInt(profile.investmentHorizon)}
                avgReturn={portfolio.avgExpectedReturn}
              />
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>Portfolio Milestones</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[1, 3, 5, parseInt(profile.investmentHorizon)].filter((v, i, a) => a.indexOf(v) === i).map(year => {
                  const months = year * 12;
                  const r = (parseFloat(portfolio.avgExpectedReturn) / 100) / 12;
                  const val = Math.round(parseFloat(profile.monthlySIP) * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
                  return (
                    <div key={year} className="stat-card" style={{ background: year === parseInt(profile.investmentHorizon) ? 'rgba(240,180,41,0.06)' : undefined, borderColor: year === parseInt(profile.investmentHorizon) ? 'rgba(240,180,41,0.2)' : undefined }}>
                      <div className="stat-label">Year {year}</div>
                      <div className={`stat-value ${year === parseInt(profile.investmentHorizon) ? 'gold' : 'blue'}`} style={{ fontSize: '20px' }}>{formatINR(val)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Suggestions */}
        {activeTab === 'suggestions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }} className="animate-fade-in">
            {suggestions.map((s, i) => (
              <div key={i} className="card animate-fade-up" style={{ padding: '28px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', marginBottom: '10px' }}>{s.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{s.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}