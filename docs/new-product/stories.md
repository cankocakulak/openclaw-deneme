# User Stories: Zincir - Öğrenci Çalışma Takip Uygulaması

## Epic Summary
Basit, offline çalışan bir zincir (streak) uygulaması ile öğrencilere düzenli çalışma alışkanlığı kazandırmak; kaybetme korkusu (loss aversion) psikolojisinden faydalanarak motivasyon sağlamak.

## Stories

### P0 ZINCIR-001: Günlük Çalışma Oturumu Başlatma ve Yönetme
**As a** öğrenci  
**I want** çalışma oturumumu başlatıp, duraklatıp ve bitirebilmek  
**So that** günlük çalışma süremi kaydedebileyim ve zincirimi koruyabileyim

**PRD Requirement References:** `PR-001`, `PR-004`  
**UX Flow References:** `Günlük Çalışma Başlatma ve Kaydetme`  
**Dependencies:** None  
**Implementation Boundary:** 
- İçerir: Ana ekrandan kronometre ekranına geçiş, başlat/duraklat/bitir kontrolleri, süre kaydı
- Hariç: İstatistik görüntüleme, not ekleme (P1), arka plan bildirimleri (P1)

**Acceptance Criteria:**
- [ ] Given kullanıcı ana ekrandayken, when "Başla" butonuna basarsa, then kronometre ekranı açılır ve sayaç 00:00'dan başlar
- [ ] Given kronometre çalışırken, when kullanıcı "Duraklat"a basarsa, then sayaç donar ve "Devam Et" butonu görünür
- [ ] Given kronometre duraklatıldığında, when "Devam Et"e basarsa, then sayaç kaldığı yerden devam eder
- [ ] Given kronometre çalışırken veya duraklatıldığında, when "Bitir"e basarsa, then süre kaydedilir ve ana ekrana dönülür
- [ ] Given uygulama soğuk başlatıldığında, when kullanıcı açarsa, then ana ekran 2 saniyeden kısa sürede görünür
- [ ] Given aynı gün içinde, when bir oturum zaten aktifken yeni başlatma denenirse, then mevcut oturuma devam edilir veya uyarı gösterilir

**Notes:** 
- Sayaç formatı: mm:ss (72px+ monospaced font)
- Çok uzun süreler için saat formatı: 1:23:45
- Uygulama arka plandayken sayaç çalışmaya devam etmeli (PR-001 kapsamında temel implementasyon)

---

### P0 ZINCIR-002: Zincir Sistemi ve Görsel Gösterimi
**As a** öğrenci  
**I want** çalışma hedefimi tutturduğumda zincirimin arttığını ve kırıldığında sıfırlandığını görmek  
**So that** motivasyonum kaybetme korkusuyla sürdürülebilir

**PRD Requirement References:** `PR-002`  
**UX Flow References:** `Zincir Görüntüleme ve Hedef Takibi`  
**Dependencies:** `ZINCIR-001` (çalışma süresi kaydı)  
**Implementation Boundary:**
- İçerir: Günlük 30 dk hedef kontrolü, zincir artışı/sıfırlanması, ana ekranda zincir gösterimi, hedef tamamlama onayı
- Hariç: İkinci şans mekanizması (P1), esnek mod (P1), konu bazlı zincirler (P2)

**Acceptance Criteria:**
- [ ] Given kullanıcı ana ekrandayken, when bakarsa, then mevcut zincir sayısı büyük olarak görünür (örn: "15 günlük zincir")
- [ ] Given kullanıcı bugün 30 dk çalışmayı tamamladığında, when oturumu bitirirse, then zincir 1 artar ve yeşil onay gösterilir
- [ ] Given kullanıcı bir günü kaçırırsa (30 dk hedef tutturulmadan gün biter), when ertesi gün uygulamayı açarsa, then zincir sıfırlanır ve "Zinciriniz kırıldı" mesajı görünür
- [ ] Given hedef tamamlandığında, when zincir artarsa, then hafif titreşim (haptic) ve sayı animasyonu (count up) gösterilir
- [ ] Given hedef tamamlandığında, when kullanıcı ana ekrandaysa, then "Tebrikler! Zinciriniz devam ediyor." toast mesajı görünür
- [ ] Given zincir kırılma riski varsa (gün bitmek üzere, hedef tamamlanmadı), when kullanıcı ana ekrandaysa, then turuncu uyarı banner'ı görünür: "Bugünkü zincirinizi korumak için X saatiniz var"

