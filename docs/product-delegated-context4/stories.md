# Study Streak - User Stories

## Overview

This document contains comprehensive user stories for the Study Streak mobile application. Each story includes acceptance criteria and maps to PRD requirements.

---

## Story ID Convention

- `US-XXX`: Core user stories
- `US-AUTH-XXX`: Authentication stories
- `US-TIMER-XXX`: Study timer stories
- `US-SUBJ-XXX`: Subject management stories
- `US-STREAK-XXX`: Streak tracking stories
- `US-PROG-XXX`: Progress/stats stories
- `US-NOTIF-XXX`: Notification stories
- `US-SET-XXX`: Settings stories

---

## Epic: Authentication & Onboarding

### US-AUTH-001: Anonymous Guest Access
**As a** new user  
**I want to** use the app without creating an account  
**So that** I can try the app before committing to sign-up  

**Acceptance Criteria:**
- [ ] App launches in guest mode without requiring credentials
- [ ] All core features (timer, streaks, subjects) work in guest mode
- [ ] Guest data is stored locally on device
- [ ] User sees persistent banner prompting account creation
- [ ] Tapping banner or attempting sync shows account upgrade flow
- [ ] Guest data persists until user explicitly logs out or deletes app

**PRD Mapping:** PR-009

---

### US-AUTH-002: Email/Password Sign Up
**As a** guest user  
**I want to** create a permanent account with email and password  
**So that** my data is backed up and accessible across devices  

**Acceptance Criteria:**
- [ ] Sign-up form requires valid email and password (min 8 chars, 1 uppercase, 1 number)
- [ ] Email validation shows inline error for invalid format
- [ ] Password strength indicator displays during entry
- [ ] Successful sign-up triggers email verification
- [ ] Existing local data syncs to new account automatically
- [ ] User is logged in immediately after successful creation

**PRD Mapping:** PR-009

---

### US-AUTH-003: Google OAuth Sign In
**As a** user  
**I want to** sign in with my Google account  
**So that** I don't need to remember another password  

**Acceptance Criteria:**
- [ ] "Sign in with Google" button appears on auth screens
- [ ] Tapping button opens Google OAuth flow
- [ ] Successful OAuth creates/links account automatically
- [ ] Existing guest data merges with Google account if upgrading
- [ ] User can unlink Google and set password later

**PRD Mapping:** PR-009

---

### US-AUTH-004: Login to Existing Account
**As a** returning user  
**I want to** log in with my existing credentials  
**So that** I can access my study data on a new device  

**Acceptance Criteria:**
- [ ] Login form accepts email and password
- [ ] Incorrect credentials show generic error (security)
- [ ] Successful login triggers data sync from cloud
- [ ] Local data merges intelligently with cloud data (newer wins)
- [ ] User sees sync progress indicator
- [ ] Failed sync shows retry option and offline mode

**PRD Mapping:** PR-009, PR-010

---

### US-AUTH-005: Password Reset
**As a** user who forgot my password  
**I want to** reset my password via email  
**So that** I can regain access to my account  

**Acceptance Criteria:**
- [ ] "Forgot Password" link on login screen
- [ ] Email input validates format before submission
- [ ] Success message shows regardless of email existence (security)
- [ ] Reset link in email expires after 24 hours
- [ ] New password must differ from old password
- [ ] Successful reset logs user in automatically

**PRD Mapping:** PR-009

---

### US-AUTH-006: Onboarding Flow
**As a** first-time user  
**I want to** be guided through app setup  
**So that** I understand how to use the app effectively  

**Acceptance Criteria:**
- [ ] 4-screen onboarding: Welcome → Subject Setup → Notifications → First Session Demo
- [ ] Welcome screen shows app value prop and "Get Started" CTA
- [ ] Subject Setup shows pre-populated subjects (Math, Science, History, Language)
- [ ] User can select/deselect pre-populated subjects
- [ ] User can add custom subjects during onboarding
- [ ] Notification screen explains benefits before requesting permission
- [ ] First Session Demo shows timer controls with overlay hints
- [ ] User can skip onboarding at any point
- [ ] Onboarding only shows once (stored in preferences)

