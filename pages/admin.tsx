import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export default function Admin({ user, party }: { user: any; party?: any }) {
  return (
    <Layout party={party}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Πίνακας Διαχειριστή</h1>
        <p className="text-sm text-gray-600 mb-4">Διαχείριση μελών, ανακοινώσεων και συνεδριών ψηφοφορίας.</p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Μέλη</h3>
            <p className="text-sm text-gray-600">Προσθήκη / αφαίρεση / έλεγχος</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Ανακοινώσεις</h3>
            <p className="text-sm text-gray-600">Δημιουργία και δημοσίευση</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Ψηφοφορίες</h3>
            <p className="text-sm text-gray-600">Δημιουργία συνεδριών ψηφοφορίας</p>
          </div>
        </section>
        <div className="mt-4 text-sm text-gray-500">Logged in as: {user?.phone}</div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieHeader = ctx.req.headers.cookie || ''
  const cookies = parse(cookieHeader)
  const token = cookies.poli_token
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
    const payload: any = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'ADMIN') return { redirect: { destination: '/', permanent: false } }

    const member = await prisma.member.findUnique({ where: { id: payload.memberId }, include: { party: true } })
    const party = member?.party || null
    return { props: { user: payload, party } }
  } catch (err) {
    return { redirect: { destination: '/login', permanent: false } }
  }
}
