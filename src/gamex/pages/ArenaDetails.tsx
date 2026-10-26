'use client'

import { useMemo, useState } from 'react'
import type { Arena, Page } from '../types'

interface Props {
  arena: Arena
  onNavigate: (page: Page) => void
  onStartBooking: (device: string, players: number, ratePerPlayer: number) => void
}

const playerDiscount = [0, 1, 0.9, 0.82, 0.75]
const groupRate = (baseRate: number, players: number) => Math.round((baseRate * playerDiscount[players]) / 5) * 5

export default function ArenaDetails({ arena, onNavigate, onStartBooking }: Props) {
  const [selectedSystem, setSelectedSystem] = useState(arena.systems[0]?.name ?? '')
  const [players, setPlayers] = useState(1)
  const [selectedStations, setSelectedStations] = useState<number[]>([])
  const system = arena.systems.find((item) => item.name === selectedSystem) ?? arena.systems[0]
  const ratePerPlayer = useMemo(() => groupRate(system.rate, players), [system.rate, players])
  const stationPrefix = system.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'SYS'
  const stationCount = system.name.toLowerCase().includes('pc') ? 12 : system.name.toLowerCase().includes('ps5') ? 6 : 6
  const demoStations = Array.from({ length: stationCount }, (_, index) => ({ id: `${stationPrefix}-${index + 1}`, status: index === 2 ? 'booked' : index === 5 ? 'maintenance' : 'open' }))
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${arena.name}, ${arena.address}, Ahmedabad`)}`

  return <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => onNavigate('arenas')} className="flex items-center gap-2 mb-6 text-sm" style={{ color: '#a09ab8' }}>← Back to Arenas</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="card p-6 sm:p-8 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Arena details</span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{arena.name}</h1>
            <p className="mt-2" style={{ color: '#a09ab8' }}>📍 {arena.location}</p>
            <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <div className="text-sm font-semibold">Address</div><p className="text-sm mt-1" style={{ color: '#a09ab8' }}>{arena.address}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-3 mt-4 text-sm">
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="font-semibold" style={{ color: '#a78bfa' }}>Open location in Google Maps ↗</a>
                {arena.phone && <a href={`tel:${arena.phone}`} className="font-semibold" style={{ color: '#a78bfa' }}>Call {arena.phone.replace('+91', '+91 ')} ↗</a>}
                <a href={arena.source} target="_blank" rel="noreferrer" className="font-semibold" style={{ color: '#a78bfa' }}>Venue website ↗</a>
              </div>
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5"><div><h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Choose a system</h2><p className="text-sm mt-1" style={{ color: '#a09ab8' }}>Hourly prices shown per player</p></div><span className="text-xs" style={{ color: '#77718f' }}>Group savings applied automatically</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{arena.systems.map((item) => {
              const selected = selectedSystem === item.name
              const currentRate = groupRate(item.rate, players)
              return <button type="button" key={item.name} onClick={() => { setSelectedSystem(item.name); setSelectedStations([]) }} aria-pressed={selected} className="rounded-xl p-4 text-left transition-all" style={{ background: selected ? 'rgba(139,92,246,0.12)' : 'var(--bg-2)', border: selected ? '1px solid rgba(139,92,246,0.65)' : '1px solid var(--border)' }}>
                <div className="flex justify-between gap-3"><span className="font-bold">{item.name}</span><span className="text-xs" style={{ color: '#10b981' }}>{selected ? 'Selected' : 'Select'}</span></div>
                <div className="mt-3 flex items-baseline gap-2"><span className="text-xl font-black" style={{ color: '#c4b5fd', fontFamily: 'IBM Plex Mono, monospace' }}>₹{currentRate}</span><span className="text-xs" style={{ color: '#a09ab8' }}>/player/hour</span></div>
                {players > 1 && <div className="text-xs mt-1" style={{ color: '#10b981' }}>Was ₹{item.rate} · squad rate</div>}
                {!item.ratePublished && <div className="text-xs mt-2" style={{ color: '#fbbf24' }}>Sample rate · confirm with venue</div>}
              </button>
            })}</div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-bold">Squad size</h3><p className="text-xs mt-1" style={{ color: '#a09ab8' }}>More players means a lower rate per person.</p></div><div className="grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((count) => <button key={count} type="button" aria-pressed={players === count} onClick={() => { setPlayers(count); setSelectedStations((current) => current.slice(0, count)) }} className="min-w-[58px] rounded-xl px-2 py-2 font-bold" style={{ background: players === count ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--bg-2)', border: '1px solid var(--border)', color: '#fff' }}><span className="block">{count}</span><span className="block text-[10px] font-normal mt-1">₹{groupRate(system.rate, count)}/ea</span></button>)}</div></div>
            <div className="mt-6">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-3"><div><h3 className="font-bold">Station Grid</h3><p className="text-xs mt-1" style={{ color: '#a09ab8' }}>Select {players} station{players > 1 ? 's' : ''} for your {players === 1 ? 'session' : 'squad'}.</p></div><span className="text-xs" style={{ color: '#a78bfa' }}>{selectedStations.length} / {players} selected</span></div>
              <div className="grid gap-3 p-4 rounded-2xl" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', background: 'rgba(9,9,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {demoStations.map((station, index) => {
                  const selected = selectedStations.includes(index + 1)
                  const color = selected ? '#a78bfa' : station.status === 'booked' ? '#ef4444' : station.status === 'maintenance' ? '#f59e0b' : '#10b981'
                  const background = selected ? 'rgba(139,92,246,0.15)' : station.status === 'booked' ? 'rgba(239,68,68,0.05)' : station.status === 'maintenance' ? 'rgba(245,158,11,0.05)' : 'rgba(16,185,129,0.05)'
                  const border = selected ? '#8b5cf6' : station.status === 'booked' ? 'rgba(239,68,68,0.3)' : station.status === 'maintenance' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'
                  return <button type="button" key={station.id} disabled={station.status !== 'open'} aria-pressed={selected} onClick={() => setSelectedStations((current) => current.includes(index + 1) ? current.filter((item) => item !== index + 1) : current.length >= players ? [...current.slice(1), index + 1] : [...current, index + 1])} className="rounded-xl p-3 text-center transition-all" style={{ background, border: `1px solid ${border}`, cursor: station.status === 'open' ? 'pointer' : 'not-allowed', boxShadow: selected ? '0 0 16px rgba(139,92,246,0.4)' : 'none', opacity: station.status === 'maintenance' ? 0.7 : 1 }}>
                    <div className="font-bold text-xs mb-0.5" style={{ fontFamily: 'IBM Plex Mono', color: '#f0eeff' }}>{station.id}</div>
                    <div className="text-xs" style={{ color }}>{selected ? '✓ Sel.' : station.status === 'booked' ? 'Booked' : station.status === 'maintenance' ? 'Maint.' : 'Open'}</div>
                  </button>
                })}
              </div>
              <p className="text-xs mt-2" style={{ color: '#77718f' }}>Demo grid only; venue station status and availability are not connected.</p>
            </div>
            <div className="mt-5 rounded-xl p-4 flex flex-wrap justify-between gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}><div><div className="text-sm" style={{ color: '#a09ab8' }}>Hourly group total · {players} {players === 1 ? 'player' : 'players'}</div><div className="text-xs mt-1" style={{ color: '#10b981' }}>₹{ratePerPlayer} per player × {players}</div></div><div className="text-2xl font-black" style={{ color: '#6ee7b7', fontFamily: 'IBM Plex Mono, monospace' }}>₹{ratePerPlayer * players}/hr</div></div>
            <p className="text-xs mt-4" style={{ color: '#77718f' }}>Published prices are used where the venue lists a rate. Other prices are sample estimates for this demo. Confirm current pricing and system availability with the venue.</p>
          </div>
        </section>
        <aside><div className="card p-6 sticky top-24"><h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your session</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3"><span style={{ color: '#a09ab8' }}>System</span><span className="text-right">{system.name}</span></div><div className="flex justify-between gap-3"><span style={{ color: '#a09ab8' }}>Players / stations</span><span>{players} / {selectedStations.length} selected</span></div><div className="flex justify-between gap-3"><span style={{ color: '#a09ab8' }}>Rate per player</span><span>₹{ratePerPlayer}/hr</span></div><div className="pt-3 flex justify-between font-bold" style={{ borderTop: '1px solid var(--border)' }}><span>Group total</span><span style={{ color: '#c4b5fd' }}>₹{ratePerPlayer * players}/hr</span></div></div><button className="btn-primary w-full py-3 mt-6 disabled:opacity-50" onClick={() => onStartBooking(system.name, players, ratePerPlayer)} disabled={selectedStations.length !== players}>{selectedStations.length === players ? 'Continue to booking' : `Select ${players - selectedStations.length} more station${players - selectedStations.length === 1 ? '' : 's'}`}</button><p className="text-xs mt-3 leading-5" style={{ color: '#77718f' }}>Demo booking only. Venue availability must be confirmed before a real reservation.</p></div></aside>
      </div>
    </div>
  </main>
}
