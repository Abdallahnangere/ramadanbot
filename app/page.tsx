'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, ArrowUpRight, ChevronDown, Plus } from 'lucide-react';

// ─── Prayer times for Damaturu, Nigeria (Ramadan 1447) ────────────────────────
const PRAYER_TIMES = [
  { date:"2026-02-18", fajr:"05:21", maghrib:"18:21" },
  { date:"2026-02-19", fajr:"05:21", maghrib:"18:21" },
  { date:"2026-02-20", fajr:"05:21", maghrib:"18:21" },
  { date:"2026-02-21", fajr:"05:20", maghrib:"18:21" },
  { date:"2026-02-22", fajr:"05:20", maghrib:"18:22" },
  { date:"2026-02-23", fajr:"05:19", maghrib:"18:22" },
  { date:"2026-02-24", fajr:"05:19", maghrib:"18:22" },
  { date:"2026-02-25", fajr:"05:19", maghrib:"18:22" },
  { date:"2026-02-26", fajr:"05:18", maghrib:"18:22" },
  { date:"2026-02-27", fajr:"05:18", maghrib:"18:22" },
  { date:"2026-02-28", fajr:"05:17", maghrib:"18:23" },
  { date:"2026-03-01", fajr:"05:17", maghrib:"18:23" },
  { date:"2026-03-02", fajr:"05:16", maghrib:"18:23" },
  { date:"2026-03-03", fajr:"05:16", maghrib:"18:23" },
  { date:"2026-03-04", fajr:"05:15", maghrib:"18:23" },
  { date:"2026-03-05", fajr:"05:15", maghrib:"18:23" },
  { date:"2026-03-06", fajr:"05:14", maghrib:"18:23" },
  { date:"2026-03-07", fajr:"05:14", maghrib:"18:23" },
  { date:"2026-03-08", fajr:"05:13", maghrib:"18:23" },
  { date:"2026-03-09", fajr:"05:13", maghrib:"18:23" },
  { date:"2026-03-10", fajr:"05:12", maghrib:"18:23" },
  { date:"2026-03-11", fajr:"05:12", maghrib:"18:24" },
  { date:"2026-03-12", fajr:"05:11", maghrib:"18:24" },
  { date:"2026-03-13", fajr:"05:11", maghrib:"18:24" },
  { date:"2026-03-14", fajr:"05:10", maghrib:"18:24" },
  { date:"2026-03-15", fajr:"05:09", maghrib:"18:24" },
  { date:"2026-03-16", fajr:"05:09", maghrib:"18:24" },
  { date:"2026-03-17", fajr:"05:08", maghrib:"18:24" },
  { date:"2026-03-18", fajr:"05:08", maghrib:"18:24" },
  { date:"2026-03-19", fajr:"05:07", maghrib:"18:24" },
];

