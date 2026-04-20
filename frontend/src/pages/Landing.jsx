import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Smart Recommendations',
    desc: 'Tell us your budget and use case — get a full build suggestion that actually makes sense.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Compatibility Check',
    desc: 'Socket types, form factors, power draw — we verify everything fits before you commit.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Bottleneck Analyzer',
    desc: 'See where your build holds itself back. CPU vs GPU balance, RAM speed, power limits.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
      </svg>
    ),
    title: 'Save Your Builds',
    desc: 'Keep multiple configs saved to your account. Compare them side by side anytime.'
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('forgepc_user') || 'null')

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 2.5rem',
        borderBottom: '1px solid #1e293b',
        background: 'rgba(10,10,15,0.95)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.5px' }}>
          ⚙️ ForgePC
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ color: '#94a3b8', alignSelf: 'center' }}>Hi, {user.name}!</span>
              <button onClick={() => navigate('/browse')} style={btnStyle('#3b82f6')}>Browse Parts</button>
              <button onClick={() => { localStorage.removeItem('forgepc_user'); window.location.reload() }} style={btnStyle('#ef4444')}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}    style={btnOutline}>Login</button>
              <button onClick={() => navigate('/register')} style={btnStyle('#3b82f6')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        textAlign: 'center', padding: '6rem 2rem 4rem',
        background: 'radial-gradient(ellipse at top, #1e3a5f 0%, #0a0a0f 60%)'
      }}>
        <div style={{
          display: 'inline-block', background: '#1e3a5f', border: '1px solid #3b82f6',
          borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.8rem',
          color: '#93c5fd', marginBottom: '1.5rem', letterSpacing: '1px'
        }}>
          INTELLIGENT PC BUILD SYSTEM
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900,
          lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px'
        }}>
          Build Your Perfect PC<br />
          <span style={{ color: '#3b82f6' }}>Without the Guesswork</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '540px', margin: '0 auto 2.5rem' }}>
          ForgePC helps you find compatible components, avoid bottlenecks, and stay within budget — all in one place.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(user ? '/browse' : '/register')} style={{
            ...btnStyle('#3b82f6'),
            padding: '0.85rem 2.5rem', fontSize: '1rem', borderRadius: '8px'
          }}>
            {user ? 'Browse Components →' : 'Start Building Free →'}
          </button>
          <button onClick={() => navigate('/browse')} style={{
            ...btnOutline,
            padding: '0.85rem 2.5rem', fontSize: '1rem', borderRadius: '8px'
          }}>
            Browse Parts
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
        padding: '2.5rem 2rem', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b',
        background: '#0d1117'
      }}>
        {[['75+', 'Components'], ['7', 'Categories'], ['100%', 'Compatible'], ['Free', 'To Use']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>{val}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>
          Everything You Need to Build Smart
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: '#0d1117', border: '1px solid #1e293b', borderRadius: '12px',
              padding: '1.8rem', transition: 'border-color 0.2s', cursor: 'default'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
            >
              <div style={{ marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        textAlign: 'center', padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #1e3a5f, #0a0a0f)',
        borderTop: '1px solid #1e293b'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Forge Your Build?</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Join and start building your perfect PC today.</p>
        <button onClick={() => navigate(user ? '/browse' : '/register')} style={{
          ...btnStyle('#3b82f6'),
          padding: '0.85rem 2.5rem', fontSize: '1rem', borderRadius: '8px'
        }}>
          {user ? 'Go to Browse →' : 'Create Free Account →'}
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '1.5rem',
        color: '#334155', fontSize: '0.85rem',
        borderTop: '1px solid #1e293b'
      }}>
        © 2025 ForgePC — CSE327 Project
      </footer>
    </div>
  )
}

// ── Shared styles ──
const btnStyle = (bg) => ({
  background: bg, color: '#fff', border: 'none',
  padding: '0.5rem 1.2rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
  transition: 'opacity 0.2s',
})

const btnOutline = {
  background: 'transparent', color: '#94a3b8',
  border: '1px solid #334155',
  padding: '0.5rem 1.2rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
}
