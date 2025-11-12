import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
