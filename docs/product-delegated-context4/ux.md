# Study Streak - UX Design Document

## Overview

Study Streak is a mobile-first study habit tracker designed for students. This UX document defines the user flows, screen layouts, navigation structure, and interaction patterns for the Expo / React Native application.

---

## User Flows

### 1. Onboarding Flow

**Flow**: Welcome → Subject Setup → Notification Permission → First Session Demo

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Welcome | Introduce app value prop | App logo, tagline "Build Better Study Habits", "Get Started" CTA |
| Subject Setup | Configure initial subjects | Pre-populated list (Math, Science, History, Language), add custom subject option |
| Notifications | Request permission | Explain benefits, system permission dialog trigger |
| First Session Demo | Guide through timer | Highlight start/pause/complete actions |

### 2. Core Study Flow

**Flow**: Home → Select Subject → Timer → Session Complete → Optional Note

```
┌─────────┐    ┌─────────────┐    ┌────────┐    ┌──────────┐    ┌─────────────┐
│  Home   │───▶│ Subject     │───▶│ Timer  │───▶│ Session  │───▶│ Optional    │
│  Screen │    │ Selection   │    │ Screen │    │ Complete │    │ Note Entry  │
└─────────┘    └─────────────┘    └────────┘    └──────────┘    └─────────────┘
```

### 3. Progress Review Flow

**Flow**: Home → Stats Tab → Weekly View → Subject Detail

---

## Screen Specifications

### Home Screen (Main Tab)

**Layout**: Scrollable dashboard with sticky header

**Sections** (top to bottom):
1. **Header**: App logo, settings icon, streak freeze count badge
2. **Today's Summary Card**: 
   - Total study time today (large number)
   - Subjects studied count
   - Longest active streak
3. **Quick Start**: Large "Start Studying" CTA button
4. **Subject Streaks**: Horizontal scroll of subject cards showing:
   - Subject name
   - Current streak number
   - Progress indicator (studied today or not)
5. **Weekly Mini-Chart**: Last 7 days activity bars

**Interactions**:
- Pull to refresh
- Tap subject card → Subject detail
- Tap "Start Studying" → Subject selection modal

### Timer Screen

**Layout**: Full-screen immersive mode

**Elements**:
1. **Top Bar**: Back button, subject name, minimize option
2. **Timer Display**: Large circular progress indicator
   - Elapsed time in center (MM:SS)
   - Progress ring fills clockwise
3. **Controls** (bottom):
   - Primary: Start/Pause (large circular button)
   - Secondary: Complete Session, Cancel
4. **Session Info**: Current streak for subject, daily goal progress

**States**:
- **Idle**: Timer at 00:00, "Start" button visible
- **Running**: Timer counting, "Pause" button, subtle pulse animation
- **Paused**: Timer frozen, "Resume" and "Complete" options
- **Completed**: Celebration animation, streak update

**Background Behavior**:
- Timer continues when app backgrounded
- Notification shows elapsed time
- Tap notification returns to timer

### Subject Selection Modal

**Layout**: Bottom sheet with search and grid

**Elements**:
- Search bar at top
- Grid of subject cards (icon + name + color)
- "+ Add New Subject" button at bottom
- Recent subjects section at top

### Stats Screen (Tab)

**Layout**: Tabbed interface with Weekly/Monthly views

**Weekly View**:
- Bar chart: 7 days of study time
- Total hours this week
- Week-over-week comparison
- Most studied subject

**Monthly View**:
- Calendar heatmap (GitHub-style)
- Total hours this month
- Longest streak achieved
- Subject breakdown pie chart

### Subject Detail Screen

**Layout**: Scrollable with sticky header

**Header**:
- Subject icon and name
- Current streak (large number)
- Longest streak record

**Body**:
- Calendar view with study days marked
- Session history list (date, duration, notes)
- Study goal progress
- Edit/Delete subject options

### Settings Screen

**Sections**:
1. **Account**: Profile, sync status, logout
2. **Notifications**: Reminder time, streak risk warning toggle
3. **Study Preferences**: Default timer duration, daily goal
4. **Subjects**: Manage all subjects
5. **Data**: Export, backup, delete account
6. **App**: Dark mode, language, about

---

## Navigation Structure

### Tab Bar (Bottom)

