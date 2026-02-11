import { useState } from 'react'
import Layout from '../components/Layout'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState('')

  async function sendOtp(e: any) {
    e.preventDefault()
    setMsg('')
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    const data = await res.json()
    if (res.ok) {
      setSent(true)
      setMsg('Κωδικός αποστάλθηκε. Εισάγετε τον παρακάτω. (demo)')
    } else setMsg(data?.error || 'Σφάλμα')
  }

  async function verify(e: any) {
    e.preventDefault()
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    })
    const data = await res.json()
    if (res.ok) {
      window.location.href = '/'
    } else setMsg(data?.error || 'Σφάλμα επαλήθευσης')
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Σύνδεση μέσω SMS (OTP)</h1>
        <p className="text-sm text-gray-600 mb-4">Συνδεθείτε με το κινητό σας τηλέφωνο. (demo)
        </p>
        {!sent ? (
          <form onSubmit={sendOtp} className="space-y-3">
            <label className="block text-sm">Τηλέφωνο</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+3579XXXXXXXX" className="w-full border rounded px-3 py-2" />
            <button className="w-full bg-primary text-white py-2 rounded">Αποστολή κωδικού</button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-3">
            <label className="block text-sm">Κωδικός OTP</label>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="w-full border rounded px-3 py-2" />
            <button className="w-full bg-primary text-white py-2 rounded">Επιβεβαίωση</button>
          </form>
        )}
        {msg && <div className="mt-3 text-sm text-gray-600">{msg}</div>}
      </div>
    </Layout>
  )
}
