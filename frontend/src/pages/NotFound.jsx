import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" style={{ color: '#003e52', textDecoration: 'underline' }}>
        Go back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
