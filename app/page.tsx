'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, ArrowUpRight, ChevronDown, Plus } from 'lucide-react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="premium-theme" style={{
      backgroundColor: 'var(--bg-base)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      overflowX: 'hidden',
      transition: 'background-color 0.5s ease, color 0.5s ease'
    }}>
      <style dangerouslySetInnerHTML={{ __html: getGlobalCSS() }} />

      {/* ═══════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrollPosition > 20 ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-nav rounded-2xl px-6 h-16 flex justify-between items-center border border-[var(--border-nav)]">
            {/* Logo */}
            <Link href="" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
              <div className="logo-mark relative w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center border border-[var(--border-gold-faint)] group-hover:border-[var(--accent-gold)] transition-colors duration-300">
                <Image src="/logo.png" alt="RamadanBot Logo" fill className="object-contain p-1" priority />
              </div>
              <span className="font-semibold tracking-tight text-[16px] text-[var(--text-primary)]">RamadanBot</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex gap-8 items-center m-0 p-0 list-none">
              <li><Link href="" className="nav-link">Home</Link></li>
              <li><button onClick={() => scrollToSection('features')} className="nav-link">Features</button></li>
              <li><button onClick={() => scrollToSection('showcase')} className="nav-link">Showcase</button></li>
              <li><Link href="/prayer" className="nav-link">Prayer Times</Link></li>
              <li><Link href="/privacy" className="nav-link">Privacy</Link></li>
            </ul>

            <div className="flex items-center gap-4">
              <Link href="/app" className="btn-primary hidden sm:flex items-center gap-2 h-10 px-5 text-[14px]">
                Launch App <ArrowRight size={15} />
              </Link>
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent-gold)]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`absolute top-[80px] left-4 right-4 rounded-2xl glass-panel border border-[var(--border-subtle)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'max-h-[500px] opacity-100 p-2' : 'max-h-0 opacity-0 p-0 border-none'}`}>
          <div className="flex flex-col gap-1 p-2">
            <Link href="" className="nav-link-mobile">Home</Link>
            <button onClick={() => scrollToSection('features')} className="nav-link-mobile text-left">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="nav-link-mobile text-left">Showcase</button>
            <Link href="/prayer" className="nav-link-mobile">Prayer Times</Link>
            <Link href="/privacy" className="nav-link-mobile">Privacy</Link>
            <Link href="/contact" className="nav-link-mobile">Contact</Link>
            <Link href="/app" className="btn-primary w-full justify-center mt-4 h-12 text-center flex items-center">Launch App</Link>
          </div>
        </div>
      </nav>

      <main>

        {/* ═══════════════════════════════════════════
            HERO — SPLIT LAYOUT WITH PREMIUM PHONE
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center pt-28 pb-24 px-4 overflow-hidden">

          {/* Geometric star mesh background */}
          <div className="star-mesh-bg" aria-hidden="true" />

          {/* Atmospheric glows */}
          <div className="hero-glow-main" aria-hidden="true" />
          <div className="hero-glow-accent" aria-hidden="true" />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* ── Left: Text Column ── */}
              <div className="flex flex-col items-start animate-fade-in-up">

                {/* Pill badge */}
                <div className="pill-badge mb-8">
                  <span className="pulse-dot" />
                  <span className="text-[var(--accent-gold)] font-medium">Ramadan 1447</span>
                  <span className="pill-divider" />
                  <span>RamadanBot 3.0 is live</span>
                </div>

                <h1 className="hero-title">
                  Your sacred
                  <br />
                  <em className="text-gradient-gold not-italic">Ramadan</em>
                  <br />
                  companion.
                </h1>

                <p className="hero-subtitle mt-7 max-w-[480px]">
                  AI reflections rooted in Quranic wisdom. A beautifully structured Qur'ān reader. Studio-quality shareable flyers. All in one sacred space — completely free.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
                  <Link href="/app" className="btn-primary flex items-center justify-center gap-2 text-[16px] px-8 h-14">
                    Start for free <ArrowRight size={17} />
                  </Link>
                  <button onClick={() => scrollToSection('showcase')} className="btn-secondary flex items-center justify-center text-[16px] px-8 h-14">
                    See it in action
                  </button>
                </div>

                {/* Trust bar */}
                <div className="hero-trust-bar mt-12 pt-8 w-full">
                  <div className="trust-stat">
                    <span className="trust-number">10K+</span>
                    <span className="trust-label">Active Users</span>
                  </div>
                  <div className="trust-sep" />
                  <div className="trust-stat">
                    <span className="trust-number">100%</span>
                    <span className="trust-label">Free Forever</span>
                  </div>
                  <div className="trust-sep" />
                  <div className="trust-stat">
                    <span className="trust-number">29</span>
                    <span className="trust-label">Days Guided</span>
                  </div>
                  <div className="trust-sep" />
                  <div className="trust-stat">
                    <span className="trust-number">0</span>
                    <span className="trust-label">Ads. Ever.</span>
                  </div>
                </div>
              </div>

              {/* ── Right: Premium Phone Mockup ── */}
              <div className="flex justify-center lg:justify-end items-center relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Platform glow */}
                <div className="phone-platform-glow" />

                {/* The phone */}
                <div className="elite-phone-frame group">
                  {/* Outer metallic rim */}
                  <div className="phone-outer-rim" />
                  {/* Left volume buttons */}
                  <div className="phone-btn-vol-up" />
                  <div className="phone-btn-vol-down" />
                  <div className="phone-btn-silent" />
                  {/* Right power button */}
                  <div className="phone-btn-power" />
                  {/* Inner frame */}
                  <div className="phone-inner-frame">
                    {/* Dynamic island */}
                    <div className="phone-dynamic-island" />
                    {/* Screen */}
                    <div className="phone-screen-area">
                      {/* Reflection sheen */}
                      <div className="phone-screen-sheen" />
                      <Image
                        src="/generate.png"
                        alt="RamadanBot App Preview"
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        priority
                      />
                    </div>
                  </div>
                  {/* Bottom speaker notch */}
                  <div className="phone-speaker" />
                </div>

                {/* Floating notification chips */}
                <div className="float-chip float-chip-1 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="chip-icon-wrap chip-icon-gold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div className="chip-text">
                    <span className="chip-title">Streak Active</span>
                    <span className="chip-sub">Day 14 of Ramadan</span>
                  </div>
                </div>

                <div className="float-chip float-chip-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="chip-icon-wrap chip-icon-emerald">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  </div>
                  <div className="chip-text">
                    <span className="chip-title">Reflection Ready</span>
                    <span className="chip-sub">Surah Al-Baqarah · Verse 183</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
            <ChevronDown size={22} className="text-[var(--text-secondary)]" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURES — ELEVATED BENTO GRID
        ═══════════════════════════════════════════ */}
        <section id="features" className="py-36 px-4 relative">
          <div className="section-top-rule" />
          <div className="max-w-7xl mx-auto">

            <div className="mb-20">
              <div className="inline-flex items-center gap-2 section-eyebrow mb-5">
                <span className="eyebrow-dot" />
                <span>Core Features</span>
              </div>
              <h2 className="section-title">One app.<br /><span className="text-[var(--text-muted)]">Every act of worship.</span></h2>
            </div>

            {/* BENTO GRID */}
            <div className="bento-grid">

              {/* Card 1 — AI Reflections (wide) */}
              <div className="bento-card bento-card--wide bento-card--gold group">
                <div className="bento-card-glow bento-card-glow--gold" />
                <div className="bento-icon-wrap bento-icon-wrap--gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                  </svg>
                </div>
                <div className="bento-card-body">
                  <h3 className="bento-card-title">AI Reflections</h3>
                  <p className="bento-card-desc max-w-sm">Quranic-based spiritual reflections generated instantly by advanced AI, exclusively trained on authenticated Islamic scholarship and Tafsir. Deeply personal, profoundly accurate.</p>
                </div>
                <div className="bento-card-tag">Powered by Advanced LLM</div>
              </div>

              {/* Card 2 — Qur'an Reader */}
              <div className="bento-card group">
                <div className="bento-card-glow bento-card-glow--emerald" />
                <div className="bento-icon-wrap bento-icon-wrap--emerald">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                  </svg>
                </div>
                <h3 className="bento-card-title">Qur'ān Reader</h3>
                <p className="bento-card-desc">Professional 604-page reader with 5 daily prayer-aligned sessions. Auto-saves every 5 seconds.</p>
              </div>

              {/* Card 3 — Featured Name */}
              <div className="bento-card group">
                <div className="bento-card-glow bento-card-glow--purple" />
                <div className="bento-icon-wrap bento-icon-wrap--purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                </div>
                <h3 className="bento-card-title">Featured Name</h3>
                <p className="bento-card-desc">Every 1080px high-res flyer beautifully embeds your name in studio typography.</p>
              </div>

              {/* Card 4 — Streak Tracking (wide) */}
              <div className="bento-card bento-card--wide group" style={{ order: 4 }}>
                <div className="bento-card-glow bento-card-glow--amber" />
                <div className="bento-icon-wrap bento-icon-wrap--amber">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
                    <path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
                  </svg>
                </div>
                <div className="bento-card-body">
                  <h3 className="bento-card-title">Streak Tracking</h3>
                  <p className="bento-card-desc max-w-sm">Build and maintain your daily reflection streak with beautiful visual accountability. Every day counts. Every reflection matters.</p>
                </div>
                {/* Inline streak visualization */}
                <div className="streak-viz">
                  {Array.from({ length: 29 }, (_, i) => (
                    <div
                      key={i}
                      className={`streak-day ${i < 14 ? 'streak-day--active' : i === 14 ? 'streak-day--today' : 'streak-day--empty'}`}
                      title={`Day ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Card 5 — Easy Sharing */}
              <div className="bento-card group">
                <div className="bento-card-glow bento-card-glow--blue" />
                <div className="bento-icon-wrap bento-icon-wrap--blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                  </svg>
                </div>
                <h3 className="bento-card-title">One-Tap Share</h3>
                <p className="bento-card-desc">Instantly export studio-quality flyers to WhatsApp, Instagram, and X — with your name perfectly placed.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            QUR'AN READER — ARCHITECTURAL SPLIT
        ═══════════════════════════════════════════ */}
        <section className="py-36 px-4 relative overflow-hidden">
          <div className="section-top-rule" />
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

              {/* Left */}
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 section-eyebrow mb-5">
                    <span className="eyebrow-dot eyebrow-dot--emerald" />
                    <span>Qur'ān Reader</span>
                  </div>
                  <h2 className="section-title text-left">Structured reading,<br /><span className="text-[var(--text-muted)]">beautifully designed.</span></h2>
                  <p className="section-subtitle mt-6 text-left max-w-lg">
                    A meticulously crafted interface that transforms your daily reading into a seamless, focus-driven spiritual habit.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      n: '01',
                      title: '29-Day Structure',
                      desc: 'Complete all 604 pages with balanced daily assignments ensuring perfect, pressure-free progression.'
                    },
                    {
                      n: '02',
                      title: '5 Daily Prayer Phases',
                      desc: 'Read aligned with Fajr, Dhuhr, Asr, Maghrib, Isha — each session optimized for 10 focused minutes.'
                    },
                    {
                      n: '03',
                      title: 'Auto-Save Every 5 Seconds',
                      desc: 'Your position syncs silently in the background. Resume exactly where you left off, any time.'
                    }
                  ].map((item) => (
                    <div key={item.n} className="reader-feature-row group">
                      <div className="reader-step-num">{item.n}</div>
                      <div>
                        <h4 className="reader-step-title">{item.title}</h4>
                        <p className="reader-step-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Distribution card */}
              <div className="distribution-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-emerald)] opacity-5 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[20px] font-semibold tracking-tight text-[var(--text-primary)]">Daily Page Distribution</h3>
                    <div className="px-3 py-1 rounded-full text-[12px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">604 pages</div>
                  </div>

                  {/* Progress bar visualization */}
                  <div className="mb-8">
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                      <div className="flex-[20] bg-emerald-500/60 rounded-l-full" />
                      <div className="flex-[9] bg-amber-500/60 rounded-r-full" />
                    </div>
                    <div className="flex gap-4 text-[12px] text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/60" />Days 1–20 (400 pages)</span>
                      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/60" />Days 21–29 (204 pages)</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4">
                    <div className="dist-block">
                      <div className="dist-block-header">
                        <span>Days 1–20 · Standard Pace</span>
                        <span className="dist-block-badge">400 pages</span>
                      </div>
                      <div className="dist-row">
                        <span>Daily quota</span>
                        <span>20 pages</span>
                      </div>
                      <div className="dist-row">
                        <span>Per prayer session</span>
                        <span>4 pages</span>
                      </div>
                      <div className="dist-row dist-row--last">
                        <span>Est. time per day</span>
                        <span>~50 minutes</span>
                      </div>
                    </div>

                    <div className="dist-block">
                      <div className="dist-block-header">
                        <span>Days 21–29 · Final Push</span>
                        <span className="dist-block-badge dist-block-badge--amber">204 pages</span>
                      </div>
                      <div className="dist-row">
                        <span>Daily quota</span>
                        <span>22–23 pages</span>
                      </div>
                      <div className="dist-row dist-row--last">
                        <span>Per prayer session</span>
                        <span>5 pages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SHOWCASE — ULTRA-PREMIUM PHONE GALLERY
        ═══════════════════════════════════════════ */}
        <section id="showcase" className="showcase-section py-36 overflow-hidden relative">
          <div className="showcase-bg-glow-left" />
          <div className="showcase-bg-glow-right" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 section-eyebrow mb-5">
                <span className="eyebrow-dot eyebrow-dot--gold" />
                <span>App Showcase</span>
              </div>
              <h2 className="section-title">See it in action.</h2>
              <p className="section-subtitle mt-4 max-w-lg mx-auto">A stunning, native-feeling experience. Four powerful screens. One spiritual companion.</p>
            </div>

            {/* Four phones in dramatic staggered layout */}
            <div className="phone-showcase-stage">
              {[
                { title: 'Dashboard', image: '/login.png', desc: 'Stats & Streaks', tilt: '-8deg', translateY: '30px', scale: '0.92', zIndex: 1 },
                { title: 'AI Generator', image: '/generate.png', desc: 'Instant Reflection', tilt: '-3deg', translateY: '0px', scale: '0.98', zIndex: 2 },
                { title: 'Reader UI', image: '/Interface.jpg', desc: 'Smooth Navigation', tilt: '3deg', translateY: '0px', scale: '0.98', zIndex: 2 },
                { title: 'Share Hub', image: '/share.png', desc: 'High-Res Export', tilt: '8deg', translateY: '30px', scale: '0.92', zIndex: 1 },
              ].map((screen, idx) => (
                <div
                  key={idx}
                  className="showcase-phone-item group"
                  style={{
                    transform: `rotate(${screen.tilt}) translateY(${screen.translateY}) scale(${screen.scale})`,
                    zIndex: screen.zIndex,
                  }}
                >
                  {/* Phone */}
                  <div className="showcase-phone-frame">
                    <div className="showcase-phone-outer-rim" />
                    <div className="showcase-phone-vol-up" />
                    <div className="showcase-phone-vol-down" />
                    <div className="showcase-phone-power" />
                    <div className="showcase-phone-inner">
                      <div className="showcase-dynamic-island" />
                      <div className="showcase-screen">
                        <div className="showcase-screen-sheen" />
                        <Image
                          src={screen.image}
                          alt={screen.title}
                          fill
                          className="object-cover object-top transition-all duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                    <div className="showcase-phone-speaker" />
                    {/* Screen glow underneath */}
                    <div className="showcase-phone-glow" />
                  </div>

                  {/* Label */}
                  <div className="showcase-label">
                    <span className="showcase-label-title">{screen.title}</span>
                    <span className="showcase-label-sub">{screen.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHY RAMADANBOT — EDITORIAL GRID
        ═══════════════════════════════════════════ */}
        <section id="why" className="py-36 px-4 relative">
          <div className="section-top-rule" />
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-end">
              <div>
                <div className="inline-flex items-center gap-2 section-eyebrow mb-5">
                  <span className="eyebrow-dot" />
                  <span>Why RamadanBot</span>
                </div>
                <h2 className="section-title text-left">Built for focus.<br /><span className="text-[var(--text-muted)]">Engineered for peace.</span></h2>
              </div>
              <p className="section-subtitle text-left max-w-md self-end pb-2">
                Every design decision prioritizes your spiritual clarity. Nothing superfluous. Everything intentional.
              </p>
            </div>

            <div className="why-grid">
              {[
                {
                  n: '01',
                  title: 'Authentically Islamic',
                  desc: 'Grounded in Quranic verses and Tafsir-backed teachings, eliminating generic AI hallucinations that misrepresent the faith.'
                },
                {
                  n: '02',
                  title: 'Absolute Privacy',
                  desc: 'Just your name and PIN. Zero tracking, zero ads, zero data sold. Your spiritual journey stays between you and your Creator.'
                },
                {
                  n: '03',
                  title: 'Always Free',
                  desc: 'Full, unlimited access to every feature. No premium tiers, no paywalls, no dark patterns. Built for the ummah.'
                },
                {
                  n: '04',
                  title: 'Community Driven',
                  desc: 'Share your reflections, inspire your circle, and build collective accountability across your community.'
                },
                {
                  n: '05',
                  title: 'Premium Export',
                  desc: 'Studio-quality 1080px typographic flyers with your name elegantly embedded — ready for any platform.'
                },
                {
                  n: '06',
                  title: 'PWA Ready',
                  desc: 'Install instantly to your home screen. Works flawlessly offline and syncs silently in the background.'
                }
              ].map((item) => (
                <div key={item.n} className="why-card group">
                  <div className="why-card-num">{item.n}</div>
                  <div className="why-card-rule" />
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.desc}</p>
                  <div className="why-card-arrow">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FAQ — REFINED ACCORDION
        ═══════════════════════════════════════════ */}
        <section id="faq" className="py-36 px-4 relative">
          <div className="section-top-rule" />
          <div className="max-w-3xl mx-auto">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 section-eyebrow mb-5">
                <span className="eyebrow-dot eyebrow-dot--gold" />
                <span>FAQ</span>
              </div>
              <h2 className="section-title text-left">Common questions.</h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How does the AI generate reflections?',
                  a: 'We leverage advanced LLMs exclusively prompted with authenticated Islamic knowledge and Tafsir to generate profound, contextually accurate Quranic reflections. No generic content, no fabrication.'
                },
                {
                  q: 'Can I preview the flyer before sharing?',
                  a: 'Absolutely. The studio preview renders exactly how your 1080px flyer will export. You can regenerate infinitely until it resonates with you — with zero cost.'
                },
                {
                  q: 'How do I install RamadanBot as an app?',
                  a: 'Open RamadanBot in Safari or Chrome on your mobile device, tap "Share", and select "Add to Home Screen". It launches and functions identically to a native app.'
                },
                {
                  q: 'Is my personal data secure?',
                  a: 'We collect zero sensitive data. Only your display name is stored locally or via encrypted sync to render your personalized flyers. Privacy is our architectural foundation — not an afterthought.'
                },
                {
                  q: 'Are there any hidden costs?',
                  a: 'RamadanBot is a 100% free utility built for the ummah. Unlimited generations, unlimited Qur\'ān reading, premium exports — zero cost, forever.'
                }
              ].map((item, idx) => (
                <details key={idx} className="faq-item group">
                  <summary className="faq-summary">
                    <span className="faq-question">{item.q}</span>
                    <span className="faq-toggle">
                      <Plus size={16} />
                    </span>
                  </summary>
                  <div className="faq-answer">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA — DRAMATIC FULL BLEED
        ═══════════════════════════════════════════ */}
        <section className="cta-section py-48 px-4 text-center relative overflow-hidden">
          {/* Background layers */}
          <div className="cta-bg-gradient" />
          <div className="cta-grid-overlay" />

          {/* Crescent moon decoration */}
          <div className="cta-crescent" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M120 20C75 20 38 57 38 102C38 147 75 184 120 184C140 184 158 176 172 163C155 166 136 162 121 150C93 130 84 94 96 64C103 46 119 32 140 26C134 22 127 20 120 20Z"
                fill="url(#crescentGradient)"
                opacity="0.7"
              />
              <defs>
                <linearGradient id="crescentGradient" x1="38" y1="20" x2="172" y2="184" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D4A853" />
                  <stop offset="1" stopColor="#8B6A1F" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stars decoration */}
          <div className="cta-stars" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="cta-star" style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 90 + 5}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`
              }} />
            ))}
          </div>

          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 section-eyebrow section-eyebrow--light mb-8">
              <span className="eyebrow-dot eyebrow-dot--gold" />
              <span>Get Started Today</span>
            </div>

            <h2 className="cta-title">
              Begin your<br />
              <em className="text-gradient-gold not-italic">spiritual sprint.</em>
            </h2>

            <p className="cta-subtitle mt-6 max-w-lg">
              Join thousands of Muslims building meaningful daily habits this Ramadan. Zero friction, instant access, completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto justify-center">
              <Link href="/app" className="btn-primary-large flex items-center justify-center gap-2">
                Launch App — Free <ArrowUpRight size={18} />
              </Link>
              <button onClick={() => scrollToSection('features')} className="btn-secondary-large flex items-center justify-center">
                Explore features
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-[var(--border-subtle)] pt-20 pb-10 px-6 bg-[var(--bg-base)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-[var(--surface-raised)] border border-[var(--border-gold-faint)]">
                  <Image src="/logo.png" alt="Logo" width={18} height={18} className="object-contain" />
                </div>
                <span className="font-semibold tracking-tight text-[16px] text-[var(--text-primary)]">RamadanBot</span>
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)] max-w-xs">
                The modern digital companion for spiritual growth, authentic reflections, and seamless Qur'ān reading — built for the ummah.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="" target="_blank" rel="noopener noreferrer" className="social-pill">X (Twitter) <ArrowUpRight size={11} /></a>
                <a href="" target="_blank" rel="noopener noreferrer" className="social-pill">TikTok <ArrowUpRight size={11} /></a>
              </div>
            </div>

            <div>
              <p className="footer-heading">Product</p>
              <ul className="footer-links">
                <li><Link href="/app" className="footer-link">Launch App</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="footer-link">Features</button></li>
                <li><Link href="/prayer" className="footer-link">Prayer Times</Link></li>
              </ul>
            </div>

            <div>
              <p className="footer-heading">Company</p>
              <ul className="footer-links">
                <li><Link href="" className="footer-link">Home</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy</Link></li>
              </ul>
            </div>

            <div>
              <p className="footer-heading">Connect</p>
              <ul className="footer-links">
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link footer-link--external">X (Twitter) <ArrowUpRight size={12} /></a></li>
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link footer-link--external">TikTok <ArrowUpRight size={12} /></a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-[var(--text-tertiary)]">Designed & built by Abdallah Nangere</p>
            <p className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-2">
              <span>© {new Date().getFullYear()} RamadanBot.</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)] inline-block" />
              <span>All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  PREMIUM CSS — CELESTIAL ISLAMIC DARK THEME