**Notes:**
- Minimum çalışma süresi: 30 dk (varsayılan, P2'de ayarlanabilir olabilir)
- Hedef tamamlanmadan bitirilen oturumlar süreye eklenir ama zincir artmaz
- Yeni kullanıcı: "0 günlük zincir", "Başlamak için hazır!"

---

### P0 ZINCIR-003: Offline-First Veri Depolama
**As a** öğrenci  
**I want** uygulamamın internet olmadan çalışmasını ve verilerimin yerel olarak saklanmasını  
**So that** her zaman ve her yerde çalışma kaydı yapabilirim, veri kaybı yaşamam

**PRD Requirement References:** `PR-003`  
**UX Flow References:** `Günlük Çalışma Başlatma`, `İstatistik Görüntüleme`  
**Dependencies:** `ZINCIR-001` (veri kaydetme)  
**Implementation Boundary:**
- İçerir: Tüm verilerin AsyncStorage/MMKV'de saklanması, offline çalışma garantisi, veri kaybı önleme
- Hariç: Bulut yedekleme (P2), cihazlar arası senkronizasyon (P2), internet bağlantısı kontrolü (gerekmez)

**Acceptance Criteria:**
- [ ] Given cihaz uçak modundayken, when kullanıcı uygulamayı açarsa, then tüm özellikler (kronometre, zincir, istatistikler) çalışır
- [ ] Given uçak modundayken, when çalışma oturumu başlatılıp bitirilirse, then süre kaydedilir ve zincir güncellenir
- [ ] Given uygulama kapatılıp açıldığında, when kullanıcı tekrar girerse, then tüm önceki veriler korunur
- [ ] Given telefon aniden kapanırsa, when uygulama tekrar açılırsa, then son kaydedilen süre korunur (tamamlanmamış oturum kaybolabilir)
- [ ] Given veri kaydedilirken bir hata oluşursa, when kullanıcıya bildirilirse, then "Bir hata oluştu. Verileriniz güvende, lütfen tekrar deneyin." mesajı gösterilir

**Notes:**
- Veri kaybı oranı: %0 hedefi (Success Criteria)
- Tüm veriler yerel; internet kontrolü yapılmaz (her zaman offline mod)
- Veri yapısı: günlük oturumlar, zincir durumu, kullanıcı tercihleri

---

### P0 ZINCIR-004: Basit İstatistikler Görüntüleme
**As a** öğrenci  
**I want** günlük, haftalık ve aylık çalışma sürelerimi görmek  
**So that** ilerlememi takip edebilir ve motivasyonumu sürdürebilirim

**PRD Requirement References:** `PR-005`  
**UX Flow References:** `İstatistik Görüntüleme`, `Zincir Görüntüleme`  
**Dependencies:** `ZINCIR-001` (çalışma verisi), `ZINCIR-003` (veri depolama)  
**Implementation Boundary:**
- İçerir: Ana ekranda özet istatistikler, İstatistikler sekmesinde detaylı görünüm, haftalık grafik, en uzun zincir rekoru
- Hariç: Aylık grafik (opsiyonel), detaylı analitik (out of scope), ders bazlı istatistikler (P2)

**Acceptance Criteria:**
- [ ] Given kullanıcı ana ekrandayken, when bakarsa, then "Bugün: X dakika" ve "Bu Hafta: X saat X dk" görünür
- [ ] Given kullanıcı İstatistikler sekmesine geçtiğinde, when bakarsa, then üç özet kart görünür: Bugün, Bu Hafta, Bu Ay
- [ ] Given İstatistikler ekranı açıkken, when bakarsa, then son 7 günün çubuk grafikleri görünür
- [ ] Given yeterli veri yoksa (yeni kullanıcı), when İstatistikler ekranı açılır, then "Henüz çalışma kaydınız yok. İlk kaydınızı oluşturduğunuzda burada görünecek." mesajı görünür
- [ ] Given kullanıcı İstatistikler ekranındaysa, when bakarsa, then "En Uzun Zincir" rekoru görünür
- [ ] Given veriler offline'dan geliyorsa, when İstatistikler gösterilirse, then "Son güncelleme: X" bilgisi görünür (opsiyonel)

**Notes:**
- Haftalık görünüm: Pazartesi'nden Pazar'a (veya kullanıcının hafta başı tercihi)
- Boş durum: İllüstrasyon + davet mesajı
- Grafikler: Basit çubuk grafik, interaktif değil (tıklanmaz)

---

### P0 ZINCIR-005: Haftalık İlerleme Takvimi
**As a** öğrenci  
**I want** haftalık olarak hangi günleri tamamladığımı görmek  
**So that** haftalık ilerlememi görsel olarak takip edebilirim

**PRD Requirement References:** `PR-002`, `PR-005`  
**UX Flow References:** `Zincir Görüntüleme ve Hedef Takibi`  
**Dependencies:** `ZINCIR-002` (zincir sistemi)  
**Implementation Boundary:**
- İçerir: Ana ekranda 7 günlük takvim göstergesi, tamamlanan/bekleyen/bugün gösterimi
- Hariç: Geçmiş haftalara gezinme (opsiyonel), takvim detayları (tıklanabilir günler)

**Acceptance Criteria:**
- [ ] Given kullanıcı ana ekrandayken, when bakarsa, then haftalık 7 günün durumunu gösteren göstergeler görünür
- [ ] Given bir gün hedef tamamlandığında, when o gün bittiğinde, then ilgili gün "tamamlandı" olarak işaretlenir (yeşil/amber)
- [ ] Given bir gün hedef tamamlanmadan bittiğinde, when ertesi gün olunduğunda, then o gün "kaçırıldı" olarak işaretlenir (gri/kırmızı)
- [ ] Given bugün aktifse, when hedef tamamlanmadıysa, then "bugün" özel olarak işaretlenir (amber/vurgulu)
- [ ] Given yeni kullanıcı ilk kez açtığında, when ana ekran görünürse, then tüm günler "bekliyor" durumunda görünür

**Notes:**
- Gün göstergeleri: Basit noktalar, küçük kareler veya mini halkalar
- Hafta başı: Pazartesi (Türkiye için)
- Görsel: Tamamlandı = dolu renk, Bekliyor = boş/beyaz, Bugün = vurgulu

---

### P1 ZINCIR-101: Esnek Zincir Modu (Haftada X Gün)
**As a** öğrenci  
**I want** günlük değil, haftada belirli gün sayısı hedefi koyabilmek  
**So that** daha esnek bir çalışma rutini izleyebilirim (örn: haftada 5 gün)

**PRD Requirement References:** `PR-101`  
**UX Flow References:** `Ayarlar ve Tercihler`  
**Dependencies:** `ZINCIR-002` (temel zincir sistemi)  
**Implementation Boundary:**
- İçerir: Ayarlardan mod değişimi, haftalık hedef takibi, esnek mod UI gösterimi
- Hariç: Mevcut zincirin mod değişiminde nasıl etkileneceği (ürün kararı gerektirir)

**Acceptance Criteria:**
- [ ] Given kullanıcı Ayarlar ekranındayken, when "Mod Seçimi"ne bakarsa, then "Günlük Zincir" ve "Esnek Zincir" seçenekleri görünür
- [ ] Given "Esnek Zincir" seçildiğinde, when kullanıcı ayarlarsa, then haftada 5 veya 6 gün seçebilir
- [ ] Given Esnek Mod aktifken, when kullanıcı ana ekrandaysa, then "Bu hafta: X/5 gün tamamlandı" görünür
- [ ] Given Esnek Mod aktifken, when haftalık hedef tamamlanmadan hafta biterse, then zincir kırılır
- [ ] Given Esnek Mod aktifken, when haftalık hedef tamamlanırsa ve fazladan çalışılırsa, then ekstra günler "bonus" olarak işaretlenir (opsiyonel)

**Notes:**
- Varsayılan esnek hedef: Haftada 5 gün
- Mod değişikliğinde mevcut zincirin korunup korunmayacağı ürün kararı
- Haftalık takvim: Tamamlanan günler yeşil, kalan günler amber

---

### P1 ZINCIR-102: Çalışma Notları Ekleme
**As a** öğrenci  
**I want** çalışma oturumlarıma kısa notlar ekleyebilmek  
**So that** ne çalıştığımı hatırlayabilirim ve ilerlememi daha iyi takip edebilirim

**PRD Requirement References:** `PR-102`  
**UX Flow References:** `Günlük Çalışma Başlatma`  
**Dependencies:** `ZINCIR-001` (kronometre ekranı)  
**Implementation Boundary:**
- İçerir: Kronometre ekranında "+ Not" linki, not girişi modalı, notların kaydedilmesi, geçmişte görüntüleme
- Hariç: Not arama, not kategorileri, detaylı not yönetimi

**Acceptance Criteria:**
- [ ] Given kullanıcı kronometre ekranındayken, when bakarsa, then "+ Not" linki görünür (opsiyonel)
- [ ] Given "+ Not"a basıldığında, when modal açılırsa, then 140 karakter sınırlı metin girişi görünür
- [ ] Given not girilip kaydedildiğinde, when oturum bitirilirse, then not o oturumla birlikte kaydedilir
- [ ] Given kullanıcı İstatistikler/Geçmiş ekranındaysa, when bir güne bakarsa, then o güne ait notlar görünür (varsa)
- [ ] Given not eklenmemişse, when oturum bitirilirse, then bu zorunlu değildir, kayıt sorunsuz tamamlanır

**Notes:**
- Not alanı tamamen isteğe bağlı
- Karakter sınırı: 140 (tweet benzeri, kısa ve öz)
- Notlar: Hangi konu çalışıldı, hangi sayfa/bitirildi vb.

---

### P1 ZINCIR-103: Zincir Kırılma Yönetimi (İkinci Şans)
**As a** öğrenci  
**I want** zincirim kırıldığında bir kez telafi şansı verilmesini  
**So that** küçük bir aksaklık tüm motivasyonumu yok etmesin

**PRD Requirement References:** `PR-103`  
**UX Flow References:** `Zincir Görüntüleme`, `Zincir Kırılma Dialog'u`  
**Dependencies:** `ZINCIR-002` (zincir kırılma tespiti)  
**Implementation Boundary:**
- İçerir: Zincir kırılma dialogu, ikinci şans teklifi, kurtarma mekanizması, bir kez kullanım sınırı
- Hariç: Kurtarma jetonu sistemi (alternatif), birden fazla ikinci şans

**Acceptance Criteria:**
- [ ] Given zincir kırıldığında (bir gün kaçırıldı), when kullanıcı ertesi gün uygulamayı açarsa, then "Zinciriniz Kırıldı" modalı görünür
- [ ] Given modal açıkken, when kullanıcı bakarsa, then "X günlük zincirinizi kaçırdınız" mesajı ve iki seçenek görünür
- [ ] Given "Bugün çalışıp devam et" seçeneği seçildiğinde, when kullanıcı bugün 30 dk çalışırsa, then zincir kırılmaz, devam eder
- [ ] Given ikinci şans kullanıldığında, when daha sonra bir gün daha kaçırılırsa, then zincir kırılır, ikinci şans teklif edilmez
- [ ] Given "Yeni başlangıç yap" seçeneği seçildiğinde, when onay verilirse, then zincir sıfırlanır ve yeni zincir başlar
- [ ] Given ikinci şans teklifi gösterildiğinde, when kullanıcı reddederse veya kabul edip çalışmazsa, then zincir kırılır

**Notes:**
- İkinci şans sadece bir kez kullanılabilir (hayatta bir kez veya periyot başına)
- Alternatif: "Kurtarma jetonu" sistemi (PRD Open Questions)
- Mesaj tonu: Üzücü ama motive edici, suçlayıcı değil

---

### P1 ZINCIR-104: Push Bildirimleri
**As a** öğrenci  
**I want** günlük çalışma hatırlatması ve hedef saat yaklaşınca bildirim almak  
**So that** çalışma alışkanlığımı sürdürebilirim ve zincirimi kaçırmam

**PRD Requirement References:** `PR-104`  
**UX Flow References:** `Ayarlar ve Tercihler`  
**Dependencies:** `ZINCIR-002` (hedef takibi)  
**Implementation Boundary:**
- İçerir: Günlük hatırlatma bildirimi, hedef saat yaklaşınca uyarı, bildirim saati ayarı, izin yönetimi
- Hariç: Dinamik bildirim saati (son çalışmaya göre), sosyal bildirimler

**Acceptance Criteria:**
- [ ] Given kullanıcı Ayarlar ekranındaysa, when bildirimler bölümüne bakarsa, then bildirim saati ayarlayabilir (varsayılan: 20:00)
- [ ] Given bildirimler açıkken, when ayarlanan saat gelirse, then "Bugünkü çalışmanızı yapmayı unutmayın!" bildirimi gösterilir
- [ ] Given zincir kırılma riski varsa (gece yarısına X saat kala, hedef tamamlanmadı), when kritik saat gelirse, then "Zincirinizi korumak için X saatiniz var!" bildirimi gösterilir
- [ ] Given kullanıcı bildirim iznini reddettiğinde, when Ayarlar ekranına bakarsa, then manuel yönlendirme talimatı görünür
- [ ] Given bildirim ayarlandığında, when kullanıcı kaydederse, then ayar yerel olarak saklanır ve uygulanır

**Notes:**
- Bildirim stratejisi: Sabit saat (varsayılan 20:00) veya dinamik (PRD Open Questions)
- Kritik uyarı: Gece yarısından önce son 2-3 saat
- Arka plan bildirimleri: React Native Push Notification

---

## Coverage Map

### PRD Requirement Coverage

| PRD ID | Story ID(lar) | Notlar |
|--------|---------------|--------|
| `PR-001` | `ZINCIR-001` | Günlük çalışma kaydı (başlat/durdur/duraklat) |
| `PR-002` | `ZINCIR-002`, `ZINCIR-005` | Zincir sistemi + haftalık takvim |
| `PR-003` | `ZINCIR-003` | Offline-first çalışma |
| `PR-004` | `ZINCIR-001` | Hızlı açılış (< 2 sn) |
| `PR-005` | `ZINCIR-004`, `ZINCIR-005` | Basit istatistikler |
| `PR-101` | `ZINCIR-101` | Esnek zincir modu |
| `PR-102` | `ZINCIR-102` | Çalışma notları |
| `PR-103` | `ZINCIR-103` | Zincir kırılma yönetimi |
| `PR-104` | `ZINCIR-104` | Push bildirimleri |

### UX Flow Coverage

| UX Flow | Story ID(lar) | Notlar |
|---------|---------------|--------|
| `Günlük Çalışma Başlatma ve Kaydetme` | `ZINCIR-001`, `ZINCIR-102` | Kronometre + notlar |
| `Zincir Görüntüleme ve Hedef Takibi` | `ZINCIR-002`, `ZINCIR-005`, `ZINCIR-103` | Zincir + takvim + kırılma |
| `İstatistik Görüntüleme` | `ZINCIR-004` | İstatistikler ekranı |
| `Ayarlar ve Tercihler` | `ZINCIR-101`, `ZINCIR-104` | Esnek mod + bildirimler |

### Screen Coverage

| Screen | Story ID(lar) |
|--------|---------------|
| Ana Ekran (Home) | `ZINCIR-001`, `ZINCIR-002`, `ZINCIR-004`, `ZINCIR-005` |
| Kronometre Ekranı | `ZINCIR-001`, `ZINCIR-102` |
| İstatistikler Ekranı | `ZINCIR-004` |
| Ayarlar Ekranı | `ZINCIR-101`, `ZINCIR-104` |
| Zincir Kırılma Dialog'u | `ZINCIR-103` |

## Summary (for downstream agents)

```yaml
feature: "zincir-study-tracker"
source_artifacts:
  prd: "docs/new-product/prd.md"
  ux: "docs/new-product/ux.md"
story_ids:
  p0: 
    - "ZINCIR-001"
    - "ZINCIR-002"
    - "ZINCIR-003"
    - "ZINCIR-004"
    - "ZINCIR-005"
  p1:
    - "ZINCIR-101"
    - "ZINCIR-102"
    - "ZINCIR-103"
    - "ZINCIR-104"
coverage:
  prd_requirements:
    PR-001: ["ZINCIR-001"]
    PR-002: ["ZINCIR-002", "ZINCIR-005"]
    PR-003: ["ZINCIR-003"]
    PR-004: ["ZINCIR-001"]
    PR-005: ["ZINCIR-004", "ZINCIR-005"]
    PR-101: ["ZINCIR-101"]
    PR-102: ["ZINCIR-102"]
    PR-103: ["ZINCIR-103"]
    PR-104: ["ZINCIR-104"]
  ux_flows:
    "Günlük Çalışma Başlatma": ["ZINCIR-001", "ZINCIR-102"]
    "Zincir Görüntüleme": ["ZINCIR-002", "ZINCIR-005", "ZINCIR-103"]
    "İstatistik Görüntüleme": ["ZINCIR-004"]
    "Ayarlar ve Tercihler": ["ZINCIR-101", "ZINCIR-104"]
dependencies:
  ZINCIR-002: ["ZINCIR-001"]
  ZINCIR-003: ["ZINCIR-001"]
  ZINCIR-004: ["ZINCIR-001", "ZINCIR-003"]
  ZINCIR-005: ["ZINCIR-002"]
  ZINCIR-101: ["ZINCIR-002"]
  ZINCIR-102: ["ZINCIR-001"]
  ZINCIR-103: ["ZINCIR-002"]
  ZINCIR-104: ["ZINCIR-002"]
implementation_risks:
  - "ZINCIR-002: Zincir kırılma demoralizasyonu - ikinci şans (ZINCIR-103) kritik"
  - "ZINCIR-003: Veri kaybı riski - robust error handling gerekli"
  - "ZINCIR-101: Esnek mod geçişi - mevcut zincirin nasıl etkileneceği net değil"
  - "ZINCIR-104: Push bildirimleri - cihaz izin yönetimi karmaşık olabilir"
personas:
  - "öğrenci"
platform: "mobile"
framework: "react-native"
```

## Handoff Contract

Next Agent: `task-planner`

Required Artifacts:
- `docs/new-product/stories.md` (this document)
- `docs/new-product/prd.md`
- `docs/new-product/ux.md`

Recommended Artifacts:
- `docs/new-product/brainstorm.md`

Critical Inputs:
- Story ordering: P0 stories first, dependencies respected
- Story IDs: ZINCIR-001 through ZINCIR-104 (stable)
- Acceptance criteria: Given/When/Then format, testable
- Dependencies: Explicit mapping for task sequencing
- Implementation boundaries: Clear in/out scope per story
- Coverage map: All P0 PRD requirements and UX flows covered

Sections That Must Not Change:
- Story IDs (ZINCIR-XXX format)
- Acceptance criteria intent (testable conditions)
- Dependencies (ordering constraints)
- Implementation Boundary definitions
- Coverage Map (traceability to PRD/UX)

Mapping Rules:
- Every P0 PRD requirement (PR-001..PR-005) maps to at least one story
- Every primary UX flow maps to at least one story
- Every screen/component appears in at least one story
- Dependencies must be preserved for task ordering
- Stories are independently implementable where possible

P0 Implementation Order Recommendation:
1. `ZINCIR-003` (Offline storage foundation)
2. `ZINCIR-001` (Core timer functionality)
3. `ZINCIR-002` (Streak system)
4. `ZINCIR-005` (Weekly calendar)
5. `ZINCIR-004` (Statistics display)
