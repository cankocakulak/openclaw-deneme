# Study Streak - Brainstorm Document

## Analysis

The real problem isn't just tracking study time — it's motivating students to build consistent daily habits through gamification and social accountability. Students struggle with procrastination and losing momentum; streak mechanics tap into loss aversion and achievement psychology to keep them engaged.

---

## Ideas

### Idea 1: Daily Study Timer with Streak Counter
**What**: Simple Pomodoro-style timer that logs daily study sessions and tracks consecutive days studied
**Why it works**: Low friction entry point; streak visualization creates emotional investment
**Risk**: Single-player experience may lose novelty quickly
**Effort**: Low

### Idea 2: Study Buddy System
**What**: Pair or group students to share streaks, compete on leaderboards, or study together virtually
**Why it works**: Social accountability dramatically improves habit adherence; peer pressure as positive force
**Risk**: Requires user base to function; privacy concerns with study data sharing
**Effort**: Medium

### Idea 3: Subject-Based Streaks
**What**: Separate streak tracking per subject (Math streak: 12 days, History streak: 5 days)
**Why it works**: Students study multiple subjects; prevents "I studied something" vagueness
**Risk**: UI complexity increases; may overwhelm users with too many metrics
**Effort**: Medium

### Idea 4: Streak Recovery/Betting System
**What**: If a user breaks a streak, they can "recover" it by studying extra the next day, or bet points to save it
**Why it works**: Reduces demotivation from one missed day; gambling psychology hooks
**Risk**: Could feel manipulative; may undermine genuine habit formation
**Effort**: Medium

### Idea 5: Study Goals & Milestones
**What**: Set daily/weekly study targets, earn badges for milestones (7 days, 30 days, 100 days streak)
**Why it works**: Clear goals + achievement rewards = sustained motivation
**Risk**: Badge fatigue if not designed well; needs variety in rewards
**Effort**: Low

### Idea 6: Focus Mode with Distraction Blocking
**What**: During study sessions, block notifications from other apps; show focus stats post-session
**Why it works**: Addresses real pain point (phone distraction); adds utility beyond tracking
**Risk**: Requires system-level permissions; may be bypassed easily
**Effort**: High (on mobile)

### Idea 7: Study Session Notes & Reflection
**What**: Quick post-study journal entry: what did you study, how did it go, rate your focus
**Why it works**: Reflection reinforces learning; data becomes meaningful over time
**Risk**: Adds friction to simple tracking; low completion rates likely
**Effort**: Low

### Idea 8: Weekly/Monthly Study Reports
**What**: Beautiful visual summaries of study patterns, total hours, best subjects, streak history
**Why it works**: Data visualization is shareable; users love seeing progress over time
**Risk**: Requires significant design effort to look good
**Effort**: Medium

### Idea 9: Streak Freeze/Vacation Days
**What**: Users get 1 "freeze" per week to maintain streak without studying (sick days, travel)
**Why it works**: Reduces anxiety about perfect attendance; more sustainable long-term
**Risk**: May be overused; defeats purpose of daily habit
**Effort**: Low

### Idea 10: Push Notification Gamification
**What**: Smart reminders: "You're about to lose your 5-day streak!", "Sarah just passed you on the leaderboard!"
**Why it works**: Timely, personalized notifications re-engage users at decision moments
**Risk**: Notification fatigue; can feel spammy if overdone
**Effort**: Low

---

## Tech Direction

### Recommended Stack
- **Framework**: Expo (React Native) — cross-platform iOS/Android from single codebase, over-the-air updates, strong ecosystem for mobile apps
- **State Management**: Zustand or React Context — simple, adequate for this scale
- **Backend**: Supabase or Firebase — auth, real-time sync for social features, easy setup
- **Local Storage**: AsyncStorage + SQLite (via Expo) — offline-first study tracking
- **Notifications**: Expo Notifications API — cross-platform push without native code

### Technical Bets
1. **Offline-first**: Students may study without reliable internet; sync when connected
2. **Expo Go for MVP**: Rapid iteration before ejecting to bare workflow
3. **Social features deferred to v2**: Core habit tracking works single-player; add social later

---

## Recommendation

**Primary direction**: Combine **Idea 1 (Daily Timer + Streaks)** + **Idea 3 (Subject-Based Streaks)** + **Idea 5 (Goals & Milestones)** + **Idea 9 (Streak Freeze)**.

This creates a complete single-player habit system: track time per subject, build streaks, earn badges, with forgiveness for real life. It's buildable by a small team, provides immediate value, and creates the foundation for social features later.

**Deferred to v2**: Study Buddy System (Idea 2) and Focus Mode (Idea 6) — both high-value but require more complexity (user base for social, system permissions for blocking).

---

## Combinations

The core loop: Open app → Select subject → Start timer → Study → Log session → See streak grow → Get badge at milestones.

Add weekly reports (Idea 8) as a "delight" feature — beautiful shareable summaries that users post to social media, driving organic growth.

---

## Summary (for downstream agents)

```yaml
feature: study-streak-mobile-app
topic: Daily study habit tracker with gamification for students
selected_direction: 
  - Single-player first: Daily timer with subject-based streaks
  - Gamification: Goals, milestones, badges, streak freeze
  - Progress visualization: Weekly/monthly reports
rejected_directions:
  - Social features (study buddies, leaderboards) - deferred to v2
  - Focus mode with app blocking - high complexity, deferred
  - Streak recovery betting - potentially manipulative
  - Post-study journaling - high friction, low completion
constraints:
  - platform: mobile (iOS + Android)
  - framework: Expo / React Native
  - team_size: small (1-2 developers)
  - timeline: MVP in 4-6 weeks
  - offline_first: true
  - budget: minimal (use managed services)
technical_bets:
  - expo_for_cross_platform: Rapid development, easy deployment
  - supabase_backend: Auth + sync for future social features
  - offline_first_architecture: Core functionality works without internet
  - deferred_social: Build engaged user base before adding complexity
open_questions_for_prd:
  - What is the minimum viable streak definition? (5 min? 15 min?)
  - How many subjects should users be able to track?
  - What milestone badges should exist for v1?
  - Should there be a premium/paid tier? What features?
  - How to handle timezone changes for travelers?
  - What constitutes a "day" for streak purposes? (calendar day vs 24h window)
```

---

## Handoff Contract

**Next Agent**: `prd`

**Required Artifacts**:
- `docs/product-delegated-context4/brainstorm.md` (this document)

**Recommended Artifacts**:
- None (first step in workflow)

**Critical Inputs That Must Remain Stable**:
- Target audience: Students (age ~15-25)
- Core mechanic: Daily streaks based on timed study sessions
- Platform: Mobile (iOS + Android via Expo)
- MVP scope: Single-player habit tracking only (social deferred)

**Sections That Must Not Change Before PRD**:
- Selected direction (single-player + subject streaks + goals)
- Technical stack (Expo, Supabase/Firebase)
- Offline-first requirement
- Deferred features list (social, focus mode)

**Key Decisions for PRD to Make**:
- Exact streak mechanics (minimum time, day boundaries)
- Subject tracking limits and structure
- Badge/milestone system details
- Monetization strategy (free vs premium)
- Notification strategy and timing
