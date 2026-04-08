import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.resolve(process.cwd(), "../content/reports");

export interface Source {
  url: string;
  title: string;
  publisher: string;
  framing: string;
}

export interface LensCard {
  id: string;
  label: string;
  sees: string;
  fears: string;
  wouldDo: string;
}

export interface Report {
  id: string;
  date: string;
  generatedAt: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  sources: Source[];
  judgmentMap: {
    synthesis: string;
    lensCards: LensCard[];
    disagreementMatrix: {
      dimensions: string[];
      rows: { lens: string; stances: string[] }[];
    };
    actorMap: { name: string; leverage: string; stake: string; exposure: string }[];
    scenarioCards: { name: string; whatHappens: string; trigger: string; watchFor: string }[];
    hiddenAssumptions: string[];
    whatThisMisses: string;
  };
}

export interface DayIndex {
  date: string;
  generatedAt: string;
  reports: { id: string; title: string; subtitle: string; category: string; lenses: string[] }[];
}

export function getDays(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
}

export function getDayIndex(date: string): DayIndex | null {
  const indexPath = path.join(CONTENT_DIR, date, "index.json");
  if (!fs.existsSync(indexPath)) return null;
  return JSON.parse(fs.readFileSync(indexPath, "utf-8"));
}

export function getReport(date: string, slug: string): Report | null {
  const reportPath = path.join(CONTENT_DIR, date, `${slug}.json`);
  if (!fs.existsSync(reportPath)) return null;
  return JSON.parse(fs.readFileSync(reportPath, "utf-8"));
}

export function getLatestDay(): DayIndex | null {
  const days = getDays();
  if (days.length === 0) return null;
  return getDayIndex(days[0]);
}

export function getAllReports(): { date: string; slug: string }[] {
  const days = getDays();
  const all: { date: string; slug: string }[] = [];
  for (const date of days) {
    const index = getDayIndex(date);
    if (!index) continue;
    for (const r of index.reports) {
      all.push({ date, slug: r.id });
    }
  }
  return all;
}

export function getLensColor(lensId: string): string {
  const colors: Record<string, string> = {
    kantian: "var(--color-accent-kant)",
    foucauldian: "var(--color-accent-foucault)",
    utilitarian: "var(--color-accent-util)",
    nietzschean: "var(--color-accent-nietzsche)",
    stoic: "var(--color-accent-stoic)",
    aristotelian: "var(--color-accent-aristotle)",
    buddhist: "var(--color-accent-buddhist)",
    existentialist: "var(--color-accent-existentialist)",
  };
  return colors[lensId] || "var(--color-text-muted)";
}
