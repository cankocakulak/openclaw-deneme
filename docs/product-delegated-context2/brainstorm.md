# Brainstorm: Study Streak

## Analysis

Öğrencilerin motivasyon sorunu: Sınav dönemlerinde yoğun çalışma, sonra tamamen bırakma döngüsü. Asıl sorun "çalışma süresi takibi" değil, "sürdürülebilir alışkanlık oluşturma". Streak mekaniği, sosyal onay ve görsel ilerleme ile bu döngüyü kırmak hedeflenmeli.

---

## Ideas

### Idea 1: Pure Streak Tracker
**What**: Basit günlük çalışma süresi kaydı + kesintisiz gün sayacı
**Why it works**: Duolingo modeli kanıtlanmış, öğrenciler zaten tanıyor
**Risk**: Rekabetçi pazar, farklılaşma zor
**Effort**: Low

### Idea 2: Subject-Based Streaks
**What**: Her ders için ayrı streak (Matematik: 5 gün, Fizik: 3 gün)
**Why it works**: Öğrenciler farklı derslere farklı öncelik verir, esneklik sağlar
**Risk**: Karmaşık UI, öğrencileri bunaltabilir
**Effort**: Medium

### Idea 3: Pomodoro + Streak Hybrid
**What**: 25dk çalışma döngüleri + günlük pomodoro sayısı streak'i
**Why it works**: Zaman yönetimi + alışkanlık birleşimi, üretkenlik odaklı
**Risk**: Pomodoro zaten çok uygulama var
**Effort**: Medium

### Idea 4: Study Buddy System
**What**: Arkadaşlarla grup streak'leri, bir kişi kaçırırsa grup etkilenir
**Why it works**: Sosyal baskı + hesap verebilirlik güçlü motivatör
**Risk**: Bağımlılık: arkadaş bırakırsa kullanıcı da bırakır
**Effort**: High

### Idea 5: Exam Countdown Mode
**What**: Sınav tarihi girilir, uygulama otomatik çalışma planı + streak hedefleri oluşturur
**Why it works**: Spesifik hedef (sınav) net motivasyon kaynağı
**Risk**: Sınav sonrası kullanım düşer (seasonal product)
**Effort**: Medium

### Idea 6: Focus Sessions with Lock
**What**: Çalışma süresince telefonu kilitleyen, sosyal medyayı engelleyen mod
**Why it works**: Dikkat dağıtıcıları ortadan kaldırır, derin çalışma sağlar
**Risk**: İzin karmaşası (Android/iOS kısıtlamaları), kullanıcı direnci
**Effort**: High

### Idea 7: Visual Study Garden
**What**: Her çalışma günü sanal bahçeye bitki eklenir, streak bozulursa solur
**Why it works**: Forest uygulaması kanıtlanmış, duygisel bağ oluşturur
**Risk**: Forest çok popüler, kopya algısı
**Effort**: Medium

---

## Tech Direction

- **Recommended stack**: Expo / React Native (zaten belirlenmiş)
  - One codebase for iOS/Android
  - AsyncStorage for offline streak data
  - Expo Notifications for daily reminders
  - Reanimated for smooth streak animations

- **Key technical bets**:
  - Offline-first: Öğrencilerin interneti olmayabilir
  - Local notifications: Push notification servisine bağımlılık azaltılacak
  - Simple backend (Firebase/Supabase): Sadece sosyal özellikler için

---

## Recommendation

**Winner: Subject-Based Streaks (Idea 2) + Exam Countdown Mode (Idea 5) kombinasyonu**

Ders bazlı streak'ler öğrencilere esneklik sunar (tüm gün boş değilse bile bir derse çalışmış olmak yeterli). Sınav modu ise spesifik hedef koyarak motivasyonu artırır. Bu ikisi birlikte "sürekli kullanım" ve "dönemsel yoğunluk" senaryolarını kapsar.

**Runner-up: Study Buddy System (Idea 4)** - MVP sonrası eklenecek, sosyal özellik büyüme motoru olur.

---

## Combinations

| Combination | Why Strong |
|-------------|------------|
| Subject Streaks + Exam Mode | Esneklik + Hedef odaklılık |
| Pomodoro + Focus Lock | Üretkenlik + Dikkat kontrolü |
| Study Garden + Buddy System | Kişisel motivasyon + Sosyal hesap verebilirlik |

---

## Summary (for downstream agents)

```yaml
feature: study-streak-tracking-app
selected_direction: subject-based-streaks-with-exam-countdown
rejected_directions:
  - pure-streak-tracker: too generic, no differentiation
  - pomodoro-hybrid: crowded market
  - focus-lock: permission complexity, high effort
  - visual-study-garden: too similar to Forest
constraints:
  platform: mobile-ios-android
  framework: expo-react-native
  target_audience: university-high-school-students
  offline_first: true
  must_work_without_internet: true
technical_bets:
  - asyncstorage-for-local-data
  - expo-local-notifications
  - minimal-backend-only-for-social
  - reanimated-for-streak-animations
open_questions_for_prd:
  - how_many_subjects_maximum
  - what_happens_when_streak_breaks_reset_or_continue
  - exam_mode_auto_plan_or_manual
  - social_features_mvp_or_v2
  - monetization_model_free_premium_or_ads
```

---

## Handoff Contract

**Next Agent**: `prd`

**Required Artifacts**: 
- `docs/product-delegated-context2/brainstorm.md`

**Recommended Artifacts**:
- `docs/product-delegated-context2/analysis.md` (if user research available)

**Critical Inputs that must remain stable**:
- Target audience: University/high school students
- Platform: Mobile (iOS/Android)
- Framework: Expo / React Native
- Core mechanic: Streak-based habit formation
- Offline-first requirement

**Sections That Must Not Change before PRD**:
- `selected_direction` in Summary YAML
- `constraints` block
- `open_questions_for_prd` list

**Notes for PRD Agent**:
- Focus on "Subject-Based Streaks" as primary feature
- Exam Countdown Mode as secondary/seasonal feature
- Study Buddy System marked as V2
- Address open questions in PRD decisions section
