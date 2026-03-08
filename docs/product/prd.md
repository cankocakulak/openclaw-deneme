# PRD: Study Streak Mobile App

## Problem
Öğrenciler günlük çalışma alışkanlığı kurmakta zorlanıyor çünkü çalışma sürelerini görünür, düzenli ve motive edici şekilde takip eden basit bir mobil deneyim eksik. Mevcut çözümler ya fazla dağınık, ya da habit-building yerine sadece kaba zaman takibi sunuyor.

## Solution
Expo / React Native ile geliştirilen mobil uygulama; kullanıcının günlük çalışma süresini kaydetmesini, günlük hedef belirlemesini, hedef tamamlama bazlı streak oluşturmasını ve temel ilerleme istatistiklerini görmesini sağlayacak. İlk sürümde çekirdek odak: hızlı seans başlatma, net günlük ilerleme, streak görünürlüğü ve düşük sürtünmeli kullanım.

## Requirements

### Must Have (P0)
- [ ] `PR-001` Kullanıcı günlük çalışma seansını mobil uygulama içinden başlatıp durdurabilmelidir ve oturum süresi doğru şekilde kaydedilmelidir.
- [ ] `PR-002` Kullanıcı gün için hedef çalışma süresi belirleyebilmeli ve uygulama hedefe kalan/ulaşılan süreyi gerçek zamanlı veya oturum sonrası net şekilde gösterebilmelidir.
- [ ] `PR-003` Uygulama, kullanıcının günlük hedefi tamamladığı günler üzerinden streak hesaplayıp mevcut streak bilgisini ana deneyimde görünür göstermelidir.
- [ ] `PR-004` Kullanıcı, o günkü toplam çalışma süresini ve son günlere ait temel ilerleme özetini görebilmelidir.
- [ ] `PR-005` Uygulama ilk sürümde mobil-first, düşük sürtünmeli ve temel akışları 2 saniye içinde erişilebilir kılacak kadar sade olmalıdır.

### Should Have (P1)
- [ ] `PR-101` Kullanıcı çalışma seansına ders/etiket atayabilmelidir.
- [ ] `PR-102` Kullanıcı streak kırıldığında motivasyon bozmayacak açıklayıcı durum mesajları görebilmelidir.
- [ ] `PR-103` Uygulama haftalık toplam çalışma süresini basit bir özet olarak gösterebilmelidir.

### Nice to Have (P2)
- [ ] `PR-201` Kullanıcı hatırlatma bildirimi ayarlayabilmelidir.
- [ ] `PR-202` Kullanıcı streak veya çalışma özetini paylaşabilmelidir.

## Tech Stack
Yeni proje olarak Expo / React Native tercih edilecek; veri katmanı ilk sürümde local-first tutulacak ve ileride auth/backend eklenmesine uygun yapı korunacak.

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Frontend | Expo / React Native | Mobil-first MVP için hızlı geliştirme ve tek kod tabanı |
| State | React state + lightweight store | Küçük ilk sürüm için yeterli sadelik |
| Persistence | Local storage / offline-first persistence | Hesapsız hızlı onboarding ve düşük sürtünme |
| Backend | Deferred for v1 | İlk test için gerekli değil, sonradan eklenebilir |
| Analytics | Basic in-app event plan later | İlk sürümde zorunlu değil |

## Out of Scope
- Sosyal leaderboard
- Arkadaş ekleme / çok kullanıcılı accountability sistemi
- Gelişmiş gamification ekonomisi
- Web sürümü
- Zorunlu hesap oluşturma
- Yapay zeka destekli çalışma önerileri

## Success Criteria
- Yeni kullanıcı uygulamayı açtıktan sonra 2 dakika içinde ilk çalışma seansını başlatabilmeli.
- Kullanıcı günlük hedef durumunu ve mevcut streak’ini ana ekranda tek bakışta anlayabilmeli.
- Günlük hedefi tamamlayan kullanıcı için streak artışı deterministik ve tutarlı çalışmalı.
- Kullanıcı son günlerdeki çalışma ilerlemesini ek açıklama gerektirmeden yorumlayabilmeli.

## Open Questions
- Streak, yalnızca günlük hedef tamamlandığında mı artmalı yoksa herhangi bir çalışma aktivitesi de yeterli mi?
- Hedef türü yalnızca süre bazlı mı olacak?
- İlk sürüm tamamen local mi kalacak, yoksa opsiyonel hesap sistemi düşünülüyor mu?

## Summary (for downstream agents)

```yaml
feature: "Study Streak Mobile App"
source_artifacts:
  analysis: "docs/product/analysis.md"
  brainstorm: "docs/product/brainstorm.md"
primary_user_problem: "Students struggle to build a daily study habit because they lack a simple, motivating mobile workflow for tracking study time and maintaining streaks."
solution_shape: "A mobile app that lets students track daily study sessions, hit a daily time goal, maintain a streak, and view lightweight progress summaries."
p0_requirements:
  - id: "PR-001"
    summary: "Start and stop study sessions with accurate duration tracking"
  - id: "PR-002"
    summary: "Set a daily study-time goal and see progress toward it"
  - id: "PR-003"
    summary: "Calculate and display streak based on completed goal days"
  - id: "PR-004"
    summary: "Show daily total and recent progress summary"
  - id: "PR-005"
    summary: "Keep the mobile experience simple and fast for daily use"
p1_requirements:
  - id: "PR-101"
    summary: "Optional subject tagging"
  - id: "PR-102"
    summary: "Helpful streak-break messaging"
  - id: "PR-103"
    summary: "Weekly summary"
primary_flows_expected:
  - "Start study session"
  - "Set or adjust daily goal"
  - "Review streak and daily progress"
  - "Review recent study summary"
key_risks:
  - "Ambiguous streak rule can create user confusion"
  - "Too much input friction can hurt daily retention"
  - "Local-only data may limit recovery across devices later"
open_questions:
  - "Should any study activity count toward streak, or only goal-complete days?"
  - "Is the goal always time-based in v1?"
  - "Will subject tagging be part of MVP or deferred?"
```

## Handoff Contract

Next Agent: `ux-designer`

Required Artifacts:
- `docs/product/prd.md`

Recommended Artifacts:
- `docs/product/brainstorm.md`

Critical Inputs:
- Problem
- Solution
- P0 requirements
- Tech stack constraints

Sections That Must Not Change:
- Problem
- Solution
- P0 requirements
- Out of Scope

Mapping Rules:
- Every P0 requirement must map to at least one UX flow or user story.
- Any flow listed in `primary_flows_expected` should survive into UX unless explicitly revised.
- Open questions must stay visible until resolved by a downstream artifact.
