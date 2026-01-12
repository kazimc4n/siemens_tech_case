/**
 * App with Siemens iX Integration
 * Replace App.jsx with this file to use iX components
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardWithIX from './pages/Dashboard-WithIX'
import ProblemDetail from './pages/ProblemDetail'
import NotFound from './pages/NotFound'

function AppWithIX() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardWithIX />} />
          <Route path="problems/:id" element={<ProblemDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppWithIX
