# PRD: Study Streak - Daily Study Tracker

## Problem

Students struggle to maintain consistent study habits due to procrastination, lack of accountability, and losing momentum. Existing streak-based apps use rigid "all-or-nothing" systems where missing a single day breaks the entire streak, causing demotivation and abandonment. Students need a motivation system that acknowledges real life (exams, sickness, burnout) while still driving consistent effort.

## Solution

A mobile study tracking app that combines **flexible streak mechanics** with **Pomodoro focus sessions** and **achievement badges**. The flexible streak system allows rest days without breaking momentum, Pomodoro ensures quality study time (not just clock-watching), and badges provide layered recognition beyond streaks alone.

## Requirements

### Must Have (P0)

- [ ] `PR-001` **Daily Study Timer**: User can start/stop a study timer with minimum session duration of 5 minutes to count toward daily goal
- [ ] `PR-002` **Flexible Streak System**: Streak remains active if user studies at least 5 days per week; 2 "rest days" allowed weekly without breaking streak
- [ ] `PR-003` **Pomodoro Mode**: Optional 25-minute focus sessions with 5-minute breaks; user can toggle Pomodoro on/off per session
- [ ] `PR-004` **Daily Goal Setting**: User can set daily study goal (default: 60 minutes); app tracks progress toward goal
- [ ] `PR-005` **Streak Visualization**: Calendar heatmap showing study days, streak count display, and weekly progress indicator
- [ ] `PR-006` **Offline-First Data**: All study sessions stored locally; app functions without internet connection
- [ ] `PR-007` **Daily Reminder Notification**: Configurable daily push notification reminding user to study (default: 6:00 PM)
- [ ] `PR-008` **Core Badge System**: At minimum, badges for: 7-day streak, 30-day streak, 100 total hours, first study session
- [ ] `PR-009` **Session History**: List view of past study sessions with date, duration, and subject (if tagged)
- [ ] `PR-010` **Background Timer**: Timer continues tracking when app is backgrounded or phone is locked

### Should Have (P1)

- [ ] `PR-101` **Subject Tagging**: User can tag sessions with subjects (Math, History, etc.) for categorization
- [ ] `PR-102` **Subject-Based Stats**: Time breakdown by subject with per-subject totals
- [ ] `PR-103` **Extended Badge Set**: Badges for: early bird (study before 8 AM), night owl (study after 10 PM), weekend warrior, consistency king (30-day streak)
- [ ] `PR-104` **Streak Freeze Tokens**: User earns 1 "freeze token" per 7-day streak; can be used to preserve streak during emergencies
- [ ] `PR-105` **Weekly Summary**: End-of-week summary showing total time, days studied, streak status
- [ ] `PR-106` **Customizable Reminder Time**: User can set custom daily reminder time
- [ ] `PR-107` **Data Export**: Export study data as CSV or JSON for backup

### Nice to Have (P2)

- [ ] `PR-201` **Study Stats Dashboard**: Charts showing weekly/monthly trends, average session length, best day of week
- [ ] `PR-202` **Session Notes**: User can add text notes to study sessions
- [ ] `PR-203` **Widget Support**: Home screen widget showing current streak and daily progress
- [ ] `PR-204` **Dark Mode**: Full dark mode support
- [ ] `PR-205` **Soundscapes**: Optional background sounds (rain, cafe, white noise) during Pomodoro sessions

## Tech Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Platform | iOS & Android | Cross-platform reach for student audience |
| Framework | Expo (React Native) | Single codebase, rapid iteration, built-in notifications |
| State Management | React Context + AsyncStorage | Simple, offline-first, no backend needed for MVP |
| Notifications | Expo Notifications | Native push without complex setup |
| Timer | react-native-background-timer | Reliable background timing for study sessions |
| Charts | react-native-chart-kit | Lightweight charting for stats visualization |
| Navigation | React Navigation | Standard, well-documented navigation solution |

## Out of Scope

- **Social Features**: No study buddies, leaderboards, or sharing (v2 consideration)
- **AI Coaching**: No AI suggestions or burnout prediction (v2 consideration)
- **Cloud Sync**: No multi-device sync or account system for MVP
- **Monetization**: No subscriptions, ads, or in-app purchases for MVP
- **Advanced Analytics**: No ML-based insights or complex reporting
- **Web Version**: Mobile-only for MVP
- **Study Content**: No built-in study materials or flashcards

## Success Criteria

