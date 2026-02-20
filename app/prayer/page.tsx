'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// DATA  (unchanged)
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
  { key: 'fajr',    en: 'Fajr',    ar: 'الفجر',   emoji: '🌙', desc: 'Dawn Prayer' },
  { key: 'sunrise', en: 'Sunrise', ar: 'الشروق',  emoji: '🌅', desc: 'Sun rises' },
  { key: 'dhuhr',   en: 'Dhuhr',   ar: 'الظهر',   emoji: '☀️', desc: 'Midday Prayer' },
  { key: 'asr',     en: 'Asr',     ar: 'العصر',   emoji: '🌤️', desc: 'Afternoon Prayer' },
  { key: 'maghrib', en: 'Maghrib', ar: 'المغرب',  emoji: '🌇', desc: 'Sunset Prayer' },
  { key: 'isha',    en: 'Isha',    ar: 'العشاء',   emoji: '🌃', desc: 'Night Prayer' },
]

// ─────────────────────────────────────────────────────────────
// UTILS  (unchanged)
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
  if (day >= 1 && day <= 30) return `${day} Ramadan 1447 AH`
  try {
    return wat.toLocaleDateString('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
}

const getSkyColors = (slot: string): { from: string; via: string; to: string; accent: string } => {
  switch(slot) {
    case 'pre-fajr':  return { from: '#010408', via: '#04071a', to: '#070a22', accent: 'rgba(80,60,180,0.07)' }
    case 'fajr':      return { from: '#08041a', via: '#150a30', to: '#1c0a42', accent: 'rgba(160,80,255,0.06)' }
    case 'sunrise':   return { from: '#100900', via: '#1c0e04', to: '#0e0610', accent: 'rgba(255,140,40,0.05)' }
    case 'dhuhr':     return { from: '#010a18', via: '#021220', to: '#04192a', accent: 'rgba(80,160,255,0.04)' }
    case 'asr':       return { from: '#020c16', via: '#04121c', to: '#061826', accent: 'rgba(60,140,210,0.04)' }
    case 'maghrib':   return { from: '#140600', via: '#200c06', to: '#100408', accent: 'rgba(255,110,20,0.08)' }
    case 'isha':      return { from: '#010508', via: '#040710', to: '#03050c', accent: 'rgba(60,80,190,0.05)' }
    default:          return { from: '#010810', via: '#030b1a', to: '#050d20', accent: 'rgba(201,168,76,0.04)' }
  }
}

// ─────────────────────────────────────────────────────────────
// SVG COMPONENTS
// ─────────────────────────────────────────────────────────────

const IslamicPattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.018, pointerEvents: 'none' }}>
    <defs>
      <pattern id="ip2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon points="40,3 76,22 76,58 40,77 4,58 4,22" fill="none" stroke="#C9A84C" strokeWidth="0.6"/>
        <polygon points="40,14 66,28 66,52 40,66 14,52 14,28" fill="none" stroke="#C9A84C" strokeWidth="0.3"/>
        <circle cx="40" cy="40" r="5" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
        <line x1="40" y1="3" x2="40" y2="77" stroke="#C9A84C" strokeWidth="0.25" opacity="0.4"/>
        <line x1="4" y1="22" x2="76" y2="58" stroke="#C9A84C" strokeWidth="0.25" opacity="0.4"/>
        <line x1="76" y1="22" x2="4" y2="58" stroke="#C9A84C" strokeWidth="0.25" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip2)"/>
  </svg>
)

const CrescentMoon = ({ size = 48, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M36 24C36 30.627 30.627 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C20.686 12 18 16.686 18 24C18 31.314 20.686 36 24 36" fill="#C9A84C" opacity="0.95"/>
    <path d="M24 12C27.314 12 30 16.686 30 24C30 31.314 27.314 36 24 36C30.627 36 36 30.627 36 24C36 17.373 30.627 12 24 12Z" fill="#C9A84C" opacity="0.75"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// STARS — pure CSS, no blinking keyframe on text
// ─────────────────────────────────────────────────────────────
const Stars = () => {
  const stars = React.useMemo(() =>
    [...Array(70)].map((_, i) => ({
      size: 0.5 + (i * 7919 % 100) / 50,
      x:    (i * 6271 % 10000) / 100,
      y:    (i * 3571 % 7000) / 100,
      delay:(i * 1327 % 800) / 100,
      dur:  3 + (i * 2311 % 500) / 100,
      gold: i % 9 === 0,
    })), [])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: '50%',
          background: s.gold ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.8)',
          animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          willChange: 'opacity, transform',
        }}/>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CLOCK DIGIT — Apple SF-style flip card