// ═══════════════════════════════════════════════
function getGlobalCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Sora:wght@300;400;500;600;700&display=swap');

    :root {
      /* ── Celestial Dark Palette ── */
      --bg-base: #07080F;
      --surface-base: #0C0E1A;
      --surface-raised: #111320;
      --surface-hover: #181B2E;
      --border-subtle: rgba(255, 255, 255, 0.07);
      --border-nav: rgba(255, 255, 255, 0.08);
      --border-gold-faint: rgba(212, 168, 83, 0.2);
      --border-gold: rgba(212, 168, 83, 0.45);

      --text-primary: #EDE8DC;
      --text-secondary: #8A93AE;
      --text-tertiary: #424B64;
      --text-muted: #4D566F;

      --accent-gold: #D4A853;
      --accent-gold-bright: #F0C060;
      --accent-gold-dim: rgba(212, 168, 83, 0.15);
      --accent-emerald: #34D399;
      --accent-emerald-dim: rgba(52, 211, 153, 0.12);
      --accent-amber: #F59E0B;
      --accent-blue: #60A5FA;
      --accent-purple: #A78BFA;

      --glow-gold: rgba(212, 168, 83, 0.3);
      --glow-emerald: rgba(52, 211, 153, 0.25);
      --glow-blue: rgba(96, 165, 250, 0.2);

      --font-display: 'Cormorant Garamond', Georgia, serif;
      --font-body: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;

      --radius-phone: 52px;
      --radius-screen: 42px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: var(--bg-base);
      color: var(--text-primary);
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(212, 168, 83, 0.2); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(212, 168, 83, 0.4); }
    
    /* ─── SECTION DIVIDERS ─────────────────────── */
    .section-top-rule {
      position: absolute;
      top: 0; left: 50%; transform: translateX(-50%);
      width: 1px; height: 80px;
      background: linear-gradient(to bottom, transparent, var(--border-gold-faint), transparent);
      pointer-events: none;
    }

    /* ─── TYPOGRAPHY ───────────────────────────── */
    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(56px, 8vw, 96px);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.04;
      color: var(--text-primary);
    }
    .hero-subtitle {
      font-family: var(--font-body);
      font-size: clamp(16px, 2vw, 19px);
      font-weight: 300;
      line-height: 1.75;
      color: var(--text-secondary);
      letter-spacing: 0.01em;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(38px, 5vw, 60px);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.08;
      color: var(--text-primary);
    }
    .section-subtitle {
      font-size: clamp(16px, 2vw, 18px);
      color: var(--text-secondary);
      font-weight: 300;
      line-height: 1.7;
    }
    .cta-title {
      font-family: var(--font-display);
      font-size: clamp(52px, 8vw, 96px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.04;
      color: var(--text-primary);
    }
    .cta-subtitle {
      font-size: clamp(16px, 2vw, 19px);
      color: var(--text-secondary);
      font-weight: 300;
      line-height: 1.7;
    }

    /* Gold gradient text */
    .text-gradient-gold {
      background: linear-gradient(135deg, var(--accent-gold-bright) 0%, var(--accent-gold) 50%, #8B6A1F 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ─── SECTION EYEBROW ───────────────────────── */
    .section-eyebrow {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    .section-eyebrow--light {
      color: rgba(212, 168, 83, 0.7);
    }
    .eyebrow-dot {
      display: inline-block;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--text-secondary);
      flex-shrink: 0;
    }
    .eyebrow-dot--gold { background: var(--accent-gold); }
    .eyebrow-dot--emerald { background: var(--accent-emerald); }

    /* ─── NAVIGATION ───────────────────────────── */
    .glass-nav {
      background: rgba(7, 8, 15, 0.75);
      backdrop-filter: saturate(180%) blur(24px);
      -webkit-backdrop-filter: saturate(180%) blur(24px);
    }
    .glass-panel {
      background: rgba(11, 13, 26, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .logo-mark {
      background: linear-gradient(135deg, var(--surface-raised), var(--surface-hover));
    }
    .nav-link {
      font-family: var(--font-body);
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      letter-spacing: 0.01em;
      transition: color 0.2s ease;
    }
    .nav-link:hover { color: var(--text-primary); }
    .nav-link-mobile {
      font-family: var(--font-body);
      display: block;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 12px 16px;
      border-radius: 12px;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-link-mobile:hover { background: var(--surface-hover); color: var(--text-primary); }

    /* ─── BUTTONS ───────────────────────────────── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, var(--accent-gold-bright), var(--accent-gold));
      color: #07080F;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      letter-spacing: 0.01em;
      gap: 6px;
      white-space: nowrap;
    }
    .btn-primary:hover { transform: scale(1.03); filter: brightness(1.08); box-shadow: 0 8px 30px rgba(212, 168, 83, 0.35); }
    .btn-primary:active { transform: scale(0.98); }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      letter-spacing: 0.01em;
    }
    .btn-secondary:hover { border-color: var(--border-gold-faint); color: var(--text-primary); background: var(--surface-raised); }
    .btn-secondary:active { transform: scale(0.98); }

    /* Large CTA variants */
    .btn-primary-large {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 600;
      padding: 0 32px;
      height: 60px;
      background: linear-gradient(135deg, var(--accent-gold-bright), var(--accent-gold));
      color: #07080F;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      gap: 8px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      letter-spacing: 0.01em;
    }
    .btn-primary-large:hover { transform: scale(1.03); filter: brightness(1.1); box-shadow: 0 12px 40px rgba(212, 168, 83, 0.4); }
    .btn-secondary-large {
      display: inline-flex;
      align-items: center;
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      padding: 0 32px;
      height: 60px;
      background: rgba(255,255,255,0.06);
      color: var(--text-primary);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 9999px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.25s;
      text-decoration: none;
    }
    .btn-secondary-large:hover { background: rgba(255,255,255,0.1); border-color: var(--border-gold-faint); }

    /* ─── PILL BADGE ─────────────────────────────── */
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 9999px;
      background: rgba(212, 168, 83, 0.06);
      border: 1px solid rgba(212, 168, 83, 0.2);
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-secondary);
      backdrop-filter: blur(8px);
    }
    .pill-divider {
      display: inline-block;
      width: 1px;
      height: 12px;
      background: rgba(212, 168, 83, 0.25);
      flex-shrink: 0;
    }
    .pulse-dot {
      display: inline-block;
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--accent-emerald);
      animation: pulseDot 2s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
      50% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
    }

    /* ─── HERO BG ────────────────────────────────── */
    .star-mesh-bg {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 1px 1px, rgba(212, 168, 83, 0.07) 1px, transparent 0);
      background-size: 40px 40px;
      pointer-events: none;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
    }
    .hero-glow-main {
      position: absolute;
      top: 20%; right: 10%;
      width: 700px; height: 700px;
      background: radial-gradient(circle, rgba(212, 168, 83, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-glow-accent {
      position: absolute;
      bottom: 10%; left: 5%;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(52, 211, 153, 0.07) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    /* ─── TRUST BAR ─────────────────────────────── */
    .hero-trust-bar {
      display: flex;
      align-items: center;
      gap: 24px;
      border-top: 1px solid var(--border-subtle);
    }
    .trust-stat { display: flex; flex-direction: column; gap: 2px; }
    .trust-number {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .trust-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .trust-sep {
      width: 1px; height: 36px;
      background: var(--border-subtle);
      flex-shrink: 0;
    }

    /* ─── ELITE PHONE MOCKUP (HERO) ──────────────── */
    .phone-platform-glow {
      position: absolute;
      bottom: -60px; left: 50%;
      transform: translateX(-50%);
      width: 320px; height: 120px;
      background: radial-gradient(ellipse, rgba(212, 168, 83, 0.25) 0%, transparent 70%);
      filter: blur(20px);
      pointer-events: none;
      z-index: 0;
    }
    .elite-phone-frame {
      position: relative;
      width: 290px;
      height: 612px;
      border-radius: var(--radius-phone);
      background: linear-gradient(145deg, #1C1F2E, #0F1018);
      padding: 10px;
      z-index: 1;
      box-shadow:
        0 0 0 0.5px rgba(255,255,255,0.06),
        inset 0 0 0 1px rgba(255,255,255,0.08),
        inset 0 2px 6px rgba(255,255,255,0.04),
        0 40px 80px -20px rgba(0,0,0,0.9),
        0 0 60px -10px rgba(212, 168, 83, 0.12);
      transition: box-shadow 0.7s ease, transform 0.7s ease;
    }
    .elite-phone-frame:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow:
        0 0 0 0.5px rgba(255,255,255,0.08),
        inset 0 0 0 1px rgba(255,255,255,0.1),
        0 60px 120px -20px rgba(0,0,0,0.9),
        0 0 80px -10px rgba(212, 168, 83, 0.2);
    }
    /* Metallic rim highlight */
    .phone-outer-rim {
      position: absolute;
      inset: -1px;
      border-radius: calc(var(--radius-phone) + 1px);
      background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.06) 100%);
      pointer-events: none;
      z-index: 20;
    }
    /* Volume buttons */
    .phone-btn-vol-up, .phone-btn-vol-down, .phone-btn-silent {
      position: absolute;
      left: -3px;
      width: 3px;
      border-radius: 2px 0 0 2px;
      background: linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
    }
    .phone-btn-silent { top: 110px; height: 26px; }
    .phone-btn-vol-up { top: 155px; height: 52px; }
    .phone-btn-vol-down { top: 220px; height: 52px; }
    /* Power button */
    .phone-btn-power {
      position: absolute;
      right: -3px; top: 165px;
      width: 3px; height: 68px;
      border-radius: 0 2px 2px 0;
      background: linear-gradient(to left, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
    }
    /* Inner frame */
    .phone-inner-frame {
      width: 100%;
      height: 100%;
      border-radius: calc(var(--radius-phone) - 10px);
      background: #0A0A10;
      border: 0.5px solid rgba(255,255,255,0.06);
      overflow: hidden;
      position: relative;
    }
    /* Dynamic island */
    .phone-dynamic-island {
      position: absolute;
      top: 14px;
      left: 50%; transform: translateX(-50%);
      width: 96px; height: 28px;
      background: #000;
      border-radius: 20px;
      z-index: 30;
      box-shadow: inset 0 -2px 4px rgba(255,255,255,0.06), 0 2px 10px rgba(0,0,0,0.6);
    }
    /* Screen area */
    .phone-screen-area {
      position: absolute;
      inset: 0;
      border-radius: calc(var(--radius-phone) - 10px);
      overflow: hidden;
    }
    /* Screen sheen */
    .phone-screen-sheen {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%);
      z-index: 10;
      pointer-events: none;
      border-radius: inherit;
    }
    /* Speaker */
    .phone-speaker {
      position: absolute;
      bottom: 14px; left: 50%; transform: translateX(-50%);
      width: 48px; height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      z-index: 30;
    }

    /* ─── FLOATING CHIPS (HERO) ────────────────── */
    .float-chip {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(17, 19, 32, 0.9);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      white-space: nowrap;
    }
    .float-chip-1 { top: 14%; left: -20%; }
    .float-chip-2 { bottom: 18%; right: -15%; }
    @media (max-width: 1100px) {
      .float-chip-1 { top: 5%; left: 0; }
      .float-chip-2 { bottom: 5%; right: 0; }
    }
    @media (max-width: 767px) {
      .float-chip-1, .float-chip-2 { display: none; }
    }
    .chip-icon-wrap {
      width: 30px; height: 30px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .chip-icon-gold { background: rgba(212, 168, 83, 0.15); color: var(--accent-gold); }
    .chip-icon-emerald { background: rgba(52, 211, 153, 0.12); color: var(--accent-emerald); }
    .chip-text { display: flex; flex-direction: column; gap: 1px; }
    .chip-title { font-size: 12px; font-weight: 600; color: var(--text-primary); }
    .chip-sub { font-size: 10.5px; color: var(--text-secondary); }

    /* ─── FEATURE BENTO ──────────────────────────── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-auto-rows: auto;
      gap: 20px;
    }
    @media (min-width: 768px) {
      .bento-grid { grid-template-columns: repeat(3, 1fr); }
      .bento-card--wide { grid-column: span 2; }
    }
    .bento-card {
      position: relative;
      background: var(--surface-raised);
      border: 1px solid var(--border-subtle);
      border-radius: 28px;
      padding: 36px 36px 32px;
      overflow: hidden;
      transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .bento-card:hover {
      border-color: rgba(212, 168, 83, 0.2);
      box-shadow: 0 20px 60px -10px rgba(0,0,0,0.5), 0 0 40px -20px rgba(212, 168, 83, 0.1);
      transform: translateY(-2px);
    }
    /* Inner glow border */
    .bento-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 28px;
      background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 50%);
      pointer-events: none;
    }
    .bento-card-glow {
      position: absolute;
      width: 200px; height: 200px;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
      right: -30px; bottom: -30px;
    }
    .bento-card:hover .bento-card-glow { opacity: 1; }
    .bento-card-glow--gold { background: rgba(212, 168, 83, 0.2); }
    .bento-card-glow--emerald { background: rgba(52, 211, 153, 0.2); }
    .bento-card-glow--purple { background: rgba(167, 139, 250, 0.2); }
    .bento-card-glow--amber { background: rgba(245, 158, 11, 0.2); }
    .bento-card-glow--blue { background: rgba(96, 165, 250, 0.2); }

    .bento-icon-wrap {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      border: 1px solid transparent;
      transition: transform 0.3s ease;
    }
    .bento-card:hover .bento-icon-wrap { transform: scale(1.08); }
    .bento-icon-wrap--gold { background: rgba(212, 168, 83, 0.1); color: var(--accent-gold); border-color: rgba(212, 168, 83, 0.2); }
    .bento-icon-wrap--emerald { background: rgba(52, 211, 153, 0.1); color: var(--accent-emerald); border-color: rgba(52, 211, 153, 0.2); }
    .bento-icon-wrap--purple { background: rgba(167, 139, 250, 0.1); color: var(--accent-purple); border-color: rgba(167, 139, 250, 0.2); }
    .bento-icon-wrap--amber { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); border-color: rgba(245, 158, 11, 0.2); }
    .bento-icon-wrap--blue { background: rgba(96, 165, 250, 0.1); color: var(--accent-blue); border-color: rgba(96, 165, 250, 0.2); }

    .bento-card-title {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .bento-card-desc {
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--text-secondary);
      font-weight: 300;
    }
    .bento-card-body { flex: 1; }
    .bento-card-tag {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-gold);
      background: rgba(212, 168, 83, 0.08);
      border: 1px solid rgba(212, 168, 83, 0.15);
      padding: 5px 12px;
      border-radius: 9999px;
      margin-top: 8px;
    }

    /* ── Streak visualization ── */
    .streak-viz {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 12px;
    }
    .streak-day {
      width: 18px; height: 18px;
      border-radius: 5px;
      transition: transform 0.2s;
    }
    .streak-day:hover { transform: scale(1.3); }
    .streak-day--active { background: linear-gradient(135deg, var(--accent-gold-bright), var(--accent-gold)); }
    .streak-day--today { background: var(--accent-emerald); box-shadow: 0 0 8px rgba(52,211,153,0.5); }
    .streak-day--empty { background: var(--surface-hover); border: 1px solid var(--border-subtle); }

    /* ─── READER SECTION ─────────────────────────── */
    .reader-feature-row {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      padding: 20px 0;
      border-bottom: 1px solid var(--border-subtle);
      transition: border-color 0.3s;
    }
    .reader-feature-row:last-child { border-bottom: none; }
    .reader-feature-row:hover { border-color: rgba(212, 168, 83, 0.15); }
    .reader-step-num {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--accent-gold);
      background: rgba(212, 168, 83, 0.08);
      border: 1px solid rgba(212, 168, 83, 0.2);
      border-radius: 9999px;
      width: 38px; height: 38px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      letter-spacing: 0.02em;
    }
    .reader-step-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      margin-bottom: 5px;
    }
    .reader-step-desc {
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-secondary);
      font-weight: 300;
    }

    .distribution-card {
      background: var(--surface-raised);
      border: 1px solid var(--border-subtle);
      border-radius: 28px;
      padding: 40px;
    }
    .dist-block {
      background: var(--surface-base);
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
      padding: 22px;
    }
    .dist-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 14px;
      letter-spacing: 0.01em;
    }
    .dist-block-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 9999px;
      background: rgba(52, 211, 153, 0.1);
      color: var(--accent-emerald);
      border: 1px solid rgba(52, 211, 153, 0.2);
    }
    .dist-block-badge--amber {
      background: rgba(245, 158, 11, 0.1);
      color: var(--accent-amber);
      border-color: rgba(245, 158, 11, 0.2);
    }
    .dist-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 10px;
      font-size: 13.5px;
    }
    .dist-row span:first-child { color: var(--text-secondary); }
    .dist-row span:last-child { color: var(--text-primary); font-weight: 500; }
    .dist-row--last { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

    /* ─── SHOWCASE ───────────────────────────────── */
    .showcase-section {
      background: var(--surface-base);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }
    .showcase-bg-glow-left {
      position: absolute;
      top: 30%; left: -5%;
      width: 400px; height: 600px;
      background: radial-gradient(ellipse, rgba(52, 211, 153, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .showcase-bg-glow-right {
      position: absolute;
      top: 20%; right: -5%;
      width: 500px; height: 600px;
      background: radial-gradient(ellipse, rgba(212, 168, 83, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .phone-showcase-stage {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: -20px;
      padding-bottom: 32px;
      flex-wrap: nowrap;
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      padding-left: 20px;
      padding-right: 20px;
    }
    .phone-showcase-stage::-webkit-scrollbar { display: none; }
    .showcase-phone-item {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), z-index 0.1s;
    }
    .showcase-phone-item:hover {
      transform: rotate(0deg) translateY(-20px) scale(1.04) !important;
      z-index: 10 !important;
    }
    /* Showcase phone frame */
    .showcase-phone-frame {
      position: relative;
      width: 240px; height: 504px;
      border-radius: 48px;
      background: linear-gradient(145deg, #1A1D2C, #0E1018);
      padding: 9px;
      box-shadow:
        0 0 0 0.5px rgba(255,255,255,0.06),
        inset 0 0 0 1px rgba(255,255,255,0.07),
        0 30px 80px -10px rgba(0,0,0,0.8),
        0 0 40px -10px rgba(212, 168, 83, 0.08);
    }
    .showcase-phone-outer-rim {
      position: absolute; inset: -1px;
      border-radius: 49px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.05) 100%);
      pointer-events: none; z-index: 20;
    }
    .showcase-phone-vol-up, .showcase-phone-vol-down {
      position: absolute; left: -2.5px;
      width: 2.5px; border-radius: 2px 0 0 2px;
      background: rgba(255,255,255,0.08);
    }
    .showcase-phone-vol-up { top: 90px; height: 40px; }
    .showcase-phone-vol-down { top: 145px; height: 40px; }
    .showcase-phone-power {
      position: absolute; right: -2.5px; top: 110px;
      width: 2.5px; height: 55px;
      border-radius: 0 2px 2px 0;
      background: rgba(255,255,255,0.08);
    }
    .showcase-phone-inner {
      width: 100%; height: 100%;
      border-radius: 40px;
      background: #08080E;
      overflow: hidden;
      position: relative;
      border: 0.5px solid rgba(255,255,255,0.05);
    }
    .showcase-dynamic-island {
      position: absolute;
      top: 12px; left: 50%; transform: translateX(-50%);
      width: 78px; height: 22px;
      background: #000;
      border-radius: 14px;
      z-index: 30;
    }
    .showcase-screen {
      position: absolute; inset: 0;
      border-radius: 40px;
      overflow: hidden;
    }
    .showcase-screen-sheen {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 35%);
      z-index: 10; pointer-events: none;
    }
    .showcase-phone-speaker {
      position: absolute;
      bottom: 11px; left: 50%; transform: translateX(-50%);
      width: 38px; height: 3px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      z-index: 30;
    }
    .showcase-phone-glow {
      position: absolute;
      bottom: -30px; left: 50%; transform: translateX(-50%);
      width: 160px; height: 60px;
      background: radial-gradient(ellipse, rgba(212, 168, 83, 0.2) 0%, transparent 70%);
      filter: blur(15px);
      pointer-events: none; z-index: -1;
    }
    .showcase-label {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      transition: opacity 0.3s;
    }
    .showcase-label-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .showcase-label-sub {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* ─── WHY SECTION ────────────────────────────── */
    .why-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 0;
      border-top: 1px solid var(--border-subtle);
    }
    @media (min-width: 768px) {
      .why-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .why-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .why-card {
      padding: 36px 28px 32px;
      border-right: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      position: relative;
      overflow: hidden;
      transition: background 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .why-card:hover { background: var(--surface-raised); }
    .why-card:nth-child(3n) { border-right: none; }
    @media (max-width: 1023px) {
      .why-card:nth-child(3n) { border-right: 1px solid var(--border-subtle); }
      .why-card:nth-child(2n) { border-right: none; }
    }
    @media (max-width: 767px) {
      .why-card { border-right: none; }
    }
    .why-card-num {
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 700;
      color: var(--accent-gold);
      letter-spacing: 0.08em;
      opacity: 0.7;
    }
    .why-card-rule {
      width: 32px; height: 1px;
      background: var(--border-gold-faint);
      margin: 4px 0;
    }
    .why-card-title {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .why-card-desc {
      font-size: 13.5px;
      line-height: 1.75;
      color: var(--text-secondary);
      font-weight: 300;
      flex: 1;
    }
    .why-card-arrow {
      opacity: 0;
      color: var(--accent-gold);
      transition: opacity 0.3s, transform 0.3s;
      transform: translate(-4px, 4px);
      align-self: flex-end;
    }
    .why-card:hover .why-card-arrow { opacity: 1; transform: translate(0, 0); }

    /* ─── FAQ ─────────────────────────────────────── */
    .faq-item {
      background: var(--surface-raised);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      overflow: hidden;
      transition: border-color 0.3s;
    }
    .faq-item[open] {
      border-color: rgba(212, 168, 83, 0.2);
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 22px 26px;
      cursor: pointer;
      outline: none;
      list-style: none;
      transition: background 0.2s;
      gap: 16px;
    }
    .faq-summary:hover { background: var(--surface-hover); }
    .faq-question {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .faq-toggle {
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 1px solid var(--border-subtle);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: var(--text-secondary);
      transition: all 0.3s;
    }
    .faq-item[open] .faq-toggle {
      background: rgba(212, 168, 83, 0.1);
      border-color: rgba(212, 168, 83, 0.3);
      color: var(--accent-gold);
      rotate: 45deg;
    }
    .faq-answer {
      padding: 0 26px 22px;
      font-size: 14.5px;
      line-height: 1.75;
      color: var(--text-secondary);
      font-weight: 300;
    }

    /* ─── CTA SECTION ────────────────────────────── */
    .cta-section {
      position: relative;
    }
    .cta-bg-gradient {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212, 168, 83, 0.08) 0%, transparent 60%),
                  radial-gradient(ellipse 60% 40% at 50% 100%, rgba(52, 211, 153, 0.05) 0%, transparent 60%),
                  var(--surface-base);
      pointer-events: none;
    }
    .cta-grid-overlay {
      position: absolute; inset: 0;
      background-image: radial-gradient(circle at 1px 1px, rgba(212, 168, 83, 0.05) 1px, transparent 0);
      background-size: 36px 36px;
      pointer-events: none;
      mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%);
    }
    .cta-crescent {
      position: absolute;
      top: 8%; right: 8%;
      width: 140px; height: 140px;
      opacity: 0.35;
      pointer-events: none;
      animation: floatCrescent 6s ease-in-out infinite;
    }
    @keyframes floatCrescent {
      0%, 100% { transform: translateY(0px) rotate(-5deg); }
      50% { transform: translateY(-12px) rotate(5deg); }
    }
    .cta-stars {
      position: absolute; inset: 0;
      pointer-events: none;
    }
    .cta-star {
      position: absolute;
      background: var(--accent-gold);
      border-radius: 50%;
      opacity: 0;
      animation: twinkle 4s ease-in-out infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 0.6; transform: scale(1); }
    }

    /* ─── FOOTER ─────────────────────────────────── */
    .footer-heading {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-primary);
      margin-bottom: 20px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .footer-link {
      font-size: 13.5px;
      color: var(--text-secondary);
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      text-align: left;
      transition: color 0.2s;
      font-family: var(--font-body);
    }
    .footer-link:hover { color: var(--text-primary); }
    .footer-link--external {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .social-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;
    }
    .social-pill:hover { border-color: var(--border-gold-faint); color: var(--text-primary); }

    /* ─── ANIMATIONS ─────────────────────────────── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
}
