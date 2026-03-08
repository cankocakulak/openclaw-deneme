# UX: Study Streak

## User Goal
Öğrenci, her gün mümkün olan en az sürtünmeyle çalışma oturumu başlatmak, ilerlemesini görmek ve streak'ini korumak istiyor.

## Visual Direction

### Tone & Feel
Destekleyici, sakin ve motive edici bir his vermeli. Rekabetçi değil; kişisel ilerlemeyi görünür kılan, küçük kazanımları öne çıkaran bir deneyim olmalı.

### Reference Apps
- **Duolingo** — streak motivasyonunun görünürlüğü ve günlük geri dönüş hissi
- **Headspace** — sakin, düşük stresli görsel dil
- **Google Fit** — günlük ilerleme göstergelerinin sadeliği

### Color Direction
- Primary: güven veren koyu mavi veya mor tonları
- Accent: CTA ve streak vurguları için enerjik yeşil/turuncu
- Semantic: başarı için yeşil, hata için kırmızı, uyarı için amber
- Neutral: açık arka planlar, yüksek okunabilirlik, yumuşak kart yüzeyleri

### Typography & Spacing
Mobil kullanım için okunaklı, orta yoğunlukta, nefes alan ama boşluk israf etmeyen düzen. Birincil metrikler büyük ve tek bakışta okunur olmalı.

## Primary Flows

### Flow Name: Start and complete a study session
- **User Goal**: Hızlıca çalışma oturumu başlatmak ve bitince sürenin kaydolduğunu görmek
- **Trigger**: Kullanıcı ana ekranda “Çalışmaya Başla” butonuna dokunur
- **Steps**:
  1. Kullanıcı ana ekrana gelir ve bugünkü toplam süre, streak ve hedef ilerlemesini görür.
  2. Kullanıcı “Çalışmaya Başla” CTA'ına dokunur.
  3. Aktif oturum ekranı veya kartı sayaçla görünür.
  4. Kullanıcı oturumu “Bitir” ile sonlandırır.
  5. Uygulama tamamlanan süreyi günlük toplamına ekler ve başarı geri bildirimi gösterir.
- **Edge Cases**:
  - Uygulama arka plana alınırsa oturum sürmeli veya güvenli biçimde geri yüklenmeli.
  - Kullanıcı oturumu çok kısa sürede bitirirse streak'e sayılıp sayılmadığı net açıklanmalı.
- **Success State**: Güncellenmiş günlük toplam, streak ve hedef ilerlemesi ana ekranda görünür.
- **PRD Requirement References**:
  - `PR-001`
  - `PR-002`
  - `PR-006`

### Flow Name: Review today's progress and active streak
- **User Goal**: Bugün ne kadar çalıştığını ve streak'inin durumunu tek bakışta anlamak
- **Trigger**: Kullanıcı uygulamayı açar veya oturum bitirir
- **Steps**:
  1. Ana ekranda bugünkü toplam süre büyük metrik olarak görünür.
  2. Streak kartı aktif gün sayısını ve bugün tamamlanma durumunu gösterir.
  3. Günlük hedef ilerleme barı veya halka göstergesi kalan süreyi açıklar.
- **Edge Cases**:
  - Henüz hiç oturum yoksa boş durum motive edici dille gösterilmeli.
  - Streak yeni kırıldıysa suçlayıcı değil destekleyici mesaj kullanılmalı.
- **Success State**: Kullanıcı mevcut durumunu yorum yapmadan anlayabilir.
- **PRD Requirement References**:
  - `PR-002`
  - `PR-003`
  - `PR-004`
  - `PR-005`

### Flow Name: Set or update a daily goal
- **User Goal**: Günlük hedefini kendi temposuna göre ayarlamak
- **Trigger**: Kullanıcı hedef alanına veya ayar aksiyonuna dokunur
- **Steps**:
  1. Kullanıcı hedef düzenleme yüzeyini açar.
  2. Dakika bazlı hedef seçer veya düzenler.
  3. Uygulama yeni hedefi kaydeder.
  4. Ana ekrandaki ilerleme göstergesi güncellenir.
- **Edge Cases**:
  - Çok düşük veya aşırı yüksek hedefler için yönlendirici mikro kopya gösterilmeli.
- **Success State**: Yeni hedef görünür ve günlük ilerleme buna göre hesaplanır.
- **PRD Requirement References**:
  - `PR-004`

### Flow Name: Recover after a broken streak
- **User Goal**: Zincir bozulduktan sonra motivasyon kaybetmeden yeniden başlamak
- **Trigger**: Kullanıcı streak kırılmış halde uygulamayı açar
- **Steps**:
  1. Ana ekran streak kartında mevcut durum açıkça gösterilir.
  2. Destekleyici bir mesaj, bugün yeni bir seri başlatabileceğini söyler.
  3. Birincil CTA tekrar “Çalışmaya Başla” olarak öne çıkar.
- **Edge Cases**:
  - Kullanıcı birkaç gün hiç çalışmadıysa geçmiş başarısını aşağılamayan ton korunmalı.
- **Success State**: Kullanıcı yeniden oturum başlatmaya yönelir.
- **PRD Requirement References**:
  - `PR-003`
  - `PR-005`

## Screen/Component Breakdown

### Home Screen
- **Purpose**: Günlük çalışma durumunu ve ana aksiyonu göstermek
- **Layout**: Üstte streak kartı, ortada bugünkü süre, altında hedef ilerleme ve ana CTA
- **Key elements**: Günlük toplam süre, streak sayısı, hedef progress göstergesi, başlat/durdur butonu
- **Primary action**: Çalışma oturumu başlatmak veya bitirmek
- **Edge cases**: İlk kullanım boş durumu, streak kırılmış durumu, veri yükleniyor durumu
- **Flow References**:
  - `[Start and complete a study session]`
  - `[Review today's progress and active streak]`
  - `[Recover after a broken streak]`