**PRD Mapping:** PR-108

---

## Epic: Subject Management

### US-SUBJ-001: Create New Subject
**As a** user  
**I want to** create a new study subject  
**So that** I can track my progress in different areas  

**Acceptance Criteria:**
- [ ] "Add Subject" button accessible from Home and Subjects tab
- [ ] Subject name required (max 30 characters)
- [ ] Name field shows character count
- [ ] Duplicate names not allowed (case-insensitive)
- [ ] User can select color from 12 preset options
- [ ] User can select icon from 20 preset options
- [ ] Subject appears immediately in subject list
- [ ] New subject starts with 0-day streak
- [ ] Maximum 10 subjects allowed (shows upgrade message at limit)

**PRD Mapping:** PR-002

---

### US-SUBJ-002: View Subject List
**As a** user  
**I want to** see all my subjects  
**So that** I can choose what to study  

**Acceptance Criteria:**
- [ ] Subjects tab shows grid/list of all subjects
- [ ] Each subject card shows: icon, name, current streak, today's status
- [ ] Subjects sorted by: active streak (desc), then alphabetically
- [ ] Pull-to-refresh updates streak status
- [ ] Empty state shows when no subjects exist
- [ ] Quick-filter by "Studied Today" / "Not Studied Today"

**PRD Mapping:** PR-002, PR-007

---

### US-SUBJ-003: Edit Subject
**As a** user  
**I want to** edit a subject's details  
**So that** I can keep my subjects organized  

**Acceptance Criteria:**
- [ ] Long-press or swipe-left on subject shows edit option
- [ ] Can modify name (same validation as create)
- [ ] Can change color and icon
- [ ] Can archive subject (hides from active list, preserves history)
- [ ] Cannot edit subject during active timer session
- [ ] Changes reflect immediately across app

**PRD Mapping:** PR-002

---

### US-SUBJ-004: Delete Subject
**As a** user  
**I want to** delete a subject I no longer need  
**So that** my subject list stays relevant  

**Acceptance Criteria:**
- [ ] Delete option in subject edit screen
- [ ] Confirmation dialog warns: "This will delete all history for [Subject Name]"
- [ ] User must type subject name to confirm deletion
- [ ] Deleted subject sessions remain in overall stats
- [ ] Undo option available for 5 seconds after deletion
- [ ] Cannot delete subject with active timer session

**PRD Mapping:** PR-002

---

### US-SUBJ-005: View Subject Detail
**As a** user  
**I want to** see detailed progress for a specific subject  
**So that** I can understand my study patterns  

**Acceptance Criteria:**
- [ ] Tapping subject card opens detail screen
- [ ] Header shows: icon, name, current streak (large), longest streak record
- [ ] Calendar view shows last 3 months with study days highlighted
- [ ] Session history list shows: date, duration, optional note
- [ ] History filterable by date range
- [ ] Study goal progress shown as progress bar
- [ ] Edit and delete options accessible from detail screen

**PRD Mapping:** PR-002, PR-104

---

## Epic: Study Timer

### US-TIMER-001: Start Study Session
**As a** user  
**I want to** start a timed study session  
**So that** I can track my study time  

**Acceptance Criteria:**
- [ ] "Start Studying" CTA prominent on Home screen
- [ ] Tapping shows subject selection modal
- [ ] Selecting subject opens Timer screen
- [ ] Timer starts at 00:00 and counts up
- [ ] Subject name displayed at top of timer screen
- [ ] Current streak for subject shown below timer
- [ ] Large circular progress indicator fills as time increases
- [ ] Session logs after 5+ minutes count toward streak

**PRD Mapping:** PR-001, PR-003

---

### US-TIMER-002: Pause and Resume Session
**As a** user  
**I want to** pause my study session  
**So that** I can take breaks without losing progress  

**Acceptance Criteria:**
- [ ] Pause button available during active session
- [ ] Tapping pause stops timer and shows "Paused" state
- [ ] Elapsed time frozen on display
- [ ] Resume button continues from paused time
- [ ] Session can be paused multiple times
- [ ] Total paused time does not count toward session duration
- [ ] Session auto-completes after 4 hours (prevents runaway timers)

