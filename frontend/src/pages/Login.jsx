import { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('jordan.mensah@columbus.co.gh')
  const [password, setPassword] = useState('columbus-demo')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await login({ email, password }); navigate('/', { replace: true }) }
    catch { setError('Sign-in failed. Check your connection and try again.') }
    finally { setBusy(false) }
  }
  return <main className="login-page"><section className="login-story"><div className="login-brand"><div className="brand-mark">C</div><div><strong>Columbus</strong><span>PEOPLE INTELLIGENCE</span></div></div><div className="story-content"><span className="eyebrow">WORKFORCE. IN FOCUS.</span><h1>See the shape<br />of your workday.</h1><p>One clear view of attendance, time and labour cost across your organisation.</p><div className="story-bottom"><span>BUILT FOR BETTER WORK</span><span>ACCRA · GHANA</span></div></div></section><section className="login-panel"><form className="login-form" onSubmit={submit}><div className="login-icon"><ShieldCheck size={21} /></div><span className="eyebrow">SECURE WORKSPACE</span><h2>Welcome back</h2><p>Sign in to your people intelligence workspace.</p><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button login-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<ArrowRight size={17} /></button><div className="login-footnote">Demo access is assigned to your account.</div></form></section></main>
}