export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  streak: number;
  generation_count: number;
  last_login: string;
  last_generation_date: string | null;
  rate_limit_override: number;
  is_banned: boolean;
  created_at: string;
  // Quran tracking
  quran_current_day?: number;
  quran_current_phase?: number;
  quran_current_page?: number;
  quran_total_pages_read?: number;
  quran_streak?: number;
  quran_last_read_date?: string | null;
  quran_started_at?: string | null;
  quran_completed_at?: string | null;
  // Optional fields returned by server endpoints
  today_generations?: number;
  remaining?: number;
  limit?: number;
  last_topic?: string | null;
}

export interface FormData {
  topic: string;
  day: number;
  hint?: string;
}

export interface GenerateResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export interface GeneratedData {
  text: string;
  formData: FormData;
}

export interface AppState {
  view: 'login' | 'app' | 'admin' | 'settings';
  currentUser: User | null;
  isDarkMode: boolean;
}

export interface FlyerConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  userName: string;
  topic: string;
  day: number;
  message: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalGenerations: number;
  activeToday: number;
  bannedUsers: number;
  recentGenerations: {
    id: string;
    topic: string;
    user_name: string;
    created_at: string;
  }[];
}

export interface QuranPhase {
  day: number;
  phase: number;
  pageStart: number;
  pageEnd: number;
  completed: boolean;
  completedAt: string | null;
}

export interface QuranPage {
  pageNumber: number;
  surahNumber: number;
  surahName: string;
  ayahStart: number;
  ayahEnd: number;
}

export interface QuranAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  ayah: number;
}

export interface UserWithLastTopic extends User {
  last_topic?: string | null;
  last_topic_date?: string | null;
}