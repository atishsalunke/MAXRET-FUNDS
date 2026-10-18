import React, { useEffect, useState } from 'react';

const STATS = [
  { label: 'Funds Analyzed', value: '1,200+' },
  { label: 'Average Alpha', value: '+6.2%' },
  { label: 'Accuracy Score', value: '94.8%' },
  { label: 'Investor Profiles', value: '50K+' },
];

const FEATURES = [
  { icon: '🔬', title: 'Real-time Analysis', desc: 'Live portfolio composition analysis using current holdings data, not just historical performance.' },
  { icon: '🧠', title: 'AI Matching Engine', desc: 'Multi-factor scoring across risk, returns, Sharpe ratio, and expense ratio tailored to your profile.' },
  { icon: '📊', title: 'Visual Dashboard', desc: 'Interactive charts showing NAV history, sector allocation, and projected SIP growth.' },
  { icon: '🛡️', title: 'Risk Intelligence', desc: 'Beta, alpha, and volatility analysis to ensure funds match your actual risk capacity.' },
  { icon: '🎯', title: 'Goal Alignment', desc: 'Recommendations tied to your specific goals — wealth creation, retirement, or tax saving.' },
  { icon: '💡', title: 'Smart Suggestions', desc: 'Ongoing advice to optimize SIP amounts, rebalance timing, and compound your wealth faster.' },
];

export default function HomePage({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 40px 60px', textAlign: 'center',
      }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', maxWidth: '820px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '20px', marginBottom: '28px',
            background: 'rgba(16, 217, 160, 0.08)',
            border: '1px solid rgba(16, 217, 160, 0.2)',
            fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 500,
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            AI-Powered Portfolio Intelligence
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 700, lineHeight: 1.1, marginBottom: '24px',
          }}>
            Invest Smarter with{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-emerald) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>MAXRET FUNDS</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: '600px', margin: '0 auto 40px',
          }}>
            Stop guessing. Our intelligent recommendation engine analyzes 1,200+ mutual funds
            in real-time to find the perfect match for your financial profile, risk appetite, and life goals.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" style={{ fontSize: '16px', padding: '15px 36px' }} onClick={() => onNavigate('analyze')}>
              🔍 Analyze My Profile
            </button>
            <button className="btn btn-outline" style={{ fontSize: '16px', padding: '15px 36px' }} onClick={() => onNavigate('explore')}>
              Explore Funds
            </button>
          </div>
        </div>

        {/* Floating metrics */}
        <div style={{
          display: 'flex', gap: '20px', marginTop: '70px', flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.4s',
        }}>
          {STATS.map((stat, i) => (
            <div key={i} className="card" style={{ padding: '20px 28px', textAlign: 'center', minWidth: '140px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: i % 2 === 0 ? 'var(--accent-gold)' : 'var(--accent-emerald)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '14px' }}>
            Why MAXRET is <span style={{ color: 'var(--accent-gold)' }}>Different</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Beyond star ratings and past returns — we analyze what matters right now.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card animate-fade-up" style={{ padding: '28px', animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '32px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(16,217,160,0.08) 100%)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: '24px', padding: '60px 40px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '14px' }}>
            Ready to maximize your returns?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '16px' }}>
            Get your personalized fund portfolio in under 2 minutes.
          </p>
          <button className="btn btn-primary" style={{ fontSize: '16px', padding: '15px 40px' }} onClick={() => onNavigate('analyze')}>
            Start Free Analysis →
          </button>
        </div>
      </section>
    </div>
  );
}