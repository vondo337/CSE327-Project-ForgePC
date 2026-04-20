import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ onWip }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('forgepc_user') || 'null')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('forgepc_user')
    navigate('/')
  }

  const navLinks = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Browse',    route: '/browse' },
    { label: 'Build PC',  route: null },
    { label: 'Recommend', route: null },
    { label: 'Compare',   route: null },
  ]

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 2.5rem', height: '60px',
      borderBottom: '1px solid #1e293b',
      background: 'rgba(10,10,15,0.98)',
      position: 'sticky', top: 0, zIndex: 200,
      backdropFilter: 'blur(10px)'
    }}>
      {/* Logo */}
      <div onClick={() => navigate(user ? '/dashboard' : '/')} style={{
        fontSize: '1.3rem', fontWeight: 900, color: '#3b82f6',
        cursor: 'pointer', letterSpacing: '-0.5px', userSelect: 'none'
      }}>
        ⚙️ ForgePC
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '0.1rem' }}>
        {navLinks.map(link => {
          const isActive = location.pathname === link.route
          return (
            <button key={link.label} onClick={() => {
              if (link.route) navigate(link.route)
              else onWip && onWip()
            }} style={{
              background: isActive ? '#1e293b' : 'transparent',
              color: isActive ? '#e2e8f0' : '#64748b',
              border: 'none', padding: '0.45rem 1rem',
              borderRadius: '6px', cursor: 'pointer',
              fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
              transition: 'all 0.15s',
              borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent'
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = '#0d1117' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' } }}
            >
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: dropdownOpen ? '#1e293b' : 'transparent',
              border: '1px solid #1e293b', borderRadius: '8px',
              padding: '0.45rem 0.9rem', cursor: 'pointer', color: '#e2e8f0',
              fontWeight: 600, fontSize: '0.88rem', transition: 'background 0.15s'
            }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 900, color: '#fff'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.name.split(' ')[0]}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                <polyline points={dropdownOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: '#0d1117', border: '1px solid #1e293b',
                borderRadius: '10px', minWidth: '210px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 300
              }}>
                <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{user.name}</div>
                  <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.15rem' }}>Registered User</div>
                </div>
                {[
                  { icon: '👤', label: 'My Profile' },
                  { icon: '📦', label: 'My Orders' },
                  { icon: '🛒', label: 'Cart' },
                  { icon: '💾', label: 'Saved Builds' },
                  { icon: '⭐', label: 'My Reviews' },
                ].map(item => (
                  <button key={item.label} onClick={() => { setDropdownOpen(false); onWip && onWip() }} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem',
                    background: 'transparent', border: 'none', padding: '0.65rem 1.1rem',
                    color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left',
                    transition: 'background 0.15s, color 0.15s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#e2e8f0' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                  >
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #1e293b' }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem',
                    background: 'transparent', border: 'none', padding: '0.65rem 1.1rem',
                    color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left',
                    transition: 'background 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2d1515'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate('/login')} style={outlineBtn}>Login</button>
            <button onClick={() => navigate('/register')} style={solidBtn}>Register</button>
          </div>
        )}
      </div>
    </nav>
  )
}

const solidBtn = {
  background: '#3b82f6', color: '#fff', border: 'none',
  padding: '0.45rem 1rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
}
const outlineBtn = {
  background: 'transparent', color: '#94a3b8', border: '1px solid #1e293b',
  padding: '0.45rem 1rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
}
