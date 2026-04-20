import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Browse Components', desc: 'Explore parts from top brands', color: '#3b82f6', wip: false, route: '/browse',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    title: 'Build PC Manually', desc: 'Assemble your dream build', color: '#22c55e', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: 'Auto Recommend', desc: 'Get a build for your budget', color: '#f59e0b', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Compatibility Check', desc: 'Verify parts work together', color: '#a855f7', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: 'Bottleneck Analyzer', desc: 'Detect performance issues', color: '#ef4444', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/></svg>,
    title: 'Compare Builds', desc: 'Side by side build analysis', color: '#06b6d4', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    title: 'My Orders', desc: 'Track your purchases', color: '#f97316', wip: true, route: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    title: 'Saved Builds', desc: 'Your saved configurations', color: '#ec4899', wip: true, route: null,
  },
]

const stats = [
  { label: 'Components',  value: '85+', icon: '🔩', color: '#3b82f6' },
  { label: 'Categories',  value: '11',  icon: '📂', color: '#22c55e' },
  { label: 'Brands',      value: '30+', icon: '🏷️', color: '#f59e0b' },
  { label: 'Builds Made', value: '0',   icon: '💾', color: '#a855f7' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('forgepc_user') || 'null')
  const [wipModal, setWipModal] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    if (!user) navigate('/login')
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const greeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0' }}>
      <Navbar onWip={() => setWipModal(true)} />

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #0a0a0f 50%, #1a0a2e 100%)',
        borderBottom: '1px solid #1e293b',
        padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, #3b82f620 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '35%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, #a855f710 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {greeting()}, <span style={{ color: '#3b82f6' }}>{user.name.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '400px', lineHeight: 1.65 }}>
              Your PC building hub. Browse parts, check compatibility, and forge the perfect build.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/browse')} style={{
                background: '#3b82f6', color: '#fff', border: 'none',
                padding: '0.65rem 1.5rem', borderRadius: '8px',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
              }}>Browse Components →</button>
              <button onClick={() => setWipModal(true)} style={{
                background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b',
                padding: '0.65rem 1.5rem', borderRadius: '8px',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}>Start a Build</button>
            </div>
          </div>

          {/* Live clock */}
          <div style={{
            background: 'rgba(13,17,23,0.85)', border: '1px solid #1e293b',
            borderRadius: '12px', padding: '1.25rem 2rem', textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3b82f6', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ color: '#334155', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {time.toLocaleTimeString('en-US', { second: '2-digit' }).split(':')[2]}s
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#0d1117', border: '1px solid #1e293b',
              borderRadius: '10px', padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.9rem'
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '8px',
                background: s.color + '15', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.15rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>FEATURES</h2>
          <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
          <span style={{ color: '#334155', fontSize: '0.78rem' }}>Click to explore</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {features.map(f => (
            <div key={f.title} onClick={() => f.wip ? setWipModal(true) : navigate(f.route)} style={{
              background: '#0d1117', border: '1px solid #1e293b',
              borderRadius: '10px', padding: '1.2rem',
              cursor: 'pointer', transition: 'all 0.18s',
              position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#111827' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0d1117' }}
            >
              {f.wip && (
                <div style={{ position: 'absolute', top: '0.7rem', right: '0.7rem', background: '#1a1a2e', color: '#334155', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.5px' }}>SOON</div>
              )}
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: f.color + '15', border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '0.85rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{f.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WIP Modal ── */}
      {wipModal && (
        <div onClick={() => setWipModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: '16px', padding: '2.5rem', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚧</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Work in Progress</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>This feature is under development and will be available soon!</p>
            <button onClick={() => setWipModal(false)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  )
}
