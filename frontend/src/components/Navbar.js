import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../utils/AuthContext';

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    onNavigate('home');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 40px', height: '70px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(4, 8, 16, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(59, 130, 246, 0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => onNavigate('home')}>
        <div style={{
          width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #10d9a0)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '16px', color: 'white', fontFamily: 'var(--font-display)',
        }}>M</div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px',
          background: 'linear-gradient(135deg, #e8edf8, #8899bb)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>MAXRET <span style={{ color: 'var(--accent-gold)', WebkitTextFillColor: 'var(--accent-gold)' }}>FUNDS</span></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'analyze', label: 'Analyze' },
          { id: 'explore', label: 'Explore' },
          ...(user ? [{ id: 'portfolio', label: '📂 Portfolio' }] : []),
        ].map(link => (
          <button key={link.id} onClick={() => onNavigate(link.id)} style={{
            background: currentPage === link.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
            border: currentPage === link.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
            borderRadius: '8px', padding: '8px 14px',
            color: currentPage === link.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{link.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(p => !p)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: '10px', padding: '7px 14px 7px 8px',
              cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-blue), #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'white',
              }}>{user.avatar || user.name?.slice(0, 2).toUpperCase()}</div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{menuOpen ? '▲' : '▼'}</span>
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'rgba(8,15,30,0.98)', border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: '12px', padding: '8px', minWidth: '180px',
                backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                animation: 'fadeInUp 0.15s ease-out',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                </div>
                {[
                  { label: '📂 My Portfolio', action: () => { onNavigate('portfolio'); setMenuOpen(false); } },
                  { label: '🔍 New Analysis', action: () => { onNavigate('analyze'); setMenuOpen(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{
                    width: '100%', padding: '9px 12px', border: 'none', borderRadius: '8px',
                    background: 'transparent', color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                  }}>{item.label}</button>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '6px' }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '9px 12px', border: 'none', borderRadius: '8px',
                    background: 'transparent', color: 'var(--accent-rose)',
                    fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                  }}>🚪 Sign Out</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn btn-outline" style={{ padding: '9px 20px', fontSize: '14px' }}
              onClick={() => onNavigate('auth')}>Sign In</button>
            <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '14px' }}
              onClick={() => onNavigate('auth')}>Get Started →</button>
          </>
        )}
      </div>
    </nav>
  );
}