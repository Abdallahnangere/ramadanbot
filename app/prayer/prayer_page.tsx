'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react'

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
  { key: 'fajr',    en: 'Fajr',    ar: 'الفجر',   emoji: '🌙', desc: 'Dawn Prayer' },
  { key: 'sunrise', en: 'Sunrise', ar: 'الشروق',  emoji: '🌅', desc: 'Sun rises' },
  { key: 'dhuhr',   en: 'Dhuhr',   ar: 'الظهر',   emoji: '☀️', desc: 'Midday Prayer' },
  { key: 'asr',     en: 'Asr',     ar: 'العصر',   emoji: '🌤️', desc: 'Afternoon Prayer' },
  { key: 'maghrib', en: 'Maghrib', ar: 'المغرب',  emoji: '🌇', desc: 'Sunset Prayer' },
  { key: 'isha',    en: 'Isha',    ar: 'العشاء',   emoji: '🌃', desc: 'Night Prayer' },
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
  if (day >= 1 && day <= 30) return `${day} Ramadan 1447 AH`
  try {
    return wat.toLocaleDateString('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
}

// Sky palette: changes based on which prayer period we're currently in
const getSkyColors = (slot: string): { from: string; via: string; to: string; accent: string } => {
  switch(slot) {
    case 'pre-fajr':  return { from: '#020510', via: '#070a1e', to: '#0c0e2a', accent: 'rgba(100,80,200,0.12)' }
    case 'fajr':      return { from: '#0a0520', via: '#1a0d3a', to: '#240e52', accent: 'rgba(180,100,255,0.10)' }
    case 'sunrise':   return { from: '#150c05', via: '#251208', to: '#120813', accent: 'rgba(255,150,50,0.08)' }
    case 'dhuhr':     return { from: '#020d1f', via: '#041628', to: '#061e32', accent: 'rgba(100,180,255,0.06)' }
    case 'asr':       return { from: '#030e1a', via: '#061522', to: '#081c2e', accent: 'rgba(80,160,220,0.07)' }
    case 'maghrib':   return { from: '#1a0800', via: '#2a0e08', to: '#150508', accent: 'rgba(255,120,30,0.12)' }
    case 'isha':      return { from: '#020610', via: '#060815', to: '#04050e', accent: 'rgba(80,100,200,0.08)' }
    default:          return { from: '#020915', via: '#040c1e', to: '#060e24', accent: 'rgba(201,168,76,0.06)' }
  }
}

// ─────────────────────────────────────────────────────────────
// SVG ISLAMIC PATTERN (inline, pure CSS, no external assets)
// ─────────────────────────────────────────────────────────────
const IslamicPattern = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.025 }}>
    <defs>
      <pattern id="islamic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <polygon points="30,2 57,17 57,43 30,58 3,43 3,17" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
        <polygon points="30,10 50,22 50,38 30,50 10,38 10,22" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
        <line x1="30" y1="2" x2="30" y2="58" stroke="#C9A84C" strokeWidth="0.3" opacity="0.5"/>
        <line x1="3" y1="17" x2="57" y2="43" stroke="#C9A84C" strokeWidth="0.3" opacity="0.5"/>
        <line x1="57" y1="17" x2="3" y2="43" stroke="#C9A84C" strokeWidth="0.3" opacity="0.5"/>
        <circle cx="30" cy="30" r="3" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
        <circle cx="30" cy="30" r="1" fill="#C9A84C" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic)"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// CRESCENT SVG
// ─────────────────────────────────────────────────────────────
const CrescentMoon = ({ size = 48, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M36 24C36 30.627 30.627 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C20.686 12 18 16.686 18 24C18 31.314 20.686 36 24 36" fill="#C9A84C" opacity="0.9"/>
    <path d="M24 12C27.314 12 30 16.686 30 24C30 31.314 27.314 36 24 36C30.627 36 36 30.627 36 24C36 17.373 30.627 12 24 12Z" fill="#C9A84C" opacity="0.7"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────
// ANIMATED STARS BACKGROUND
// ─────────────────────────────────────────────────────────────
const Stars = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[...Array(60)].map((_, i) => {
      const size = Math.random() * 2 + 0.5
      const x = Math.random() * 100
      const y = Math.random() * 70
      const delay = Math.random() * 8
      const dur = 3 + Math.random() * 5
      return (
        <div key={i} style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: i % 7 === 0 ? 'rgba(201,168,76,0.8)' : 'rgba(255,255,255,0.7)',
          animation: `twinkle ${dur}s ${delay}s ease-in-out infinite`,
        }}/>
      )
    })}
  </div>
)

