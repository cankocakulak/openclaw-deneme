# User Stories: Study Streak

## Epic Summary
Öğrencilerin günlük çalışma süresini kolayca takip edip düzenli çalışma streak'i oluşturmasını sağlayan mobil alışkanlık ürünü.

## Stories

### P0 STUDY-001: Bir çalışma oturumu başlatıp tamamlayabilme
**As a** öğrenci
**I want** ana ekrandan hızlıca bir çalışma oturumu başlatıp bitirmek
**So that** çalışmaya başlamak için ekstra sürtünme yaşamam

**PRD Requirement References:** `PR-001`, `PR-002`, `PR-006`
**UX Flow References:** `[Start and complete a study session]`
**Dependencies:** None
**Implementation Boundary:** Ana ekranda oturum başlatma, aktif oturum durumunu gösterme, oturum bitirme ve tamamlanan sürenin yerel olarak kaydedilmesi bu story kapsamındadır. Geçmiş listeleme, bildirimler ve ders etiketleme kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcı ana ekrandayken, when “Çalışmaya Başla” butonuna dokunursa, then aktif bir çalışma oturumu başlar ve geçen süre görünür olur.
- [ ] Given aktif bir çalışma oturumu varken, when kullanıcı “Bitir” aksiyonunu seçerse, then oturum tamamlanır ve süre cihazda saklanır.
- [ ] Given oturum tamamlandıysa, when kullanıcı ana ekrana döner, then bugünkü toplam süre güncellenmiş görünür.
- [ ] Given uygulama çevrimdışıyken, when kullanıcı bir oturum tamamlar, then oturum verisi bağlantı gerektirmeden saklanır.

**Notes:** Minimum streak süresi kuralı daha sonra kesinleşebilir; veri modeli buna izin vermelidir.

---

### P0 STUDY-002: Günlük toplam süre ve streak durumunu görebilme
**As a** öğrenci
**I want** bugünkü toplam çalışma süremi ve aktif streak'imi ana ekranda görmek
**So that** ilerlememi tek bakışta anlayabileyim

**PRD Requirement References:** `PR-002`, `PR-003`
**UX Flow References:** `[Review today's progress and active streak]`
**Dependencies:** `STUDY-001`
**Implementation Boundary:** Günlük toplamın ve streak hesaplamasının ana ekranda sunulması bu story kapsamındadır. Gelişmiş analiz ve takvim görünümü kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcının bugün tamamlanmış oturumları varsa, when ana ekran açılır, then bugünkü toplam süre doğru hesaplanmış görünür.
- [ ] Given streak koşulu sağlanıyorsa, when kullanıcı ana ekranı görür, then aktif streak gün sayısı açık şekilde görünür.
- [ ] Given henüz hiç çalışma yapılmadıysa, when kullanıcı uygulamayı açar, then boş durum motive edici bir mesajla gösterilir.
- [ ] Given streak bozulmuşsa, when kullanıcı ana ekranı açar, then kırılmış streak durumu yanlış pozitif göstermeden sunulur.

**Notes:** Streak hesabı güvenilirlik açısından merkezi kullanıcı güven metriğidir.

---

### P0 STUDY-003: Günlük hedef belirleyip ilerlemeyi takip edebilme
**As a** öğrenci
**I want** kendime günlük çalışma hedefi koyup ilerlememi görmek
**So that** bugün ne kadar daha çalışmam gerektiğini anlayabileyim

**PRD Requirement References:** `PR-004`
**UX Flow References:** `[Set or update a daily goal]`, `[Review today's progress and active streak]`
**Dependencies:** `STUDY-001`
**Implementation Boundary:** Hedef oluşturma/düzenleme ve buna bağlı progress gösterimi kapsam içidir. Hedefe göre otomatik tavsiye veya adaptif hedef sistemi kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcı hedef belirleme ekranını açtığında, when bir dakika değeri seçip kaydederse, then günlük hedef saklanır.
- [ ] Given günlük hedef tanımlıysa, when ana ekran yüklenir, then mevcut ilerleme hedefe göre görsel ve sayısal biçimde gösterilir.
- [ ] Given kullanıcı hedefini değiştirirse, when değişiklik kaydedilir, then ana ekrandaki ilerleme yeni hedefe göre güncellenir.
- [ ] Given kullanıcı aşırı düşük veya yüksek bir hedef seçerse, when seçim yapar, then yönlendirici yardımcı metin gösterilir.

**Notes:** Hedef mantığı streak mantığından ayrı tutulmalı; karar verilirse sonra bağlanabilir.

---

### P0 STUDY-004: Streak kırıldığında destekleyici toparlanma deneyimi yaşama
**As a** öğrenci
**I want** streak'im bozulduğunda uygulamanın beni yeniden başlamaya teşvik etmesini
**So that** bir günü kaçırınca tamamen bırakmayayım

