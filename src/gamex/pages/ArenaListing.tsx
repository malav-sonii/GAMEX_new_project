'use client'

import { useMemo, useState } from 'react';
import type { Arena, Page } from '../types';

interface Props {
  onNavigate: (page: Page) => void;
  onSelectArena: (arena: Arena) => void;
}

export const arenas: Arena[] = [
  { id: 'playzz', name: 'Playzz Station Arena', location: 'Chandkheda, Ahmedabad', address: '136 The CBD, Vaishnodevi Ring Road, Chandkheda', phone: '+917383261016', systems: [{ name: 'PS5', rate: 120, ratePublished: true }, { name: 'Racing cockpit', rate: 150, ratePublished: true }], image: 'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=600&h=400&fit=crop&auto=format', source: 'https://playzzstation.in/' },
  { id: 'vaultplay', name: 'VaultPlay', location: 'Gota, Ahmedabad', address: 'Shop 102, Aristo Aatman, Satyamev Vista Road, Gota', phone: '+919723991417', systems: [{ name: 'PS5', rate: 150, ratePublished: true }], image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=600&h=400&fit=crop&auto=format', source: 'https://vaultplay.in/' },
  { id: 'happy-hours', name: 'Happy Hours Gaming', location: 'Nikol, Ahmedabad', address: '109, Sunrise Business Center, Gurukul Road, Nikol', phone: '+919328355907', systems: [{ name: 'PC', rate: 80, ratePublished: true }, { name: 'PS5', rate: 100, ratePublished: true }, { name: 'Racing simulator', rate: 120, ratePublished: true }], image: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=600&h=400&fit=crop&auto=format', source: 'https://www.happyhoursgaming.com/' },
  { id: 'xenon', name: 'Xenon Gaming Hub', location: 'Gota, Ahmedabad', address: '2nd Floor, Olive Greens, D-222, SG Highway, near Gota Cross Road', phone: '+916357019281', systems: [{ name: 'PS5', rate: 120, ratePublished: false }, { name: 'Gaming PC', rate: 80, ratePublished: false }, { name: 'Racing simulator', rate: 150, ratePublished: false }], image: 'https://images.unsplash.com/photo-1636489953081-c4ebbd50fa3a?w=600&h=400&fit=crop&auto=format', source: 'https://www.xenongaming-hub.com/' },
  { id: 'consolehub-thaltej', name: 'Console Hub · Thaltej', location: 'Thaltej, Ahmedabad', address: '305, Gala Empire, Drive In Road, Thaltej', phone: '+919898865788', systems: [{ name: 'PS5', rate: 120, ratePublished: false }, { name: 'Gaming PC', rate: 80, ratePublished: false }, { name: 'GTRacing cockpit', rate: 180, ratePublished: false }], image: 'https://images.unsplash.com/photo-1598550487031-0898b4852123?w=600&h=400&fit=crop&auto=format', source: 'https://consolehub.in/booking' },
  { id: 'consolehub-southbopal', name: 'Console Hub · South Bopal', location: 'South Bopal, Ahmedabad', address: 'South Bopal branch; confirm exact address with venue', phone: '+919898865788', systems: [{ name: 'PS5', rate: 120, ratePublished: false }, { name: 'Gaming PC', rate: 80, ratePublished: false }, { name: 'GTRacing cockpit', rate: 180, ratePublished: false }], image: 'https://images.unsplash.com/photo-1633545505446-586bf83717f0?w=600&h=400&fit=crop&auto=format', source: 'https://consolehub.in/booking' },
  { id: 'khel-destination', name: 'Khel Destination', location: 'New Nikol, Ahmedabad', address: '13 & 14 Fortune Sky, Fortune Circle, New Nikol', phone: '+918934949893', systems: [{ name: 'PS5', rate: 120, ratePublished: true }, { name: 'Gaming PC', rate: 120, ratePublished: true }, { name: 'Racing simulator', rate: 180, ratePublished: true }], image: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=600&h=400&fit=crop&auto=format', source: 'https://www.kheldestination.com/' },
  { id: 'infernal-arena', name: 'Infernal Arena', location: 'Naranpura, Ahmedabad', address: '108 Ratna High Street, Naranpura', phone: '+916354507139', systems: [{ name: 'PS5', rate: 100, ratePublished: true }, { name: 'Sim racing cockpit', rate: 150, ratePublished: true }, { name: 'VR sim racing', rate: 200, ratePublished: true }], image: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=600&h=400&fit=crop&auto=format', source: 'https://infernalarena.com/' },
];

export default function ArenaListing({ onNavigate, onSelectArena }: Props) {
  const [search, setSearch] = useState('');
  const [systemFilter, setSystemFilter] = useState('All');
  const filters = ['All', 'PC', 'PS5', 'VR', 'Racing'];
  const filtered = useMemo(() => arenas.filter((arena) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [arena.name, arena.location, arena.address].some((value) => value.toLowerCase().includes(query));
    const matchesSystem = systemFilter === 'All' || arena.systems.some((system) => system.name.toLowerCase().includes(systemFilter.toLowerCase()));
    return matchesSearch && matchesSystem;
  }), [search, systemFilter]);
  const openDetails = (arena: Arena) => { onSelectArena(arena); onNavigate('arena-detail'); };

  return <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
    <div className="py-12 px-4" style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto"><h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ahmedabad Arenas</h1><p style={{ color: '#a09ab8' }}>Compare systems, hourly rates, location and contact details</p></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-1" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><span style={{ color: '#5c5778' }}>⌕</span><input className="flex-1 bg-transparent text-sm outline-none" placeholder="Search arena or area..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ color: '#f0eeff' }} /></div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: '#f0eeff' }}>📍 <span className="text-sm font-medium">Ahmedabad · All Areas</span></div>
      </div>
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">{filters.map((filter) => <button key={filter} onClick={() => setSystemFilter(filter)} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap" style={{ background: systemFilter === filter ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--card)', color: systemFilter === filter ? '#fff' : '#a09ab8', border: '1px solid var(--border)' }}>{filter}</button>)}</div>
      <div className="flex flex-col gap-5">
        {filtered.map((arena) => <article key={arena.id} className="card card-hover overflow-hidden grid grid-cols-1 sm:grid-cols-[260px_minmax(0,1fr)] gap-0">
          <div className="relative min-h-[150px] overflow-hidden sm:min-h-[180px]" style={{ background: '#1a1a28' }}><img src={arena.image} alt={arena.name} className="w-full h-full object-cover absolute inset-0" /><div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 70%, rgba(19,19,30,0.8))' }} /></div>
          <div className="p-4 sm:p-6 flex flex-col justify-between"><div>
            <div className="flex items-start justify-between mb-3 gap-3"><div><h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{arena.name}</h3><div className="text-sm" style={{ color: '#a09ab8' }}>📍 {arena.location}</div><div className="text-xs mt-1" style={{ color: '#77718f' }}>{arena.address}</div></div><div className="text-right shrink-0"><div className="text-lg font-bold" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>From ₹{Math.min(...arena.systems.map((system) => system.rate))}{arena.systems.some((system) => !system.ratePublished) ? '*' : ''}</div><div className="text-xs" style={{ color: '#5c5778' }}>/system/hour</div></div></div>
            <div className="flex flex-wrap gap-2 mb-4">{arena.systems.map((system) => <span key={system.name} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.08)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.15)' }}>{system.name} · ₹{system.rate}/hr{system.ratePublished ? '' : '*'}</span>)}</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${arena.name}, ${arena.address}, Ahmedabad`)}`} target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>📍 Directions ↗</a>{arena.phone && <a href={`tel:${arena.phone}`} style={{ color: '#a78bfa' }}>☎ {arena.phone.replace('+91', '+91 ')}</a>}</div>
          </div><div className="flex justify-end mt-4"><button className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm" onClick={() => openDetails(arena)}>View Details</button></div></div>
        </article>)}
      </div>
      {filtered.length === 0 && <div className="text-center py-20" style={{ color: '#5c5778' }}><p className="text-lg font-medium">No arenas found</p><p className="text-sm mt-1">Try another name or system</p></div>}
      <p className="text-xs mt-6" style={{ color: '#77718f' }}>* Sample estimate for venues without a published system price. Published rates may vary by player count, screen size, or offer; please confirm with the venue.</p>
    </div>
  </div>;
}