- **PRD Requirement References**:
  - `PR-001`
  - `PR-002`
  - `PR-003`
  - `PR-004`
  - `PR-005`

### Active Session State
- **Purpose**: Devam eden çalışmayı görünür ve yönetilebilir kılmak
- **Layout**: Büyük sayaç, oturum durumu, bitirme aksiyonu
- **Key elements**: Geçen süre, aktif durum etiketi, bitir butonu
- **Primary action**: Oturumu sonlandırmak
- **Edge cases**: Uygulama arka plana giderse geri dönüş durumu, yanlışlıkla çıkış
- **Flow References**:
  - `[Start and complete a study session]`
- **PRD Requirement References**:
  - `PR-001`
  - `PR-006`

### Goal Editor
- **Purpose**: Günlük hedefi belirlemek veya güncellemek
- **Layout**: Basit sayı seçici veya ön tanımlı dakikalar listesi
- **Key elements**: Hedef dakika seçimi, kaydet butonu, rehber kopya
- **Primary action**: Yeni hedef kaydetmek
- **Edge cases**: Geçersiz değer, aşırı iddialı hedef önerisi
- **Flow References**:
  - `[Set or update a daily goal]`
- **PRD Requirement References**:
  - `PR-004`

### Recent History Preview
- **Purpose**: Son günlerin çalışma özetini hızlı göstermek
- **Layout**: Basit liste veya kısa gün kartları
- **Key elements**: Gün, toplam süre, hedefe ulaşıldı mı bilgisi
- **Primary action**: Geçmişi incelemek
- **Edge cases**: Henüz geçmiş veri yok
- **Flow References**:
  - `[Review today's progress and active streak]`
- **PRD Requirement References**:
  - `PR-101`

## Interaction Patterns
- Ana CTA durum odaklı olmalı: oturum yoksa “Çalışmaya Başla”, aktifse “Bitir”.
- Oturum bitince anlık olumlu geri bildirim ve güncellenmiş metrikler gösterilmeli.
- İlerleme göstergesi sayısal değer + görsel progress ile birlikte sunulmalı.
- Yükleniyor durumlarında iskelet/placeholder kullanılmalı.
- Kritik bilgi kartları bir ekrana sığmalı; scroll ikinci planda olmalı.

## Copy Direction
- Primary CTA: “Çalışmaya Başla”
- Session end CTA: “Bitir”
- Empty state: “Bugün ilk çalışma oturumunu başlat, streak’ini oluşturmaya başla.”
- Recovery message: “Dün kaçmış olabilir. Sorun değil — bugün yeniden başla.”
- Goal helper: “Kendine gerçekçi bir günlük hedef seç.”
- Progress label: “Bugünkü hedefin”
- Success feedback: “Harika, bugünkü toplam sürene eklendi.”

## Accessibility
- Dokunmatik hedefler minimum rahat parmak boyutunda olmalı.
- Renk tek başına durum belirtmemeli; metin ve ikon desteği kullanılmalı.
- Screen reader için streak, hedef ve toplam süre ayrı ve anlamlı okunmalı.
- Sayaç güncellemeleri erişilebilirlik açısından gereksiz gürültü yaratmadan duyurulmalı.
- Kontrast seviyeleri mobil dış mekân kullanımını da kaldırmalı.

## Summary (for downstream agents)

```yaml
feature: "Study Streak"
source_artifacts:
  prd: "docs/product-delegated-context/prd.md"
  analysis: "docs/product-delegated-context/analysis.md"
primary_flows:
  - name: "Start and complete a study session"
    prd_requirements: ["PR-001", "PR-002", "PR-006"]
  - name: "Review today's progress and active streak"
    prd_requirements: ["PR-002", "PR-003", "PR-004", "PR-005"]
  - name: "Set or update a daily goal"
    prd_requirements: ["PR-004"]
  - name: "Recover after a broken streak"
    prd_requirements: ["PR-003", "PR-005"]
screens:
  - name: "Home Screen"
    flows: ["Start and complete a study session", "Review today's progress and active streak", "Recover after a broken streak"]
  - name: "Active Session State"
    flows: ["Start and complete a study session"]
  - name: "Goal Editor"
    flows: ["Set or update a daily goal"]
  - name: "Recent History Preview"
    flows: ["Review today's progress and active streak"]
p0_requirements_covered:
  - "PR-001"
  - "PR-002"
  - "PR-003"
  - "PR-004"
  - "PR-005"
  - "PR-006"
key_risks:
  - "If streak logic is unclear, recovery UX will feel manipulative or confusing"
  - "If the home screen becomes crowded, the one-tap session goal will be weakened"
```

## Handoff Contract

Next Agent: `user-stories`

Required Artifacts:
- `docs/product-delegated-context/prd.md`
- `docs/product-delegated-context/ux.md`

Recommended Artifacts:
- `docs/product-delegated-context/analysis.md`

Critical Inputs:
- User goal
- Primary flows
- Screen/component breakdown
- Interaction patterns
- Copy direction
- Accessibility requirements

Sections That Must Not Change:
- User Goal
- Primary Flows
- Screen/Component Breakdown
- Interaction Patterns

Mapping Rules:
- Every primary flow must map to at least one story.
- Every screen/component referenced by a flow must appear in at least one story.
- Every P0 requirement referenced from the PRD must remain covered here.
