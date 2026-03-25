# UX: Zincir - Öğrenci Çalışma Takip Uygulaması

## User Goal
Öğrenci, düzenli çalışma alışkanlığı kazanmak ve günlük çalışma sürelerini takip etmek istiyor; zincirini korumak onun için güçlü bir motivasyon kaynağı.

## Visual Direction

### Tone & Feel
**Sade, odaklanmış ve motive edici.** Uygulama öğrencinin dikkatini dağıtmamalı, aksine çalışmaya teşvik etmeli. Görsel dil:
- **Temiz ve minimalist**: Gereksiz öğe yok, her şeyin bir amacı var
- **Sıcak ama disiplinli**: Motive edici ama oyunlaştırma abartılmamış
- **Hızlı hissettiren**: Animasyonlar ve geçişler hızlı, "bekletme" yok
- **Güven verici**: Offline çalışıyor, veri kaybı korkusu yok

### Reference Apps
- **Duolingo** — Zincir görselleştirmesi ve "streak" psikolojisi için; renkli ama odaklanmış arayüz
- **Stoic** — Sade, sakin arayüz; metriklerin sade sunumu
- **Forest** — Odaklanma hissi; görsel ilerleme ve basit etkileşim
- **Apple Fitness** — Halka/zincir görselleştirmesi; motivasyon odaklı UI

### Color Direction
- **Primary (Zincir Rengi)**: Amber/Altın sarısı (`#F59E0B`) — Sıcak, enerjik, başarı hissi
- **Secondary (Başarı)**: Yeşil (`#10B981`) — Hedef tamamlandığında, olumlu geri bildirim
- **Accent (Uyarı)**: Turuncu (`#F97316`) — Zincir kırılma riski, hatırlatma
- **Danger**: Kırmızı (`#EF4444`) — Zincir kırıldığında, sadece kritik durumlarda
- **Neutral Background**: Beyaz/Açık gri (`#FFFFFF`, `#F9FAFB`) — Temiz, okunabilir
- **Text Primary**: Koyu gri (`#1F2937`) — Yüksek kontrast, okunabilirlik
- **Text Secondary**: Orta gri (`#6B7280`) — Yardımcı metinler, etiketler

### Typography & Spacing
- **Font**: Sistem fontu (iOS: SF Pro, Android: Roboto) — Hızlı yükleme, yerel his
- **Heading 1**: 32px, bold — Ekran başlıkları
- **Heading 2**: 24px, semibold — Bölüm başlıkları
- **Body**: 16px, regular — Ana içerik
- **Caption**: 14px, regular — Yardımcı metinler
- **Small**: 12px, medium — Etiketler, zaman damgaları
- **Spacing**: 16px base unit; kompakt ama nefes alan düzen
- **Touch targets**: Minimum 44x44px

---

## Primary Flows

### Flow 1: Günlük Çalışma Başlatma ve Kaydetme
- **User Goal**: Bugünkü çalışma oturumunu başlatmak ve süreyi kaydetmek
- **Trigger**: Kullanıcı uygulamayı açar ve ana ekrandaki "Başla" butonuna basar
- **Steps**:
  1. Kullanıcı uygulamayı açar (2 saniyeden kısa sürede ana ekran görünür)
  2. Ana ekranda bugünkü zincir durumu ve "Başla" butonu görür
  3. "Başla" butonuna basar → Kronometre ekranına geçiş
  4. Kronometre çalışmaya başlar (büyük dijital sayaç)
  5. Kullanıcı "Duraklat" veya "Bitir" seçeneklerini görür
  6. "Bitir"e bastığında süre kaydedilir ve ana ekrana dönülür
  7. Eğer günlük hedef (30 dk) tamamlandıysa zincir artar ve görsel onay gösterilir
- **Edge Cases**:
  - **Uygulama arka planda**: Kronometre arka planda çalışmaya devam eder; bildirim gösterilir
  - **Telefon kapanırsa**: Süre kaydedilmemişse, son kayıtlı süre korunur
  - **Hedef tamamlanmadan bitirme**: Süre kaydedilir ama zincir artmaz
  - **Çift başlatma**: Aynı anda birden fazla oturum başlatılamaz
