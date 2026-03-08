# User Stories: Study Streak

## Analysis

Breaking down the PRD and UX specification into 12 implementable user stories. The core challenge is maintaining the dependency chain: subjects must exist before study logs, study logs before streak calculation, and the home dashboard depends on both. Stories are sliced thin (2-3 days each) and ordered by priority and dependency.

---

## P0 Stories (Must Have)

### STREAK-001: Subject Management - Add Subject
**As a** student  
**I want to** add a new subject with a name, color, and icon  
**So that** I can track my study streaks for different courses

**Acceptance Criteria:**
- Given I am on the subject creation screen, when I enter a name (2-50 characters) and select a color from 8 presets, then the subject is saved
- Given I try to add a subject with less than 2 characters, when I tap save, then I see an error message "En az 2 karakter gerekli"
- Given I already have 10 subjects, when I try to add another, then I see a message "En fazla 10 ders eklenebilir"
- Given I add a subject, when the save is successful, then I am returned to the home screen and see the new subject card

**Dependencies:** None

**Implementation Boundary:**
- In scope: Subject form UI, validation, AsyncStorage persistence, color picker
- Out of scope: Icon selection (use default), subject editing/deletion

**UX Flow Reference:** Onboarding Flow - Step 2, Home Dashboard

**PRD Coverage:** PR-001

---

### STREAK-002: Study Log Entry - Basic Recording
**As a** student  
**I want to** record my study session duration for a specific subject  
**So that** I can track my daily progress

**Acceptance Criteria:**
- Given I select a subject and enter a duration, when the duration is 15 minutes or more, then the study log is saved
- Given I enter a duration less than 15 minutes, when I try to save, then I see "En az 15 dakika gerekli" and cannot save
- Given I save a study log, when it is successful, then I see a success toast and the home screen updates
- Given I am offline, when I save a study log, then it is queued locally and shows "Çevrimdışı kaydedildi"

**Dependencies:** STREAK-001 (subjects must exist)

**Implementation Boundary:**
- In scope: Duration input UI (number pad + presets), validation, AsyncStorage, offline queue
- Out of scope: Date selection (default to today only), notes, editing logs

**UX Flow Reference:** Daily Study Log Entry Flow

**PRD Coverage:** PR-002, PR-005

---

### STREAK-003: Streak Calculation Engine
**As a** student  
**I want to** see my consecutive study days (streak) for each subject  
**So that** I stay motivated to maintain my study habit

**Acceptance Criteria:**
- Given I have study logs for consecutive days, when I view a subject, then the streak count shows the number of consecutive days
- Given I miss a day (no log for a subject), when I view that subject the next day, then the streak resets to 0
- Given my streak increases, when the update happens, then I see a flame animation celebration
- Given I have multiple subjects, when I view the home screen, then each subject shows its own independent streak count

**Dependencies:** STREAK-002 (study logs must exist)

**Implementation Boundary:**
- In scope: Streak calculation algorithm, streak display UI, celebration animation
- Out of scope: Streak freeze (P1), streak history beyond current

**UX Flow Reference:** Home Dashboard, Subject Detail

**PRD Coverage:** PR-003, PR-004

---

### STREAK-004: Home Dashboard - Subject Grid
**As a** student  
**I want to** see all my subjects with their current streaks on one screen  
**So that** I can quickly check my progress at a glance

**Acceptance Criteria:**
- Given I have subjects, when I open the app, then I see a 2-column grid of subject cards
- Given a subject card, when I view it, then I see: subject name, color indicator, streak count with flame icon, today's status
- Given I tap a subject card, when the tap is registered, then I navigate to the subject detail screen
- Given I have no subjects, when I open the app, then I see an empty state with "İlk Dersini Ekle" CTA

**Dependencies:** STREAK-001, STREAK-003

**Implementation Boundary:**
- In scope: Grid layout, subject card component, empty state, navigation
- Out of scope: Today's summary stats, pull-to-refresh, widget

**UX Flow Reference:** Home Dashboard Flow

**PRD Coverage:** PR-004

---

### STREAK-005: Daily Reminder Notifications
**As a** student  
**I want to** receive a daily notification reminding me to study  
**So that** I don't forget to maintain my streak

**Acceptance Criteria:**
- Given I enable notifications and set a time, when that time arrives daily, then I receive a "Bugün çalışma yapmayı unutma!" notification
- Given I disable notifications, when the scheduled time arrives, then no notification is shown
- Given I change the reminder time, when I save the new time, then the notification schedule updates
- Given notification permission is denied, when I try to enable reminders, then I see a message explaining how to enable in settings

**Dependencies:** None

**Implementation Boundary:**
- In scope: Notification toggle, time picker, Expo Local Notifications integration, permission handling
- Out of scope: Multiple reminders, custom notification messages

**UX Flow Reference:** Onboarding Flow - Step 3, Settings

**PRD Coverage:** PR-006

---

