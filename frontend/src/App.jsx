import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/browse"     element={<Browse />} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
