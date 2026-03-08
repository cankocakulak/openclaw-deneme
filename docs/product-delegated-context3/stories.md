# User Stories: Study Streak

## Epic Summary
Study Streak helps students build consistent study habits by combining daily streak tracking with a virtual garden that grows through focused study sessions, creating emotional investment in the learning process.

## Analysis

This PRD breaks into approximately **12-14 user stories**: 8 P0 stories covering core functionality (streak tracking, garden visualization, offline persistence, background timer, notifications, session validation, history/stats, and streak freeze), plus 4-6 P1 stories for enhanced features (garden themes, focus mode, weekly goals, session notes). The garden visualization and streak mechanics are tightly coupled and will need careful dependency management to ensure the emotional feedback loop works end-to-end.

---

## Stories

### P0 STUDY-001: Start and Track Study Session
**As a** student  
**I want** to start a study session with a visible timer  
**So that** I can track my focused study time and build consistent habits

**PRD Requirement References:** `PR-001`, `PR-004`, `PR-006`  
**UX Flow References:** `Start Study Session`  
**Dependencies:** None  
**Implementation Boundary:** 
- IN: Timer start/stop functionality, session duration tracking, minimum 5-minute validation, 4-hour maximum cap
- OUT: Garden growth animations, streak calculation, history persistence (covered in other stories)

**Acceptance Criteria:**
- [ ] Given I am on the Home Screen, when I tap "Start Session", then the Timer Screen opens and the timer begins counting up from 00:00
- [ ] Given a session is running, when I switch to another app or lock my phone, then the timer continues tracking in the background
- [ ] Given I return to the app after backgrounding, when the Timer Screen appears, then the displayed time accurately reflects the total elapsed session time
- [ ] Given I have an active session, when I try to start another session, then I see "You already have a session in progress"
- [ ] Given I tap "End Session" before 5 minutes have elapsed, when the session ends, then I see a warning: "Sessions under 5 minutes don't count toward your streak. Study a bit longer?" with "Continue" and "End Anyway" options
- [ ] Given my session reaches 4 hours, when the maximum is hit, then the session auto-ends with message "Maximum session reached! Great focus — take a break."

**Notes:** 
- Use expo-background-task for accurate background timing
- Show local notification "Study session in progress: [X] minutes" when backgrounded
- Handle phone calls by pausing timer with "Session paused — resume when ready" message

---

### P0 STUDY-002: Complete Session and Update Garden
**As a** student  
**I want** to see my garden grow when I complete a study session  
**So that** I feel rewarded and emotionally invested in my study habit

**PRD Requirement References:** `PR-002`, `PR-001`  
**UX Flow References:** `Complete Study Session`  
**Dependencies:** STUDY-001 (session tracking)  
**Implementation Boundary:**
- IN: Garden growth animation on session complete, celebration effects, haptic feedback, streak status display
- OUT: Streak calculation logic, freeze mechanics, theme unlocking

**Acceptance Criteria:**
- [ ] Given I complete a session of 5+ minutes, when the session ends, then I see a 2-3 second celebration animation with garden growth (new leaf, flower blooming, or growth stage advancement)
- [ ] Given the celebration animation plays, when it completes, then I feel haptic feedback (light success pattern of 3 quick pulses)
- [ ] Given I complete a session, when the Session Summary Card appears, then I see "Session Complete!" headline with duration and streak status (e.g., "🔥 5 day streak!" or "🌱 Streak started!")
- [ ] Given my session completes after midnight but before 4 AM, when the streak updates, then it counts toward the previous day's streak (grace period)
- [ ] Given I complete a bonus session (already studied today), when the summary appears, then I see "Bonus session! Your streak is already safe today."
- [ ] Given I set a new longest streak record, when the summary appears, then I see "New longest streak! 🎉" badge

