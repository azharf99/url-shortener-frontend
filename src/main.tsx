import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const captchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleReCaptchaProvider reCaptchaKey={captchaSiteKey}>
        <App />
      </GoogleReCaptchaProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
