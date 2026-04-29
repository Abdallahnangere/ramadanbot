import Link from "next/link";
import PrayerCounter from "@/components/PrayerCounter";

export default function HomePage() {
  return (
    <main>
      <section className="section hero">
        <div className="container split">
          <div className="card hero-panel">
            <h1>Ramadanbot v2.0 is now year-round</h1>
            <p className="muted">
              Ramadanbot is no longer a Ramadan-only experience. Version 2.0 is designed for daily use all year: structured Quran reading, reliable reference access, and consistent worship support before, during, and after Ramadan.
            </p>
            <div style={{ margin: "1rem 0" }}>
              <span className="badge">Full Quran Reader</span>
              <span className="badge">Quran Plan Builder</span>
              <span className="badge">Umm al-Qura Hijri Calendar</span>
              <span className="badge">Prayer Times by Country & City</span>
              <span className="badge">Hadith Collections</span>
            </div>
            <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
              <Link className="btn" href="/features">
                Explore Features
              </Link>
              <Link className="btn secondary" href="/about">
                About Founder
              </Link>
            </div>
          </div>
          <PrayerCounter />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>What’s New in Version 2.0</h2>
            <div className="grid grid-3">
              <div>
                <h3>Quran Reader & Search</h3>
                <p className="muted">
                  Full Quran reading experience with indexed ayah discovery so users can quickly find passages in Arabic
                  and English.
                </p>
              </div>
              <div>
                <h3>Personalized Completion Plans</h3>
                <p className="muted">
                  Users choose their timeline and receive a structured Quran completion plan designed around consistency.
                </p>
              </div>
              <div>
                <h3>Reliable Islamic Data Layer</h3>
                <p className="muted">
                  Curated datasets: Umm al-Qura Hijri mappings, prayer locations, and multiple hadith collections ready
                  for lookup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <div className="card">
            <div className="kpi">365</div>
            <p className="muted">Built for daily relevance, not seasonal spikes.</p>
          </div>
          <div className="card">
            <div className="kpi">10+</div>
            <p className="muted">Major hadith collections represented in the product data layer.</p>
          </div>
          <div className="card">
            <div className="kpi">604</div>
            <p className="muted">Complete Quran page journey available for guided consistency.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Dataset Coverage</h2>
            <table>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quran</td>
                  <td>114 surahs, 6,236 ayahs (Arabic + English)</td>
                </tr>
                <tr>
                  <td>Hadith</td>
                  <td>
                    Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah, Malik, Nawawi, Dehlawi, Qudsi
                  </td>
                </tr>
                <tr>
                  <td>Hijri</td>
                  <td>Umm al-Qura 1343 AH - 1500 AH</td>
                </tr>
                <tr>
                  <td>Prayer Times</td>
                  <td>Nigeria all cities + selected global countries/cities</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Mission & Product Philosophy</h2>
            <p className="muted">
              Ramadanbot v2.0 is built to keep Muslim users consistent after Ramadan by making daily worship tools
              practical, fast, and accessible in one product.
            </p>
            <h3>Core Product Direction</h3>
            <ul className="muted">
              <li>Daily Quran engagement with progress structure</li>
              <li>Prayer-awareness integrated into regular life</li>
              <li>Reference-grade Islamic lookup utilities</li>
              <li>Clean user experience for ordinary users and developers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container card">
          <h2 style={{ marginTop: 0 }}>Why This Rebuild Matters</h2>
          <p className="muted">
            Many Islamic apps lose engagement after Ramadan because the product loop is tied to one month. Ramadanbot
            v2.0 fixes that by centering features users can sustain: daily reading goals, searchable references,
            calendar conversion utilities, and city-based prayer awareness.
          </p>
          <p className="muted">
            This version is intentionally rebuilt as a clean public-facing frontend foundation. Admin and in-app
            authenticated experiences are intentionally deferred to a later sprint.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container card">
          <h2 style={{ marginTop: 0 }}>Founder</h2>
          <p className="muted" style={{ marginBottom: "0.4rem" }}>
            <strong style={{ color: "#12203a" }}>Abdallah Nangere</strong> is the founder of Ramadanbot and leads the
            transition from Ramadan-only utility to a year-round Islamic consistency platform.
          </p>
          <p className="muted" style={{ marginTop: 0 }}>
            Contact: <a href="mailto:founder@ramadanbot.app">founder@ramadanbot.app</a> |{" "}
            <a href="https://wa.me/2348164135836">+2348164135836</a>
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <img src="https://anjalventures.com/logo.png" alt="Anjal Ventures" style={{ height: 42 }} />
            <div className="muted" style={{ marginTop: "0.4rem" }}>
              BUILT BY ANJAL VENTURES <a href="https://www.anjalventures.com">WWW.ANJALVENTURES.COM</a>
            </div>
          </div>
          <a className="btn" href="https://wa.me/2348164135836">
            WhatsApp Founder
          </a>
        </div>
      </footer>
    </main>
  );
}
