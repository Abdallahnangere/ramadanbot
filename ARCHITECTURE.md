# Architecture & Structure - Ramadan Bot v2.0

## 📐 Application Architecture

### High-Level Overview

```
www.ramadanbot.app (Marketing & Preview)
│
├── / (Homepage)
│   ├── Hero Section with Value Proposition
│   ├── Features Grid (6 core features)
│   ├── Why Ramadan Bot Section
│   ├── App Store Badges
│   └── CTA Buttons → /app
│
├── /app (Main Application)
│   ├── Authentication (PIN-based)
│   ├── Flyer Generation Interface
│   │   ├── Topic Input
│   │   ├── Day Selector (1-30)
│   │   ├── Hint/Verse Input
│   │   └── Generate Button (locked during limit)
│   ├── Daily Limit Tracking (3/day)
│   ├── Streak Display
│   ├── Download & Share Features
│   └── History/Previous Flyers
│
├── /app/admin (Admin Dashboard)
│   ├── Authentication (Admin Password)
│   ├── Overview Tab
│   │   ├── Analytics Cards (color-coded)
│   │   ├── Performance Metrics
│   │   └── System Stats
│   └── Users Tab
│       ├── User Search/Filter
│       ├── User List Table
│       │   ├── User Info (name, avatar, ID)
│       │   ├── Performance (streak, generation count)
│       │   ├── Daily Limit (editable)
│       │   ├── Ban Button
│       │   └── Delete Button (confirmation)
│       └── Summary Cards
│
└── /privacy (Privacy Policy)
```

---

## 🗂️ File Structure

### Root Level Configuration
```
ramadanbot/
├── app/                              # Next.js app directory
│   ├── layout.tsx                   # Root layout (homepage layout)
│   ├── page.tsx                     # Homepage (/) - marketing page
│   ├── actions.ts                   # Server actions (auth, generation, admin)
│   ├── app/                         # App sub-application directory
│   │   ├── layout.tsx              # App layout (with PWA meta tags)
│   │   ├── page.tsx                # Main app page (/app)
│   │   └── admin/
│   │       └── page.tsx            # Admin page (/app/admin) - redirect
│   ├── api/
│   │   └── user/
│   │       └── route.ts            # User API endpoint
│   ├── privacy/
│   │   └── page.tsx                # Privacy policy
│   └── globals.css                  # Global styles
│
├── components/                       # React components
│   ├── AdminDashboard.tsx           # Admin interface (Apple-design)
│   ├── RamadanForm.tsx              # Flyer generation form
│   ├── FlyerPreview.tsx             # Flyer preview/preview modal
│   ├── LoginScreen.tsx              # Application login
│   ├── Sidebar.tsx                  # Navigation sidebar
│   ├── HistoryModal.tsx             # Previous flyers display
│   ├── SettingsScreen.tsx           # User settings
│   ├── PWARegistration.tsx          # PWA installation handler
│   ├── Toast.tsx                    # Notification system
│   ├── LoadingSpinner.tsx           # Loading indicator
│   └── RateLimitMessage.tsx         # Rate limit notifications
│
├── lib/                              # Utility modules
│   ├── db.ts                        # PostgreSQL connection via Neon
│   ├── gemini.ts                    # Google Gemini 2.5 Flash API integration
│   ├── flyerGenerator.ts            # HTML to PNG conversion (html2canvas)
│   └── rateLimit.ts                 # Daily limit tracking logic
│
├── public/                           # Static assets
│   ├── manifest.json                # PWA manifest (updated domain/scope)
│   ├── sw.js                        # Service worker
│   ├── icons/                       # PWA icons
│   └── [verification files]
│
├── Database/
│   ├── db_migrations.sql            # Initial schema + new is_banned index
│   └── neon_update_limits.sql       # Neon-specific configurations
│
├── Documentation/
│   ├── README.md                    # Updated with v2.0 features & domain
│   ├── CHANGELOG.md                 # Detailed change log (NEW)
│   ├── DATABASE_MIGRATIONS.md       # SQL migrations guide (NEW)
│   ├── DEPLOYMENT_GUIDE.md          # Deployment instructions (NEW)
│   └── ARCHITECTURE.md              # This file
│
├── Configuration Files/
│   ├── next.config.mjs              # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.ts           # Tailwind CSS theme
│   ├── postcss.config.mjs           # PostCSS plugins
│   ├── package.json                 # Dependencies & scripts
│   ├── vercel.json                  # Vercel deployment config
│   └── .gitignore
│
└── Type Definitions/
    └── types.ts                      # TypeScript interfaces
        ├── User interface
        ├── AnalyticsData interface
        ├── FormData interface
        └── Response interfaces
```

---

## 🔄 Data Flow Architecture

