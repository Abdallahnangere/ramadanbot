'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              🌙
            </div>
            <span className="text-lg font-semibold hidden sm:inline">Ramadan Bot</span>
          </div>

          <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back Home</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Email Card */}
          <div className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-block p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 mb-6">
                <Mail size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Email</h3>
              <p className="text-gray-400 mb-6">Send me an email and I'll get back to you as soon as possible.</p>
              <a href="mailto:abdallahnangere@gmail.com" className="inline-block px-6 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-xl font-semibold text-sm transition-all">
                abdallahnangere@gmail.com
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="group relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-block p-4 rounded-2xl bg-green-500/20 border border-green-500/30 mb-6">
                <Phone size={32} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">WhatsApp</h3>
              <p className="text-gray-400 mb-6">Message me on WhatsApp for quick communication.</p>
              <a href="https://wa.me/2348164135836" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-500/50 rounded-xl font-semibold text-sm transition-all">
                +234 816 413 5836
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="group relative bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-block p-4 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-6">
                <MapPin size={32} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Location</h3>
              <p className="text-gray-400 mb-6">Based in Lagos, Nigeria 🇳🇬</p>
              <div className="inline-block px-6 py-2 bg-orange-600/30 border border-orange-500/50 rounded-xl font-semibold text-sm">
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-block p-4 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-6">
                <Github size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">GitHub</h3>
              <p className="text-gray-400 mb-6">See my open source projects and code.</p>
              <a href="https://github.com/abdallahnangere" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-xl font-semibold text-sm transition-all">
                @abdallahnangere
              </a>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 mb-20 backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-6 text-white">About Abdallah Nangere</h2>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              I'm a passionate developer and Islamic technology enthusiast from Lagos, Nigeria 🇳🇬. I created <span className="text-white font-semibold">Ramadan Bot</span> with a simple mission: to help Muslims deepen their spiritual practice during Ramadan through authentic, AI-powered reflections.
            </p>

            <p className="text-lg leading-relaxed">
              With a background in full-stack development and a deep interest in Islamic tradition, I believe technology can bridge communities and strengthen faith. Ramadan Bot represents years of learning both technical excellence and Islamic scholarship.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="font-bold text-white mb-2">Full-Stack Developer</h3>
                <p className="text-sm text-gray-400">Next.js, React, TypeScript, Node.js, PostgreSQL</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-bold text-white mb-2">Islamic Tech Advocate</h3>
                <p className="text-sm text-gray-400">Building tools that serve the Muslim community</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-bold text-white mb-2">Open Source Contributor</h3>
                <p className="text-sm text-gray-400">Sharing code and knowledge with the community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-8 text-white">Connect With Me</h3>
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/abdallahnangere" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all">
              <Github size={20} /> GitHub
            </a>
            <a href="https://wa.me/2348164135836" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-green-600/30 hover:bg-green-600/50 border border-green-500/50 rounded-lg font-semibold transition-all">
              <Phone size={20} /> WhatsApp
            </a>
            <a href="mailto:abdallahnangere@gmail.com" className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg font-semibold transition-all">
              <Mail size={20} /> Email
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black">Back to the App?</h2>
          <p className="text-lg text-gray-300">Ready to transform your Ramadan journey?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl font-semibold transition-all"
            >
              ← Back to Homepage
            </Link>
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Launch App
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Ramadan Bot. Built with ❤️ for the Ummah by Abdallah Nangere 🇳🇬
          </p>
        </div>
      </footer>
    </main>
  );
}
