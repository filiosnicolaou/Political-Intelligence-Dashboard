import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import prisma from '../../../lib/prisma'
import { verifyHash } from '../../../lib/hash'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { phone, otp } = req.body
  if (!phone || !otp) return res.status(400).json({ error: 'Missing fields' })

  try {
    const record = await prisma.oTP.findFirst({ where: { phone }, orderBy: { createdAt: 'desc' } })
    if (!record) return res.status(404).json({ error: 'No OTP found' })
    if (new Date(record.expiresAt) < new Date()) return res.status(410).json({ error: 'OTP expired' })

    const ok = verifyHash(String(otp), record.codeHash)
    if (!ok) return res.status(401).json({ error: 'Άκυρος κωδικός' })

    // delete used OTPs
    await prisma.oTP.deleteMany({ where: { phone } })

    // find or create member
    let member = await prisma.member.findUnique({ where: { phone } })
    if (!member) {
      member = await prisma.member.create({ data: { phone, role: 'MEMBER' } })
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
    const token = jwt.sign({ memberId: member.id, phone: member.phone, role: member.role }, JWT_SECRET, { expiresIn: '7d' })

    res.setHeader('Set-Cookie', cookie.serialize('poli_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    }))

    res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
