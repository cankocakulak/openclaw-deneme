# PRD: Öğrenci Çalışma Takip Uygulaması (Zincir)

## Problem

Öğrenciler çalışma sürelerini takip etmekte zorlanıyor ve düzenli çalışma alışkanlığı edinemiyor. Mevcut çözümler ya çok karmaşık, ya internet gerektiriyor, ya da motivasyonu sürdürmek için yeterli görsel geri bildirim sunmuyor. Öğrencilerin **kaybetme korkusu (loss aversion)** psikolojisinden faydalanarak düzenli çalışma alışkanlığı kazandırmak gerekiyor.

## Solution

Basit, hızlı ve offline çalışan bir zincir (streak) uygulaması. Öğrenci her gün çalışma hedefini tutturduğunda zincir uzar; kaçırırsa zincir kırılır. Temel özellikler: günlük kronometre, zincir görselleştirmesi, basit istatistikler ve opsiyonel çalışma notları. Açılış süresi 2 saniyenin altında, onboarding yok.

## Requirements

### Must Have (P0)

- [ ] `PR-001` **Günlük Çalışma Kaydı**: Kullanıcı çalışma oturumunu başlat/durdur/duraklat yapabilmeli; süre günlük olarak kaydedilmeli
  - Acceptance: Kronometre başlatıldığında süre artar, durdurulduğunda kaydedilir, duraklatıldığında donar
  
- [ ] `PR-002` **Zincir (Streak) Sistemi**: Her gün minimum 30 dakika çalışma hedefi tutturulduğunda zincir 1 artar; kaçırıldığında zincir sıfırlanır
  - Acceptance: Zincir sayısı ana ekranda görünür; hedef tutturulduğunda görsel onay gösterilir
  
- [ ] `PR-003` **Offline-First Çalışma**: Uygulama internet olmadan tamamen çalışmalı; veriler yerel depolanmalı
  - Acceptance: Uçak modunda tüm özellikler çalışır; veri kaybı olmaz
  
- [ ] `PR-004` **Hızlı Açılış**: Uygulama 2 saniyeden kısa sürede açılmalı
  - Acceptance: Soğuk başlatmada 2 saniye altında yükleme süresi
  
- [ ] `PR-005` **Basit İstatistikler**: Günlük/haftalık/aylık toplam çalışma süreleri görünmeli
  - Acceptance: Ana ekranda bu hafta toplam saat ve bugünkü süre görünür

### Should Have (P1)

- [ ] `PR-101` **Esnek Zincir Modu**: Kullanıcı "haftada X gün" moduna geçebilmeli (örn: haftada 5 gün)
  - Acceptance: Ayarlardan mod değiştirilebilir; haftalık hedef görsel olarak takip edilir
  
- [ ] `PR-102` **Çalışma Notları**: Her oturuma opsiyonel kısa not eklenebilmeli
  - Acceptance: Not alanı isteğe bağlı; kaydedilen notlar geçmişte görülebilir
  
- [ ] `PR-103` **Zincir Kırılma Yönetimi**: Zincir kırıldığında kullanıcıyı geri kazanmak için ikinci şans mekanizması
  - Acceptance: Kullanıcıya ertesi gün "son şans" sunulur; kabul ederse zincir devam eder
  
- [ ] `PR-104` **Push Bildirimleri**: Günlük hatırlatma ve hedef saat yaklaşınca bildirim
  - Acceptance: Kullanıcı bildirim saatini ayarlayabilir; varsayılan 20:00

### Nice to Have (P2)

- [ ] `PR-201` **Konu/Ders Bazlı Takip**: Farklı dersler için ayrı zincirler
  - Acceptance: Kullanıcı ders ekleyebilir; her ders için ayrı çalışma süresi ve zincir takip edilir
  
- [ ] `PR-202` **Bulut Yedekleme**: İsteğe bağlı hesap oluşturarak verileri buluta yedekleme
  - Acceptance: Kullanıcı giriş yapabilir; veriler cihazlar arası senkronize olur
  
- [ ] `PR-203` **Odak Modu**: Çalışma sırasında dikkat dağıtıcıları engelleyen tam ekran modu
  - Acceptance: Odak modu açıldığında bildirimler susturulur; sadece kronometre görünür

## Tech Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Frontend | React Native | Cross-platform, öğrenciler hem iOS hem Android kullanıyor |
| State Management | Zustand | Basit, offline-first uyumlu |
| Local Storage | AsyncStorage + MMKV | Hızlı erişim, offline çalışma |
| Backend (opsiyonel) | Firebase / Supabase | Sadece yedekleme ve senkronizasyon için |
| Notifications | React Native Push Notification | Yerel bildirim desteği |