- **Success State**: Ana ekranda güncellenmiş zincir sayısı ve "Bugün: X dakika" görünür
- **PRD Requirement References**:
  - `PR-001`: Günlük çalışma kaydı (başlat/durdur/duraklat)
  - `PR-002`: Zincir sistemi (hedef tamamlandığında artış)
  - `PR-004`: Hızlı açılış (< 2 saniye)

### Flow 2: Zincir Görüntüleme ve Hedef Takibi
- **User Goal**: Mevcut zincir durumunu görmek ve günlük hedefi takip etmek
- **Trigger**: Ana ekran otomatik olarak bu bilgiyi gösterir
- **Steps**:
  1. Kullanıcı ana ekranda büyük zincir sayısını görür (örn: "15 günlük zincir")
  2. Haftalık görünümde hangi günler tamamlandığını gösteren göstergeler görünür
  3. Bugünkü ilerleme çubuğu (30 dk hedefine göre) görünür
  4. Hedef tamamlandığında yeşil onay işareti ve "Hedef tamamlandı!" mesajı görünür
- **Edge Cases**:
  - **Yeni kullanıcı**: "0 günlük zincir", boş haftalık görünüm, "Başlamak için hazır!" mesajı
  - **Zincir kırılma riski**: Saat ilerledikçe "Bugünkü zincirinizi korumak için X saatiniz var" uyarısı
  - **Zincir kırıldı**: Üzücü ama motive edici mesaj; ikinci şans teklifi (P1)
- **Success State**: Kullanıcı net bir şekilde zincir durumunu ve kalan süreyi anlar
- **PRD Requirement References**:
  - `PR-002`: Zincir sistemi ve görsel onay
  - `PR-005`: Basit istatistikler

### Flow 3: İstatistik Görüntüleme
- **User Goal**: Geçmiş çalışma performansını görmek ve ilerlemeyi analiz etmek
- **Trigger**: Ana ekrandan "İstatistikler" sekmesine/ikonuna tıklama
- **Steps**:
  1. Kullanıcı istatistikler bölümüne geçer
  2. Üstte özet kartlar görünür: Bugün, Bu Hafta, Bu Ay
  3. Haftalık çubuk grafik (son 7 gün) görünür
  4. Aylık görünüme geçiş yapılabilir
  5. En uzun zincir rekoru görünür
- **Edge Cases**:
  - **Yeni kullanıcı**: "Henüz veri yok" boş durumu; ilk çalışma kaydına davet
  - **Yetersiz veri**: Günlük/haftalık görünümde minimum veri gösterimi
  - **Offline**: Yerel veriler gösterilir; "Son güncelleme: X" bilgisi
- **Success State**: Kullanıcı çalışma alışkanlıklarının görsel özetini görür
- **PRD Requirement References**:
  - `PR-005`: Basit istatistikler (günlük/haftalık/aylık)
  - `PR-003`: Offline-first (veri her zaman yerelden gelir)

### Flow 4: Ayarlar ve Tercihler (P1)
- **User Goal**: Uygulama davranışını kişiselleştirmek
- **Trigger**: Ana ekrandan ayarlar ikonuna tıklama
- **Steps**:
  1. Ayarlar menüsü açılır
  2. Kullanıcı mod seçebilir: "Günlük Zincir" veya "Esnek Zincir (Haftada X gün)"
  3. Bildirim saati ayarlanabilir (varsayılan: 20:00)
  4. Minimum çalışma süresi görüntülenir (varsayılan: 30 dk)
  5. Tema seçimi (Açık/Koyu/Otomatik)
- **Edge Cases**:
  - **Mod değişikliği**: Mevcut zincir korunur mu? (ürün kararı gerektirir)
  - **Bildirim izni reddedilirse**: Ayarlarda manuel yönlendirme
- **Success State**: Kullanıcı tercihleri kaydedilir ve uygulama buna göre davranır
- **PRD Requirement References**:
  - `PR-101`: Esnek zincir modu
  - `PR-104`: Push bildirimleri ayarı

---

## Screen/Component Breakdown

