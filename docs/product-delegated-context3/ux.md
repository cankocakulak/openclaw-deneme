# UX: Study Streak

## User Goal
Students want to build consistent study habits by tracking their daily sessions in a way that feels emotionally rewarding and motivating, not just measurable.

## Analysis

The UX challenge is transforming an abstract habit (studying consistently) into a tangible, emotionally engaging experience. Students need to feel immediate positive feedback for their effort while maintaining awareness of their progress without becoming anxious about perfection. The garden metaphor must balance delight with simplicity—rewarding enough to create attachment, but not so complex that it distracts from the core study habit.

## Visual Direction

### Tone & Feel
**Warm, Calm, and Encouraging** — The app should feel like a peaceful study companion, not a demanding taskmaster. Visual language should evoke growth, nature, and gentle progress. Avoid aggressive gamification tropes (flashy coins, harsh red warnings). Instead, use soft animations, organic shapes, and a color palette that feels like a serene garden at golden hour.

### Reference Apps
- **Forest** — Focus timer with tree-growing metaphor; reference the satisfying completion animation and the emotional attachment users develop to their virtual trees
- **Streaks** — Clean, focused habit tracking; reference the simplicity of the main interface and the clarity of the streak visualization
- **Headspace** — Calm, approachable design language; reference the soft color palette and reassuring microcopy tone
- **Animal Crossing** — Low-pressure daily engagement; reference the "checking on your garden" feeling and gentle visual feedback

### Color Direction
- **Primary**: Sage green (`#7C9A6B`) — Growth, nature, calm; used for main actions and garden elements
- **Accent**: Warm amber (`#F4A261`) — Sunlight, achievement, warmth; used for CTAs, streak highlights, and celebration moments
- **Semantic**:
  - Success: Soft moss green (`#8FB573`) — Healthy garden, streak maintained
  - Error: Muted terracotta (`#E07A5F`) — Wilting, streak at risk (not aggressive red)
  - Warning: Gentle gold (`#E9C46A`) — Grace period active, freeze available
  - Info: Sky blue (`#87CEEB`) — Tips, educational content
- **Neutral**:
  - Background: Warm off-white (`#FDFCF8`) — Paper-like, easy on eyes during long study sessions
  - Surface: Soft cream (`#F5F3EE`) — Cards, modals
  - Text Primary: Deep charcoal (`#2D3436`) — High readability
  - Text Secondary: Warm gray (`#636E72`) — Subtle labels, hints

### Typography & Spacing
- **Font**: System font stack (San Francisco on iOS, Roboto on Android) for native feel and performance
- **Hierarchy**:
  - Display: 32-40px bold for streak count and garden status
  - Headings: 24-28px semibold for screen titles
  - Body: 16-18px regular for content
  - Caption: 14px for secondary info
- **Spacing**: Generous whitespace (16-24px) to create calm, uncluttered feel; avoid information density that feels overwhelming
- **Density**: Medium — enough content to feel useful, enough space to feel breathable

## Primary Flows

### Flow Name: First-Time Onboarding
- **User Goal**: Set up the app quickly and understand how studying grows my garden
- **Trigger**: User opens app for the first time after installation
- **Steps**:
  1. **Welcome Screen**: Full-screen illustration of a thriving garden with headline "Grow Your Study Habit"
  2. **Garden Introduction**: Brief animated explanation showing how daily studying waters the garden; copy: "Each study session nurtures your garden. Miss a day, and your plants need care."
  3. **Notification Permission**: Request permission with context: "We'll remind you to study at your chosen time. You can change this anytime."
  4. **Set Reminder Time**: Time picker with default 7:00 PM; copy: "What time works best for your daily reminder?"
  5. **First Garden View**: Show starter garden (single small sprout) with CTA "Start Your First Session"
- **Edge Cases**:
  - User denies notifications: Continue to garden view, show subtle inline reminder to enable later in settings
  - User exits mid-flow: Save progress, resume at same step on next open
- **Success State**: User lands on Home Screen with garden visible and understands the core loop
- **PRD Requirement References**:
  - `PR-005` (Daily reminder notifications)
  - `PR-002` (Virtual garden visualization)

