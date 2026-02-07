import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RamadanBot" className="w-10 h-10 object-contain" />
            <span className="text-lg font-semibold">Ramadan Bot</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
            <a href="#why" className="text-sm text-slate-600 hover:text-slate-900">Why Ramadan Bot</a>
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy</Link>
            <a href="mailto:hello@ramadanbot.app" className="text-sm text-slate-600 hover:text-slate-900">Contact</a>
            <a href="/app" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Open App</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Transform Your Spiritual Practice</span>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Beautiful Ramadan Reflections, Every Day
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Create authentic, Quranic-grounded spiritual reflections and share high-resolution flyers with your community. Build consistent practice with daily streaks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a href="/app" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all">
              Start Creating →
            </a>
            <a href="#features" className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all">
              Learn More
            </a>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">10,000+</p>
              <p className="text-xs text-slate-600">Daily Users</p>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">1M+</p>
              <p className="text-xs text-slate-600">Flyers Created</p>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">100% Free</p>
              <p className="text-xs text-slate-600">No Ads, No Tracking</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-slate-200 shadow-2xl">
            <img src="/screenshot-540x720.png" alt="App preview" className="w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Spiritual Excellence, Simplified</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need to deepen your Ramadan practice and inspire others</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Crafted Reflections",
                desc: "Grounded in Quranic verses and authentic Hadiths, tailored to your spiritual journey.",
                icon: "✨"
              },
              {
                title: "Stunning Flyer Design",
                desc: "1080×1080px high-resolution designs with elegant typography and Ramadan aesthetics.",
                icon: "🎨"
              },
              {
                title: "Streak Tracking",
                desc: "Build accountability and motivation with daily streak counting and community sharing.",
                icon: "🔥"
              },
              {
                title: "Multi-Platform Sharing",
                desc: "Share directly to WhatsApp, X, Facebook, and Snapchat with auto-generated captions.",
                icon: "🌍"
              },
              {
                title: "Personalized Content",
                desc: "Add specific Quranic verses, Hadith references, or personal themes for deeper relevance.",
                icon: "📖"
              },
              {
                title: "Privacy-First Design",
                desc: "Just a name and 4-digit PIN. Your data is never sold or shared with third parties.",
                icon: "🔒"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className="max-w-7xl mx-auto px-6 py-24">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Why Ramadan Bot</h2>
            <p className="text-xl text-slate-600">Built for modern Muslims seeking authentic, consistent spiritual practice</p>
          </div>

          <div className="grid gap-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Authenticity Matters</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every reflection is grounded in Quranic verses and verified Hadiths. Our AI is prompted by Islamic scholars to ensure spiritual accuracy and meaningful depth. No generic platitudes—only authentic Islamic wisdom.
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-12 text-center">
                <span className="text-6xl">📚</span>
                <p className="mt-4 font-semibold">Quranic Grounded</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Community Focused</h3>
                <p className="text-slate-600 leading-relaxed">
                  Share your daily reflections with loved ones. Inspire your family, friends, and broader community with beautiful flyers that spark meaningful conversations about faith and spirituality.
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-12 text-center">
                <span className="text-6xl">👥</span>
                <p className="mt-4 font-semibold">Build Community</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Habit Formation</h3>
                <p className="text-slate-600 leading-relaxed">
                  3 reflections per day with streak tracking keeps you accountable and motivated. Building a consistent spiritual practice has never been more rewarding or visible.
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-12 text-center">
                <span className="text-6xl">⚡</span>
                <p className="mt-4 font-semibold">Consistent Practice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Stores Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Get the App</h2>
            <p className="text-xl text-slate-300">Available on web, iOS, and Android. Works offline with PWA technology.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/app" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all flex items-center gap-3">
              <span>🌐</span> Open Web App
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-3">
              <span>🔵</span> Google Play
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-3">
              <span>🍎</span> App Store
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <h2 className="text-4xl font-bold">Ready to Transform Your Ramadan?</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Start creating authentic, beautiful reflections today. No sign-up, no credit card, no complications. Just your name and a 4-digit PIN.</p>
        <a href="/app" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all">
          Create Your First Reflection →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Ramadan Bot. Made with ❤️ for the Muslim community.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy Policy</Link>
            <a href="mailto:hello@ramadanbot.app" className="text-sm text-slate-600 hover:text-slate-900">Contact</a>
            <a href="/app" className="text-sm font-semibold text-slate-900 hover:text-slate-700">Open App →</a>
          </div>
        </div>
      </footer>
    </main>
  );
}


