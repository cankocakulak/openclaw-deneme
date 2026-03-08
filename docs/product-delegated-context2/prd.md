# PRD: Study Streak

## Problem

Öğrenciler sınav dönemlerinde yoğun çalışma yapıp sonra tamamen bırakma döngüsüne girer. Mevcut çalışma takip uygulamaları ya çok basit (sadece süre kaydı) ya da çok karmaşıktır (pomodoro, odak modu, sosyal özellikler). Öğrencilerin asıl ihtiyacı "sürdürülebilir alışkanlık oluşturma" ve "farklı derslere esnek çalışma imkanı"dır. Streak mekaniği kanıtlanmış bir motivasyon aracıdır ancak tek bir streak tüm akademik yaşamı temsil edemez.

## Solution

Ders bazlı streak sistemi + sınav odaklı çalışma modu. Her ders için bağımsız streak takibi yapılır (örn: Matematik 5 gün, Fizik 3 gün). Öğrenci günün hangi dersine çalıştığını kaydeder, minimum çalışma süresi (örn: 15 dk) tamamlandığında o dersin streak'i artar. Sınav modu ile spesifik sınav tarihi girilerek otomatik çalışma hedefleri oluşturulur. Offline-first yaklaşım ile internet olmadan çalışır.

## Requirements

### Must Have (P0)

- [ ] `PR-001` Kullanıcı en az 1, en fazla 10 ders ekleyebilir. Her ders için isim ve renk seçilebilir.
- [ ] `PR-002` Her ders için günlük çalışma kaydı oluşturulabilir. Minimum çalışma süresi: 15 dakika. Kayıt için: ders seçimi + süre girişi + tarih (varsayılan: bugün).
- [ ] `PR-003` Ders bazlı streak hesaplama: Ardışık günlerde çalışma yapıldığında streak artar. Bir gün atlandığında streak sıfırlanır.
- [ ] `PR-004` Ana ekranda tüm derslerin streak sayıları ve günlük ilerleme görünür. Görsel: progress ring veya streak flame ikonu.
- [ ] `PR-005` Offline çalışma: Tüm veriler cihazda AsyncStorage ile saklanır. İnternet bağlantısı gerekmez.
- [ ] `PR-006` Günlük hatırlatma bildirimi: Kullanıcı tarafından seçilen saatte "Bugün çalışma yapmayı unutma!" bildirimi gösterilir. Expo Local Notifications kullanılır.
- [ ] `PR-007` Sınav modu: Kullanıcı sınav adı ve tarihi girer. Uygulama, kalan gün sayısını hesaplar ve günlük minimum çalışma hedefi önerir.

### Should Have (P1)

- [ ] `PR-101` Haftalık/aylık çalışma istatistikleri: Her ders için toplam süre, ortalama günlük süre, en uzun streak grafikleri.
- [ ] `PR-102` Streak kurtarma: Haftada 1 "freeze" hakkı. Kullanıcı bir gün çalışamazsa freeze kullanarak streak'i korur.
- [ ] `PR-103` Çalışma notları: Her çalışma kaydına not eklenebilir (max 280 karakter).
- [ ] `PR-104` Widget desteği (iOS 14+, Android 12+): Ana ekrandan streak sayısını görme.
- [ ] `PR-105` Veri yedekleme: JSON export/import ile veri taşınabilirliği.

### Nice to Have (P2)