// ─────────────────────────────────────────────────────────────
// CLOCK DIGIT with flip-style visual weight
// ─────────────────────────────────────────────────────────────
const ClockSegment = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: '12px',
      padding: '12px 18px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 40px rgba(201,168,76,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
        fontSize: 'clamp(44px, 10vw, 88px)',
        fontWeight: 500,
        color: '#C9A84C',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        textShadow: '0 0 60px rgba(201,168,76,0.6), 0 0 120px rgba(201,168,76,0.2)',
        display: 'block',
      }}>{value}</span>
    </div>
    <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{label}</span>
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
    <div style={{ minHeight: '100vh', background: '#020915', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CrescentMoon size={48} className="" />
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

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: `radial-gradient(ellipse at 50% -10%, ${sky.accent} 0%, transparent 55%), linear-gradient(180deg, ${sky.from} 0%, ${sky.via} 50%, ${sky.to} 100%)`,
      color: 'white',
      overflowX: 'hidden',
      transition: 'background 3s ease',
    }}>

      {/* ── Global CSS ── */}
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&family=Scheherazade+New:wght@400;500;700&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::selection { background: rgba(201,168,76,0.3); color: #fff; }

        body { overflow-x: hidden; }

        .font-display  { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-mono     { font-family: 'JetBrains Mono', 'DM Mono', monospace; }
        .font-arabic   { font-family: 'Scheherazade New', serif; }
        .font-body     { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes blink   { 50% { opacity: 0; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes breathe { 0%,100% { box-shadow: 0 0 30px rgba(201,168,76,0.15), 0 0 80px rgba(201,168,76,0.05); } 50% { box-shadow: 0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseDot { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.5); opacity:0.6; } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }

        .gold-shimmer {
          background: linear-gradient(90deg, #C9A84C 0%, #f0d080 40%, #C9A84C 60%, #a07030 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .glass-gold {
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.25);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: breathe 4s ease-in-out infinite;
        }

        .no-scroll::-webkit-scrollbar { display:none; }
        .no-scroll { -ms-overflow-style:none; scrollbar-width:none; }

        .prayer-card-next::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 17px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(201,168,76,0.8), rgba(201,168,76,0.2), rgba(201,168,76,0.6));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
        }

        .blink { animation: blink 1s step-start infinite; }

        .section-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .section-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .hero-name { font-size: clamp(48px, 14vw, 80px) !important; }
        }
      `}}/>

      {/* ── Stars ── */}
      <Stars />

      {/* ── Islamic geometric pattern overlay ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <IslamicPattern />
      </div>

      {/* ════════════════════════════════════════════════
          STICKY HEADER
      ════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '14px 24px',
        background: 'rgba(2,9,21,0.6)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        animation: heroVisible ? 'fadeIn 0.6s ease both' : 'none',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <CrescentMoon size={28} />
          <span className="font-display" style={{ fontSize: '18px', fontWeight: 600, color: '#C9A84C', letterSpacing: '0.02em' }}>RamadanBot</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}>
            <MapPin size={12} style={{ color: '#C9A84C' }}/>
            <span className="font-body" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Damaturu, Yobe</span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          HERO — Full viewport, clock + next prayer
      ════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        textAlign: 'center',
      }}>

        {/* Ramadan day badge */}
        {!isOutOfRamadan && ramadanDay && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '8px 20px', borderRadius: '999px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.3)',
            marginBottom: '32px',
            animation: heroVisible ? 'fadeUp 0.7s 0.1s ease both' : 'none',
            opacity: heroVisible ? undefined : 0,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', animation: 'pulseDot 2s ease-in-out infinite' }}/>
            <span className="font-body" style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 500 }}>
              Ramadan Day {ramadanDay} of 30 &nbsp;·&nbsp; 1447 AH
            </span>
          </div>
        )}

        {/* Date + Hijri */}
        <div style={{
          marginBottom: '48px',
          animation: heroVisible ? 'fadeUp 0.7s 0.2s ease both' : 'none',
          opacity: heroVisible ? undefined : 0,
        }}>
          <p className="font-display" style={{ fontSize: 'clamp(18px,3vw,24px)', color: 'rgba(255,255,255,0.75)', fontWeight: 300, letterSpacing: '0.01em' }}>
            {dateLabel}
          </p>
          <p className="font-arabic" style={{ fontSize: '16px', color: 'rgba(201,168,76,0.6)', marginTop: '4px' }}>{hijri}</p>
        </div>

        {/* ── LIVE CLOCK ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 'clamp(4px,2vw,16px)',
          marginBottom: '56px',
          animation: heroVisible ? 'fadeUp 0.8s 0.3s ease both' : 'none',
          opacity: heroVisible ? undefined : 0,
        }}>
          <ClockSegment value={H} label="HRS" />
          <span className="blink" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(40px, 9vw, 80px)',
            color: 'rgba(201,168,76,0.5)',
            lineHeight: 1,
            marginBottom: '32px',
            fontWeight: 300,
          }}>:</span>
          <ClockSegment value={M} label="MIN" />
          <span className="blink" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(40px, 9vw, 80px)',
            color: 'rgba(201,168,76,0.5)',
            lineHeight: 1,
            marginBottom: '32px',
            fontWeight: 300,
          }}>:</span>
          <ClockSegment value={S} label="SEC" />
        </div>

        {/* ── NEXT PRAYER + COUNTDOWN ── */}
        {nextPrayer && (
          <div style={{
            animation: heroVisible ? 'fadeUp 0.9s 0.4s ease both' : 'none',
            opacity: heroVisible ? undefined : 0,
            width: '100%', maxWidth: '520px',
          }}>
            {/* Ghost text — next prayer name as huge faded background */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <div className="font-display hero-name" style={{
                fontSize: 'clamp(64px, 16vw, 120px)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(201,168,76,0.12)',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                userSelect: 'none',
                pointerEvents: 'none',
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                width: '200%',
              }}>{nextPrayer.en}</div>

              {/* Real content on top */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Next Prayer
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                  <span className="font-display" style={{ fontSize: 'clamp(32px,6vw,48px)', fontWeight: 600, color: 'white' }}>{nextPrayer.en}</span>
                  <span className="font-arabic" style={{ fontSize: 'clamp(24px,5vw,36px)', color: 'rgba(201,168,76,0.7)', fontWeight: 400 }}>{nextPrayer.ar}</span>
                </div>

                {/* SVG arc + countdown center */}
                <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
                  <svg width="128" height="128" viewBox="0 0 128 128" style={{ display: 'block' }}>
                    {/* Track */}
                    <circle cx={arcC} cy={arcC} r={arcR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                    {/* Progress */}
                    <circle
                      cx={arcC} cy={arcC} r={arcR}
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${arcDash} ${arcCircumference - arcDash}`}
                      strokeDashoffset={arcCircumference * 0.25}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.7))', transition: 'stroke-dasharray 1s linear' }}
                    />
                    {/* Endpoint dot */}
                    <circle
                      cx={arcC + arcR * Math.cos(2 * Math.PI * (progressPct / 100) - Math.PI / 2)}
                      cy={arcC + arcR * Math.sin(2 * Math.PI * (progressPct / 100) - Math.PI / 2)}
                      r="5" fill="#C9A84C"
                      style={{ filter: 'drop-shadow(0 0 8px #C9A84C)' }}
                    />
                  </svg>
                  {/* Next prayer emoji centered in arc */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '28px' }}>
                    {nextPrayer.emoji}
                  </div>
                </div>

                {/* HH:MM:SS countdown */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px', marginTop: '20px' }}>
                  {[{ v: countdown.h, l: 'h' }, { v: countdown.m, l: 'm' }, { v: countdown.s, l: 's' }].map((seg, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="font-mono" style={{ fontSize: 'clamp(20px,4vw,32px)', color: 'rgba(201,168,76,0.4)', margin: '0 2px' }}>:</span>}
                      <span>
                        <span className="font-mono gold-shimmer" style={{ fontSize: 'clamp(28px,6vw,52px)', fontWeight: 500, letterSpacing: '-0.02em' }}>{seg.v}</span>
                        <span className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{seg.l}</span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <p className="font-mono" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '10px', letterSpacing: '0.06em' }}>
                  at {fmt12(nextPrayer.time)}
                  {!prayerList.find(p => p.status === 'next') ? ' · Tomorrow' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          animation: heroVisible ? 'fadeIn 1s 1.5s ease both' : 'none',
          opacity: heroVisible ? undefined : 0,
        }}>
          <span className="font-body" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)' }}/>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CONTENT — below the fold
      ════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px 80px' }}>

        {isOutOfRamadan ? (
          <div className="glass" style={{ borderRadius: '24px', padding: '48px', textAlign: 'center', marginBottom: '40px' }}>
            <CrescentMoon size={56} />
            <h2 className="font-display" style={{ fontSize: '32px', color: '#C9A84C', margin: '20px 0 12px', fontWeight: 600 }}>Ramadan 1447 AH</h2>
            <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>Begins February 18, 2026 — March 19, 2026</p>
          </div>
        ) : (
          <>
            {/* ── SUHOOR + IFTAR ── */}
            <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{ transitionDelay: '0ms', marginBottom: '24px' }}>
              <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '14px', textAlign: 'center' }}>
                Today's Fasting
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                {/* Suhoor */}
                <div style={{
                  borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(15,12,41,0.9) 0%, rgba(48,43,99,0.8) 100%)',
                  border: '1px solid rgba(120,100,200,0.3)',
                  boxShadow: showSuhoorCountdown ? '0 0 30px rgba(200,100,255,0.15)' : 'none',
                  transition: 'box-shadow 0.5s',
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(100,80,200,0.3) 0%, transparent 70%)' }}/>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(180,160,255,0.6)', marginBottom: '6px' }}>Suhoor</p>
                      <p className="font-arabic" style={{ fontSize: '22px', color: 'rgba(200,180,255,0.85)', direction: 'rtl' }}>سحور</p>
                    </div>
                    <span style={{ fontSize: '24px' }}>🌙</span>
                  </div>
                  {showSuhoorCountdown ? (
                    <div>
                      <p className="font-mono" style={{ fontSize: '22px', color: '#ff8c60', fontWeight: 500, letterSpacing: '-0.01em' }}>
                        -{fmtMs(suhoorMs).m}:{fmtMs(suhoorMs).s}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,140,96,0.6)', marginTop: '4px' }}>Suhoor ends soon!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-mono" style={{ fontSize: '26px', color: 'white', fontWeight: 400, letterSpacing: '-0.01em' }}>
                        {todayData ? fmt12(todayData.fajr) : '--:--'}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>End of Suhoor</p>
                    </div>
                  )}
                </div>

                {/* Iftar */}
                <div style={{
                  borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(26,8,0,0.95) 0%, rgba(60,20,8,0.9) 100%)',
                  border: showIftarCountdown ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,100,30,0.25)',
                  boxShadow: showIftarCountdown ? '0 0 40px rgba(201,168,76,0.2)' : 'none',
                  transition: 'all 0.5s',
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(255,130,30,0.2) 0%, transparent 70%)' }}/>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,180,80,0.6)', marginBottom: '6px' }}>Iftar</p>
                      <p className="font-arabic" style={{ fontSize: '22px', color: 'rgba(255,200,100,0.85)', direction: 'rtl' }}>إفطار</p>
                    </div>
                    <span style={{ fontSize: '24px' }}>🌅</span>
                  </div>
                  {showIftarCountdown ? (
                    <div>
                      <p className="font-mono gold-shimmer" style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                        -{fmtMs(iftarMs).h}:{fmtMs(iftarMs).m}:{fmtMs(iftarMs).s}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(201,168,76,0.6)', marginTop: '4px' }}>Iftar approaching!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-mono" style={{ fontSize: '26px', color: 'white', fontWeight: 400, letterSpacing: '-0.01em' }}>
                        {todayData ? fmt12(todayData.maghrib) : '--:--'}
                      </p>
                      <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Iftar Time</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── PRAYER TIMELINE ── */}
            <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{ transitionDelay: '80ms', marginBottom: '24px' }}>
              <p className="font-body" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px', textAlign: 'center' }}>
                Today's Prayers
              </p>

              {/* Vertical timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: '31px', top: '20px', bottom: '20px',
                  width: '1px',
                  background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), rgba(201,168,76,0.1), transparent)',
                }}/>

                {prayerList.map((p, i) => (
                  <div key={p.key} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    background: p.status === 'next'
                      ? 'rgba(201,168,76,0.08)'
                      : p.status === 'passed'
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.03)',
                    border: p.status === 'next'
                      ? '1px solid rgba(201,168,76,0.35)'
                      : '1px solid rgba(255,255,255,0.06)',
                    opacity: p.status === 'passed' ? 0.45 : 1,
                    animation: sectionsVisible ? `slideIn 0.5s ${i * 60}ms ease both` : 'none',
                    boxShadow: p.status === 'next' ? '0 4px 24px rgba(201,168,76,0.08)' : 'none',
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: p.status === 'next' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                      border: p.status === 'next' ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: p.status === 'next' ? '0 0 12px rgba(201,168,76,0.4)' : 'none',
                      fontSize: '14px',
                      zIndex: 1,
                    }}>
                      {p.status === 'passed' ? '✓' : p.emoji}
                    </div>

                    {/* Prayer info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span className="font-display" style={{
                          fontSize: '17px', fontWeight: p.status === 'next' ? 600 : 400,
                          color: p.status === 'next' ? 'white' : 'rgba(255,255,255,0.65)',
                        }}>{p.en}</span>
                        <span className="font-arabic" style={{
                          fontSize: '14px',
                          color: p.status === 'next' ? 'rgba(201,168,76,0.8)' : 'rgba(255,255,255,0.25)',
                        }}>{p.ar}</span>
                      </div>
                      <p className="font-body" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '1px' }}>{p.desc}</p>
                    </div>

                    {/* Time + status */}
                    <div style={{ textAlign: 'right' }}>
                      <p className="font-mono" style={{
                        fontSize: '16px', fontWeight: 500,
                        color: p.status === 'next' ? '#C9A84C' : p.status === 'passed' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                        textDecoration: p.status === 'passed' ? 'line-through' : 'none',
                        textShadow: p.status === 'next' ? '0 0 20px rgba(201,168,76,0.5)' : 'none',
                      }}>
                        {fmt12(p.time)}
                      </p>
                      {p.status === 'next' && (
                        <span style={{
                          fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                          background: 'rgba(201,168,76,0.9)', color: '#050810',
                          padding: '2px 7px', borderRadius: '4px', fontWeight: 700,
                          display: 'inline-block', marginTop: '4px',
                        }}>NEXT</span>
                      )}
                      {p.status === 'passed' && (
                        <span style={{
                          fontSize: '9px', color: 'rgba(255,255,255,0.2)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          display: 'block', marginTop: '4px',
                        }}>Done</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── QUOTE SECTION ── */}
        <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{ transitionDelay: '160ms', marginBottom: '24px' }}>
          <div style={{
            borderRadius: '24px', padding: '32px 28px',
            background: 'linear-gradient(135deg, rgba(10,30,20,0.8) 0%, rgba(5,20,15,0.9) 100%)',
            border: '1px solid rgba(52,120,80,0.25)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative crescent */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
              <CrescentMoon size={120} />
            </div>

            <div style={{
              transition: 'opacity 0.6s ease',
              opacity: quoteFade ? 1 : 0,
            }}>
              <p className="font-arabic" style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                direction: 'rtl', textAlign: 'right',
                color: 'rgba(100,210,150,0.9)',
                lineHeight: 1.7,
                marginBottom: '20px',
              }}>{QUOTES[quoteIdx].ar}</p>

              <div style={{ borderTop: '1px solid rgba(52,120,80,0.2)', paddingTop: '16px' }}>
                <p className="font-display" style={{
                  fontSize: '15px', fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '10px',
                }}>"{QUOTES[quoteIdx].en}"</p>
                <p className="font-body" style={{ fontSize: '11px', color: 'rgba(100,180,120,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  — {QUOTES[quoteIdx].src}
                </p>
              </div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
              {QUOTES.map((_, i) => (
                <div key={i} onClick={() => { setQuoteFade(false); setTimeout(() => { setQuoteIdx(i); setQuoteFade(true) }, 300) }} style={{
                  width: i === quoteIdx ? '20px' : '6px', height: '6px',
                  borderRadius: '3px',
                  background: i === quoteIdx ? 'rgba(100,210,150,0.8)' : 'rgba(52,120,80,0.3)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* ── FULL TIMETABLE ── */}
        <div className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{ transitionDelay: '240ms', marginBottom: '24px' }}>
          <button
            onClick={() => setTableOpen(!tableOpen)}
            style={{
              width: '100%', padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '13px', letterSpacing: '0.08em',
              cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(201,168,76,0.06)'; (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <span>📅</span>
            <span>{tableOpen ? 'Hide' : 'View'} Full Ramadan Timetable</span>
            {tableOpen ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
          </button>

          {tableOpen && (
            <div style={{
              marginTop: '12px', borderRadius: '20px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(4,8,20,0.95)',
              animation: 'fadeUp 0.4s ease both',
            }}>
              <div className="no-scroll" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Day', 'Date', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((h, i) => (
                        <th key={h} style={{
                          padding: '12px 14px', textAlign: 'center', fontWeight: 500,
                          color: i === 2 ? '#C9A84C' : i === 6 ? '#f0a860' : 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '10px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          position: i === 0 ? 'sticky' : undefined,
                          left: i === 0 ? 0 : undefined,
                          background: i === 0 ? 'rgba(4,8,20,0.98)' : undefined,
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
                        <tr key={row.day} style={{
                          background: isToday ? 'rgba(201,168,76,0.08)' : 'transparent',
                          opacity: isPassed ? 0.35 : 1,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.2s',
                        }}>
                          <td style={{
                            padding: '11px 14px', textAlign: 'center',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: isToday ? 700 : 400,
                            color: isToday ? '#C9A84C' : 'rgba(255,255,255,0.35)',
                            borderLeft: isToday ? '2px solid #C9A84C' : '2px solid transparent',
                            position: 'sticky', left: 0,
                            background: isToday ? 'rgba(20,14,4,0.98)' : 'rgba(4,8,20,0.98)',
                            zIndex: 1,
                          }}>{row.day}</td>
                          <td style={{ padding: '11px 14px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {new Date(row.date + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            <span style={{ opacity: 0.4, fontSize: '10px', marginLeft: '4px' }}>{row.weekday}</span>
                          </td>
                          {(['fajr','sunrise','dhuhr','asr','maghrib','isha'] as const).map(k => (
                            <td key={k} style={{
                              padding: '11px 14px', textAlign: 'center',
                              fontFamily: "'JetBrains Mono', monospace",
                              color: k === 'fajr' ? (isToday ? '#C9A84C' : 'rgba(180,150,80,0.7)') :
                                     k === 'maghrib' ? (isToday ? '#f0a860' : 'rgba(240,168,96,0.6)') :
                                     k === 'sunrise' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)',
                              fontWeight: (k === 'fajr' || k === 'maghrib') && isToday ? 600 : 400,
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
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em',
              }}>
                Source: Supreme Council for Islamic Affairs, Nigeria
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className={`section-reveal ${sectionsVisible ? 'visible' : ''}`} style={{
          transitionDelay: '320ms',
          textAlign: 'center', padding: '32px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ marginBottom: '16px' }}><CrescentMoon size={32} /></div>
          <p className="font-display" style={{ fontSize: '16px', color: 'rgba(201,168,76,0.7)', marginBottom: '6px', fontWeight: 300, letterSpacing: '0.05em' }}>
            RamadanBot · Prayer Times
          </p>
          <p className="font-body" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginBottom: '4px' }}>
            Damaturu, Yobe, Nigeria · Ramadan 1447 AH
          </p>
          <p className="font-body" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em', marginBottom: '20px' }}>
            Times by Supreme Council for Islamic Affairs, Nigeria
          </p>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: 'rgba(201,168,76,0.6)',
            textDecoration: 'none', letterSpacing: '0.08em',
            transition: 'color 0.2s',
          }}>
            ← Back to ramadanbot.app
          </a>
        </footer>

      </div>
    </div>
  )
}
