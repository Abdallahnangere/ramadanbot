'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Twitter, ArrowLeft, Music } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="Ramadan Bot"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold hidden sm:inline tracking-tight">Ramadan Bot</span>
          </div>

          <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            <span>Back Home</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Contact & Support</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6">
            Let's Connect
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about Ramadan Bot? Want to collaborate or share feedback? Reach out and let's talk.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Email */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
            <div className="inline-block w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
              <Mail size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-slate-600 text-sm mb-6">Reach out anytime. I reply within 24 hours.</p>
            <a href="mailto:abdallahnangere@gmail.com" className="text-blue-600 font-medium hover:underline text-sm">
              abdallahnangere@gmail.com
            </a>
          </div>

          {/* WhatsApp */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
            <div className="inline-block w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
              <Phone size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
            <p className="text-slate-600 text-sm mb-6">Send a message on WhatsApp for quick chat.</p>
            <a href="https://wa.me/2348164135836" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline text-sm">
              +234 816 413 5836
            </a>
          </div>

          {/* Location */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
            <div className="inline-block w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <MapPin size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Location</h3>
            <p className="text-slate-600 text-sm mb-2">Based in Yobe State, Nigeria 🇳🇬</p>
            <p className="text-slate-500 text-sm">Timezone: West Africa Time (WAT)</p>
          </div>

          {/* TikTok */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
            <div className="inline-block w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-6">
              <Music size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">TikTok</h3>
            <p className="text-slate-600 text-sm mb-6">Follow for creative content and updates.</p>
            <a href="https://www.tiktok.com/@bot_ramadan?_r=1&_t=ZS-93jVLLRcvlY" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:underline text-sm">
              @bot_ramadan
            </a>
          </div>
        </div>

        {/* About Author Section */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-12 mb-20">
          <h2 className="text-3xl font-black mb-6 tracking-tight">About Abdullahi</h2>
          <div className="space-y-4 mb-8">
            <p className="text-slate-700 leading-relaxed">
              Abdullahi Adam Usman Abdallah Nangere is a student of International Studies at Ahmadu Bello University, Zaria, with academic and professional interests in politics, the rule of law, and socio-economic development. He is an aspiring writer and public affairs commentator, engaging critically with governance, institutional reform, and policy outcomes.
            </p>
            <p className="text-slate-700 leading-relaxed">
              He is also an agentic developer leveraging artificial intelligence to build practical, cutting-edge solutions at the intersection of technology, public value, and social impact.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-widest">Expertise</p>
            <div className="flex flex-wrap gap-3">
              {['AI Developer', 'Public Affairs Commentator', 'Policy Analyst', 'Agentic AI Solutions', 'Technology for Social Impact', 'Governance & Institutional Reform'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p className="text-slate-600 mb-8">Follow on social media</p>
          <div className="flex justify-center gap-4">
            <a href="https://x.com/Abdalla_Nangere" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all font-medium text-sm">
              <Twitter size={18} />
              X / Twitter
            </a>
            <a href="https://www.tiktok.com/@bot_ramadan?_r=1&_t=ZS-93jVLLRcvlY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all font-medium text-sm">
              <Music size={18} />
              TikTok
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Ready to start?</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Back to the app
            </h2>
            <p className="text-lg text-slate-300">
              Continue your spiritual journey with Ramadan Bot.
            </p>
          </div>

          <Link
            href="/app"
            className="inline-block px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-semibold transition-all"
          >
            Launch App →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 text-sm">
            © 2026 Ramadan Bot. Made with ❤️ for spiritual growth. <br/>
            <a href="https://www.ramadanbot.app" className="text-slate-950 font-semibold hover:underline">www.ramadanbot.app</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