- [ ] `PR-201` Study Buddy: Arkadaş ekleme ve birbirinin streak'lerini görme.
- [ ] `PR-202` Lider tablosu: Anonim global sıralama (ops-in).
- [ ] `PR-203》Rozet/achievement sistemi: İlk 7 gün, ilk 30 gün, tüm derslerde aynı gün çalışma vb. başarımlar.
- [ ] `PR-204` Karanlık mod: UI tema seçeneği.
- [ ] `PR-205` Sesli bildirim: Çalışma tamamlandığında onay sesi.

## Tech Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Framework | Expo (SDK 50+) | One codebase iOS/Android, OTA updates, managed workflow |
| Language | TypeScript | Type safety, better DX |
| State Management | Zustand + AsyncStorage | Simple, offline-first, no backend dependency for core features |
| Navigation | Expo Router | File-based routing, deep linking support |
| UI Components | React Native Paper | Material Design, accessible, theme support |
| Animations | React Native Reanimated | Smooth streak animations, 60fps |
| Notifications | Expo Notifications | Local notifications, no external service needed |
| Storage | AsyncStorage | Simple key-value, sufficient for MVP data |
| Icons | Phosphor Icons | Consistent, customizable icon set |

## Out of Scope

- Backend/Cloud sync (MVP'de yok, P1'de JSON export/import yeterli)
- Pomodoro timer (farklı problem alanı)
- Focus mode / app blocking (izin karmaşası, yüksek effort)
- Video/audio content (eğitim içeriği değil, takip aracı)
- In-app purchases / monetization (MVP ücretsiz)
- Multi-language support (MVP sadece Türkçe)
- Tablet/landscape optimizasyonu (portrait mobile only)
- Apple Watch / Wear OS desteği

## Success Criteria

- [ ] Kullanıcı onboarding'i tamamlama oranı: >70% (en az 1 ders ekleyen / uygulamayı açan)
- [ ] Günlük aktif kullanıcı (DAU): Açılıştan sonraki ilk 7 günde en az 5 gün uygulamayı açan kullanıcı oranı >30%
- [ ] Streak devamlılığı: 7+ günlük streak oluşturan kullanıcı oranı >20%
- [ ] Teknik: Uygulama açılış süresi <2 saniye (cold start)
- [ ] Teknik: AsyncStorage okuma/yazma <100ms

## Open Questions

1. **Streak bozulma davranışı**: Sıfırlama mı yoksa "düşürme" mi? (örn: 10 günlük streak bozulunca 0 mı yoksa 5 mi?)
2. **Maksimum ders sayısı**: 10 yeterli mi? Üniversite öğrencileri dönemde 6-8 ders alır, lise öğrencileri 10+ olabilir.
3. **Sınav modu auto-plan**: Sistem otomatik çalışma planı mı oluştursun yoksa kullanıcı manuel mi girsin?
4. **Günlük minimum süre**: 15 dk sabit mi, kullanıcı mı seçsin?
5. **Bildirim stratejisi**: Tek günlük hatırlatma mı, yoksa streak tehlikeye girdiğinde ek bildirim mi?

## Summary (for downstream agents)

```yaml
feature: "Study Streak - Ders Bazlı Çalışma Takip Uygulaması"
source_artifacts:
  analysis: "docs/product-delegated-context2/analysis.md"
  brainstorm: "docs/product-delegated-context2/brainstorm.md"
primary_user_problem: "Öğrenciler sınav dönemlerinde yoğun çalışıp sonra tamamen bırakma döngüsüne giriyor; mevcut uygulamalar ya çok basit ya da çok karmaşık"
solution_shape: "Ders bazlı bağımsız streak sistemi + sınav odaklı çalışma modu, offline-first"
p0_requirements:
  - id: "PR-001"
    summary: "1-10 ders ekleme (isim + renk)"
  - id: "PR-002"
    summary: "Günlük çalışma kaydı (min 15dk, ders+süre+tarih)"
  - id: "PR-003"
    summary: "Ders bazlı streak hesaplama (ardışık gün, bozulunca sıfırlanır)"
  - id: "PR-004"
    summary: "Ana ekran: tüm derslerin streak ve ilerlemesi"
  - id: "PR-005"
    summary: "Offline-first: AsyncStorage, internet gerekmez"
  - id: "PR-006"
    summary: "Günlük hatırlatma bildirimi (Expo Local Notifications)"
  - id: "PR-007"
    summary: "Sınav modu: sınav adı/tarihi girişi, kalan gün hesaplama"