**PRD Mapping:** PR-001

---

### US-TIMER-003: Complete Study Session
**As a** user  
**I want to** complete my study session  
**So that** my progress is recorded  

**Acceptance Criteria:**
- [ ] "Complete" button available during paused or active session
- [ ] Sessions under 5 minutes show warning: "Short session won't count toward streak"
- [ ] User can confirm or continue studying
- [ ] Sessions 5+ minutes show success screen
- [ ] Success screen shows: duration, streak update, celebration animation
- [ ] Session saved immediately to local storage
- [ ] Sync attempted if online and authenticated

**PRD Mapping:** PR-001, PR-003

---

### US-TIMER-004: Cancel Study Session
**As a** user  
**I want to** cancel my study session  
**So that** I can abandon a session without recording it  

**Acceptance Criteria:**
- [ ] Cancel button available during session
- [ ] Confirmation dialog: "Discard this session?"
- [ ] Canceling under 1 minute: no confirmation needed
- [ ] Canceling over 1 minute: requires confirmation
- [ ] Canceled sessions not saved to history
- [ ] User returned to previous screen

**PRD Mapping:** PR-001

---

### US-TIMER-005: Background Timer
**As a** user  
**I want to** keep my timer running when I leave the app  
**So that** I can use other apps during study sessions  

**Acceptance Criteria:**
- [ ] Timer continues counting when app backgrounded
- [ ] Persistent notification shows: elapsed time, subject, "Tap to return"
- [ ] Notification updates every minute
- [ ] Tapping notification returns to Timer screen
- [ ] Timer survives app kill (resumes on relaunch within 5 minutes)
- [ ] If app killed and not reopened within 5 minutes, session auto-completes

**PRD Mapping:** PR-001

---

### US-TIMER-006: Add Session Note
**As a** user  
**I want to** add a note after completing a session  
**So that** I can remember what I studied  

**Acceptance Criteria:**
- [ ] Optional note field appears after session completion
- [ ] Character limit: 140 characters
- [ ] Character counter shows remaining
- [ ] Note can be skipped with "Skip" button
- [ ] Note saved with session data
- [ ] Note visible in session history
- [ ] Note editable from session history

**PRD Mapping:** PR-103

---

## Epic: Streak Tracking

### US-STREAK-001: View Daily Streak Status
**As a** user  
**I want to** see my current streaks  
**So that** I know how consistent I've been  

**Acceptance Criteria:**
- [ ] Home screen shows longest active streak prominently
- [ ] Subject cards show individual streak counts
- [ ] Visual indicator shows if subject studied today (checkmark/flame)
- [ ] Streak numbers animate on update
- [ ] Pull-to-refresh updates streak status
- [ ] Streak counts persist across app restarts

**PRD Mapping:** PR-003, PR-007

---

### US-STREAK-002: Streak Day Boundary
**As a** user  
**I want to** understand when my streak day ends  
**So that** I can plan my study schedule  

**Acceptance Criteria:**
- [ ] Streak day defined as calendar day (00:00-23:59 local timezone)
- [ ] Studying any time during day counts for that day
- [ ] Day boundary shown in app (e.g., "Streak day ends at midnight")
- [ ] Timezone changes handled gracefully (travelers)
- [ ] Studying in either timezone counts if traveling across date line

**PRD Mapping:** PR-003, PR-105

---

### US-STREAK-003: Streak Break Notification
**As a** user  
**I want to** be notified when I break a streak  
**So that** I'm aware of my lapse  

**Acceptance Criteria:**
- [ ] If day ends with no study, streak resets to 0
- [ ] Next app open shows streak break message
- [ ] Message is encouraging, not shaming: "Streak broken, but every day is a fresh start!"
- [ ] Option to start new session immediately
- [ ] Streak break recorded in history (analytics only, not visible to user)

**PRD Mapping:** PR-003

---

