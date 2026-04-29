import {
  getHadithCollections,
  getHijriDates,
  getPrayerTimes,
  getQuranSurahs
} from "@/lib/datasets";

export default function LibraryPage() {
  const hadithCollections = getHadithCollections();
  const surahs = getQuranSurahs();
  const hijri = getHijriDates();
  const prayer = getPrayerTimes();

  const countries = Array.from(new Set(prayer.map((r) => r.country))).sort();
  const cityByCountry = countries.map((country) => ({
    country,
    cities: Array.from(
      new Set(prayer.filter((r) => r.country === country).map((r) => r.city))
    ).sort()
  }));

  return (
    <main className="section">
      <div className="container grid">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Islamic Library (User-Facing Data Index)</h1>
          <p className="muted">
            Public data coverage for Ramadanbot v2.0. This page lists the core datasets now supporting year-round use.
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hadith Collections</h2>
          <ul className="muted">
            {hadithCollections.map((c) => (
              <li key={c.collection_key}>
                <strong style={{ color: "#12203a" }}>{c.collection_name}</strong> ({c.collection_key}) - {c.merged_count} entries
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Quran Surahs</h2>
          <p className="muted">Total: {surahs.length} surahs.</p>
          <div style={{ maxHeight: 260, overflow: "auto", border: "1px solid #dce4f3", borderRadius: 8, padding: "0.6rem" }}>
            <ul className="muted" style={{ margin: 0 }}>
              {surahs.map((s) => (
                <li key={s.surah_number}>
                  {s.surah_number}. {s.name_english} ({s.name_arabic}) - {s.ayah_count} ayahs
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hijri (Umm al-Qura) Conversion Range</h2>
          <p className="muted">
            Supported range: {hijri[0]?.hijri_iso} to {hijri[hijri.length - 1]?.hijri_iso}
          </p>
          <p className="muted">
            Gregorian range: {hijri[0]?.gregorian_iso} to {hijri[hijri.length - 1]?.gregorian_iso}
          </p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Prayer Countries & Cities</h2>
          <p className="muted">Countries: {countries.length}</p>
          <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid #dce4f3", borderRadius: 8, padding: "0.6rem" }}>
            {cityByCountry.map((entry) => (
              <details key={entry.country} style={{ marginBottom: "0.7rem" }}>
                <summary style={{ cursor: "pointer", color: "#12203a", fontWeight: 600 }}>
                  {entry.country} ({entry.cities.length} cities)
                </summary>
                <p className="muted" style={{ margin: "0.4rem 0 0" }}>
                  {entry.cities.join(", ")}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