// All 5 prayer times for "next prayer" display
const FULL_PRAYERS = [
  { date:"2026-02-18", fajr:"05:21", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { date:"2026-02-19", fajr:"05:21", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { date:"2026-02-20", fajr:"05:21", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { date:"2026-02-21", fajr:"05:20", dhuhr:"12:27", asr:"15:47", maghrib:"18:21", isha:"19:26" },
  { date:"2026-02-22", fajr:"05:20", dhuhr:"12:27", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-23", fajr:"05:19", dhuhr:"12:26", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-24", fajr:"05:19", dhuhr:"12:26", asr:"15:47", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-25", fajr:"05:19", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-26", fajr:"05:18", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-27", fajr:"05:18", dhuhr:"12:26", asr:"15:46", maghrib:"18:22", isha:"19:27" },
  { date:"2026-02-28", fajr:"05:17", dhuhr:"12:26", asr:"15:46", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-01", fajr:"05:17", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-02", fajr:"05:16", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-03", fajr:"05:16", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-04", fajr:"05:15", dhuhr:"12:25", asr:"15:45", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-05", fajr:"05:15", dhuhr:"12:25", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-06", fajr:"05:14", dhuhr:"12:24", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-07", fajr:"05:14", dhuhr:"12:24", asr:"15:44", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-08", fajr:"05:13", dhuhr:"12:24", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-09", fajr:"05:13", dhuhr:"12:24", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-10", fajr:"05:12", dhuhr:"12:23", asr:"15:43", maghrib:"18:23", isha:"19:28" },
  { date:"2026-03-11", fajr:"05:12", dhuhr:"12:23", asr:"15:42", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-12", fajr:"05:11", dhuhr:"12:23", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-13", fajr:"05:11", dhuhr:"12:23", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-14", fajr:"05:10", dhuhr:"12:22", asr:"15:41", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-15", fajr:"05:09", dhuhr:"12:22", asr:"15:40", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-16", fajr:"05:09", dhuhr:"12:22", asr:"15:40", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-17", fajr:"05:08", dhuhr:"12:21", asr:"15:39", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-18", fajr:"05:08", dhuhr:"12:21", asr:"15:39", maghrib:"18:24", isha:"19:29" },
  { date:"2026-03-19", fajr:"05:07", dhuhr:"12:21", asr:"15:38", maghrib:"18:24", isha:"19:29" },
];

// ─── Time helpers ─────────────────────────────────────────────────────────────
function getWAT() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
}
function todayStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function parseHHMM(hhmm: string, base: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(base); d.setHours(h, m, 0, 0); return d;
}
function fmt12(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
function getHijriDay(wat: Date): number | null {
  const d1 = Date.UTC(wat.getFullYear(), wat.getMonth(), wat.getDate());
  const d2 = Date.UTC(2026, 1, 18); // Feb 18 = Ramadan 1
  const day = Math.floor((d1 - d2) / 86400000) + 1;
  return (day >= 1 && day <= 30) ? day : null;
}
function getNextPrayer(now: Date, full: typeof FULL_PRAYERS[0]) {
  const prayers = [
    { label: 'Fajr',    time: full.fajr,    ar: 'الفجر'  },
    { label: 'Dhuhr',   time: full.dhuhr,   ar: 'الظهر'  },
    { label: 'Asr',     time: full.asr,     ar: 'العصر'  },
    { label: 'Maghrib', time: full.maghrib, ar: 'المغرب' },
    { label: 'Isha',    time: full.isha,    ar: 'العشاء'  },
  ];
  for (const p of prayers) {
    const t = parseHHMM(p.time, now);
    if (now < t) return { ...p, date: t };
  }
  return null; // all done for today
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDark, setIsDark] = useState(false);
  // Live clock state
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setNow(getWAT());
    const t = setInterval(() => setNow(getWAT()), 1000);
    return () => clearInterval(t);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // ─── Compute Iftar data ────────────────────────────────────────────────────
  const todayData = now ? PRAYER_TIMES.find(p => p.date === todayStr(now)) : null;
  const todayFull = now ? FULL_PRAYERS.find(p => p.date === todayStr(now)) : null;
  const ramadanDay = now ? getHijriDay(now) : null;
  const isRamadan = ramadanDay !== null;

  let iftarTime = '';
  let iftarCountdown = { h: '--', m: '--', s: '--' };
  let iftarPassed = false;
  let dayProgress = 0;
  let nextPrayer: { label: string; time: string; ar: string; date: Date } | null = null;

  if (now && todayData && todayFull) {
    const maghribDate = parseHHMM(todayData.maghrib, now);
    const fajrDate    = parseHHMM(todayData.fajr, now);
    iftarTime = fmt12(todayData.maghrib);
    iftarPassed = now >= maghribDate;

    if (!iftarPassed) {
      const msLeft = maghribDate.getTime() - now.getTime();
      const total = Math.max(0, Math.floor(msLeft / 1000));
      iftarCountdown = {
        h: String(Math.floor(total / 3600)).padStart(2, '0'),
        m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
        s: String(total % 60).padStart(2, '0'),
      };
      // Day progress: fajr→maghrib
      const dayLen  = maghribDate.getTime() - fajrDate.getTime();
      const elapsed = now.getTime()         - fajrDate.getTime();
      dayProgress = Math.min(100, Math.max(0, (elapsed / dayLen) * 100));
    }
    nextPrayer = getNextPrayer(now, todayFull) as typeof nextPrayer;
  }

  const timeStr = now
    ? `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
    : '--:--:--';
  const dateStr = now ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' }) : '';

  return (
    <div data-theme={isDark ? 'dark' : 'light'} className="rb-root" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: getGlobalCSS() }} />

      {/* ═══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav className={`rb-nav ${scrollPosition > 20 ? 'rb-nav--scrolled' : ''}`}>
        <div className="rb-container">
          <div className="rb-nav-inner">
            <Link href="" className="rb-logo-link">
              <div className="rb-logo-mark">
                <Image src="/logo.png" alt="RamadanBot" fill className="object-contain p-1" priority />
              </div>
              <span className="rb-logo-text">RamadanBot</span>
            </Link>

            <ul className="rb-nav-links">
              <li><Link href="" className="rb-nav-link">Home</Link></li>
              <li><button onClick={() => scrollToSection('features')} className="rb-nav-link">Features</button></li>
              <li><button onClick={() => scrollToSection('showcase')} className="rb-nav-link">Showcase</button></li>
              <li><Link href="/prayer" className="rb-nav-link">Prayer Times</Link></li>
              <li><Link href="/privacy" className="rb-nav-link">Privacy</Link></li>
            </ul>

            <div className="rb-nav-actions">
              <button className="rb-theme-toggle" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
                {isDark
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <Link href="/app" className="rb-btn-primary rb-btn-sm rb-hide-mobile">Launch App <ArrowRight size={14} /></Link>
              <button className="rb-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`rb-mobile-menu ${isMenuOpen ? 'rb-mobile-menu--open' : ''}`}>
          <div className="rb-mobile-menu-inner">
            <Link href="" className="rb-mobile-link">Home</Link>
            <button onClick={() => scrollToSection('features')} className="rb-mobile-link rb-mobile-link--btn">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="rb-mobile-link rb-mobile-link--btn">Showcase</button>
            <Link href="/prayer" className="rb-mobile-link">Prayer Times</Link>
            <Link href="/privacy" className="rb-mobile-link">Privacy</Link>
            <Link href="/contact" className="rb-mobile-link">Contact</Link>
            <Link href="/app" className="rb-btn-primary rb-btn-full rb-mobile-cta">Launch App</Link>
          </div>
        </div>
      </nav>

      <main>

        {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
        <section className="rb-hero">
          <div className="rb-hero-mesh" aria-hidden="true" />
          <div className="rb-hero-glow-main" aria-hidden="true" />
          <div className="rb-hero-glow-sec"  aria-hidden="true" />

          <div className="rb-container rb-hero-grid">

            {/* Left — Text */}
            <div className="rb-hero-text animate-fiu">
              <div className="rb-pill-badge">
                <span className="rb-pulse-dot" />
                <span className="rb-pill-gold">Ramadan 1447</span>
                <span className="rb-pill-sep" />
                <span>RamadanBot 3.0 is live</span>
              </div>

              <h1 className="rb-hero-title">
                Your sacred<br />
                <em className="rb-gold-text">Ramadan</em><br />
                companion.
              </h1>

              <p className="rb-hero-sub">
                AI reflections rooted in Quranic wisdom. A beautifully structured Qur'ān reader. Studio-quality shareable flyers. All in one sacred space — completely free.
              </p>

              <div className="rb-hero-ctas">
                <Link href="/app" className="rb-btn-primary rb-btn-lg">Start for free <ArrowRight size={17} /></Link>
                <button onClick={() => scrollToSection('showcase')} className="rb-btn-secondary rb-btn-lg">See it in action</button>
              </div>

              <div className="rb-trust-bar">
                {[
                  { n: '10K+', l: 'Active Users'  },
                  { n: '100%', l: 'Free Forever'  },
                  { n: '29',   l: 'Days Guided'   },
                  { n: '0',    l: 'Ads. Ever.'    },
                ].map((s, i) => (
                  <div key={i} className="rb-trust-row">
                    <div className="rb-trust-item">
                      <span className="rb-trust-num">{s.n}</span>
                      <span className="rb-trust-label">{s.l}</span>
                    </div>
                    {i < 3 && <div className="rb-trust-sep" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Live Iftar Widget */}
            <div className="rb-hero-right animate-fiu" style={{ animationDelay: '0.18s' }}>
              <div className="iftar-widget">

                {/* Header strip */}
                <div className="iw-header">
                  <div className="iw-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Damaturu, Nigeria
                  </div>
                  <div className="iw-live-dot">
                    <span className="iw-pulse" />
                    Live
                  </div>
                </div>

                {/* Clock */}
                <div className="iw-clock-block">
                  <div className="iw-clock">{timeStr}</div>
                  <div className="iw-date">{dateStr}</div>
                  {isRamadan && (
                    <div className="iw-hijri-badge">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                      Day {ramadanDay} of Ramadan
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="iw-divider" />

                {/* Iftar countdown or passed */}
                {todayData ? (
                  iftarPassed ? (
                    <div className="iw-iftar-passed">
                      <div className="iw-iftar-passed-icon">🌙</div>
                      <div className="iw-iftar-passed-text">
                        <span className="iw-iftar-passed-title">Iftar has passed</span>
                        <span className="iw-iftar-passed-sub">Maghrib was at {iftarTime}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="iw-iftar-block">
                      <div className="iw-iftar-label">
                        <span className="iw-iftar-title">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          Time until Iftar
                        </span>
                        <span className="iw-iftar-time">Maghrib · {iftarTime}</span>
                      </div>

                      {/* Countdown digits */}
                      <div className="iw-countdown">
                        <div className="iw-cd-unit">
                          <span className="iw-cd-num">{iftarCountdown.h}</span>
                          <span className="iw-cd-lbl">hrs</span>
                        </div>
                        <span className="iw-cd-colon">:</span>
                        <div className="iw-cd-unit">
                          <span className="iw-cd-num">{iftarCountdown.m}</span>
                          <span className="iw-cd-lbl">min</span>
                        </div>
                        <span className="iw-cd-colon">:</span>
                        <div className="iw-cd-unit">
                          <span className="iw-cd-num">{iftarCountdown.s}</span>
                          <span className="iw-cd-lbl">sec</span>
                        </div>
                      </div>

                      {/* Fasting progress bar */}
                      <div className="iw-progress-wrap">
                        <div className="iw-progress-labels">
                          <span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v8M12 22v-4M4.93 4.93l5.66 5.66M18.36 18.36l-2.83-2.83M2 12h8M22 12h-4M4.93 19.07l5.66-5.66M18.36 5.64l-2.83 2.83"/></svg>
                            Suhoor · {todayData ? fmt12(todayData.fajr) : '--'}
                          </span>
                          <span>
                            Iftar · {iftarTime}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                          </span>
                        </div>
                        <div className="iw-progress-track">
                          <div className="iw-progress-fill" style={{ width: `${dayProgress}%` }} />
                          <div className="iw-progress-thumb" style={{ left: `${dayProgress}%` }} />
                        </div>
                        <div className="iw-progress-pct">{Math.round(dayProgress)}% of fasting day elapsed</div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Outside Ramadan */
                  <div className="iw-off-season">
                    <div className="iw-crescent">
                      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35 8C21.2 8 10 19.2 10 33s11.2 25 25 25c5.5 0 10.6-1.8 14.7-4.8C45 54.7 40 56 35 56 22.3 56 12 45.7 12 33S22.3 10 35 10c4 0 7.8 1 11 2.8C42.8 9.5 39.1 8 35 8z" fill="url(#cg2)"/>
                        <defs><linearGradient id="cg2" x1="10" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#D4A853"/><stop offset="1" stopColor="#8B6A1F"/></linearGradient></defs>
                      </svg>
                    </div>
                    <span className="iw-off-text">Ramadan 1447 · Feb 18 – Mar 19, 2026</span>
                  </div>
                )}

                {/* Divider */}
                <div className="iw-divider" />

                {/* Next prayer row */}
                {nextPrayer && (
                  <div className="iw-next-prayer">
                    <div className="iw-np-left">
                      <span className="iw-np-label">Next Prayer</span>
                      <span className="iw-np-name">{nextPrayer.label} <span className="iw-np-ar">{nextPrayer.ar}</span></span>
                    </div>
                    <div className="iw-np-time">{fmt12(nextPrayer.time)}</div>
                  </div>
                )}

                {/* Mini prayer pills */}
                {todayFull && (
                  <div className="iw-prayers-row">
                    {[
                      { l: 'Fajr',    t: todayFull.fajr    },
                      { l: 'Dhuhr',   t: todayFull.dhuhr   },
                      { l: 'Asr',     t: todayFull.asr     },
                      { l: 'Maghrib', t: todayFull.maghrib },
                      { l: 'Isha',    t: todayFull.isha    },
                    ].map(p => {
                      const isPassed = now ? now >= parseHHMM(p.t, now) : false;
                      const isNext = nextPrayer?.label === p.l;
                      return (
                        <div key={p.l} className={`iw-prayer-pill ${isPassed ? 'iw-pill--passed' : ''} ${isNext ? 'iw-pill--next' : ''}`}>
                          <span className="iw-pill-name">{p.l}</span>
                          <span className="iw-pill-time">{fmt12(p.t)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer CTA */}
                <Link href="/prayer" className="iw-footer-link">
                  Full Ramadan Schedule <ArrowUpRight size={13} />
                </Link>

              </div>
            </div>

          </div>

          <div className="rb-scroll-hint"><ChevronDown size={22} /></div>
        </section>

        {/* ═══ FEATURES ════════════════════════════════════════════════════════ */}
        <section id="features" className="rb-section">
          <div className="rb-section-rule" />
          <div className="rb-container">
            <div className="rb-section-header">
              <div className="rb-eyebrow"><span className="rb-dot" />Core Features</div>
              <h2 className="rb-section-title">One app.<br /><span className="rb-muted">Every act of worship.</span></h2>
            </div>
            <div className="rb-bento">

              {/* 1 — AI Reflections (2 cols) */}
              <div className="rb-bcard rb-bcard--w2">
                <div className="rb-bcard-glow rb-glow--gold" />
                <div className="rb-bcard-ico rb-ico--gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/><path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>
                </div>
                <div>
                  <h3 className="rb-bcard-title">AI Reflections</h3>
                  <p className="rb-bcard-desc" style={{ maxWidth: '360px' }}>Quranic-based spiritual reflections generated instantly by advanced AI, exclusively trained on authenticated Islamic scholarship and Tafsir. Deeply personal, profoundly accurate.</p>
                </div>
                <div className="rb-bcard-tag">Powered by Advanced LLM</div>
              </div>

              {/* 2 — Qur'an Reader */}
              <div className="rb-bcard">
                <div className="rb-bcard-glow rb-glow--emerald" />
                <div className="rb-bcard-ico rb-ico--emerald">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                </div>
                <h3 className="rb-bcard-title">Qur'ān Reader</h3>
                <p className="rb-bcard-desc">Professional 604-page reader with 5 daily prayer-aligned sessions. Auto-saves every 5 seconds.</p>
              </div>

              {/* 3 — Featured Name */}
              <div className="rb-bcard">
                <div className="rb-bcard-glow rb-glow--purple" />
                <div className="rb-bcard-ico rb-ico--purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                </div>
                <h3 className="rb-bcard-title">Featured Name</h3>
                <p className="rb-bcard-desc">Every 1080px high-res flyer beautifully embeds your name in studio-grade typography. Uniquely yours.</p>
              </div>

              {/* 4 — Streak */}
              <div className="rb-bcard">
                <div className="rb-bcard-glow rb-glow--amber" />
                <div className="rb-bcard-ico rb-ico--amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/></svg>
                </div>
                <h3 className="rb-bcard-title">Streak Tracking</h3>
                <p className="rb-bcard-desc">Build daily consistency with beautiful visual accountability. Every reflection matters.</p>
                <div className="rb-streak-row">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className={`rb-pip ${i < 14 ? 'rb-pip--on' : i === 14 ? 'rb-pip--today' : 'rb-pip--off'}`} />
                  ))}
                </div>
              </div>

              {/* 5 — Sharing */}
              <div className="rb-bcard">
                <div className="rb-bcard-glow rb-glow--blue" />
                <div className="rb-bcard-ico rb-ico--blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>
                </div>
                <h3 className="rb-bcard-title">One-Tap Share</h3>
                <p className="rb-bcard-desc">Instantly export studio-quality flyers to WhatsApp, Instagram, and X — with your name perfectly placed.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ═══ QUR'AN READER ═══════════════════════════════════════════════════ */}
        <section className="rb-section rb-section--alt">
          <div className="rb-section-rule" />
          <div className="rb-container rb-reader-grid">
            <div className="rb-reader-left">
              <div className="rb-eyebrow"><span className="rb-dot rb-dot--emerald" />Qur'ān Reader</div>
              <h2 className="rb-section-title rb-title--left">Structured reading,<br /><span className="rb-muted">beautifully designed.</span></h2>
              <p className="rb-section-sub rb-sub--left">A meticulously crafted interface that transforms daily reading into a seamless, focus-driven spiritual habit.</p>
              <div className="rb-steps">
                {[
                  { n:'01', t:'29-Day Structure', d:'Complete all 604 pages with balanced daily assignments — perfect, pressure-free progression.' },
                  { n:'02', t:'5 Prayer-Aligned Phases', d:'Read with Fajr, Dhuhr, Asr, Maghrib, Isha — each session optimized for 10 focused minutes.' },
                  { n:'03', t:'Auto-Save Every 5s', d:'Your position syncs silently. Resume exactly where you left off, on any device, any time.' },
                ].map(s => (
                  <div key={s.n} className="rb-step">
                    <div className="rb-step-n">{s.n}</div>
                    <div><div className="rb-step-t">{s.t}</div><div className="rb-step-d">{s.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rb-dist-card">
              <div className="rb-dist-glow" />
              <div className="rb-dist-head">
                <span className="rb-dist-heading">Daily Page Distribution</span>
                <span className="rb-badge rb-badge--emerald">604 pages</span>
              </div>
              <div className="rb-dist-bar-wrap">
                <div className="rb-dist-bar">
                  <div className="rb-bar-seg rb-bar-seg--emerald" style={{ flex: 20 }} />
                  <div className="rb-bar-seg rb-bar-seg--amber" style={{ flex: 9 }} />
                </div>
                <div className="rb-dist-legend">
                  <span><i className="rb-ldot rb-ldot--emerald" />Days 1–20 (400 pg)</span>
                  <span><i className="rb-ldot rb-ldot--amber" />Days 21–29 (204 pg)</span>
                </div>
              </div>
              {[
                { l:'Days 1–20 · Standard Pace', b:'400 pages', bc:'rb-badge--emerald', rows:[['Daily quota','20 pages'],['Per session','4 pages'],['Est. daily time','~50 min']] },
                { l:'Days 21–29 · Final Push',   b:'204 pages', bc:'rb-badge--amber',   rows:[['Daily quota','22–23 pages'],['Per session','5 pages']] },
              ].map((block, i) => (
                <div key={i} className="rb-dist-block">
                  <div className="rb-dist-bh"><span>{block.l}</span><span className={`rb-badge ${block.bc}`}>{block.b}</span></div>
                  {block.rows.map(([k,v], j) => (
                    <div key={j} className={`rb-dist-row ${j===block.rows.length-1?'rb-dist-row--last':''}`}><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SHOWCASE — 5 PHONES ══════════════════════════════════════════════ */}
        <section id="showcase" className="rb-showcase-section">
          <div className="rb-sc-glow-l" /><div className="rb-sc-glow-r" />
          <div className="rb-container" style={{ position:'relative', zIndex:2 }}>
            <div className="rb-section-header rb-sh--center">
              <div className="rb-eyebrow"><span className="rb-dot rb-dot--gold" />App Showcase</div>
              <h2 className="rb-section-title">See it in action.</h2>
              <p className="rb-section-sub" style={{ maxWidth:'440px', margin:'0 auto' }}>Five powerful screens. One sacred companion.</p>
            </div>
            <div className="rb-stage">
              {[
                { title:'Dashboard',    src:'/login.png',     desc:'Stats & Streaks',    tilt:'-10deg', ty:'44px', sc:'0.87' },
                { title:'AI Generator', src:'/generate.png',  desc:'Instant Reflection', tilt:'-4deg',  ty:'12px', sc:'0.95' },
                { title:'Reader UI',    src:'/Interface.jpg', desc:'Smooth Navigation',  tilt:'0deg',   ty:'0px',  sc:'1.00' },
                { title:'Share Hub',    src:'/share.png',     desc:'High-Res Export',    tilt:'4deg',   ty:'12px', sc:'0.95' },
                { title:'Guide',        src:'/guide.jpg',     desc:'Daily Guidance',     tilt:'10deg',  ty:'44px', sc:'0.87' },
              ].map((s, i) => (
                <div key={i} className="rb-stage-item" style={{ '--tilt':s.tilt,'--ty':s.ty,'--sc':s.sc } as React.CSSProperties}>
                  <div className="rb-sc-frame group">
                    <div className="rb-sc-rim" />
                    <div className="rb-sc-vol-up" /><div className="rb-sc-vol-down" />
                    <div className="rb-sc-power" />
                    <div className="rb-sc-inner">
                      <div className="rb-sc-island" />
                      <div className="rb-sc-screen">
                        <div className="rb-sc-sheen" />
                        <Image src={s.src} alt={s.title} fill className="object-cover object-top" />
                      </div>
                    </div>
                    <div className="rb-sc-speaker" />
                    <div className="rb-sc-glow-under" />
                  </div>
                  <div className="rb-sc-label">
                    <span className="rb-sc-label-t">{s.title}</span>
                    <span className="rb-sc-label-s">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ WHY ══════════════════════════════════════════════════════════════ */}
        <section id="why" className="rb-section">
          <div className="rb-section-rule" />
          <div className="rb-container">
            <div className="rb-why-intro">
              <div>
                <div className="rb-eyebrow"><span className="rb-dot" />Why RamadanBot</div>
                <h2 className="rb-section-title rb-title--left">Built for focus.<br /><span className="rb-muted">Engineered for peace.</span></h2>
              </div>
              <p className="rb-section-sub rb-sub--left" style={{ maxWidth:'360px' }}>Every design decision prioritizes your spiritual clarity. Nothing superfluous. Everything intentional.</p>
            </div>
            <div className="rb-why-grid">
              {[
                { n:'01', t:'Authentically Islamic',  d:'Grounded in Quranic verses and Tafsir-backed teachings — zero generic AI hallucinations that misrepresent the faith.' },
                { n:'02', t:'Absolute Privacy',        d:'Just your name and PIN. Zero tracking, zero ads, zero data sold. Your spiritual journey belongs only to you.' },
                { n:'03', t:'Always Free',              d:'Full unlimited access to every feature. No tiers, no paywalls, no dark patterns — built purely for the ummah.' },
                { n:'04', t:'Community Driven',         d:'Share your reflections and inspire your circle. Build collective accountability and spiritual momentum.' },
                { n:'05', t:'Premium Export',           d:'Studio-quality 1080px typographic flyers with your name elegantly embedded — ready for any social platform.' },
                { n:'06', t:'PWA Ready',                d:'Install to your home screen in one tap. Works offline, syncs seamlessly — feels exactly like a native app.' },
              ].map(w => (
                <div key={w.n} className="rb-why-card">
                  <div className="rb-why-n">{w.n}</div>
                  <div className="rb-why-rule" />
                  <div className="rb-why-t">{w.t}</div>
                  <div className="rb-why-d">{w.d}</div>
                  <div className="rb-why-arr"><ArrowUpRight size={14} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="rb-section rb-section--alt">
          <div className="rb-section-rule" />
          <div className="rb-container">
            <div style={{ maxWidth:'660px' }}>
              <div className="rb-eyebrow"><span className="rb-dot rb-dot--gold" />FAQ</div>
              <h2 className="rb-section-title rb-title--left">Common questions.</h2>
              <div className="rb-faq-list">
                {[
                  { q:'How does the AI generate reflections?', a:'We leverage advanced LLMs exclusively prompted with authenticated Islamic knowledge and Tafsir. Profoundly accurate reflections — no generic content, no fabrication.' },
                  { q:'Can I preview the flyer before sharing?', a:'Absolutely. The studio preview renders exactly how your 1080px flyer will export. Regenerate infinitely until it resonates — at zero cost.' },
                  { q:'How do I install RamadanBot as an app?', a:'Open RamadanBot in Safari or Chrome, tap "Share", then "Add to Home Screen". It launches and behaves identically to a native app.' },
                  { q:'Is my personal data secure?', a:'We collect zero sensitive data. Only your display name is stored locally or via encrypted sync. Privacy is our architectural foundation, not an afterthought.' },
                  { q:"Are there any hidden costs?", a:"RamadanBot is 100% free. Unlimited reflections, unlimited Qur'ān reading, premium exports — zero cost, forever." },
                ].map((item, i) => (
                  <details key={i} className="rb-faq">
                    <summary className="rb-faq-sum">
                      <span className="rb-faq-q">{item.q}</span>
                      <span className="rb-faq-ico"><Plus size={15} /></span>
                    </summary>
                    <div className="rb-faq-a">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ══════════════════════════════════════════════════════════════ */}
        <section className="rb-cta">
          <div className="rb-cta-bg" /><div className="rb-cta-mesh" />
          <div className="rb-cta-crescent">
            <svg viewBox="0 0 200 200" fill="none"><path d="M120 20C75 20 38 57 38 102C38 147 75 184 120 184C140 184 158 176 172 163C155 166 136 162 121 150C93 130 84 94 96 64C103 46 119 32 140 26C134 22 127 20 120 20Z" fill="url(#cg)" opacity="0.65"/><defs><linearGradient id="cg" x1="38" y1="20" x2="172" y2="184" gradientUnits="userSpaceOnUse"><stop stopColor="#F0C060"/><stop offset="1" stopColor="#8B6A1F"/></linearGradient></defs></svg>
          </div>
          <div className="rb-cta-stars">
            {[...Array(14)].map((_,i)=>(
              <div key={i} className="rb-star" style={{ top:`${10+(i*17)%75}%`, left:`${5+(i*23)%88}%`, width:`${1+(i%3)}px`, height:`${1+(i%3)}px`, animationDelay:`${(i*0.4)%4}s`, animationDuration:`${3+(i%3)}s` }} />
            ))}
          </div>
          <div className="rb-container rb-cta-inner">
            <div className="rb-eyebrow rb-eyebrow--faint"><span className="rb-dot rb-dot--gold" />Get Started Today</div>
            <h2 className="rb-cta-title">Begin your<br /><em className="rb-gold-text">spiritual sprint.</em></h2>
            <p className="rb-cta-sub">Join thousands of Muslims building meaningful daily habits this Ramadan. Zero friction, instant access, completely free.</p>
            <div className="rb-cta-actions">
              <Link href="/app" className="rb-btn-primary rb-btn-xl">Launch App — Free <ArrowUpRight size={18} /></Link>
              <button onClick={() => scrollToSection('features')} className="rb-btn-ghost rb-btn-xl">Explore features</button>
            </div>
          </div>
        </section>

      </main>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="rb-footer">
        <div className="rb-container">
          <div className="rb-footer-grid">
            <div>
              <div className="rb-footer-logo">
                <div className="rb-footer-logo-mark"><Image src="/logo.png" alt="Logo" width={16} height={16} className="object-contain" /></div>
                <span className="rb-footer-logo-t">RamadanBot</span>
              </div>
              <p className="rb-footer-tag">The modern digital companion for spiritual growth, authentic reflections, and seamless Qur'ān reading — built for the ummah.</p>
              <div className="rb-footer-socials">
                <a href="" target="_blank" rel="noopener noreferrer" className="rb-social-pill">X (Twitter) <ArrowUpRight size={11}/></a>
                <a href="" target="_blank" rel="noopener noreferrer" className="rb-social-pill">TikTok <ArrowUpRight size={11}/></a>
              </div>
            </div>
            {[
              { h:'Product', links:[{l:'Launch App',href:'/app'},{l:'Features',fn:()=>scrollToSection('features')},{l:'Prayer Times',href:'/prayer'}] },
              { h:'Company', links:[{l:'Home',href:''},{l:'Contact',href:'/contact'},{l:'Privacy',href:'/privacy'}] },
              { h:'Connect', links:[{l:'X (Twitter)',href:'',ext:true},{l:'TikTok',href:'',ext:true}] },
            ].map(col => (
              <div key={col.h}>
                <p className="rb-footer-h">{col.h}</p>
                <ul className="rb-footer-links">
                  {col.links.map(lk => (
                    <li key={lk.l}>
                      {(lk as any).fn
                        ? <button onClick={(lk as any).fn} className="rb-footer-link">{lk.l}</button>
                        : <Link href={(lk as any).href} className={`rb-footer-link ${(lk as any).ext?'rb-footer-link--ext':''}`} target={(lk as any).ext?'_blank':undefined} rel={(lk as any).ext?'noopener noreferrer':undefined}>{lk.l}{(lk as any).ext&&<ArrowUpRight size={11}/>}</Link>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rb-footer-bottom">
            <p>Designed & built by Abdallah Nangere</p>
            <p>© {new Date().getFullYear()} RamadanBot · All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getGlobalCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    /* ── LIGHT (default) ──────────────────────────── */
    :root, [data-theme="light"] {
      --bg:#FAFAF7; --bg-alt:#F3F2EE; --sf:#FFFFFF; --sf2:#F0EFE9;
      --bd:rgba(0,0,0,0.08); --bd-med:rgba(0,0,0,0.13);
      --t1:#0F0E0C; --t2:#5B5955; --t3:#9C9990; --tmut:#C5C2B8;
      --gold:#B8900A; --gold-b:#D4A830; --gold-dim:rgba(184,144,10,0.1); --gold-brd:rgba(184,144,10,0.22); --gold-t:#9A7608;
      --emerald:#047857; --em-dim:rgba(4,120,87,0.08); --em-brd:rgba(4,120,87,0.18);
      --amber:#B45309; --am-dim:rgba(180,83,9,0.08); --am-brd:rgba(180,83,9,0.18);
      --blue:#1D4ED8; --bl-dim:rgba(29,78,216,0.08); --bl-brd:rgba(29,78,216,0.18);
      --purple:#6D28D9; --pu-dim:rgba(109,40,217,0.08); --pu-brd:rgba(109,40,217,0.18);
      --nav:rgba(250,250,247,0.85); --card:#FFFFFF;
      --card-sh:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04);
      --card-hover:0 8px 32px rgba(0,0,0,0.1),0 2px 8px rgba(0,0,0,0.06);
      --phone-frame:linear-gradient(145deg,#E6E4DE,#CECCCA); --phone-scr:#EAE9E4; --phone-btn:rgba(0,0,0,0.18); --phone-brd:rgba(0,0,0,0.06);
      /* widget */
      --iw-bg:rgba(255,255,255,0.92); --iw-border:rgba(0,0,0,0.08);
      --iw-track:rgba(0,0,0,0.08); --iw-shadow:0 8px 40px rgba(0,0,0,0.08),0 2px 8px rgba(0,0,0,0.04);
    }
    /* ── DARK ─────────────────────────────────────── */
    [data-theme="dark"] {
      --bg:#07080F; --bg-alt:#0C0D1A; --sf:#111320; --sf2:#181A2C;
      --bd:rgba(255,255,255,0.07); --bd-med:rgba(255,255,255,0.12);
      --t1:#EDE8DC; --t2:#8A93AE; --t3:#424B64; --tmut:#4D566F;
      --gold:#D4A853; --gold-b:#F0C060; --gold-dim:rgba(212,168,83,0.12); --gold-brd:rgba(212,168,83,0.22); --gold-t:#D4A853;
      --emerald:#34D399; --em-dim:rgba(52,211,153,0.12); --em-brd:rgba(52,211,153,0.22);
      --amber:#F59E0B; --am-dim:rgba(245,158,11,0.12); --am-brd:rgba(245,158,11,0.22);
      --blue:#60A5FA; --bl-dim:rgba(96,165,250,0.12); --bl-brd:rgba(96,165,250,0.22);
      --purple:#A78BFA; --pu-dim:rgba(167,139,250,0.12); --pu-brd:rgba(167,139,250,0.22);
      --nav:rgba(7,8,15,0.85); --card:#111320;
      --card-sh:0 1px 0 rgba(255,255,255,0.04); --card-hover:0 20px 60px rgba(0,0,0,0.5);
      --phone-frame:linear-gradient(145deg,#1C1F2E,#0F1018); --phone-scr:#08090E; --phone-btn:rgba(255,255,255,0.09); --phone-brd:rgba(255,255,255,0.04);
      --iw-bg:rgba(17,19,32,0.95); --iw-border:rgba(255,255,255,0.08);
      --iw-track:rgba(255,255,255,0.07); --iw-shadow:0 8px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04);
    }

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;background:var(--bg);color:var(--t1);}
    .rb-root{background:var(--bg);color:var(--t1);transition:background 0.4s,color 0.4s;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--bd-med);border-radius:10px;}

    /* LAYOUT */
    .rb-container{max-width:1200px;margin:0 auto;padding:0 24px;}
    @media(min-width:640px){.rb-container{padding:0 32px;}}
    @media(min-width:1024px){.rb-container{padding:0 48px;}}

    /* NAV */
    .rb-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 0;transition:padding 0.4s;}
    .rb-nav--scrolled{padding:8px 0;}
    .rb-nav-inner{background:var(--nav);backdrop-filter:saturate(180%) blur(22px);-webkit-backdrop-filter:saturate(180%) blur(22px);border:1px solid var(--bd);border-radius:18px;height:58px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:background 0.4s,border-color 0.4s;}
    .rb-logo-link{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;}
    .rb-logo-mark{position:relative;width:29px;height:29px;border-radius:9px;background:var(--sf);border:1px solid var(--bd-med);overflow:hidden;transition:border-color 0.2s;}
    .rb-logo-link:hover .rb-logo-mark{border-color:var(--gold);}
    .rb-logo-text{font-weight:600;font-size:15px;color:var(--t1);letter-spacing:-0.01em;}
    .rb-nav-links{display:none;list-style:none;gap:26px;align-items:center;}
    @media(min-width:768px){.rb-nav-links{display:flex;}}
    .rb-nav-link{font-size:13.5px;font-weight:500;color:var(--t2);text-decoration:none;background:transparent;border:none;cursor:pointer;transition:color 0.2s;padding:0;font-family:'DM Sans',sans-serif;}
    .rb-nav-link:hover{color:var(--t1);}
    .rb-nav-actions{display:flex;align-items:center;gap:9px;}
    .rb-hide-mobile{display:none;}
    @media(min-width:640px){.rb-hide-mobile{display:inline-flex;}}
    .rb-theme-toggle{width:36px;height:36px;border-radius:50%;background:var(--sf2);border:1px solid var(--bd-med);color:var(--t2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;font-family:inherit;}
    .rb-theme-toggle:hover{color:var(--gold);border-color:var(--gold-brd);}
    .rb-menu-toggle{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--sf2);border:1px solid var(--bd-med);color:var(--t1);cursor:pointer;transition:all 0.2s;font-family:inherit;}
    @media(min-width:768px){.rb-menu-toggle{display:none;}}
    .rb-mobile-menu{position:absolute;top:78px;left:12px;right:12px;background:var(--sf);border:1px solid var(--bd);border-radius:18px;overflow:hidden;max-height:0;opacity:0;transition:max-height 0.45s cubic-bezier(0.16,1,0.3,1),opacity 0.3s;}
    .rb-mobile-menu--open{max-height:500px;opacity:1;}
    .rb-mobile-menu-inner{display:flex;flex-direction:column;gap:2px;padding:12px;}
    .rb-mobile-link{display:block;font-size:15px;font-weight:500;color:var(--t2);text-decoration:none;padding:11px 14px;border-radius:12px;transition:all 0.2s;}
    .rb-mobile-link--btn{background:transparent;border:none;cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;}
    .rb-mobile-link:hover{background:var(--sf2);color:var(--t1);}
    .rb-mobile-cta{margin-top:8px;}

    /* BUTTONS */
    .rb-btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:linear-gradient(135deg,var(--gold-b),var(--gold));color:#0A0800;border:none;border-radius:9999px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;text-decoration:none;letter-spacing:0.01em;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);white-space:nowrap;}
    .rb-btn-primary:hover{transform:scale(1.03);filter:brightness(1.08);box-shadow:0 8px 28px rgba(180,144,10,0.35);}
    .rb-btn-primary:active{transform:scale(0.98);}
    .rb-btn-secondary{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;color:var(--t2);border:1px solid var(--bd-med);border-radius:9999px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:14px;cursor:pointer;text-decoration:none;transition:all 0.25s;white-space:nowrap;}
    .rb-btn-secondary:hover{border-color:var(--gold-brd);color:var(--t1);background:var(--sf2);}
    .rb-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:rgba(255,255,255,0.07);color:var(--t1);border:1px solid rgba(255,255,255,0.14);border-radius:9999px;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;text-decoration:none;backdrop-filter:blur(10px);transition:all 0.25s;white-space:nowrap;}
    [data-theme="light"] .rb-btn-ghost{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.12);color:var(--t1);}
    .rb-btn-ghost:hover{border-color:var(--gold-brd);}
    .rb-btn-sm{height:38px;padding:0 18px;font-size:13.5px;}
    .rb-btn-lg{height:52px;padding:0 28px;font-size:15px;}
    .rb-btn-xl{height:58px;padding:0 36px;font-size:16px;}
    .rb-btn-full{width:100%;}

    /* ═══ HERO ═══════════════════════════════════════════════ */
    .rb-hero{position:relative;padding-top:96px;padding-bottom:72px;overflow:hidden;}
    @media(min-width:1024px){.rb-hero{padding-top:108px;padding-bottom:88px;}}
    .rb-hero-mesh{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 1.5px 1.5px,var(--bd-med) 1.5px,transparent 0);background-size:38px 38px;mask-image:radial-gradient(ellipse 80% 65% at 50% 25%,black 0%,transparent 100%);}
    .rb-hero-glow-main{position:absolute;top:0;right:5%;width:550px;height:550px;background:radial-gradient(circle,var(--gold-dim) 0%,transparent 70%);pointer-events:none;border-radius:50%;}
    .rb-hero-glow-sec{position:absolute;bottom:5%;left:0;width:380px;height:380px;background:radial-gradient(circle,var(--em-dim) 0%,transparent 70%);pointer-events:none;border-radius:50%;}

    .rb-hero-grid{display:grid;grid-template-columns:1fr;gap:40px;align-items:start;position:relative;z-index:2;}
    @media(min-width:1024px){.rb-hero-grid{grid-template-columns:1fr 1fr;gap:56px;align-items:center;}}

    .rb-hero-text{display:flex;flex-direction:column;align-items:flex-start;gap:20px;}
    .rb-pill-badge{display:inline-flex;align-items:center;gap:9px;padding:7px 15px;border-radius:9999px;background:var(--gold-dim);border:1px solid var(--gold-brd);font-size:12px;font-weight:500;color:var(--t2);}
    .rb-pill-gold{color:var(--gold-t);font-weight:600;}
    .rb-pill-sep{display:inline-block;width:1px;height:11px;background:var(--gold-brd);flex-shrink:0;}
    .rb-pulse-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--emerald);flex-shrink:0;animation:rb-pdot 2s ease-in-out infinite;}
    @keyframes rb-pdot{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(4,120,87,0.4)}50%{opacity:.8;box-shadow:0 0 0 4px rgba(4,120,87,0)}}
    [data-theme="dark"] .rb-pulse-dot{animation:rb-pdot-d 2s ease-in-out infinite;}
    @keyframes rb-pdot-d{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(52,211,153,0.4)}50%{opacity:.8;box-shadow:0 0 0 4px rgba(52,211,153,0)}}
    .rb-hero-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(50px,9vw,86px);font-weight:700;line-height:1.03;letter-spacing:-0.025em;color:var(--t1);}
    .rb-gold-text{background:linear-gradient(135deg,var(--gold-b) 0%,var(--gold) 55%,#7A5B00 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .rb-hero-sub{font-size:clamp(14px,2vw,17px);font-weight:300;line-height:1.75;color:var(--t2);max-width:460px;}
    .rb-hero-ctas{display:flex;flex-wrap:wrap;gap:12px;}
    .rb-trust-bar{display:flex;align-items:center;gap:0;padding-top:22px;border-top:1px solid var(--bd);flex-wrap:wrap;row-gap:12px;}
    .rb-trust-row{display:flex;align-items:center;gap:0;}
    .rb-trust-item{display:flex;flex-direction:column;gap:2px;padding-right:20px;}
    .rb-trust-num{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;letter-spacing:-0.02em;color:var(--t1);line-height:1;}
    .rb-trust-label{font-size:10px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:var(--t3);}
    .rb-trust-sep{width:1px;height:32px;background:var(--bd);flex-shrink:0;margin-right:20px;}
    .rb-scroll-hint{display:flex;justify-content:center;padding-top:20px;color:var(--t3);animation:rb-bounce 2s ease-in-out infinite;}
    @keyframes rb-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}

    /* ─── Hero Right Col ─────────────────────────────────── */
    .rb-hero-right{width:100%;}
    @media(min-width:1024px){.rb-hero-right{display:flex;justify-content:flex-end;}}

    /* ═══════════════════════════════════════════════════════
       IFTAR WIDGET
    ═══════════════════════════════════════════════════════ */
    .iftar-widget {
      background: var(--iw-bg);
      backdrop-filter: saturate(180%) blur(24px);
      -webkit-backdrop-filter: saturate(180%) blur(24px);
      border: 1px solid var(--iw-border);
      border-radius: 24px;
      padding: 24px;
      box-shadow: var(--iw-shadow);
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
      max-width: 420px;
      position: relative;
      overflow: hidden;
      transition: background 0.4s, border-color 0.4s;
    }
    /* Subtle gold shimmer top */
    .iftar-widget::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold-brd), transparent);
    }
    /* Soft gold ambient glow */
    .iftar-widget::after {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%);
      pointer-events: none;
      border-radius: 50%;
    }

    /* Header */
    .iw-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .iw-location {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--t3);
    }
    .iw-live-dot {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--emerald);
      background: var(--em-dim);
      border: 1px solid var(--em-brd);
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .iw-pulse {
      display: inline-block;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--emerald);
      animation: rb-pdot 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    /* Clock block */
    .iw-clock-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 18px;
    }
    .iw-clock {
      font-family: 'Cormorant Garamond', serif;
      font-size: 52px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--t1);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .iw-date {
      font-size: 13px;
      font-weight: 400;
      color: var(--t2);
      letter-spacing: 0.01em;
    }
    .iw-hijri-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--gold-t);
      background: var(--gold-dim);
      border: 1px solid var(--gold-brd);
      padding: 3px 10px;
      border-radius: 9999px;
      width: fit-content;
      margin-top: 4px;
    }
    [data-theme="dark"] .iw-hijri-badge { color: var(--gold); }

    /* Divider */
    .iw-divider {
      height: 1px;
      background: var(--bd);
      margin: 16px 0;
    }

    /* Iftar block */
    .iw-iftar-block { display: flex; flex-direction: column; gap: 14px; }
    .iw-iftar-label { display: flex; justify-content: space-between; align-items: center; }
    .iw-iftar-title {
      display: flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.05em;
      text-transform: uppercase; color: var(--t3);
    }
    .iw-iftar-time {
      font-size: 12px; font-weight: 600; color: var(--gold-t);
      background: var(--gold-dim); border: 1px solid var(--gold-brd);
      padding: 3px 10px; border-radius: 9999px;
    }
    [data-theme="dark"] .iw-iftar-time { color: var(--gold); }

    /* Countdown digits */
    .iw-countdown {
      display: flex;
      align-items: flex-end;
      gap: 4px;
    }
    .iw-cd-unit {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      background: var(--sf2); border: 1px solid var(--bd);
      border-radius: 12px; padding: 10px 14px;
      min-width: 64px;
    }
    .iw-cd-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 34px; font-weight: 700; letter-spacing: -0.02em;
      color: var(--t1); line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .iw-cd-lbl {
      font-size: 10px; font-weight: 600; letter-spacing: 0.07em;
      text-transform: uppercase; color: var(--t3);
    }
    .iw-cd-colon {
      font-family: 'Cormorant Garamond', serif;
      font-size: 28px; font-weight: 700;
      color: var(--t3); line-height: 1;
      padding-bottom: 18px;
    }

    /* Progress bar */
    .iw-progress-wrap { display: flex; flex-direction: column; gap: 6px; }
    .iw-progress-labels {
      display: flex; justify-content: space-between;
      font-size: 10.5px; color: var(--t3); font-weight: 500;
    }
    .iw-progress-labels span { display: flex; align-items: center; gap: 4px; }
    .iw-progress-track {
      position: relative; height: 6px;
      background: var(--iw-track); border-radius: 9999px; overflow: visible;
    }
    .iw-progress-fill {
      position: absolute; top: 0; left: 0; bottom: 0;
      background: linear-gradient(90deg, var(--gold-b), var(--gold));
      border-radius: 9999px;
      transition: width 1s linear;
    }
    .iw-progress-thumb {
      position: absolute; top: 50%; transform: translate(-50%, -50%);
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--gold); border: 2px solid var(--sf);
      box-shadow: 0 0 0 2px var(--gold-brd);
      transition: left 1s linear;
    }
    .iw-progress-pct {
      font-size: 10.5px; color: var(--t3); font-weight: 500; text-align: right;
    }

    /* Passed state */
    .iw-iftar-passed {
      display: flex; align-items: center; gap: 12px;
      background: var(--sf2); border: 1px solid var(--bd);
      border-radius: 14px; padding: 14px 16px;
    }
    .iw-iftar-passed-icon { font-size: 24px; flex-shrink: 0; }
    .iw-iftar-passed-title { font-size: 14px; font-weight: 600; color: var(--t1); display: block; }
    .iw-iftar-passed-sub { font-size: 12px; color: var(--t2); display: block; }

    /* Off-season */
    .iw-off-season { display: flex; align-items: center; gap: 14px; }
    .iw-crescent { width: 36px; height: 36px; flex-shrink: 0; }
    .iw-off-text { font-size: 13px; color: var(--t2); font-weight: 400; }

    /* Next prayer */
    .iw-next-prayer {
      display: flex; justify-content: space-between; align-items: center;
      background: var(--sf2); border: 1px solid var(--bd);
      border-radius: 14px; padding: 13px 16px;
    }
    .iw-np-left { display: flex; flex-direction: column; gap: 2px; }
    .iw-np-label { font-size: 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--t3); }
    .iw-np-name { font-size: 15px; font-weight: 600; color: var(--t1); }
    .iw-np-ar { font-size: 13px; color: var(--t2); margin-left: 6px; }
    .iw-np-time { font-size: 17px; font-weight: 600; color: var(--gold-t); font-variant-numeric: tabular-nums; }
    [data-theme="dark"] .iw-np-time { color: var(--gold); }

    /* Prayer pills */
    .iw-prayers-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: -4px; }
    .iw-prayer-pill {
      display: flex; flex-direction: column; align-items: center; gap: 1px;
      padding: 7px 10px; border-radius: 10px;
      background: var(--sf2); border: 1px solid var(--bd);
      flex: 1; min-width: 0; transition: all 0.2s;
    }
    .iw-pill--passed { opacity: 0.45; }
    .iw-pill--next {
      background: var(--gold-dim); border-color: var(--gold-brd);
    }
    .iw-pill-name { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--t3); }
    .iw-pill--next .iw-pill-name { color: var(--gold-t); }
    [data-theme="dark"] .iw-pill--next .iw-pill-name { color: var(--gold); }
    .iw-pill-time { font-size: 11px; font-weight: 500; color: var(--t1); font-variant-numeric: tabular-nums; white-space: nowrap; }

    /* Footer CTA */
    .iw-footer-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.03em;
      color: var(--gold-t); text-decoration: none;
      transition: gap 0.2s;
      margin-top: 4px;
    }
    [data-theme="dark"] .iw-footer-link { color: var(--gold); }
    .iw-footer-link:hover { gap: 8px; }

    /* ═══ SECTIONS ═══════════════════════════════════════════ */
    .rb-section{padding:96px 0;position:relative;}
    @media(min-width:768px){.rb-section{padding:120px 0;}}
    .rb-section--alt{background:var(--bg-alt);}
    .rb-section-rule{position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--bd-med),transparent);}
    .rb-section-header{margin-bottom:60px;}
    .rb-sh--center{text-align:center;margin-bottom:72px;}
    .rb-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--t3);margin-bottom:14px;}
    .rb-eyebrow--faint{color:rgba(184,144,10,0.55);}
    [data-theme="dark"] .rb-eyebrow--faint{color:rgba(212,168,83,0.6);}
    .rb-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--t3);flex-shrink:0;}
    .rb-dot--gold{background:var(--gold);}
    .rb-dot--emerald{background:var(--emerald);}
    .rb-section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,5vw,54px);font-weight:700;letter-spacing:-0.025em;line-height:1.07;color:var(--t1);}
    .rb-title--left{text-align:left;}
    .rb-muted{color:var(--t3);}
    .rb-section-sub{font-size:clamp(14.5px,2vw,17px);color:var(--t2);font-weight:300;line-height:1.72;margin-top:12px;}
    .rb-sub--left{text-align:left;}

    /* BENTO */
    .rb-bento{display:grid;grid-template-columns:1fr;gap:14px;}
    @media(min-width:768px){.rb-bento{grid-template-columns:repeat(3,1fr);}.rb-bcard--w2{grid-column:span 2;}}
    .rb-bcard{position:relative;overflow:hidden;background:var(--card);border:1px solid var(--bd);border-radius:22px;padding:30px;display:flex;flex-direction:column;gap:12px;transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s;box-shadow:var(--card-sh);}
    .rb-bcard::after{content:'';position:absolute;inset:0;border-radius:22px;pointer-events:none;background:linear-gradient(140deg,rgba(255,255,255,0.06) 0%,transparent 55%);}
    [data-theme="light"] .rb-bcard::after{background:linear-gradient(140deg,rgba(255,255,255,0.7) 0%,transparent 50%);}
    .rb-bcard:hover{border-color:var(--gold-brd);box-shadow:var(--card-hover);transform:translateY(-2px);}
    .rb-bcard-glow{position:absolute;width:170px;height:170px;border-radius:50%;filter:blur(50px);pointer-events:none;right:-20px;bottom:-20px;opacity:0;transition:opacity 0.5s;}
    .rb-bcard:hover .rb-bcard-glow{opacity:1;}
    .rb-glow--gold{background:var(--gold-dim);opacity:0.7;}.rb-glow--emerald{background:var(--em-dim);}.rb-glow--purple{background:var(--pu-dim);}.rb-glow--amber{background:var(--am-dim);}.rb-glow--blue{background:var(--bl-dim);}
    .rb-bcard-ico{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;border:1px solid transparent;transition:transform 0.3s;}
    .rb-bcard:hover .rb-bcard-ico{transform:scale(1.09);}
    .rb-ico--gold{background:var(--gold-dim);color:var(--gold);border-color:var(--gold-brd);}.rb-ico--emerald{background:var(--em-dim);color:var(--emerald);border-color:var(--em-brd);}.rb-ico--purple{background:var(--pu-dim);color:var(--purple);border-color:var(--pu-brd);}.rb-ico--amber{background:var(--am-dim);color:var(--amber);border-color:var(--am-brd);}.rb-ico--blue{background:var(--bl-dim);color:var(--blue);border-color:var(--bl-brd);}
    .rb-bcard-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;letter-spacing:-0.01em;color:var(--t1);}
    .rb-bcard-desc{font-size:13.5px;line-height:1.72;color:var(--t2);font-weight:300;}
    .rb-bcard-tag{align-self:flex-start;margin-top:6px;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--gold);background:var(--gold-dim);border:1px solid var(--gold-brd);padding:5px 12px;border-radius:9999px;}
    .rb-streak-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;}
    .rb-pip{width:16px;height:16px;border-radius:5px;transition:transform 0.15s;}
    .rb-pip:hover{transform:scale(1.4);}
    .rb-pip--on{background:linear-gradient(135deg,var(--gold-b),var(--gold));}.rb-pip--today{background:var(--emerald);box-shadow:0 0 7px var(--em-dim);}.rb-pip--off{background:var(--sf2);border:1px solid var(--bd);}

    /* READER */
    .rb-reader-grid{display:grid;grid-template-columns:1fr;gap:56px;align-items:center;}
    @media(min-width:1024px){.rb-reader-grid{grid-template-columns:1fr 1fr;}}
    .rb-reader-left{display:flex;flex-direction:column;gap:0;}
    .rb-steps{display:flex;flex-direction:column;margin-top:8px;}
    .rb-step{display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-bottom:1px solid var(--bd);transition:border-color 0.3s;}
    .rb-step:last-child{border-bottom:none;}
    .rb-step:hover{border-color:var(--gold-brd);}
    .rb-step-n{font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700;color:var(--gold);background:var(--gold-dim);border:1px solid var(--gold-brd);border-radius:9999px;width:35px;height:35px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .rb-step-t{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--t1);letter-spacing:-0.01em;margin-bottom:4px;}
    .rb-step-d{font-size:13.5px;line-height:1.7;color:var(--t2);font-weight:300;}
    .rb-dist-card{background:var(--card);border:1px solid var(--bd);border-radius:22px;padding:34px;position:relative;overflow:hidden;box-shadow:var(--card-sh);}
    .rb-dist-glow{position:absolute;top:-40px;right:-40px;width:220px;height:220px;background:radial-gradient(circle,var(--em-dim) 0%,transparent 70%);pointer-events:none;border-radius:50%;}
    .rb-dist-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;}
    .rb-dist-heading{font-size:14.5px;font-weight:600;color:var(--t1);}
    .rb-badge{font-size:11px;font-weight:600;padding:3px 11px;border-radius:9999px;border:1px solid transparent;}
    .rb-badge--emerald{background:var(--em-dim);color:var(--emerald);border-color:var(--em-brd);}
    .rb-badge--amber{background:var(--am-dim);color:var(--amber);border-color:var(--am-brd);}
    .rb-dist-bar-wrap{margin-bottom:18px;}
    .rb-dist-bar{display:flex;height:9px;border-radius:9999px;overflow:hidden;gap:2px;margin-bottom:9px;}
    .rb-bar-seg{border-radius:9999px;}
    .rb-bar-seg--emerald{background:var(--emerald);opacity:0.65;}
    .rb-bar-seg--amber{background:var(--amber);opacity:0.65;}
    .rb-dist-legend{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--t2);}
    .rb-ldot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;font-style:normal;}
    .rb-ldot--emerald{background:var(--emerald);}.rb-ldot--amber{background:var(--amber);}
    .rb-dist-block{background:var(--sf2);border:1px solid var(--bd);border-radius:15px;padding:18px;margin-bottom:10px;}
    .rb-dist-block:last-child{margin-bottom:0;}
    .rb-dist-bh{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:var(--t1);margin-bottom:12px;}
    .rb-dist-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:9px;border-bottom:1px solid var(--bd);margin-bottom:9px;font-size:12.5px;}
    .rb-dist-row span:first-child{color:var(--t2);}.rb-dist-row span:last-child{color:var(--t1);font-weight:500;}
    .rb-dist-row--last{border-bottom:none;margin-bottom:0;padding-bottom:0;}

    /* SHOWCASE */
    .rb-showcase-section{background:var(--bg-alt);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:96px 0 120px;position:relative;overflow:hidden;}
    .rb-sc-glow-l{position:absolute;top:25%;left:-5%;width:320px;height:480px;background:radial-gradient(ellipse,var(--em-dim) 0%,transparent 70%);pointer-events:none;}
    .rb-sc-glow-r{position:absolute;top:20%;right:-5%;width:400px;height:480px;background:radial-gradient(ellipse,var(--gold-dim) 0%,transparent 70%);pointer-events:none;}
    .rb-stage{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding-top:16px;padding-bottom:44px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none;}
    .rb-stage::-webkit-scrollbar{display:none;}
    .rb-stage-item{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:18px;transform:rotate(var(--tilt)) translateY(var(--ty)) scale(var(--sc));transition:transform 0.5s cubic-bezier(0.16,1,0.3,1),z-index 0.1s;cursor:pointer;position:relative;z-index:1;}
    .rb-stage-item:hover{transform:rotate(0deg) translateY(-22px) scale(1.04) !important;z-index:20 !important;}
    .rb-sc-frame{position:relative;width:195px;height:410px;border-radius:40px;background:var(--phone-frame);padding:8px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.13),0 28px 70px -10px rgba(0,0,0,0.15),0 0 40px -15px var(--gold-dim);transition:box-shadow 0.4s;}
    [data-theme="dark"] .rb-sc-frame{box-shadow:inset 0 0 0 1px rgba(255,255,255,0.06),0 28px 70px -10px rgba(0,0,0,0.8),0 0 40px -15px rgba(212,168,83,0.1);}
    .rb-stage-item:hover .rb-sc-frame{box-shadow:0 40px 90px -10px rgba(0,0,0,0.2),0 0 60px -10px var(--gold-dim);}
    [data-theme="dark"] .rb-stage-item:hover .rb-sc-frame{box-shadow:0 40px 90px -10px rgba(0,0,0,0.9),0 0 60px -10px rgba(212,168,83,0.2);}
    .rb-sc-rim{position:absolute;inset:-1px;border-radius:41px;pointer-events:none;z-index:20;background:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 30%,transparent 70%,rgba(255,255,255,0.06) 100%);}
    .rb-sc-vol-up,.rb-sc-vol-down{position:absolute;left:-2.5px;width:2.5px;border-radius:2px 0 0 2px;background:var(--phone-btn);}
    .rb-sc-vol-up{top:72px;height:35px;}.rb-sc-vol-down{top:118px;height:35px;}
    .rb-sc-power{position:absolute;right:-2.5px;top:85px;width:2.5px;height:48px;border-radius:0 2px 2px 0;background:var(--phone-btn);}
    .rb-sc-inner{width:100%;height:100%;border-radius:33px;background:var(--phone-scr);overflow:hidden;position:relative;border:0.5px solid var(--phone-brd);}
    .rb-sc-island{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:62px;height:19px;background:#000;border-radius:12px;z-index:30;}
    .rb-sc-screen{position:absolute;inset:0;border-radius:33px;overflow:hidden;}
    .rb-sc-sheen{position:absolute;inset:0;z-index:10;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 35%);}
    .rb-sc-speaker{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);width:30px;height:3px;border-radius:2px;z-index:30;background:var(--phone-btn);}
    .rb-sc-glow-under{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);width:120px;height:36px;background:radial-gradient(ellipse,var(--gold-dim) 0%,transparent 70%);filter:blur(12px);pointer-events:none;z-index:-1;}
    .rb-sc-label{display:flex;flex-direction:column;align-items:center;gap:3px;}
    .rb-sc-label-t{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:600;color:var(--t1);letter-spacing:-0.01em;}
    .rb-sc-label-s{font-size:11px;color:var(--t2);}

    /* WHY */
    .rb-why-intro{display:grid;grid-template-columns:1fr;gap:28px;align-items:end;margin-bottom:56px;}
    @media(min-width:1024px){.rb-why-intro{grid-template-columns:1fr 1fr;}}
    .rb-why-grid{display:grid;grid-template-columns:1fr;border-top:1px solid var(--bd);}
    @media(min-width:640px){.rb-why-grid{grid-template-columns:repeat(2,1fr);}}
    @media(min-width:1024px){.rb-why-grid{grid-template-columns:repeat(3,1fr);}}
    .rb-why-card{padding:28px 22px 26px;border-right:1px solid var(--bd);border-bottom:1px solid var(--bd);display:flex;flex-direction:column;gap:7px;position:relative;overflow:hidden;transition:background 0.3s;}
    .rb-why-card:hover{background:var(--sf);}
    @media(min-width:1024px){.rb-why-card:nth-child(3n){border-right:none;}}
    @media(min-width:640px) and (max-width:1023px){.rb-why-card:nth-child(2n){border-right:none;}}
    @media(max-width:639px){.rb-why-card{border-right:none;}}
    .rb-why-n{font-family:'Cormorant Garamond',serif;font-size:11px;font-weight:700;letter-spacing:0.1em;color:var(--gold);opacity:0.8;}
    .rb-why-rule{width:26px;height:1px;background:var(--gold-brd);}
    .rb-why-t{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--t1);letter-spacing:-0.01em;}
    .rb-why-d{font-size:13px;line-height:1.75;color:var(--t2);font-weight:300;flex:1;}
    .rb-why-arr{color:var(--gold);opacity:0;transform:translate(-4px,4px);transition:opacity 0.3s,transform 0.3s;align-self:flex-end;}
    .rb-why-card:hover .rb-why-arr{opacity:1;transform:translate(0,0);}

    /* FAQ */
    .rb-faq-list{display:flex;flex-direction:column;gap:9px;margin-top:38px;}
    .rb-faq{background:var(--card);border:1px solid var(--bd);border-radius:17px;overflow:hidden;transition:border-color 0.3s;box-shadow:var(--card-sh);}
    .rb-faq[open]{border-color:var(--gold-brd);}
    .rb-faq summary::-webkit-details-marker{display:none;}
    .rb-faq-sum{display:flex;justify-content:space-between;align-items:center;padding:19px 22px;cursor:pointer;outline:none;list-style:none;gap:16px;transition:background 0.2s;}
    .rb-faq-sum:hover{background:var(--sf2);}
    .rb-faq-q{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;letter-spacing:-0.01em;color:var(--t1);}
    .rb-faq-ico{width:29px;height:29px;border-radius:50%;border:1px solid var(--bd-med);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--t2);transition:all 0.3s;}
    .rb-faq[open] .rb-faq-ico{background:var(--gold-dim);border-color:var(--gold-brd);color:var(--gold);rotate:45deg;}
    .rb-faq-a{padding:0 22px 18px;font-size:13.5px;line-height:1.75;color:var(--t2);font-weight:300;}

    /* CTA */
    .rb-cta{position:relative;padding:130px 0;text-align:center;overflow:hidden;background:var(--bg-alt);border-top:1px solid var(--bd);}
    .rb-cta-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 50% 0%,var(--gold-dim) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 50% 100%,var(--em-dim) 0%,transparent 60%);}
    .rb-cta-mesh{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 1.5px 1.5px,var(--bd) 1.5px,transparent 0);background-size:34px 34px;mask-image:radial-gradient(ellipse 65% 55% at 50% 50%,black 5%,transparent 100%);}
    .rb-cta-crescent{position:absolute;top:8%;right:8%;width:120px;height:120px;opacity:0.28;pointer-events:none;animation:rb-crescent 7s ease-in-out infinite;}
    [data-theme="light"] .rb-cta-crescent{opacity:0.18;}
    @keyframes rb-crescent{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-14px) rotate(5deg)}}
    .rb-cta-stars{position:absolute;inset:0;pointer-events:none;}
    .rb-star{position:absolute;background:var(--gold);border-radius:50%;animation:rb-twinkle var(--dur,3s) ease-in-out infinite;}
    @keyframes rb-twinkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:0.65;transform:scale(1)}}
    .rb-cta-inner{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;gap:18px;}
    .rb-cta-title{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,9vw,84px);font-weight:700;letter-spacing:-0.03em;line-height:1.02;color:var(--t1);}
    .rb-cta-sub{font-size:clamp(14px,2vw,17px);color:var(--t2);font-weight:300;line-height:1.72;max-width:500px;}
    .rb-cta-actions{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:8px;}

    /* FOOTER */
    .rb-footer{border-top:1px solid var(--bd);background:var(--bg);padding:72px 0 32px;}
    .rb-footer-grid{display:grid;grid-template-columns:1fr;gap:44px;margin-bottom:64px;}
    @media(min-width:768px){.rb-footer-grid{grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;}}
    .rb-footer-logo{display:flex;align-items:center;gap:9px;margin-bottom:14px;}
    .rb-footer-logo-mark{width:27px;height:27px;border-radius:8px;border:1px solid var(--gold-brd);background:var(--sf);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}
    .rb-footer-logo-t{font-weight:600;font-size:15px;color:var(--t1);letter-spacing:-0.01em;}
    .rb-footer-tag{font-size:13px;color:var(--t2);line-height:1.7;font-weight:300;max-width:270px;}
    .rb-footer-socials{display:flex;gap:8px;margin-top:18px;}
    .rb-social-pill{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--t2);text-decoration:none;padding:5px 12px;border-radius:9999px;border:1px solid var(--bd-med);transition:all 0.2s;}
    .rb-social-pill:hover{border-color:var(--gold-brd);color:var(--t1);}
    .rb-footer-h{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--t1);margin-bottom:18px;}
    .rb-footer-links{list-style:none;display:flex;flex-direction:column;gap:12px;}
    .rb-footer-link{font-size:13px;color:var(--t2);text-decoration:none;background:transparent;border:none;cursor:pointer;padding:0;text-align:left;transition:color 0.2s;font-family:'DM Sans',sans-serif;}
    .rb-footer-link:hover{color:var(--t1);}
    .rb-footer-link--ext{display:inline-flex;align-items:center;gap:3px;}
    .rb-footer-bottom{border-top:1px solid var(--bd);padding-top:26px;display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center;font-size:11.5px;color:var(--t3);}
    @media(min-width:640px){.rb-footer-bottom{flex-direction:row;justify-content:space-between;text-align:left;}}

    /* ANIMATIONS */
    @keyframes fadeInUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    .animate-fiu{opacity:0;animation:fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) forwards;}
  `;
}