### US-STREAK-004: Earn Streak Freeze
**As a** user  
**I want to** earn streak freezes for consistent use  
**So that** I have protection for missed days  

**Acceptance Criteria:**
- [ ] User earns 1 freeze per week (resets Monday 00:00)
- [ ] Freeze awarded after completing at least one 5+ min session
- [ ] Maximum 3 freezes can be accumulated
- [ ] Freeze count shown in app header/badge
- [ ] Notification when freeze is earned
- [ ] Freeze history visible in settings

**PRD Mapping:** PR-004

---

### US-STREAK-005: Use Streak Freeze
**As a** user  
**I want to** use a streak freeze when I miss a day  
**So that** I can maintain my streak during emergencies  

**Acceptance Criteria:**
- [ ] If user has freezes and misses a day, prompt to use freeze
- [ ] Prompt shows: "Use streak freeze to save your X-day streak?"
- [ ] User can accept or decline
- [ ] Using freeze maintains streak count
- [ ] Freeze count decrements by 1
- [ ] Freeze use recorded in streak history
- [ ] User can manually apply freeze retroactively within 48 hours

**PRD Mapping:** PR-004

---

### US-STREAK-006: Earn Milestone Badges
**As a** user  
**I want to** earn badges for streak milestones  
**So that** I feel rewarded for consistency  

**Acceptance Criteria:**
- [ ] Badges awarded at: 3, 7, 14, 30, 60, 100 days
- [ ] Badge names: 🌱 Getting Started (3), 🔥 Week Warrior (7), 📚 Fortnight Focus (14), 🏆 Monthly Master (30), 💎 Consistency King (60), 👑 Century Scholar (100)
- [ ] Full-screen celebration animation on badge earn
- [ ] Badge added to user's collection
- [ ] Share option available after earning
- [ ] Badge collection viewable in profile/stats
- [ ] Haptic feedback on milestone (if enabled)

**PRD Mapping:** PR-005

---

### US-STREAK-007: View Badge Collection
**As a** user  
**I want to** see all my earned badges  
**So that** I can feel proud of my achievements  

**Acceptance Criteria:**
- [ ] Badge collection accessible from Stats or Profile
- [ ] Earned badges shown in full color
- [ ] Locked badges shown grayed with requirement
- [ ] Tapping badge shows details: name, description, date earned
- [ ] Progress shown toward next milestone
- [ ] Share button for each earned badge

**PRD Mapping:** PR-005

---

## Epic: Progress & Stats

### US-PROG-001: View Today's Summary
**As a** user  
**I want to** see my study summary for today  
**So that** I know how much I've studied  

**Acceptance Criteria:**
- [ ] Home screen shows today's summary card
- [ ] Displays: total study time, subjects studied count, longest active streak
- [ ] Updates in real-time as sessions complete
- [ ] Compares to daily goal (if set) with progress bar
- [ ] Tapping summary opens detailed day view
- [ ] Summary persists until next calendar day

**PRD Mapping:** PR-007

---

### US-PROG-002: View Weekly Stats
**As a** user  
**I want to** see my study patterns over the week  
**So that** I can identify trends  

**Acceptance Criteria:**
- [ ] Stats tab shows weekly view by default
- [ ] Bar chart shows study time per day (last 7 days)
- [ ] Total hours this week displayed prominently
- [ ] Week-over-week comparison (e.g., "+2.5 hours vs last week")
- [ ] Most studied subject highlighted
- [ ] Days with no study visually distinct
- [ ] Swipe to see previous weeks

**PRD Mapping:** PR-007, PR-101

---

### US-PROG-003: View Monthly Stats
**As a** user  
**I want to** see my long-term study patterns  
**So that** I can track my overall progress  

**Acceptance Criteria:**
- [ ] Monthly view accessible from Stats tab
- [ ] Calendar heatmap (GitHub-style contribution graph)
- [ ] Color intensity based on study duration
- [ ] Total hours this month displayed
- [ ] Longest streak achieved this month
- [ ] Subject breakdown pie chart
- [ ] Swipe to see previous months

**PRD Mapping:** PR-007

---