p1_requirements:
  - id: "PR-101"
    summary: "Haftalık/aylık istatistikler ve grafikler"
  - id: "PR-102"
    summary: "Haftada 1 streak freeze hakkı"
  - id: "PR-103"
    summary: "Çalışma notları (max 280 karakter)"
  - id: "PR-104"
    summary: "Widget desteği (iOS 14+, Android 12+)"
  - id: "PR-105"
    summary: "JSON export/import ile veri yedekleme"
primary_flows_expected:
  - "Onboarding: İlk açılış → ders ekleme → hatırlatma saati seçimi"
  - "Günlük çalışma kaydı: Ana ekran → ders seç → süre gir → kaydet"
  - "Streak takibi: Ana ekran görünümü → ders detayı → streak geçmişi"
  - "Sınav modu: Sınav ekle → tarih seç → kalan gün gör → günlük hedef"
  - "Ayarlar: Bildirim saati değiştirme → veri yedekleme → ders düzenleme"
key_risks:
  - "Streak mekaniği kullanıcıyı strese sokabilir (toxic productivity)"
  - "Offline-first yaklaşım cihaz değişikliğinde veri kaybı riski (P1'de export/import çözüm)"
  - "Sınav sonrası kullanım düşüşü (seasonal engagement)"
  - "React Native Reanimated öğrenme eğrisi (animasyonlar için)"
open_questions:
  - "Streak bozulunca sıfırlanır mı yoksa düşürülür mü?"
  - "Maksimum ders sayısı 10 mu, daha fazla mı olmalı?"
  - "Sınav modu otomatik plan mı, manuel mi?"
  - "Günlük minimum süre sabit mi, kullanıcı seçimi mi?"
  - "Bildirim stratejisi: tek hatırlatma mı, streak tehlikede ek bildirim mi?"
```

## Handoff Contract

**Next Agent**: `ux-designer`

**Required Artifacts**:
- `docs/product-delegated-context2/prd.md` (this document)

**Recommended Artifacts**:
- `docs/product-delegated-context2/brainstorm.md`

**Critical Inputs**:
- Problem: Öğrencilerin sürdürülebilir çalışma alışkanlığı eksikliği
- Solution: Ders bazlı streak + sınav modu, offline-first
- P0 requirements: PR-001 through PR-007 (7 adet)
- Tech stack: Expo / React Native, AsyncStorage, Expo Notifications
- Constraints: Mobile only, portrait mode, offline-first, Türkçe MVP

**Sections That Must Not Change**:
- Problem
- Solution
- P0 requirements (PR-001 to PR-007)
- Out of Scope
- Tech Stack choices

**Mapping Rules**:
- Every P0 requirement must map to at least one UX flow:
  - PR-001 → Onboarding flow (ders ekleme)
  - PR-002, PR-003 → Günlük kayıt flow
  - PR-004 → Ana ekran/dashboard flow
  - PR-005 → Offline state handling (edge case)
  - PR-006 → Bildirim ayarları flow
  - PR-007 → Sınav modu flow
- `primary_flows_expected` listesindeki her flow UX'te karşılık bulmalı
- Open questions UX research veya user-stories aşamasında yanıtlanacak

**Notes for UX Designer**:
- Streak görseli kritik: Flame, progress ring, veya benzeri güçlü görsel geri bildirim
- Ana ekran: Birden fazla dersin streak'ini aynı anda gösterme challenge'ı
- Sınav modu: Sınav yaklaştıkça UI'da vurgu artışı (urgency design)
- Offline-first: Sync indicator gerekmez ama "son yedekleme" bilgisi P1'de faydalı
- Türkçe UI: "Streak" kelimesi Türkçe'ye "seri" olarak çevrilebilir, kullanıcı testi önerilir