### Screen 1: Ana Ekran (Home)
- **Purpose**: Zincir durumunu göstermek ve çalışma başlatmak için merkezi kontrol noktası
- **Layout**: 
  - Üst: Header (logo/uygulama adı)
  - Orta: Büyük zincir sayısı + görsel zincir gösterimi
  - Alt: Haftalık ilerleme göstergesi + Bugünkü süre
  - Bottom: Floating "Başla" butonu
- **Key elements**:
  - **Zincir Kartı**: Büyük sayı + "günlük zincir" metni + yanardağ/alev ikonu
  - **Haftalık Takvim**: 7 günün durumu (tamamlandı/bekliyor/bugün)
  - **Bugünkü İlerleme**: "Bugün: 15/30 dk" progress bar
  - **Başla Butonu**: Büyük, amber renkli, "Başla" veya "Devam Et"
- **Primary action**: Çalışma oturumu başlatma
- **Edge cases**:
  - **İlk kullanım**: Karşılama mesajı, "İlk zincirinizi başlatın!"
  - **Zincir kırılma riski**: Turuncu uyarı banner'ı
  - **Hedef tamamlandı**: Yeşil onay ve kutlama animasyonu (hafif)
- **Flow References**:
  - Flow 1: Günlük Çalışma Başlatma
  - Flow 2: Zincir Görüntüleme
- **PRD Requirement References**:
  - `PR-001`, `PR-002`, `PR-005`

### Screen 2: Kronometre Ekranı (Timer)
- **Purpose**: Aktif çalışma oturumunu görüntülemek ve kontrol etmek
- **Layout**:
  - Tam ekran, minimalist
  - Ortada devasa sayaç (mm:ss format)
  - Alt satırda: günlük toplam + hedef ilerlemesi
  - Altta: Kontrol butonları (Duraklat / Bitir)
- **Key elements**:
  - **Ana Sayaç**: 00:00 format, 72px+ boyut, monospaced
  - **Günlük Toplam**: "Bugün toplam: 45 dk"
  - **Duraklat Butonu**: İkon + "Duraklat"
  - **Bitir Butonu**: İkon + "Bitir", primary amber
  - **Not Ekle** (P1): Küçük "+ Not" linki
- **Primary action**: Oturumu bitirme veya duraklatma
- **Edge cases**:
  - **Arka plan**: Uygulama arka plandayken bildirim göster
  - **Duraklatıldı**: Sayaç donar, "Devam Et" butonu görünür
  - **Çok uzun süre**: Saat+ formatına geçiş (1:23:45)
- **Flow References**:
  - Flow 1: Günlük Çalışma Başlatma
- **PRD Requirement References**:
  - `PR-001`