// ─────────────────────────────────────────────────────────────
const ClockSegment = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: 'clamp(10px,2vw,16px) clamp(14px,3vw,24px)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 60px rgba(0,0,0,0.5)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle inner highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      }}/>
      <span style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        fontSize: 'clamp(52px, 11vw, 100px)',
        fontWeight: 300,
        color: '#ffffff',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        display: 'block',
        textShadow: '0 0 80px rgba(201,168,76,0.3)',
      }}>{value}</span>
    </div>
    <span style={{
      fontSize: '9px', letterSpacing: '0.3em',
      color: 'rgba(255,255,255,0.2)',
      textTransform: 'uppercase',
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeight: 500,
    }}>{label}</span>
  </div>
)

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function PrayerPage() {
  const [now, setNow] = useState<Date | null>(null)
  const [tableOpen, setTableOpen] = useState(false)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setNow(getWAT())
    const t = setInterval(() => setNow(getWAT()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 100)
    const t2 = setTimeout(() => setSectionsVisible(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => { setQuoteIdx(p => (p + 1) % QUOTES.length); setQuoteFade(true) }, 600)
    }, 30000)
    return () => clearInterval(t)
  }, [])

  if (!now) return (
    <div style={{ minHeight: '100vh', background: '#010810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ animation: 'gentlePulse 2s ease-in-out infinite' }}>
        <CrescentMoon size={52}/>
      </div>
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
    key: string; en: string; ar: string; emoji: string; desc: string
    time: string; dateObj: Date; status: 'passed' | 'next' | 'upcoming'
  }> = []
  let nextPrayer: typeof prayerList[0] | null = null
  let timeToNext = 0
  let progressPct = 0
  let skySlot = 'night'

  if (todayData) {
    const tomorrowDate = new Date(now); tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    const tomorrowStr = getTodayStr(tomorrowDate)
    const tomorrowData = PRAYER_TIMES.find(p => p.date === tomorrowStr)
    let lastPassed: Date = new Date(now); lastPassed.setHours(0,0,0,0)
    let foundNext = false

    prayerList = PRAYER_META.map(meta => {
      const time = (todayData as any)[meta.key] as string
      const dateObj = parseTime(time, now)
      let status: 'passed' | 'next' | 'upcoming' = 'upcoming'

      if (dateObj < now) {
        status = 'passed'
        lastPassed = dateObj
        skySlot = meta.key
      } else if (!foundNext) {
        status = 'next'
        foundNext = true
        nextPrayer = { ...meta, time, dateObj, status }
        timeToNext = dateObj.getTime() - now.getTime()
        const total = dateObj.getTime() - lastPassed.getTime()
        const elapsed = now.getTime() - lastPassed.getTime()
        progressPct = Math.min(100, Math.max(0, (elapsed / total) * 100))
      }
      return { ...meta, time, dateObj, status }
    })

    if (!foundNext && tomorrowData) {
      skySlot = 'isha'
      const tmrFajrDate = parseTime(tomorrowData.fajr, tomorrowDate)
      nextPrayer = { ...PRAYER_META[0], time: tomorrowData.fajr, dateObj: tmrFajrDate, status: 'next' }
      timeToNext = tmrFajrDate.getTime() - now.getTime()
      const ishaDate = parseTime(todayData.isha, now)
      const total = tmrFajrDate.getTime() - ishaDate.getTime()
      const elapsed = now.getTime() - ishaDate.getTime()
      progressPct = Math.min(100, Math.max(0, (elapsed / total) * 100))
    }

    if (!foundNext && !tomorrowData) skySlot = 'pre-fajr'

    const hourNow = now.getHours()
    if (!todayData || hourNow < parseInt(todayData.fajr)) skySlot = 'pre-fajr'
  }

  const sky = getSkyColors(skySlot)

  // ── Suhoor / Iftar countdown ──
  let suhoorMs = 0, iftarMs = 0
  if (todayData) {
    suhoorMs = parseTime(todayData.fajr, now).getTime() - now.getTime()
    iftarMs = parseTime(todayData.maghrib, now).getTime() - now.getTime()
  }
  const showSuhoorCountdown = suhoorMs > 0 && suhoorMs < 30 * 60 * 1000
  const showIftarCountdown = iftarMs > 0 && iftarMs < 60 * 60 * 1000
  const countdown = fmtMs(timeToNext)

  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // ── Arc path for SVG progress ring ──
  const arcR = 54
  const arcC = 64
  const arcCircumference = 2 * Math.PI * arcR
  const arcDash = (progressPct / 100) * arcCircumference

  const NAV_LINKS = [
    { label: 'Home',    href: 'https://www.ramadanbot.app' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${sky.accent} 0%, transparent 60%), linear-gradient(160deg, ${sky.from} 0%, ${sky.via} 55%, ${sky.to} 100%)`,
      color: 'white',
      overflowX: 'hidden',
      transition: 'background 4s cubic-bezier(0.4,0,0.2,1)',
    }}>

      {/* ── Global CSS ── */}
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&family=Scheherazade+New:wght@400;500;700&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(201,168,76,0.25); color: #fff; }
        body { overflow-x: hidden; }
        html { scroll-behavior: smooth; }

        .font-display  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-mono     { font-family: 'JetBrains Mono', 'DM Mono', monospace; }
        .font-arabic   { font-family: 'Scheherazade New', serif; }
        .font-body     { font-family: 'Inter', system-ui, sans-serif; }

        /* ── Keyframes — NO blinking ── */
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.9;  transform: scale(1.5); }
        }
        @keyframes colonPulse {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 0.2; }
        }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes gentlePulse { 0%,100% { opacity:0.6; transform:scale(1);   }  50% { opacity:1; transform:scale(1.06); } }
        @keyframes breatheGold { 0%,100% { box-shadow:0 0 40px rgba(201,168,76,0.08),0 8px 32px rgba(0,0,0,0.4); } 50% { box-shadow:0 0 80px rgba(201,168,76,0.18),0 8px 48px rgba(0,0,0,0.5); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes spinSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulseDot { 0%,100% { transform:scale(1);   opacity:1;   } 50% { transform:scale(1.6); opacity:0.5; } }
        @keyframes slideIn  { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes progressArc { from { stroke-dasharray:0 340; } to { } }
        @keyframes navSlide { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tableReveal { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .gold-shimmer {
          background: linear-gradient(90deg, #C9A84C 0%, #f5dc90 35%, #e8c860 50%, #C9A84C 65%, #9a6e28 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        .glass-panel {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
        }

        .glass-gold {
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.22);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          animation: breatheGold 5s ease-in-out infinite;
        }

        .no-scroll::-webkit-scrollbar { display:none; }
        .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }

        .prayer-row-next {
          position: relative;
        }
        .prayer-row-next::before {
          content:'';
          position:absolute;
          inset:-1px;
          border-radius:18px;
          padding:1px;
          background:linear-gradient(135deg, rgba(201,168,76,0.7) 0%, rgba(201,168,76,0.12) 50%, rgba(201,168,76,0.55) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events:none;
        }

        .section-reveal {
          opacity:0;
          transform:translateY(24px);
          transition:opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .section-reveal.visible { opacity:1; transform:translateY(0); }

        .nav-link {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.22s ease;
          padding: 4px 0;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 100%;
          height: 1px;
          background: rgba(201,168,76,0.7);
          transition: right 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover { color: rgba(255,255,255,0.95); }
        .nav-link:hover::after { right: 0; }

        .tbl-row:hover { background: rgba(255,255,255,0.025) !important; }

        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}}/>

      {/* ── Stars ── */}
      <Stars />

      {/* ── Islamic pattern overlay ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <IslamicPattern />
      </div>

      {/* ══════════════════════════════════════════════════════════
          NAVIGATION — Apple-style frosted glass bar
      ══════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        padding: '0 clamp(16px, 4vw, 48px)',
        height: '52px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        animation: 'navSlide 0.5s ease both',
      }}>
        {/* Logo / Brand */}
        <a href="https://www.ramadanbot.app" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="RamadanBot"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <CrescentMoon size={22}/>
          <span className="font-display" style={{
            fontSize: '17px', fontWeight: 600,
            color: '#C9A84C', letterSpacing: '0.015em',
            lineHeight: 1,
          }}>RamadanBot</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>

        {/* Location pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px', borderRadius: '999px',
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.18)',
          }}>
            <MapPin size={11} style={{ color: 'rgba(201,168,76,0.8)', flexShrink: 0 }}/>
            <span className="font-body" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>
              Damaturu, Yobe
            </span>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '6px 8px',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {mobileMenuOpen
                ? <><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
                : <><line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
              }
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      {mobileMenuOpen && (
        <div style={{
          position: 'sticky', top: '52px', zIndex: 199,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
          animation: 'fadeUp 0.25s ease both',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link" style={{ fontSize: '15px' }}
               onClick={() => setMobileMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          HERO — Full viewport
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(48px,8vh,80px) clamp(20px,5vw,48px)',
        position: 'relative',
        textAlign: 'center',
      }}>

        {/* Ramadan day badge */}
        {!isOutOfRamadan && ramadanDay && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '7px 18px', borderRadius: '999px',
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.28)',
            marginBottom: '36px',
            animation: heroVisible ? 'fadeUp 0.7s 0.05s ease both' : 'none',
            opacity: heroVisible ? undefined : 0,
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C', animation: 'pulseDot 2.5s ease-in-out infinite' }}/>
            <span className="font-body" style={{
              fontSize: '10px', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'rgba(201,168,76,0.9)', fontWeight: 500,
            }}>
              Ramadan Day {ramadanDay} of 30 &nbsp;·&nbsp; 1447 AH
            </span>
          </div>
        )}

        {/* Date + Hijri */}
        <div style={{
          marginBottom: '52px',
          animation: heroVisible ? 'fadeUp 0.7s 0.15s ease both' : 'none',
          opacity: heroVisible ? undefined : 0,
        }}>
          <p className="font-display" style={{
            fontSize: 'clamp(17px, 2.5vw, 22px)',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 300,
            letterSpacing: '0.015em',
          }}>{dateLabel}</p>
          <p className="font-arabic" style={{
            fontSize: '15px', color: 'rgba(201,168,76,0.55)',
            marginTop: '6px', letterSpacing: '0.02em',
          }}>{hijri}</p>
        </div>

        {/* ── LIVE CLOCK ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          gap: 'clamp(4px, 1.5vw, 12px)',
          marginBottom: '64px',
          animation: heroVisible ? 'fadeUp 0.8s 0.25s ease both' : 'none',
          opacity: heroVisible ? undefined : 0,
        }}>
          <ClockSegment value={H} label="HRS" />
          {/* Non-blinking colon — smooth fade */}
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(44px, 9vw, 90px)',
            color: 'rgba(201,168,76,0.35)',
            lineHeight: 1,
            marginBottom: 'clamp(28px,5vw,44px)',
            fontWeight: 300,
            animation: 'colonPulse 2s ease-in-out infinite',
            display: 'block',
          }}>:</span>
          <ClockSegment value={M} label="MIN" />
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(44px, 9vw, 90px)',
            color: 'rgba(201,168,76,0.35)',
            lineHeight: 1,
            marginBottom: 'clamp(28px,5vw,44px)',
            fontWeight: 300,
            animation: 'colonPulse 2s 1s ease-in-out infinite',
            display: 'block',
          }}>:</span>
          <ClockSegment value={S} label="SEC" />
        </div>

        {/* ── NEXT PRAYER + COUNTDOWN ── */}
        {nextPrayer && (
          <div style={{
            animation: heroVisible ? 'fadeUp 0.9s 0.4s ease both' : 'none',
            opacity: heroVisible ? undefined : 0,
            width: '100%', maxWidth: '540px',
          }}>
            <div style={{ position: 'relative' }}>
              {/* Ghost watermark */}
              <div className="font-display" style={{
                fontSize: 'clamp(72px, 18vw, 140px)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(201,168,76,0.07)',
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                userSelect: 'none',
                pointerEvents: 'none',
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                width: '200%',
              }}>{nextPrayer.en}</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="font-body" style={{
                  fontSize: '10px', letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase', marginBottom: '14px',
                }}>Next Prayer</p>

                <div style={{
                  display: 'flex', alignItems: 'baseline',
                  justifyContent: 'center', gap: '14px', marginBottom: '28px',
                }}>
                  <span className="font-display" style={{
                    fontSize: 'clamp(30px,6vw,46px)',
                    fontWeight: 600, color: 'white',
                    letterSpacing: '-0.01em',
                  }}>{nextPrayer.en}</span>
                  <span className="font-arabic" style={{
                    fontSize: 'clamp(22px,4vw,34px)',
                    color: 'rgba(201,168,76,0.65)',
                  }}>{nextPrayer.ar}</span>
                </div>

                {/* SVG progress ring */}
                <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
                  <svg width="136" height="136" viewBox="0 0 128 128" style={{ display: 'block' }}>
                    <circle cx={arcC} cy={arcC} r={arcR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5"/>
                    <circle
                      cx={arcC} cy={arcC} r={arcR}
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${arcDash} ${arcCircumference - arcDash}`}
                      strokeDashoffset={arcCircumference * 0.25}
                      style={{ filter: 'drop-shadow(0 0 5px rgba(201,168,76,0.6))', transition: 'stroke-dasharray 1s linear' }}
                    />
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9a6e28"/>
                        <stop offset="50%" stopColor="#C9A84C"/>
                        <stop offset="100%" stopColor="#f5dc90"/>
                      </linearGradient>
                    </defs>
                    <circle
                      cx={arcC + arcR * Math.cos(2 * Math.PI * (progressPct / 100) - Math.PI / 2)}
                      cy={arcC + arcR * Math.sin(2 * Math.PI * (progressPct / 100) - Math.PI / 2)}
                      r="4" fill="#C9A84C"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.9))' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)', fontSize: '26px',
                  }}>{nextPrayer.emoji}</div>
                </div>

                {/* Countdown */}
                <div style={{
                  display: 'flex', alignItems: 'baseline',
                  justifyContent: 'center', gap: '2px', marginTop: '24px',
                }}>
                  {[{ v: countdown.h, l: 'h' }, { v: countdown.m, l: 'm' }, { v: countdown.s, l: 's' }].map((seg, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="font-mono" style={{
                        fontSize: 'clamp(18px,3.5vw,30px)',
                        color: 'rgba(255,255,255,0.15)', margin: '0 3px',
                      }}>:</span>}
                      <span>
                        <span className="font-mono gold-shimmer" style={{
                          fontSize: 'clamp(26px,5.5vw,50px)',
                          fontWeight: 400, letterSpacing: '-0.02em',
                        }}>{seg.v}</span>
                        <span className="font-body" style={{
                          fontSize: '9px', color: 'rgba(255,255,255,0.25)',
                          marginLeft: '2px', letterSpacing: '0.1em',
                        }}>{seg.l}</span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <p className="font-mono" style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.25)',
                  marginTop: '12px', letterSpacing: '0.08em',
                }}>
                  at {fmt12(nextPrayer.time)}
                  {!prayerList.find(p => p.status === 'next') ? ' · Tomorrow' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          animation: heroVisible ? 'fadeIn 1.2s 1.8s ease both' : 'none',
          opacity: 0,
        }}>
          <span className="font-body" style={{
            fontSize: '9px', letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase',
          }}>Scroll</span>
          <div style={{
            width: '1px', height: '36px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.35), transparent)',
          }}/>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTENT — below the fold
      ══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 clamp(16px,4vw,32px) 100px' }}>

        {isOutOfRamadan ? (
          <div className="glass-panel" style={{
            borderRadius: '28px', padding: 'clamp(36px,6vw,60px)',
            textAlign: 'center', marginBottom: '40px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
            <CrescentMoon size={56}/>
            <h2 className="font-display" style={{
              fontSize: 'clamp(26px,5vw,38px)', color: '#C9A84C',
              margin: '20px 0 12px', fontWeight: 600,
            }}>Ramadan 1447 AH</h2>
            <p className="font-body" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
              February 18, 2026 — March 19, 2026
            </p>
          </div>
        ) : (
          <>
            {/* ── SUHOOR + IFTAR ── */}
            <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '0ms', marginBottom: '20px' }}>
              <p className="font-body" style={{
                fontSize: '10px', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                marginBottom: '14px', textAlign: 'center',
              }}>Today's Fasting</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

                {/* Suhoor */}
                <div style={{
                  borderRadius: '22px', padding: 'clamp(20px,3vw,28px)',
                  position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(12,10,32,0.92) 0%, rgba(36,32,80,0.85) 100%)',
                  border: '1px solid rgba(110,90,200,0.22)',
                  boxShadow: showSuhoorCountdown
                    ? '0 0 40px rgba(160,100,255,0.12), 0 16px 40px rgba(0,0,0,0.4)'
                    : '0 16px 40px rgba(0,0,0,0.35)',
                  transition: 'box-shadow 0.6s ease',
                }}>
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    width: '90px', height: '90px',
                    background: 'radial-gradient(circle, rgba(100,70,220,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}/>
                  <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="font-body" style={{
                        fontSize: '9px', letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'rgba(180,155,255,0.55)', marginBottom: '6px',
                      }}>Suhoor</p>
                      <p className="font-arabic" style={{ fontSize: '20px', color: 'rgba(200,180,255,0.8)', direction: 'rtl' }}>سحور</p>
                    </div>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(100,70,220,0.15)', border: '1px solid rgba(100,70,220,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>🌙</div>
                  </div>
                  {showSuhoorCountdown ? (
                    <div>
                      <p className="font-mono" style={{ fontSize: '22px', color: '#ff9068', fontWeight: 400, letterSpacing: '-0.01em' }}>
                        -{fmtMs(suhoorMs).m}:{fmtMs(suhoorMs).s}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,144,104,0.55)', marginTop: '4px' }}>Suhoor ends soon</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-mono" style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)', fontWeight: 300, letterSpacing: '-0.02em' }}>
                        {todayData ? fmt12(todayData.fajr) : '--:--'}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>End of Suhoor</p>
                    </div>
                  )}
                </div>

                {/* Iftar */}
                <div style={{
                  borderRadius: '22px', padding: 'clamp(20px,3vw,28px)',
                  position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(20,6,0,0.95) 0%, rgba(52,18,5,0.9) 100%)',
                  border: showIftarCountdown
                    ? '1px solid rgba(201,168,76,0.45)'
                    : '1px solid rgba(180,90,20,0.2)',
                  boxShadow: showIftarCountdown
                    ? '0 0 50px rgba(201,168,76,0.15), 0 16px 40px rgba(0,0,0,0.4)'
                    : '0 16px 40px rgba(0,0,0,0.35)',
                  transition: 'all 0.6s ease',
                }}>
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    width: '90px', height: '90px',
                    background: 'radial-gradient(circle, rgba(255,120,25,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}/>
                  <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="font-body" style={{
                        fontSize: '9px', letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'rgba(255,180,80,0.55)', marginBottom: '6px',
                      }}>Iftar</p>
                      <p className="font-arabic" style={{ fontSize: '20px', color: 'rgba(255,200,100,0.8)', direction: 'rtl' }}>إفطار</p>
                    </div>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(255,120,25,0.12)', border: '1px solid rgba(255,120,25,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>🌅</div>
                  </div>
                  {showIftarCountdown ? (
                    <div>
                      <p className="font-mono gold-shimmer" style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.01em' }}>
                        -{fmtMs(iftarMs).h}:{fmtMs(iftarMs).m}:{fmtMs(iftarMs).s}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(201,168,76,0.55)', marginTop: '4px' }}>Iftar approaching</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-mono" style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)', fontWeight: 300, letterSpacing: '-0.02em' }}>
                        {todayData ? fmt12(todayData.maghrib) : '--:--'}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>Iftar Time</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── PRAYER TIMELINE ── */}
            <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '80ms', marginBottom: '20px' }}>
              <p className="font-body" style={{
                fontSize: '10px', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                marginBottom: '16px', textAlign: 'center',
              }}>Today's Prayers</p>

              <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', padding: '8px' }}>
                {/* Vertical connector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '27px', top: '24px', bottom: '24px',
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), rgba(201,168,76,0.08), transparent)',
                  }}/>

                  {prayerList.map((p, i) => (
                    <div
                      key={p.key}
                      className={p.status === 'next' ? 'prayer-row-next' : ''}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '16px',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        background: p.status === 'next'
                          ? 'rgba(201,168,76,0.065)'
                          : p.status === 'passed'
                            ? 'rgba(255,255,255,0.015)'
                            : 'rgba(255,255,255,0.022)',
                        opacity: p.status === 'passed' ? 0.42 : 1,
                        animation: sectionsVisible ? `slideIn 0.5s ${i * 55}ms ease both` : 'none',
                        boxShadow: p.status === 'next' ? '0 4px 30px rgba(201,168,76,0.07)' : 'none',
                      }}>

                      {/* Timeline node */}
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: p.status === 'next'
                          ? 'rgba(201,168,76,0.18)'
                          : 'rgba(255,255,255,0.04)',
                        border: p.status === 'next'
                          ? '1px solid rgba(201,168,76,0.45)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: p.status === 'next' ? '0 0 14px rgba(201,168,76,0.35)' : 'none',
                        fontSize: '12px', zIndex: 1,
                      }}>
                        {p.status === 'passed'
                          ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : p.emoji}
                      </div>

                      {/* Prayer info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span className="font-display" style={{
                            fontSize: '16px',
                            fontWeight: p.status === 'next' ? 600 : 400,
                            color: p.status === 'next' ? 'white' : 'rgba(255,255,255,0.6)',
                          }}>{p.en}</span>
                          <span className="font-arabic" style={{
                            fontSize: '13px',
                            color: p.status === 'next' ? 'rgba(201,168,76,0.75)' : 'rgba(255,255,255,0.2)',
                          }}>{p.ar}</span>
                        </div>
                        <p className="font-body" style={{
                          fontSize: '10px', color: 'rgba(255,255,255,0.18)', marginTop: '1px',
                        }}>{p.desc}</p>
                      </div>

                      {/* Time + badge */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p className="font-mono" style={{
                          fontSize: '15px', fontWeight: 400,
                          color: p.status === 'next' ? '#C9A84C'
                               : p.status === 'passed' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.65)',
                          textDecoration: p.status === 'passed' ? 'line-through' : 'none',
                          textShadow: p.status === 'next' ? '0 0 24px rgba(201,168,76,0.45)' : 'none',
                          letterSpacing: '0.01em',
                        }}>{fmt12(p.time)}</p>
                        {p.status === 'next' && (
                          <span style={{
                            fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase',
                            background: '#C9A84C', color: '#080401',
                            padding: '2px 7px', borderRadius: '4px', fontWeight: 700,
                            display: 'inline-block', marginTop: '4px',
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}>NEXT</span>
                        )}
                        {p.status === 'passed' && (
                          <span style={{
                            fontSize: '8px', color: 'rgba(255,255,255,0.18)',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            display: 'block', marginTop: '4px',
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}>Done</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── QUOTE SECTION ── */}
        <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '160ms', marginBottom: '20px' }}>
          <div style={{
            borderRadius: '24px',
            padding: 'clamp(28px,4vw,40px)',
            background: 'linear-gradient(145deg, rgba(6,24,14,0.88) 0%, rgba(3,16,10,0.94) 100%)',
            border: '1px solid rgba(40,100,60,0.2)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {/* Decorative motif */}
            <div style={{ position: 'absolute', top: '-28px', right: '-28px', opacity: 0.04, pointerEvents: 'none' }}>
              <CrescentMoon size={140}/>
            </div>

            <div style={{ transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)', opacity: quoteFade ? 1 : 0 }}>
              <p className="font-arabic" style={{
                fontSize: 'clamp(18px, 3.5vw, 26px)',
                direction: 'rtl', textAlign: 'right',
                color: 'rgba(90,200,140,0.88)',
                lineHeight: 1.8,
                marginBottom: '22px',
              }}>{QUOTES[quoteIdx].ar}</p>

              <div style={{ borderTop: '1px solid rgba(40,100,60,0.18)', paddingTop: '18px' }}>
                <p className="font-display" style={{
                  fontSize: '14px', fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '10px',
                }}>"{QUOTES[quoteIdx].en}"</p>
                <p className="font-body" style={{
                  fontSize: '10px', color: 'rgba(80,170,110,0.45)',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>— {QUOTES[quoteIdx].src}</p>
              </div>
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '22px' }}>
              {QUOTES.map((_, i) => (
                <div key={i}
                  onClick={() => { setQuoteFade(false); setTimeout(() => { setQuoteIdx(i); setQuoteFade(true) }, 300) }}
                  style={{
                    width: i === quoteIdx ? '22px' : '5px', height: '5px',
                    borderRadius: '3px',
                    background: i === quoteIdx ? 'rgba(90,200,140,0.75)' : 'rgba(40,100,60,0.3)',
                    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                    cursor: 'pointer',
                  }}/>
              ))}
            </div>
          </div>
        </div>

        {/* ── FULL TIMETABLE ── */}
        <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '240ms', marginBottom: '20px' }}>
          <button
            onClick={() => setTableOpen(!tableOpen)}
            style={{
              width: '100%', padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.028)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.45)',
              fontSize: '12px', letterSpacing: '0.1em',
              cursor: 'pointer', transition: 'all 0.25s ease',
              fontFamily: "'Inter', system-ui, sans-serif",
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.055)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.2)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,168,76,0.8)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.028)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
              <line x1="4" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="4" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span>{tableOpen ? 'Hide' : 'View'} Full Ramadan Timetable</span>
            {tableOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>

          {tableOpen && (
            <div style={{
              marginTop: '10px', borderRadius: '22px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(2,5,14,0.96)',
              animation: 'tableReveal 0.4s cubic-bezier(0.4,0,0.2,1) both',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}>
              <div className="no-scroll" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Day', 'Date', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((h, i) => (
                        <th key={h} style={{
                          padding: '13px 14px', textAlign: 'center', fontWeight: 500,
                          color: i === 2 ? 'rgba(201,168,76,0.7)'
                               : i === 6 ? 'rgba(255,160,80,0.6)' : 'rgba(255,255,255,0.28)',
                          letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '9px',
                          fontFamily: "'Inter', system-ui, sans-serif",
                          position: i === 0 ? 'sticky' : undefined,
                          left: i === 0 ? 0 : undefined,
                          background: i === 0 ? 'rgba(2,5,14,0.98)' : undefined,
                          zIndex: i === 0 ? 2 : undefined,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRAYER_TIMES.map(row => {
                      const isToday = row.date === todayStr
                      const isPassed = row.date < todayStr
                      return (
                        <tr
                          key={row.day}
                          className="tbl-row"
                          style={{
                            background: isToday ? 'rgba(201,168,76,0.065)' : 'transparent',
                            opacity: isPassed ? 0.32 : 1,
                            borderBottom: '1px solid rgba(255,255,255,0.035)',
                            transition: 'background 0.2s',
                          }}>
                          <td style={{
                            padding: '11px 14px', textAlign: 'center',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: isToday ? 600 : 400,
                            color: isToday ? '#C9A84C' : 'rgba(255,255,255,0.3)',
                            borderLeft: isToday ? '2px solid rgba(201,168,76,0.6)' : '2px solid transparent',
                            position: 'sticky', left: 0,
                            background: isToday ? 'rgba(16,10,2,0.98)' : 'rgba(2,5,14,0.98)',
                            zIndex: 1,
                          }}>{row.day}</td>
                          <td style={{
                            padding: '11px 14px', textAlign: 'center',
                            color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap',
                            fontFamily: "'Inter', system-ui, sans-serif", fontSize: '10px',
                          }}>
                            {new Date(row.date + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            <span style={{ opacity: 0.35, fontSize: '9px', marginLeft: '4px' }}>{row.weekday}</span>
                          </td>
                          {(['fajr','sunrise','dhuhr','asr','maghrib','isha'] as const).map(k => (
                            <td key={k} style={{
                              padding: '11px 14px', textAlign: 'center',
                              fontFamily: "'JetBrains Mono', monospace",
                              color: k === 'fajr' ? (isToday ? '#C9A84C' : 'rgba(180,148,70,0.65)')
                                   : k === 'maghrib' ? (isToday ? '#f0a860' : 'rgba(235,160,88,0.55)')
                                   : k === 'sunrise' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.55)',
                              fontWeight: (k === 'fajr' || k === 'maghrib') && isToday ? 500 : 300,
                            }}>{row[k]}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{
                padding: '12px 20px', textAlign: 'center',
                background: 'rgba(255,255,255,0.015)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Source · Supreme Council for Islamic Affairs, Nigeria
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{
          transitionDelay: '320ms',
          textAlign: 'center',
          padding: 'clamp(40px,6vw,64px) 0 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Nav links row */}
          <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(16px,4vw,36px)', marginBottom: '28px', flexWrap: 'wrap',
          }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                transition: 'color 0.22s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(201,168,76,0.8)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)'}
              >{l.label}</a>
            ))}
          </nav>

          {/* Logo + brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <img
              src="/logo.png"
              alt="RamadanBot logo"
              style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 0.7 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <CrescentMoon size={22}/>
            <span className="font-display" style={{ fontSize: '16px', color: 'rgba(201,168,76,0.6)', fontWeight: 400, letterSpacing: '0.04em' }}>
              RamadanBot
            </span>
          </div>

          <p className="font-body" style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.18)',
            letterSpacing: '0.06em', marginBottom: '4px',
          }}>
            Damaturu, Yobe, Nigeria · Ramadan 1447 AH
          </p>
          <p className="font-body" style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.14)',
            letterSpacing: '0.04em', marginBottom: '24px',
          }}>
            Times · Supreme Council for Islamic Affairs, Nigeria
          </p>

          {/* Signature attribution */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '999px',
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.1)',
          }}>
            <span style={{ fontSize: '14px' }}>🤍</span>
            <span className="font-body" style={{
              fontSize: '11px', color: 'rgba(201,168,76,0.55)',
              letterSpacing: '0.04em',
            }}>
              Built with love for the Ummah by <span style={{ color: 'rgba(201,168,76,0.8)', fontWeight: 500 }}>Abdallah Nangere</span>
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
