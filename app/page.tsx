'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Zap, Users, Share2, Flame, Download, Play, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
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
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 50 
          ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              🌙
            </div>
            <span className="text-xl font-bold hidden sm:inline">Ramadan Bot</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 items-center text-sm">
            {[
              { id: 'features', label: 'Features' },
              { id: 'showcase', label: 'Showcase' },
              { id: 'why', label: 'Why' },
              { id: 'faq', label: 'FAQ' }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors py-2 ${
                    activeSection === item.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="hidden sm:inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all active:scale-95"
            >
              Launch App
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className="block w-full text-left py-2 px-2 text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/app" className="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-center transition-all">
                Launch App
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              ✨ Transform Your Ramadan Journey
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '100ms' }}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Spiritual
            </span>
            <br />
            <span className="text-white">Companion</span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '200ms' }}>
            Generate personalized Islamic reflections, create stunning shareable flyers <span className="text-white font-semibold">with your name featured</span>, and build an unbreakable spiritual streak during Ramadan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '300ms' }}>
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
            >
              Start Free <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => scrollToSection('showcase')}
              className="px-8 py-4 border border-white/30 hover:border-white/60 hover:bg-white/5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
            >
              <Play size={20} /> See In Action
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 flex justify-center animate-bounce">
            <ChevronDown size={24} className="text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-4 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="text-white">Everything You Need</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to deepen your spiritual practice and inspire your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '✨',
                title: "AI-Generated Reflections",
                description: "Authentic Islamic wisdom grounded in Quranic verses and Hadiths, generated specifically for you.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: '👤',
                title: "Your Name, Your Legacy",
                description: "Every flyer includes your name beautifully, making each reflection a personal spiritual legacy ready to share.",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: '📤',
                title: "Instant Social Sharing",
                description: "Share directly to WhatsApp, X, Facebook, and Snapchat with auto-generated captions and your streak count.",
                gradient: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: '🔥',
                title: "Streak Tracking",
                description: "Build accountability with daily streaks. Track your spiritual consistency and celebrate milestones visually.",
                gradient: "from-green-500/20 to-emerald-500/20"
              },
              {
                icon: '🎨',
                title: "Professional Design",
                description: "1080x1080px high-resolution flyers with elegant Islamic typography, golden accents, and Ramadan themes.",
                gradient: "from-indigo-500/20 to-blue-500/20"
              },
              {
                icon: '💬',
                title: "3 Daily Generations",
                description: "Create up to 3 reflections per day for different themes, family discussions, or personal spiritual growth.",
                gradient: "from-pink-500/20 to-rose-500/20"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative bg-gradient-to-br ${feature.gradient} border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all duration-300 hover:bg-white/5 backdrop-blur-sm overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-block text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section - Smartphone Mockups */}
      <section id="showcase" className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">See It In Action</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Witness the beautiful interface and powerful features designed for your daily spiritual practice.
            </p>
          </div>

          {/* Smartphone Mockups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Dashboard",
                subtitle: "Login & Personal Stats",
                icon: '📱',
                color: 'from-blue-500 to-cyan-500',
                details: [
                  '👤 PIN-based login',
                  '🔥 Streak counter',
                  '📊 Daily stats dashboard',
                  '⚙️ Quick settings'
                ]
              },
              {
                title: "Generate",
                subtitle: "Create Your Reflection",
                icon: '✍️',
                color: 'from-purple-500 to-pink-500',
                details: [
                  '🎯 Topic selector',
                  '📅 Day picker (1-30)',
                  '💡 Optional hint input',
                  '⚡ Generate button'
                ]
              },
              {
                title: "Share",
                subtitle: "Flyer with Your Name",
                icon: '🎨',
                color: 'from-orange-500 to-red-500',
                details: [
                  '✨ Your name featured',
                  '📥 High-res download',
                  '📤 Direct social sharing',
                  '💾 Auto-history save'
                ]
              }
            ].map((screen, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Smartphone Frame */}
                <div className="relative w-full max-w-sm mb-12 group">
                  {/* Phone Shadow/Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Phone Bezel */}
                  <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[40px] border-[14px] border-gray-800 shadow-2xl overflow-hidden aspect-[9/19.5] transform group-hover:scale-105 transition-transform duration-300">
                    {/* Screen Content */}
                    <div className={`w-full h-full bg-gradient-to-br ${screen.color} p-4 flex flex-col items-center justify-center relative overflow-hidden`}>
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                        <div className="text-5xl drop-shadow-lg">{screen.icon}</div>
                        <p className="text-white font-bold text-sm leading-tight">{screen.subtitle}</p>
                        <div className="text-xs text-white/80 space-y-1 pt-4">
                          {screen.details.map((detail, i) => (
                            <p key={i}>{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Phone Camera Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl z-20"></div>
                  </div>

                  {/* Shadow under phone */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 w-3/4 h-4 bg-black/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Screen Info */}
                <h3 className="text-2xl font-bold text-center mb-2">{screen.title}</h3>
                <p className="text-gray-400 text-center text-sm max-w-sm">{screen.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CTA after showcase */}
          <div className="text-center mt-20">
            <p className="text-gray-400 mb-6 text-lg">Ready to start your spiritual journey?</p>
            <Link
              href="/app"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-semibold transition-all active:scale-95 text-lg shadow-lg hover:shadow-xl"
            >
              Launch App Now <ArrowRight className="inline ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Ramadan Bot */}
      <section id="why" className="py-28 px-4 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">Why Choose Ramadan Bot?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with Islamic tradition, powered by cutting-edge AI, designed for your spiritual growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Authentically Islamic",
                description: "Every reflection is grounded in Quranic verses, Sahih Hadiths, and scholarly wisdom. No generic content—only authentic Islamic guidance.",
                icon: "📖"
              },
              {
                number: "2",
                title: "Privacy First",
                description: "Just your name and PIN. We never share your data with third parties, use advertising, or track your activity. Your privacy is sacred.",
                icon: "🔒"
              },
              {
                number: "3",
                title: "Community Inspired",
                description: "Join thousands of Muslims strengthening their faith together. Share your streak, inspire others, build accountability in community.",
                icon: "👥"
              },
              {
                number: "4",
                title: "Always Free",
                description: "Full access to all features—3 daily generations, unlimited sharing, beautiful professional designs. Zero premium tiers, zero hidden costs.",
                icon: "💰"
              },
              {
                number: "5",
                title: "Offline Ready",
                description: "Install as a PWA on your home screen just like a native app. Works offline, syncs automatically when connected.",
                icon: "📲"
              },
              {
                number: "6",
                title: "Your Name, Your Impact",
                description: "Every flyer beautifully features your name. Share authentic reflections as your personal spiritual legacy that inspires others.",
                icon: "⭐"
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all backdrop-blur-sm">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <p className="text-xs text-blue-400 font-semibold mb-2">Point {item.number}</p>
                  <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">Common Questions</h2>
            <p className="text-xl text-gray-400">Everything you need to know about Ramadan Bot</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI generate authentic reflections?",
                a: "We use Google's Gemini 2.5 Flash model trained on Islamic scholarship to generate authentic reflections grounded in Quranic verses and Hadiths. Every reflection is meaningful, grammatically perfect, and spiritually resonant. Our prompts are guided by Islamic principles to ensure accuracy."
              },
              {
                q: "Can I install Ramadan Bot like a native app?",
                a: "Yes! It's a PWA (Progressive Web App). Visit https://www.ramadanbot.app/app on your mobile browser, look for 'Add to Home Screen' in your menu, and install it just like a native app. It even works offline!"
              },
              {
                q: "Is my data really private?",
                a: "Absolutely. We use secure PIN-based authentication, your data is encrypted in transit, and we never share anything with third parties. No ads, no tracking, no analytics. Your spiritual journey is completely private."
              },
              {
                q: "What makes the flyers special if my name is on them?",
                a: "Your name becomes part of your personal spiritual legacy. When you share reflections, they're authentically yours—not generic bot output. It creates accountability, personalization, and makes sharing with family even more meaningful."
              },
              {
                q: "What's the PWA URL exactly?",
                a: "Visit https://www.ramadanbot.app/app on your phone. The app operates entirely within the /app path. When you install it as a PWA, it will use that URL and work in that scope offline."
              },
              {
                q: "What if I miss a day in my streak?",
                a: "Your streak resets, but that's okay! Every day is a beautiful new opportunity. Use Ramadan Bot to get back on track and rebuild your spiritual consistency. Ramadan is about growth, not perfection."
              }
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-white/10 rounded-2xl px-6 py-5 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm"
              >
                <summary className="flex justify-between items-center font-bold text-lg text-white select-none">
                  {item.q}
                  <span className="transition-transform group-open:rotate-180 ml-2">▼</span>
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed text-base">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl sm:text-6xl font-black">
            Transform Your Ramadan
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Starting Today</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of Muslims deepening their faith, building unbreakable spiritual streaks, and inspiring their communities.
          </p>
          <Link
            href="/app"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg hover:shadow-xl"
          >
            Start Your Journey Free <ArrowRight className="inline ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Ramadan Bot</h4>
              <p className="text-gray-400 text-sm">
                Your spiritual companion for a meaningful Ramadan journey.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('showcase')} className="hover:text-white transition-colors">Showcase</button></li>
                <li><button onClick={() => scrollToSection('why')} className="hover:text-white transition-colors">Why Us</button></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Launch App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
                <li><span className="text-xs">Version 2.0</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Get Started</h4>
              <p className="text-gray-400 text-sm mb-4">
                Launch the app at /app path or install as PWA.
              </p>
              <Link
                href="/app"
                className="inline-block px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg font-semibold text-sm transition-all"
              >
                Go To App
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © 2026 Ramadan Bot. Built with ❤️ for the Ummah by Abdallah Nangere 🇳🇬
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;