### STREAK-006: Exam Mode - Countdown Setup
**As a** student preparing for an exam  
**I want to** add an exam with a date and see a countdown  
**So that** I can plan my study schedule accordingly

**Acceptance Criteria:**
- Given I enter an exam name and select a future date, when I save, then the exam appears with "X gün kaldı" countdown
- Given I try to select a past date, when I attempt to save, then I see "Geçmiş tarih seçilemez" error
- Given I have an active exam, when I view the home screen, then I see the exam countdown badge
- Given the exam date passes, when I open the app, then the exam is marked as completed/archived

**Dependencies:** STREAK-001 (subjects should exist first)

**Implementation Boundary:**
- In scope: Exam form, date validation, countdown display, home badge
- Out of scope: Auto study plan calculation, exam-specific goals

**UX Flow Reference:** Exam Mode Flow

**PRD Coverage:** PR-007

---

## P1 Stories (Should Have)

### STREAK-101: Subject Detail View
**As a** student  
**I want to** view detailed progress for a specific subject including history  
**So that** I can analyze my study patterns

**Acceptance Criteria:**
- Given I tap a subject, when the detail screen opens, then I see: subject header, current streak, longest streak, total study time
- Given I view the calendar, when I look at past days, then study days are highlighted with intensity based on duration
- Given I view recent sessions, when I scroll, then I see the last 10 sessions with date, duration, and note preview
- Given I tap "Bugün Çalıştım", when the action completes, then I am taken to the study log entry with subject pre-selected

**Dependencies:** STREAK-002, STREAK-003, STREAK-004

**Implementation Boundary:**
- In scope: Detail screen UI, calendar heatmap, session list
- Out of scope: Editing/deleting past logs, full history (limit to 10)

**UX Flow Reference:** Subject Detail Flow

**PRD Coverage:** PR-003, PR-004

---

### STREAK-102: Study Log with Notes
**As a** student  
**I want to** add a note to my study session  
**So that** I can remember what I studied

**Acceptance Criteria:**
- Given I am recording a study session, when I expand "Not ekle", then I can type up to 280 characters
- Given I enter more than 280 characters, when I type, then the input is blocked and I see the character count in red
- Given I save a study log with a note, when I view the session history, then I see the note preview (first 50 chars)

**Dependencies:** STREAK-002

**Implementation Boundary:**
- In scope: Collapsible note input, character counter, storage
- Out of scope: Rich text, attachments

**UX Flow Reference:** Daily Study Log Entry Flow

**PRD Coverage:** PR-103

---

### STREAK-103: Streak Freeze (Recovery)
**As a** student  
**I want to** use a "freeze" once per week to save my streak if I miss a day  
**So that** occasional missed days don't break my motivation

**Acceptance Criteria:**
- Given I haven't used my freeze this week, when I miss a day, then I see an option to "Streak'i Koru (Freeze)"
- Given I use my freeze, when the action completes, then my streak is maintained and the freeze count resets for next week
- Given I have already used my freeze this week, when I miss another day, then my streak resets to 0
- Given I view my subject, when I have a freeze available, then I see a freeze badge/icon

**Dependencies:** STREAK-003

**Implementation Boundary:**
- In scope: Freeze logic, weekly reset, UI indicators
- Out of scope: Purchasing additional freezes, freeze history

**UX Flow Reference:** Subject Detail, Streak notifications

**PRD Coverage:** PR-102

---

### STREAK-104: Data Export/Import
**As a** student  
**I want to** export my data to a file and import it later  
**So that** I can backup my progress or transfer to a new device

**Acceptance Criteria:**
- Given I go to settings, when I tap "Verileri Dışa Aktar", then a JSON file is generated and shared via system share sheet
- Given I have an export file, when I tap "Verileri İçe Aktar" and select the file, then my data is restored
- Given I import data, when the import completes, then I see a confirmation with the number of subjects and logs restored
- Given the import file is invalid, when I try to import, then I see an error message and no data is changed

**Dependencies:** None (can work with existing data)

**Implementation Boundary:**
- In scope: JSON export/import, file sharing, validation
- Out of scope: Cloud sync, automatic backup

**UX Flow Reference:** Settings Flow

**PRD Coverage:** PR-105

---

## P2 Stories (Nice to Have)

### STREAK-201: Statistics Dashboard
**As a** student  
**I want to** see weekly and monthly statistics with charts  
**So that** I can visualize my study trends

**Acceptance Criteria:**
- Given I view statistics, when I select weekly view, then I see a bar chart of daily study durations for the past 7 days
- Given I view statistics, when I select monthly view, then I see total hours per subject for the current month
- Given I have no data for a period, when I view statistics, then I see an empty state message

**Dependencies:** STREAK-002, STREAK-101

**Implementation Boundary:**
- In scope: Basic charts (bar/pie), weekly/monthly toggles
- Out of scope: Custom date ranges, advanced analytics

**UX Flow Reference:** Subject Detail (extended)