### Flow Name: Start Study Session
- **User Goal**: Begin a focused study session and see my garden while I work
- **Trigger**: User taps "Start Session" button from Home Screen
- **Steps**:
  1. **Session Setup** (optional, collapsible): Quick options for focus mode toggle, weekly goal progress visible
  2. **Timer Screen**: Full-screen or near-full-screen timer showing:
     - Large digital timer (MM:SS format)
     - Garden visualization (current state: healthy/wilting)
     - Focus Mode toggle button
     - "End Session" button (secondary style, to discourage early stopping)
  3. **Timer Running State**: Timer counts up from 00:00; garden shows subtle ambient animation (gentle swaying, particle effects)
  4. **Background Handling**: If user switches apps, timer continues; local notification shows "Study session in progress" with elapsed time
- **Edge Cases**:
  - User tries to start session before 4 AM "next day" cutoff after already completing one: Show "You've already studied today! Your streak is safe. Start a bonus session?"
  - App is force-quit during session: On relaunch, show recovery dialog "You had a session in progress. Resume or discard?"
  - Phone dies during session: On relaunch, show "Your session was interrupted. Add [X] minutes to your history?" (max 4 hours)
- **Success State**: Timer is running, user is studying, garden is visible and responsive
- **PRD Requirement References**:
  - `PR-001` (Daily streak tracking)
  - `PR-004` (Background timer accuracy)
  - `PR-006` (Minimum session duration)
  - `PR-102` (Focus mode)

### Flow Name: Complete Study Session
- **User Goal**: Finish studying, see my progress reflected, and feel rewarded
- **Trigger**: User taps "End Session" after 5+ minutes OR session reaches 4-hour maximum
- **Steps**:
  1. **Completion Animation**: 2-3 second celebration animation:
     - Garden shows visible growth (new leaf, flower blooming, or growth stage advancement)
     - Particles/confetti in brand colors (amber/green)
     - Haptic feedback (light success pattern)
  2. **Session Summary Card**: Modal or full-screen showing:
     - "Session Complete!" headline
     - Duration: "You studied for 45 minutes"
     - Streak status: "🔥 5 day streak!" or "🌱 Streak started!" (if first day)
     - Garden growth: "Your garden is thriving"
  3. **Optional Note Prompt**: "What did you study? (Optional)" with quick-add tags (Math, Science, History, etc.) and text field
  4. **Dismiss**: Primary CTA "Back to Garden" dismisses to Home Screen
- **Edge Cases**:
  - Session under 5 minutes: Show "Sessions under 5 minutes don't count toward your streak. Study a bit longer?" with "Continue" and "End Anyway" options
  - Session at exactly 4 hours: Auto-end with message "Maximum session reached! Great focus — take a break."
  - Session completes after midnight but before 4 AM: Count toward previous day's streak (grace period)
- **Success State**: User returns to Home Screen with updated streak, garden growth visible, and sense of accomplishment
- **PRD Requirement References**:
  - `PR-001` (Daily streak tracking)
  - `PR-002` (Virtual garden visualization)
  - `PR-006` (Minimum session duration)
  - `PR-007` (Session history)
  - `PR-104` (Session notes)

### Flow Name: Handle Missed Day / Grace Period
- **User Goal**: Understand my streak is at risk and take action to save it
- **Trigger**: User has not completed a session by midnight OR opens app during grace period (midnight–4 AM next day)
- **Steps**:
  1. **Grace Period State** (if app opened 12:00 AM–3:59 AM):
     - Garden shows slight wilting visual (leaves drooping, desaturated colors)
     - Banner: "Your streak ends in [countdown to 4 AM]. Study now to save it!"
     - Prominent "Start Session" CTA
  2. **Streak Broken State** (if 4 AM passed without session):
     - Garden shows visible wilting/browning
     - Headline: "Your [X]-day streak ended"
     - Message: "Life happens. Start a new session today to begin growing again."
     - "Start New Session" primary CTA
     - Secondary: "View History" to see past streaks
  3. **Freeze Available State** (if streak freeze not yet used this week):
     - Show freeze option: "Use your weekly streak freeze?"
     - Explain: "This saves your streak one time. You get a new freeze every Monday."
     - "Use Freeze" / "Don't Use" options
- **Edge Cases**:
  - User has freeze available but doesn't use it before 4 AM: Streak breaks, freeze remains available for future use
  - User tries to use freeze after streak already broken: Inform "Freezes must be used before your streak ends"
  - Multiple days missed: Show "Your garden needs care. Start studying to bring it back to life."
