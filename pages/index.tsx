import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Political Intelligence Platform</h1>
          <p className="text-lg text-gray-600 mb-8">Internal Digital Democracy Platform for Cypriot Political Parties</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">Member Login</Link>
            <Link href="/admin" className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-md text-sm font-medium">Admin Panel</Link>
          </div>

          <div className="mt-10 text-sm text-gray-500">
            <p>Μοντέρνα, mobile-first διεπαφή. Συνδεθείτε για ανακοινώσεις, ψηφοφορίες και συζητήσεις ανά κόμμα.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
