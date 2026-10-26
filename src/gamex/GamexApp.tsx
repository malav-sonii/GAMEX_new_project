'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from './components/Header'
import Home from './pages/Home'
import ArenaListing from './pages/ArenaListing'
import ArenaDetails from './pages/ArenaDetails'
import BookingFlow from './pages/BookingFlow'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import Events from './pages/Events'
import Dashboard from './pages/Dashboard'
import HoursPurchase from './pages/HoursPurchase'
import { arenas } from './pages/ArenaListing'
import { DEFAULT_ARENA, type Arena, type BookingDraft, type ConfirmedBooking, type Page } from './types'

export type SessionUser = { phone: string; id: number | string; name: string }

function tomorrowISO() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function createInitialBooking(): BookingDraft {
  return { ...DEFAULT_ARENA, device: 'PC', dateISO: tomorrowISO(), time: '11:00 AM', durationHours: 2, rate: 80, quantity: 1, hoursUsed: 0 }
}

export default function GamexApp({
  initialPage = 'home',
  initialUser = null,
}: {
  initialPage?: Page
  initialUser?: SessionUser | null
}) {
  const router = useRouter()
  const [page, setPage] = useState<Page>(initialPage)
  const [user, setUser] = useState<SessionUser | null>(initialUser)
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>(createInitialBooking)
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([])
  const [latestBooking, setLatestBooking] = useState<ConfirmedBooking | null>(null)
  const [selectedArena, setSelectedArena] = useState<Arena>(arenas[0])
  const [hoursBalance, setHoursBalance] = useState(0)

  const [dashboardInitialSection, setDashboardInitialSection] = useState<'bookings' | 'profile' | 'notifications' | 'settings'>('bookings')

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      return
    }
    try {
      const stored = window.localStorage.getItem('gamex-demo-user')
      const parsed = stored ? JSON.parse(stored) as SessionUser : null
      setUser(parsed && typeof parsed.id === 'string' && typeof parsed.name === 'string' && typeof parsed.phone === 'string' ? parsed : null)
      if (!parsed && initialPage === 'dashboard') router.replace('/login?next=/dashboard')
    } catch {
      setUser(null)
      if (initialPage === 'dashboard') router.replace('/login?next=/dashboard')
    }
  }, [initialUser, initialPage, router])

  useEffect(() => {
    try { setHoursBalance(Number(window.localStorage.getItem('gamex-demo-play-hours') ?? 0) || 0) } catch { setHoursBalance(0) }
  }, [])

  useEffect(() => {
    if (initialPage === 'dashboard') {
      const section = new URLSearchParams(window.location.search).get('section')
      setDashboardInitialSection(section === 'profile' ? 'profile' : 'bookings')
    }
  }, [initialPage])

  useEffect(() => {
    if (!user) {
      setConfirmedBookings([])
      return
    }
    try {
      const stored = window.localStorage.getItem(`gamex-bookings:${user.id}`)
      setConfirmedBookings(stored ? JSON.parse(stored) as ConfirmedBooking[] : [])
    } catch {
      setConfirmedBookings([])
    }
  }, [user])

  const addPlayHours = (hours: number) => {
    const next = hoursBalance + hours
    setHoursBalance(next)
    try { window.localStorage.setItem('gamex-demo-play-hours', String(next)) } catch { /* Keep the current session usable if storage is disabled. */ }
  }

  const saveConfirmedBooking = (booking: ConfirmedBooking) => {
    const next = [booking, ...confirmedBookings.filter((item) => item.id !== booking.id)]
    setConfirmedBookings(next)
    if (user) {
      try { window.localStorage.setItem(`gamex-bookings:${user.id}`, JSON.stringify(next)) } catch { /* Storage may be disabled; keep this session usable. */ }
    }
  }

  const navigate = (nextPage: Page) => {
    if (nextPage === 'dashboard') {
      setDashboardInitialSection('bookings')
      router.push(user ? '/dashboard' : '/login?next=/dashboard')
      return
    }
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logout = async () => {
    try { window.localStorage.removeItem('gamex-demo-user') } catch { /* Keep the current screen usable if storage is unavailable. */ }
    setUser(null)
    setConfirmedBookings([])
    setLatestBooking(null)
    setPage('home')
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      <Header
        currentPage={page}
        onNavigate={navigate}
        loggedIn={Boolean(user)}
        userInitial={user?.name.charAt(0).toUpperCase()}
        onLogin={() => router.push('/login')}
        onSignUp={() => router.push('/signup')}
        onLogout={logout}
        onOpenProfile={() => {
          if (!user) {
            router.push('/login?next=%2Fdashboard%3Fsection%3Dprofile')
            return
          }
          setDashboardInitialSection('profile')
          setPage('dashboard')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {page === 'home' && <Home onNavigate={navigate} />}
      {page === 'arenas' && <ArenaListing onNavigate={navigate} onSelectArena={setSelectedArena} />}
      {page === 'arena-detail' && <ArenaDetails arena={selectedArena} onNavigate={navigate} onStartBooking={(device, quantity, rate) => {
        setBookingDraft({ arena: selectedArena.name, location: selectedArena.location, img: selectedArena.image, device, rate, quantity, hoursUsed: 0, dateISO: tomorrowISO(), time: '11:00 AM', durationHours: 2 })
        navigate('booking')
      }} />}
      {page === 'hours' && <HoursPurchase balance={hoursBalance} onPurchase={addPlayHours} onNavigate={navigate} />}
      {page === 'booking' && <BookingFlow booking={bookingDraft} onNavigate={navigate} hourBalance={hoursBalance} onContinue={(nextBooking) => { setBookingDraft(nextBooking); navigate('payment') }} />}
      {page === 'payment' && <Payment booking={bookingDraft} onNavigate={navigate} onConfirm={(paymentMethod) => {
        const booking: ConfirmedBooking = { ...bookingDraft, id: `GX-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, status: 'Upcoming', paymentMethod, createdAt: new Date().toISOString() }
        setLatestBooking(booking)
        saveConfirmedBooking(booking)
        if (booking.hoursUsed) {
          const nextHours = Math.max(0, hoursBalance - booking.hoursUsed)
          setHoursBalance(nextHours)
          try { window.localStorage.setItem('gamex-demo-play-hours', String(nextHours)) } catch { /* Keep this demo booking usable when storage is unavailable. */ }
        }
        navigate('confirmation')
      }} />}
      {page === 'confirmation' && <Confirmation booking={latestBooking ?? confirmedBookings[0] ?? null} onNavigate={navigate} />}
      {page === 'events' && <Events onNavigate={navigate} />}
      {page === 'dashboard' && user && <Dashboard onNavigate={navigate} onLogout={logout} user={user} bookings={confirmedBookings} initialSection={dashboardInitialSection} />}
    </div>
  )
}
