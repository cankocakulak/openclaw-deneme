# Brainstorm: Study Streak Mobile App

## Analysis
Öğrenciler düzenli çalışmak istiyor ama ilerlemeyi görünür kılan, hafif ve günlük kullanımı kolay bir sistem eksik. Asıl mesele sadece süre tutmak değil; alışkanlık oluşturmayı tetikleyen net günlük feedback, streak motivasyonu ve düşük sürtünmeli giriş akışı.

## Ideas

### Idea 1: Daily Focus Timer + Streak Core
**What**: Öğrenci günlük çalışma seansını başlatır, süreyi takip eder ve günlük hedefi tamamlayınca streak kazanır.
**Why it works**: En yalın ve hızlı benimsenen çekirdek deneyim bu.
**Risk**: Çok sade kalırsa uzun vadede sıkıcı olabilir.
**Effort**: Low

### Idea 2: Subject-Based Study Tracking
**What**: Kullanıcı çalışma süresini ders bazında etiketleyerek takip eder.
**Why it works**: İlerleme daha anlamlı görünür ve analiz değeri artar.
**Risk**: İlk kullanımda veri girişi sürtünmesi yaratabilir.
**Effort**: Medium

### Idea 3: Goal-Driven Daily Plan
**What**: Kullanıcı günlük hedef süre belirler, uygulama hedefe kalan süreyi ve streak durumunu gösterir.
**Why it works**: Hedef + görünür geri bildirim alışkanlık oluşumunu güçlendirir.
**Risk**: Hedef belirleme iyi tasarlanmazsa baskı yaratabilir.
**Effort**: Medium

### Idea 4: Social Accountability Lite
**What**: Kullanıcı streak’ini arkadaşlarıyla paylaşır veya küçük bir leaderboard görür.
**Why it works**: Sosyal baskı ve görünürlük motivasyonu artırabilir.
**Risk**: İlk versiyon için gereksiz karmaşa ve moderasyon ihtiyacı yaratır.
**Effort**: High

### Idea 5: Motivational Insights Dashboard
**What**: Haftalık toplam süre, en iyi günler ve streak trendi gösterilir.
**Why it works**: Geriye dönük görünür başarı, devam etme motivasyonu yaratır.
**Risk**: Çekirdek kullanım olmadan dashboard değersiz kalır.
**Effort**: Medium

### Idea 6: Smart Reminders and Recovery
**What**: Kullanıcı çalışmadığı günlerde nazik hatırlatma alır; streak kırılınca geri dönüş mesajı görür.
**Why it works**: Drop-off azaltır ve kırılan alışkanlığı geri toplar.
**Risk**: Bildirimler yanlış ayarlanırsa rahatsız edici olur.
**Effort**: Medium

## Tech Direction

**Recommended stack**: Expo + React Native, local-first başlangıç, sonra bulut senkronizasyonuna açık yapı.

**Why**:
- Mobil öncelikli kullanım için doğru seçim
- Expo ile hızlı prototipleme ve dağıtım kolay
- React Native ile tek kod tabanı yeterli
- İlk versiyonda local persistence ile hızlı MVP çıkar

**Key technical bets**:
- Session tracking çekirdeği olmalı
- Gün bazlı streak hesaplama deterministic olmalı
- Local data modeli sonradan auth/cloud eklenmesine izin vermeli

## Recommendation
Kazanan yön: **Idea 1 + Idea 3 + hafif seviyede Idea 5 kombinasyonu**.

Yani çekirdek ürün; günlük çalışma seansı başlatma/durdurma, günlük hedef belirleme, streak oluşturma ve bunu basit istatistiklerle görünür kılma üzerine kurulmalı. Sosyal özellikler ve gamification ağır katmanlar ilk sürümden çıkarılmalı; çünkü bu ürünün gerçek değeri önce “her gün çalışmayı kolaylaştıran minimum alışkanlık motoru” olmasında.

## Combinations
En güçlü kombinasyon:
- Daily Focus Timer + Streak Core
- Goal-Driven Daily Plan
- Motivational Insights Dashboard (hafif sürüm)

Bu kombinasyon, düşük sürtünme + net motivasyon + görünür ilerleme üçlüsünü sağlıyor.

## Summary (for downstream agents)

```yaml
feature: "study-streak-mobile-app"
selected_direction: "Mobile-first study tracker with daily session timing, daily goal progress, streak tracking, and lightweight stats"
rejected_directions_worth_remembering:
  - "Heavy social leaderboard for v1"
  - "Complex multi-user accountability mechanics for v1"
constraints:
  - "Platform: mobile"
  - "Framework: Expo / React Native"
  - "Artifacts must be written inside repo under docs/product/"
  - "Work must stay on feature branch until workflow completes"
technical_bets:
  - "Expo / React Native for fast mobile delivery"
  - "Local-first MVP with future backend compatibility"
  - "Deterministic streak calculation based on daily study completion"
open_questions_for_prd:
  - "Will daily goals be time-based only or also session-count-based?"
  - "Should streak count any study activity or only goal-complete days?"
  - "Will onboarding require account creation in v1, or stay local-only?"
```

## Handoff Contract

Next Agent: `prd`

Required Artifacts:
- `docs/product/brainstorm.md`

Recommended Artifacts:
- none

Critical Inputs that must remain stable:
- Mobile-first product direction
- Expo / React Native stack preference
- Core value proposition: daily study tracking + streak motivation
- v1 should remain lightweight and habit-focused

Sections That Must Not Change before PRD:
- Selected direction
- Constraints
- Technical bets
- v1 exclusion of heavy social features
