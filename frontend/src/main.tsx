import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SLBFELandingPage from './pages/LandingPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SLBFELandingPage />
  </StrictMode>,
)