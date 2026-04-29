export default function AboutPage() {
  return (
    <main className="section">
      <div className="container card">
        <h1 style={{ marginTop: 0 }}>About the Founder</h1>
        <p className="muted">
          Ramadanbot was founded by <strong style={{ color: "#12203a" }}>Abdallah Nangere</strong> with a focus on
          practical Islamic technology for real daily consistency.
        </p>
        <p className="muted">
          Version 2.0 marks a strategic shift from seasonal usage to a year-round experience, centered on Quran reading,
          structured completion planning, prayer-time awareness, hadith discovery, and Hijri date utilities.
        </p>
        <p className="muted">
          Contact: <a href="mailto:founder@ramadanbot.app">founder@ramadanbot.app</a> |{" "}
          <a href="https://wa.me/2348164135836">+2348164135836</a>
        </p>
      </div>
    </main>
  );
}
