# 🔐 Quran Reader Locking System - Developer Guide

## Overview

The Quran Reader implements a sophisticated locking mechanism that ensures users complete reading phases in order, building a consistent Ramadan journey.

## Locking Rules

### Rule 1: Day 1, Phase 1 Always Unlocked
The reading journey starts with Day 1, Phase 1 always available.

```
Day 1, Phase 1: ✓ UNLOCKED (default)
```

### Rule 2: Sequential Phases Within a Day
Users must complete phases 1-4 before unlocking the next phase in the same day.

```
Day N:
├─ Phase 1: Locked until user completes it
├─ Phase 2: Locked until Phase 1 is complete
├─ Phase 3: Locked until Phase 2 is complete
├─ Phase 4: Locked until Phase 3 is complete
└─ Phase 5: Locked until Phase 4 is complete
```

### Rule 3: Day Progression Requirement
To start Day N+1 (Phase 1), users must complete ALL phases (1-5) of Day N.

```
├─ Day 29, Phase 5: You can start ONLY after...
│  └─ Day 29, All Phases (1-5) Complete
│
└─ Day 30, Phase 1: Now UNLOCKED
```

## Implementation

### LockingStatus Function

```typescript
function isPhaseLockedStatus(
  day: number,
  phase: number,
  completedPhases: Array<{ day: number; phase: number }>
): boolean {
  // Day 1 Phase 1 always unlocked
  if (day === 1 && phase === 1) return false;

  // Check previous phase in same day
  if (phase > 1) {
    const prevPhaseCompleted = completedPhases.some(
      (p) => p.day === day && p.phase === phase - 1
    );
    if (!prevPhaseCompleted) return true; // LOCKED
  }

  // Check all phases of previous day
  if (day > 1) {
    const allPrevDayCompleted = [1, 2, 3, 4, 5].every((p) =>
      completedPhases.some((cp) => cp.day === day - 1 && cp.phase === p)
    );
    if (!allPrevDayCompleted) return true; // LOCKED
  }

  return false; // UNLOCKED
}
```

## Phase Completion Flow

### 1. User Attempts Completion
```typescript
await completeQuranPhaseEnhanced(userId, day, phase);
```

### 2. Validation Chain
```
✓ Input validation (1-30, 1-5)
  ↓
✓ User exists validation
  ↓
✓ Not already completed check
  ↓
✓ Locking validation
  ├─ If day=1, phase=1: PASS
  ├─ If phase>1: Check previous phase complete
  │  └─ If not: FAIL "Complete previous phase first"
  └─ If day>1, phase=1: Check all day-1 phases complete
     └─ If not: FAIL "Complete all phases of previous day first"
  ↓
✓ Success: Save to database
```

### 3. Database Update
```typescript
// Insert/update completion record
INSERT INTO quran_progress (user_id, day, phase, completed, completed_at)
VALUES (..., true, NOW())

// Update user stats
UPDATE users SET
  quran_current_day = day,
  quran_current_phase = phase,
  quran_total_pages_read = calculated_total,
  quran_completed_at = (only if all 150 phases done)
```

### 4. Client-Side State Update
```typescript
// Add to completed phases list
setCompletedQuranPhases(prev => [...prev, { day, phase }]);

// Update user context
setAppState(prev => ({ ...prev, currentUser: updatedUser }));

// Show success
setToast({ type: 'success', message: '✓ Phase completed!' });
```

## SQL Query for Lock Validation

```sql
-- Get all completed phases for a user
SELECT day, phase 
FROM quran_progress
WHERE user_id = $1 AND completed = true
ORDER BY day, phase;

-- Check if previous phase is complete
SELECT COUNT(*) FROM quran_progress
WHERE user_id = $1 
  AND day = $2 
  AND phase = $3 - 1
  AND completed = true;

-- Check if all phases of previous day complete
SELECT COUNT(*) FROM quran_progress
WHERE user_id = $1 
  AND day = $2 - 1
  AND completed = true;
-- Should return 5 rows
```

## Lock State Examples

### Scenario 1: Fresh User (Day 1)
```
User just started reading.

Completed Phases: []

Status:
✓ Day 1, Phase 1  - UNLOCKED (default)
🔒 Day 1, Phase 2  - LOCKED (Phase 1 not complete)
🔒 Day 1, Phase 3  - LOCKED
🔒 Day 1, Phase 4  - LOCKED
🔒 Day 1, Phase 5  - LOCKED
🔒 Day 2, Phase 1  - LOCKED (Day 1 not complete)
```

### Scenario 2: Completed Day 1 Phase 1
```
Completed Phases: [
  { day: 1, phase: 1 }
]

Status:
✓ Day 1, Phase 1  - COMPLETE ✓
✓ Day 1, Phase 2  - UNLOCKED (Phase 1 complete)
🔒 Day 1, Phase 3  - LOCKED (Phase 2 not complete)
🔒 Day 1, Phase 4  - LOCKED
🔒 Day 1, Phase 5  - LOCKED
🔒 Day 2, Phase 1  - LOCKED (Day 1 not complete)
```

