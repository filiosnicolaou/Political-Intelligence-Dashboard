import { NextApiRequest } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export function getTokenFromRequest(req: { headers?: any; cookies?: any }) {
  let token: string | undefined
  if (req.cookies && req.cookies.poli_token) token = req.cookies.poli_token
  else if (req.headers && req.headers.cookie) {
    const c = parse(req.headers.cookie)
    token = c.poli_token
  }
  return token
}

export function verifyToken(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
  return jwt.verify(token, JWT_SECRET)
}

export function getUserFromRequest(req: { headers?: any; cookies?: any }) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  try {
    return verifyToken(token)
  } catch (err) {
    return null
  }
}