### Screen 3: İstatistikler Ekranı (Stats)
- **Purpose**: Geçmiş performansı görselleştirmek
- **Layout**:
  - Üst: Özet kartlar (3'lü grid)
  - Orta: Haftalık çubuk grafik
  - Alt: Rekorlar ve ek metrikler
- **Key elements**:
  - **Özet Kartları**: 
    - "Bugün": XX dakika
    - "Bu Hafta": XX saat XX dk
    - "Bu Ay": XX saat
  - **Haftalık Grafik**: 7 çubuk, her günün süresi
  - **En Uzun Zincir**: Rekor gösterimi
  - **Tarih Seçici**: Hafta/Ay geçişi
- **Primary action**: Veri görüntüleme (interaktif değil)
- **Edge cases**:
  - **Boş durum**: "Henüz çalışma kaydı yok" + illüstrasyon
  - **Yetersiz veri**: "Daha fazla veri toplanıyor..."
- **Flow References**:
  - Flow 3: İstatistik Görüntüleme
- **PRD Requirement References**:
  - `PR-005`

### Screen 4: Ayarlar Ekranı (Settings)
- **Purpose**: Uygulama tercihlerini yönetmek
- **Layout**: Standart ayarlar listesi, bölümler halinde
- **Key elements**:
  - **Mod Seçimi**: "Günlük Zincir" / "Esnek Zincir" toggle
  - **Esnek Mod Ayarları**: Haftada kaç gün (5-6 seçimi)
  - **Bildirimler**: Saat seçici + aç/kapa toggle
  - **Tema**: Açık/Koyu/Otomatik seçimi
  - **Hakkında**: Versiyon, destek linki
- **Primary action**: Tercih değiştirme
- **Edge cases**:
  - **Mod değişikliği onayı**: "Mevcut zinciriniz etkilenmeyebilir" uyarısı
- **Flow References**:
  - Flow 4: Ayarlar
- **PRD Requirement References**:
  - `PR-101`, `PR-104`

### Component: Zincir Kırılma Dialog'u
- **Purpose**: Zincir kırıldığında kullanıcıyı bilgilendirmek ve geri kazanma teklifi sunmak (P1)
- **Layout**: Modal dialog, merkezi
- **Key elements**:
  - **Başlık**: "Zinciriniz kırıldı"
  - **Mesaj**: "X günlük zincirinizi kaçırdınız."
  - **İkinci Şans Butonu**: "Bugün çalışıp devam et" (amber)
  - **Kabul Etme**: "Yeni başlangıç yap" (neutral)
- **Edge cases**:
  - İkinci şans kullanıldıysa bir daha teklif edilmez
- **PRD Requirement References**:
  - `PR-103`

---

## Interaction Patterns

### Navigation
- **Tab Bar**: Ana Ekran | İstatistikler | Ayarlar (3 tab)
- **Modal Geçişler**: Kronometre ekranı modal olarak açılır, kaydırarak kapatılabilir
- **Geri Navigasyon**: Android back button desteği, iOS swipe back

### Feedback Mekanizmaları
- **Hedef Tamamlandığında**:
  - Hafif titreşim (haptic feedback)
  - Yeşil onay animasyonu (checkmark)
  - "Tebrikler! Zinciriniz devam ediyor." toast mesajı
- **Zincir Artışında**:
  - Sayı animasyonu (count up)
  - Alev/yanardağ efekti (hafif)
- **Buton Tepkileri**:
  - Dokunma anında scale down (0.95)
  - Haptic feedback

### Loading ve Transition
- **Açılış**: Splash yok, direkt ana ekran; skeleton loading gerekmez (hızlı)
- **Ekran Geçişleri**: 200ms ease-in-out, native his
- **Veri Kaydetme**: Arkaplanda, kullanıcıyı beklettirmez

### Offline Davranış
- Tüm veriler yerel AsyncStorage/MMKV'de
- İnternet kontrolü yok, her zaman offline mod
- Veri kaybı riski yok (PR-003 garantisi)

---

## Copy Direction

### Button Labels
- "Başla" — İlk çalışma için
- "Devam Et" — Önceki oturumdan devam
- "Bitir" — Oturumu sonlandır
- "Duraklat" — Geçici durdurma
- "Kaydet" — Notları kaydet
- "İptal" — İşlemi iptal

### Empty States
- **İlk kullanım**: "Zincirinizi oluşturmaya hazır mısınız? Başlamak için aşağıdaki butona tıklayın."
- **İstatistikler boş**: "Henüz çalışma kaydınız yok. İlk kaydınızı oluşturduğunuzda burada görünecek."

### Hedef Mesajları
- "Bugünkü hedef: 30 dk"
- "Hedef tamamlandı! 🎉"
- "X dakika daha çalışıp zincirinizi koruyun"

### Zincir Mesajları
- "X günlük zincir" — Normal gösterim
- "Rekor: X gün" — En uzun zincir
- "Zinciriniz kırıldı" — Üzücü ama nazik
- "İkinci şans! Bugün çalışırsanız zinciriniz devam eder."

### Error Copy
- "Bir hata oluştu. Verileriniz güvende, lütfen tekrar deneyin."
- "Bu oturum zaten aktif."

---

## Accessibility

### Keyboard Navigation
- Tüm interaktif elemanlar Tab ile erişilebilir
- Enter/Space ile aktivasyon
- Mantıklı tab sırası (soldan sağa, yukarıdan aşağıya)

### Screen Reader
- Tüm butonlar anlamlı label içerir
- Sayaç değişiklikleri anons edilir ("15 dakika oldu")
- Zincir durumu: "15 günlük zincir, hedef tamamlandı"
- Grafikler için alternatif metin: "Bu hafta toplam 12 saat çalıştınız"

### Color Contrast
- Tüm metinler WCAG AA standardına uygun (4.5:1)
- Zincir amber rengi koyu arka planlarda test edilecek
- Renk tek başına bilgi taşımaz (ikon + renk birlikte)

### Touch Targets
- Minimum 44x44px tüm dokunulabilir alanlar
- "Başla" butonu daha büyük (56px+ yükseklik)
- Butonlar arası yeterli boşluk (min 8px)

### Motion
- Animasyonlar prefers-reduced-motion'a saygılı
- Kritik bilgi animasyona bağımlı değil

---

## Summary (for downstream agents)

```yaml
feature: "zincir-study-tracker"
source_artifacts:
  prd: "docs/new-product/prd.md"
  analysis: ""
  brainstorm: "docs/new-product/brainstorm.md"
primary_flows:
  - name: "Günlük Çalışma Başlatma ve Kaydetme"
    prd_requirements: ["PR-001", "PR-002", "PR-004"]
  - name: "Zincir Görüntüleme ve Hedef Takibi"
    prd_requirements: ["PR-002", "PR-005"]
  - name: "İstatistik Görüntüleme"
    prd_requirements: ["PR-005", "PR-003"]
  - name: "Ayarlar ve Tercihler"
    prd_requirements: ["PR-101", "PR-104"]
screens:
  - name: "Ana Ekran (Home)"
    flows: ["Günlük Çalışma Başlatma", "Zincir Görüntüleme"]
  - name: "Kronometre Ekranı"
    flows: ["Günlük Çalışma Başlatma"]
  - name: "İstatistikler Ekranı"
    flows: ["İstatistik Görüntüleme"]
  - name: "Ayarlar Ekranı"
    flows: ["Ayarlar ve Tercihler"]
  - name: "Zincir Kırılma Dialog'u"
    flows: ["Zincir Görüntüleme"]
p0_requirements_covered:
  - "PR-001": "Günlük çalışma kaydı (kronometre)"
  - "PR-002": "Zincir sistemi ve görsel onay"
  - "PR-003": "Offline-first (yerel depolama)"
  - "PR-004": "Hızlı açılış (< 2 sn)"
  - "PR-005": "Basit istatistikler"
key_risks:
  - "Zincir kırılma demoralizasyonu: İkinci şans mekanizması (P1) kritik"
  - "Offline-first yaklaşım bulut beklentisi olan kullanıcıları üzebilir"
  - "Esnek mod vs günlük mod geçişi: Mevcut zincir nasıl etkilenir?"
platform: "mobile"
framework: "react-native"
```

---

## Handoff Contract

Next Agent: `user-stories`

Required Artifacts:
- `docs/new-product/prd.md`
- `docs/new-product/ux.md` (this document)

Recommended Artifacts:
- `docs/new-product/brainstorm.md`

Critical Inputs:
- User goal: Öğrencinin düzenli çalışma alışkanlığı kazanması
- Primary flows: 4 ana akış (çalışma başlatma, zincir takibi, istatistikler, ayarlar)
- Screen/component breakdown: 4 ana ekran + dialog
- Interaction patterns: Haptic feedback, offline-first, hızlı geçişler
- Copy direction: Buton etiketleri, boş durum mesajları, hedef metinleri
- Accessibility: WCAG AA, 44px touch targets, screen reader desteği

Sections That Must Not Change:
- User Goal
- Primary Flows (4 akışın yapısı)
- Screen/Component Breakdown (ekran isimleri ve amaçları)
- Interaction Patterns (offline-first davranış)
- P0 requirement mappings

Mapping Rules:
- Her primary flow en az bir user story'ye dönüştürülmeli
- Her screen/component en az bir story'de yer almalı
- Her P0 requirement (PR-001..PR-005) en az bir story'de korunmalı
- Zincir kırılma ve ikinci şans mekanizması P1 story olarak işlenebilir