### US-PROG-004: Generate Weekly Report
**As a** user  
**I want to** receive a weekly summary of my study  
**So that** I can review my progress  

**Acceptance Criteria:**
- [ ] Weekly report generated every Sunday
- [ ] Report includes: total hours, most studied subject, longest streak, week-over-week comparison
- [ ] Report appears in app and as notification
- [ ] Report is shareable as image
- [ ] Beautiful, visually appealing design
- [ ] Option to disable weekly reports in settings

**PRD Mapping:** PR-101

---

### US-PROG-005: Share Weekly Report
**As a** user  
**I want to** share my weekly report  
**So that** I can celebrate my progress with others  

**Acceptance Criteria:**
- [ ] Share button on weekly report screen
- [ ] Generates image optimized for social media
- [ ] Image includes: app branding, week stats, streak highlight
- [ ] Native share sheet opens with image
- [ ] Caption pre-populated: "I studied X hours this week! 📚🔥"
- [ ] User can edit caption before sharing

**PRD Mapping:** PR-101

---

### US-PROG-006: View Session History
**As a** user  
**I want to** see all my past study sessions  
**So that** I can review what I've accomplished  

**Acceptance Criteria:**
- [ ] Session history accessible from Stats or Subject detail
- [ ] List shows: date, time, duration, subject, note preview
- [ ] Grouped by date (Today, Yesterday, This Week, Earlier)
- [ ] Filterable by subject
- [ ] Filterable by date range (Last 7 days, Last 30 days, All time)
- [ ] Searchable by note content
- [ ] Pull-to-refresh updates
- [ ] Empty state when no sessions exist

**PRD Mapping:** PR-104

---

### US-PROG-007: Set Study Goals
**As a** user  
**I want to** set daily and weekly study goals  
**So that** I have targets to work toward  

**Acceptance Criteria:**
- [ ] Goal settings in Settings or Stats tab
- [ ] Daily goal: 15-480 minutes (slider or number input)
- [ ] Weekly goal: 1-40 hours (slider or number input)
- [ ] Progress shown on Home screen
- [ ] Goal completion triggers celebration
- [ ] Badge earned for first goal completion
- [ ] Goals can be modified anytime
- [ ] Default goals suggested during onboarding

**PRD Mapping:** PR-102

---

## Epic: Notifications

### US-NOTIF-001: Daily Reminder Notification
**As a** user  
**I want to** receive a daily reminder to study  
**So that** I don't forget to maintain my streak  

**Acceptance Criteria:**
- [ ] User can set daily reminder time (default: 19:00)
- [ ] Notification delivered at set time if no study logged yet
- [ ] Notification text: "Time to study! Keep your streak going 🔥"
- [ ] Tapping notification opens app to subject selection
- [ ] Reminder can be turned off in settings
- [ ] Multiple reminder times can be set (up to 3)

**PRD Mapping:** PR-008

---

### US-NOTIF-002: Streak Risk Warning
**As a** user  
**I want to** be warned when my streak is at risk  
**So that** I have a last chance to save it  

**Acceptance Criteria:**
- [ ] Warning sent at 21:00 if no study logged that day
- [ ] Warning shows current streak count
- [ ] Notification text: "Your X-day streak ends in 3 hours! Study now to keep it alive 🔥"
- [ ] Tapping notification opens app with quick-start timer
- [ ] Warning can be turned off in settings
- [ ] No warning sent if user has streak freeze available

**PRD Mapping:** PR-008

---

### US-NOTIF-003: Session Completion Notification
**As a** user  
**I want to** receive a notification when I complete a session  
**So that** I get immediate positive feedback  

**Acceptance Criteria:**
- [ ] Notification appears immediately after session complete
- [ ] Shows session duration and streak update
- [ ] Celebration emoji and encouraging message
- [ ] Auto-dismisses after 5 seconds
- [ ] Can be turned off in settings

**PRD Mapping:** PR-008

---

### US-NOTIF-004: Badge Earned Notification
**As a** user  
**I want to** be notified when I earn a badge  
**So that** I can celebrate my achievement  

