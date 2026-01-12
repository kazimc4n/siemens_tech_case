import { Outlet } from 'react-router-dom'
import './Layout.css'

const Layout = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>8D Problem Solving Platform</h1>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>&copy; Siemens Case Study - Problem Solving Platform</p>
      </footer>
    </div>
  )
}

export default Layout
