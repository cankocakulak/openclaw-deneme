# UX Specification: Study Streak

## Analysis

The UX challenge is designing an interface that motivates students without creating toxic productivity pressure. The app must balance "streak anxiety" with positive reinforcement, while handling multiple subjects simultaneously on a small mobile screen. Students need quick entry (they're busy) but also meaningful progress visibility.

---

## Visual Direction

### Design Philosophy
- **Warm and encouraging**, not punitive
- **Clean and focused**, minimal cognitive load
- **Gamified but respectful**, streaks as celebration not obligation

### Color Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Warm Orange | `#F97316` | CTAs, streak flames, highlights |
| Secondary | Calm Blue | `#3B82F6` | Subject cards, stable elements |
| Success | Emerald Green | `#10B981` | Completed states, confirmations |
| Warning | Amber | `#F59E0B` | Streak at risk, freeze remaining |
| Danger | Rose | `#F43F5E` | Streak broken (use sparingly) |
| Background | Off-White | `#FAFAF9` | Main background |
| Surface | Pure White | `#FFFFFF` | Cards, modals |
| Text Primary | Slate 900 | `#0F172A` | Headings, primary text |
| Text Secondary | Slate 500 | `#64748B` | Subtext, placeholders |

### Typography
- **Primary Font**: System default (San Francisco / Roboto)
- **Heading Sizes**: 28px (H1), 22px (H2), 18px (H3)
- **Body**: 16px regular, 14px secondary
- **Streak Numbers**: 48px bold (hero display)

### Iconography
- **Library**: Phosphor Icons (bold weight)
- **Streak Icon**: Flame (`Phosphor.Flame`)
- **Subject Icons**: Book, Calculator, Flask, Palette, etc.
- **Action Icons**: Plus, Check, Calendar, Bell

### Animation Principles
- **Streak increment**: Scale up + flame flicker (300ms, Reanimated)
- **Card press**: Scale 0.98 + shadow reduction
- **Success state**: Confetti burst on milestone (7, 30, 100 days)
- **Page transitions**: Slide from right (iOS style)

---

## Primary Flows

### Flow 1: Onboarding (First Launch)

**User Goal**: Set up the app and add first subject

**Trigger**: App first launch after install

**Steps**:
1. **Welcome Screen**
   - Headline: "Çalışma Alışkanlığını Oluştur"
   - Subtext: "Her gün bir adım, her ders bir zafer"
   - CTA Button: "Başlayalım" (Primary, full width)
   - Skip option: "Daha sonra" (text link, bottom)

2. **Add First Subject**
   - Screen title: "İlk Dersini Ekle"
   - Input field: "Ders adı" (placeholder: "Matematik, Fizik...")
   - Color picker: 8 preset colors (circular selection)
   - Icon picker: 8 subject icons (grid selection)
   - CTA: "Ekle ve Devam Et"
   - Validation: Minimum 2 characters

3. **Notification Setup**
   - Screen title: "Günlük Hatırlatma"
   - Subtext: "Hangi saatte çalışma hatırlatması almak istersin?"
   - Time picker: Native iOS/Android time picker
   - Default: 19:00
   - Toggle: "Hatırlatmaları aç" (default: ON)
   - CTA: "Tamamla"

4. **Completion Screen**
   - Celebration animation (checkmark + subtle confetti)
   - Headline: "Harika! Hazırsın."
   - Subtext: "İlk çalışma kaydını eklemeye hazırsın."
   - CTA: "Ana Ekrana Git"

**Edge Cases**:
- User skips onboarding → Show empty state on home with "İlk Dersini Ekle" CTA
- Notification permission denied → Continue silently, show settings reminder later
- Subject name too short → Inline error: "En az 2 karakter gerekli"

**Success State**: User lands on Home with at least 1 subject visible

**PRD Requirement References**: PR-001, PR-006

---

### Flow 2: Daily Study Log Entry

**User Goal**: Record today's study session quickly

**Trigger**: User taps "+" or a subject card on Home

**Steps**:
1. **Subject Selection** (if triggered from "+")
   - Bottom sheet with subject list
   - Each row: Color dot + Subject name + Current streak
   - Tap to select, auto-advance to next step

2. **Duration Entry**
   - Screen title: "Çalışma Süresi"
   - Large time display: "00:00" (hours:minutes)
   - Number pad: 0-9, backspace, quick presets (15, 30, 45, 60 min)
   - Minimum indicator: "En az 15 dk"
   - Validation: <15 min shows "En az 15 dakika gerekli"

3. **Date Confirmation**
   - Default: Bugün (Today)
   - Option to change: "Tarih Değiştir" → Calendar picker
   - Cannot select future dates
   - Past dates limited to 7 days

4. **Optional Note (P1)**
   - Collapsible section: "Not ekle (isteğe bağlı)"
   - Text input: max 280 characters
   - Character counter

5. **Confirmation**
   - Summary card: Subject + Duration + Date
   - Primary CTA: "Kaydet"
   - Success animation: Checkmark + streak update
   - Auto-return to Home after 1.5s

**Edge Cases**:
- Duration <15 min → Disable save, show error
- Same day, same subject entry → Accumulate or replace (config in settings)
- Future date selected → Show error "Gelecek tarih seçilemez"
- Offline → Queue locally, show "Çevrimdışı kaydedildi" toast

**Success State**: Home screen updates with new streak count or maintained streak

**PRD Requirement References**: PR-002, PR-003, PR-005

---

### Flow 3: Home Dashboard

**User Goal**: See all subjects' status at a glance

**Trigger**: App open, or return from any flow

**Screen Structure**:

**Header**:
- App logo/icon (left)
- Settings gear (right)
- Current date: "8 Mart 2026, Cumartesi"

**Today's Summary** (Sticky card):
- Title: "Bugünkü Durum"
- Progress: "3/5 ders tamamlandı" (if daily goals set)
- Or: "45 dk toplam çalışma"
- Visual: Circular progress or flame count

**Subject Grid** (Main content):
- 2-column grid on phones
- Each subject card:
  - Color-coded top border (4px)
  - Subject icon
  - Subject name (2 lines max, truncate)
  - Streak count with flame icon: "🔥 12"
  - Today's status: Checkmark or empty circle
  - Tap: Open detail / Add log

**Empty State** (no subjects):
- Illustration: Empty desk/books
- Headline: "Henüz ders eklemedin"
- CTA: "İlk Dersini Ekle"

**Floating Action Button**:
- Position: Bottom right, 16px from edges
- Icon: Plus
- Action: Open subject selector → Duration entry

**Pull-to-Refresh**:
- Only for sync status (mainly visual since offline-first)
- Shows "Son güncelleme: 2 dk önce"

**Edge Cases**:
- 10+ subjects → Scrollable grid, maintain 2-column
- Long subject names → Truncate with ellipsis
- Streak broken yesterday → Show "Dün kaçırdın" badge on that subject

**PRD Requirement References**: PR-004, PR-005

---

### Flow 4: Subject Detail & Streak History

**User Goal**: View detailed progress for a specific subject

**Trigger**: Tap on subject card from Home

**Steps**:
1. **Subject Header**
   - Large icon + color background
   - Subject name
   - Current streak: "🔥 12 günlük seri"
   - Longest streak: "En yüksek: 25"
   - Total study time: "Toplam: 45 saat"

2. **Calendar View**
   - Month view with study days highlighted
   - Color intensity based on duration (heatmap style)
   - Tap day → Show details (duration, note if any)
   - Navigation: Swipe left/right for months

3. **Recent Sessions List**
   - Last 10 sessions
   - Each row: Date + Duration + Note preview
   - Empty: "Henüz kayıt yok"

4. **Actions**
   - "Bugün Çalıştım" → Go to Flow 2 with subject pre-selected
   - "Dersi Düzenle" → Edit name/color
   - "Dersi Sil" → Confirmation modal

**Edge Cases**:
- Streak broken → Show "Serin kırıldı" with date, offer encouragement
- No history → Show onboarding-style illustration

**PRD Requirement References**: PR-003, PR-004

---

### Flow 5: Exam Mode

**User Goal**: Set up exam countdown with study targets

**Trigger**: User taps "Sınav Ekle" from Home or Settings

**Steps**:
1. **Exam Creation**
   - Screen title: "Yeni Sınav"
   - Input: "Sınav adı" (placeholder: "TYT, KPSS, Final...")
   - Date picker: Sınav tarihi (minimum: tomorrow, maximum: 2 years)
   - Subject selection: "Hangi derslerden sorumlusun?"
     - Multi-select from existing subjects
     - Or: "Tüm dersler"

2. **Target Calculation**
   - Auto-calculate: "Günlük ortalama 2 saat çalışman gerekli"
   - Show formula: "Toplam hedef / Kalan gün"
   - Allow manual override: "Günlük hedefi düzenle"

3. **Dashboard Integration**
   - Home screen shows countdown badge: "TYT'ye 45 gün"
   - Subject cards show exam-specific progress
   - Push notification: "TYT'ye son 7 gün! Hedef: 4 saat"

**Edge Cases**:
- Past date selected → Error
- No subjects selected → Error "En az bir ders seçmelisin"
- Exam date passed → Auto-archive, show summary

**Success State**: Exam appears on Home with countdown, subjects show exam badge

**PRD Requirement References**: PR-007

---

### Flow 6: Settings

**User Goal**: Manage app preferences and data

**Sections**:

**Bildirimler**:
- Daily reminder toggle
- Time picker (if enabled)
- Sound toggle

**Veri**:
- Export data (JSON)
- Import data
- Clear all data (with confirmation)

**Tema**:
- Light/Dark/System

**Hakkında**:
- App version
- Privacy policy
- Rate app

**PRD Requirement References**: PR-006, PR-105

---

## Component Library

### Subject Card
```
┌─────────────────────────┐
│ ████████████ (color bar)│
│                         │
│    [Icon]               │
│                         │
│  Matematik              │
│  🔥 12      ○           │
└─────────────────────────┘
```
- Size: ~160x140px (2-column grid)
- Border radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Pressed: Scale 0.98, shadow reduces

### Streak Badge
- Flame icon + number
- Color: Orange for active, Gray for broken
- Size: 24px icon + 16px number

### Duration Input
- Large display: 48px monospace
- Number pad: 60px touch targets
- Preset chips: 15, 30, 45, 60

### Toast Notifications
- Position: Bottom center
- Duration: 3 seconds
- Types: Success (green), Error (red), Info (blue)

---

## Accessibility

- Touch targets: Minimum 44x44px
- Color contrast: WCAG AA minimum
- Screen reader labels for all interactive elements
- Streak status announced: "Matematik, 12 günlük seri"
- Reduced motion support for animations

---

## Summary (for downstream agents)

```yaml
feature: "Study Streak - UX Specification"
source_artifacts:
  prd: "docs/product-delegated-context2/prd.md"
  brainstorm: "docs/product-delegated-context2/brainstorm.md"
primary_flows:
  - name: "Onboarding"
    screens: ["Welcome", "Add Subject", "Notification Setup", "Completion"]
    prd_coverage: ["PR-001", "PR-006"]
  - name: "Daily Study Log"
    screens: ["Subject Select", "Duration Entry", "Date Confirm", "Note (P1)", "Save"]
    prd_coverage: ["PR-002", "PR-003", "PR-005"]
  - name: "Home Dashboard"
    screens: ["Header", "Today Summary", "Subject Grid", "Empty State"]
    prd_coverage: ["PR-004", "PR-005"]
  - name: "Subject Detail"
    screens: ["Header", "Calendar", "Recent Sessions", "Actions"]
    prd_coverage: ["PR-003", "PR-004"]
  - name: "Exam Mode"
    screens: ["Exam Creation", "Target Calculation"]
    prd_coverage: ["PR-007"]
  - name: "Settings"
    screens: ["Notifications", "Data", "Theme", "About"]
    prd_coverage: ["PR-006", "PR-105"]
key_components:
  - SubjectCard
  - StreakBadge
  - DurationInput
  - CalendarHeatmap
  - Toast
visual_direction:
  primary_color: "#F97316"
  style: "Warm, encouraging, clean"
  animation: "Reanimated, 60fps, celebration on milestones"
open_questions:
  - "Streak break visualization: Red badge or just reset?"
  - "Calendar heatmap color scale: How many intensity levels?"
  - "Exam mode: Show on all subjects or separate tab?"
```

---

## Handoff Contract

**Next Agent**: `user-stories`

**Required Artifacts**:
- `docs/product-delegated-context2/ux.md` (this document)
- `docs/product-delegated-context2/prd.md`

**Recommended Artifacts**:
- `docs/product-delegated-context2/brainstorm.md`

**Critical Inputs**:
- All 6 primary flows must be implemented
- Visual design system (colors, typography, components)
- PRD requirement IDs mapped to each flow
- Accessibility requirements

**Sections That Must Not Change**:
- Primary flow structures
- Screen names and purposes
- Component specifications
- PRD requirement mappings

**Mapping Rules**:
- Every flow maps to 1+ user stories
- Every P0 PRD requirement must have acceptance criteria in stories
- Component specs become implementation boundaries
- Edge cases become test cases

**Notes for User Stories Agent**:
- Onboarding flow should be one epic with 3-4 stories
- Daily log entry is the core flow - prioritize
- Subject card component is reused across multiple flows
- Exam mode can be split into setup vs. dashboard integration stories
- Settings are lower priority (P1) except notification setup
