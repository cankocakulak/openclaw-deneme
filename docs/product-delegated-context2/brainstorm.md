# Study Streak App - Brainstorm

## Analysis

The real problem isn't just tracking study time—it's **motivating students to maintain consistent study habits** over time. Students know they should study, but struggle with procrastination, lack of accountability, and losing momentum. The solution needs to tap into psychological drivers (streaks, rewards, social proof) while keeping friction minimal so tracking doesn't become a chore.

---

## Ideas

### Idea 1: Classic Streak Tracker
**What**: Simple daily study timer with consecutive day streaks, calendar heatmap, and basic stats
**Why it works**: Proven gamification model (Duolingo-style), visual progress is motivating
**Risk**: Streak loss is demotivating; single miss breaks everything
**Effort**: Low

### Idea 2: Flexible Streak with Recovery
**What**: Streak system that allows 1-2 "rest days" per week without breaking the chain, plus "freeze" tokens for emergencies
**Why it works**: Acknowledges real life (exams, sickness, burnout) while maintaining accountability
**Risk**: Too much flexibility might reduce motivation
**Effort**: Low

### Idea 3: Study Buddy System
**What**: Pair or small group accountability where friends can see each other's streaks and send encouragement
**Why it works**: Social accountability is powerful; peer pressure (positive) drives consistency
**Risk**: Privacy concerns; friends might drop off leaving user isolated
**Effort**: Medium (requires backend + social features)

### Idea 4: Subject-Based Streaks
**What**: Separate streaks per subject/course (Math streak: 12 days, History streak: 5 days) with subject-specific goals
**Why it works**: Students study multiple subjects; prevents gaming the system with easy subjects
**Risk**: Complexity increases; might overwhelm users
**Effort**: Medium

### Idea 5: Pomodoro + Streak Hybrid
**What**: Focus sessions using Pomodoro technique (25min work + 5min break) that count toward daily streak goals
**Why it works**: Combines time-tested focus method with streak motivation; prevents burnout
**Risk**: Not everyone likes Pomodoro; rigid structure might annoy some
**Effort**: Medium

### Idea 6: AI Study Coach
**What**: Simple AI that suggests optimal study times, warns about burnout risk, and celebrates milestones personally
**Why it works**: Personal touch increases engagement; proactive coaching prevents failure
**Risk**: AI features can feel gimmicky; requires integration
**Effort**: High

### Idea 7: Achievement & Badge System
**What**: Unlock badges for milestones (7-day streak, 100 hours total, early bird, night owl, subject master)
**Why it works**: Layered rewards beyond just streaks; recognition feels good
**Risk**: Badge fatigue if overdone; needs careful design
**Effort**: Low

### Idea 8: Weekly Challenges & Leaderboards
**What**: Optional weekly challenges ("Study 10 hours this week") with anonymous leaderboards
**Why it works**: Competitive drive + fresh goals each week prevent stagnation
**Risk**: Leaderboards can discourage slower students; must be opt-in
**Effort**: Medium

---

## Tech Direction

**Recommended Stack: Expo + React Native**
- Cross-platform (iOS/Android) from single codebase
- Built-in notifications for streak reminders
- AsyncStorage for offline-first local data
- Expo Notifications for push reminders
- React Native Chart Kit for progress visualization

**Key Technical Bets:**
1. **Offline-first**: Students may not always have connectivity; local storage with sync later
2. **Background timers**: Must track study time even when app is backgrounded
3. **Local notifications**: Critical for daily reminders without backend complexity

**What to Reuse:**
- Expo's managed workflow for rapid iteration
- Existing React Native timer/stopwatch libraries

---

## Recommendation

**Go with Idea 2 (Flexible Streak) + Idea 5 (Pomodoro Hybrid) + Idea 7 (Badges)** as the core MVP.

This combination addresses the core problem: flexible streaks reduce the demotivation of perfect-or-nothing systems, Pomodoro adds structure that helps students actually focus (not just log time), and badges provide layered motivation beyond streaks alone. This is buildable in a reasonable timeframe while still feeling differentiated from simple timer apps.

Save Idea 3 (Study Buddy) and Idea 6 (AI Coach) for v2—they're compelling but add significant complexity.

---

## Combinations

**The "Sustainable Study System"**: Flexible Streak + Pomodoro + Badges creates a holistic motivation system:
- **Flexible Streak**: Keeps users in the game even when life happens
- **Pomodoro**: Ensures quality study time, not just clock-watching
- **Badges**: Celebrates different types of achievement (consistency, total time, subject mastery)

This trio covers accountability, focus quality, and recognition—three pillars of sustained habit formation.

---

## Summary (for downstream agents)

```yaml
feature: study-streak-app
topic: Daily study time tracking with streak-based motivation for students
selected_direction: "Flexible Streak + Pomodoro Hybrid + Achievement System"
rejected_directions:
  - Classic rigid streak (too punishing, high churn risk)
  - Study Buddy system (high complexity, v2 candidate)
  - AI Study Coach (high effort, unclear ROI for MVP)
  - Weekly leaderboards (can be demotivating, opt-in complexity)
constraints:
  platform: mobile (iOS/Android)
  framework: Expo / React Native
  team_size: small
  timeline: MVP-focused
  offline_first: true
technical_bets:
  - expo_managed_workflow
  - react_native_asyncstorage
  - expo_notifications
  - background_timer_tracking
  - local_first_data
open_questions_for_prd:
  - What defines a "study session" minimum? (5 min? 15 min?)
  - How many rest days per week? Fixed or user-configurable?
  - Should Pomodoro be mandatory or optional mode?
  - Which badges for MVP? How many?
  - Notification strategy: reminder time, frequency, tone
  - Data export or backup strategy?
  - Monetization model (free, freemium, one-time)?
```

---

## Handoff Contract

**Next Agent:** `prd`

**Required Artifacts:**
- `docs/product-delegated-context2/brainstorm.md` (this document)

**Recommended Artifacts:**
- None for this step (no analysis.md available)

**Critical Inputs That Must Remain Stable:**
- Target audience: Students (age ~16-25)
- Core mechanic: Daily study time tracking with streaks
- Platform: Mobile (iOS/Android via Expo/React Native)
- Key differentiator: Flexible streak system (not all-or-nothing)
- MVP scope: Single user, local-first, offline-capable

**Sections That Must Not Change Before PRD:**
- Selected direction: "Flexible Streak + Pomodoro Hybrid + Achievement System"
- Technical stack: Expo + React Native
- Constraints: Offline-first, small team, MVP-focused
- Open questions listed in Summary YAML (PRD must address these)

**What PRD Should Produce:**
- Detailed feature specifications for the three selected ideas
- Answers to all open questions
- User flows and screen definitions
- Data model for streaks, sessions, and achievements
- Notification strategy specification
- Success metrics definition