**Acceptance Criteria:**
- [ ] Notification appears immediately on badge earn
- [ ] Shows badge icon and name
- [ ] Text: "You earned the [Badge Name] badge! 🎉"
- [ ] Tapping notification opens badge collection
- [ ] Special sound/haptic (if enabled)

**PRD Mapping:** PR-005, PR-008

---

### US-NOTIF-005: Freeze Earned Notification
**As a** user  
**I want to** be notified when I earn a streak freeze  
**So that** I know my protection is available  

**Acceptance Criteria:**
- [ ] Notification sent when weekly freeze is earned
- [ ] Shows current freeze count
- [ ] Text: "You earned a streak freeze! Your streak is protected 🛡️"
- [ ] Delivered on Monday after first weekly session

**PRD Mapping:** PR-004, PR-008

---

### US-NOTIF-006: Configure Notification Settings
**As a** user  
**I want to** customize which notifications I receive  
**So that** I'm not overwhelmed with alerts  

**Acceptance Criteria:**
- [ ] Notification settings in Settings tab
- [ ] Toggle for each notification type
- [ ] Daily reminder time picker
- [ ] Streak risk warning toggle
- [ ] Session completion toggle
- [ ] Badge earned toggle
- [ ] Freeze earned toggle
- [ ] "Turn off all" option with confirmation
- [ ] Settings persist across app restarts

**PRD Mapping:** PR-008

---

## Epic: Settings & Preferences

### US-SET-001: View Settings
**As a** user  
**I want to** access app settings  
**So that** I can customize my experience  

**Acceptance Criteria:**
- [ ] Settings tab accessible from bottom navigation
- [ ] Settings organized in sections: Account, Notifications, Study, Data, App
- [ ] Each setting shows current value
- [ ] Back navigation returns to previous screen
- [ ] Settings load without delay

**PRD Mapping:** PR-008

---

### US-SET-002: Manage Account
**As a** user  
**I want to** manage my account settings  
**So that** I can keep my profile up to date  

**Acceptance Criteria:**
- [ ] Account section in Settings
- [ ] Shows: email, sync status, last sync time
- [ ] Option to change password
- [ ] Option to link/unlink Google
- [ ] Option to upgrade from guest to permanent account
- [ ] Logout option with confirmation
- [ ] Delete account option with confirmation (requires password)

**PRD Mapping:** PR-009

---

### US-SET-003: Toggle Dark Mode
**As a** user  
**I want to** switch between light and dark themes  
**So that** the app is comfortable to use at night  

**Acceptance Criteria:**
- [ ] Dark mode toggle in Settings → App
- [ ] Options: Light, Dark, System Default
- [ ] Theme applies immediately without restart
- [ ] OLED black option available in dark mode
- [ ] All screens support dark mode
- [ ] Theme preference persists across sessions

**PRD Mapping:** PR-201

---

### US-SET-004: Configure Haptic Feedback
**As a** user  
**I want to** control haptic feedback  
**So that** I can save battery or avoid distractions  

**Acceptance Criteria:**
- [ ] Haptic settings in Settings → App
- [ ] Toggle for haptic feedback on/off
- [ ] When on: haptic on button press, session complete, milestone
- [ ] When off: no haptic feedback
- [ ] Default: on
- [ ] Respects system "Reduce Motion" setting

**PRD Mapping:** PR-107

---

### US-SET-005: Export Study Data
**As a** user  
**I want to** export my study data  
**So that** I can analyze it elsewhere  

**Acceptance Criteria:**
- [ ] Export option in Settings → Data
- [ ] Export format: CSV
- [ ] CSV includes: date, duration, subject, note
- [ ] Export all data or filter by date range
- [ ] File saved to device Downloads
- [ ] Share sheet option to send via email/apps

**PRD Mapping:** PR-204

---

### US-SET-006: View App Information
**As a** user  
**I want to** see app version and credits  
**So that** I know what version I'm using  

**Acceptance Criteria:**
- [ ] About section in Settings → App
- [ ] Shows: app version, build number
- [ ] Links to: Privacy Policy, Terms of Service
- [ ] Credits/Attributions for open source libraries
- [ ] Contact support option

