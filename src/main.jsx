import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Remove referral labels from the visible URL without affecting site navigation.
const cleanUrl = new URL(window.location.href)
for (const key of [...cleanUrl.searchParams.keys()]) {
  if (key.startsWith('utm_') || (key === 'v' && cleanUrl.searchParams.get(key) === 'desktop-volume-01')) {
    cleanUrl.searchParams.delete(key)
  }
}
if (cleanUrl.href !== window.location.href) {
  window.history.replaceState(window.history.state, '', cleanUrl.pathname + cleanUrl.search + cleanUrl.hash)
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
