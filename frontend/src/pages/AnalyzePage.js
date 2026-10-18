import React, { useState } from 'react';
import InvestmentForm from '../components/InvestmentForm';
import { analyzeProfile } from '../utils/api';

export default function AnalyzePage({ onResults }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeProfile(formData);
      onResults(result);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 60px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }} className="animate-fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px', marginBottom: '20px',
            background: 'rgba(240, 180, 41, 0.08)', border: '1px solid rgba(240, 180, 41, 0.2)',
            fontSize: '13px', color: 'var(--accent-gold)',
          }}>
            🎯 3-Step Analysis
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', marginBottom: '12px' }}>
            Build Your Investment Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Answer a few questions and our AI engine will match you with the best
            mutual funds suited to your financial goals and risk profile.
          </p>
        </div>

        {/* Form card */}
        <div className="card animate-fade-up delay-1" style={{ padding: '44px 40px' }}>
          <InvestmentForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '16px', padding: '14px 18px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: '10px', color: 'var(--accent-rose)', fontSize: '14px',
            display: 'flex', gap: '10px', alignItems: 'center',
          }}>
            ⚠️ {error}. Make sure the backend server is running on port 5000.
          </div>
        )}

        {/* Privacy note */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '20px' }}>
          🔒 Your data is analyzed locally and never shared with third parties.
        </p>
      </div>
    </div>
  );
}