- **Success State**: User either saves streak via grace period session, uses freeze, or accepts streak reset and begins anew
- **PRD Requirement References**:
  - `PR-001` (Grace period until 4 AM)
  - `PR-008` (Streak freeze mechanic)
  - `PR-002` (Garden wilting visualization)

### Flow Name: View History and Stats
- **User Goal**: Review my study patterns and see my progress over time
- **Trigger**: User taps "History" or stats area from Home Screen
- **Steps**:
  1. **Stats Dashboard**:
     - Current streak (large number with flame icon)
     - Longest streak (all-time record)
     - Total hours studied (lifetime)
     - Average session length
     - Weekly goal progress (if set)
  2. **Calendar Heatmap**: 
     - 30-day view showing study activity
     - Color intensity based on session duration (darker = more time)
     - Tap day to see session details
  3. **Session List**: Scrollable list of recent sessions showing:
     - Date and time
     - Duration
     - Subject tags (if any)
     - Note preview (if any)
  4. **Pull-to-refresh**: Updates stats (mostly for sync status)
- **Edge Cases**:
  - No sessions yet: Show empty state with illustration of seed packet and "Your garden is waiting. Start your first session!"
  - Offline: Show cached data with subtle "Last updated [time]" indicator
  - Long session list: Implement virtualized scrolling for performance
- **Success State**: User can see their study patterns, identify trends, and feel motivated by visible progress
- **PRD Requirement References**:
  - `PR-007` (Session history & stats)
  - `PR-103` (Weekly study goals)
  - `PR-104` (Session notes)

### Flow Name: Unlock Garden Theme (Milestone)
- **User Goal**: Celebrate achieving a streak milestone and customize my garden
- **Trigger**: User reaches 7, 30, or 100 day streak
- **Steps**:
  1. **Milestone Celebration**:
     - Full-screen modal with animated celebration
     - Headline: "🎉 7-Day Streak!" (or 30, 100)
     - Message: "Your consistency is paying off. You've unlocked a new garden theme!"
  2. **Theme Preview**:
     - Show unlocked theme (Succulent Garden, Flower Bed, or Bonsai Tree)
     - Side-by-side comparison with current theme
     - Brief description of theme
  3. **Apply or Keep**:
     - "Switch to [Theme Name]" primary CTA
     - "Keep Current Theme" secondary option
     - "Preview in Garden" tertiary option (temporary switch)
  4. **Confirmation**: If applied, show brief "Theme updated!" toast, return to Home Screen with new garden visual
- **Edge Cases**:
  - User dismisses without choosing: Theme remains unlocked, accessible in Settings > Garden Themes
  - User already has multiple themes: Show "You have [X] themes. Switch anytime in Settings."
- **Success State**: User feels rewarded for consistency, has personalized their experience, and is motivated to maintain streak
- **PRD Requirement References**:
  - `PR-101` (Multiple garden themes)
  - `PR-001` (Streak tracking)

## Screen/Component Breakdown

### Home Screen
- **Purpose**: Primary dashboard showing garden state, current streak, and main action to start studying
- **Layout**: 
  - Top: Header with settings icon, notification bell
  - Middle (60%): Garden visualization (interactive, animated)
  - Bottom: Streak counter, weekly goal progress (if set), large "Start Session" CTA
- **Key Elements**:
  - Garden visualization (central, prominent)
  - Streak badge: "🔥 [N] day streak"
  - Weekly goal bar: "[X]/[Y] hours this week"
  - "Start Session" button (large, primary CTA)
  - "History" secondary button
- **Primary Action**: Start a new study session
- **Edge Cases**:
  - **Empty State**: New user sees single sprout with "Your garden is just beginning"
  - **Wilting State**: Desaturated colors, drooping animation, "Study today to water your garden"
  - **Frozen State**: Ice crystal overlay on streak badge, "Streak frozen — study to unfreeze"
  - **Offline**: Subtle indicator in header, no functionality blocked
- **Flow References**:
  - Start Study Session
  - Handle Missed Day / Grace Period
  - View History and Stats
- **PRD Requirement References**:
  - `PR-001` (Streak tracking)
  - `PR-002` (Garden visualization)
  - `PR-008` (Streak freeze)

