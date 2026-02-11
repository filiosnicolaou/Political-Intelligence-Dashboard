import Link from 'next/link'

export default function Header({ party }: { party?: any }) {
  const color = party?.primaryColor || '#0f172a'
  const logo = party?.logo || null

  return (
    <header className="shadow-sm" style={{ backgroundColor: '#fff' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded flex items-center justify-center font-bold" style={{ backgroundColor: color, color: '#fff' }}>
            {logo ? <img src={logo} alt={party?.name} className="w-8 h-8 object-contain" /> : 'PC'}
          </div>
          <div>
            <div className="font-semibold">Political Intelligence Platform</div>
            <div className="text-xs text-gray-500">Εσωτερική πλατφόρμα</div>
          </div>
        </div>
        <nav className="flex items-center space-x-3">
          <Link href="/" className="text-sm text-gray-700">Αρχική</Link>
          <Link href="/dashboard" className="text-sm text-gray-700">Πίνακας Μελών</Link>
          <Link href="/admin" className="text-sm text-gray-700">Πίνακας Διαχειριστή</Link>
          <Link href="/login" className="text-sm" style={{ color }}>{'Σύνδεση'}</Link>
        </nav>
      </div>
    </header>
  )
}