**PRD Mapping:** N/A

---

## Epic: Offline & Sync

### US-OFFLINE-001: Use App Offline
**As a** user  
**I want to** use the app without internet  
**So that** I can track study sessions anywhere  

**Acceptance Criteria:**
- [ ] All core features work without internet connection
- [ ] Timer functions normally offline
- [ ] Sessions saved to local SQLite database
- [ ] Streaks calculated from local data
- [ ] Subject management works offline
- [ ] Visual indicator shows offline status
- [ ] No error messages for normal offline use

**PRD Mapping:** PR-006, PR-010

---

### US-OFFLINE-002: Sync When Online
**As a** user  
**I want to** my data to sync when I'm back online  
**So that** my progress is backed up  

**Acceptance Criteria:**
- [ ] App detects when connection restored
- [ ] Automatic sync triggered when online
- [ ] Sync progress indicator shown
- [ ] Conflicts resolved by "newer wins" rule
- [ ] User notified of sync completion
- [ ] Failed sync shows retry option
- [ ] Manual sync option in Settings

**PRD Mapping:** PR-010

---

## Summary

### Story Count by Epic

| Epic | Story Count |
|------|-------------|
| Authentication & Onboarding | 6 |
| Subject Management | 5 |
| Study Timer | 6 |
| Streak Tracking | 7 |
| Progress & Stats | 7 |
| Notifications | 6 |
| Settings & Preferences | 6 |
| Offline & Sync | 2 |
| **Total** | **45** |

### PRD Coverage

| PRD Requirement | Covered By |
|-----------------|------------|
| PR-001 | US-TIMER-001, US-TIMER-002, US-TIMER-003, US-TIMER-004, US-TIMER-005 |
| PR-002 | US-SUBJ-001, US-SUBJ-002, US-SUBJ-003, US-SUBJ-004, US-SUBJ-005 |
| PR-003 | US-STREAK-001, US-STREAK-002, US-STREAK-003, US-TIMER-001 |
| PR-004 | US-STREAK-004, US-STREAK-005, US-NOTIF-005 |
| PR-005 | US-STREAK-006, US-STREAK-007, US-NOTIF-004 |
| PR-006 | US-OFFLINE-001 |
| PR-007 | US-PROG-001, US-PROG-002, US-PROG-003, US-SUBJ-002 |
| PR-008 | US-NOTIF-001, US-NOTIF-002, US-NOTIF-003, US-NOTIF-004, US-NOTIF-005, US-NOTIF-006 |
| PR-009 | US-AUTH-001, US-AUTH-002, US-AUTH-003, US-AUTH-004, US-AUTH-005, US-SET-002 |
| PR-010 | US-AUTH-004, US-OFFLINE-001, US-OFFLINE-002 |
| PR-101 | US-PROG-004, US-PROG-005 |
| PR-102 | US-PROG-007 |
| PR-103 | US-TIMER-006 |
| PR-104 | US-SUBJ-005, US-PROG-006 |
| PR-105 | US-STREAK-002 |
| PR-106 | (Technical - app icon badge) |
| PR-107 | US-SET-004 |
| PR-108 | US-AUTH-006 |
| PR-201 | US-SET-003 |
| PR-204 | US-SET-005 |

### Handoff Contract

**Next Agent**: `task-planner`

**Required Artifacts**:
- `docs/product-delegated-context4/stories.md` (this document)
- `docs/product-delegated-context4/prd.md`
- `docs/product-delegated-context4/ux.md`

**Critical Inputs**:
- 45 user stories covering all P0 and P1 requirements
- Each story has acceptance criteria
- PRD requirement IDs preserved for traceability
- Stories organized by epic/feature area

**Sections That Must Not Change**:
- Story ID format and existing IDs
- Acceptance criteria structure
- PRD requirement mappings

**Key Decisions for Task Planning**:
- Story prioritization (P0 stories first)
- Story grouping into development sprints
- Technical task breakdown per story
- Dependency mapping between stories