### User Authentication Flow
```
Login Screen
    ↓
PIN Input (4 digits)
    ↓
Server Action: loginUser()
    ↓
Check in PostgreSQL users table
    ↓
Create account if new / Load if returning
    ↓
Return user data + session token
    ↓
Main App Interface
```

### Flyer Generation Flow
```
RamadanForm (User Input)
    ├── Topic select
    ├── Day input (1-30)
    └── Optional hint
         ↓
    Check Daily Limit via API
    (3 generations/day)
         ↓
    If limit reached → Show locked button with countdown
    If limit available → Enable generate button
         ↓
    Send to Server Action: checkLimitAndGenerate()
         ↓
    Google Gemini 2.5 Flash API (lib/gemini.ts)
    Generates reflection text
         ↓
    html2canvas Library
    Renders beautiful flyer image
         ↓
    Return PNG + Share URLs
         ↓
    FlyerPreview Component
    Display + Download/Share options
```

### Admin Flow
```
Admin Password Input
    ↓
Server Action: adminLogin()
    ↓
Verify admin password
    ↓
AdminDashboard Component
    ├── Overview Tab
    │   └── Fetch Analytics Data
    │       ├── Total users
    │       ├── Total generations
    │       ├── Active streaks
    │       └── Performance metrics
    │
    └── Users Tab
        ├── Fetch All Users (fetchAllUsers)
        ├── Display User List with Search/Filter
        ├── EditLimit Button
        │   └── updateUserLimit()
        ├── Ban Button
        │   └── toggleUserBan()
        └── Delete Button (NEW)
            └── deleteUser()
                ├── Transaction BEGIN
                ├── Delete from generations table
                ├── Delete from users table
                └── Transaction COMMIT
```

---

## 🗄️ Database Schema

### Users Table
```sql
users (
  id: UUID PRIMARY KEY,
  name: VARCHAR,
  role: VARCHAR (user|admin),
  streak: INT (consecutive days),
  generation_count: INT (all-time total),
  last_login: TIMESTAMP,
  last_generation_date: TIMESTAMP,
  rate_limit_override: INT (daily limit, default 3),
  is_banned: BOOLEAN (default FALSE) [INDEXED],
  created_at: TIMESTAMP
)
```

### Generations Table
```sql
generations (
  id: UUID PRIMARY KEY,
  user_id: UUID FOREIGN KEY,
  topic: VARCHAR,
  day: INT,
  hint: VARCHAR,
  reflection_text: TEXT,
  image_url: VARCHAR,
  created_at: TIMESTAMP
)
```

### Index Added (v2.0)
```sql
CREATE INDEX idx_users_is_banned ON users(is_banned);
```

---

## 🌐 Routing Structure

### Next.js App Router (File-Based Routing)

```
/                    → app/page.tsx (Homepage)
/app                 → app/app/page.tsx (Main app + login)
/app/admin           → app/app/admin/page.tsx (Admin redirect)
/privacy             → app/privacy/page.tsx
/api/user            → app/api/user/route.ts
/_not-found          → Custom 404 page
```

### Route Layouts (Nesting)

```
app/layout.tsx (Root layout - homepage aesthetics)
├── / (Homepage page)
└── Nested routes under root layout
    
app/app/layout.tsx (App layout - PWA meta tags, dark mode)
├── /app (Main app)
└── /app/admin (Admin redirect)
```

---

## 🎨 Component Hierarchy

```
Root: App.tsx (Client initialization)
│
├── Page: app/page.tsx (Homepage)
│   └── Components: Hero, Features, Footer
│
├── Layout: app/app/layout.tsx
│   └── Page: app/app/page.tsx
│       ├── LoginScreen (if !isAuthenticated)
│       │   └── PIN input form
│       │
│       ├── Sidebar
│       │   ├── Streak display
│       │   ├── Navigation
│       │   └── Settings button
│       │
│       ├── RamadanForm
│       │   ├── Topic selector
│       │   ├── Day input
│       │   ├── Hint input
│       │   └── Generate button (locked if hasLimitReached)
│       │       └── Inline countdown timer (if limit reached)
│       │
│       ├── FlyerPreview
│       │   ├── Image display
│       │   ├── Download button
│       │   └── Share buttons (WhatsApp, X, Facebook, Snapchat)
│       │
│       ├── HistoryModal
│       │   └── Previous flyers gallery
│       │
│       └── Toast
│           └── Notification messages
│
└── Layout: app/app/layout.tsx
    └── Page: app/app/admin/page.tsx
        └── AdminDashboard
            ├── Login form (if !isAuthenticated)
            │
            ├── Navbar
            │   ├── Back button
            │   └── Tab switcher (Overview/Users)
            │
            ├── Overview Tab
            │   ├── Stats cards (4 main metrics)
            │   ├── Additional metrics (3 sub-metrics)
            │   └── Refresh button
            │
            └── Users Tab
                ├── Search input
                ├── User table
                │   ├── User info cell
                │   ├── Performance cell
                │   ├── Daily limit cell (editable)
                │   ├── Ban button
                │   └── Delete button (with confirmation)
                └── Summary cards (total/active/banned)
```

