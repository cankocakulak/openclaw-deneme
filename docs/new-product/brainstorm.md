# Brainstorm: Öğrenci Çalışma Takip Uygulaması

## Analysis

Öğrencilerin günlük çalışma sürelerini takip etmek için basit bir "zincir" (streak) uygulaması isteniyor. Gerçek problem sadece zaman kaydetmek değil — öğrencinin **motivasyonunu canlı tutmak** ve **düzenli çalışma alışkanlığı** kazandırmak. Bu nedenle uygulama sadece bir kronometre değil, görsel geri bildirim ve ilerleme hissi sunmalı.

---

## Ideas

### Idea 1: Günlük Zincir (Daily Streak)
**What**: Her gün çalışma hedefi tutturulduğunda zincir uzar, kaçırılırsa zincir kırılır
**Why it works**: Kayıp korkusu (loss aversion) güçlü motivatör; "bugün çalışmazsam 15 günlük zincirim gider" etkisi
**Risk**: Zincir kırılınca demoralize olma; öğrenci tamamen bırakabilir
**Effort**: Low

### Idea 2: Esnek Zincir (Flexible Streak)
**What**: Haftada X gün çalışma hedefi; toplam gün sayısı değil, haftalık tutarlılık ödüllendirilir
**Why it works**: Gerçekçi; öğrencilerin her gün mükemmel olması beklenmez, haftalık ritim daha sürdürülebilir
**Risk**: Daha az "aciliyet" hissi; motivasyon düşüklüğü riski
**Effort**: Low

### Idea 3: Konu Bazlı Takip
**What**: Her ders/branş için ayrı zincir ve çalışma süresi takibi
**Why it works**: Öğrenci hangi derse ne kadar zaman ayırdığını görür; denge sorunlarını fark eder
**Risk**: UI karmaşıklığı; çok sayıda konu yönetimi zor olabilir
**Effort**: Medium

### Idea 4: Odak Modu (Focus Mode)
**What**: Çalışma başlatıldığında telefonu kilitleyen/distraction engelleyen tam ekran modu
**Why it works**: Dikkat dağıtıcıları ortadan kaldırır; pomodoro benzeri odaklanma sağlar
**Risk**: Kullanıcı telefonu tamamen bırakmak isteyebilir; zorunlu mod rahatsız edici olabilir
**Effort**: Medium

### Idea 5: Haftalık/Saatlik Hedef Belirleme
**What**: Haftalık toplam çalışma saati hedefi (örn: "bu hafta 20 saat")
**Why it works**: Günlük baskıyı azaltır, haftalık planlama yapabilme esnekliği verir
**Risk**: Hafta sonu "tüm saatleri toplama" riski; düzensiz dağılım
**Effort**: Low

### Idea 6: Basit İstatistik ve Grafikler
**What**: Günlük/haftalık/aylık çalışma süreleri görsel grafiklerle sunulur
**Why it works**: İlerlemeyi görsel olarak görmek motivasyonu artırır; "ne kadar yol katettiğimi" hissettirir
**Risk**: Gereksiz karmaşıklık; çok fazla veri kullanıcıyı bunaltabilir
**Effort**: Low

### Idea 7: Çalışma Notları/Günlük
**What**: Her çalışma oturumuna kısa not ekleme özelliği ("bugün matematik türev konusunu bitirdim")
**Why it works**: İlerlemenin somut kanıtı; tekrar baktığında ne yapıldığını hatırlatır
**Risk**: Çoğu öğrenci not almak istemeyebilir; isteğe bağlı olmalı
**Effort**: Low

---

## Tech Direction

**Recommended Stack:**
- **Mobile-first**: React Native veya Flutter (öğrenciler telefonda kullanacak)
- **Offline-first**: Yerel depolama öncelikli; internet olmadan çalışmalı
- **Basit backend**: Sadece yedekleme ve cihazlar arası senkronizasyon için (opsiyonel)

**Key Technical Bets:**
1. **Yerel depolama öncelikli**: Öğrencilerin interneti olmayabilir; uygulama offline çalışmalı
2. **Basit ve hızlı**: Açılış süresi < 2 saniye; karmaşık onboarding yok
3. **Minimal backend**: Gereksizse backend bile olmayabilir; tamamen yerel uygulama

---

## Recommendation

**Idea 1 (Günlük Zincir) + Idea 6 (Basit İstatistikler) + Idea 7 (Opsiyonel Notlar)**

Günlük zincir temel motivasyon mekanizmasıdır — "zincirimi kırmamalıyım" hissi güçlüdür. Basit grafikler ilerlemeyi görselleştirir. Not özelliği isteğe bağlıdır; kullanmak isteyen ekler, istemeyen sadece süre takibi yapar. 

Idea 2 (Esnek Zincir) alternatif olarak sunulabilir; kullanıcı ayarlardan "haftada 5 gün" moduna geçebilir. Bu, uygulamanın daha geniş kitleye hitap etmesini sağlar.

Idea 4 (Odak Modu) v2'de eklenebilir; MVP'de basit kronometre yeterli.

---

## Combinations

- **Zincir + Konu Takibi**: Her konu için ayrı zincir (örn: "Matematik zincirim 10 gün", "Fizik zincirim 5 gün")
- **Zincir + Haftalık Hedef**: Günlük zincir + haftalık toplam saat hedefi birlikte çalışır
- **Esnek Mod + Sıkı Mod**: Kullanıcı tercihine göre değiştirilebilir

---

## Summary (for downstream agents)

```yaml
feature: student-study-tracker
topic: Öğrencinin çalıştığı saatleri günden güne takip edebileceği zincir uygulaması
selected_direction:
  primary: Günlük Zincir (Daily Streak) + Basit İstatistikler
  secondary: Opsiyonel çalışma notları
  alternative_mode: Esnek Zincir (haftalık hedef)
rejected_directions:
  - Konu bazlı takip (MVP'de karmaşıklık)
  - Odak modu (v2'de değerlendirilecek)
constraints:
  - Mobile-first (telefon odaklı)
  - Offline-first (internet gerektirmemeli)
  - Basit ve hızlı (< 2 sn açılış)
technical_bets:
  - React Native veya Flutter
  - Yerel depolama öncelikli
  - Minimal backend (opsiyonel)
open_questions:
  - Zincir kırılınca kullanıcıyı nasıl geri kazanırız? (ikinci şans mekanizması?)
  - Push notification stratejisi nedir?
  - Sosyal özellikler (arkadaşlarla yarışma) MVP'ye dahil mi?
```

---

## Handoff Contract

**Next Agent:** `prd`

**Required Artifacts:**
- `docs/new-product/brainstorm.md` (this document)

**Recommended Artifacts:**
- None (analysis artifact not provided)

**Critical Inputs that must remain stable:**
- Topic: Öğrenci çalışma takibi zincir uygulaması
- Target audience: Öğrenciler (günlük/haftalık çalışma rutini)
- Core mechanic: Zincir (streak) sistemi
- Platform: Mobile-first

**Sections That Must Not Change before PRD:**
- Selected direction (Günlük Zincir + İstatistikler)
- Alternative mode (Esnek Zincir)
- Technical bets (React Native/Flutter, offline-first)
- Open questions (zincir kırılma, bildirimler, sosyal özellikler)
