## Analysis
Öğrenciler için asıl problem sadece süre saymak değil; her gün yeniden başlama eşiğini düşük tutup istikrarı görünür hale getirmek. En güçlü ürün yönü, karmaşık planlayıcı olmak yerine hızlı oturum başlatma + günlük streak motivasyonu + hafif ilerleme hissi etrafında şekillenmeli.

## Ideas

### Idea 1: One-Tap Focus Timer
**What**: Öğrenci tek dokunuşla çalışma oturumu başlatır, süre akar, bitince günlük toplam güncellenir.
**Why it works**: Sürtünmeyi düşürür; günlük kullanımın temelini atar.
**Risk**: Tek başına fazla basit kalabilir.
**Effort**: Low

### Idea 2: Streak-First Daily Habit Loop
**What**: Ana ekran bugünkü süre, mevcut streak ve yarının streak hedefini gösterir.
**Why it works**: Davranışsal motivasyonu görünür hale getirir.
**Risk**: Streak bozulursa kullanıcı moral kaybedebilir.
**Effort**: Low

### Idea 3: Lightweight Session Reflection
**What**: Her oturum sonunda kullanıcı kısa etiket seçer: verimli / zorlandım / tekrar etmeliyim.
**Why it works**: Çalışma kalitesine dair mini bir geri bildirim üretir.
**Risk**: Fazladan adım bazı kullanıcıları yorabilir.
**Effort**: Medium

### Idea 4: Goal-Based Daily Target
**What**: Kullanıcı günlük hedef süre belirler; uygulama hedefe yaklaşmayı ve tamamlamayı gösterir.
**Why it works**: Net hedef, streak mekanizmasını daha anlamlı yapar.
**Risk**: Hedefler gerçekçi olmazsa terk oranı artabilir.
**Effort**: Medium

### Idea 5: Subject Tagging
**What**: Kullanıcı oturumu başlatırken ders seçer veya oturum sonunda dersi etiketler.
**Why it works**: Zamanın nereye gittiğini görmesini sağlar.
**Risk**: Veri girişi sürtünmesi yaratabilir.
**Effort**: Medium

### Idea 6: Encouraging Recovery Mode
**What**: Streak kırıldığında cezalandırıcı his yerine “bugün yeniden başla” odaklı yumuşak toparlanma akışı sunar.
**Why it works**: Drop-off riskini azaltır.
**Risk**: Sert streak oyunculaştırmasını sevenler için daha az heyecanlı gelebilir.
**Effort**: Medium

## Tech Direction
- Recommended stack: Expo + React Native + local-first storage + optional lightweight backend sync later. Bu kombinasyon mobil MVP için hızlı iterasyon ve düşük operasyon maliyeti sağlar.
- What to reuse from existing project: Mevcut repo içinde net ürün altyapısı görünmüyorsa yeni mobil feature surface olarak sade artifact-first ilerlemek mantıklı.
- Key technical bets and why:
  - Local-first session logging: offline kullanım ve hız için
  - Derived streak calculation: streak state'ini ham session verisinden üretmek için
  - Simple notification hooks later: günlük geri dönüşü desteklemek için

## Recommendation
En iyi yön **Idea 1 + Idea 2 + Idea 4 + Idea 6** kombinasyonu. Yani ürünün çekirdeği tek dokunuşla oturum başlatma, bugünkü toplam süre, günlük hedef ve streak görünürlüğü olmalı; streak kırıldığında da toparlanmayı destekleyen yumuşak UX kullanılmalı.

Bu yön hem MVP için yeterince küçük hem de tekrar kullanım yaratacak kadar motive edici. Subject tagging ve reflection gibi özellikler v1.1 seviyesinde eklenebilir.

## Combinations
One-Tap Focus Timer + Streak-First Daily Habit Loop + Goal-Based Daily Target birlikte “başla, ilerle, zinciri koru” döngüsünü kurar. Encouraging Recovery Mode bu döngünün kırıldığı noktada kullanıcıyı sistemin içinde tutar.

## Summary (for downstream agents)

```yaml
feature: "study-streak"
selected_direction: "Mobile study timer with streak tracking, daily goal progress, and gentle recovery UX"
rejected_directions_worth_remembering:
  - "Deep analytics-heavy dashboard in MVP"
  - "Complex planning and scheduling system in MVP"
  - "Mandatory subject tagging at session start"
constraints:
  - "Platform is mobile"
  - "Framework is Expo / React Native"
  - "MVP should stay low-friction and habit-forming"
technical_bets:
  - "Local-first session storage"
  - "Derived streak calculation from completed study sessions"
  - "Expandable notification/reminder layer later"
open_questions_for_prd:
  - "What is the minimum completed session duration that counts toward a streak?"
  - "Should streak require meeting a minimum daily target or just any completed study session?"
  - "Do users need guest mode before account/sync?"
```

## Handoff Contract

Next Agent: `prd`

Required Artifacts:
- `docs/product-delegated-context/brainstorm.md`

Recommended Artifacts:
- `docs/product-delegated-context/analysis.md` when available

Critical Inputs that must remain stable:
- Product is a mobile app for students
- Core loop is quick session tracking + streak visibility + daily progress
- MVP must remain low-friction and not become a full planning suite

Sections That Must Not Change before PRD:
- Recommendation
- Summary (for downstream agents)
- Core MVP direction around session tracking and streaks
