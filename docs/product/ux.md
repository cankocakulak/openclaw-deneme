# UX: Study Streak Mobile App

## User Goal
Öğrenci, günlük çalışma süresini hızlıca başlatıp takip etmek, günlük hedefine ne kadar kaldığını görmek ve streak’ini kaybetmeden düzenli çalışma alışkanlığı sürdürmek istiyor.

## Visual Direction

### Tone & Feel
Odaklı, temiz, motive edici ve hafif oyunlaştırılmış bir his vermeli. Uygulama ciddi bir productivity aracı gibi güven vermeli ama baskıcı değil; her açılışta “bugün de devam edebilirim” hissi üretmeli.

### Reference Apps
- **Duolingo** — streak görünürlüğü ve günlük motivasyon tonu için
- **Forest** — odak seansı hissi ve sade çalışma başlatma deneyimi için
- **Headspace** — sakin, temiz ve sürtünmesi düşük mobil akışlar için

### Color Direction
- Primary: derin mavi veya mor tonları; odak ve güven hissi için
- Accent: canlı yeşil; streak ve hedef tamamlanma feedback’i için
- Semantic: success yeşil, error kırmızı, warning amber, info mavi
- Neutral: açık arka plan, güçlü kontrastlı metin, yumuşak border tonları

### Typography & Spacing
Okunabilir, mobilde rahat taranan bir tipografi kullanılmalı. Kart tabanlı, ferah ama çok boş olmayan; tek bakışta günlük durumun anlaşılabildiği orta yoğunlukta bir arayüz tercih edilmeli.

## Primary Flows

### Flow Name: Start Study Session
- **User Goal**: Hızlıca çalışma seansı başlatmak ve geçen süreyi görmek
- **Trigger**: Kullanıcı ana ekranda “Çalışmaya Başla” butonuna dokunur
- **Steps**:
  1. Kullanıcı ana ekranda mevcut streak, günlük hedef ve bugünkü ilerlemeyi görür
  2. “Çalışmaya Başla” butonuna basar
  3. Aktif seans ekranında geçen süre, durdur butonu ve opsiyonel ders etiketi görünür
  4. Kullanıcı seansı bitirir
  5. Uygulama günlük toplam süreyi ve hedef ilerlemesini günceller
- **Edge Cases**:
  - İlk kullanımda hiç veri yoksa boş durum mesajı gösterilir
  - Uygulama arka plana giderse seans durumu korunur
  - Seans çok kısa sürerse kullanıcıya kaydetme onayı gösterilebilir
- **Success State**: Seans süresi kaydedilmiş, günlük ilerleme güncellenmiş olur
- **PRD Requirement References**:
  - `PR-001`
  - `PR-002`
  - `PR-005`

### Flow Name: Set or Adjust Daily Goal
- **User Goal**: Günlük çalışma hedefini belirlemek veya değiştirmek
- **Trigger**: Kullanıcı ana ekrandan hedef kartına veya ayar aksiyonuna dokunur
- **Steps**:
  1. Kullanıcı mevcut günlük hedef kartını açar
  2. Dakika bazlı hedef seçer veya düzenler
  3. Kaydet aksiyonunu tamamlar
  4. Ana ekranda yeni hedef ve kalan süre güncellenir
- **Edge Cases**:
  - Hedef sıfır veya anlamsız derecede düşük/yüksek ise validasyon gösterilir
  - Kullanıcı aktif seans sırasında hedef değiştirirse günlük ilerleme yeniden hesaplanır
- **Success State**: Günlük hedef güncellenir ve ilerleme metrikleri buna göre görünür
- **PRD Requirement References**:
  - `PR-002`
  - `PR-005`

### Flow Name: Review Streak and Daily Progress
- **User Goal**: Bugünkü durumu ve streak’in devam edip etmediğini anlamak
- **Trigger**: Kullanıcı uygulamayı açar veya ana ekrana döner
- **Steps**:
  1. Kullanıcı ana ekranda streak sayısını görür
  2. Günlük hedef ilerleme çubuğunu görür
  3. Bugünkü toplam çalışılan süreyi inceler
  4. Hedef tamamlandıysa başarı durumu mesajını görür
- **Edge Cases**:
  - Streak hiç yoksa teşvik eden başlangıç mesajı gösterilir
  - Streak kırıldıysa suçlayıcı olmayan toparlayıcı mesaj gösterilir
- **Success State**: Kullanıcı günlük durumunu ve streak konumunu tek ekranda anlar
- **PRD Requirement References**:
  - `PR-002`
  - `PR-003`
  - `PR-004`
  - `PR-005`

### Flow Name: Review Recent Study Summary
- **User Goal**: Son günlerdeki çalışma düzenini hızlıca görmek
- **Trigger**: Kullanıcı ana ekrandan özet bölümüne kaydırır veya ilgili karta dokunur
- **Steps**:
  1. Kullanıcı son 7 güne ait toplam çalışma özetini görür
  2. Gün bazlı kısa liste veya mini grafik inceler
  3. En güçlü / zayıf günleri fark eder
- **Edge Cases**:
  - Veri azsa “henüz yeterli veri yok” mesajı gösterilir
  - Boş geçmişte rehber copy sunulur
- **Success State**: Kullanıcı yakın dönem ilerlemesini yorumlayabilir
- **PRD Requirement References**:
  - `PR-004`
  - `PR-103`

## Screen/Component Breakdown