### Scenario 3: Completed All Day 2 Phases
```
Completed Phases: [
  { day: 1, phase: 1 }, { day: 1, phase: 2 },
  { day: 1, phase: 3 }, { day: 1, phase: 4 },
  { day: 1, phase: 5 }, { day: 2, phase: 1 },
  { day: 2, phase: 2 }, { day: 2, phase: 3 },
  { day: 2, phase: 4 }, { day: 2, phase: 5 }
]

Status:
✓ Day 1, All Phases  - COMPLETE ✓
✓ Day 2, All Phases  - COMPLETE ✓
✓ Day 3, Phase 1     - UNLOCKED (Day 2 complete)
🔒 Day 3, Phase 2    - LOCKED (Phase 1 not complete)
🔒 Day 4, Phase 1    - LOCKED (Day 3 not complete)
```

## Frontend Component Behavior

### AppleQuranReader Component
```typescript
// Compute lock status
const isPhaseLocked = isPhaseLockedStatus(
  currentDay,
  currentPhase,
  completedPhases
);

// If locked, show overlay
{isPhaseLocked && (
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm">
    <Lock icon />
    <h3>Phase Locked</h3>
    <p>Complete the previous phase to unlock this one</p>
  </div>
)}

// Disable completion button
<button disabled={isPhaseLocked || isPhaseCompleted || isSubmitting}>
  Complete Phase
</button>
```

## User Feedback

### Lock Messages
1. **For same-day progression**
   - "Complete the previous phase first"

2. **For new day unlock**
   - "Complete all phases of the previous day first"

### Success Messages
- "Great! Phase 2 completed! 🎉"
- "Excellent! Day 5 finished! You're 1/6 through Ramadan!"
- "Congratulations! You've completed the entire Quran! 🌙✨"

## Edge Cases & Error Handling

### Case 1: Phase Already Completed
```
Error: "Phase already completed"
User can: Proceed to next phase
```

### Case 2: Invalid Day/Phase Numbers
```
Input: day=31, phase=6
Error: "Invalid day or phase"
Protection: Frontend validation + backend validation
```

### Case 3: Database Inconsistency
```
Scenario: Completed phases list shows phase N+2 but not N+1
Solution: Validation failure + proper error message
Admin: Can manually reset user progress
```

### Case 4: Concurrent Completion Attempts
```
User clicks "Complete" twice rapidly
Result: Transaction prevents duplicate
Database: ON CONFLICT handles idempotency
```

## Testing & Validation

### Unit Test Cases

```typescript
describe('isPhaseLockedStatus', () => {
  test('Day 1 Phase 1 always unlocked', () => {
    expect(isPhaseLockedStatus(1, 1, [])).toBe(false);
  });

  test('Day 1 Phase 2 locked when Phase 1 incomplete', () => {
    expect(isPhaseLockedStatus(1, 2, [])).toBe(true);
  });

  test('Day 1 Phase 2 unlocked when Phase 1 complete', () => {
    expect(isPhaseLockedStatus(1, 2, [{ day: 1, phase: 1 }])).toBe(false);
  });

  test('Day 2 Phase 1 locked when Day 1 incomplete', () => {
    expect(isPhaseLockedStatus(2, 1, [{ day: 1, phase: 1 }])).toBe(true);
  });

  test('Day 2 Phase 1 unlocked when all Day 1 phases complete', () => {
    const completed = [1, 2, 3, 4, 5].map(p => ({ day: 1, phase: p }));
    expect(isPhaseLockedStatus(2, 1, completed)).toBe(false);
  });
});
```

### Integration Test Flow

1. ✓ User logs in (Day 1, Phase 1 available)
2. ✓ User completes Phase 1 (Badge shown, Phase 2 unlocks)
3. ✓ User attempts Phase 3 directly (Blocked - Phase 2 required)
4. ✓ User completes Phases 2-5 (Day 1 complete badge)
5. ✓ Day 2 Phase 1 now available
6. ✓ User attempts Day 3 directly (Blocked - Day 2 required)

## Admin Override

### For Special Cases
```typescript
// Admin can manually mark phases complete
await adminCompleteQuranPhase(userId, day, phase);

// Admin can reset progress
await resetQuranProgress(userId);
```

## Performance Considerations

### Optimization
- Completed phases array: ~150 items max (very small)
- Lock validation: O(n) but n ≤ 150, negligible
- Database queries: Indexed on (user_id, completed)
- Cache: User sessions hold completed array

### Caching Strategy
```typescript
// On app init
getCompletedQuranPhases(userId)
  .then(result => setCompletedQuranPhases(result.completedPhases));

// On phase completion
setCompletedQuranPhases(prev => [...prev, { day, phase }]);

// Sync with server
localStorage saves immediately
```

---

Document Version: 2.5.0  
Last Updated: February 2026  
System: RamadanBot Quran Module
