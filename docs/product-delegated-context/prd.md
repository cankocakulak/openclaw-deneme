# PRD: Study Streak

## Problem
Öğrenciler düzenli çalışmak istiyor ama günlük ilerlemeyi görünür ve motive edici şekilde takip etmek zor oluyor. Mevcut alışkanlık problemi, plan yapmaktan çok her gün yeniden başlayabilmek ve istikrarı sürdürebilmek.

## Solution
Expo / React Native tabanlı bir mobil uygulama ile kullanıcı tek dokunuşla çalışma oturumu başlatacak, günlük toplam süresini ve streak durumunu görecek, günlük hedefe ne kadar yaklaştığını takip edecek. Ürün, düşük sürtünmeli kullanım ve streak kırıldığında yeniden başlamayı teşvik eden destekleyici bir deneyim sunacak.

## Requirements

### Must Have (P0)
- [ ] `PR-001` Kullanıcı bir çalışma oturumunu ana ekrandan en fazla bir ana aksiyonla başlatabilmeli ve durdurabilmeli.
- [ ] `PR-002` Uygulama tamamlanan çalışma oturumlarını kaydedip gün bazında toplam çalışma süresini doğru göstermeli.
- [ ] `PR-003` Uygulama kullanıcının aktif streak'ini günlük çalışma verisine göre hesaplayıp ana ekranda görünür şekilde göstermeli.
- [ ] `PR-004` Kullanıcı günlük hedef çalışma süresini belirleyebilmeli ve uygulama gün içindeki ilerlemeyi bu hedefe göre göstermeli.
- [ ] `PR-005` Streak bozulduğunda uygulama cezalandırıcı değil, yeniden başlatmayı teşvik eden toparlanma mesajı ve durumu göstermeli.
- [ ] `PR-006` Oturum verileri ağ bağlantısı olmasa da cihazda güvenilir biçimde saklanmalı.

### Should Have (P1)
- [ ] `PR-101` Kullanıcı son günlerin çalışma özetini basit bir geçmiş görünümünde görebilmeli.
- [ ] `PR-102` Kullanıcı çalışma oturumu sonunda isteğe bağlı kısa durum etiketi ekleyebilmeli (ör. verimli, zorlayıcı).

### Nice to Have (P2)
- [ ] `PR-201` Kullanıcı çalışma oturumlarını derse göre etiketleyebilmeli.
- [ ] `PR-202` Uygulama kullanıcının çalışma alışkanlığına göre motivasyon bildirimi önerebilmeli.

## Tech Stack
For new projects: chosen stack with reasoning.
For existing projects: reference analysis artifact, note any new dependencies needed.

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Frontend | Expo / React Native | Hızlı mobil geliştirme ve tek kod tabanı |
| State/UI | React state + lightweight state management as needed | MVP için düşük karmaşıklık |
| Storage | Local device storage (AsyncStorage/SQLite class) | Offline-first session persistence |
| Backend | None for MVP | İlk sürümde sync zorunlu değil |
| Analytics | Lightweight event hooks later | Önce çekirdek kullanım doğrulansın |

## Out of Scope
- Ders programı/planner sistemi
- Sosyal leaderboard veya arkadaş karşılaştırmaları
- Hesap oluşturma ve çok cihaz senkronizasyonu
- Derin istatistik panelleri ve gelişmiş raporlama
- Masaüstü veya web deneyimi

## Success Criteria
- Yeni kullanıcı 1 dakika içinde ilk çalışma oturumunu başlatabilir.
- Kullanıcı tamamlanan oturum sonrası güncel toplam süreyi ve streak durumunu hemen görebilir.
- Günlük hedef ilerleme durumu ana ekranda ek açıklama gerektirmeden anlaşılır olur.
- En temel streak hesaplama davranışı manuel test senaryolarında doğru çalışır.
- Offline kullanımdan sonra uygulama yeniden açıldığında oturum verileri kaybolmaz.

## Open Questions
- Streak için minimum geçerli çalışma süresi kaç dakika olmalı?
- Günlük hedefe ulaşmak mı, yoksa herhangi bir tamamlanmış oturum mu streak için yeterli sayılmalı?
- İlk sürümde kullanıcı onboarding gerekli mi, yoksa doğrudan ana ekrana mı girilmeli?
- Geçmiş görünümü takvim tabanlı mı yoksa liste tabanlı mı olmalı?

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  analysis: "docs/product-delegated-context/analysis.md"
  brainstorm: "docs/product-delegated-context/brainstorm.md"
primary_user_problem: "Students need a low-friction way to consistently track daily study time and maintain motivation through visible streak progress."
solution_shape: "A mobile study timer app with daily totals, streak visibility, daily goal tracking, and encouraging recovery when a streak breaks."
p0_requirements:
  - id: "PR-001"
    summary: "Start and stop a study session from the home screen with minimal friction"
  - id: "PR-002"
    summary: "Persist completed sessions and compute daily totals correctly"
  - id: "PR-003"
    summary: "Calculate and display active streak from daily study behavior"
  - id: "PR-004"
    summary: "Allow a daily study goal and show progress against it"
  - id: "PR-005"
    summary: "Provide supportive recovery UX when a streak is broken"
  - id: "PR-006"
    summary: "Store session data reliably offline on device"
p1_requirements:
  - id: "PR-101"
    summary: "Show recent study history"
  - id: "PR-102"
    summary: "Allow optional session reflection tags"
primary_flows_expected:
  - "Start and complete a study session"
  - "Review today's progress and active streak"
  - "Set or update a daily goal"
  - "Recover after a broken streak"
key_risks:
  - "Incorrect streak calculation will undermine trust"
  - "Too much setup friction will reduce daily usage"
  - "Goal logic and streak logic may confuse users if not explained clearly"
open_questions:
  - "What minimum session duration counts toward a streak?"
  - "Should streak depend on any completed session or meeting a daily goal?"
  - "Does MVP need onboarding before first session?"
```

## Handoff Contract

Next Agent: `ux-designer`

Required Artifacts:
- `docs/product-delegated-context/prd.md`

Recommended Artifacts:
- `docs/product-delegated-context/analysis.md`
- `docs/product-delegated-context/brainstorm.md`

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
