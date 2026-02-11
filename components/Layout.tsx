import React, { ReactNode } from 'react'
import Header from './Header'

export default function Layout({ children, party }: { children: ReactNode; party?: any }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header party={party} />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">Political Intelligence Platform — Εσωτερική πλατφόρμα</div>
      </footer>
    </div>
  )
}
