# UX: Study Streak - Daily Study Tracker

## User Goal
Students want to build consistent study habits by tracking daily study time with a flexible streak system that motivates without punishing real-life interruptions.

## Analysis

The UX challenge is balancing **motivation with forgiveness**. Students need to feel accountable for consistent studying, but rigid streak systems cause abandonment when life happens (sickness, exams, emergencies). The app must make the flexible streak mechanic immediately understandable—users should never be confused about why their streak continued or broke. Additionally, the Pomodoro feature needs to feel optional, not forced, while still encouraging focused work sessions. The primary risk is user confusion about how the 5-day weekly streak works versus traditional daily streaks.

---

## Visual Direction

### Tone & Feel
**Encouraging, calm, and focused.** The app should feel like a supportive study companion rather than a demanding taskmaster. Visual feedback should celebrate progress without being overwhelming. The interface should minimize cognitive load—students are already mentally taxed from studying.

### Reference Apps
- **Duolingo** — Streak visualization and gamification patterns (but less aggressive)
- **Forest** — Focus session UX and calm visual design during timed sessions
- **Streaks** — Clean habit tracking interface and circular progress indicators
- **Headspace** — Calm color palette and encouraging microcopy

### Color Direction
- **Primary**: Warm amber/orange (#F59E0B) — Energy, motivation, warmth without aggression
- **Secondary**: Deep teal (#0D9488) — Focus, calm, trust
- **Accent**: Vibrant green (#10B981) — Success states, streak active, goal achieved
- **Semantic**:
  - Success: #10B981 (green)
  - Error: #EF4444 (red)
  - Warning: #F59E0B (amber)
  - Info: #3B82F6 (blue)
- **Neutral**:
  - Background: #F9FAFB (light gray)
  - Surface: #FFFFFF (white)
  - Text Primary: #111827 (near black)
  - Text Secondary: #6B7280 (gray)
  - Border: #E5E7EB (light gray)

### Typography & Spacing
- **Font**: System fonts (SF Pro on iOS, Roboto on Android) for native feel
- **Hierarchy**:
  - Display: 32-40px (streak count, timer)
  - Headings: 20-24px (screen titles)
  - Body: 16px (primary text)
  - Caption: 12-14px (secondary info)
- **Spacing**: 16px base unit, generous whitespace to reduce visual clutter
- **Density**: Medium—compact enough for one-handed use, spacious enough for readability

---

## Primary Flows

### Flow 1: First-Time Onboarding
- **User Goal**: Set up the app quickly and understand how the flexible streak works
- **Trigger**: User opens app for the first time
- **Steps**:
  1. Welcome screen with app purpose ("Build study habits that last")
  2. Brief explanation of flexible streak mechanic ("Study 5 days a week—life happens!")
  3. Set daily study goal (default: 60 minutes, adjustable in 15-min increments)
  4. Set daily reminder time (default: 6:00 PM, time picker)
  5. Optional: Enable notifications permission
  6. Completion screen with CTA to start first session
- **Edge Cases**:
  - User denies notification permission → Store preference, allow retry later in settings
  - User sets goal to 0 minutes → Show validation error ("Goal must be at least 15 minutes")
  - User exits mid-onboarding → Save progress, resume on next launch
- **Success State**: User lands on Home screen with personalized goal and reminder set
- **PRD Requirement References**:
  - `PR-004` (Daily goal setting)
  - `PR-007` (Daily reminder notification)

### Flow 2: Starting a Study Session (Timer Mode)
- **User Goal**: Begin tracking study time with simple start/stop timer
- **Trigger**: User taps "Start Studying" on Home screen
- **Steps**:
  1. Session setup screen (optional subject tag, Pomodoro toggle)
  2. User taps "Start Session"
  3. Active session screen displays:
     - Large timer showing elapsed time (MM:SS format)
     - Pause button (primary action)
     - Stop/End Session button (secondary, destructive styling)
     - Current subject (if tagged)
  4. Timer continues in background if app minimized
  5. User taps "Stop" to end session
  6. Session summary modal shows:
     - Total time studied
     - Progress toward daily goal
     - Streak status update
     - CTA to view history or start another session
- **Edge Cases**:
  - Session under 5 minutes → Show warning ("Sessions under 5 min don't count toward streak")
  - Session interrupted by phone call → Pause automatically, resume prompt on return
  - App crashes during session → Recover and offer to restore/continue on relaunch
  - User hits daily goal mid-session → Show celebration toast, continue tracking
- **Success State**: Session saved, streak updated if applicable, user returned to Home
- **PRD Requirement References**:
  - `PR-001` (Daily study timer)
  - `PR-010` (Background timer)
  - `PR-101` (Subject tagging - P1)

### Flow 3: Starting a Pomodoro Study Session
- **User Goal**: Use structured Pomodoro technique for focused study
- **Trigger**: User enables Pomodoro mode before starting session
- **Steps**:
  1. User toggles "Pomodoro Mode" on session setup screen
  2. Configuration options appear:
     - Focus duration (default: 25 min, options: 15/25/45/60)
     - Break duration (default: 5 min, options: 5/10/15)
  3. User taps "Start Focus Session"
  4. Active Pomodoro screen displays:
     - Large countdown timer for current focus period
     - Visual progress ring showing time remaining
     - Session count (e.g., "Pomodoro 2 of 4")
     - Pause button (pauses countdown)
     - Skip to break (secondary)
  5. When focus period ends:
     - Sound/vibration notification
     - Screen transitions to break view
     - Break countdown begins automatically
  6. User can skip break or let it complete
  7. Auto-prompt to start next Pomodoro or end session
  8. Final summary shows total focus time and Pomodoros completed
- **Edge Cases**:
  - User pauses during focus → Pause countdown, show "Focus Paused" state
  - User leaves app during Pomodoro → Continue countdown, notify at phase end
  - Break extends beyond limit → Auto-resume prompt after break duration × 2
  - User completes partial Pomodoro → Log actual focus time, note as incomplete
- **Success State**: Full Pomodoro session logged, user sees summary with completed cycles
- **PRD Requirement References**:
  - `PR-003` (Pomodoro mode)
  - `PR-010` (Background timer)

### Flow 4: Viewing Streak Status and Calendar
- **User Goal**: Understand current streak status and study history at a glance
- **Trigger**: User opens app (Home screen) or taps streak card
- **Steps**:
  1. Home screen displays:
     - Current streak count (large, prominent)
     - Weekly progress indicator (7 circles, filled for study days)
     - Rest days remaining indicator ("2 rest days left this week")
     - Next rest day reset countdown
  2. User taps streak card or calendar icon
  3. Calendar view opens showing:
     - Monthly heatmap (color intensity = study duration)
     - Day details on tap (duration, sessions, subject breakdown)
     - Streak history (longest streak, current streak)
     - Weekly streak status explanation
  4. User navigates between months
  5. Tap specific day to see session details for that date
- **Edge Cases**:
  - No study history yet → Show empty state with encouraging copy
  - Streak broken → Show empathetic message, highlight fresh start opportunity
  - Current week incomplete → Show progress toward 5-day goal
  - Rest day used → Visual distinction between rest day and missed day
- **Success State**: User clearly understands streak mechanics and their progress
- **PRD Requirement References**:
  - `PR-002` (Flexible streak system)
  - `PR-005` (Streak visualization)

### Flow 5: Reviewing Session History
- **User Goal**: Review past study sessions and track progress over time
- **Trigger**: User taps "History" in navigation or session summary CTA
- **Steps**:
  1. History screen loads with:
     - Filter tabs: All | This Week | This Month
     - Chronological list of sessions (newest first)
     - Each card shows: date, duration, subject tag (if any), Pomodoro indicator
  2. User scrolls through history
  3. Tap session to view details:
     - Exact start/end times
     - Subject
     - Session type (timer vs Pomodoro)
     - Notes (if P2 implemented)
  4. Pull-to-refresh for latest data
  5. Swipe to delete (with confirmation)
- **Edge Cases**:
  - No sessions yet → Empty state with illustration and "Start your first session" CTA
  - Very long history → Implement lazy loading/infinite scroll
  - Deleted session affects streak → Recalculate streak, notify user of change
- **Success State**: User can browse, inspect, and manage their study history
- **PRD Requirement References**:
  - `PR-009` (Session history)
  - `PR-101` (Subject tagging - P1)

### Flow 6: Managing Notification Settings
- **User Goal**: Customize when and how the app reminds them to study
- **Trigger**: User taps Settings → Notifications or onboarding completion
- **Steps**:
  1. Notifications settings screen shows:
     - Daily reminder toggle
     - Reminder time picker (if enabled)
     - Sound/vibration preferences
     - Preview of reminder message
  2. User adjusts settings
  3. Test notification button (sends immediate test)
  4. Changes saved automatically
  5. Success toast: "Settings saved"
- **Edge Cases**:
  - System notification permission denied → Show instructions to enable in Settings app
  - User sets reminder to current time → Validation error
  - Notification fails to schedule → Error message with retry option
- **Success State**: Notification preferences saved, next reminder scheduled
- **PRD Requirement References**:
  - `PR-007` (Daily reminder notification)
  - `PR-106` (Customizable reminder time - P1)

### Flow 7: Viewing Unlocked Badges
- **User Goal**: See achievements earned and discover upcoming milestones
- **Trigger**: User taps "Badges" in navigation or earns new badge
- **Steps**:
  1. Badges screen displays:
     - Recently earned badges (highlighted at top)
     - Grid of all badges (locked and unlocked)
     - Progress indicators for in-progress badges
  2. Tap badge to view details:
     - Badge name and description
     - Unlock criteria
     - Date earned (if unlocked)
     - Rarity indicator (common/rare/epic)
  3. New badge earned → Celebrate with modal animation
  4. Share badge option (if P2 social features)
- **Edge Cases**:
  - No badges earned yet → Show locked grid with hints on how to unlock
  - Badge criteria unclear → Detailed explanation on tap
  - Multiple badges earned at once → Queue celebration modals
- **Success State**: User sees all achievements, understands how to earn more
- **PRD Requirement References**:
  - `PR-008` (Core badge system)
  - `PR-103` (Extended badge set - P1)

---

## Screen/Component Breakdown

### Screen: Home (Dashboard)
- **Purpose**: Primary entry point showing daily progress, streak status, and main CTA
- **Layout**: 
  - Top: Header with settings icon
  - Middle: Streak card (large number + weekly progress)
  - Center: Daily progress ring (toward goal)
  - Bottom: "Start Studying" primary CTA button
- **Key Elements**:
  - Streak counter with flame icon
  - 7-day weekly progress dots
  - Rest days remaining badge
  - Circular progress indicator for daily goal
  - Subject quick-select (if P1)
- **Primary Action**: "Start Studying" button
- **Edge Cases**:
  - Daily goal achieved → Progress ring complete, celebratory state
  - Streak at risk (no study for 4 days) → Warning styling on streak card
  - First open → Onboarding prompt instead of dashboard
- **Flow References**:
  - Flow 2 (Start study session)
  - Flow 4 (View streak status)
- **PRD Requirement References**:
  - `PR-004` (Daily goal)
  - `PR-005` (Streak visualization)

### Screen: Session Setup
- **Purpose**: Configure study session before starting
- **Layout**:
  - Top: "New Session" header
  - Middle: Subject selector (dropdown/chips)
  - Toggle: Pomodoro mode
  - Pomodoro settings (conditional)
  - Bottom: "Start Session" button
- **Key Elements**:
  - Subject tag selector (optional)
  - Pomodoro mode toggle
  - Focus duration selector (15/25/45/60 min)
  - Break duration selector (5/10/15 min)
- **Primary Action**: "Start Session" button
- **Edge Cases**:
  - No subjects created yet → "Add your first subject" prompt
  - Pomodoro toggled off → Hide duration selectors, show simple timer mode
- **Flow References**:
  - Flow 2 (Timer mode)
  - Flow 3 (Pomodoro mode)
- **PRD Requirement References**:
  - `PR-001` (Daily timer)
  - `PR-003` (Pomodoro mode)
  - `PR-101` (Subject tagging - P1)

### Screen: Active Session (Timer Mode)
- **Purpose**: Track ongoing study session with minimal distraction
- **Layout**:
  - Full-screen or near full-screen
  - Center: Large elapsed time display
  - Bottom: Pause and Stop buttons
  - Top: Subject indicator (if tagged)
- **Key Elements**:
  - Elapsed time (MM:SS, large typography)
  - Pause/Resume button (circular, prominent)
  - Stop/End button (square, secondary)
  - Background-safe timer indicator
- **Primary Action**: Pause/Resume
- **Edge Cases**:
  - App backgrounded → Continue timer, show notification option
  - Phone call incoming → Auto-pause, resume prompt after
  - Daily goal reached → Celebration overlay, continue option
- **Flow References**:
  - Flow 2 (Timer mode)
- **PRD Requirement References**:
  - `PR-001` (Daily timer)
  - `PR-010` (Background timer)

### Screen: Active Pomodoro Session
- **Purpose**: Guide user through Pomodoro cycles with clear phase indicators
- **Layout**:
  - Center: Countdown timer with circular progress ring
  - Below: Phase label ("Focus Time" / "Break Time")
  - Bottom: Session controls
  - Top: Pomodoro counter ("2 of 4")
- **Key Elements**:
  - Countdown timer (MM:SS)
  - Animated progress ring (fills/empties)
  - Phase indicator with color coding (focus=teal, break=green)
  - Pause, Skip, and End buttons
  - Session count tracker
- **Primary Action**: Complete current phase
- **Edge Cases**:
  - User pauses focus → "Focus Paused" overlay
  - Break extends too long → "Ready to focus?" prompt
  - Session interrupted → Save progress dialog on return
- **Flow References**:
  - Flow 3 (Pomodoro mode)
- **PRD Requirement References**:
  - `PR-003` (Pomodoro mode)
  - `PR-010` (Background timer)

### Screen: Session Summary
- **Purpose**: Confirm session completion and show progress impact
- **Layout**: Modal overlay
  - Top: Celebration illustration/animation
  - Stats: Duration, goal progress, streak impact
  - Action buttons: "View History", "Start Another", "Close"
- **Key Elements**:
  - Duration studied
  - Daily goal progress (before/after)
  - Streak status message
  - Subject summary (if tagged)
  - Badge earned notification (if applicable)
- **Primary Action**: "Close" or "Start Another"
- **Edge Cases**:
  - Session under 5 min → Warning that it won't count
  - Goal completed → Special celebration state
  - Badge unlocked → Badge celebration overlay
- **Flow References**:
  - Flow 2, 3 (Session completion)
- **PRD Requirement References**:
  - `PR-001` (Daily timer)
  - `PR-008` (Badge system)

### Screen: Calendar/Streak View
- **Purpose**: Visualize study history and streak mechanics
- **Layout**:
  - Top: Month selector
  - Middle: Monthly heatmap grid
  - Bottom: Selected day details panel
- **Key Elements**:
  - Monthly calendar heatmap (color intensity = duration)
  - Day cell states: studied, rest day, missed, today
  - Legend explaining colors
  - Day detail panel (duration, sessions)
  - Streak statistics (current, longest)
- **Primary Action**: Browse history
- **Edge Cases**:
  - No history → Empty state with sample visualization
  - Streak broken → Highlight break point with explanation
- **Flow References**:
  - Flow 4 (View streak status)
- **PRD Requirement References**:
  - `PR-002` (Flexible streak)
  - `PR-005` (Streak visualization)

### Screen: History List
- **Purpose**: Browse and manage past study sessions
- **Layout**:
  - Top: Filter tabs (All/Week/Month)
  - Middle: Chronological list
  - Pull-to-refresh
- **Key Elements**:
  - Session cards (date, duration, subject, type)
  - Swipe-to-delete
  - Empty state illustration
  - Load more indicator
- **Primary Action**: View session details
- **Edge Cases**:
  - Empty history → "Start your first session" CTA
  - Deleted session → Confirmation dialog, streak recalculation
- **Flow References**:
  - Flow 5 (Review history)
- **PRD Requirement References**:
  - `PR-009` (Session history)

### Screen: Badges
- **Purpose**: Display achievements and progress
- **Layout**:
  - Top: Recently earned section
  - Grid: All badges (locked/unlocked)
- **Key Elements**:
  - Badge cards with icon, name, lock state
  - Progress bar for in-progress badges
  - Rarity indicator (border color)
  - Detail modal on tap
- **Primary Action**: Explore badge details
- **Edge Cases**:
  - No badges earned → Grid of mystery badges with hints
  - All badges earned → "Master Scholar" celebration
- **Flow References**:
  - Flow 7 (View badges)
- **PRD Requirement References**:
  - `PR-008` (Core badges)
  - `PR-103` (Extended badges - P1)

### Screen: Settings
- **Purpose**: Configure app preferences
- **Layout**: Standard settings list
- **Key Elements**:
  - Daily goal setting
  - Notification preferences
  - Sound/vibration settings
  - Data export (P1)
  - About/Legal
- **Primary Action**: Adjust preferences
- **Edge Cases**:
  - Goal set too low/high → Validation warning
  - Notification permission denied → Help text with instructions
- **Flow References**:
  - Flow 6 (Notification settings)
- **PRD Requirement References**:
  - `PR-004` (Daily goal)
  - `PR-007` (Notifications)
  - `PR-106` (Custom reminder - P1)
  - `PR-107` (Data export - P1)

---

## Components

### Component: Streak Card
- **Purpose**: Display current streak with weekly progress
- **Elements**:
  - Large streak number with flame icon
  - "day streak" label
  - 7-dot weekly progress indicator
  - Rest days remaining badge
- **States**:
  - Normal: Standard styling
  - At risk: Warning color (amber)
  - Broken: Grayed out with reset message
  - Just earned: Celebration animation

### Component: Daily Progress Ring
- **Purpose**: Show progress toward daily goal
- **Elements**:
  - Circular progress indicator
  - Center: Time remaining or percentage
  - Goal met: Checkmark + celebration
- **States**:
  - In progress: Partial fill
  - Complete: Full fill + checkmark
  - Overachieved: Full fill + overflow indicator

### Component: Session Card
- **Purpose**: Display session in history list
- **Elements**:
  - Date and time
  - Duration (prominent)
  - Subject tag chip (if applicable)
  - Pomodoro indicator icon
  - Swipe actions (delete)

### Component: Badge Card
- **Purpose**: Display achievement badge
- **Elements**:
  - Badge icon (locked/unlocked states)
  - Badge name
  - Rarity border color
  - Progress bar (if in progress)
- **States**:
  - Locked: Grayscale, hidden criteria or hint
  - Unlocked: Full color, criteria visible, date earned
  - New: Glow/pulse animation until viewed

### Component: Weekly Progress Dots
- **Purpose**: Show 7-day study pattern at a glance
- **Elements**:
  - 7 circles representing days (Mon-Sun)
  - States: empty (rest day available), filled (studied), crossed (rest day used), missed (no study)
  - Today indicator

---

## Interaction Patterns

### Navigation
- **Bottom Tab Bar**: Home | History | Badges | Settings
- **Modal Flows**: Onboarding, session setup, session summary
- **Back Behavior**: 
  - During active session → Confirm exit dialog
  - Settings → Auto-save, immediate apply

### Feedback Mechanisms
- **Haptic**: Light tap on buttons, success pattern on goal completion
- **Sound**: Optional gentle chime on session complete, Pomodoro phase end
- **Visual**: 
  - Toast notifications for saves and updates
  - Celebration animation for goal/streak achievements
  - Progress animations (rings filling, counters incrementing)

### Timer Behavior
- **Background**: Continue counting, local notification at goal/Pomodoro end
- **Interruption**: Auto-pause on phone call, offer resume
- **Accuracy**: ±5 seconds tolerance for background operation

### Form Interactions
- **Time Pickers**: Native iOS/Android time wheels
- **Durations**: 15-minute increment steppers
- **Toggles**: Immediate apply with haptic feedback

### Loading States
- **Initial load**: Skeleton screen for history/calendar
- **Session save**: Spinner on "Stop" button briefly
- **Settings save**: Immediate with toast confirmation

---

## Copy Direction

### Onboarding Copy
- **Welcome**: "Build study habits that last"
- **Streak Explanation**: "Study 5 days a week—life happens! Rest days keep you motivated without the guilt."
- **Goal Prompt**: "How long do you want to study each day?"
- **Reminder Prompt**: "When should we remind you to study?"

### Home Screen Copy
- **CTA**: "Start Studying"
- **Goal Progress**: "45 of 60 minutes today"
- **Streak Labels**: 
  - "5 day streak 🔥"
  - "2 rest days left this week"
  - "Streak at risk—study today!"

### Session Copy
- **Start**: "Ready to focus?"
- **During**: "Keep going! You're doing great."
- **Goal Reached**: "Daily goal complete! 🎉"
- **Under 5 min warning**: "Sessions under 5 minutes won't count toward your streak."

### Pomodoro Copy
- **Focus Phase**: "Focus Time"
- **Break Phase**: "Break Time"
- **Complete**: "Pomodoro complete! Take a breath."
- **Session End**: "Great focus! You completed X Pomodoros."

### Badge Copy
- **First Session**: "First Steps" — "Complete your first study session"
- **7-Day Streak**: "Week Warrior" — "Study 7 days in a row"
- **30-Day Streak**: "Month Master" — "Maintain a 30-day streak"
- **100 Hours**: "Century Club" — "Study for 100 total hours"

### Empty States
- **No History**: "No sessions yet. Your study journey starts with a single session!"
- **No Badges**: "Badges await! Complete sessions to unlock achievements."
- **Calendar Empty**: "This month is a blank canvas. Start filling it with study sessions!"

### Error Copy
- **Notification Denied**: "Enable notifications in Settings to get daily reminders."
- **Session Too Short**: "This session is quite short. Keep going to make it count!"
- **Timer Error**: "Something went wrong. Your session was saved up to [time]."

---

## Accessibility

### Screen Reader Support
- **Timer Announcements**: Announce elapsed time every 5 minutes during active session
- **Progress Indicators**: Include percentage/value in accessibility label
- **Visual States**: Describe streak status verbally ("5 day streak, 2 rest days remaining")
- **Badges**: Read badge name, description, and unlock status

### Color & Contrast
- **Minimum Contrast**: 4.5:1 for all text (WCAG AA)
- **Streak Status**: Don't rely solely on color; use icons and text
- **Heatmap**: Provide pattern/texture alternatives for colorblind users

### Touch Targets
- **Minimum Size**: 44×44 points for all interactive elements
- **Spacing**: 8 points minimum between adjacent targets
- **Timer Buttons**: Extra large (60×60) during active session for easy access

### Motion & Animation
- **Respect Reduced Motion**: Disable celebratory animations when system setting enabled
- **Essential Motion**: Timer progress and state changes remain visible
- **Badge Animations**: Static fallback for reduced motion preference

### Input Methods
- **Keyboard Navigation**: Full support for settings and form screens
- **Voice Control**: All buttons labeled for voice command compatibility
- **Switch Control**: Logical navigation order for accessibility switches

---

## Summary (for downstream agents)

```yaml
feature: "study-streak-app"
source_artifacts:
  prd: "docs/product-delegated-context2/prd.md"
  brainstorm: "docs/product-delegated-context2/brainstorm.md"
platform: "mobile"
framework: "Expo / React Native"
primary_flows:
  - name: "First-Time Onboarding"
    user_goal: "Set up app and understand flexible streak mechanics"
    prd_requirements: ["PR-004", "PR-007"]
    screens: ["Onboarding", "Home"]
  - name: "Starting a Study Session (Timer Mode)"
    user_goal: "Track study time with simple start/stop timer"
    prd_requirements: ["PR-001", "PR-010", "PR-101"]
    screens: ["Session Setup", "Active Session", "Session Summary"]
  - name: "Starting a Pomodoro Study Session"
    user_goal: "Use structured Pomodoro technique for focused study"
    prd_requirements: ["PR-003", "PR-010"]
    screens: ["Session Setup", "Active Pomodoro", "Session Summary"]
  - name: "Viewing Streak Status and Calendar"
    user_goal: "Understand streak status and study history"
    prd_requirements: ["PR-002", "PR-005"]
    screens: ["Home", "Calendar View"]
  - name: "Reviewing Session History"
    user_goal: "Review past study sessions and progress"
    prd_requirements: ["PR-009", "PR-101"]
    screens: ["History List"]
  - name: "Managing Notification Settings"
    user_goal: "Customize study reminders"
    prd_requirements: ["PR-007", "PR-106"]
    screens: ["Settings"]
  - name: "Viewing Unlocked Badges"
    user_goal: "See achievements and discover milestones"
    prd_requirements: ["PR-008", "PR-103"]
    screens: ["Badges"]
screens:
  - name: "Home"
    flows: ["Viewing Streak Status", "Starting Study Session"]
    components: ["Streak Card", "Daily Progress Ring", "Weekly Progress Dots"]
  - name: "Session Setup"
    flows: ["Timer Mode", "Pomodoro Mode"]
  - name: "Active Session"
    flows: ["Timer Mode"]
  - name: "Active Pomodoro"
    flows: ["Pomodoro Mode"]
  - name: "Session Summary"
    flows: ["Timer Mode", "Pomodoro Mode"]
  - name: "Calendar View"
    flows: ["Viewing Streak Status"]
  - name: "History List"
    flows: ["Reviewing Session History"]
  - name: "Badges"
    flows: ["Viewing Unlocked Badges"]
  - name: "Settings"
    flows: ["Managing Notification Settings"]
p0_requirements_covered:
  - "PR-001" (Daily study timer)
  - "PR-002" (Flexible streak system)
  - "PR-003" (Pomodoro mode)
  - "PR-004" (Daily goal setting)
  - "PR-005" (Streak visualization)
  - "PR-007" (Daily reminder notification)
  - "PR-008" (Core badge system)
  - "PR-009" (Session history)
  - "PR-010" (Background timer)
p1_requirements_covered:
  - "PR-101" (Subject tagging)
  - "PR-103" (Extended badge set)
  - "PR-106" (Customizable reminder time)
visual_direction:
  tone: "Encouraging, calm, focused"
  primary_color: "#F59E0B (warm amber)"
  secondary_color: "#0D9488 (deep teal)"
  success_color: "#10B981 (vibrant green)"
  reference_apps: ["Duolingo", "Forest", "Streaks", "Headspace"]
key_risks:
  - "User confusion about flexible streak vs rigid streak expectations—requires clear onboarding"
  - "Background timer accuracy across different devices/OS versions"
  - "Notification reliability on Android with battery optimizations"
  - "Data loss if user uninstalls app (no cloud backup in MVP)"
  - "Session interruption handling (phone calls, app crashes)"
open_questions_addressed:
  - "Minimum session duration: 5 minutes (shown in warning if under)"
  - "Rest day policy: 2 floating rest days per week (not fixed)"
  - "Pomodoro default: Off by default, user toggles on"
  - "Notification strategy: Single daily reminder (configurable time)"
  - "Session interruption: Auto-pause on calls, recovery prompt on crash"
```

---

## Handoff Contract

**Next Agent:** `user-stories`

**Required Artifacts:**
- `docs/product-delegated-context2/prd.md`
- `docs/product-delegated-context2/ux.md` (this document)

**Recommended Artifacts:**
- `docs/product-delegated-context2/brainstorm.md`

**Critical Inputs That Must Remain Stable:**
- Target audience: Students (age ~16-25)
- Core mechanic: Flexible streak (5 days/week minimum, 2 floating rest days)
- Platform: Mobile iOS/Android via Expo/React Native
- Key differentiator: Flexible streak + Pomodoro + Badges combination
- All 7 primary flows and their associated PRD requirement mappings
- Visual direction: Warm amber primary, calm teal secondary, encouraging tone

**Sections That Must Not Change:**
- User Goal
- Primary Flows (all 7 flows with their structure)
- Screen/Component Breakdown (9 screens defined)
- Interaction Patterns (navigation, feedback, timer behavior)
- Copy Direction (actual copy provided, not placeholders)
- Accessibility requirements
- PRD requirement mappings

**Mapping Rules:**
- Every primary flow must map to at least one user story
- Every screen/component referenced by a flow must appear in at least one story
- Every P0 requirement referenced from the PRD must remain covered in stories
- Copy direction must flow into story acceptance criteria
- Accessibility requirements must be included in story acceptance criteria
- Visual direction should inform story implementation notes

**What User Stories Should Produce:**
- Individual user stories for each flow step
- Acceptance criteria including copy and accessibility requirements
- Story points/estimates
- Implementation notes referencing components and screens
- Test cases for edge cases identified in flows
