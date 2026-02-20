'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const PRAYER_TIMES = [
  { day:1,  date:"2026-02-18", weekday:"Wed", fajr:"05:21", sunrise:"06:32", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { day:2,  date:"2026-02-19", weekday:"Thu", fajr:"05:21", sunrise:"06:32", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { day:3,  date:"2026-02-20", weekday:"Fri", fajr:"05:21", sunrise:"06:32", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { day:4,  date:"2026-02-21", weekday:"Sat", fajr:"05:20", sunrise:"06:31", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { day:5,  date:"2026-02-22", weekday:"Sun", fajr:"05:20", sunrise:"06:31", dhuhr:"12:27", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { day:6,  date:"2026-02-23", weekday:"Mon", fajr:"05:19", sunrise:"06:30", dhuhr:"12:26", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { day:7,  date:"2026-02-24", weekday:"Tue", fajr:"05:19", sunrise:"06:30", dhuhr:"12:26", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { day:8,  date:"2026-02-25", weekday:"Wed", fajr:"05:19", sunrise:"06:29", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { day:9,  date:"2026-02-26", weekday:"Thu", fajr:"05:18", sunrise:"06:29", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { day:10, date:"2026-02-27", weekday:"Fri", fajr:"05:18", sunrise:"06:28", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { day:11, date:"2026-02-28", weekday:"Sat", fajr:"05:17", sunrise:"06:28", dhuhr:"12:26", asr:"15:46", maghrib:"18:23", isha:"19:28" },
  { day:12, date:"2026-03-01", weekday:"Sun", fajr:"05:17", sunrise:"06:27", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { day:13, date:"2026-03-02", weekday:"Mon", fajr:"05:16", sunrise:"06:27", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { day:14, date:"2026-03-03", weekday:"Tue", fajr:"05:16", sunrise:"06:26", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { day:15, date:"2026-03-04", weekday:"Wed", fajr:"05:15", sunrise:"06:26", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { day:16, date:"2026-03-05", weekday:"Thu", fajr:"05:15", sunrise:"06:25", dhuhr:"12:25", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { day:17, date:"2026-03-06", weekday:"Fri", fajr:"05:14", sunrise:"06:25", dhuhr:"12:24", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { day:18, date:"2026-03-07", weekday:"Sat", fajr:"05:14", sunrise:"06:24", dhuhr:"12:24", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { day:19, date:"2026-03-08", weekday:"Sun", fajr:"05:13", sunrise:"06:24", dhuhr:"12:24", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { day:20, date:"2026-03-09", weekday:"Mon", fajr:"05:13", sunrise:"06:23", dhuhr:"12:24", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { day:21, date:"2026-03-10", weekday:"Tue", fajr:"05:12", sunrise:"06:22", dhuhr:"12:23", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { day:22, date:"2026-03-11", weekday:"Wed", fajr:"05:12", sunrise:"06:22", dhuhr:"12:23", asr:"15:42", maghrib:"18:24", isha:"19:29" },
  { day:23, date:"2026-03-12", weekday:"Thu", fajr:"05:11", sunrise:"06:22", dhuhr:"12:23", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { day:24, date:"2026-03-13", weekday:"Fri", fajr:"05:11", sunrise:"06:21", dhuhr:"12:23", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { day:25, date:"2026-03-14", weekday:"Sat", fajr:"05:10", sunrise:"06:20", dhuhr:"12:22", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { day:26, date:"2026-03-15", weekday:"Sun", fajr:"05:09", sunrise:"06:19", dhuhr:"12:22", asr:"15:40", maghrib:"18:24", isha:"19:29" },
  { day:27, date:"2026-03-16", weekday:"Mon", fajr:"05:09", sunrise:"06:19", dhuhr:"12:22", asr:"15:40", maghrib:"18:24", isha:"19:29" },
  { day:28, date:"2026-03-17", weekday:"Tue", fajr:"05:08", sunrise:"06:18", dhuhr:"12:21", asr:"15:39", maghrib:"18:24", isha:"19:29" },
  { day:29, date:"2026-03-18", weekday:"Wed", fajr:"05:08", sunrise:"06:18", dhuhr:"12:21", asr:"15:39", maghrib:"18:24", isha:"19:29" },
  { day:30, date:"2026-03-19", weekday:"Thu", fajr:"05:07", sunrise:"06:17", dhuhr:"12:21", asr:"15:38", maghrib:"18:24", isha:"19:29" },
]

const QUOTES = [
  { ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", en: "Establish prayer and give zakah.", src: "Quran 2:43" },
  { ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", en: "Prayer has been decreed upon the believers at specified times.", src: "Quran 4:103" },
  { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", src: "Quran 13:28" },
  { ar: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", en: "Whoever fasts Ramadan with faith and seeking reward, his past sins will be forgiven.", src: "Bukhari & Muslim" },
  { ar: "الصَّلَوَاتُ الْخَمْسُ كَفَّارَةٌ لِمَا بَيْنَهُنَّ", en: "The five daily prayers are expiation for sins committed between them.", src: "Muslim" },
  { ar: "إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ", en: "When Ramadan arrives, the gates of Paradise are opened.", src: "Bukhari" },
  { ar: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept from us. You are the Hearing, the Knowing.", src: "Quran 2:127" },
  { ar: "مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", en: "Whoever stands in prayer during Ramadan with faith and seeking reward, his past sins will be forgiven.", src: "Bukhari & Muslim" },
]

const PRAYER_META = [
  { key: 'fajr',    en: 'Fajr',    ar: 'الفجر',   desc: 'Dawn Prayer' },
  { key: 'sunrise', en: 'Sunrise', ar: 'الشروق',  desc: 'Sun rises' },
  { key: 'dhuhr',   en: 'Dhuhr',   ar: 'الظهر',   desc: 'Midday Prayer' },
  { key: 'asr',     en: 'Asr',     ar: 'العصر',   desc: 'Afternoon Prayer' },
  { key: 'maghrib', en: 'Maghrib', ar: 'المغرب',  desc: 'Sunset Prayer' },
  { key: 'isha',    en: 'Isha',    ar: 'العشاء',  desc: 'Night Prayer' },
]

// ─────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────

const getWAT = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))

const getTodayStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

const parseTime = (hhmm: string, base: Date): Date => {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(base); d.setHours(h, m, 0, 0); return d
}

const fmt12 = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const fmtMs = (ms: number): { h: string; m: string; s: string } => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
  }
}

const getHijri = (wat: Date): string => {
  const d1 = Date.UTC(wat.getFullYear(), wat.getMonth(), wat.getDate())
  const d2 = Date.UTC(2026, 1, 18)
  const day = Math.floor((d1 - d2) / 86400000) + 1
  if (day >= 1 && day <= 30) return `${day} Ramadan 1447`
  try {
    return wat.toLocaleDateString('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
}

const getSkyColor = (slot: string): string => {
  switch(slot) {
    case 'pre-fajr':  return '#1A1A2E'
    case 'fajr':      return '#2D2B55'
    case 'sunrise':   return '#4B3621'
    case 'dhuhr':     return '#1C3144'
    case 'asr':       return '#274C5E'
    case 'maghrib':   return '#5C2C16'
    case 'isha':      return '#10101A'
    default:          return '#1D1D1F'
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function PrayerPage() {
  const [now, setNow] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)

  // Prevent hydration layout shift
  useEffect(() => {
    setIsMounted(true)
    setNow(getWAT())
    const t = setInterval(() => setNow(getWAT()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => { setQuoteIdx(p => (p + 1) % QUOTES.length); setQuoteFade(true) }, 800)
    }, 20000)
    return () => clearInterval(t)
  }, [])

  if (!isMounted || !now) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {/* Global CSS injection needed for the loading screen as well */}
       <style dangerouslySetInnerHTML={{__html: getGlobalCSS()}} />
       <img src="/logo.png" alt="Loading" style={{ width: '48px', height: 'auto', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }} />
    </div>
  )

  // ── Core date/time values ──
  const todayStr = getTodayStr(now)
  const todayData = PRAYER_TIMES.find(p => p.date === todayStr)
  const isOutOfRamadan = todayStr < '2026-02-18' || todayStr > '2026-03-19'
  const hijri = getHijri(now)
  const ramadanDay = parseInt(hijri.split(' ')[0]) || null
  const H = String(now.getHours()).padStart(2,'0')
  const M = String(now.getMinutes()).padStart(2,'0')
  const S = String(now.getSeconds()).padStart(2,'0')

  // ── Prayer status computation ──
  let prayerList: Array<{
    key: string; en: string; ar: string; desc: string
    time: string; dateObj: Date; status: 'passed' | 'next' | 'upcoming'
  }> = []
  let nextPrayer: typeof prayerList[0] | null = null
  let timeToNext = 0
  let skySlot = 'night'

  if (todayData) {
    const tomorrowDate = new Date(now); tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    const tomorrowStr = getTodayStr(tomorrowDate)
    const tomorrowData = PRAYER_TIMES.find(p => p.date === tomorrowStr)
    let foundNext = false

    prayerList = PRAYER_META.map(meta => {
      const time = (todayData as any)[meta.key] as string
      const dateObj = parseTime(time, now)
      let status: 'passed' | 'next' | 'upcoming' = 'upcoming'

      if (dateObj < now) {
        status = 'passed'
        skySlot = meta.key
      } else if (!foundNext) {
        status = 'next'
        foundNext = true
        nextPrayer = { ...meta, time, dateObj, status }
        timeToNext = dateObj.getTime() - now.getTime()
      }
      return { ...meta, time, dateObj, status }
    })

    if (!foundNext && tomorrowData) {
      skySlot = 'isha'
      const tmrFajrDate = parseTime(tomorrowData.fajr, tomorrowDate)
      nextPrayer = { ...PRAYER_META[0], time: tomorrowData.fajr, dateObj: tmrFajrDate, status: 'next' }
      timeToNext = tmrFajrDate.getTime() - now.getTime()
    }

    if (!foundNext && !tomorrowData) skySlot = 'pre-fajr'
    const hourNow = now.getHours()
    if (!todayData || hourNow < parseInt(todayData.fajr)) skySlot = 'pre-fajr'
  }

  const activeColor = getSkyColor(skySlot)
  
  // ── Suhoor / Iftar countdown ──
  let suhoorMs = 0, iftarMs = 0
  if (todayData) {
    suhoorMs = parseTime(todayData.fajr, now).getTime() - now.getTime()
    iftarMs = parseTime(todayData.maghrib, now).getTime() - now.getTime()
  }
  const showSuhoorCountdown = suhoorMs > 0 && suhoorMs < 60 * 60 * 1000
  const showIftarCountdown = iftarMs > 0 && iftarMs < 60 * 60 * 1000
  const countdown = fmtMs(timeToNext)
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="apple-theme" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 0.4s ease, color 0.4s ease'
    }}>

      <style dangerouslySetInnerHTML={{__html: getGlobalCSS()}} />

      {/* Ambient glowing orb representing current time of day */}
      <div className="ambient-orb" style={{ backgroundColor: activeColor }} />

      {/* ════════════════════════════════════════════════
          STICKY HEADER
      ════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        background: 'var(--nav-bg)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--divider)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 max(24px, env(safe-area-inset-right))',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <a href="https://www.ramadanbot.app" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="RamadanBot Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>RamadanBot</span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '32px' }} className="desktop-nav">
          <style>{`@media(min-width: 768px){ .desktop-nav { display: flex !important; } }`}</style>
          <a href="https://www.ramadanbot.app" className="nav-link">Home</a>
          <a href="/privacy" className="nav-link">Privacy</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <MapPin size={14} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Damaturu, Yobe</span>
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '100px', paddingBottom: '100px', maxWidth: '1000px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* ════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════ */}
        <section style={{ textAlign: 'center', paddingTop: '6vh', paddingBottom: '8vh' }} className="animate-slide-up">
          
          {/* Top Date & Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            {!isOutOfRamadan && ramadanDay && (
              <div style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                padding: '6px 16px', borderRadius: '980px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success-bg)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Ramadan Day {ramadanDay}</span>
              </div>
            )}
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              {dateLabel} <span style={{ opacity: 0.3, margin: '0 8px' }}>|</span> {hijri}
            </h2>
          </div>

          {/* Massive Countdown */}
          {nextPrayer ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h1 className="hero-title tabular-nums" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                {countdown.h}<span style={{ opacity: 0.3 }}>:</span>{countdown.m}<span style={{ opacity: 0.3 }}>:</span>{countdown.s}
              </h1>
              <p className="hero-subtitle">
                Until <span style={{ color: 'var(--text-primary)' }}>{nextPrayer.en}</span>
              </p>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '12px', fontWeight: 500 }}>
                at {fmt12(nextPrayer.time)}
              </p>
            </div>
          ) : (
            <div style={{ padding: '60px 0' }}>
              <img src="/logo.png" alt="RamadanBot" style={{ height: '64px', margin: '0 auto 24px', opacity: 0.5 }} />
              <h1 className="hero-subtitle">Preparing for tomorrow...</h1>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════
            WIDGETS: SUHOOR & IFTAR
        ════════════════════════════════════════════════ */}
        {!isOutOfRamadan && (
          <div className="widget-grid animate-slide-up delay-1">
            {/* Suhoor Widget */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>Suhoor ends</h3>
                  <p style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '-0.03em' }} className="tabular-nums">
                    {todayData ? fmt12(todayData.fajr) : '--:--'}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--arabic)', fontSize: '28px', color: 'var(--text-secondary)', opacity: 0.3 }}>سحور</span>
              </div>
              {showSuhoorCountdown && (
                <div style={{ marginTop: '16px', background: 'var(--warning-bg)', color: 'var(--warning)', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}>
                  Ends in {fmtMs(suhoorMs).m}m {fmtMs(suhoorMs).s}s
                </div>
              )}
            </div>

            {/* Iftar Widget */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>Iftar begins</h3>
                  <p style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '-0.03em' }} className="tabular-nums">
                    {todayData ? fmt12(todayData.maghrib) : '--:--'}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--arabic)', fontSize: '28px', color: 'var(--text-secondary)', opacity: 0.3 }}>إفطار</span>
              </div>
              {showIftarCountdown && (
                <div style={{ marginTop: '16px', background: 'var(--success-bg)', color: 'var(--success)', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}>
                  Begins in {fmtMs(iftarMs).h}h {fmtMs(iftarMs).m}m
                </div>
              )}
            </div>
          </div>
        )}

        {/*════════════════════════════════════════════════
            PRAYER TIMELINE
        ════════════════════════════════════════════════ */}
        {!isOutOfRamadan && (
          <div className="glass-panel animate-slide-up delay-2" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--divider)' }}>Today's Schedule</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prayerList.map((p, i) => {
                const isNext = p.status === 'next'
                const isPassed = p.status === 'passed'
                
                return (
                  <div key={p.key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: isNext ? 'var(--row-today)' : 'transparent',
                    transition: 'background 0.3s ease',
                    opacity: isPassed ? 0.4 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '4px', height: '24px', borderRadius: '2px', background: isNext ? 'var(--accent)' : 'transparent' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                          <span style={{ fontSize: '18px', fontWeight: isNext ? 600 : 500, color: 'var(--text-primary)' }}>{p.en}</span>
                          <span style={{ fontFamily: 'var(--arabic)', fontSize: '16px', color: 'var(--text-secondary)' }}>{p.ar}</span>
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>{p.desc}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: isNext ? 600 : 500, color: isNext ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {fmt12(p.time)}
                      </span>
                      {isNext && (
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>Up Next</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            DAILY INSPIRATION
        ════════════════════════════════════════════════ */}
        <div className="glass-panel animate-slide-up delay-3" style={{ padding: '36px 32px', marginBottom: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          {/* Logo Watermark (Requested top right positioning) */}
          <img 
            src="/logo.png" 
            alt="Decorative Logo" 
            style={{ 
              position: 'absolute', top: '-15px', right: '-15px', 
              width: '140px', height: '140px', objectFit: 'contain',
              opacity: 0.04, pointerEvents: 'none', transform: 'rotate(15deg)'
            }} 
          />

          <div style={{ opacity: quoteFade ? 1 : 0, transition: 'opacity 0.6s ease', position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--arabic)', fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--text-primary)', lineHeight: 1.6, direction: 'rtl', marginBottom: '16px' }}>
              {QUOTES[quoteIdx].ar}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 400, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5 }}>
              "{QUOTES[quoteIdx].en}"
            </p>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {QUOTES[quoteIdx].src}
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            FULL TIMETABLE ACCORDION
        ════════════════════════════════════════════════ */}
        <div className="glass-panel animate-slide-up delay-3" style={{ padding: tableOpen ? '0' : '8px', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <button
            onClick={() => setTableOpen(!tableOpen)}
            style={{
              width: '100%', padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'transparent', border: 'none',
              color: 'var(--text-primary)', fontSize: '16px', fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={20} color="var(--text-secondary)" />
              <span>Full Ramadan Timetable</span>
            </div>
            {tableOpen ? <ChevronUp size={20} color="var(--text-secondary)"/> : <ChevronDown size={20} color="var(--text-secondary)"/>}
          </button>

          {tableOpen && (
            <div style={{ borderTop: '1px solid var(--divider)', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ background: 'var(--row-hover)', borderBottom: '1px solid var(--divider)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '13px', color: 'var(--text-secondary)', position: 'sticky', left: 0, background: 'var(--glass-bg)', zIndex: 2 }}>Date</th>
                      {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(h => (
                        <th key={h} style={{ padding: '16px', fontWeight: 500, fontSize: '13px', color: 'var(--text-secondary)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRAYER_TIMES.map(row => {
                      const isToday = row.date === todayStr;
                      const isPassed = row.date < todayStr;
                      return (
                        <tr key={row.day} style={{ 
                          borderBottom: '1px solid var(--divider)',
                          background: isToday ? 'var(--row-today)' : 'transparent',
                          opacity: isPassed ? 0.4 : 1
                        }}>
                          <td style={{ 
                            padding: '16px', textAlign: 'left', position: 'sticky', left: 0, 
                            background: isToday ? 'var(--bg-secondary)' : 'var(--glass-bg)', 
                            zIndex: 1 
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '14px', fontWeight: isToday ? 600 : 500, color: isToday ? 'var(--accent)' : 'var(--text-primary)' }}>Day {row.day}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(row.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </td>
                          {(['fajr','sunrise','dhuhr','asr','maghrib','isha'] as const).map(k => (
                            <td key={k} className="tabular-nums" style={{ 
                              padding: '16px', fontSize: '15px',
                              color: k === 'fajr' || k === 'maghrib' ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontWeight: (k === 'fajr' || k === 'maghrib') ? 500 : 400
                            }}>{row[k]}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--row-hover)' }}>
                Source: Supreme Council for Islamic Affairs, Nigeria
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ════════════════════════════════════════════════
          PREMIUM FOOTER
      ════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid var(--divider)',
        padding: '40px 24px',
        background: 'var(--footer-bg)',
        color: 'var(--text-secondary)',
        position: 'relative', zIndex: 10,
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="RamadanBot Logo" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>RamadanBot</span>
              </div>
              <p style={{ fontSize: '13px', maxWidth: '300px', lineHeight: 1.5 }}>
                Providing accurate prayer times, daily inspirations, and Ramadan tracking tailored for Damaturu, Yobe, Nigeria.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '48px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explore</span>
                <a href="https://www.ramadanbot.app" className="nav-link">Home</a>
                <a href="/privacy" className="nav-link">Privacy Policy</a>
                <a href="/contact" className="nav-link">Contact Us</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '12px' }}>
              Built with love for the ummah by Abdallah Nangere
            </p>
            <p style={{ fontSize: '12px' }}>
              Copyright © {new Date().getFullYear()} RamadanBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Global CSS string function keeps JSX clean while injecting powerful native CSS Variables
function getGlobalCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Scheherazade+New:wght@400;700&display=swap');

    :root {
      /* Apple Light Mode Variables */
      --bg-main: #F5F5F7;
      --bg-secondary: #FFFFFF;
      --text-primary: #1D1D1F;
      --text-secondary: #86868B;
      --glass-bg: rgba(255, 255, 255, 0.75);
      --glass-border: rgba(0, 0, 0, 0.08);
      --accent: #0071E3;
      --accent-bg: rgba(0, 113, 227, 0.1);
      --success: #34C759;
      --success-bg: rgba(52, 199, 89, 0.15);
      --warning: #FF9F0A;
      --warning-bg: rgba(255, 159, 10, 0.15);
      --nav-bg: rgba(255, 255, 255, 0.72);
      --footer-bg: #F5F5F7;
      --divider: rgba(0, 0, 0, 0.08);
      --row-hover: rgba(0, 0, 0, 0.02);
      --row-today: rgba(0, 113, 227, 0.08);
      --ambient-opacity: 0.15;
      
      --sf-pro: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
      --arabic: 'Scheherazade New', serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        /* Apple Dark Mode Variables */
        --bg-main: #000000;
        --bg-secondary: #1C1C1E;
        --text-primary: #F5F5F7;
        --text-secondary: #86868B;
        --glass-bg: rgba(28, 28, 30, 0.65);
        --glass-border: rgba(255, 255, 255, 0.1);
        --accent: #0A84FF;
        --accent-bg: rgba(10, 132, 255, 0.15);
        --success: #30D158; 
        --success-bg: rgba(48, 209, 88, 0.15);
        --warning: #FF9F0A;
        --warning-bg: rgba(255, 159, 10, 0.15);
        --nav-bg: rgba(0, 0, 0, 0.72);
        --footer-bg: #000000;
        --divider: rgba(255, 255, 255, 0.1);
        --row-hover: rgba(255, 255, 255, 0.04);
        --row-today: rgba(10, 132, 255, 0.15);
        --ambient-opacity: 0.35;
      }
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body { 
      font-family: var(--sf-pro);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: var(--bg-main);
    }

    /* Apple smooth scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(134, 134, 139, 0.4); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(134, 134, 139, 0.6); }

    .tabular-nums { font-variant-numeric: tabular-nums; }
    
    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.04);
      transition: background-color 0.4s ease, border-color 0.4s ease;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      transition: color 0.2s ease;
    }
    .nav-link:hover { color: var(--text-primary); }

    /* Smooth fade animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
    
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }

    /* Ambient Background Orb */
    .ambient-orb {
      position: absolute;
      width: 80vw;
      height: 80vw;
      max-width: 800px;
      max-height: 800px;
      border-radius: 50%;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      filter: blur(140px);
      opacity: var(--ambient-opacity);
      pointer-events: none;
      z-index: 0;
      transition: background-color 3s ease-in-out, opacity 0.4s ease;
    }

    /* Widget Grid */
    .widget-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    /* Responsive Text */
    .hero-title { font-size: clamp(64px, 12vw, 120px); font-weight: 600; letter-spacing: -0.04em; line-height: 1; }
    .hero-subtitle { font-size: clamp(24px, 5vw, 40px); font-weight: 500; letter-spacing: -0.02em; color: var(--text-secondary); }
  `
      }
                        