**PRD Requirement References:** `PR-003`, `PR-005`
**UX Flow References:** `[Recover after a broken streak]`
**Dependencies:** `STUDY-002`
**Implementation Boundary:** Kırılan streak durumunun doğru sunulması, destekleyici mikro kopya ve yeniden başlatma CTA'sı kapsam içidir. Gelişmiş re-engagement kampanyaları ve push bildirimleri kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcının streak'i bozulmuşsa, when uygulamayı açar, then durum açık ve suçlayıcı olmayan bir dille gösterilir.
- [ ] Given streak bozulmuşsa, when ana ekran gösterilir, then birincil aksiyon hâlâ yeni oturum başlatmaya yönlendirir.
- [ ] Given kullanıcı kırık streak sonrasında yeni oturum başlatır ve tamamlar, when oturum biter, then uygulama yeni başlangıcı pozitif biçimde yansıtır.

**Notes:** Ton kritik; manipülatif veya utandırıcı dil kullanılmamalı.

---

### P1 STUDY-101: Son günlerin çalışma özetini görebilme
**As a** öğrenci
**I want** son birkaç gün ne kadar çalıştığımı hızlıca görmek
**So that** rutinimi geçmişe dönük değerlendirebileyim

**PRD Requirement References:** `PR-101`
**UX Flow References:** `[Review today's progress and active streak]`
**Dependencies:** `STUDY-001`
**Implementation Boundary:** Basit geçmiş özet görünümü kapsam içidir. Ayrıntılı analytics dashboard kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcı geçmiş özeti alanını açtığında, when son günler için veri varsa, then gün bazlı çalışma süreleri listelenir.

**Notes:** MVP sonrası da eklenebilir.

---

### P1 STUDY-102: Oturum sonu kısa durum etiketi ekleyebilme
**As a** öğrenci
**I want** oturum sonunda kısa bir his/kalite etiketi seçmek
**So that** sadece süreyi değil çalışma niteliğimi de takip edebileyim

**PRD Requirement References:** `PR-102`
**UX Flow References:** `[Start and complete a study session]`
**Dependencies:** `STUDY-001`
**Implementation Boundary:** Ön tanımlı birkaç etiket seçimi kapsam içidir. Serbest yazı ve gelişmiş duygu analizi kapsam dışıdır.

**Acceptance Criteria:**
- [ ] Given kullanıcı bir oturumu tamamladığında, when isteğe bağlı etiket seçerse, then seçim oturuma bağlanır.

**Notes:** Core loop oturduktan sonra açılmalı.

---

## Coverage Map

### PRD Requirement Coverage
- `PR-001` → `STUDY-001`
- `PR-002` → `STUDY-001`, `STUDY-002`
- `PR-003` → `STUDY-002`, `STUDY-004`
- `PR-004` → `STUDY-003`
- `PR-005` → `STUDY-004`
- `PR-006` → `STUDY-001`
- `PR-101` → `STUDY-101`
- `PR-102` → `STUDY-102`

### UX Flow Coverage
- `[Start and complete a study session]` → `STUDY-001`, `STUDY-102`
- `[Review today's progress and active streak]` → `STUDY-002`, `STUDY-003`, `STUDY-101`
- `[Set or update a daily goal]` → `STUDY-003`
- `[Recover after a broken streak]` → `STUDY-004`

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  prd: "docs/product-delegated-context/prd.md"
  ux: "docs/product-delegated-context/ux.md"
story_ids:
  p0: ["STUDY-001", "STUDY-002", "STUDY-003", "STUDY-004"]
  p1: ["STUDY-101", "STUDY-102"]
coverage:
  prd_requirements:
    PR-001: ["STUDY-001"]
    PR-002: ["STUDY-001", "STUDY-002"]
    PR-003: ["STUDY-002", "STUDY-004"]
    PR-004: ["STUDY-003"]
    PR-005: ["STUDY-004"]
    PR-006: ["STUDY-001"]
  ux_flows:
    "Start and complete a study session": ["STUDY-001", "STUDY-102"]
    "Review today's progress and active streak": ["STUDY-002", "STUDY-003", "STUDY-101"]
    "Set or update a daily goal": ["STUDY-003"]
    "Recover after a broken streak": ["STUDY-004"]
dependencies:
  STUDY-001: []
  STUDY-002: ["STUDY-001"]
  STUDY-003: ["STUDY-001"]
  STUDY-004: ["STUDY-002"]
  STUDY-101: ["STUDY-001"]
  STUDY-102: ["STUDY-001"]
implementation_risks:
  - "Streak counting rule is still open and may force acceptance criteria refinement"
  - "If data persistence is weak, multiple stories lose trustworthiness"
```

## Handoff Contract

Next Agent: `task-planner`

Required Artifacts:
- `docs/product-delegated-context/stories.md`
- `docs/product-delegated-context/prd.md`

Recommended Artifacts:
- `docs/product-delegated-context/ux.md`
- `docs/product-delegated-context/analysis.md`

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