- User can complete a full study session (start → track time → stop) without app crashes
- Streak logic correctly calculates 5-day weekly minimum (2 rest days allowed)
- Timer continues accurately when app is backgrounded (verified within ±5 seconds)
- Daily notification delivers at configured time with >95% reliability
- App functions fully without internet connection
- User can view streak history and current streak count
- At least 4 core badges unlock correctly based on criteria

## Open Questions

1. **Minimum Session Duration**: Is 5 minutes the right threshold, or should it be 10/15 minutes?
2. **Rest Day Policy**: Should rest days be fixed (e.g., Saturday-Sunday) or floating (any 2 days per week)?
3. **Pomodoro Default**: Should Pomodoro mode be default on or default off for new users?
4. **Notification Strategy**: Single daily reminder or multiple (morning motivation + evening reminder)?
5. **Data Persistence**: Should we implement local backup/restore for device migration?
6. **Session Interruption**: How should we handle interrupted sessions (phone call, app crash)?

## Summary (for downstream agents)

```yaml
feature: "study-streak-app"
source_artifacts:
  brainstorm: "docs/product-delegated-context2/brainstorm.md"
primary_user_problem: "Students struggle with consistent study habits; rigid streak apps demotivate when life happens"
solution_shape: "Flexible streak tracker with Pomodoro focus sessions and achievement badges"
p0_requirements:
  - id: "PR-001"
    summary: "Daily study timer with 5-minute minimum"
  - id: "PR-002"
    summary: "Flexible streak: 5 study days per week required, 2 rest days allowed"
  - id: "PR-003"
    summary: "Optional Pomodoro mode (25min focus + 5min break)"
  - id: "PR-004"
    summary: "Daily goal setting with progress tracking"
  - id: "PR-005"
    summary: "Calendar heatmap and streak visualization"
  - id: "PR-006"
    summary: "Offline-first local data storage"
  - id: "PR-007"
    summary: "Configurable daily reminder notifications"
  - id: "PR-008"
    summary: "Core badge system (7-day, 30-day, 100hrs, first session)"
  - id: "PR-009"
    summary: "Session history list view"
  - id: "PR-010"
    summary: "Background timer support"
p1_requirements:
  - id: "PR-101"
    summary: "Subject tagging for sessions"
  - id: "PR-102"
    summary: "Subject-based statistics"
  - id: "PR-103"
    summary: "Extended badge set"
  - id: "PR-104"
    summary: "Streak freeze tokens"
  - id: "PR-105"
    summary: "Weekly summary reports"
  - id: "PR-106"
    summary: "Custom reminder time"
  - id: "PR-107"
    summary: "Data export (CSV/JSON)"
primary_flows_expected:
  - "First-time onboarding and goal setting"
  - "Starting a study session (timer mode)"
  - "Starting a Pomodoro study session"
  - "Viewing streak status and calendar"
  - "Reviewing session history"
  - "Managing notification settings"
  - "Viewing unlocked badges"
key_risks:
  - "Background timer accuracy across different devices/OS versions"
  - "Notification reliability on Android with battery optimizations"
  - "User confusion about flexible streak vs rigid streak expectations"
  - "Data loss if user uninstalls app (no cloud backup in MVP)"
open_questions:
  - "Optimal minimum session duration (5 vs 10 vs 15 minutes)"
  - "Fixed vs floating rest days policy"
  - "Pomodoro default on or off for new users"
  - "Single vs multiple daily reminders"
  - "Local backup/restore strategy"
  - "Session interruption handling"
```

## Handoff Contract

**Next Agent:** `ux-designer`

**Required Artifacts:**
- `docs/product-delegated-context2/prd.md` (this document)

**Recommended Artifacts:**
- `docs/product-delegated-context2/brainstorm.md`

**Critical Inputs That Must Remain Stable:**
- Target audience: Students (age ~16-25)
- Core mechanic: Flexible streak (5 days/week minimum, 2 rest days allowed)
- Platform: Mobile iOS/Android via Expo/React Native
- Key differentiator: Flexible streak + Pomodoro + Badges combination
- MVP scope: Single user, local-first, offline-capable

**Sections That Must Not Change:**
- Problem statement
- Solution approach (flexible streak + Pomodoro + badges)
- All P0 requirement IDs and descriptions
- Out of Scope items (social, AI, cloud sync excluded from MVP)

**Mapping Rules:**
- Every P0 requirement must map to at least one UX flow
- Primary flows listed above must be covered in UX design
- Open questions should be addressed or carried forward to user stories
- Out of scope items must remain excluded unless explicit scope change occurs
