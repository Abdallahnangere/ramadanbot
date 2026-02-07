'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Zap, Users, Share2, Flame, Download, CheckCircle, Star, Shield } from 'lucide-react';

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
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 50 
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg' 
          : 'bg-white/80 backdrop-blur-xl border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Ramadan Bot Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ramadan Bot</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 items-center text-sm font-medium">
            {[
              { id: 'features', label: 'Features' },
              { id: 'showcase', label: 'Showcase' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'faq', label: 'FAQ' }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors py-2 px-1 border-b-2 ${
                    activeSection === item.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
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
              className="hidden sm:inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md"
            >
              Launch App
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 space-y-4">
              {[
                { id: 'features', label: 'Features' },
                { id: 'showcase', label: 'Showcase' },
                { id: 'benefits', label: 'Benefits' },
                { id: 'faq', label: 'FAQ' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 px-2 text-slate-600 hover:text-slate-900 transition-colors hover:bg-slate-100 rounded font-medium"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/app" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-center transition-all shadow-md">
                Launch App
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Compact */}
      <section className="relative pt-28 pb-16 px-4 bg-gradient-to-b from-white to-slate-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-block animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="px-4 py-2 bg-blue-100/50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 backdrop-blur-sm">
              ✨ AI-Powered Spiritual Companion
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '100ms' }}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Daily Islamic Reflections
            </span>
            <br />
            <span className="text-slate-900">with Your Name Featured</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '200ms' }}>
            Generate personalized Quranic-based reflections, create beautiful high-resolution flyers to share with your community, and maintain your spiritual journey with streak tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '300ms' }}>
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
            >
              Start Free <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => scrollToSection('showcase')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
            >
              View Showcase
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Visible Below Hero */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful AI-driven features to enhance your Ramadan journey and inspire your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: "AI Reflections",
                description: "Quranic-based spiritual reflections generated with Islamic knowledge, personalized for your spiritual journey.",
                gradient: "from-blue-50 to-cyan-50",
                border: "border-blue-200"
              },
              {
                icon: '✍️',
                title: "Flexible Creation",
                description: "Choose topics from 30 Ramadan themes or provide custom hints. 3 free generations daily.",
                gradient: "from-purple-50 to-pink-50",
                border: "border-purple-200"
              },
              {
                icon: '🎨',
                title: "Beautiful Flyers",
                description: "1080x1080px high-res flyers with elegant Islamic typography, golden accents, and YOUR NAME featured.",
                gradient: "from-amber-50 to-orange-50",
                border: "border-amber-200"
              },
              {
                icon: '📤',
                title: "Easy Sharing",
                description: "One-tap sharing to WhatsApp, Instagram Stories, Twitter, and email. Spread the word effortlessly.",
                gradient: "from-green-50 to-emerald-50",
                border: "border-green-200"
              },
              {
                icon: '🔥',
                title: "Streak Tracking",
                description: "Build and maintain your daily reflection streak. Challenge yourself and stay consistent.",
                gradient: "from-red-50 to-rose-50",
                border: "border-red-200"
              },
              {
                icon: '📊',
                title: "Personal Dashboard",
                description: "PIN-based login, view statistics, manage your profile, and track your spiritual progress.",
                gradient: "from-indigo-50 to-violet-50",
                border: "border-indigo-200"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative bg-gradient-to-br ${feature.gradient} border-2 ${feature.border} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-opacity-100`}
              >
                <div className="relative z-10">
                  <div className="inline-block text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section - Smartphone Mockups with Screenshots */}
      <section id="showcase" className="py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">See It In Action</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Beautiful interface designed for seamless experience on any device.
            </p>
          </div>

          {/* Smartphone Mockups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Dashboard",
                subtitle: "Login & Track Progress",
                screenshot: '/screenshot-540x720.png',
                description: '👤 PIN login • 🔥 Streak counter • 📊 Daily stats'
              },
              {
                title: "Generate",
                subtitle: "Create Your Reflection",
                screenshot: '/screenshot-540x720.png',
                description: '🎯 Topic selector • 📅 Day picker • ⚡ Generate'
              },
              {
                title: "Share",
                subtitle: "Personalized Flyer",
                screenshot: '/screenshot-540x720.png',
                description: '✨ Your name featured • 📥 High-res download • 📤 Share'
              }
            ].map((screen, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Smartphone Frame */}
                <div className="relative w-full max-w-sm mb-8 group">
                  {/* Phone Shadow/Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Phone Bezel */}
                  <div className="relative bg-gradient-to-b from-slate-900 to-black rounded-[40px] border-[14px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/19.5] transform group-hover:scale-105 transition-transform duration-300">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20"></div>

                    {/* Screenshot Image */}
                    <div className="w-full h-full relative pt-2 bg-white">
                      <Image
                        src={screen.screenshot}
                        alt={screen.title}
                        fill
                        className="object-cover rounded-[30px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Screen Info */}
                <h3 className="text-xl font-bold text-slate-900 text-center">{screen.title}</h3>
                <p className="text-sm text-slate-600 text-center mt-1">{screen.subtitle}</p>
                <p className="text-xs text-slate-500 text-center mt-3">{screen.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Why Section */}
      <section id="benefits" className="py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">Why Choose Ramadan Bot?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Designed by Muslims, for Muslims seeking authentic spiritual growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Quranic Foundation",
                description: "Every reflection is grounded in authentic Islamic teachings and Quranic knowledge."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Privacy First",
                description: "Your personal data is secure. Only your name appears on shared flyers, never personal info."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "AI-Powered",
                description: "Advanced language models trained to understand Islamic context and spirituality."
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Community Focus",
                description: "Share your journey with family and friends. Inspire others through your consistency."
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "High Quality",
                description: "1080x1080px flyers with professional design, ready to share on any platform."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Progressive Web App",
                description: "Works on any device, offline capable, installable like a native app."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">Frequently Asked</h2>
            <p className="text-xl text-slate-600">Everything you need to know about Ramadan Bot</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Ramadan Bot free?",
                a: "Yes! You get 3 free AI-generated reflections per day. All features are included in the free version. No premium tiers required."
              },
              {
                q: "How does the AI generate reflections?",
                a: "We use advanced language models trained on Islamic knowledge, Quranic teachings, and Islamic scholarship. Each reflection is unique and spiritually meaningful."
              },
              {
                q: "Can I customize the generated reflections?",
                a: "Yes! You can provide custom hints or topics. You can also regenerate if you'd like a different reflection. You have 3 generations per day."
              },
              {
                q: "Will my personal information appear on shared flyers?",
                a: "Only your name appears on shared flyers. No email, phone number, or private data is exposed. Your privacy is our priority."
              },
              {
                q: "How do I share my flyers?",
                a: "Download the high-res image and share to WhatsApp, Instagram Stories, Twitter, Telegram, or email. One-tap sharing for most platforms."
              },
              {
                q: "What platforms does Ramadan Bot work on?",
                a: "It's a Progressive Web App (PWA) that works on any device with a browser. Install it on your phone like a native app for offline access."
              },
              {
                q: "Can I track my streak across devices?",
                a: "Yes! Log in with your PIN on any device and your streak, history, and preferences sync automatically."
              },
              {
                q: "Is my data backed up securely?",
                a: "All your data is stored securely with encryption. We use industry-standard security practices to protect your information."
              }
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border-2 border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:border-blue-300 transition-colors"
              >
                <summary className="flex items-center justify-between font-bold text-slate-900 text-lg">
                  {item.q}
                  <span className="transform group-open:rotate-180 transition-transform ml-4">+</span>
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Ready to Transform Your Ramadan?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Start creating personalized reflections today. Free to use, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              Start Creating <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 text-slate-300 border-t border-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/app" className="hover:text-white transition-colors">Launch App</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#showcase" className="hover:text-white transition-colors">Showcase</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><a href="https://github.com/abdallahnangere/ramadanbot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.ramadanbot.app" className="hover:text-white transition-colors">Website</a></li>
              <li><a href="https://www.ramadanbot.app/app" className="hover:text-white transition-colors">PWA Install</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Social</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com/ramadanbot" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://instagram.com/ramadanbot" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://github.com/abdallahnangere" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2024-2025 Ramadan Bot. All rights reserved. Made with ❤️ and Islamic Purpose.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