```
┌─────────┬─────────┬─────────┬─────────┐
│  Home   │  Stats  │  Subjects│ Settings│
│  (Timer)│         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

- **Home**: Main dashboard and quick actions
- **Stats**: Progress tracking and analytics
- **Subjects**: Manage and browse subjects
- **Settings**: App configuration

### Stack Navigation

**Home Stack**:
- Home → Timer → Session Complete → Note Entry
- Home → Subject Detail

**Stats Stack**:
- Stats Main → Weekly Detail → Monthly Detail

**Subjects Stack**:
- Subjects List → Subject Detail → Edit Subject
- Subjects List → Add Subject

**Settings Stack**:
- Settings Main → Notification Settings
- Settings Main → Account Settings
- Settings Main → Subject Management

---

## Component Library

### Buttons

| Type | Usage | Style |
|------|-------|-------|
| Primary | Main CTAs (Start Studying) | Filled, brand color, rounded |
| Secondary | Alternative actions | Outlined, same color |
| Tertiary | Minor actions | Text only |
| Icon | Navigation, actions | Circular or square |

### Cards

**Subject Card**:
- Size: 120x140px
- Icon (40px) centered top
- Subject name below
- Streak badge bottom-right
- Color-coded border/background

**Summary Card**:
- Full width, 120px height
- Large metric centered
- Label below
- Optional trend indicator

### Input Fields

- **Text Input**: Rounded corners, subtle border, clear label
- **Number Input**: Stepper controls for time/duration
- **Toggle**: iOS-style switch
- **Picker**: Bottom sheet modal

### Feedback Elements

**Toast Notifications**:
- Success: Green checkmark, brief message
- Warning: Yellow alert, action suggested
- Error: Red icon, clear explanation

**Celebration**:
- Badge earned: Full-screen confetti animation
- Streak milestone: Animated number count-up
- Session complete: Subtle success chime + haptic

---

## Interaction Patterns

### Gestures

| Gesture | Action | Context |
|---------|--------|---------|
| Pull down | Refresh | Lists, home screen |
| Swipe left | Delete/Edit | Subject list, session history |
| Long press | Quick actions | Subject cards |
| Tap and hold | Preview | Stats data points |

### Micro-interactions

- **Button Press**: Scale down 0.95, haptic feedback
- **Timer Tick**: Subtle pulse on progress ring
- **Streak Update**: Number flip animation
- **Subject Select**: Card lift + color highlight

### Empty States

**No Subjects**:
- Illustration: Empty notebook
- Message: "Add your first subject to start tracking"
- CTA: "Add Subject" button

**No Study Sessions**:
- Illustration: Calendar with sleeping emoji
- Message: "No study sessions yet. Start your first one!"
- CTA: "Start Studying" button

**No Streak**:
- Illustration: Broken chain
- Message: "Start a streak today!"
- CTA: Quick start option

---

## Responsive Considerations

### Screen Sizes

| Size | Adjustments |
|------|-------------|
| Small (iPhone SE) | Compact header, smaller cards, reduced padding |
| Medium (iPhone 14) | Standard layout |
| Large (iPhone 14 Pro Max) | Larger touch targets, more content visible |
| Tablet | Side-by-side layouts, expanded charts |

### Orientation

- **Portrait**: Primary orientation, all features available
- **Landscape**: Timer optimized, stats show expanded charts

---

## Accessibility

### Requirements

- **Screen Reader**: All elements labeled, logical navigation order
- **Dynamic Type**: Support text size up to 200%
- **Color Contrast**: WCAG AA compliance (4.5:1 minimum)
- **Touch Targets**: Minimum 44x44px
- **Reduce Motion**: Respect system preference for animations

### Implementation Notes

- Use React Native's Accessibility API
- Test with VoiceOver (iOS) and TalkBack (Android)
- Provide alternative text for all icons
- Ensure timer is accessible via voice commands

---

## Animation Guidelines

### Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Screen transition | 300ms | Ease-in-out |
| Button press | 100ms | Ease-out |
| Card hover/lift | 200ms | Spring |
| Timer pulse | 1000ms | Linear loop |
| Celebration | 2000ms | Ease-out |

### Principles

- **Purposeful**: Every animation guides attention or provides feedback
- **Subtle**: Enhance, don't distract
- **Consistent**: Same animations for same actions throughout
- **Performant**: 60fps on mid-range devices

---

## Dark Mode Specifications

### Color Mapping

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | #FFFFFF | #121212 |
| Surface | #F5F5F5 | #1E1E1E |
| Primary Text | #212121 | #FFFFFF |
| Secondary Text | #757575 | #B0B0B0 |
| Accent | #4CAF50 | #81C784 |
| Border | #E0E0E0 | #333333 |

### OLED Black Option

- Pure black (#000000) background option
- Reduces battery usage on OLED screens
- Higher contrast for outdoor visibility

---

## Success Metrics

### UX KPIs

- **Task Success Rate**: 90%+ complete a study session
- **Time on Task**: <30 seconds to start first session
- **Error Rate**: <5% accidental cancellations
- **Retention**: 70%+ return within 24 hours
- **Feature Discovery**: 80%+ find streak freeze feature

### Tracking

- Screen flow analytics
- Button tap heatmaps
- Session completion funnel
- Error event logging
- User feedback collection