### Timer Screen
- **Purpose**: Active study session interface with visible timer and garden
- **Layout**:
  - Top: Collapsible settings bar (focus mode toggle)
  - Middle (50%): Large digital timer (MM:SS)
  - Lower middle (30%): Mini garden view (current state)
  - Bottom: "End Session" button (secondary style)
- **Key Elements**:
  - Timer display (large, monospace font for precision)
  - Focus mode toggle: "Focus Mode: [Off/On]" with moon icon
  - Garden mini-view: Smaller version showing current health
  - Session note quick-add (expandable)
  - "End Session" button (outlined, not filled — discourage early stopping)
- **Primary Action**: End the current study session
- **Edge Cases**:
  - **Backgrounded**: Show local notification "Session running: [X] minutes"
  - **Low Battery**: Warn if <10% battery "Low battery — session may not save if phone dies"
  - **Phone Call Incoming**: Pause timer, show "Session paused — resume when ready"
  - **Focus Mode On**: Full-screen, no status bar, keep-awake active
- **Flow References**:
  - Start Study Session
  - Complete Study Session
- **PRD Requirement References**:
  - `PR-004` (Background timer)
  - `PR-006` (Session duration limits)
  - `PR-102` (Focus mode)

### Session Complete Screen
- **Purpose**: Celebrate completion, show progress, collect optional note
- **Layout**:
  - Top: Celebration animation (full-width)
  - Middle: Session stats card
  - Bottom: Note input (collapsible) and dismiss CTA
- **Key Elements**:
  - "Session Complete!" headline
  - Duration display
  - Streak update message
  - Garden growth visual (new growth highlighted)
  - Subject tags (quick-select chips: Math, Science, History, Language, Other)
  - Note text field (max 200 chars)
  - "Back to Garden" primary CTA
- **Primary Action**: Return to Home Screen
- **Edge Cases**:
  - **Under 5 Minutes**: Show warning modal before this screen
  - **No Streak Change**: "Bonus session! Your streak is already safe today."
  - **New Record**: "New longest streak! 🎉" badge
- **Flow References**:
  - Complete Study Session
- **PRD Requirement References**:
  - `PR-001` (Streak tracking)
  - `PR-002` (Garden growth)
  - `PR-104` (Session notes)

### History Screen
- **Purpose**: Review past study activity and track progress
- **Layout**:
  - Top: Stats cards (horizontal scroll or grid)
  - Middle: Calendar heatmap (30-day)
  - Bottom: Recent sessions list
- **Key Elements**:
  - Stat cards: Current streak, longest streak, total hours, avg session
  - Weekly goal progress ring (if set)
  - Calendar: Days color-coded by study duration
  - Session list items: Date, duration, subject tags
  - Filter options: All time, this month, this week
- **Primary Action**: Review specific day (tap calendar) or session (tap list item)
- **Edge Cases**:
  - **No Data**: Empty state with seed packet illustration
  - **Single Session**: "Your study journey has begun! Keep going."
  - **Long History**: Lazy load older sessions on scroll
- **Flow References**:
  - View History and Stats
- **PRD Requirement References**:
  - `PR-007` (Session history)
  - `PR-103` (Weekly goals)

### Settings Screen
- **Purpose**: Configure app preferences and manage account
- **Layout**: Standard grouped list (iOS) or cards (Android)
- **Key Elements**:
  - **Notifications**: Toggle, reminder time picker, sound selection
  - **Garden**: Theme selector (shows locked/unlocked), preview
  - **Goals**: Weekly hour target setting
  - **Data**: Export, backup status, clear history
  - **About**: Version, help, privacy policy
- **Primary Action**: Adjust preferences
- **Edge Cases**:
  - **Clear History**: Confirm dialog "This will delete all session history. Your garden will reset. This cannot be undone."
  - **Theme Locked**: Show lock icon with "Reach a [7/30/100] day streak to unlock"
- **Flow References**:
  - Unlock Garden Theme
- **PRD Requirement References**:
  - `PR-005` (Notification settings)
  - `PR-101` (Garden themes)
  - `PR-103` (Weekly goals)
  - `PR-202` (Export data)

## Interaction Patterns

### Timer Behavior
- **Start**: Immediate, no delay, haptic confirmation
- **Background**: Continue counting, show persistent notification
- **Resume from Background**: Instant, no loading, timer shows accurate elapsed time
- **Interrupt**: Phone calls pause timer; user must explicitly resume
- **Maximum**: Auto-end at 4 hours with success state

