# User Stories: Study Streak Mobile App

## Epic Summary
Öğrencilerin günlük çalışma süresini takip edip hedef tamamlama bazlı streak oluşturmasını sağlayan mobil uygulama.

## Stories

### P0 FEATURE-001: Start and complete a study session
**As a** student
**I want** to start and stop a study session quickly
**So that** my daily study time is recorded without friction

**PRD Requirement References:** `PR-001`, `PR-005`
**UX Flow References:** `Start Study Session`
**Dependencies:** None
**Implementation Boundary:** Session başlatma, aktif sayaç, seans bitirme ve sürenin bugünkü toplama eklenmesi dahildir. Ders bazlı etiketleme ve gelişmiş interruption recovery kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given I am on the home dashboard, when I tap "Çalışmaya Başla", then an active session state starts and elapsed time becomes visible.
- [ ] Given a session is active, when I tap "Seansı Bitir", then the session duration is saved and added to today’s total study time.
- [ ] Given I have never recorded a session before, when I open the app, then I can still start my first session without additional setup.

**Notes:** Active session state should remain trustworthy across normal app lifecycle transitions.

---

### P0 FEATURE-002: Set and track a daily study goal
**As a** student
**I want** to define a daily study-time goal
**So that** I know what I am aiming for each day

**PRD Requirement References:** `PR-002`, `PR-005`
**UX Flow References:** `Set or Adjust Daily Goal`, `Review Streak and Daily Progress`
**Dependencies:** None
**Implementation Boundary:** Dakika bazlı günlük hedef belirleme, kaydetme ve bugünkü hedef ilerlemesinin gösterimi dahildir. Çoklu hedef tipi ve gelişmiş planlama kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given I open goal settings, when I choose or enter a valid duration and save it, then the app stores my daily goal.
- [ ] Given a daily goal exists, when I return to the home dashboard, then I can see my progress toward that goal.
- [ ] Given I update my goal during the day, when the new goal is saved, then the shown progress recalculates against the updated target.

**Notes:** Goal input should be fast and mobile-friendly.

---

### P0 FEATURE-003: Maintain and view streak status
**As a** student
**I want** to see whether my study streak is continuing
**So that** I stay motivated to study daily

**PRD Requirement References:** `PR-003`, `PR-004`
**UX Flow References:** `Review Streak and Daily Progress`
**Dependencies:** `FEATURE-001`, `FEATURE-002`
**Implementation Boundary:** Streak’in hedef tamamlanan günler üzerinden hesaplanması ve ana ekranda görünmesi dahildir. Sosyal streak paylaşımı ve leaderboard kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given I complete my daily study goal for today, when the app updates today’s progress, then my streak reflects that completion rule consistently.
- [ ] Given I open the app on the home dashboard, when streak data exists, then I can see the current streak count clearly.
- [ ] Given my streak has broken, when I open the app, then I see a non-punitive explanatory message instead of an ambiguous empty state.

**Notes:** Final streak rule should stay consistent across UI and logic.

---

### P0 FEATURE-004: Review today and recent progress
**As a** student
**I want** to review my recent study totals
**So that** I can understand whether I am staying consistent

**PRD Requirement References:** `PR-004`, `PR-103`
**UX Flow References:** `Review Streak and Daily Progress`, `Review Recent Study Summary`
**Dependencies:** `FEATURE-001`
**Implementation Boundary:** Bugünkü toplam süre, son günler özeti ve basit haftalık görünüm dahildir. Gelişmiş analytics, hedef tahmini ve koçluk önerileri kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given I have recorded study sessions, when I open the home dashboard, then I can see today’s total study time.
- [ ] Given I have recent activity, when I view the summary section, then I can see a readable 7-day or recent-period progress summary.
- [ ] Given I have insufficient historical data, when I view the summary area, then the app shows a helpful low-data message instead of broken or empty visuals.

**Notes:** Summary should be glanceable, not a dense analytics page.

---

### P1 FEATURE-101: Tag a study session by subject
**As a** student
**I want** to label study sessions by subject
**So that** my study history feels more meaningful

**PRD Requirement References:** `PR-101`
**UX Flow References:** `Start Study Session`
**Dependencies:** `FEATURE-001`
**Implementation Boundary:** Basit subject tag seçimi dahildir. Gelişmiş taxonomy yönetimi kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given I am in a study session flow, when subject tagging is enabled, then I can select a subject label for that session.
- [ ] Given a session has a subject tag, when the session is saved, then that tag is stored with the session record.

**Notes:** Optional for MVP cut if needed.

---

## Coverage Map

### PRD Requirement Coverage
- `PR-001` → `FEATURE-001`
- `PR-002` → `FEATURE-002`, `FEATURE-003`
- `PR-003` → `FEATURE-003`
- `PR-004` → `FEATURE-003`, `FEATURE-004`
- `PR-005` → `FEATURE-001`, `FEATURE-002`
- `PR-101` → `FEATURE-101`
- `PR-103` → `FEATURE-004`

### UX Flow Coverage
- `Start Study Session` → `FEATURE-001`, `FEATURE-101`
- `Set or Adjust Daily Goal` → `FEATURE-002`
- `Review Streak and Daily Progress` → `FEATURE-002`, `FEATURE-003`, `FEATURE-004`
- `Review Recent Study Summary` → `FEATURE-004`

## Summary (for downstream agents)

```yaml
feature: "Study Streak Mobile App"
source_artifacts:
  prd: "docs/product/prd.md"
  ux: "docs/product/ux.md"
story_ids:
  p0: ["FEATURE-001", "FEATURE-002", "FEATURE-003", "FEATURE-004"]
  p1: ["FEATURE-101"]
coverage:
  prd_requirements:
    PR-001: ["FEATURE-001"]
    PR-002: ["FEATURE-002", "FEATURE-003"]
    PR-003: ["FEATURE-003"]
    PR-004: ["FEATURE-003", "FEATURE-004"]
    PR-005: ["FEATURE-001", "FEATURE-002"]
    PR-101: ["FEATURE-101"]
    PR-103: ["FEATURE-004"]
  ux_flows:
    "Start Study Session": ["FEATURE-001", "FEATURE-101"]
    "Set or Adjust Daily Goal": ["FEATURE-002"]
    "Review Streak and Daily Progress": ["FEATURE-002", "FEATURE-003", "FEATURE-004"]
    "Review Recent Study Summary": ["FEATURE-004"]
dependencies:
  FEATURE-001: []
  FEATURE-002: []
  FEATURE-003: ["FEATURE-001", "FEATURE-002"]
  FEATURE-004: ["FEATURE-001"]
  FEATURE-101: ["FEATURE-001"]
implementation_risks:
  - "Streak logic must be defined consistently before implementation"
  - "FEATURE-004 can grow too broad if analytics scope expands"
```

## Handoff Contract

Next Agent: `task-planner`

Required Artifacts:
- `docs/product/stories.md`
- `docs/product/prd.md`

Recommended Artifacts:
- `docs/product/ux.md`

Critical Inputs:
- Story ordering
- Story IDs
- Acceptance criteria
- Dependencies
- Implementation boundaries
- Coverage map

Sections That Must Not Change:
- Story IDs
- Acceptance criteria intent
- Dependencies
- Implementation Boundary

Mapping Rules:
- Every P0 requirement must map to at least one story.
- Every primary UX flow must map to at least one story.
- Every story must be independently implementable or explicitly flagged for splitting.
