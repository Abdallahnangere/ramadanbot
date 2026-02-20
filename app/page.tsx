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

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="apple-theme" style={{ 
      backgroundColor: 'var(--bg-main)', 
      color: 'var(--text-primary)',
      minHeight: '100vh',
      overflowX: 'hidden',
      transition: 'background-color 0.4s ease, color 0.4s ease'
    }}>
      <style dangerouslySetInnerHTML={{ __html: getGlobalCSS() }} />

      {/* ════════════════════════════════════════════════
          PREMIUM NAVIGATION
      ════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        background: scrollPosition > 20 ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrollPosition > 20 ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: scrollPosition > 20 ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrollPosition > 20 ? '1px solid var(--divider)' : '1px solid transparent',
        transition: 'all 0.4s ease'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          
          {/* Logo */}
          <Link href="" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div className="relative w-7 h-7">
              <Image src="/logo.png" alt="Ramadan Bot Logo" fill className="object-contain" priority />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>RamadanBot</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8 items-center" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li><Link href="" className="nav-link">Home</Link></li>
            <li><button onClick={() => scrollToSection('features')} className="nav-link bg-transparent border-none cursor-pointer">Features</button></li>
            <li><button onClick={() => scrollToSection('showcase')} className="nav-link bg-transparent border-none cursor-pointer">Showcase</button></li>
            <li><Link href="/prayer" className="nav-link">Prayer Times</Link></li>
            <li><Link href="/privacy" className="nav-link">Privacy</Link></li>
            <li><Link href="/contact" className="nav-link">Contact</Link></li>
          </ul>

          {/* CTA & Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/app" className="btn-primary hidden sm:flex items-center gap-1">
              Launch App
            </Link>
            
            <button
              className="md:hidden bg-transparent border-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'var(--nav-bg)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid var(--divider)',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
          maxHeight: isMenuOpen ? '400px' : '0',
          opacity: isMenuOpen ? 1 : 0,
        }}>
          <div className="px-4 py-4 flex flex-col gap-4">
            <Link href="" className="nav-link-mobile">Home</Link>
            <button onClick={() => scrollToSection('features')} className="nav-link-mobile text-left">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="nav-link-mobile text-left">Showcase</button>
            <Link href="/prayer" className="nav-link-mobile">Prayer Times</Link>
            <Link href="/privacy" className="nav-link-mobile">Privacy</Link>
            <Link href="/contact" className="nav-link-mobile">Contact</Link>
            <Link href="/app" className="btn-primary text-center mt-2">Launch App</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════ */}
        <section className="pt-40 pb-24 px-4 relative flex flex-col items-center justify-center text-center min-h-[90vh]">
          {/* Ambient Background Blur */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-slide-up">
            <div className="space-y-4">
              <h1 className="hero-title">
                Your Ramadan <br />
                <span style={{ color: 'var(--text-secondary)' }}>Companion.</span>
              </h1>
              <p className="hero-subtitle max-w-2xl mx-auto mt-6">
                Generate authentic Islamic reflections, create beautiful personalized flyers, and read the Qur'ān with a seamless, professional interface.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/app" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
                Start Free <ArrowRight size={20} />
              </Link>
              <button onClick={() => scrollToSection('showcase')} className="btn-secondary text-lg px-8 py-4">
                See In Action
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 flex justify-center w-full animate-bounce">
            <ChevronDown size={24} color="var(--text-secondary)" />
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FEATURES (BENTO GRID)
        ════════════════════════════════════════════════ */}
        <section id="features" className="py-24 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Everything you need.</h2>
              <p className="section-subtitle">Powerful features designed for your spiritual journey.</p>
            </div>

            <div className="bento-grid">
              {/* Feature 1 */}
              <div className="bento-item col-span-1 md:col-span-2 bg-gradient-to-br from-[var(--glass-bg)] to-transparent">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="bento-title">AI Reflections</h3>
                <p className="bento-desc">Quranic-based spiritual reflections powered by advanced AI. Generated instantly and deeply personalized for your daily growth.</p>
              </div>

              {/* Feature 2 */}
              <div className="bento-item col-span-1">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="bento-title">Qur'ān Reader</h3>
                <p className="bento-desc">Professional 604-page reader with automatic progress saving.</p>
              </div>

              {/* Feature 3 */}
              <div className="bento-item col-span-1">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="bento-title">Featured Name</h3>
                <p className="bento-desc">Every 1080px high-res flyer beautifully embeds your name.</p>
              </div>

              {/* Feature 4 */}
              <div className="bento-item col-span-1">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="bento-title">Easy Sharing</h3>
                <p className="bento-desc">One-tap export to WhatsApp, Instagram, and X.</p>
              </div>

              {/* Feature 5 */}
              <div className="bento-item col-span-1 md:col-span-2 bg-gradient-to-tr from-[var(--glass-bg)] to-transparent">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="bento-title">Streak Tracking</h3>
                <p className="bento-desc">Build and maintain your daily reflection streak. A beautiful visual representation of your consistency and accountability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            QUR'AN READER DETAILS
        ════════════════════════════════════════════════ */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Qur'ān Reader v3.0</h2>
              <p className="section-subtitle">A meticulously designed interface for structured reading.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bento-item">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h3 className="bento-title mb-2">29-Day Structure</h3>
                    <p className="bento-desc">Complete the full 604-page Qur'ān over Ramadan with perfectly balanced daily assignments ensuring spiritual progression.</p>
                  </div>
                </div>
              </div>

              <div className="bento-item">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="bento-title mb-2">5 Daily Phases</h3>
                    <p className="bento-desc">Read aligned with prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha. Each phase is optimized for 10-15 minutes.</p>
                  </div>
                </div>
              </div>

              <div className="bento-item">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💾</div>
                  <div>
                    <h3 className="bento-title mb-2">Auto-Saving</h3>
                    <p className="bento-desc">Your reading position saves automatically every 5 seconds. Resume exactly where you left off across all devices.</p>
                  </div>
                </div>
              </div>

              <div className="bento-item">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎨</div>
                  <div>
                    <h3 className="bento-title mb-2">Professional UI</h3>
                    <p className="bento-desc">Dark mode, zoom controls, swipe navigation, and intuitive dropdowns. Optimized for phones, tablets, and desktops.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bento-item border border-[var(--divider)]">
              <h3 className="text-2xl font-semibold mb-6 text-center">Reading Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-main)' }}>
                  <h4 className="font-semibold mb-3">Days 1-20: Standard Pace</h4>
                  <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex justify-between border-b border-[var(--divider)] pb-2"><span>Daily Quota</span> <span style={{ color: 'var(--text-primary)' }}>20 pages</span></li>
                    <li className="flex justify-between border-b border-[var(--divider)] pb-2"><span>Per Phase</span> <span style={{ color: 'var(--text-primary)' }}>4 pages</span></li>
                    <li className="flex justify-between"><span>Total Range</span> <span style={{ color: 'var(--text-primary)' }}>400 pages</span></li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-main)' }}>
                  <h4 className="font-semibold mb-3">Days 21-29: Final Push</h4>
                  <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex justify-between border-b border-[var(--divider)] pb-2"><span>Daily Quota</span> <span style={{ color: 'var(--text-primary)' }}>22-23 pages</span></li>
                    <li className="flex justify-between border-b border-[var(--divider)] pb-2"><span>Per Phase</span> <span style={{ color: 'var(--text-primary)' }}>5 pages</span></li>
                    <li className="flex justify-between"><span>Total Range</span> <span style={{ color: 'var(--text-primary)' }}>204 pages</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SHOWCASE (APPLE-STYLE HARDWARE MOCKUPS)
        ════════════════════════════════════════════════ */}
        <section id="showcase" className="py-24" style={{ backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="section-title">See it in action.</h2>
              <p className="section-subtitle">A stunning experience on every device.</p>
            </div>

            {/* Horizontal scroll container for phones */}
            <div className="phone-gallery-container flex md:justify-center overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-4 px-4 -mx-4">
              {[
                { title: 'Dashboard', image: '/login.png', desc: 'Stats & Streaks' },
                { title: 'AI Generator', image: '/generate.png', desc: 'Instant Creation' },
                { title: 'Share Hub', image: '/share.png', desc: 'High-Res Export' },
                { title: 'Qur\'ān Guide', image: '/Guide.jpg', desc: '29-Day Plan' },
                { title: 'Reader UI', image: '/Interface.jpg', desc: 'Smooth Navigation' }
              ].map((screen, idx) => (
                <div key={idx} className="flex-shrink-0 snap-center flex flex-col items-center">
                  
                  {/* CSS iPhone Frame */}
                  <div className="iphone-mockup mb-8 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                    <div className="dynamic-island" />
                    <div className="iphone-screen">
                      {/* Using filler color if image isn't available, but standard Next Image tags are here */}
                      <Image 
                        src={screen.image} 
                        alt={screen.title} 
                        width={300} 
                        height={650} 
                        className="w-full h-full object-cover"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{screen.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{screen.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            WHY CHOOSE US
        ════════════════════════════════════════════════ */}
        <section id="why" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Built for your journey.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[
                { title: 'Authentically Islamic', desc: 'Grounded in Quranic verses and teachings, not generic AI content.' },
                { title: 'Private & Secure', desc: 'Just your name and PIN. No ads, no tracking. Privacy guaranteed.' },
                { title: 'Always Free', desc: 'Full access to all features. No premium tiers, forever free.' },
                { title: 'Community Focused', desc: 'Share your journey, inspire others, build accountability.' },
                { title: 'Premium Design', desc: 'Professional 1080px flyers with your name elegantly featured.' },
                { title: 'Offline Capable', desc: 'Install as a PWA. Works offline, syncs when connected.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--row-today)', color: 'var(--accent)' }}>
                    <Plus size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════ */}
        <section id="faq" className="py-24 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Frequently asked.</h2>
            </div>

            <div className="space-y-0">
              {[
                { q: 'How does the AI generate reflections?', a: 'We use advanced AI trained on Islamic knowledge to generate authentic Quranic-based reflections. Each one is unique, meaningful, and spiritually resonant.' },
                { q: 'Can I preview before sharing?', a: 'Yes. The flyer preview shows exactly how it will look. You can regenerate if you want a different reflection.' },
                { q: 'How do I install as an app?', a: 'Visit our site on your mobile browser. Tap "Add to Home Screen" in your share menu, and it installs like a native app.' },
                { q: 'Will my personal info appear on flyers?', a: 'Only your name appears. No email, phone, or sensitive data is included. Your privacy is paramount.' },
                { q: 'Is there a cost involved?', a: 'No. Ramadan Bot is completely free. Unlimited sharing and beautiful designs without any premium paywalls.' }
              ].map((item, idx) => (
                <details key={idx} className="group py-6 border-b" style={{ borderColor: 'var(--divider)', cursor: 'pointer' }}>
                  <summary className="flex justify-between items-center font-medium list-none outline-none">
                    <span className="text-lg">{item.q}</span>
                    <span className="transition-transform duration-300 group-open:rotate-45 text-2xl" style={{ color: 'var(--text-secondary)' }}>+</span>
                  </summary>
                  <p className="mt-4 text-base leading-relaxed animate-fadeIn" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════ */}
        <section className="py-32 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
            <h2 className="text-5xl sm:text-7xl font-semibold tracking-tight">
              Start your journey.
            </h2>
            <p className="text-xl max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Create your first reflection today. Free to use, no account required.
            </p>
            <div className="pt-8">
              <Link href="/app" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-5 mx-auto w-max">
                Launch App Now <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════
          PREMIUM FOOTER
      ════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid var(--divider)',
        padding: '60px 24px 40px',
        background: 'var(--footer-bg)',
        position: 'relative', zIndex: 10,
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                <span className="font-semibold text-lg">RamadanBot</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your ultimate companion for spiritual growth, authentic reflections, and seamless Qur'ān reading.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-4 text-sm tracking-wide">Product</p>
              <ul className="space-y-3 text-sm flex flex-col" style={{ color: 'var(--text-secondary)' }}>
                <li><Link href="/app" className="footer-link">Launch App</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="footer-link">Features</button></li>
                <li><Link href="/prayer" className="footer-link">Prayer Times</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-4 text-sm tracking-wide">Company</p>
              <ul className="space-y-3 text-sm flex flex-col" style={{ color: 'var(--text-secondary)' }}>
                <li><Link href="" className="footer-link">Home</Link></li>
                <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-4 text-sm tracking-wide">Connect</p>
              <ul className="space-y-3 text-sm flex flex-col" style={{ color: 'var(--text-secondary)' }}>
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link">X (Twitter)</a></li>
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link">TikTok</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Built with love for the ummah by Abdallah Nangere
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Copyright © {new Date().getFullYear()} RamadanBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Universal Apple CSS variables & styles
function getGlobalCSS() {
  return `
    @import url('');

    :root {
      /* Apple Light Mode Variables */
      --bg-main: #F5F5F7;
      --bg-secondary: #FFFFFF;
      --text-primary: #1D1D1F;
      --text-secondary: #86868B;
      --glass-bg: rgba(255, 255, 255, 0.65);
      --glass-border: rgba(0, 0, 0, 0.08);
      --accent: #0071E3;
      --nav-bg: rgba(255, 255, 255, 0.72);
      --footer-bg: #F5F5F7;
      --divider: rgba(0, 0, 0, 0.08);
      --row-today: rgba(0, 113, 227, 0.08);
      --device-frame: #E5E5EA;
      
      --sf-pro: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
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
        --nav-bg: rgba(0, 0, 0, 0.72);
        --footer-bg: #111111;
        --divider: rgba(255, 255, 255, 0.1);
        --row-today: rgba(10, 132, 255, 0.15);
        --device-frame: #333336;
      }
    }

    *, *::before, *::after { box-sizing: border-box; }
    
    body { 
      font-family: var(--sf-pro);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: var(--bg-main);
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(134, 134, 139, 0.4); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(134, 134, 139, 0.6); }

    /* Typography Overrides */
    .hero-title { font-size: clamp(48px, 8vw, 80px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; }
    .hero-subtitle { font-size: clamp(20px, 4vw, 28px); font-weight: 500; letter-spacing: -0.01em; color: var(--text-secondary); }
    .section-title { font-size: clamp(36px, 5vw, 56px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; }
    .section-subtitle { font-size: clamp(18px, 3vw, 24px); color: var(--text-secondary); letter-spacing: -0.01em; }

    /* Buttons */
    .btn-primary {
      background: var(--text-primary);
      color: var(--bg-main);
      border: none;
      padding: 10px 20px;
      border-radius: 980px;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
      text-decoration: none;
    }
    .btn-primary:active { transform: scale(0.97); opacity: 0.8; }
    
    .btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--text-primary);
      padding: 10px 20px;
      border-radius: 980px;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-secondary:active { transform: scale(0.97); background: var(--text-primary); color: var(--bg-main); }

    /* Links */
    .nav-link { color: var(--text-secondary); text-decoration: none; font-size: 13px; font-weight: 400; transition: color 0.2s ease; }
    .nav-link:hover { color: var(--text-primary); }
    .nav-link-mobile { color: var(--text-primary); text-decoration: none; font-size: 20px; font-weight: 500; padding: 8px 0; border-bottom: 1px solid var(--divider); }
    .footer-link { background: transparent; border: none; padding: 0; cursor: pointer; text-align: left; transition: color 0.2s ease; }
    .footer-link:hover { color: var(--text-primary); }

    /* Bento Grid System */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 20px;
    }
    @media (min-width: 768px) {
      .bento-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .bento-item {
      background: var(--bg-main);
      border-radius: 32px;
      padding: 32px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    .bento-item:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
    .bento-title { font-size: 20px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; }
    .bento-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.5; }

    /* Custom CSS iPhone Mockup */
    .iphone-mockup {
      position: relative;
      width: 260px;
      height: 560px;
      border: 12px solid var(--device-frame);
      border-radius: 48px;
      background: var(--bg-main);
      overflow: hidden;
      box-shadow: inset 0 0 0 2px rgba(255,255,255,0.1);
    }
    .dynamic-island {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 24px;
      background: #000;
      border-radius: 20px;
      z-index: 20;
    }
    .iphone-screen {
      width: 100%;
      height: 100%;
      border-radius: 36px;
      overflow: hidden;
      position: relative;
    }

    /* Scroll Snapping for Mobile Gallery */
    .phone-gallery-container {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .phone-gallery-container::-webkit-scrollbar { display: none; }

    /* Animations */
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
  `;
}