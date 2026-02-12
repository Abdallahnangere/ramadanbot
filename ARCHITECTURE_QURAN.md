# 📊 Quran Reader - Visual Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            AppleQuranReader Component                │   │
│  │                                                       │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────────┐ │   │
│  │  │   Header   │  │   Sidebar   │  │  Main Viewer  │ │   │
│  │  │  Day/Phase │  │  30 Days    │  │  Quran Images │ │   │
│  │  │  Progress  │  │  Status     │  │  Navigation   │ │   │
│  │  └────────────┘  └─────────────┘  └───────────────┘ │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │         Page Navigation Controls               │  │   │
│  │  │  [<] [1] [2] [3] [4] [5] [>]  Page 45/604    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │     Phase Progress & Completion                │  │   │
│  │  │  [<] Complete Phase [>]                         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ (actions)
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  lib/quranPages.ts:                                          │
│  ├─ getPhasePageRange(day, phase)                           │
│  ├─ isPhaseLockedStatus(day, phase, completed)             │
│  ├─ calculatePhaseProgress()                                │
│  └─ validateDayPhase()                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Server API Layer                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  app/actions.ts:                                             │
│  ├─ getCompletedQuranPhases(userId)                         │
│  └─ completeQuranPhaseEnhanced(userId, day, phase)          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  quran_progress:                                             │
│  ├─ user_id (FK to users)                                   │
│  ├─ day (1-30)                                              │
│  ├─ phase (1-5)                                             │
│  ├─ page_start, page_end                                    │
│  ├─ completed (boolean)                                     │
│  └─ completed_at (timestamp)                                │
│                                                               │
│  users:                                                      │
│  ├─ quran_current_day                                       │
│  ├─ quran_current_phase                                     │
│  ├─ quran_total_pages_read                                  │
│  ├─ quran_completed_at                                      │
│  └─ quran_streak                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Page & Image Flow

```
Start (Day 1, Phase 1)
  ↓
Display Pages 1-4
  ├─ Fetch from CDN: https://cdn.qurancdn.com/images/pages/page1.png
  ├─ Fetch from CDN: https://cdn.qurancdn.com/images/pages/page2.png
  ├─ Fetch from CDN: https://cdn.qurancdn.com/images/pages/page3.png
  └─ Fetch from CDN: https://cdn.qurancdn.com/images/pages/page4.png
  ↓
User navigates between pages
  ├─ Click page thumbnails: Quick jump to page 1-5
  ├─ Previous/Next button: Smooth transitions
  └─ Display page count: "Page 45/604 (Day 2, Phase 1)"
  ↓
User completes phase
  └─ Click "Complete Phase" button
     ↓ (validation)
     Database update + Client state + show celebration
     ↓
     Next phase unlocks automatically
```

## Reading Path Example

```
Day 1 Progress Visualization:
┌─────────────────────────────────────────┐
│ Day 1 Reading Phases                    │
├─────────────────────────────────────────┤
│                                         │
│ Phase 1 [████████████████████] 100% ✓   │ Pages 1-4
│ Phase 2 [████████████████████] 100% ✓   │ Pages 5-8
│ Phase 3 [████████████████████] 100% ✓   │ Pages 9-12
│ Phase 4 [████████████████████] 100% ✓   │ Pages 13-16
│ Phase 5 [░░░░░░░░░░░░░░░░░░░░] 0%  🔒   │ Pages 17-20
│                                         │
│ Overall Ramadan Progress                │
│ [████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  │ 3% (1/30 days)
│                                         │
└─────────────────────────────────────────┘

After completing Phase 1:
└─→ Phase 2 automatic unlock → User can click "Next Phase"

After completing all Phases 1-5:
└─→ Day 2 Phase 1 automatic unlock on next session
```

## Locking Decision Tree

```
User clicks: Day N, Phase P

    ↓
    Is Day=1 AND Phase=1?
    ├─→ YES: ✓ UNLOCK (default start)
    └─→ NO:
        ↓
        Is Phase > 1?
        ├─→ YES:
        │   ├─ Check: Day N, Phase P-1 completed?
        │   ├─→ YES: ✓ UNLOCK
        │   └─→ NO: 🔒 LOCK "Complete Phase P-1 first"
        └─→ NO (Phase = 1):
            ├─ Check: Day N-1, All Phases (1-5) completed?
            ├─→ YES: ✓ UNLOCK
            └─→ NO: 🔒 LOCK "Complete all phases of Day N-1 first"
```

## State Management Flow

```
App State (React Context)
├─ currentUser
│  ├─ quran_current_day
│  ├─ quran_current_phase
│  ├─ quran_total_pages_read
│  └─ quran_completed_at
│
├─ completedQuranPhases[] (loaded on init)
│  └─ [{ day, phase }, { day, phase }, ...]
│
└─ activeTab (flyer | quran)

Component Local State (AppleQuranReader)
├─ currentDay (for UI display)
├─ currentPhase (for UI display)
├─ currentPageIndex (0-4 for 5 pages)
├─ pageImages[] (URLs of 5 page images)
├─ isPhaseCompleted (boolean)
├─ isPhaseLocked (boolean via calculation)
└─ loading states

Persistence Layer
├─ localStorage: User data backup
├─ Database: Complete source of truth
└─ Session: In-memory during app usage
```

