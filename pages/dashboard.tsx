import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export default function Dashboard({ user, party }: { user: any; party?: any }) {
  const districts = ['Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αμμόχωστος']

  return (
    <Layout party={party}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Ανακοινώσεις</h2>
          <div className="space-y-3">
            <article className="p-3 border rounded">
              <h3 className="font-medium">Συνεδρία Εκλογικής Οργάνωσης</h3>
              <p className="text-sm text-gray-600">Σύντομη περιγραφή ανακοίνωσης...</p>
            </article>
            <article className="p-3 border rounded">
              <h3 className="font-medium">Νέα πρωτοβουλία</h3>
              <p className="text-sm text-gray-600">Σύντομη περιγραφή...</p>
            </article>
          </div>
        </section>

        <aside className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Συζητήσεις ανά θέμα</h3>
            <div className="text-sm text-gray-500">Χρήστης: {user?.phone}</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="p-2 border rounded">Οικονομία</li>
            <li className="p-2 border rounded">Κοινωνικά</li>
            <li className="p-2 border rounded">Πολιτισμός</li>
          </ul>

          <h3 className="font-semibold mt-4 mb-2">Περιφέρεια</h3>
          <select className="w-full border rounded p-2">
            {districts.map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </aside>
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

    // fetch member and party
    const member = await prisma.member.findUnique({ where: { id: payload.memberId }, include: { party: true } })
    const party = member?.party || null
    return { props: { user: payload, party } }
  } catch (err) {
    return { redirect: { destination: '/login', permanent: false } }
  }
}
