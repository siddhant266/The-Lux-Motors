import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import CategoryPage from './pages/CategoryPage'
import LoginPage from './pages/LoginPage'
import CarDetailPage from './pages/CarDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<HomePage />} />
        <Route path="/models" element={<CategoryPage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/login"  element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
