'use client'

import { useState } from 'react'
import type { Page } from '../types'

interface Props { balance: number; onPurchase: (hours: number) => void; onNavigate: (page: Page) => void }

const packages = [
  { hours: 5, price: 350, regular: 400, label: 'Starter', color: '#a78bfa' },
  { hours: 10, price: 650, regular: 800, label: 'Squad Pack', color: '#ec4899', featured: true },
  { hours: 20, price: 1200, regular: 1600, label: 'Pro Pack', color: '#38bdf8' },
]

export default function HoursPurchase({ balance, onPurchase, onNavigate }: Props) {
  const [purchased, setPurchased] = useState<number | null>(null)
  return <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10"><span className="text-sm font-semibold" style={{ color: '#a78bfa' }}>GAME TIME, BETTER VALUE</span><h1 className="text-4xl font-black mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Play Hours</h1><p className="mt-3" style={{ color: '#a09ab8' }}>Buy hours in advance and save on your next arena session.</p></div>
      <div className="card p-5 mb-8 flex flex-wrap items-center justify-between gap-4"><div><div className="text-sm" style={{ color: '#a09ab8' }}>Your demo hour balance</div><div className="text-2xl font-black mt-1" style={{ color: '#c4b5fd', fontFamily: 'IBM Plex Mono, monospace' }}>{balance} hours</div></div><button className="btn-primary px-5 py-2.5" onClick={() => onNavigate('arenas')}>Find an arena</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{packages.map((pack) => <article key={pack.hours} className="card p-6 relative" style={{ border: pack.featured ? '1px solid rgba(236,72,153,0.6)' : '1px solid var(--border)' }}>{pack.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: '#db2777', color: '#fff' }}>MOST POPULAR</span>}<div className="text-sm font-semibold" style={{ color: pack.color }}>{pack.label}</div><div className="mt-3 text-4xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{pack.hours} <span className="text-lg">hours</span></div><div className="mt-4 flex items-baseline gap-2"><span className="text-2xl font-bold" style={{ color: '#c4b5fd' }}>₹{pack.price}</span><span className="text-sm line-through" style={{ color: '#77718f' }}>₹{pack.regular}</span></div><div className="text-sm mt-2" style={{ color: '#a09ab8' }}>₹{(pack.price / pack.hours).toFixed(0)} per hour · Save ₹{pack.regular - pack.price}</div><button className="btn-primary w-full py-3 mt-6" onClick={() => { onPurchase(pack.hours); setPurchased(pack.hours) }}>{purchased === pack.hours ? 'Added to your hours ✓' : `Get ${pack.hours} hours`}</button></article>)}</div>
      {purchased !== null && <div role="status" className="card p-4 mt-6 text-sm text-center" style={{ borderColor: 'rgba(16,185,129,0.35)', color: '#6ee7b7' }}>Demo purchase complete. {purchased} hours were added to your browser balance.</div>}
      <p className="text-xs text-center mt-8" style={{ color: '#77718f' }}>Prototype membership: purchases are simulated and saved in this browser. No payment is processed. One purchased hour covers one player for one hour; squads use one hour per player.</p>
    </div>
  </main>
}
