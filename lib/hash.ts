import crypto from 'crypto'

const OTP_SECRET = process.env.OTP_SECRET || 'dev_otp_secret'

export function hashOtp(code: string) {
  return crypto.createHmac('sha256', OTP_SECRET).update(code).digest('hex')
}

export function verifyHash(code: string, hash: string) {
  const h = hashOtp(code)
  const a = Buffer.from(h)
  const b = Buffer.from(hash)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
