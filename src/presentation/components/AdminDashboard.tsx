import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Dashboard } from '../pages/Dashboard'
import { Users } from '../pages/Users'
import { Settings } from '../pages/Settings'

export function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
