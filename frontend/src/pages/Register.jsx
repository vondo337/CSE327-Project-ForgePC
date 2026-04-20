import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError('Please fill in all fields')
    if (form.password !== form.confirm)
      return setError('Passwords do not match')
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/register', {
        name: form.name, email: form.email, password: form.password
      })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3b82f6' }}>⚙️ ForgePC</div>
          <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Create your account</p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ background: '#2d1515', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.75rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#0f2d1f', border: '1px solid #22c55e', borderRadius: '6px', padding: '0.75rem', color: '#4ade80', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'name',     type: 'text',     label: 'Full Name',       placeholder: 'John Doe' },
            { name: 'email',    type: 'email',    label: 'Email',           placeholder: 'you@email.com' },
            { name: 'password', type: 'password', label: 'Password',        placeholder: '••••••••' },
            { name: 'confirm',  type: 'password', label: 'Confirm Password',placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label style={labelStyle}>{field.label}</label>
              <input
                name={field.name} type={field.type} placeholder={field.placeholder}
                value={form[field.name]} onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e  => e.target.style.borderColor = '#1e293b'}
              />
            </div>
          ))}
          <button onClick={handleSubmit} disabled={loading} style={{
            background: loading ? '#1e3a5f' : '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '8px', padding: '0.85rem',
            fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem', transition: 'background 0.2s'
          }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
            Login here
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/" style={{ color: '#475569', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh', background: '#0a0a0f',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '2rem',
  backgroundImage: 'radial-gradient(ellipse at top, #1e3a5f33 0%, transparent 60%)'
}
const cardStyle = {
  background: '#0d1117', border: '1px solid #1e293b',
  borderRadius: '16px', padding: '2.5rem',
  width: '100%', maxWidth: '420px',
  boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
}
const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }
const inputStyle = {
  width: '100%', background: '#0a0a0f', border: '1px solid #1e293b',
  borderRadius: '8px', padding: '0.75rem 1rem', color: '#e2e8f0',
  fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box'
}
