import { Outlet } from 'react-router-dom'
import './Layout.css'

const Layout = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>8D Problem Solving Platform</h1>
          <p>D1-D2: Problem Definition | D4-D5: Root Cause Analysis</p>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Siemens Case Study - Problem Solving Platform</p>
      </footer>
    </div>
  )
}

export default Layout
