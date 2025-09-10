import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminDashboard } from './presentation/components/AdminDashboard'
import { LoginPage } from './presentation/pages/LoginPage'
import { AuthGuard } from './presentation/components/AuthGuard'
import './i18n' // Initialiser i18n

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard/*" 
            element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
