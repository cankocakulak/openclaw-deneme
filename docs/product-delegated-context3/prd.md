# PRD: Study Streak

## Problem

Students struggle with procrastination and inconsistent study habits not because they lack tracking tools, but because existing solutions fail to make studying feel rewarding and emotionally engaging. The core problem is motivation: students know they should study, but without immediate positive feedback and a sense of progress, they abandon their habits within weeks.

## Solution

Study Streak combines a classic daily streak tracker with a virtual garden that grows as students complete focus sessions. Students nurture their garden through consistent effort—each study session waters and grows their plants, while missed days cause visible wilting. This creates emotional investment in the streak beyond just a number, making study habits tangible and rewarding.

## Requirements

### Must Have (P0)

- [ ] `PR-001` **Daily Streak Tracking**: Users can start/stop study sessions with a visible timer. Streak counts consecutive days with at least one completed session. Streak resets to 0 if no session is completed within a 24-hour window (with grace period until 4 AM next day).

- [ ] `PR-002` **Virtual Garden Visualization**: Each study session contributes growth to a virtual plant/garden. Visual state reflects recent activity (healthy = active, wilting = missed days). Garden persists and grows over time with consistent effort.

- [ ] `PR-003` **Offline-First Data Persistence**: All session data, streak counts, and garden state stored locally using SQLite. App functions fully without network connectivity. Data syncs to cloud when connection available (if user opts in).

- [ ] `PR-004` **Background Timer Accuracy**: Timer continues tracking when app is backgrounded or phone is locked. Uses expo-background-task to ensure session duration is accurate even if user switches apps.

- [ ] `PR-005` **Daily Reminder Notifications**: Local push notifications remind users to study. Default time: 7 PM, customizable by user. Smart fallback: if user typically studies at 3 PM, suggest that time after 3 days of pattern detection.

- [ ] `PR-006` **Minimum Session Duration**: Sessions must be at least 5 minutes to count toward streak. Prevents "gaming" the streak with 10-second sessions. Maximum session cap at 4 hours (prevents timer abuse).

- [ ] `PR-007` **Session History & Stats**: Users can view past 30 days of study activity. Display total hours studied, current streak, longest streak, and average session length.

- [ ] `PR-008` **Streak Recovery Mechanic**: One "streak freeze" per week—allows missing one day without breaking streak. Visual indicator shows frozen state. Cannot stack freezes; use it or lose it.

### Should Have (P1)

- [ ] `PR-101` **Multiple Garden Themes**: Users can unlock different garden themes (succulent garden, flower bed, bonsai tree) based on streak milestones (7 days, 30 days, 100 days).

- [ ] `PR-102` **Focus Mode (Do Not Disturb)**: Optional full-screen mode that blocks notifications from other apps during study sessions. Uses expo-keep-awake to prevent screen sleep.

- [ ] `PR-103` **Weekly Study Goals**: Users can set weekly hour targets (e.g., "10 hours this week"). Progress bar shows weekly completion. Separate from streak—goals can be missed without breaking streak.

- [ ] `PR-104` **Session Notes**: Optional text field to jot down what was studied. Searchable history for review.

- [ ] `PR-105` **Widget Support**: iOS/Android home screen widget showing current streak and quick "start session" button.

### Nice to Have (P2)

- [ ] `PR-201` **Subject Tagging**: Tag sessions with subjects (Math, History, etc.). View stats per subject.

- [ ] `PR-202` **Export Data**: CSV/JSON export of study history for personal analysis.

- [ ] `PR-203` **Dark Mode Garden**: Alternative visual theme for night-time studiers.

## Tech Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Framework | Expo (React Native) | Single codebase for iOS + Android, OTA updates, built-in notifications |
| Navigation | Expo Router | File-based routing, deep linking support, native navigation feel |
| State Management | Zustand + AsyncStorage | Lightweight, persists to local storage, works offline |
| Database | expo-sqlite | Reliable local storage, queryable, handles larger datasets than AsyncStorage |
| Animations | React Native Reanimated | Smooth 60fps garden animations, gesture support |
| Notifications | expo-notifications | Local notifications work offline, reliable delivery |
| Background Tasks | expo-background-task | Accurate session timing when app backgrounded |
| UI Components | React Native Paper | Consistent Material Design, accessibility built-in |

**Key Technical Decisions:**
- **Offline-first**: Students study in libraries with poor connectivity. Core functionality must never depend on network.
- **Local notifications over push**: More reliable, respects privacy, no server infrastructure needed for v1.
- **SQLite for sessions**: AsyncStorage for user settings, SQLite for time-series session data (better query performance).

## Out of Scope

The following are explicitly NOT included in v1:

- **Social features**: No friends, leaderboards, sharing, or study buddies. Validated core habit formation first.
- **AI coaching**: No personalized study suggestions or AI chat. Adds complexity without proven MVP value.
- **Music integrations**: No Spotify/Apple Music connection. Nice-to-have that doesn't drive core habit.
- **Multi-device sync**: No real-time sync across phones/tablets. Cloud backup only (restore on new device).
- **Study content**: No flashcards, quizzes, or educational content. This is a habit tracker, not a learning app.
- **Monetization features**: No subscriptions, ads, or in-app purchases for v1. Focus on product-market fit first.
- **Web version**: Mobile-only. No React Native Web or separate web app.
- **Apple Watch / Wear OS**: No wearable apps for v1.

