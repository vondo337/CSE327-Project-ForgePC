import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const TYPES = ['All', 'CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Monitor', 'Keyboard', 'Mouse']

const TYPE_ICONS = {
  All: '🖥️', CPU: '🔲', GPU: '🎮', RAM: '📦', Motherboard: '🔌',
  Storage: '💽', PSU: '⚡', Case: '🗃️', Monitor: '🖥️', Keyboard: '⌨️', Mouse: '🖱️'
}

export default function Browse() {
  const navigate = useNavigate()
  const [components, setComponents] = useState([])
  const [activeType, setActiveType] = useState('All')
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [wipModal, setWipModal]     = useState(false)

  useEffect(() => { fetchComponents() }, [activeType, search])

  const fetchComponents = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/components', {
        params: { type: activeType, search }
      })
      setComponents(res.data)
    } catch { console.error('Failed to fetch') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0' }}>
      <Navbar onWip={() => setWipModal(true)} />

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Browse Components</h1>
          <p style={{ color: '#64748b', marginTop: '0.3rem' }}>
            {components.length} parts found
            {activeType !== 'All' ? ` in ${activeType}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        </div>

        {/* ── Search ── */}
        <input
          type="text" placeholder="🔍  Search components..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '480px', background: '#0d1117',
            border: '1px solid #1e293b', borderRadius: '8px',
            padding: '0.75rem 1rem', color: '#e2e8f0', fontSize: '0.95rem',
            outline: 'none', marginBottom: '1.5rem', boxSizing: 'border-box'
          }}
        />

        {/* ── Filter Tabs ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {TYPES.map(type => (
            <button key={type} onClick={() => setActiveType(type)} style={{
              background: activeType === type ? '#3b82f6' : '#0d1117',
              color:      activeType === type ? '#fff' : '#94a3b8',
              border: `1px solid ${activeType === type ? '#3b82f6' : '#1e293b'}`,
              borderRadius: '999px', padding: '0.4rem 1rem',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              transition: 'all 0.15s'
            }}>
              {TYPE_ICONS[type]} {type}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
            Loading components...
          </div>
        ) : components.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
            No components found.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {components.map(c => (
              <ComponentCard key={c.component_id} component={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ComponentCard({ component: c }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0d1117',
        border: `1px solid ${hovered ? '#3b82f6' : '#1e293b'}`,
        borderRadius: '12px', padding: '1.5rem',
        transition: 'all 0.2s', cursor: 'default',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 30px rgba(59,130,246,0.15)' : 'none'
      }}
    >
      {/* Type badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{
          background: '#1e3a5f', color: '#93c5fd',
          borderRadius: '999px', padding: '0.2rem 0.7rem',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px'
        }}>
          {TYPE_ICONS[c.type]} {c.type}
        </span>
        <span style={{
          background: c.stock > 0 ? '#0f2d1f' : '#2d1515',
          color: c.stock > 0 ? '#4ade80' : '#f87171',
          borderRadius: '999px', padding: '0.2rem 0.7rem',
          fontSize: '0.75rem', fontWeight: 600
        }}>
          {c.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Name & Brand */}
      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', lineHeight: 1.3 }}>{c.name}</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{c.brand}</p>

      {/* Specs */}
      {c.specs && (
        <p style={{
          color: '#475569', fontSize: '0.8rem', lineHeight: 1.5,
          background: '#0a0a0f', borderRadius: '6px', padding: '0.5rem 0.75rem',
          marginBottom: '1rem', fontFamily: 'monospace'
        }}>
          {c.specs}
        </p>
      )}

      {/* Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>
          ৳ {c.price.toLocaleString()}
        </span>
        <button style={{
          background: '#1e3a5f', color: '#93c5fd',
          border: '1px solid #3b82f6', borderRadius: '6px',
          padding: '0.35rem 0.85rem', cursor: 'pointer',
          fontSize: '0.8rem', fontWeight: 600
        }}>
          + Add to Build
        </button>
      </div>
    </div>
  )
}

const smallBtn = (bg) => ({
  background: bg, color: '#fff', border: 'none',
  padding: '0.4rem 1rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
})