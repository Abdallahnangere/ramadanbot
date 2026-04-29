export default function FeaturesPage() {
  return (
    <main className="section">
      <div className="container card">
        <h1 style={{ marginTop: 0 }}>Features (Version 2.0)</h1>
        <div className="grid grid-2">
          <div>
            <h3>1. Full Quran Reader</h3>
            <p className="muted">Read full Quran pages with indexed references and ayah-level lookup support.</p>
          </div>
          <div>
            <h3>2. Quran Search</h3>
            <p className="muted">Find verses quickly using Arabic or English search phrases.</p>
          </div>
          <div>
            <h3>3. Personalized Completion Plan</h3>
            <p className="muted">
              Select your schedule and get structured completion targets by day for consistent progress.
            </p>
          </div>
          <div>
            <h3>4. Hijri Calendar (Umm al-Qura)</h3>
            <p className="muted">Accurate Gregorian-Hijri conversion based on the Saudi Umm al-Qura dataset.</p>
          </div>
          <div>
            <h3>5. Prayer Times by Country & City</h3>
            <p className="muted">Prayer lookup across Nigeria and selected global locations.</p>
          </div>
          <div>
            <h3>6. Hadith Collections</h3>
            <p className="muted">Multi-collection hadith library including Bukhari, Muslim, Tirmidhi, and more.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
