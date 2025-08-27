import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App/ >
  </AuthProvider>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