### Garden Visual Feedback
- **Healthy**: Gentle ambient animation (subtle swaying, particle effects)
- **Wilting**: Slowed animation, desaturated colors, drooping posture
- **Growth**: Triggered on session complete; 2-3 second celebration animation
- **Freeze**: Ice crystal overlay, static (no animation) until unfrozen

### Navigation
- **Home ↔ Timer**: Push transition with garden morphing into mini-view
- **Home ↔ History**: Slide transition (directional cue)
- **Modal Presentations**: Milestones, settings, completion screens use bottom sheet or full modal
- **Back Navigation**: Swipe from edge (iOS) or back button (Android)

### Loading and Transitions
- **App Launch**: <2 second cold start; show cached garden immediately, update in background
- **Screen Transitions**: 200-300ms, ease-out curve
- **Skeleton Loading**: Use for history screen if data not cached
- **Pull-to-Refresh**: Standard iOS/Android pattern for history

### Haptic Feedback
- **Session Start**: Light impact
- **Session Complete**: Success pattern (3 quick pulses)
- **Milestone Unlock**: Heavy impact + success pattern
- **Streak Break**: None (avoid negative haptics)
- **Button Taps**: Light impact on all interactive elements

## Copy Direction

### Button Labels
- "Start Session" (primary CTA)
- "End Session" (timer screen)
- "Back to Garden" (completion)
- "View History" / "See Your Progress"
- "Use Freeze" / "Save My Streak"
- "Switch Theme" / "Keep Current"

### Empty States
- **New User**: "Your garden is just beginning. Start your first session to plant the seed."
- **No History**: "Your study journey starts here. Every expert was once a beginner."
- **Theme Locked**: "Keep your streak alive to unlock this beautiful garden theme."

### Error/Warning Messages
- **Under 5 Minutes**: "Sessions under 5 minutes don't count toward your streak. Study a bit longer?"
- **Streak at Risk**: "Your streak ends at 4 AM. Take 5 minutes to keep your garden growing!"
- **Streak Broken**: "Your [X]-day streak ended. Every ending is a new beginning — start fresh today."
- **Offline**: "You're offline. Your sessions are saved locally and will sync when you reconnect."

### Celebration Messages
- **Session Complete**: "Session complete! Your garden is thriving."
- **Streak Milestones**: 
  - 3 days: "3-day streak! You're building momentum."
  - 7 days: "🎉 One week! Your consistency is inspiring."
  - 30 days: "🔥 30 days! You've built a real habit."
  - 100 days: "🏆 100 days! You're unstoppable."
- **Theme Unlocked**: "New garden theme unlocked! Your dedication is blooming."

### Microcopy
- **Timer Running**: "Focus time"
- **Grace Period**: "[X] hours left to save your streak"
- **Freeze Available**: "Weekly freeze: Ready to use"
- **Freeze Used**: "Weekly freeze: Used (resets Monday)"

## Accessibility

### Screen Reader Support
- **Garden Visualization**: Provide descriptive alt text that updates with state: "Your garden is healthy with 5 plants. You've studied 5 days in a row."
- **Timer**: Announce time elapsed every 5 minutes: "25 minutes of focus"
- **Streak Status**: Clear announcement: "Current streak: 5 days. Longest streak: 12 days."
- **Session Complete**: Announce success and new streak count immediately

### Color Contrast
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Garden state differences distinguishable without color (shape, animation changes)
- Error states use icons + text, not color alone

### Touch Targets
- Minimum 44x44pt for all interactive elements
- "Start Session" and "End Session" buttons: 56pt height for easy access
- Subject tag chips: 36pt height, adequate spacing

### Focus Mode Accessibility
- **Reduced Motion**: Respect system setting; disable garden animations, keep functional transitions
- **VoiceOver**: Full navigation support in timer screen
- **Dynamic Type**: Support up to 200% text size; timer scales, garden remains visible

### Keyboard Navigation (iPad/External Keyboard)
- Full tab navigation support
- Space/Enter to activate buttons
- Escape to close modals
- Shortcuts: "S" to start session (from home), "E" to end session (from timer)

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  prd: "docs/product-delegated-context3/prd.md"
  brainstorm: "docs/product-delegated-context3/brainstorm.md"