**Notes:**
- Garden growth should be visible and satisfying but not overly complex
- Use React Native Reanimated for smooth 60fps animations
- Particles/confetti should use brand colors (amber #F4A261, green #7C9A6B)

---

### P0 STUDY-003: Offline-First Data Persistence
**As a** student studying in areas with poor connectivity  
**I want** my session data and garden state to be stored locally  
**So that** the app works fully without network access

**PRD Requirement References:** `PR-003`  
**UX Flow References:** All flows (underlying infrastructure)  
**Dependencies:** None  
**Implementation Boundary:**
- IN: SQLite database for sessions/streaks/garden state, AsyncStorage for user settings, offline read/write operations
- OUT: Cloud sync functionality (backup is P2/out of scope), multi-device sync

**Acceptance Criteria:**
- [ ] Given I have no network connection, when I open the app, then all previously saved data loads from local storage
- [ ] Given I am offline, when I start and complete a study session, then the session is saved to SQLite with correct timestamp and duration
- [ ] Given I am offline, when I view my history, then I see cached data with subtle "Last updated [time]" indicator
- [ ] Given the app is force-quit during a session, when I relaunch, then I see recovery dialog "You had a session in progress. Resume or discard?"
- [ ] Given my phone dies during a session, when I relaunch, then I can add the interrupted session time to my history (max 4 hours)
- [ ] Given I have offline data, when I reconnect to network, then the app shows sync status (if cloud backup is enabled)

**Notes:**
- Use expo-sqlite for time-series session data (better query performance)
- Use AsyncStorage for user settings and preferences
- All core functionality must work without network — test in airplane mode

---

### P0 STUDY-004: Daily Streak Tracking with Grace Period
**As a** student  
**I want** my streak to count consecutive days with at least one session  
**So that** I have a clear measure of my consistency

**PRD Requirement References:** `PR-001`  
**UX Flow References:** `Handle Missed Day / Grace Period`  
**Dependencies:** STUDY-001 (session tracking), STUDY-003 (data persistence)  
**Implementation Boundary:**
- IN: Streak counting logic, 24-hour window with 4 AM grace period cutoff, streak reset on missed day
- OUT: Streak freeze mechanic (STUDY-005), notification reminders (STUDY-006)

**Acceptance Criteria:**
- [ ] Given I complete at least one 5+ minute session in a day, when the day ends, then my streak increases by 1
- [ ] Given I have an active streak, when I miss a day (no session by 4 AM next day), then my streak resets to 0
- [ ] Given it is between midnight and 3:59 AM, when I open the app, then I see grace period banner: "Your streak ends in [countdown to 4 AM]. Study now to save it!"
- [ ] Given the grace period is active, when I view my garden, then it shows slight wilting visual (leaves drooping, desaturated colors)
- [ ] Given my streak breaks, when I open the app after 4 AM, then I see wilting garden with message: "Your [X]-day streak ended. Life happens. Start a new session today to begin growing again."
- [ ] Given I have multiple missed days, when I view my garden, then I see "Your garden needs care. Start studying to bring it back to life."

**Notes:**
- Streak day boundary is 4:00 AM local time (not midnight)
- Grace period countdown should update in real-time
- Wilting visual should be noticeable but not punitive — use muted terracotta (#E07A5F), not aggressive red

---

### P0 STUDY-005: Streak Freeze Recovery Mechanic
**As a** student  
**I want** to use a weekly "streak freeze" to save my streak when I miss a day  
**So that** one bad day doesn't destroy my progress

**PRD Requirement References:** `PR-008`  
**UX Flow References:** `Handle Missed Day / Grace Period`  
**Dependencies:** STUDY-004 (streak tracking)  
**Implementation Boundary:**
- IN: Weekly freeze allocation (one per week), freeze usage UI, visual freeze indicator, Monday reset
- OUT: Freeze accumulation (not allowed), automatic freeze application

**Acceptance Criteria:**
- [ ] Given it is a new week (Monday), when I open the app, then I receive one new streak freeze (use it or lose it — no accumulation)
- [ ] Given I have a freeze available, when I view the Home Screen, then I see indicator "Weekly freeze: Ready to use"
- [ ] Given I am in the grace period (midnight–4 AM) with a freeze available, when the streak is at risk, then I see prominent CTA: "Use your weekly streak freeze?" with explanation "This saves your streak one time. You get a new freeze every Monday."
- [ ] Given I tap "Use Freeze", when the freeze is applied, then my streak is preserved and I see "Streak frozen — study to unfreeze" with ice crystal overlay on streak badge
- [ ] Given I have used my freeze this week, when I view the Home Screen, then I see "Weekly freeze: Used (resets Monday)"
- [ ] Given I try to use a freeze after my streak has already broken, when I attempt it, then I see "Freezes must be used before your streak ends"

**Notes:**
- Freeze resets every Monday at midnight local time
- Visual indicator should be subtle but clear — ice crystal overlay on streak badge
- Cannot stack freezes; strictly weekly allocation

---

### P0 STUDY-006: Daily Reminder Notifications
**As a** student  
**I want** to receive daily reminders to study at my chosen time  
**So that** I don't forget to maintain my streak

**PRD Requirement References:** `PR-005`  
**UX Flow References:** `First-Time Onboarding`  
**Dependencies:** None  
**Implementation Boundary:**
- IN: Local push notification scheduling, default 7 PM reminder, customizable time picker, notification permission handling
- OUT: Smart/ML-based timing (P1), notification sounds customization

**Acceptance Criteria:**
- [ ] Given I complete onboarding, when I set my reminder time (default 7:00 PM), then daily local notifications are scheduled
- [ ] Given a reminder is scheduled, when the time arrives, then I receive push notification: "Time to study! Keep your streak alive 🌱"
- [ ] Given I deny notification permission during onboarding, when I reach the Home Screen, then I see subtle inline reminder to enable notifications in settings
- [ ] Given I am in Settings, when I change my reminder time, then future notifications use the new time
- [ ] Given I toggle notifications off in Settings, when the toggle changes, then no further reminders are scheduled
- [ ] Given I have already studied today, when the reminder time arrives, then I do not receive a reminder (optional optimization)

**Notes:**
- Use expo-notifications for local notifications (works offline, respects privacy)
- Notification copy should be encouraging, not demanding
- Handle permission denial gracefully — don't block core functionality

---

### P0 STUDY-007: Session History and Statistics
**As a** student  
**I want** to view my past study activity and statistics  
**So that** I can track my progress and identify patterns

**PRD Requirement References:** `PR-007`  
**UX Flow References:** `View History and Stats`  
**Dependencies:** STUDY-003 (data persistence)  
**Implementation Boundary:**
- IN: 30-day calendar heatmap, stats dashboard (current streak, longest streak, total hours, avg session), session list
- OUT: Weekly goals (P1), subject tagging (P2), data export (P2)

**Acceptance Criteria:**
- [ ] Given I tap "History" from Home Screen, when the History Screen opens, then I see Stats Dashboard with: current streak (large with flame icon), longest streak, total hours studied, average session length
- [ ] Given I view the History Screen, when I look at the calendar, then I see 30-day heatmap with color intensity based on session duration (darker = more time)
- [ ] Given I tap a day on the calendar, when the action completes, then I see session details for that day
- [ ] Given I scroll the session list, when I view recent sessions, then I see date, time, duration, and subject tags (if any) for each session
- [ ] Given I have no sessions yet, when I open History, then I see empty state with seed packet illustration and "Your garden is waiting. Start your first session!"
- [ ] Given I pull-to-refresh on History, when the refresh completes, then stats update (mostly for sync status visibility)

**Notes:**
- Use virtualized scrolling for long session lists
- Calendar heatmap colors: use sage green (#7C9A6B) intensity scale
- Empty state should be encouraging, not discouraging

---

### P0 STUDY-008: First-Time Onboarding Flow
**As a** new user  
**I want** to quickly understand how Study Streak works and set my preferences  
**So that** I can start building my study habit immediately

**PRD Requirement References:** `PR-005`, `PR-002`  
**UX Flow References:** `First-Time Onboarding`  
**Dependencies:** STUDY-006 (notification setup)  
**Implementation Boundary:**
- IN: Welcome screens, garden metaphor explanation, notification permission request, reminder time selection, first garden view
- OUT: Account creation, cloud backup setup, tutorial for all features

**Acceptance Criteria:**
- [ ] Given I open the app for the first time, when the app launches, then I see Welcome Screen with full-screen garden illustration and headline "Grow Your Study Habit"
- [ ] Given I proceed from Welcome, when the Garden Introduction appears, then I see brief animated explanation: "Each study session nurtures your garden. Miss a day, and your plants need care."
- [ ] Given I continue onboarding, when the Notification Permission screen appears, then I see context: "We'll remind you to study at your chosen time. You can change this anytime."
- [ ] Given I grant or deny notification permission, when I proceed, then I see Set Reminder Time screen with time picker defaulting to 7:00 PM
- [ ] Given I complete onboarding, when I reach the Home Screen, then I see my starter garden (single small sprout) with CTA "Start Your First Session"
- [ ] Given I exit the app mid-onboarding, when I relaunch, then I resume at the same step

**Notes:**
- Onboarding should take less than 60 seconds
- Garden introduction animation should be simple but delightful
- First garden view shows a single sprout — room to grow

---

### P1 STUDY-009: Unlockable Garden Themes
**As a** dedicated student  
**I want** to unlock different garden themes based on my streak milestones  
**So that** I feel rewarded for long-term consistency and can personalize my experience

**PRD Requirement References:** `PR-101`  
**UX Flow References:** `Unlock Garden Theme (Milestone)`  
**Dependencies:** STUDY-002 (garden visualization), STUDY-004 (streak tracking)  
**Implementation Boundary:**
- IN: Theme unlock at 7/30/100 day streaks, theme preview, theme switching, locked theme indicators
- OUT: Theme purchases, custom theme creation

**Acceptance Criteria:**
- [ ] Given I reach a 7-day streak, when the milestone triggers, then I see full-screen celebration modal: "🎉 7-Day Streak! Your consistency is paying off. You've unlocked a new garden theme!"
- [ ] Given I unlock a theme, when the Theme Preview appears, then I see unlocked theme (Succulent Garden, Flower Bed, or Bonsai Tree) with side-by-side comparison to current theme
- [ ] Given I preview a theme, when I tap "Switch to [Theme Name]", then my garden immediately updates to the new theme with "Theme updated!" toast
- [ ] Given I have multiple unlocked themes, when I go to Settings > Garden Themes, then I see all unlocked themes with current selection highlighted
- [ ] Given I view a locked theme, when I look at the theme card, then I see lock icon with "Reach a [7/30/100] day streak to unlock"
- [ ] Given I dismiss the milestone modal without choosing, when I go to Settings later, then the theme remains unlocked and available

**Notes:**
- Milestones: 7 days (Succulent Garden), 30 days (Flower Bed), 100 days (Bonsai Tree)
- Celebration should feel significant — use heavy haptic impact + success pattern
- Theme switching should be instant, no reload required

---

### P1 STUDY-010: Focus Mode (Do Not Disturb)
**As a** student who gets easily distracted  
**I want** to enable a focus mode during study sessions  
**So that** I can minimize interruptions and maintain concentration

**PRD Requirement References:** `PR-102`  
**UX Flow References:** `Start Study Session`  
**Dependencies:** STUDY-001 (session tracking)  
**Implementation Boundary:**
- IN: Focus mode toggle, full-screen mode, keep-awake prevention, DND integration where supported
- OUT: Blocking notifications from other apps (OS limitation), app whitelist configuration

**Acceptance Criteria:**
- [ ] Given I am on the Timer Screen, when I toggle "Focus Mode: On", then the screen enters full-screen mode with no status bar and keep-awake active
- [ ] Given Focus Mode is on, when I view the timer, then I see minimal UI with large timer and mini garden view only
- [ ] Given Focus Mode is active, when I receive a phone call, then the timer pauses and shows "Session paused — resume when ready"
- [ ] Given I have Focus Mode enabled, when I tap to exit, then I must explicitly confirm to prevent accidental exits
- [ ] Given I enable Focus Mode, when the session ends, then the app returns to normal mode automatically
- [ ] Given I have reduced motion enabled in system settings, when Focus Mode activates, then animations are minimized per accessibility preferences

**Notes:**
- Use expo-keep-awake to prevent screen sleep
- Full-screen mode should still allow emergency access (system gestures)
- Respect system Do Not Disturb settings where possible

---

### P1 STUDY-011: Weekly Study Goals
**As a** student  
**I want** to set weekly hour targets for my studying  
**So that** I can work toward a broader objective beyond daily streaks

**PRD Requirement References:** `PR-103`  
**UX Flow References:** `View History and Stats`  
**Dependencies:** STUDY-007 (history/stats)  
**Implementation Boundary:**
- IN: Weekly hour target setting, progress tracking, progress bar visualization, separate from streak mechanics
- OUT: Goal notifications, goal streaks, subject-specific goals

**Acceptance Criteria:**
- [ ] Given I go to Settings > Goals, when I set a weekly hour target (e.g., "10 hours this week"), then the target is saved and appears on Home Screen
- [ ] Given I have a weekly goal set, when I view the Home Screen, then I see progress bar showing "[X]/[Y] hours this week"
- [ ] Given I complete a study session, when the session is saved, then my weekly goal progress updates immediately
- [ ] Given I view the History Screen, when I look at my stats, then I see weekly goal progress ring
- [ ] Given I miss my weekly goal, when the week ends, then my streak is NOT affected (goals are separate from streaks)
- [ ] Given a new week starts, when I open the app, then my weekly goal progress resets to 0/[target]

**Notes:**
- Weekly goal is Monday-Sunday
- Progress should be visible but not intrusive
- Missing a goal should not feel punitive — it's separate from the streak system

---

### P1 STUDY-012: Session Notes
**As a** student  
**I want** to add notes about what I studied during a session  
**So that** I can review my learning later

**PRD Requirement References:** `PR-104`  
**UX Flow References:** `Complete Study Session`  
**Dependencies:** STUDY-002 (session completion)  
**Implementation Boundary:**
- IN: Optional note text field (max 200 chars), quick subject tags, searchable history
- OUT: Rich text formatting, image attachments, automatic tagging

**Acceptance Criteria:**
- [ ] Given I complete a study session, when the Session Complete Screen appears, then I see optional prompt "What did you study? (Optional)" with quick-add subject tags (Math, Science, History, Language, Other)
- [ ] Given I tap a subject tag, when the tag is selected, then it appears as a chip and I can select multiple tags
- [ ] Given I type a note, when I reach 200 characters, then I cannot type more (character limit enforced)
- [ ] Given I save a session with notes/tags, when I view the session in History, then I see the subject tags and note preview
- [ ] Given I have many sessions with notes, when I scroll through History, then I can identify sessions by their subject tags
- [ ] Given I don't add a note, when the session saves, then it appears in History without note content (no empty state clutter)

**Notes:**
- Subject tags: Math, Science, History, Language, Other (expandable in future)
- Notes should be searchable in future iterations
- Keep the note input collapsible to not block the celebration moment

---

## Coverage Map

### PRD Requirement Coverage

| PRD Requirement | Story ID(s) | Notes |
|----------------|-------------|-------|
| `PR-001` Daily Streak Tracking | STUDY-001, STUDY-004 | Session tracking + streak counting with grace period |
| `PR-002` Virtual Garden Visualization | STUDY-002, STUDY-004, STUDY-005 | Growth animation, wilting states, freeze indicator |
| `PR-003` Offline-First Data Persistence | STUDY-003 | SQLite + AsyncStorage foundation |
| `PR-004` Background Timer Accuracy | STUDY-001 | expo-background-task implementation |
| `PR-005` Daily Reminder Notifications | STUDY-006, STUDY-008 | Notification scheduling + onboarding setup |
| `PR-006` Minimum Session Duration | STUDY-001 | 5-min minimum, 4-hour maximum |
| `PR-007` Session History & Stats | STUDY-007 | 30-day heatmap, stats dashboard |
| `PR-008` Streak Recovery Mechanic | STUDY-005 | Weekly freeze allocation and usage |
| `PR-101` Multiple Garden Themes | STUDY-009 | Unlock at 7/30/100 day milestones |
| `PR-102` Focus Mode (DND) | STUDY-010 | Full-screen mode, keep-awake |
| `PR-103` Weekly Study Goals | STUDY-011 | Separate from streak system |
| `PR-104` Session Notes | STUDY-012 | Optional tags and text notes |

### UX Flow Coverage

| UX Flow | Story ID(s) | Notes |
|---------|-------------|-------|
| First-Time Onboarding | STUDY-008 | Welcome, garden intro, notification setup |
| Start Study Session | STUDY-001, STUDY-010 | Timer functionality, focus mode option |
| Complete Study Session | STUDY-002, STUDY-012 | Celebration, garden growth, notes |
| Handle Missed Day / Grace Period | STUDY-004, STUDY-005 | Grace period UI, freeze usage |
| View History and Stats | STUDY-007, STUDY-011 | Stats dashboard, weekly goals |
| Unlock Garden Theme (Milestone) | STUDY-009 | Milestone celebrations, theme switching |

---

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  prd: "docs/product-delegated-context3/prd.md"
  ux: "docs/product-delegated-context3/ux.md"
  brainstorm: "docs/product-delegated-context3/brainstorm.md"
story_ids:
  p0:
    - "STUDY-001"  # Start and Track Study Session
    - "STUDY-002"  # Complete Session and Update Garden
    - "STUDY-003"  # Offline-First Data Persistence
    - "STUDY-004"  # Daily Streak Tracking with Grace Period
    - "STUDY-005"  # Streak Freeze Recovery Mechanic
    - "STUDY-006"  # Daily Reminder Notifications
    - "STUDY-007"  # Session History and Statistics
    - "STUDY-008"  # First-Time Onboarding Flow
  p1:
    - "STUDY-009"  # Unlockable Garden Themes
    - "STUDY-010"  # Focus Mode (Do Not Disturb)
    - "STUDY-011"  # Weekly Study Goals
    - "STUDY-012"  # Session Notes
coverage:
  prd_requirements:
    PR-001: ["STUDY-001", "STUDY-004"]
    PR-002: ["STUDY-002", "STUDY-004", "STUDY-005"]
    PR-003: ["STUDY-003"]
    PR-004: ["STUDY-001"]
    PR-005: ["STUDY-006", "STUDY-008"]
    PR-006: ["STUDY-001"]
    PR-007: ["STUDY-007"]
    PR-008: ["STUDY-005"]
    PR-101: ["STUDY-009"]
    PR-102: ["STUDY-010"]
    PR-103: ["STUDY-011"]
    PR-104: ["STUDY-012"]
  ux_flows:
    "First-Time Onboarding": ["STUDY-008"]
    "Start Study Session": ["STUDY-001", "STUDY-010"]
    "Complete Study Session": ["STUDY-002", "STUDY-012"]
    "Handle Missed Day / Grace Period": ["STUDY-004", "STUDY-005"]
    "View History and Stats": ["STUDY-007", "STUDY-011"]
    "Unlock Garden Theme (Milestone)": ["STUDY-009"]
dependencies:
  STUDY-001: []  # Root story - session tracking
  STUDY-002: ["STUDY-001"]  # Needs session tracking
  STUDY-003: []  # Root story - data layer
  STUDY-004: ["STUDY-001", "STUDY-003"]  # Needs sessions + persistence
  STUDY-005: ["STUDY-004"]  # Needs streak tracking
  STUDY-006: []  # Root story - notifications
  STUDY-007: ["STUDY-003"]  # Needs data persistence
  STUDY-008: ["STUDY-006"]  # Needs notification setup
  STUDY-009: ["STUDY-002", "STUDY-004"]  # Needs garden + streaks
  STUDY-010: ["STUDY-001"]  # Needs timer screen
  STUDY-011: ["STUDY-007"]  # Needs history/stats
  STUDY-012: ["STUDY-002"]  # Needs session completion
implementation_risks:
  - "STUDY-001: Background timer accuracy may be affected by OS restrictions — test thoroughly on iOS and Android"
  - "STUDY-002: Garden animations must balance delight with performance — may need optimization on older devices"
  - "STUDY-004: Streak calculation with grace period has edge cases around timezone changes and daylight saving"
  - "STUDY-005: Streak freeze timing (Monday reset) needs careful handling for users in different timezones"
  - "STUDY-009: Garden themes require art assets — ensure design resources are available or use programmatic graphics"
recommended_implementation_order:
  - "Phase 1 (Foundation): STUDY-003, STUDY-001, STUDY-006"
  - "Phase 2 (Core Loop): STUDY-004, STUDY-002, STUDY-008"
  - "Phase 3 (Resilience): STUDY-005, STUDY-007"
  - "Phase 4 (Enhancement): STUDY-010, STUDY-012, STUDY-011, STUDY-009"
```

---

## Handoff Contract

**Next Agent:** `task-planner`

**Required Artifacts:**
- `docs/product-delegated-context3/stories.md` (this document)
- `docs/product-delegated-context3/prd.md`
- `docs/product-delegated-context3/ux.md`

**Recommended Artifacts:**
- `docs/product-delegated-context3/brainstorm.md` — for context on technical decisions and rejected directions

**Critical Inputs:**
- 12 user stories (8 P0, 4 P1) covering all core functionality
- Story dependencies clearly mapped — implement in phases to respect dependency chain
- Every P0 PRD requirement maps to at least one story
- Every primary UX flow maps to at least one story
- Implementation risks flagged for background timer, animations, and timezone handling
- Acceptance criteria include exact copy from UX specifications

**Sections That Must Not Change:**
- Story IDs (STUDY-001 through STUDY-012)
- Acceptance criteria intent (specific behaviors and thresholds)
- Dependencies between stories
- Implementation Boundaries (what is in/out for each story)
- Coverage map mappings

**Mapping Rules:**
- Implement P0 stories before P1 stories
- Respect dependency chain: STUDY-003 and STUDY-001 are foundational
- Garden visualization (STUDY-002) depends on session tracking (STUDY-001)
- Streak mechanics (STUDY-004, STUDY-005) depend on both sessions and persistence
- UX copy in acceptance criteria should be implemented exactly as specified

**Task Planner Decisions Needed:**
1. Task breakdown: Split stories into smaller implementation tasks or keep as-is?
2. Technical architecture: Which stories need shared components (database, garden renderer)?
3. Testing strategy: How to test background timer accuracy and streak edge cases?
4. Asset requirements: Garden themes (STUDY-009) need design assets — block or use placeholders?
5. Platform prioritization: iOS first, Android first, or parallel development?
