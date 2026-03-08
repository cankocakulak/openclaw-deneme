# PRD: Study Streak - Mobile Study Habit Tracker

## Problem
Students struggle to maintain consistent daily study habits due to procrastination, lack of accountability, and the demotivation that comes from breaking a streak. Current solutions are either too complex (full productivity suites) or too simple (basic timers without gamification), failing to leverage behavioral psychology to sustain motivation.

## Solution
A mobile-first study habit tracker that combines simple timed study sessions with subject-based streaks, milestone badges, and streak protection mechanics. The app uses loss aversion and achievement psychology to keep students engaged while providing forgiveness mechanisms for real-life interruptions.

## Requirements

### Must Have (P0)
- [ ] `PR-001` **Daily Study Timer**: Users can start a study session with a visible countdown timer. Minimum session duration: 5 minutes. Timer continues in background with notification.
- [ ] `PR-002` **Subject-Based Tracking**: Users can create up to 10 subjects. Each subject has its own independent streak counter. Subject creation requires name (max 30 chars) and optional color/icon.
- [ ] `PR-003` **Streak Mechanics**: A "study day" is counted when at least one session of ≥5 minutes is completed on a calendar day (00:00-23:59 in user's local timezone). Consecutive days increment streak; missed days reset to 0.
- [ ] `PR-004` **Streak Freeze System**: Users earn 1 streak freeze per week (resets every Monday 00:00). Using a freeze prevents streak break when no study occurs that day. Maximum 3 freezes can be accumulated.
- [ ] `PR-005` **Milestone Badges**: Automatic badges awarded at streak milestones: 3 days (🌱 Getting Started), 7 days (🔥 Week Warrior), 14 days (📚 Fortnight Focus), 30 days (🏆 Monthly Master), 60 days (💎 Consistency King), 100 days (👑 Century Scholar).
- [ ] `PR-006` **Offline-First Core**: All core functionality (timer, streak tracking, subject management) works without internet. Data syncs to cloud when connection available.
- [ ] `PR-007` **Daily/Weekly Progress Views**: Home screen shows today's study summary (total time, subjects studied, active streaks). Weekly view shows last 7 days activity per subject.
- [ ] `PR-008` **Smart Notifications**: 
  - Reminder at user-selected daily time (default: 19:00)
  - "Streak at risk" warning at 21:00 if no study logged that day
  - Session completion celebration notification
  - Notification settings: on/off per type
- [ ] `PR-009` **User Authentication**: Email/password and Google OAuth sign-in. Anonymous guest mode allowed with option to upgrade to permanent account.
- [ ] `PR-010` **Data Persistence**: All study sessions stored locally with SQLite. Cloud sync via Supabase when authenticated and online.

### Should Have (P1)
- [ ] `PR-101` **Weekly Study Reports**: Beautiful shareable summary every Sunday showing: total hours studied, most studied subject, longest streak maintained, week-over-week comparison. Export as image for social sharing.
- [ ] `PR-102` **Study Goals**: Users can set daily (15-480 min) and weekly (1-40 hours) study targets. Progress shown on home screen. Target completion triggers badge.
- [ ] `PR-103` **Session Notes**: Optional 140-character note after each session. Notes viewable in session history.
- [ ] `PR-104` **Session History**: List of all past sessions with date, duration, subject, and optional note. Filterable by subject and date range.
- [ ] `PR-105` **Timezone Handling**: Automatic timezone detection. Streak day boundaries follow user's current timezone. Travel across timezones: day counted if studied in either timezone's calendar day.
- [ ] `PR-106` **App Icon Badges**: iOS/Android home screen badge shows current longest active streak number.
- [ ] `PR-107` **Haptic Feedback**: Subtle haptic on session start/pause/complete. Celebration haptic on milestone badge earn.
- [ ] `PR-108` **Onboarding Flow**: 4-screen tutorial: welcome → subject setup (pre-populated with common subjects) → notification permission → first session demo.

### Nice to Have (P2)
- [ ] `PR-201` **Dark Mode**: Full dark theme support with OLED black option.
- [ ] `PR-202` **Widget Support**: iOS/Android home screen widget showing today's progress and quick-start timer.
- [ ] `PR-203` **Session Categories**: Beyond subjects, tag sessions by type (reading, problem-solving, memorization, review).
- [ ] `PR-204` **Export Data**: CSV export of all study history for personal analysis.
- [ ] `PR-205` **Streak Recovery (Watch Ad)**: Optional: watch rewarded video ad to recover a broken streak once per month.
- [ ] `PR-206` **Study Sounds**: Optional background sounds (white noise, rain, cafe ambience) during sessions.

## Tech Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Framework | Expo (React Native) | Cross-platform iOS/Android, rapid iteration, OTA updates, strong mobile ecosystem |
| State Management | Zustand | Simple, performant, adequate for app scale |
| Local Storage | SQLite (expo-sqlite) + AsyncStorage | Reliable offline-first data, structured query capability |
| Backend/Auth | Supabase | Auth, real-time sync, PostgreSQL, generous free tier, easy social features later |
| Notifications | Expo Notifications | Cross-platform push without native code, scheduled local notifications |
| Icons/Assets | @expo/vector-icons + custom SVG | Consistent iconography, lightweight |
| Animations | React Native Reanimated | Smooth 60fps animations for celebrations |
| Navigation | React Navigation (Native Stack) | Standard, well-documented, deep linking support |

## Out of Scope

The following are explicitly NOT in v1 and deferred to future versions:

- **Social Features**: Study buddies, leaderboards, friend comparisons, competitive features
- **Focus Mode/App Blocking**: System-level distraction blocking, DND enforcement
- **Premium/Paid Tier**: All v1 features are free; no subscription or one-time purchase
- **Study Groups**: Collaborative study sessions, shared goals
- **AI/ML Features**: Smart scheduling, personalized recommendations, study pattern analysis
- **Desktop/Web App**: Mobile-only for v1
- **Apple Watch/Wearables**: No wearable companion app
- **Streak Betting/Gambling Mechanics**: No wagering points/currency on streak maintenance
- **Extensive Journaling**: Rich text notes, mood tracking, detailed reflection prompts
- **Integration with Learning Platforms**: No LMS, calendar, or third-party app integrations

## Success Criteria

- **Adoption**: 70% of new users complete onboarding and start first session within 24 hours
- **Retention**: 40% day-7 retention, 20% day-30 retention
- **Engagement**: Average 4+ study sessions per active user per week
- **Streak Health**: 60% of active users maintain at least a 7-day streak
- **Technical**: App launch time <2 seconds, timer accuracy ±1 second per hour
- **Stability**: <1% crash rate, 99.5% session completion without data loss

## Open Questions

1. **Monetization Strategy**: Should v2 introduce a premium tier? What features would be premium vs free?
2. **Streak Definition**: Is 5 minutes too short? Should we A/B test 10 or 15 minute minimums?
3. **Freeze Accumulation**: Should unused freezes expire after N weeks, or accumulate indefinitely (capped at 3)?
4. **Notification Timing**: What are optimal reminder times for different user segments (high school vs college vs grad students)?
5. **Data Retention**: How long should we retain anonymous guest data before requiring account creation?
6. **Session Interruption**: How should we handle app kills/crashes during active sessions? Auto-pause and resume, or discard?

## Summary (for downstream agents)

```yaml
feature: "study-streak-mobile-app"
source_artifacts:
  brainstorm: "docs/product-delegated-context4/brainstorm.md"
primary_user_problem: "Students struggle to maintain consistent daily study habits due to procrastination and lack of motivation"
solution_shape: "Mobile habit tracker combining timed study sessions with subject-based streaks, milestone badges, and streak freeze forgiveness"
p0_requirements:
  - id: "PR-001"
    summary: "Daily study timer with 5+ min minimum, background support"
  - id: "PR-002"
    summary: "Subject-based tracking (up to 10 subjects, independent streaks)"
  - id: "PR-003"
    summary: "Streak mechanics: calendar day boundary, consecutive day counting"
  - id: "PR-004"
    summary: "Streak freeze system: 1/week, max 3 accumulated"
  - id: "PR-005"
    summary: "Milestone badges at 3, 7, 14, 30, 60, 100 days"
  - id: "PR-006"
    summary: "Offline-first core functionality"
  - id: "PR-007"
    summary: "Daily/weekly progress views"
  - id: "PR-008"
    summary: "Smart notifications (reminder, streak risk, completion)"
  - id: "PR-009"
    summary: "Email/Google auth + anonymous guest mode"
  - id: "PR-010"
    summary: "Local SQLite + Supabase cloud sync"
p1_requirements:
  - id: "PR-101"
    summary: "Weekly shareable reports"
  - id: "PR-102"
    summary: "Daily/weekly study goals"
  - id: "PR-103"
    summary: "Optional session notes"
  - id: "PR-104"
    summary: "Session history with filters"
  - id: "PR-105"
    summary: "Timezone handling for travelers"
  - id: "PR-106"
    summary: "App icon badge with streak count"
  - id: "PR-107"
    summary: "Haptic feedback"
  - id: "PR-108"
    summary: "4-screen onboarding flow"
primary_flows_expected:
  - "First-time onboarding"
  - "Daily study session (start → study → complete)"
  - "Subject creation and management"
  - "Streak freeze usage"
  - "Weekly report viewing and sharing"
  - "Session history review"
  - "Settings and notification preferences"
key_risks:
  - "Timer accuracy in background may vary by OS; need fallback mechanisms"
  - "Timezone changes during travel could cause streak disputes"
  - "Notification fatigue if defaults are too aggressive"
  - "Offline-first sync conflicts need careful handling"
open_questions:
  - "Optimal minimum session duration (5 vs 10 vs 15 min)"
  - "Freeze expiration policy"
  - "Monetization strategy for v2"
  - "Session interruption handling on app kill"
```

## Handoff Contract

Next Agent: `ux-designer`

Required Artifacts:
- `docs/product-delegated-context4/prd.md` (this document)
- `docs/product-delegated-context4/brainstorm.md`

Recommended Artifacts:
- None

Critical Inputs:
- Target audience: Students aged 15-25
- Core mechanic: 5+ minute timed sessions per subject, daily streaks
- Platform: Mobile (iOS + Android via Expo)
- MVP scope: Single-player only, no social features
- Offline-first requirement

Sections That Must Not Change:
- Problem statement
- Solution approach
- P0 requirements (PR-001 through PR-010)
- Out of Scope list
- Tech stack choices

Mapping Rules:
- Every P0 requirement must map to at least one UX flow
- Primary flows listed in summary must be designed
- Open questions must remain visible until resolved
- Requirement IDs (PR-XXX) must remain stable for downstream story mapping
