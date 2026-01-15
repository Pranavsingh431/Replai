import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './components/Landing/Landing'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './components/Dashboard/Dashboard'
import PaymentSuccess from './components/Payment/PaymentSuccess'
import PaymentCancel from './components/Payment/PaymentCancel'
import AuthCallback from './pages/AuthCallback'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/app/login" />
}

function AppRoutes() {
  const { user, signOut } = useAuth()
  
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Callback (Public - No Auth Guard) */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route 
          path="/app" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/app/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/app/signup" 
          element={user ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        
        <Route path="/login" element={<Navigate to="/app/login" />} />
        <Route path="/signup" element={<Navigate to="/app/signup" />} />
        
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/payment/success" 
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/payment/cancel" 
          element={
            <PrivateRoute>
              <PaymentCancel />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
