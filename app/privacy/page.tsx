export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container card">
        <h1 style={{ marginTop: 0 }}>Privacy Policy</h1>
        <p className="muted">
          Ramadanbot v2.0 is committed to minimizing personal data exposure and handling usage information responsibly.
        </p>
        <h3>Data Principles</h3>
        <ul className="muted">
          <li>We collect only data needed for product operation and user experience.</li>
          <li>We do not sell personal user information.</li>
          <li>Operational logs are used for reliability, abuse prevention, and product quality.</li>
          <li>Dataset sources (Quran, Hadith, Hijri, Prayer) are used for informational lookup features.</li>
        </ul>
        <h3>Contact</h3>
        <p className="muted">
          For privacy questions: <a href="mailto:founder@ramadanbot.app">founder@ramadanbot.app</a>
        </p>
      </div>
    </main>
  );
}
