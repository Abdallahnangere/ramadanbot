export default function LibraryPage() {
  return (
    <main className="section">
      <div className="container grid">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Islamic Library (User-Facing Data Index)</h1>
          <p className="muted">
            Ramadanbot v2.0 consumes curated Islamic datasets from the separate Anjal Islamic Library stack. This page
            shows the visible coverage and content domains users can expect.
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hadith Collections</h2>
          <ul className="muted">
            <li>Sahih al Bukhari</li>
            <li>Sahih Muslim</li>
            <li>Sunan Abu Dawud</li>
            <li>Jami at-Tirmidhi</li>
            <li>Sunan an-Nasai</li>
            <li>Sunan Ibn Majah</li>
            <li>Muwatta Malik</li>
            <li>Forty Hadith Nawawi</li>
            <li>Forty Hadith Qudsi</li>
            <li>Forty Hadith Dehlawi</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Quran Surahs</h2>
          <p className="muted">
            Full Quran coverage: 114 surahs and 6,236 ayahs, with Arabic text and English translation support.
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hijri (Umm al-Qura) Conversion Range</h2>
          <p className="muted">Supported range: 1343 AH to 1500 AH (Umm al-Qura mapping).</p>
          <p className="muted">Gregorian coverage window: 1924-08-01 to 2077-11-16.</p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Prayer Countries & Cities</h2>
          <p className="muted">
            Nigeria-wide city coverage plus selected major international countries and cities for prayer lookup.
          </p>
          <ul className="muted">
            <li>Nigeria (comprehensive city set)</li>
            <li>Saudi Arabia, United States, United Kingdom, Egypt, Pakistan, Turkey, and more</li>
            <li>Live countdown UI on landing page uses Lagos timing as an operational showcase</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
