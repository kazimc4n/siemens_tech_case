import React from 'react'
import ReactDOM from 'react-dom/client'
import { applyPolyfills, defineCustomElements } from '@siemens/ix/loader'

// Import Siemens iX styles FIRST (so CSS variables are available)
import '@siemens/ix/dist/siemens-ix/siemens-ix.css'

// Then import custom styles
import './index.css'

import App from './App.jsx'

// Initialize Siemens iX web components
applyPolyfills().then(() => {
  defineCustomElements()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
