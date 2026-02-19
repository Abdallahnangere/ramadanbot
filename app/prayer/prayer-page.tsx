'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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
  { ar: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", en: "Establish prayer and give zakah.", source: "Quran 2:43" },
  { ar: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", en: "Prayer has been decreed upon the believers at specified times.", source: "Quran 4:103" },
  { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", source: "Quran 13:28" },
  { ar: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", en: "Whoever fasts Ramadan with faith and seeking reward, his past sins will be forgiven.", source: "Bukhari & Muslim" },
  { ar: "الصَّلَوَاتُ الْخَمْسُ كَفَّارَةٌ لِمَا بَيْنَهُنَّ", en: "The five daily prayers are expiation for sins committed between them.", source: "Muslim" },
  { ar: "إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ", en: "When Ramadan arrives, the gates of Paradise are opened.", source: "Bukhari" },
  { ar: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept from us. You are the Hearing, the Knowing.", source: "Quran 2:127" },
  { ar: "مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", en: "Whoever stands in prayer during Ramadan with faith and seeking reward, his past sins will be forgiven.", source: "Bukhari & Muslim" },
]

const PRAYER_META: Record<string, { emoji: string; arabic: string; label: string }> = {
  fajr:    { emoji: '🌙', arabic: 'فجر',  label: 'Fajr' },
  sunrise: { emoji: '🌅', arabic: 'شروق', label: 'Sunrise' },
  dhuhr:   { emoji: '☀️', arabic: 'ظهر',  label: 'Dhuhr' },
  asr:     { emoji: '🌤️', arabic: 'عصر',  label: 'Asr' },
  maghrib: { emoji: '🌇', arabic: 'مغرب', label: 'Maghrib' },
  isha:    { emoji: '🌃', arabic: 'عشاء', label: 'Isha' },
}

const PRAYER_KEYS = ['fajr','sunrise','dhuhr','asr','maghrib','isha'] as const
type PrayerKey = typeof PRAYER_KEYS[number]

function getWat(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }))
}

function getTodayStr(wat: Date): string {
  return `${wat.getFullYear()}-${String(wat.getMonth()+1).padStart(2,'0')}-${String(wat.getDate()).padStart(2,'0')}`
}

function parseTime(hhmm: string, base: Date): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(base)
  d.setHours(h, m, 0, 0)
  return d
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`
}

function fmtMs(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function getHijriDate(wat: Date): string {
  const ramadanStart = new Date('2026-02-18T00:00:00+01:00')
  const dayNum = Math.floor((wat.getTime() - ramadanStart.getTime()) / 86400000) + 1
  if (dayNum >= 1 && dayNum <= 30) return `${dayNum} Ramadan 1447 AH`
  try {
    return wat.toLocaleDateString('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function getGregorianDate(wat: Date): string {
  return wat.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PrayerPage() {
  const [now, setNow] = useState<Date>(getWat())
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [colonVisible, setColonVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setNow(getWat())
      setColonVisible(v => !v)
    }, 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % QUOTES.length)
        setQuoteVisible(true)
      }, 700)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const todayStr = getTodayStr(now)
  const isRamadan = todayStr >= "2026-02-18" && todayStr <= "2026-03-19"
  const todayRow = PRAYER_TIMES.find(r => r.date === todayStr) ?? null
  const todayIdx = PRAYER_TIMES.findIndex(r => r.date === todayStr)
  const ramadanDay = todayRow ? todayRow.day : null

  // Clock
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  // Next prayer logic
  let nextPrayerKey: PrayerKey | null = null
  let nextPrayerTime: Date | null = null
  let prevPrayerTime: Date | null = null
  let isTomorrow = false
  let nextPrayerLabel = ''

  if (todayRow) {
    let foundPrev = false
    for (let i = 0; i < PRAYER_KEYS.length; i++) {
      const key = PRAYER_KEYS[i]
      const t = parseTime((todayRow as any)[key], now)
      if (t > now) {
        nextPrayerKey = key
        nextPrayerTime = t
        if (i > 0) {
          prevPrayerTime = parseTime((todayRow as any)[PRAYER_KEYS[i-1]], now)
        } else {
          // Before fajr, prev is yesterday's isha
          if (todayIdx > 0) {
            prevPrayerTime = parseTime(PRAYER_TIMES[todayIdx - 1].isha, now)
            const prev = new Date(prevPrayerTime)
            prev.setDate(prev.getDate() - 1)
            prevPrayerTime = prev
          }
        }
        foundPrev = true
        break
      }
    }
    if (!foundPrev) {
      // All prayers passed, next is tomorrow's fajr
      isTomorrow = true
      nextPrayerKey = 'fajr'
      nextPrayerLabel = "Tomorrow's Fajr"
      const nextRow = todayIdx < 29 ? PRAYER_TIMES[todayIdx + 1] : null
      if (nextRow) {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        nextPrayerTime = parseTime(nextRow.fajr, tomorrow)
      }
      prevPrayerTime = parseTime(todayRow.isha, now)
    }
  }

  const nextPrayerMs = nextPrayerTime ? nextPrayerTime.getTime() - now.getTime() : 0
  const progressPct = (() => {
    if (!prevPrayerTime || !nextPrayerTime) return 0
    const total = nextPrayerTime.getTime() - prevPrayerTime.getTime()
    const elapsed = now.getTime() - prevPrayerTime.getTime()
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  })()

  // Suhoor / Iftar countdowns
  const suhoorMs = todayRow ? parseTime(todayRow.fajr, now).getTime() - now.getTime() : 0
  const iftarMs = todayRow ? parseTime(todayRow.maghrib, now).getTime() - now.getTime() : 0
  const showSuhoorCountdown = suhoorMs > 0 && suhoorMs < 30 * 60 * 1000
  const showIftarCountdown = iftarMs > 0 && iftarMs < 60 * 60 * 1000

  const quote = QUOTES[quoteIdx]
  const hijri = getHijriDate(now)
  const gregorian = getGregorianDate(now)

  const getPrayerState = (key: PrayerKey): 'passed' | 'next' | 'upcoming' => {
    if (!todayRow) return 'upcoming'
    if (isTomorrow) return 'passed'
    const t = parseTime((todayRow as any)[key], now)
    if (t < now) return 'passed'
    if (key === nextPrayerKey) return 'next'
    return 'upcoming'
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Scheherazade+New:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-mono-dm  { font-family: 'DM Mono', monospace; }
        .font-arabic   { font-family: 'Scheherazade New', serif; }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .blink { animation: blink 1s step-end infinite; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease forwards; }

        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.2); }
          50%       { box-shadow: 0 0 40px rgba(201,168,76,0.5); }
        }
        .pulse-gold { animation: pulseGold 2.5s ease-in-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .progress-bar {
          transition: width 1s linear;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }

        .quote-fade {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .quote-fade.hidden-quote {
          opacity: 0;
          transform: translateY(8px);
        }
        .quote-fade.visible-quote {
          opacity: 1;
          transform: translateY(0);
        }

        .stars {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle var(--d, 3s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
      `}} />

      <div
        className="min-h-screen w-full text-white relative"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%), #050810' }}
      >
        {/* Stars decoration */}
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${(i * 17 + i * i * 3) % 100}%`,
                top: `${(i * 13 + i * 7) % 100}%`,
                opacity: 0.1 + (i % 5) * 0.1,
                width: i % 7 === 0 ? '3px' : '2px',
                height: i % 7 === 0 ? '3px' : '2px',
                '--d': `${2 + (i % 5)}s`,
                '--delay': `${(i % 7) * 0.4}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* ── SECTION 1: HEADER ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-playfair text-lg font-semibold" style={{ color: '#C9A84C' }}>
                🌙 RamadanBot
              </Link>
              <div
                className="flex items-center gap-1.5 text-xs text-gray-300 rounded-full px-3 py-1.5"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span>📍</span>
                <span>Damaturu, Yobe</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              {isRamadan && ramadanDay ? (
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold font-playfair"
                  style={{ border: '1px solid rgba(201,168,76,0.5)', color: '#C9A84C', background: 'rgba(201,168,76,0.07)' }}
                >
                  ✦ Ramadan Day {ramadanDay} of 30 · 1447 AH ✦
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm"
                  style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C88', background: 'rgba(201,168,76,0.04)' }}
                >
                  Ramadan 1447 AH
                </div>
              )}
              <p className="text-gray-400 text-sm">{gregorian}</p>
              <p className="text-xs font-arabic" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '1rem' }}>{hijri}</p>
            </div>
          </div>

          {/* ── SECTION 2: LIVE CLOCK ── */}
          <div className="flex justify-center py-4">
            <div
              className="font-mono-dm font-medium select-none"
              style={{
                fontSize: 'clamp(48px, 12vw, 96px)',
                color: '#C9A84C',
                textShadow: '0 0 30px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {hh}
              <span className={colonVisible ? '' : 'blink'} style={{ opacity: colonVisible ? 1 : 0 }}>:</span>
              {mm}
              <span className={colonVisible ? '' : 'blink'} style={{ opacity: colonVisible ? 1 : 0 }}>:</span>
              {ss}
            </div>
          </div>

          {/* ── SECTION 3: SUHOOR & IFTAR CARDS ── */}
          {todayRow && (
            <div className="grid grid-cols-2 gap-3">
              {/* Suhoor */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xl">🌙</span>
                  <div>
                    <div className="text-white text-sm font-semibold font-playfair">Suhoor</div>
                    <div className="font-arabic text-gray-400" style={{ fontSize: '0.95rem' }}>سحور</div>
                  </div>
                </div>
                <div className="font-mono-dm text-xl font-medium" style={{ color: '#a78bfa' }}>
                  {fmt12(todayRow.fajr)}
                </div>
                <div className="text-gray-400 text-xs mt-1">End of Suhoor</div>
                {showSuhoorCountdown && (
                  <div className="mt-2 text-xs font-mono-dm font-medium" style={{ color: '#f97316' }}>
                    ⚠ {fmtMs(suhoorMs)} left
                  </div>
                )}
              </div>

              {/* Iftar */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(120,53,15,0.8), rgba(124,45,18,0.6), rgba(50,20,10,0.9))',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xl">🌅</span>
                  <div>
                    <div className="text-white text-sm font-semibold font-playfair">Iftar</div>
                    <div className="font-arabic text-gray-400" style={{ fontSize: '0.95rem' }}>إفطار</div>
                  </div>
                </div>
                <div className="font-mono-dm text-xl font-medium" style={{ color: '#fb923c' }}>
                  {fmt12(todayRow.maghrib)}
                </div>
                <div className="text-gray-400 text-xs mt-1">Iftar Time</div>
                {showIftarCountdown && (
                  <div className="mt-2 text-xs font-mono-dm font-medium" style={{ color: '#C9A84C' }}>
                    ✦ {fmtMs(iftarMs)} left
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SECTION 4: NEXT PRAYER COUNTDOWN ── */}
          {nextPrayerKey && nextPrayerTime && (
            <div
              className="rounded-2xl p-6 pulse-gold text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(12,10,30,0.9), rgba(20,18,40,0.95))',
                border: '1px solid rgba(201,168,76,0.4)',
                boxShadow: '0 0 40px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.1)',
              }}
            >
              <div className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3 font-medium">
                {isTomorrow ? "Tomorrow's Fajr" : 'Next Prayer'}
              </div>

              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-3xl">{PRAYER_META[nextPrayerKey].emoji}</span>
                <span className="font-playfair text-2xl font-semibold text-white">
                  {PRAYER_META[nextPrayerKey].label}
                </span>
                <span className="font-arabic text-gray-400" style={{ fontSize: '1.5rem' }}>
                  {PRAYER_META[nextPrayerKey].arabic}
                </span>
              </div>

              <div
                className="font-mono-dm font-medium my-3"
                style={{
                  fontSize: 'clamp(36px, 9vw, 72px)',
                  color: '#C9A84C',
                  textShadow: '0 0 30px rgba(201,168,76,0.6)',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}
              >
                {fmtMs(nextPrayerMs)}
              </div>

              <div className="text-gray-400 text-sm mb-4">
                at {fmt12((todayRow as any)?.[nextPrayerKey] ?? '')}
              </div>

              {/* Progress bar */}
              <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full progress-bar"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, rgba(201,168,76,0.5), #C9A84C)',
                    boxShadow: '0 0 8px rgba(201,168,76,0.6)',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{Math.round(progressPct)}% elapsed</span>
                <span>{Math.round(100 - progressPct)}% remaining</span>
              </div>
            </div>
          )}

          {/* Out-of-Ramadan notice */}
          {!isRamadan && (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.3)',
              }}
            >
              <div className="text-4xl mb-3">🌙</div>
              <div className="font-playfair text-xl text-white font-semibold">
                Ramadan 1447 AH begins February 18, 2026
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Damaturu, Yobe · Nigeria WAT (UTC+1)
              </div>
            </div>
          )}

          {/* ── SECTION 5: TODAY'S 6 PRAYER CARDS ── */}
          {todayRow && (
            <div>
              <h2 className="font-playfair text-lg font-semibold mb-3" style={{ color: '#C9A84C' }}>
                Today&apos;s Prayer Times
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRAYER_KEYS.map(key => {
                  const state = getPrayerState(key)
                  const meta = PRAYER_META[key]
                  const time = fmt12((todayRow as any)[key])

                  const cardStyle: React.CSSProperties = state === 'next' ? {
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.5)',
                    boxShadow: '0 0 20px rgba(201,168,76,0.15)',
                  } : state === 'passed' ? {
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }

                  return (
                    <div
                      key={key}
                      className="rounded-2xl p-4 relative"
                      style={{ ...cardStyle, opacity: state === 'passed' ? 0.45 : 1 }}
                    >
                      {/* Badge */}
                      {state === 'next' && (
                        <div
                          className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C', fontSize: '10px' }}
                        >
                          Next
                        </div>
                      )}
                      {state === 'passed' && (
                        <div
                          className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#6b7280', fontSize: '10px' }}
                        >
                          Passed
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-lg">{meta.emoji}</span>
                        <span className="font-playfair font-semibold text-white text-sm">{meta.label}</span>
                      </div>

                      <div className="font-arabic text-right mb-2" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '1.1rem' }}>
                        {meta.arabic}
                      </div>

                      <div
                        className="font-mono-dm font-medium text-lg"
                        style={{
                          color: state === 'next' ? '#C9A84C' : state === 'passed' ? '#6b7280' : '#e5e7eb',
                          textDecoration: state === 'passed' ? 'line-through' : 'none',
                          textDecorationColor: 'rgba(107,114,128,0.5)',
                        }}
                      >
                        {time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── SECTION 6: INSPIRATIONAL QUOTE ── */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(6,78,59,0.25)', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            <div
              className={`quote-fade ${quoteVisible ? 'visible-quote' : 'hidden-quote'}`}
            >
              <div
                className="font-arabic text-right mb-3"
                style={{ color: '#6ee7b7', fontSize: '1.4rem', lineHeight: 1.8, direction: 'rtl' }}
              >
                {quote.ar}
              </div>
              <div className="text-gray-300 text-sm italic mb-2 leading-relaxed">
                "{quote.en}"
              </div>
              <div className="text-right text-xs" style={{ color: 'rgba(52,211,153,0.5)' }}>
                — {quote.source}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setQuoteVisible(false); setTimeout(() => { setQuoteIdx(i); setQuoteVisible(true) }, 300) }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === quoteIdx ? '16px' : '6px',
                    height: '6px',
                    background: i === quoteIdx ? '#10b981' : 'rgba(16,185,129,0.25)',
                  }}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── SECTION 7: FULL MONTH TIMETABLE ── */}
          <div>
            <button
              onClick={() => setShowTable(v => !v)}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#C9A84C',
              }}
            >
              <span className="font-playfair">Full Ramadan Timetable</span>
              <span className="font-mono-dm text-xs">{showTable ? '▲ Hide' : '▼ View'}</span>
            </button>

            {showTable && (
              <div className="mt-3 overflow-x-auto rounded-xl fade-in" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs" style={{ minWidth: '520px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                      {['Day','Date','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].map(col => (
                        <th
                          key={col}
                          className="text-left px-2 py-2 font-semibold"
                          style={{ color: '#C9A84C', whiteSpace: 'nowrap' }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRAYER_TIMES.map(row => {
                      const isToday = row.date === todayStr
                      const isPast = row.date < todayStr
                      return (
                        <tr
                          key={row.day}
                          style={{
                            background: isToday ? 'rgba(201,168,76,0.15)' : 'transparent',
                            borderLeft: isToday ? '3px solid #C9A84C' : '3px solid transparent',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            opacity: isPast && !isToday ? 0.4 : 1,
                          }}
                        >
                          <td className="px-2 py-2 font-mono-dm" style={{ color: isToday ? '#C9A84C' : '#9ca3af', fontWeight: isToday ? 700 : 400 }}>{row.day}</td>
                          <td className="px-2 py-2 font-mono-dm whitespace-nowrap" style={{ color: isToday ? '#C9A84C' : '#9ca3af', fontWeight: isToday ? 700 : 400 }}>
                            {row.weekday} {row.date.slice(5)}
                          </td>
                          {(['fajr','sunrise','dhuhr','asr','maghrib','isha'] as PrayerKey[]).map(k => (
                            <td key={k} className="px-2 py-2 font-mono-dm" style={{ color: isToday ? '#e5e7eb' : '#6b7280' }}>
                              {(row as any)[k]}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="px-3 py-2 text-xs text-gray-600 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  Source: Supreme Council for Islamic Affairs, Nigeria
                </div>
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          <footer className="text-center space-y-2 pt-4 pb-8">
            <div className="text-xs text-gray-600">
              🌙 RamadanBot · Prayer Times for Damaturu, Yobe · Ramadan 1447 AH
            </div>
            <div className="text-xs text-gray-700">
              Times verified by Supreme Council for Islamic Affairs, Nigeria
            </div>
            <div>
              <a
                href="https://ramadanbot.app"
                className="text-xs transition-colors"
                style={{ color: 'rgba(201,168,76,0.4)' }}
              >
                ramadanbot.app
              </a>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}
