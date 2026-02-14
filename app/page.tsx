'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';

const HomePage = () => {
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
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="bg-white text-slate-950 overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 50 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/50' 
          : 'bg-white/50 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="Ramadan Bot"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm font-semibold hidden sm:inline tracking-tight">Ramadan Bot</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-12 items-center text-sm">
            {[
              { id: 'features', label: 'Features' },
              { id: 'showcase', label: 'Showcase' },
              { id: 'why', label: 'Why' },
              { id: 'faq', label: 'FAQ' }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-600 hover:text-slate-950 transition-colors font-medium"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA & Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="hidden sm:inline-block px-5 py-2 bg-slate-950 text-white hover:bg-slate-800 rounded-full font-medium transition-all text-sm"
            >
              Launch App
            </Link>
            
            <button
              className="md:hidden p-2 text-slate-950"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
            <div className="p-4 space-y-4">
              {[
                { id: 'features', label: 'Features' },
                { id: 'showcase', label: 'Showcase' },
                { id: 'why', label: 'Why' },
                { id: 'faq', label: 'FAQ' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 text-slate-600 hover:text-slate-950 font-medium"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/app" className="block w-full py-3 bg-slate-950 text-white rounded-full font-medium text-center hover:bg-slate-800">
                Launch App
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Spiritual Reflections</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Your Ramadan
              <br />
              <span className="text-slate-400">Companion</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Generate authentic Islamic reflections, create beautiful flyers <span className="text-slate-950 font-semibold">with your name featured</span>, read the complete Qur'ān with our professional reader, and build your spiritual streak.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
            <Link
              href="/app"
              className="px-8 py-4 bg-slate-950 text-white hover:bg-slate-800 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
            >
              Start Free <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => scrollToSection('showcase')}
              className="px-8 py-4 border-2 border-slate-200 text-slate-950 hover:border-slate-400 rounded-full font-semibold transition-all"
            >
              See In Action
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pt-16 animate-bounce">
          <ChevronDown size={20} className="text-slate-300" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Capabilities</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
              Everything you need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed for your spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI Reflections',
                description: 'Quranic-based spiritual reflections powered by advanced AI, personalized for you.'
              },
              {
                icon: '📖',
                title: 'Qur\'ān Reader',
                description: 'Professional 604-page Qur\'ān reader (29 days, 5 daily phases) with free navigation and automatic progress saving.'
              },
              {
                icon: '✨',
                title: 'Your Name Featured',
                description: 'Every flyer beautifully includes your name, making each reflection uniquely yours.'
              },
              {
                icon: '📤',
                title: 'Easy Sharing',
                description: 'One-tap sharing to WhatsApp, Instagram, Twitter, and more.'
              },
              {
                icon: '🔥',
                title: 'Streak Tracking',
                description: 'Build and maintain your daily reflection streak for accountability.'
              },
              {
                icon: '🎨',
                title: 'Premium Design',
                description: '1080x1080px high-resolution flyers with elegant Islamic design.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qur'ān Reader Detailed Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Professional Reading Experience</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Qur'ān Reader v3.0
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A meticulously designed interface for structured Qur'anic reading during Ramadan and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left: Features */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">29-Day Structure</h3>
                    <p className="text-sm text-slate-600">Complete the full 604-page Qur'ān over Ramadan with perfectly balanced daily assignments ensuring spiritual progression.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">5 Daily Phases</h3>
                    <p className="text-sm text-slate-600">Read aligned with prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha – each phase takes 10-15 minutes.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔓</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Complete Freedom</h3>
                    <p className="text-sm text-slate-600">Navigate to any day or phase instantly. Read at your own pace without restrictions. Progress is fully flexible.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Benefits */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💾</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Auto-Saving Progress</h3>
                    <p className="text-sm text-slate-600">Your reading position saves automatically every 5 seconds. Resume exactly where you left off across all devices.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎨</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Professional Design</h3>
                    <p className="text-sm text-slate-600">Dark mode, zoom controls, swipe navigation, and intuitive dropdowns. Optimized for phones, tablets, and desktops.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Streak Tracking</h3>
                    <p className="text-sm text-slate-600">Automatic celebrations at each phase completion. Visualize your journey toward completing all 145 phases.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Details */}
          <div className="bg-white rounded-2xl border-2 border-emerald-300 p-8 shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Reading Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Days 1-20: Standard Pace</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>📄 <strong>20 pages per day</strong></li>
                  <li>📍 <strong>4 pages per phase</strong></li>
                  <li>⏱️ <strong>10-12 min per phase</strong></li>
                  <li>💯 <strong>400 total pages</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Days 21-29: Final Push</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>📄 <strong>22-23 pages per day</strong></li>
                  <li>📍 <strong>5 pages per phase</strong></li>
                  <li>⏱️ <strong>12-15 min per phase</strong></li>
                  <li>💯 <strong>204 total pages</strong></li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t-2 border-slate-200">
              <p className="text-center font-bold text-lg text-emerald-600">
                604 Pages ÷ 145 Phases = Complete Qur'ān in 29 Days ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Visual Experience</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              See it in action
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                title: 'Dashboard',
                subtitle: 'Track your journey',
                image: '/login.png',
                description: 'PIN login • Streaks • Stats'
              },
              {
                title: 'Generate',
                subtitle: 'AI Reflections',
                image: '/generate.png',
                description: 'Themes • Hints • Instant creation'
              },
              {
                title: 'Share',
                subtitle: 'Beautiful flyers',
                image: '/share.png',
                description: 'Featured name • High-res • Shareable'
              },
              {
                title: 'Qur\'ān Guide',
                subtitle: 'How to use',
                image: '/Guide.jpg',
                description: '29 days • 5 phases • Complete guide'
              },
              {
                title: 'Reader Interface',
                subtitle: 'Reading experience',
                image: '/Interface.jpg',
                description: 'Smooth navigation • Dark mode • Intuitive'
              }
            ].map((screen, idx) => (
              <div key={idx} className="flex flex-col items-center group h-full">
                {/* Elegant Image Container */}
                <div className="relative w-full mb-6 flex-1">
                  {/* Subtle shadow on hover */}
                  <div className="absolute -inset-2 bg-gradient-to-b from-slate-100 to-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  
                  {/* Image with elegant border */}
                  <div className="relative rounded-xl border border-slate-200 shadow-lg overflow-hidden group-hover:shadow-xl group-hover:border-slate-300 transition-all duration-300 w-full h-full flex items-center">
                    <Image
                      src={screen.image}
                      alt={screen.title}
                      width={300}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold text-center">{screen.title}</h3>
                <p className="text-xs text-slate-600 text-center mt-1.5">{screen.subtitle}</p>
                <p className="text-xs text-slate-500 text-center mt-2">{screen.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Why Choose Us</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Built for your journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Authentically Islamic',
                description: 'Grounded in Quranic verses and authentic Islamic teachings, not generic content.'
              },
              {
                title: 'Private & Secure',
                description: 'Just your name and PIN. No data sharing, no ads, no tracking. Privacy guaranteed.'
              },
              {
                title: 'Always Free',
                description: 'Full access to all features. No premium tiers, no hidden costs, forever free.'
              },
              {
                title: 'Community Focused',
                description: 'Share your journey, inspire others, build accountability with your community.'
              },
              {
                title: 'Beautifully Designed',
                description: 'Premium 1080x1080px flyers with professional Islamic design and your name featured.'
              },
              {
                title: 'Offline Capable',
                description: 'Install as a PWA on your home screen. Works offline, syncs when connected.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Questions</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Frequently asked
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does the AI generate reflections?',
                a: 'We use advanced AI trained on Islamic knowledge to generate authentic Quranic-based reflections. Each one is unique, meaningful, and spiritually resonant.'
              },
              {
                q: 'Can I preview before sharing?',
                a: 'Yes. The flyer preview shows exactly how it will look when shared. You can regenerate if you want a different reflection.'
              },
              {
                q: 'How do I install as an app?',
                a: 'Visit https://www.ramadanbot.app/app on your mobile browser. Tap "Add to Home Screen" in your menu, and install like a native app.'
              },
              {
                q: 'Will my personal info appear on flyers?',
                a: 'Only your name appears on the flyer. No email, phone, or sensitive data is included. Your privacy is our priority.'
              },
              {
                q: 'What if I miss a day in my streak?',
                a: 'Your streak resets, but every day is a new opportunity. Use Ramadan Bot to get back on track and rebuild your consistency.'
              },
              {
                q: 'Is there a cost?',
                a: 'No. Ramadan Bot is completely free—forever. 3 daily generations, unlimited sharing, beautiful designs. No premium tiers.'
              }
            ].map((item, idx) => (
              <details key={idx} className="group border-b border-slate-200 py-6 cursor-pointer">
                <summary className="flex justify-between items-start font-semibold text-slate-950 select-none group-open:text-slate-600">
                  {item.q}
                  <span className="ml-4 text-slate-400 group-open:text-slate-600 transition-transform group-open:rotate-180">+</span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Ready?</p>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight">
              Start your journey
            </h2>
            <p className="text-lg text-slate-300">
              Create your first reflection today. Free to use, no credit card required.
            </p>
          </div>

          <Link
            href="/app"
            className="inline-block px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
          >
            Launch App Now <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="font-semibold text-slate-950 mb-4">Product</p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/app" className="hover:text-slate-950 transition-colors">Launch App</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-slate-950 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('showcase')} className="hover:text-slate-950 transition-colors">Showcase</button></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-950 mb-4">Company</p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/contact" className="hover:text-slate-950 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-950 transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-950 mb-4">Resources</p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="https://www.ramadanbot.app" className="hover:text-slate-950 transition-colors">Website</a></li>
                <li><a href="https://www.ramadanbot.app/app" className="hover:text-slate-950 transition-colors">PWA App</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-950 mb-4">Connect</p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="https://x.com/Abdalla_Nangere" target="_blank" rel="noopener noreferrer" className="hover:text-slate-950 transition-colors">X (Twitter)</a></li>
                <li><a href="https://www.tiktok.com/@bot_ramadan?_r=1&_t=ZS-93jVLLRcvlY" target="_blank" rel="noopener noreferrer" className="hover:text-slate-950 transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <p className="text-center text-sm text-slate-600">
              © 2026 Ramadan Bot. Made with ❤️ for spiritual growth. <br/>
              <a href="https://www.ramadanbot.app" className="text-slate-950 font-semibold hover:underline">www.ramadanbot.app</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