primary_flows:
  - name: "First-Time Onboarding"
    prd_requirements: ["PR-005", "PR-002"]
  - name: "Start Study Session"
    prd_requirements: ["PR-001", "PR-004", "PR-006", "PR-102"]
  - name: "Complete Study Session"
    prd_requirements: ["PR-001", "PR-002", "PR-006", "PR-007", "PR-104"]
  - name: "Handle Missed Day / Grace Period"
    prd_requirements: ["PR-001", "PR-008", "PR-002"]
  - name: "View History and Stats"
    prd_requirements: ["PR-007", "PR-103", "PR-104"]
  - name: "Unlock Garden Theme (Milestone)"
    prd_requirements: ["PR-101", "PR-001"]
screens:
  - name: "Home Screen"
    flows: ["Start Study Session", "Handle Missed Day / Grace Period", "View History and Stats"]
  - name: "Timer Screen"
    flows: ["Start Study Session", "Complete Study Session"]
  - name: "Session Complete Screen"
    flows: ["Complete Study Session"]
  - name: "History Screen"
    flows: ["View History and Stats"]
  - name: "Settings Screen"
    flows: ["Unlock Garden Theme"]
p0_requirements_covered:
  - "PR-001"
  - "PR-002"
  - "PR-003"
  - "PR-004"
  - "PR-005"
  - "PR-006"
  - "PR-007"
  - "PR-008"
p1_requirements_covered:
  - "PR-101"
  - "PR-102"
  - "PR-103"
  - "PR-104"
key_risks:
  - "Garden metaphor appeal: Gamification may not resonate with all age groups — provide theme options"
  - "Background timer accuracy: OS restrictions may limit background execution — test thoroughly on both platforms"
  - "Streak breakage demotivation: Users may abandon app after losing long streak — ensure recovery messaging is encouraging, not punitive"
  - "Notification fatigue: Too many reminders could lead to uninstalls — default to 7 PM, allow easy customization"
garden_metaphor_decision: "Multi-plant garden (not single plant or creature) — allows for visual variety, growth stages, and theme unlocks"
streak_freeze_ux: "One freeze per week, visible on Home Screen as indicator, usable during grace period via prominent CTA"
open_questions_resolved:
  - "Garden metaphor: Multi-plant garden with unlockable themes"
  - "Streak freeze: Weekly only, non-accumulative, visible availability indicator"
  - "Notification: Default 7 PM, customizable during onboarding and settings"
  - "Grace period: Fixed 4 AM cutoff (not configurable for v1)"
  - "Session pausing: Not allowed — stop/start only (simpler mental model)"
```

## Handoff Contract

**Next Agent:** `user-stories`

**Required Artifacts:**
- `docs/product-delegated-context3/prd.md`
- `docs/product-delegated-context3/ux.md` (this document)

**Recommended Artifacts:**
- `docs/product-delegated-context3/brainstorm.md` — for context on rejected directions

**Critical Inputs:**
- User goal: Build consistent study habits through emotionally rewarding tracking
- Primary flows: 6 core flows covering onboarding, session lifecycle, streak management, and history
- Screen/component breakdown: 5 main screens with detailed specifications
- Interaction patterns: Timer behavior, garden feedback, navigation, haptics
- Copy direction: Actual button labels, empty states, error messages, celebrations
- Accessibility requirements: Screen reader support, contrast, touch targets, reduced motion

**Sections That Must Not Change:**
- User Goal
- Primary Flows (6 flows defined above)
- Screen/Component Breakdown (Home, Timer, Complete, History, Settings)
- Interaction Patterns (timer behavior, garden feedback, navigation)
- Accessibility requirements (screen reader, contrast, touch targets)

**Mapping Rules:**
- Every primary flow must map to at least one user story
- Every screen/component referenced by a flow must appear in at least one story
- Every P0 requirement (PR-001 through PR-008) must remain covered
- Garden visualization is the core differentiator — stories should emphasize garden state changes
- Streak freeze mechanic needs clear UI story for availability and usage
- Copy direction should be used as acceptance criteria, not suggestions

**User Stories Agent Decisions Needed:**
1. Story granularity: One story per flow or break flows into smaller stories?
2. Technical story separation: Separate stories for background timer, notifications, etc.?
3. Acceptance criteria depth: Include exact copy as AC or reference UX doc?
4. Edge case coverage: Include all edge cases in stories or create separate "edge case" stories?