## Success Criteria

- **Retention**: 40% of users who start a streak reach day 7
- **Engagement**: Average 4+ study sessions per active user per week
- **Session Quality**: Average session length of 25+ minutes (indicates genuine study, not gaming)
- **Streak Survival**: 20% of users who reach day 7 make it to day 30
- **App Store Rating**: 4.5+ stars with 100+ reviews within 3 months of launch

## Open Questions

1. **Garden metaphor specifics**: Should we use a single plant that grows, a multi-plant garden, or a Tamagotchi-style creature? Decision needed before UX design.

2. **Streak freeze mechanic**: Is one freeze per week too generous or too stingy? Should freezes accumulate (max 2) or strictly weekly?

3. **Notification timing strategy**: Fixed default time vs. machine learning based on user's actual study patterns? ML adds complexity but may improve engagement.

4. **Grace period definition**: Is 4 AM cutoff correct for "next day"? Should it be configurable for night owls?

5. **Data backup**: Should we require account creation for cloud backup, or use anonymous device-based backup (risk of data loss on device switch)?

6. **Session pausing**: Should users be able to pause a session (bathroom break) or only stop/start new sessions?

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  brainstorm: "docs/product-delegated-context3/brainstorm.md"
primary_user_problem: "Students struggle with procrastination because existing tools fail to make studying emotionally rewarding and engaging"
solution_shape: "Daily streak tracker combined with a virtual garden that grows through consistent study sessions, creating emotional investment in the habit"
p0_requirements:
  - id: "PR-001"
    summary: "Daily streak tracking with 24-hour window and grace period"
  - id: "PR-002"
    summary: "Virtual garden visualization that reflects study activity"
  - id: "PR-003"
    summary: "Offline-first data persistence with SQLite"
  - id: "PR-004"
    summary: "Background timer accuracy for session tracking"
  - id: "PR-005"
    summary: "Daily reminder notifications with customizable timing"
  - id: "PR-006"
    summary: "Minimum 5-minute session duration requirement"
  - id: "PR-007"
    summary: "Session history and statistics view"
  - id: "PR-008"
    summary: "Weekly streak freeze recovery mechanic"
p1_requirements:
  - id: "PR-101"
    summary: "Unlockable garden themes based on streak milestones"
  - id: "PR-102"
    summary: "Focus mode with DND and screen keep-awake"
  - id: "PR-103"
    summary: "Weekly study goals separate from streak"
  - id: "PR-104"
    summary: "Optional session notes with searchable history"
  - id: "PR-105"
    summary: "iOS/Android home screen widget"
primary_flows_expected:
  - "First-time onboarding: Set daily reminder time, see garden introduction"
  - "Start study session: Timer screen, garden visible, focus mode option"
  - "Complete session: Celebration animation, streak update, garden growth"
  - "Missed day: Grace period notification, streak freeze option, wilting garden"
  - "View history: Calendar heatmap, stats dashboard, past sessions"
  - "Streak milestone: Unlock new garden theme, achievement celebration"
key_risks:
  - "Streak breakage demotivation: Users may abandon app after losing long streak"
  - "Garden metaphor appeal: Gamification may not resonate with all age groups"
  - "Background timer accuracy: OS restrictions may limit background execution"
  - "Notification fatigue: Too many reminders could lead to app uninstalls"
open_questions:
  - "Garden metaphor: Single plant vs garden vs creature?"
  - "Streak freeze: Weekly only or accumulative?"
  - "Notification strategy: Fixed time vs ML-based?"
  - "Grace period: Fixed 4 AM or user-configurable?"
  - "Backup: Account required or anonymous device-based?"
  - "Session pausing: Allowed or stop/start only?"
```

## Handoff Contract

**Next Agent:** `ux-designer`

**Required Artifacts:**
- `docs/product-delegated-context3/prd.md` (this document)

**Recommended Artifacts:**
- `docs/product-delegated-context3/brainstorm.md` — for context on rejected directions and technical decisions

**Critical Inputs:**
- Problem: Students need emotional motivation, not just tracking
- Solution: Streak + virtual garden combination
- P0 requirements PR-001 through PR-008 must all be addressed in UX
- Offline-first constraint: Designs must account for no-network scenarios
- Platform: Mobile-first (iOS + Android), no web or wearable

**Sections That Must Not Change:**
- Problem statement
- Solution approach (streak + garden)
- P0 requirements (PR-001 through PR-008)
- Out of Scope items (social features, AI, etc.)
- Offline-first technical constraint

**Mapping Rules:**
- Every P0 requirement must map to at least one user flow in UX design
- Primary flows listed in summary must be covered in UX deliverables
- Open questions about garden metaphor and mechanics must be resolved in UX exploration
- Streak freeze mechanic (PR-008) needs clear UX for freeze availability and usage
- Garden visualization (PR-002) is the core differentiator—invest design effort here

**UX Designer Decisions Needed:**
1. Garden metaphor finalization (single plant, multi-plant garden, or creature)
2. Streak freeze UI/UX (how users see and use their weekly freeze)
3. Notification preference onboarding flow
4. Session timer screen layout and garden integration
5. Celebration/milestone moment designs
6. History/stats visualization approach
