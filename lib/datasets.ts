import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

type Row = Record<string, string>;

const dataDir = path.join(process.cwd(), "data");

let cache: {
  quranAyahs?: Row[];
  quranSurahs?: Row[];
  hadithEntries?: Row[];
  hadithCollections?: Row[];
  hijriDates?: Row[];
  prayerTimes?: Row[];
} = {};

function readCsv(fileName: string): Row[] {
  const fullPath = path.join(dataDir, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true
  }) as Row[];
}

export function getQuranAyahs(): Row[] {
  if (!cache.quranAyahs) cache.quranAyahs = readCsv("ayahs_ar_en.csv");
  return cache.quranAyahs;
}

export function getQuranSurahs(): Row[] {
  if (!cache.quranSurahs) cache.quranSurahs = readCsv("surahs_ar_en.csv");
  return cache.quranSurahs;
}

export function getHadithEntries(): Row[] {
  if (!cache.hadithEntries) cache.hadithEntries = readCsv("hadith_all_collections_ar_en.csv");
  return cache.hadithEntries;
}

export function getHadithCollections(): Row[] {
  if (!cache.hadithCollections) cache.hadithCollections = readCsv("collections_summary.csv");
  return cache.hadithCollections;
}

export function getHijriDates(): Row[] {
  if (!cache.hijriDates) cache.hijriDates = readCsv("ummalqura_1343_1500.csv");
  return cache.hijriDates;
}

export function getPrayerTimes(): Row[] {
  if (!cache.prayerTimes) cache.prayerTimes = readCsv("prayer_times_selected_plus_all_nigeria.csv");
  return cache.prayerTimes;
}

export function buildCompletionPlan(totalJuz: number, days: number) {
  const perDay = totalJuz / days;
  const plan = [];
  for (let day = 1; day <= days; day += 1) {
    const from = (day - 1) * perDay + 1;
    const to = day * perDay;
    plan.push({
      day,
      from_juz: Number(from.toFixed(2)),
      to_juz: Number(to.toFixed(2))
    });
  }
  return plan;
}