**PRD Coverage:** PR-101

---

### STREAK-202: Widget Support
**As a** student  
**I want to** see my streak count on my home screen via a widget  
**So that** I can stay motivated without opening the app

**Acceptance Criteria:**
- Given I add a widget, when I place it on my home screen, then it displays my top subject's streak count
- Given my streak changes, when the app updates, then the widget refreshes within 15 minutes
- Given I tap the widget, when the action completes, then the app opens to the home screen

**Dependencies:** STREAK-003, STREAK-004

**Implementation Boundary:**
- In scope: iOS 14+ widget, Android 12+ widget, basic streak display
- Out of scope: Interactive widgets, multiple widget sizes

**UX Flow Reference:** Widget (system)

**PRD Coverage:** PR-104

---

## Coverage Map

| PRD Requirement | Story IDs | Status |
|-----------------|-----------|--------|
| PR-001 (Add subjects) | STREAK-001 | P0 |
| PR-002 (Study log entry) | STREAK-002, STREAK-102 | P0, P1 |
| PR-003 (Streak calculation) | STREAK-003, STREAK-103 | P0, P1 |
| PR-004 (Home dashboard) | STREAK-004, STREAK-101 | P0, P1 |
| PR-005 (Offline-first) | STREAK-002 | P0 |
| PR-006 (Notifications) | STREAK-005 | P0 |
| PR-007 (Exam mode) | STREAK-006 | P0 |
| PR-101 (Statistics) | STREAK-201 | P2 |
| PR-102 (Streak freeze) | STREAK-103 | P1 |
| PR-103 (Notes) | STREAK-102 | P1 |
| PR-104 (Widget) | STREAK-202 | P2 |
| PR-105 (Data export) | STREAK-104 | P1 |

---

## UX Flow Coverage

| UX Flow | Story IDs |
|---------|-----------|
| Onboarding | STREAK-001, STREAK-005 |
| Daily Study Log Entry | STREAK-002, STREAK-102 |
| Home Dashboard | STREAK-004, STREAK-006 |
| Subject Detail | STREAK-101, STREAK-003, STREAK-103 |
| Exam Mode | STREAK-006 |
| Settings | STREAK-005, STREAK-104 |

---

## Implementation Order

### Sprint 1 (Foundation)
1. STREAK-001: Subject Management
2. STREAK-002: Study Log Entry
3. STREAK-003: Streak Calculation

### Sprint 2 (Core Experience)
4. STREAK-004: Home Dashboard
5. STREAK-005: Notifications
6. STREAK-006: Exam Mode

### Sprint 3 (Enhancement)
7. STREAK-101: Subject Detail
8. STREAK-102: Notes
9. STREAK-103: Streak Freeze

### Sprint 4 (Polish)
10. STREAK-104: Data Export
11. STREAK-201: Statistics
12. STREAK-202: Widget

---

## Summary (for downstream agents)

```yaml
feature: "Study Streak - User Stories"
total_stories: 12
p0_stories: 6
p1_stories: 4
p2_stories: 2
critical_path:
  - STREAK-001 (subjects)
  - STREAK-002 (study logs)
  - STREAK-003 (streak calculation)
  - STREAK-004 (home dashboard)
prd_coverage:
  complete: [PR-001, PR-002, PR-003, PR-004, PR-005, PR-006, PR-007]
  partial: []
  missing: [PR-201-205 (P2 social/achievements)]
ux_flow_coverage:
  complete: ["Onboarding", "Daily Study Log", "Home Dashboard", "Subject Detail", "Exam Mode", "Settings"]
open_questions:
  - "Should we allow editing/deleting past study logs?"
  - "What happens when user reaches max streak (display limit)?"
  - "Should exam mode integrate with study log suggestions?"
```

---

## Handoff Contract

**Next Agent**: `task-planner`

**Required Artifacts**:
- `docs/product-delegated-context2/stories.md` (this document)
- `docs/product-delegated-context2/prd.md`
- `docs/product-delegated-context2/ux.md`

**Recommended Artifacts**:
- `docs/product-delegated-context2/brainstorm.md`

**Critical Inputs**:
- 12 stories ordered by priority and dependency
- PRD requirement IDs mapped to each story
- UX flow references for each story
- Implementation boundaries defined

**Sections That Must Not Change**:
- Story IDs (stable identifiers)
- Acceptance criteria intent
- PRD coverage mappings
- Dependencies

**Mapping Rules**:
- Each story becomes 1+ implementation tasks
- P0 stories must be completed before P1
- Acceptance criteria become test cases
- Implementation boundaries guide task scoping

**Notes for Task Planner**:
- STREAK-001 through STREAK-006 form the MVP core
- STREAK-003 (streak calculation) is the most complex - consider breaking into sub-tasks
- Offline-first requirement in STREAK-002 affects architecture decisions
- Exam mode (STREAK-006) can be deferred to Sprint 2 if needed
