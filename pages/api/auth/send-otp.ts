import type { NextApiRequest, NextApiResponse } from 'next'
import { randomInt } from 'crypto'
import prisma from '../../../lib/prisma'
import { hashOtp } from '../../../lib/hash'
import Twilio from 'twilio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { phone } = req.body
  if (!phone) return res.status(400).json({ error: 'Phone required' })

  const code = String(randomInt(100000, 999999))
  const codeHash = hashOtp(code)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5) // 5 minutes

  try {
    // remove old OTPs for phone
    await prisma.oTP.deleteMany({ where: { phone } })
    await prisma.oTP.create({ data: { phone, codeHash, expiresAt } })

    // Send SMS via Twilio if configured
    const sid = process.env.TWILIO_SID
    const token = process.env.TWILIO_AUTH
    const from = process.env.TWILIO_PHONE
    if (sid && token && from) {
      const client = Twilio(sid, token)
      await client.messages.create({ to: phone, from, body: `PoliConnect OTP: ${code}` })
    } else {
      console.log(`OTP for ${phone}: ${code}`)
    }

    res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
