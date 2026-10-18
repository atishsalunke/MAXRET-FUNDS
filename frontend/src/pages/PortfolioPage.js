import React, { useState, useMemo } from 'react';
import { useAuth } from '../utils/AuthContext';
import { formatINR, formatPercent, getRiskColor, getCategoryIcon, getScoreGrade } from '../utils/formatters';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';

const PALETTE = ['#3b82f6', '#10d9a0', '#f0b429', '#f43f5e', '#8b5cf6', '#f97316'];

// ── Sub-components ─────────────────────────────────────────────────────────

function EmptyState({ onNavigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>📂</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '12px' }}>No investments yet</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.6 }}>
        Run your first portfolio analysis to see personalized fund recommendations and track your investment journey here.
      </p>
      <button className="btn btn-gold" onClick={() => onNavigate('analyze')}>
        🔍 Analyze My Profile
      </button>
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</div>
          {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
        </div>
        <div style={{ fontSize: '28px', opacity: 0.7 }}>{icon}</div>
      </div>
    </div>
  );
}

function AllocationDonut({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
          paddingAngle={3} dataKey="value" startAngle={90} endAngle={450}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="transparent" />)}
        </Pie>
        <Tooltip
          content={({ active, payload }) => active && payload?.length ? (
            <div style={{ background: 'rgba(8,15,30,0.95)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{payload[0].name}</div>
              <div style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>{payload[0].value}%</div>
            </div>
          ) : null}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function PortfolioPage({ onNavigate }) {
  const { user, getPortfolio } = useAuth();
  const portfolio = getPortfolio();
  const [activeEntry, setActiveEntry] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Aggregate stats across all analyses
  const stats = useMemo(() => {
    if (!portfolio.length) return null;
    const latest = portfolio[0];
    const totalSIP = portfolio.reduce((s, e) => s + parseFloat(e.profile?.monthlySIP || 0), 0);
    const avgReturn = portfolio.reduce((s, e) => s + parseFloat(e.portfolio?.avgExpectedReturn || 0), 0) / portfolio.length;
    const totalProjected = portfolio.reduce((s, e) => s + (e.portfolio?.projectedValue || 0), 0);
    const totalInvested = portfolio.reduce((s, e) => s + (e.portfolio?.totalInvested || 0), 0);
    return { latest, totalSIP, avgReturn: avgReturn.toFixed(1), totalProjected, totalInvested };
  }, [portfolio]);

  // Category distribution across all top funds
  const categoryData = useMemo(() => {
    const map = {};
    portfolio.forEach(entry => {
      entry.topFunds?.forEach(f => {
        map[f.category] = (map[f.category] || 0) + 1;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [portfolio]);

  // Timeline data for projection chart
  const timelineData = useMemo(() => {
    if (!portfolio.length) return [];
    const entry = portfolio[activeEntry];
    if (!entry) return [];
    const sip = parseFloat(entry.profile?.monthlySIP || 0);
    const horizon = parseInt(entry.profile?.investmentHorizon || 10);
    const rate = (parseFloat(entry.portfolio?.avgExpectedReturn || 12) / 100) / 12;
    return Array.from({ length: horizon + 1 }, (_, year) => {
      const months = year * 12;
      return {
        year: `Y${year}`,
        invested: sip * months,
        projected: months === 0 ? 0 : Math.round(sip * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)),
      };
    });
  }, [portfolio, activeEntry]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '10px' }}>Sign in to view your portfolio</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Create a free account to track your investments.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('auth')}>Sign In / Register</button>
        </div>
      </div>
    );
  }

  if (!portfolio.length) {
    return (
      <div style={{ minHeight: '100vh', padding: '90px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <PageHeader user={user} onNavigate={onNavigate} />
          <EmptyState onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  const current = portfolio[activeEntry] || portfolio[0];

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <PageHeader user={user} onNavigate={onNavigate} entryCount={portfolio.length} />

        {/* ── Summary Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }} className="animate-fade-up delay-1">
          <StatCard label="Total SIP / Month" value={formatINR(stats?.totalSIP)} color="var(--accent-blue)" icon="💳" sub="Across all analyses" />
          <StatCard label="Total Invested" value={formatINR(stats?.totalInvested)} color="var(--accent-gold)" icon="🏦" sub="Projected corpus" />
          <StatCard label="Expected Wealth" value={formatINR(stats?.totalProjected)} color="var(--accent-emerald)" icon="📈" sub="At maturity" />
          <StatCard label="Avg Expected Return" value={`${stats?.avgReturn}% p.a.`} color="var(--accent-blue)" icon="🎯" sub="CAGR estimate" />
          <StatCard label="Analyses Done" value={portfolio.length} color="var(--accent-gold)" icon="🔬" sub="Portfolio snapshots" />
        </div>

        {/* ── Entry selector + Tabs ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }} className="animate-fade-up delay-2">
          <select className="select-field" value={activeEntry} onChange={e => setActiveEntry(Number(e.target.value))}
            style={{ width: 'auto', padding: '9px 40px 9px 14px', fontSize: '13px' }}>
            {portfolio.map((e, i) => (
              <option key={i} value={i}>
                Analysis #{portfolio.length - i} — {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(8,15,30,0.6)', padding: '5px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'funds', label: '🏆 Funds' },
              { id: 'growth', label: '📈 Growth' },
              { id: 'suggestions', label: '💡 Tips' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '8px 14px', border: '1px solid', borderRadius: '7px',
                borderColor: activeTab === tab.id ? 'var(--border-glow)' : 'transparent',
                background: activeTab === tab.id ? 'var(--bg-card-hover)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>{tab.label}</button>
            ))}
          </div>
        </div>

        {/* ── Profile snapshot banner ── */}
        <div className="card animate-fade-up delay-2" style={{
          padding: '18px 24px', marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(16,217,160,0.04) 100%)',
          borderColor: 'rgba(59,130,246,0.15)',
          display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Profile Snapshot</div>
          {[
            { k: 'Age', v: current.profile?.age + ' yrs' },
            { k: 'Monthly Income', v: formatINR(current.profile?.monthlyIncome) },
            { k: 'SIP', v: formatINR(current.profile?.monthlySIP) },
            { k: 'Goal', v: current.profile?.investmentGoal },
            { k: 'Horizon', v: current.profile?.investmentHorizon + ' years' },
            { k: 'Risk', v: current.profile?.riskTolerance },
          ].map(item => (
            <div key={item.k}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.k}</div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: item.k === 'Risk' ? getRiskColor(item.v) : 'var(--text-primary)' }}>{item.v}</div>
            </div>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="animate-fade-in">
            {/* Portfolio numbers */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '22px' }}>Investment Projection</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  { label: 'Monthly SIP', value: formatINR(current.profile?.monthlySIP), color: 'var(--accent-blue)' },
                  { label: 'Total Invested', value: formatINR(current.portfolio?.totalInvested), color: 'var(--accent-gold)' },
                  { label: 'Expected Value', value: formatINR(current.portfolio?.projectedValue), color: 'var(--accent-emerald)' },
                  { label: 'Wealth Gain', value: `+${current.portfolio?.expectedGrowth}%`, color: 'var(--accent-emerald)' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(8,15,30,0.5)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category allocation */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>Fund Category Mix</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Across all your analyses</p>
              <AllocationDonut data={categoryData} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {categoryData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: PALETTE[i % PALETTE.length] }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Returns bar */}
            <div className="card" style={{ padding: '28px', gridColumn: '1 / -1' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '20px' }}>Top Funds — Return Comparison</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={current.topFunds?.map(f => ({ name: f.name.split(' ').slice(0, 2).join(' '), '1Y': f.returns['1y'], '3Y': f.returns['3y'], '5Y': f.returns['5y'] }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4a5878' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4a5878' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--text-primary)', fontSize: '13px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Bar dataKey="1Y" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="3Y" fill="#f0b429" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="5Y" fill="#10d9a0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Tab: Funds ── */}
        {activeTab === 'funds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            {current.topFunds?.map((fund, i) => (
              <div key={fund.id} className="card animate-fade-up" style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Rank */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: i === 0 ? 'rgba(240,180,41,0.12)' : 'rgba(59,130,246,0.08)',
                    border: `1px solid ${i === 0 ? 'rgba(240,180,41,0.25)' : 'rgba(59,130,246,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px',
                    color: i === 0 ? 'var(--accent-gold)' : 'var(--accent-blue)',
                  }}>#{i + 1}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '18px' }}>{getCategoryIcon(fund.category)}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px' }}>{fund.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="tag tag-blue">{fund.category}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                        background: `${getRiskColor(fund.riskLevel)}18`, color: getRiskColor(fund.riskLevel),
                        border: `1px solid ${getRiskColor(fund.riskLevel)}30`,
                      }}>{fund.riskLevel}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {[
                      { label: '3Y CAGR', value: formatPercent(fund.returns['3y']), color: 'var(--accent-gold)' },
                      { label: 'Sharpe', value: fund.sharpeRatio, color: 'var(--accent-blue)' },
                      { label: 'Match Score', value: `${fund.matchScore}/100`, color: getScoreGrade(fund.matchScore).color },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{m.label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match reasons */}
                {fund.matchReasons?.length > 0 && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {fund.matchReasons.map((reason, j) => (
                      <div key={j} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent-emerald)', flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Growth ── */}
        {activeTab === 'growth' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>SIP Wealth Projection</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                ₹{Number(current.profile?.monthlySIP).toLocaleString('en-IN')}/month over {current.profile?.investmentHorizon} years at ~{current.portfolio?.avgExpectedReturn}% expected annual return
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="iGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f0b429" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#4a5878' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4a5878' }} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} width={65} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(8,15,30,0.95)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}
                    formatter={(val, name) => [formatINR(val), name]}
                    labelStyle={{ color: 'var(--text-primary)', fontSize: '13px', marginBottom: '6px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="invested" name="Amount Invested" stroke="#f0b429" strokeWidth={1.5} fill="url(#iGrad)" dot={false} />
                  <Area type="monotone" dataKey="projected" name="Expected Value" stroke="#3b82f6" strokeWidth={2} fill="url(#pGrad)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Milestones */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '20px' }}>Wealth Milestones</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {[1, 3, 5, Math.max(7, parseInt(current.profile?.investmentHorizon || 10))].filter((v, i, a) => a.indexOf(v) === i).map(year => {
                  const pt = timelineData.find(d => d.year === `Y${year}`);
                  const isTarget = year === parseInt(current.profile?.investmentHorizon);
                  return (
                    <div key={year} style={{
                      background: isTarget ? 'rgba(240,180,41,0.06)' : 'rgba(8,15,30,0.5)',
                      border: `1px solid ${isTarget ? 'rgba(240,180,41,0.2)' : 'var(--border)'}`,
                      borderRadius: '12px', padding: '16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Year {year}{isTarget ? ' 🎯' : ''}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: isTarget ? 'var(--accent-gold)' : 'var(--accent-blue)' }}>
                        {formatINR(pt?.projected || 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Suggestions ── */}
        {activeTab === 'suggestions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }} className="animate-fade-in">
            {current.suggestions?.map((s, i) => (
              <div key={i} className="card animate-fade-up" style={{ padding: '26px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ fontSize: '30px', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '10px' }}>{s.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{s.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA to re-analyze */}
            <div className="card animate-fade-up" style={{
              padding: '26px', animationDelay: `${(current.suggestions?.length || 0) * 0.1}s`,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,217,160,0.04))',
              borderColor: 'rgba(59,130,246,0.15)',
              display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '30px' }}>🔄</div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '8px' }}>Update Your Profile</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
                  Markets change. Run a fresh analysis to get updated fund recommendations.
                </p>
                <button className="btn btn-primary" onClick={() => onNavigate('analyze')} style={{ fontSize: '13px', padding: '10px 20px' }}>
                  Re-Analyze →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PageHeader({ user, onNavigate, entryCount }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '14px' }} className="animate-fade-up">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          {/* Avatar */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-blue), #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'white',
            boxShadow: '0 0 20px rgba(59,130,246,0.25)',
          }}>{user.avatar || user.name?.slice(0, 2).toUpperCase()}</div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', lineHeight: 1.2 }}>
              {user.name}'s Portfolio
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {entryCount ? `${entryCount} analysis snapshot${entryCount > 1 ? 's' : ''}` : 'No analyses yet'} · {user.email}
            </p>
          </div>
        </div>
      </div>
      <button className="btn btn-gold" onClick={() => onNavigate('analyze')} style={{ fontSize: '14px' }}>
        + New Analysis
      </button>
    </div>
  );
}