## Out of Scope

- Sosyal özellikler (arkadaşlarla yarışma, liderlik tablosu) — MVP sonrası değerlendirilecek
- Detaylı analitik ve raporlama — basit istatistikler yeterli
- Pomodoro tekniği entegrasyonu — sadece kronometre
- Web versiyonu — sadece mobil native
- Öğretmen/veli takip paneli — bireysel kullanım odaklı

## Success Criteria

- Kullanıcıların %60'ı ilk hafta içinde en az 3 gün çalışma kaydı oluşturur
- Ortalama günlük aktif kullanıcı (DAU) sayısı haftalık aktif kullanıcı (WAU) sayısının %40'ı üzerinde
- Uygulama mağazası puanı 4.5+ (5 üzerinden)
- Soğuk başlatma süresi < 2 saniye (ortalama cihazda)
- Çevrimdışı kullanımda veri kaybı oranı 0%

## Open Questions

1. Zincir kırıldığında kullanıcıyı geri kazanmak için "ikinci şans" mekanizması mı yoksa "kurtarma jetonu" sistemi mi daha iyi çalışır?
2. Push bildirim stratejisi: Sabit saat mi (örn: 20:00) yoksa son çalışma saatine göre dinamik mi?
3. Minimum çalışma süresi 30 dakika mı yoksa kullanıcı tarafından ayarlanabilir mi?
4. Haftalık hedef modunda "hafta sonu telafi" izin verilmeli mi?

## Summary (for downstream agents)

```yaml
feature: "student-study-tracker"
source_artifacts:
  analysis: ""
  brainstorm: "docs/new-product/brainstorm.md"
primary_user_problem: "Öğrenciler düzenli çalışma alışkanlığı edinemiyor ve çalışma sürelerini takip etmekte zorlanıyor"
solution_shape: "Basit, offline-first zincir (streak) uygulaması ile kaybetme korkusundan faydalanarak motivasyon sağlama"
p0_requirements:
  - id: "PR-001"
    summary: "Günlük çalışma kaydı (kronometre başlat/durdur/duraklat)"
  - id: "PR-002"
    summary: "Zincir sistemi (günlük 30 dk hedef, zincir artışı/sıfırlanması)"
  - id: "PR-003"
    summary: "Offline-first çalışma (yerel depolama, internet gerektirmez)"
  - id: "PR-004"
    summary: "Hızlı açılış (< 2 saniye)"
  - id: "PR-005"
    summary: "Basit istatistikler (günlük/haftalık/aylık süreler)"
p1_requirements:
  - id: "PR-101"
    summary: "Esnek zincir modu (haftada X gün)"
  - id: "PR-102"
    summary: "Çalışma notları (opsiyonel)"
  - id: "PR-103"
    summary: "Zincir kırılma yönetimi (ikinci şans)"
  - id: "PR-104"
    summary: "Push bildirimleri"
primary_flows_expected:
  - "Günlük çalışma başlatma ve kaydetme"
  - "Zincir görüntüleme ve hedef takibi"
  - "İstatistik görüntüleme"
  - "Ayarlar (esnek mod, bildirim saati)"
key_risks:
  - "Zincir kırılınca kullanıcı tamamen bırakabilir (demoralizasyon)"
  - "Çok basit kalıp kullanıcılar uzun vadede sıkılabilir"
  - "Offline-first yaklaşım bulut yedekleme beklentisi olan kullanıcıları üzebilir"
open_questions:
  - "Zincir kırılma geri kazanma mekanizması tasarımı"
  - "Push bildirim stratejisi (sabit vs dinamik saat)"
  - "Minimum çalışma süresi sabit mi ayarlanabilir mi?"
```

## Handoff Contract

Next Agent: `ux-designer`

Required Artifacts:
- `docs/new-product/prd.md` (this document)

Recommended Artifacts:
- `docs/new-product/brainstorm.md`

Critical Inputs:
- Problem: Öğrencilerin düzenli çalışma alışkanlığı eksikliği
- Solution: Zincir (streak) mekanizması ile motivasyon
- P0 requirements: PR-001, PR-002, PR-003, PR-004, PR-005
- Tech stack: React Native, offline-first, local storage

Sections That Must Not Change:
- Problem
- Solution
- P0 requirements (PR-001 through PR-005)
- Out of Scope

Mapping Rules:
- Her P0 requirement en az bir UX akışına veya kullanıcı hikayesine dönüştürülmeli
- "primary_flows_expected" listesindeki akışlar UX'te karşılık bulmalı
- Açık sorular (Open Questions) çözülene kadar görünür kalmalı