---

## 🔌 External API Integrations

### Google Gemini 2.5 Flash
**File**: `lib/gemini.ts`

```typescript
API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
Method: POST
Auth: API Key in environment variable

Request Body:
{
  topic: string (e.g., "Taqwa")
  day: number (1-30)
  hint?: string (optional)
}

Response:
{
  text: string (150-250 chars of Islamic reflection)
  error?: string
}
```

### Email/WhatsApp/Social Sharing
**File**: `components/FlyerPreview.tsx`

```
- WhatsApp Share: wa.me/?text=
- X (Twitter): twitter.com/intent/tweet?text=
- Facebook: facebook.com/sharer.php?u=
- Snapchat: snapchat.com/scan?attachmentUrl=
- Instagram: Via image file download
```

---

## 🔐 Authentication Architecture

### Application Login (PIN-based)
- User enters name (any text)
- User enters PIN (4 digits)
- No password complexity requirements
- Auto-creates account on first login
- Stored in `users` table

### Admin Login (Password-based)
- Admin enters password (environment variable)
- Verified in `adminLogin()` server action
- Returns auth token (simple check)
- No persistent session (checked per-request)

---

## 🎨 Design System (Apple Standard)

### Color Palette
- **Primary**: Blue (action buttons, focus states)
- **Secondary**: Purple (gradients, accents)
- **Success**: Green (positive feedback)
- **Warning**: Orange (cautions)
- **Danger**: Red (destructive actions)
- **Neutral**: Gray shades (backgrounds, borders)

### Typography
- **Headlines**: Cinzel + Cormorant Garamond (Arabic: Amiri)
- **Body**: Inter (clean, readable)
- **Size Scale**: 12px → 48px with consistent ratios

### Spacing
- Base unit: 4px
- Commonly used: 4, 8, 12, 16, 24, 32, 48, 64px

### Rounded Corners
- Small: 8px (input fields)
- Medium: 12px (cards)
- Large: 16px (modals)
- **Extra Large**: 24px (Apple standard)

### Shadows (Dark Mode Aware)
- Subtle: 0 1px 2px rgba(0,0,0,0.05)
- Normal: 0 2px 8px rgba(0,0,0,0.1)
- Elevated: 0 8px 16px rgba(0,0,0,0.15)

---

## 🚀 Performance Optimizations

### Code Splitting
- Next.js automatic route-based splitting
- Each page loads only needed code
- App route at `/app` is separate chunk

### Image Optimization
- `next/image` for automatic optimization
- Lazy loading for off-screen images
- WebP format when supported

### PWA Caching Strategy
- Service worker caches `/app` bundle
- Offline support for cached pages
- Cache-first strategy for `/app` scope

### Database Query Optimization
- `is_banned` index for faster filtering
- Connection pooling via Neon
- Query result caching where applicable

---

## 📱 PWA Configuration

### Manifest Location
`public/manifest.json`

### Key Settings
```json
{
  "id": "https://www.ramadanbot.app/app",
  "start_url": "https://www.ramadanbot.app/app",
  "scope": "/app",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "orientation": "portrait-primary"
}
```

### Service Worker
`public/sw.js` - Handles caching and offline support

---

## 🔄 Deployment Pipeline

```
Local Development
    ↓ git push origin main
GitHub Repository
    ↓ Webhook trigger
Vercel Build System
    ├── Install dependencies
    ├── Run TypeScript checks
    ├── Run Next.js build
    ├── Run tests (if configured)
    └── Deploy to production
         ↓
Production (www.ramadanbot.app)
    └── Global CDN caching
```

---

## 📊 Monitoring & Observability

### Logging
- Application logs via `console` (monitored by Vercel)
- Database query logs in Neon dashboard
- Admin actions logged with timestamps

### Metrics Tracked
- Page load times
- Generation success rate
- Admin actions (ban, delete)
- Daily active users
- Streak distribution

### Alerts (Recommended future setup)
- Build failures
- High error rate (>5%)
- Database connection issues
- API quota exceeded

---

## 🔮 Future Architecture Improvements

1. **Caching Layer**: Redis for session caching
2. **Message Queue**: Bull/Redis for async tasks
3. **Analytics**: PostHog or Mixpanel integration
4. **CDN for Assets**: Cloudinary for image optimization
5. **Websockets**: Real-time admin dashboard updates
6. **GraphQL**: Alternative to REST API

---

**Architecture Version**: 2.0  
**Last Updated**: February 7, 2026  
**Maintained By**: Abdallah Nangere