### Home Dashboard
- **Purpose**: Günlük hedef, streak ve hızlı seans başlatmayı tek yerde toplamak
- **Layout**: Üstte selamlama ve streak kartı, ortada hedef ilerleme kartı, altında başlat/durdur CTA, alt bölümde son günler özeti
- **Key elements**: streak badge, daily goal progress bar, today total, primary CTA, recent summary card
- **Primary action**: “Çalışmaya Başla”
- **Edge cases**: ilk kullanım boş durumu, streak yok durumu, hedef ayarlanmamış durumu
- **Flow References**:
  - `Start Study Session`
  - `Review Streak and Daily Progress`
  - `Review Recent Study Summary`
- **PRD Requirement References**:
  - `PR-001`
  - `PR-002`
  - `PR-003`
  - `PR-004`
  - `PR-005`

### Active Session Screen / Modal
- **Purpose**: Aktif çalışma seansını net ve dikkat dağıtmadan yönetmek
- **Layout**: Büyük sayaç, opsiyonel ders etiketi alanı, durdur butonu, minimal yardımcı bilgi
- **Key elements**: elapsed timer, stop button, subject tag selector, session state indicator
- **Primary action**: “Seansı Bitir”
- **Edge cases**: app background state, accidental close, very short session
- **Flow References**:
  - `Start Study Session`
- **PRD Requirement References**:
  - `PR-001`
  - `PR-101`

### Goal Settings Sheet
- **Purpose**: Günlük hedefi hızlıca belirlemek
- **Layout**: dakika seçici, önerilen preset’ler, kaydet butonu
- **Key elements**: 30/60/90 preset chips, custom input, save CTA
- **Primary action**: “Hedefi Kaydet”
- **Edge cases**: invalid value, active session recalculation notice
- **Flow References**:
  - `Set or Adjust Daily Goal`
- **PRD Requirement References**:
  - `PR-002`

### Progress Summary Card / Screen
- **Purpose**: Son günlerdeki çalışma trendini göstermek
- **Layout**: mini chart veya 7 günlük liste, haftalık toplam, kısa insight metni
- **Key elements**: day labels, minute totals, weekly total, motivational summary
- **Primary action**: detay inceleme
- **Edge cases**: no data, low data density
- **Flow References**:
  - `Review Recent Study Summary`
- **PRD Requirement References**:
  - `PR-004`
  - `PR-103`

## Interaction Patterns
- Ana CTA her zaman görünür ve tek baskın aksiyon olmalı
- Seans aktifken zaman sayacı canlı ve yüksek kontrastlı görünmeli
- Hedef ilerleme çubuğu oturum sonu anında güncellenmeli
- Tamamlanan günlük hedef sonrası pozitif mikro feedback verilmeli
- Streak kartı her açılışta görünür olmalı, ama korkutucu değil motive edici dille sunulmalı
- Geçişler hızlı ve hafif olmalı; ana dashboard’a dönüş gecikmemeli

## Copy Direction
- Primary CTA: **Çalışmaya Başla**
- Stop CTA: **Seansı Bitir**
- Goal save CTA: **Hedefi Kaydet**
- Empty state: **Bugün henüz çalışma kaydı yok. İlk seansını başlat ve streak’ini oluştur.**
- Goal complete state: **Harika — bugünkü hedefini tamamladın. Streak devam ediyor.**
- Streak broken message: **Dün hedef kaçmış olabilir. Bugün yeniden başlayıp seriyi geri kurabilirsin.**
- Low data summary: **Henüz yeterli veri yok. Birkaç gün düzenli kayıt sonrası burada ilerlemeni göreceksin.**

## Accessibility
- Touch target’lar minimum 44x44 pt olmalı
- Renk tek başına durum belirtmemeli; ikon ve metin desteği kullanılmalı
- Progress bar için ekran okuyucuya yüzdesel durum aktarılmalı
- Sayaç ve streak bilgisi screen reader ile anlamlı sırada okunmalı
- Metin kontrastı WCAG uyumlu olmalı

## Summary (for downstream agents)

```yaml
feature: "Study Streak Mobile App"
source_artifacts:
  prd: "docs/product/prd.md"
  analysis: "docs/product/analysis.md"
primary_flows:
  - name: "Start Study Session"
    prd_requirements: ["PR-001", "PR-002", "PR-005"]
  - name: "Set or Adjust Daily Goal"
    prd_requirements: ["PR-002", "PR-005"]
  - name: "Review Streak and Daily Progress"
    prd_requirements: ["PR-002", "PR-003", "PR-004", "PR-005"]
  - name: "Review Recent Study Summary"
    prd_requirements: ["PR-004", "PR-103"]
screens:
  - name: "Home Dashboard"
    flows: ["Start Study Session", "Review Streak and Daily Progress", "Review Recent Study Summary"]
  - name: "Active Session Screen / Modal"
    flows: ["Start Study Session"]
  - name: "Goal Settings Sheet"
    flows: ["Set or Adjust Daily Goal"]
  - name: "Progress Summary Card / Screen"
    flows: ["Review Recent Study Summary"]
p0_requirements_covered:
  - "PR-001"
  - "PR-002"
  - "PR-003"
  - "PR-004"
  - "PR-005"
key_risks:
  - "If session tracking is not resilient to app backgrounding, trust breaks"
  - "If streak rules are unclear, motivation turns into confusion"
  - "Too much UI density can weaken daily usability"
```

## Handoff Contract

Next Agent: `user-stories`

Required Artifacts:
- `docs/product/prd.md`
- `docs/product/ux.md`

Recommended Artifacts:
- `docs/product/brainstorm.md`

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
