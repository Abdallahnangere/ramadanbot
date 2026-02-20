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
    <div className="premium-theme" style={{ 
      backgroundColor: 'var(--bg-base)', 
      color: 'var(--text-primary)',
      minHeight: '100vh',
      overflowX: 'hidden',
      transition: 'background-color 0.5s ease, color 0.5s ease'
    }}>
      <style dangerouslySetInnerHTML={{ __html: getGlobalCSS() }} />

      {/* ════════════════════════════════════════════════
          PREMIUM NAVIGATION (FLOATING FROSTED GLASS)
      ════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrollPosition > 20 ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-nav rounded-2xl px-6 h-16 flex justify-between items-center border border-[var(--border-subtle)]">
            
            {/* Logo */}
            <Link href="" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[var(--surface-raised)] border border-[var(--border-subtle)] group-hover:border-[var(--text-primary)] transition-colors">
                 <Image src="/logo.png" alt="Ramadan Bot Logo" fill className="object-contain p-1" priority />
              </div>
              <span className="font-semibold tracking-tight text-[17px]">RamadanBot</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex gap-8 items-center m-0 p-0 list-none">
              <li><Link href="" className="nav-link">Home</Link></li>
              <li><button onClick={() => scrollToSection('features')} className="nav-link">Features</button></li>
              <li><button onClick={() => scrollToSection('showcase')} className="nav-link">Showcase</button></li>
              <li><Link href="/prayer" className="nav-link">Prayer Times</Link></li>
              <li><Link href="/privacy" className="nav-link">Privacy</Link></li>
            </ul>

            {/* CTA & Menu Toggle */}
            <div className="flex items-center gap-4">
              <Link href="/app" className="btn-primary hidden sm:flex items-center gap-2 h-10 px-5">
                Launch App <ArrowRight size={16} />
              </Link>
              
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`absolute top-[80px] left-4 right-4 rounded-2xl glass-panel border border-[var(--border-subtle)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'max-h-[500px] opacity-100 p-2' : 'max-h-0 opacity-0 p-0 border-none'}`}>
          <div className="flex flex-col gap-1 p-2">
            <Link href="" className="nav-link-mobile">Home</Link>
            <button onClick={() => scrollToSection('features')} className="nav-link-mobile text-left">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="nav-link-mobile text-left">Showcase</button>
            <Link href="/prayer" className="nav-link-mobile">Prayer Times</Link>
            <Link href="/privacy" className="nav-link-mobile">Privacy</Link>
            <Link href="/contact" className="nav-link-mobile">Contact</Link>
            <Link href="/app" className="btn-primary w-full justify-center mt-4 h-12">Launch App</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ════════════════════════════════════════════════
            HERO SECTION (SILICON VALLEY STYLE)
        ════════════════════════════════════════════════ */}
        <section className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center text-center min-h-[100vh] overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--glow-primary)] rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--glow-secondary)] rounded-full blur-[150px] opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
            {/* Pill Badge */}
            <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Introducing RamadanBot 3.0</span>
            </div>

            <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Elevate your <br className="hidden sm:block" />
              <span className="text-gradient">Ramadan journey.</span>
            </h1>
            
            <p className="hero-subtitle max-w-2xl mx-auto mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              The ultimate digital companion. Generate profound AI reflections, read the Qur'ān with a seamless interface, and create stunning personalized flyers instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-12 animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
              <Link href="/app" className="btn-primary flex items-center justify-center gap-2 text-[17px] px-8 h-14 w-full sm:w-auto">
                Start for free <ArrowRight size={18} />
              </Link>
              <button onClick={() => scrollToSection('showcase')} className="btn-secondary flex items-center justify-center text-[17px] px-8 h-14 w-full sm:w-auto">
                See it in action
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 flex justify-center w-full animate-bounce text-[var(--text-tertiary)]">
            <ChevronDown size={24} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FEATURES (REFINED BENTO GRID)
        ════════════════════════════════════════════════ */}
        <section id="features" className="py-32 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="section-title">Everything you need. <br/><span className="text-[var(--text-tertiary)]">Nothing you don't.</span></h2>
            </div>

            <div className="bento-grid">
              {/* Feature 1 */}
              <div className="premium-card col-span-1 md:col-span-2 group">
                <div className="card-content">
                  <div className="icon-box mb-6 group-hover:scale-110 transition-transform">🤖</div>
                  <h3 className="card-title">AI Reflections</h3>
                  <p className="card-desc max-w-md">Quranic-based spiritual reflections powered by advanced AI. Generated instantly and deeply personalized for your daily growth.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
              </div>

              {/* Feature 2 */}
              <div className="premium-card col-span-1 group">
                <div className="card-content">
                  <div className="icon-box mb-6 group-hover:scale-110 transition-transform">📖</div>
                  <h3 className="card-title">Qur'ān Reader</h3>
                  <p className="card-desc">Professional 604-page reader with automatic progress saving.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="premium-card col-span-1 group">
                <div className="card-content">
                  <div className="icon-box mb-6 group-hover:scale-110 transition-transform">✨</div>
                  <h3 className="card-title">Featured Name</h3>
                  <p className="card-desc">Every 1080px high-res flyer beautifully embeds your name.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="premium-card col-span-1 group">
                <div className="card-content">
                  <div className="icon-box mb-6 group-hover:scale-110 transition-transform">📤</div>
                  <h3 className="card-title">Easy Sharing</h3>
                  <p className="card-desc">One-tap stunning export to WhatsApp, Instagram, and X.</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="premium-card col-span-1 md:col-span-2 group">
                <div className="card-content">
                  <div className="icon-box mb-6 group-hover:scale-110 transition-transform">🔥</div>
                  <h3 className="card-title">Streak Tracking</h3>
                  <p className="card-desc max-w-md">Build and maintain your daily reflection streak. A beautiful visual representation of your consistency and accountability.</p>
                </div>
                <div className="absolute left-0 top-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            QUR'AN READER (ARCHITECTURAL LAYOUT)
        ════════════════════════════════════════════════ */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-12">
                <div>
                  <h2 className="section-title text-left">Structured reading, <br/><span className="text-[var(--text-secondary)]">beautifully designed.</span></h2>
                  <p className="section-subtitle mt-6 text-left max-w-lg">
                    A meticulously crafted interface that transforms your daily reading into a seamless, focus-driven habit.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                      <span className="font-semibold text-sm">01</span>
                    </div>
                    <div>
                      <h4 className="text-[19px] font-semibold tracking-tight text-[var(--text-primary)]">29-Day Structure</h4>
                      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">Complete the 604 pages with balanced daily assignments ensuring perfect progression.</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                      <span className="font-semibold text-sm">02</span>
                    </div>
                    <div>
                      <h4 className="text-[19px] font-semibold tracking-tight text-[var(--text-primary)]">5 Daily Phases</h4>
                      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">Read aligned with prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha. Optimized for 10 minutes.</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                      <span className="font-semibold text-sm">03</span>
                    </div>
                    <div>
                      <h4 className="text-[19px] font-semibold tracking-tight text-[var(--text-primary)]">Cloud Sync Saving</h4>
                      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">Position saves automatically every 5 seconds. Resume exactly where you left off.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="premium-card h-full flex flex-col justify-center border border-[var(--border-subtle)] bg-[var(--surface-base)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />
                <h3 className="text-2xl font-semibold mb-8 text-[var(--text-primary)] tracking-tight">Distribution Metrics</h3>
                
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                    <h4 className="font-medium text-[var(--text-primary)] mb-4">Days 1-20: Standard Pace</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-[var(--border-subtle)]">
                        <span className="text-[var(--text-secondary)] text-sm">Daily Quota</span>
                        <span className="font-medium text-[var(--text-primary)]">20 pages</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-[var(--border-subtle)]">
                        <span className="text-[var(--text-secondary)] text-sm">Per Phase</span>
                        <span className="font-medium text-[var(--text-primary)]">4 pages</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-secondary)] text-sm">Total Range</span>
                        <span className="font-medium text-[var(--text-primary)]">400 pages</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                    <h4 className="font-medium text-[var(--text-primary)] mb-4">Days 21-29: Final Push</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-[var(--border-subtle)]">
                        <span className="text-[var(--text-secondary)] text-sm">Daily Quota</span>
                        <span className="font-medium text-[var(--text-primary)]">22-23 pages</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-secondary)] text-sm">Per Phase</span>
                        <span className="font-medium text-[var(--text-primary)]">5 pages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SHOWCASE (ULTRA-PREMIUM HARDWARE MOCKUPS)
        ════════════════════════════════════════════════ */}
        <section id="showcase" className="py-32 overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--surface-raised)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="section-title">See it in action.</h2>
              <p className="section-subtitle mt-4">A stunning, native-feeling experience across all your devices.</p>
            </div>

            <div className="phone-gallery-container flex md:justify-center overflow-x-auto snap-x snap-mandatory gap-10 pb-16 pt-8 px-8 -mx-8">
              {[
                { title: 'Dashboard', image: '/login.png', desc: 'Stats & Streaks' },
                { title: 'AI Generator', image: '/generate.png', desc: 'Instant Creation' },
                { title: 'Share Hub', image: '/share.png', desc: 'High-Res Export' },
                { title: 'Reader UI', image: '/Interface.jpg', desc: 'Smooth Navigation' }
              ].map((screen, idx) => (
                <div key={idx} className="flex-shrink-0 snap-center flex flex-col items-center group">
                  
                  {/* Premium CSS iPhone Frame */}
                  <div className="premium-iphone-mockup mb-8 transition-all duration-700 ease-out group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <div className="hardware-buttons"></div>
                    <div className="dynamic-island" />
                    <div className="iphone-screen bg-[var(--surface-base)]">
                      <Image 
                        src={screen.image} 
                        alt={screen.title} 
                        width={300} 
                        height={650} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        style={{ backgroundColor: 'var(--surface-base)' }}
                      />
                    </div>
                  </div>

                  <h3 className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">{screen.title}</h3>
                  <p className="text-[15px] mt-2 text-[var(--text-secondary)]">{screen.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            WHY CHOOSE US (MINIMALIST GRID)
        ════════════════════════════════════════════════ */}
        <section id="why" className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)]">Built for focus.<br/><span className="text-[var(--text-tertiary)]">Engineered for peace.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {[
                { title: 'Authentically Islamic', desc: 'Grounded in Quranic verses and teachings, eliminating generic AI hallucinations.' },
                { title: 'Absolute Privacy', desc: 'Just your name and PIN. Zero tracking, zero ads. Your data never leaves your control.' },
                { title: 'Always Free', desc: 'Full unlimited access to all features. No premium tiers, no paywalls, forever.' },
                { title: 'Community Driven', desc: 'Share your reflections, inspire your circle, and build collective accountability.' },
                { title: 'Premium Export', desc: 'Studio-quality 1080px typographic flyers with your name elegantly embedded.' },
                { title: 'PWA Ready', desc: 'Install instantly to your home screen. Works flawlessly offline and syncs in the background.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col group">
                  <div className="w-10 h-10 mb-6 flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-raised)] transition-colors group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-base)]">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-[19px] font-semibold mb-3 tracking-tight text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FAQ (SMOOTH ACCORDION)
        ════════════════════════════════════════════════ */}
        <section id="faq" className="py-32 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Common questions.</h2>
            </div>

            <div className="space-y-4">
              {[
                { q: 'How does the AI generate reflections?', a: 'We leverage advanced LLMs exclusively prompted with authenticated Islamic knowledge and Tafsir to generate profound, contextually accurate Quranic reflections.' },
                { q: 'Can I preview before sharing?', a: 'Absolutely. The studio preview renders exactly how your 1080px flyer will export. You can regenerate infinitely until it resonates with you.' },
                { q: 'How do I install the app?', a: 'Simply open RamadanBot in Safari or Chrome on your mobile device, tap "Share", and select "Add to Home Screen". It functions identically to a native app.' },
                { q: 'Is my personal data secure?', a: 'We collect zero sensitive data. Only your display name is stored locally or via encrypted sync to render your flyers. Privacy is our architectural foundation.' },
                { q: 'Are there hidden costs?', a: 'RamadanBot is a 100% free utility built for the ummah. Unlimited generations, unlimited reading, zero cost.' }
              ].map((item, idx) => (
                <details key={idx} className="faq-item group bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all duration-300">
                  <summary className="flex justify-between items-center font-medium p-6 cursor-pointer list-none outline-none">
                    <span className="text-[17px] tracking-tight text-[var(--text-primary)]">{item.q}</span>
                    <span className="transform transition-transform duration-300 group-open:rotate-45 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface-base)] text-[var(--text-secondary)]">
                      <Plus size={16} />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════ */}
        <section className="py-40 px-4 text-center relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUwLDE1MCwxNTAsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
          
          <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
            <h2 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-[var(--text-primary)] mb-6">
              Begin your <br/> spiritual <span className="text-gradient">sprint.</span>
            </h2>
            <p className="text-xl max-w-xl mx-auto text-[var(--text-secondary)] mb-12 font-medium">
              Start building your streak today. Zero friction, instant access.
            </p>
            <Link href="/app" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 h-16 w-max shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow">
              Launch App <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════
          MINIMALIST FOOTER
      ════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--border-subtle)] pt-20 pb-10 px-6 bg-[var(--bg-base)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-6 h-6 rounded flex items-center justify-center bg-[var(--text-primary)]">
                  <Image src="/logo.png" alt="Logo" width={16} height={16} className="object-contain invert dark:invert-0" />
                </div>
                <span className="font-semibold tracking-tight text-[17px]">RamadanBot</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-sm">
                The modern digital companion for spiritual growth, authentic reflections, and seamless Qur'ān reading.
              </p>
            </div>

            <div>
              <p className="font-medium mb-6 text-[15px] text-[var(--text-primary)]">Product</p>
              <ul className="space-y-4 text-[14px] flex flex-col text-[var(--text-secondary)]">
                <li><Link href="/app" className="footer-link">Launch App</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="footer-link">Features</button></li>
                <li><Link href="/prayer" className="footer-link">Prayer Times</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-6 text-[15px] text-[var(--text-primary)]">Company</p>
              <ul className="space-y-4 text-[14px] flex flex-col text-[var(--text-secondary)]">
                <li><Link href="" className="footer-link">Home</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-6 text-[15px] text-[var(--text-primary)]">Connect</p>
              <ul className="space-y-4 text-[14px] flex flex-col text-[var(--text-secondary)]">
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link flex items-center gap-1">X (Twitter) <ArrowUpRight size={12}/></a></li>
                <li><a href="" target="_blank" rel="noopener noreferrer" className="footer-link flex items-center gap-1">TikTok <ArrowUpRight size={12}/></a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-[var(--text-tertiary)]">
              Designed & Built by Abdallah Nangere
            </p>
            <p className="text-[13px] text-[var(--text-tertiary)] flex items-center gap-2">
              <span>© {new Date().getFullYear()} RamadanBot.</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]"></span>
              <span>All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Universal Silicon Valley Premium CSS variables & styles
function getGlobalCSS() {
  return `
    @import url('');

    :root {
      /* Silicon Valley Light Mode - Ultra Clean */
      --bg-base: #FFFFFF;
      --surface-base: #FAFAFA;
      --surface-raised: #FFFFFF;
      --surface-hover: #F4F4F5;
      --border-subtle: rgba(0, 0, 0, 0.08);
      --text-primary: #111827;
      --text-secondary: #4B5563;
      --text-tertiary: #9CA3AF;
      
      --glow-primary: rgba(16, 185, 129, 0.15); /* Emerald */
      --glow-secondary: rgba(59, 130, 246, 0.15); /* Blue */
      
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        /* Silicon Valley Dark Mode - Linear/Vercel Inspired */
        --bg-base: #000000;
        --surface-base: #0A0A0A;
        --surface-raised: #111111;
        --surface-hover: #1A1A1A;
        --border-subtle: rgba(255, 255, 255, 0.1);
        --text-primary: #F9FAFB;
        --text-secondary: #9CA3AF;
        --text-tertiary: #4B5563;
        
        --glow-primary: rgba(16, 185, 129, 0.2);
        --glow-secondary: rgba(59, 130, 246, 0.2);
      }
    }

    *, *::before, *::after { box-sizing: border-box; }
    
    body { 
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: var(--bg-base);
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

    /* Premium Typography */
    .hero-title { 
      font-size: clamp(56px, 8vw, 96px); 
      font-weight: 700; 
      letter-spacing: -0.05em; 
      line-height: 1.05; 
    }
    .hero-subtitle { 
      font-size: clamp(18px, 3vw, 22px); 
      font-weight: 400; 
      letter-spacing: -0.01em; 
      line-height: 1.6;
      color: var(--text-secondary); 
    }
    .section-title { 
      font-size: clamp(40px, 5vw, 56px); 
      font-weight: 600; 
      letter-spacing: -0.04em; 
      line-height: 1.1; 
    }
    .section-subtitle { 
      font-size: clamp(18px, 3vw, 22px); 
      color: var(--text-secondary); 
      letter-spacing: -0.01em; 
      font-weight: 400;
    }
    .text-gradient {
      background: linear-gradient(to right, var(--text-primary), var(--text-tertiary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Premium Buttons */
    .btn-primary {
      background: var(--text-primary);
      color: var(--bg-base);
      border: 1px solid transparent;
      border-radius: 9999px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
    }
    .btn-primary:hover { 
      transform: scale(1.02); 
      opacity: 0.9; 
    }
    .btn-primary:active { 
      transform: scale(0.98); 
    }
    
    .btn-secondary {
      background: var(--surface-raised);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      font-weight: 500;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
    }
    .btn-secondary:hover { 
      background: var(--surface-hover);
      border-color: var(--text-tertiary);
    }
    .btn-secondary:active { 
      transform: scale(0.98); 
    }

    /* Navigation */
    .glass-nav {
      background: rgba(var(--surface-raised-rgb), 0.7);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
    }
    .glass-panel {
      background: var(--surface-raised);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    
    .nav-link { 
      color: var(--text-secondary); 
      text-decoration: none; 
      font-size: 14px; 
      font-weight: 500; 
      transition: color 0.2s ease; 
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .nav-link:hover { color: var(--text-primary); }
    .nav-link-mobile { 
      color: var(--text-secondary); 
      text-decoration: none; 
      font-size: 16px; 
      font-weight: 500; 
      padding: 12px 16px; 
      border-radius: 12px;
      background: transparent;
      border: none;
      transition: all 0.2s;
    }
    .nav-link-mobile:hover { 
      background: var(--surface-hover);
      color: var(--text-primary);
    }
    .footer-link { 
      background: transparent; 
      border: none; 
      padding: 0; 
      cursor: pointer; 
      text-align: left; 
      transition: color 0.2s ease; 
    }
    .footer-link:hover { color: var(--text-primary); }

    /* Advanced Bento Grid */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 24px;
    }
    @media (min-width: 768px) {
      .bento-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .premium-card {
      background: var(--surface-raised);
      border: 1px solid var(--border-subtle);
      border-radius: 32px;
      padding: 40px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .premium-card:hover { 
      border-color: rgba(255,255,255,0.2); 
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); 
    }
    /* Inner subtle glow border trick */
    .premium-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 32px;
      padding: 1px;
      background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
    .card-content { position: relative; z-index: 10; }
    .icon-box {
      font-size: 28px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-base);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
    }
    .card-title { font-size: 22px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.02em; color: var(--text-primary); }
    .card-desc { font-size: 16px; color: var(--text-secondary); line-height: 1.6; }

    /* Ultra-Premium CSS iPhone Mockup (Inspired by Apple/Linear) */
    .premium-iphone-mockup {
      position: relative;
      width: 300px;
      height: 620px;
      border-radius: 56px;
      background: var(--surface-raised);
      padding: 12px;
      box-shadow: 
        inset 0 0 0 1px var(--border-subtle),
        inset 0 4px 10px rgba(255,255,255,0.05),
        0 20px 40px -20px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* Outer metal rim highlight */
    .premium-iphone-mockup::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 57px;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.1) 100%);
      z-index: -1;
    }
    .hardware-buttons {
      position: absolute;
      left: -2px;
      top: 120px;
      width: 3px;
      height: 30px;
      background: var(--border-subtle);
      border-radius: 2px 0 0 2px;
      box-shadow: 0 50px 0 0 var(--border-subtle), 0 100px 0 0 var(--border-subtle);
    }
    .dynamic-island {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 30px;
      background: #000;
      border-radius: 20px;
      z-index: 20;
      box-shadow: inset 0 -1px 2px rgba(255,255,255,0.1);
    }
    .iphone-screen {
      width: 100%;
      height: 100%;
      border-radius: 44px;
      overflow: hidden;
      position: relative;
      border: 1px solid var(--border-subtle);
    }

    /* Scroll Snapping */
    .phone-gallery-container {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .phone-gallery-container::-webkit-scrollbar { display: none; }

    /* FAQ details native styling removal */
    .faq-item summary::-webkit-details-marker { display: none; }
    
    /* Animations */
    @keyframes fadeInUp { 
      from { opacity: 0; transform: translateY(24px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.25; transform: scale(1.05); }
    }
    .animate-fade-in-up { 
      opacity: 0;
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
    }
    .animate-pulse-slow {
      animation: pulseSlow 8s ease-in-out infinite;
    }
  `;
}