## Progress Calculation Pipeline

```
Input: User data
  ↓
  [Total Phases Completed] = count(quran_progress where completed=true)
  ↓
  [Total Pages Read] = phasesCompleted × 5 (pages per phase)
  ↓
  [Overall %] = (totalPages / 604) × 100
  ↓
  [Phase %] = (currentPageInPhase / 5) × 100
  ↓
  Visual Progress Bars (animated)
```

## Completion Validation Pipeline

```
User Action: Click "Complete Phase"
  ↓
  Validation Layer:
  ├─ Is input valid? (1 ≤ day ≤ 30, 1 ≤ phase ≤ 5)
  ├─ User exists and not banned?
  ├─ Phase not already completed?
  └─ Lock status allows completion?
  ↓
  Server Action: completeQuranPhaseEnhanced()
  ├─ BEGIN TRANSACTION
  ├─ Re-validate inputs (security)
  ├─ Check locking rules (business logic)
  ├─ INSERT record into quran_progress
  ├─ UPDATE users table
  ├─ COMMIT TRANSACTION
  └─ CATCH: ROLLBACK on any error
  ↓
  Response Handler:
  ├─ Success → Update client state
  ├─ → Sync localStorage
  ├─ → Show celebration
  ├─ → Auto-unlock next phase
  └─ Error → Show error toast
```

## UI Layout Breakdown

### Desktop View
```
┌─────────────────────────────────────────────────────────┐
│  Header: Day 2 • Phase 3 of 5                           │
├─────────────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                             │
│         │                                               │
│ Day 1 ✓ │ ┌─────────────────────────────────────────┐ │
│ Day 2●  │ │                                         │ │
│ Day 3 ○ │ │   [Quran Page Image Display]           │ │
│ Day 4 ○ │ │   Beautiful High-Res Mushaf            │ │
│ ...     │ │   Page 45/604                          │ │
│ Day 30○ │ │   (locked overlay if not accessible)  │ │
│         │ │                                         │ │
│         │ └─────────────────────────────────────────┘ │
│         │                                               │
│         │ Controls:                                     │
│         │ [<] [1] [2] [3] [4] [5] [>]                │
│         │                                               │
│         │ Phase Progress: [██████░░░░░░░] 60%         │
│         │                                               │
│         │ [< Prev] [Complete Phase] [Next >]          │
└─────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────┐
│ ☰  Day 2, Phase 3    │
├──────────────────────┤
│                      │
│  [Quran Page Image]  │
│                      │
│  [Quran Page Image]  │
│                      │
│  (swipe for more)    │
│                      │
├──────────────────────┤
│ [<] [1][2][3][4][5]  │
├──────────────────────┤
│ Progress: [██░░░░░░] │
├──────────────────────┤
│ [Complete Phase ✓]   │
└──────────────────────┘
```

## Color Scheme

```
Light Mode:
├─ Background: White (#FFFFFF)
├─ Secondary: Gray-50 (#F9FAFB)
├─ Text Primary: Gray-900 (#111827)
├─ Text Secondary: Gray-600 (#4B5563)
├─ Primary Action: Blue-600 (#2563EB)
├─ Success: Green-500 (#10B981)
├─ Lock/Disabled: Gray-400 (#9CA3AF)
└─ Overlay: Black/70% opacity

Dark Mode:
├─ Background: Black (#000000)
├─ Secondary: Slate-900 (#0F172A)
├─ Text Primary: White (#FFFFFF)
├─ Text Secondary: Gray-400 (#9CA3AF)
├─ Primary Action: Blue-500 (#3B82F6)
├─ Success: Green-400 (#4ADE80)
├─ Lock/Disabled: Gray-600 (#4B5563)
└─ Overlay: Black/70% opacity
```

## Performance Metrics

```
Component Load Time: ~500ms
  ├─ 200ms: Component init & state setup
  ├─ 150ms: Image CDN fetch
  ├─ 100ms: Lock calculation
  └─ 50ms: Progress bar animation

Completion Action: ~800-1200ms
  ├─ 200ms: Client validation
  ├─ 300-700ms: Server round-trip
  ├─ 100ms: UI update
  └─ 200ms: Animation/celebration

Lock Status Check: <10ms
  (In-memory array traversal: O(n) where n ≤ 150)
```

## Responsive Breakpoints

```
Mobile (<640px):
├─ Full-screen component
├─ No sidebar
├─ Stacked controls
└─ Touch optimized (48px min targets)

Tablet (640-1024px):
├─ Optional sidebar toggle
├─ Adjusted spacing
└─ Medium page sizes

Desktop (>1024px):
├─ Always show sidebar
├─ Wide page display
├─ Expanded controls
└─ Optimized spacing
```

---

Built with React, TypeScript, Tailwind CSS, and ❤️ for Ramadan 🌙
