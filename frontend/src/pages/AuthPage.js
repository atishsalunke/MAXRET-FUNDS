import React, { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../utils/authApi';
import { useAuth } from '../utils/AuthContext';

// Tiny inline validator
const validate = (fields, mode) => {
  const errs = {};
  if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Valid email required';
  if (!fields.password || fields.password.length < 8) errs.password = 'Password must be 8+ characters';
  if (mode === 'register') {
    if (!fields.name || fields.name.trim().length < 2) errs.name = 'Full name required';
    if (fields.password !== fields.confirm) errs.confirm = 'Passwords do not match';
  }
  return errs;
};

// Password strength meter
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '', color: 'transparent' },
    { label: 'Weak', color: '#f43f5e' },
    { label: 'Fair', color: '#f97316' },
    { label: 'Good', color: '#f0b429' },
    { label: 'Strong', color: '#10d9a0' },
  ];
  return { score, ...map[score] };
};

export default function AuthPage({ onNavigate }) {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const update = (k, v) => {
    setFields(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
    setServerError('');
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setServerError('');
    setFields({ name: '', email: '', password: '', confirm: '', phone: '' });
  };

  const handleSubmit = async () => {
    const errs = validate(fields, mode);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      const fn = mode === 'login' ? loginUser : registerUser;
      const res = await fn(fields);
      login(res.user);
      onNavigate('home');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(fields.password);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden',
    }}>
      {/* ── Left panel — brand ───────────────────────────────────── */}
      <div style={{
        flex: '0 0 45%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '60px 50px',
        background: 'linear-gradient(145deg, #040d1f 0%, #071428 50%, #040810 100%)',
        borderRight: '1px solid rgba(59,130,246,0.08)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Orbs */}
        {[
          { size: 340, top: '-80px', left: '-80px', color: 'rgba(59,130,246,0.07)', delay: '0s' },
          { size: 260, bottom: '-60px', right: '-60px', color: 'rgba(16,217,160,0.06)', delay: '3s' },
          { size: 180, top: '40%', right: '10%', color: 'rgba(240,180,41,0.05)', delay: '6s' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', width: orb.size, height: orb.size,
            borderRadius: '50%', background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right,
            animation: `float${i + 1} ${18 + i * 4}s ease-in-out infinite`,
            animationDelay: orb.delay,
          }} />
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '380px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #10d9a0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'white',
              boxShadow: '0 0 30px rgba(59,130,246,0.3)',
            }}>M</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px' }}>
              MAXRET <span style={{ color: 'var(--accent-gold)' }}>FUNDS</span>
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px', lineHeight: 1.2,
            marginBottom: '18px',
          }}>
            Your wealth journey <span style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-emerald))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>starts here</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '48px' }}>
            Get AI-powered mutual fund recommendations tailored to your goals, risk profile, and investment horizon.
          </p>

          {/* Feature pills */}
          {[
            { icon: '🔬', text: 'Real-time fund analysis' },
            { icon: '🎯', text: 'Personalized recommendations' },
            { icon: '📊', text: 'Portfolio tracking dashboard' },
            { icon: '💡', text: 'Smart investment suggestions' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 18px', borderRadius: '12px', marginBottom: '10px',
              background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)',
              textAlign: 'left',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
              transition: `all 0.5s ease ${0.2 + i * 0.1}s`,
            }}>
              <span style={{ fontSize: '18px' }}>{f.icon}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', position: 'relative',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          width: '100%', maxWidth: '440px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'rgba(8,15,30,0.8)',
            border: '1px solid var(--border)', borderRadius: '12px',
            padding: '5px', marginBottom: '36px',
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: '11px', border: 'none', borderRadius: '8px',
                background: mode === m ? 'var(--bg-card-hover)' : 'transparent',
                border: mode === m ? '1px solid var(--border-glow)' : '1px solid transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.25s', textTransform: 'capitalize',
              }}>
                {m === 'login' ? '🔑 Sign In' : '✨ Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '6px' }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {mode === 'login'
                ? 'Sign in to access your portfolio and recommendations.'
                : 'Join thousands of smart investors using MAXRET.'}
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{
              padding: '13px 16px', borderRadius: '10px', marginBottom: '20px',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
              color: 'var(--accent-rose)', fontSize: '14px', display: 'flex', gap: '8px',
            }}>
              ⚠️ {serverError}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {mode === 'register' && (
              <Field label="Full Name" error={errors.name}>
                <input className="input-field" type="text" placeholder="Shrushti Gulve"
                  value={fields.name} onChange={e => update('name', e.target.value)}
                  style={{ borderColor: errors.name ? 'var(--accent-rose)' : undefined }} />
              </Field>
            )}

            <Field label="Email Address" error={errors.email}>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={fields.email} onChange={e => update('email', e.target.value)}
                style={{ borderColor: errors.email ? 'var(--accent-rose)' : undefined }} />
            </Field>

            {mode === 'register' && (
              <Field label="Phone Number (optional)">
                <input className="input-field" type="tel" placeholder="+91 98765 43210"
                  value={fields.phone} onChange={e => update('phone', e.target.value)} />
              </Field>
            )}

            <Field label="Password" error={errors.password}>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPass ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={fields.password} onChange={e => update('password', e.target.value)}
                  style={{ paddingRight: '48px', borderColor: errors.password ? 'var(--accent-rose)' : undefined }} />
                <button onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                  color: 'var(--text-muted)', padding: '4px',
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {/* Strength bar */}
              {mode === 'register' && fields.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.06)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </Field>

            {mode === 'register' && (
              <Field label="Confirm Password" error={errors.confirm}>
                <input className="input-field" type={showPass ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={fields.confirm} onChange={e => update('confirm', e.target.value)}
                  style={{ borderColor: errors.confirm ? 'var(--accent-rose)' : undefined }} />
              </Field>
            )}
          </div>

          {/* Forgot password (login only) */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '15px', fontSize: '15px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'login' ? '🔑 Sign In' : '✨ Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Demo login */}
          <button
            className="btn btn-outline"
            onClick={() => {
              update('email', 'demo@maxretfunds.in');
              update('password', 'Demo@1234');
              setTimeout(() => handleSubmit(), 100);
            }}
            style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}
          >
            🚀 Continue with Demo Account
          </button>

          {/* Switch mode */}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '24px' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>
              {mode === 'login' ? 'Create one free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Tiny field wrapper
function Field({ label, error, children }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      {children}
      {error && <span style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>⚠ {error}</span>}
    </div>
  );
}