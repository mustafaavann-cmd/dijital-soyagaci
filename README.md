# 🌳 Dijital Soyağacı

Modern dijital soyağacı platformu. Aile ağacınızı oluşturun, yönetin ve paylaşın.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue)

## ✨ Özellikler

- 🌲 **İnteraktif Ağaç Görselleştirme** — ReactFlow ile sürükle-bırak destekli aile ağacı
- 👥 **Aile Üyelerini Yönetin** — Ekleme, düzenleme, silme ve detaylı profil bilgileri
- 🔗 **İlişki Bağlantıları** — Anne-Baba/Çocuk, Eş ve Kardeş ilişkileri
- 🔐 **Güvenli Kimlik Doğrulama** — Supabase Auth ile kayıt ve giriş
- 🛡️ **RLS Güvenliği** — Satır seviyesinde veri güvenliği
- 📱 **Responsive Tasarım** — Tüm cihazlarda mükemmel görünüm
- 🌙 **Dark Mode** — Karanlık mod desteği

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Radix UI, Tailwind CSS 4 |
| Grafik | ReactFlow |
| Backend | Supabase (PostgreSQL + Auth) |
| Dil | TypeScript 5 |
| Validasyon | Zod, React Hook Form |

## 🚀 Kurulum

### 1. Depoyu klonlayın
```bash
git clone https://github.com/mustafaavann-cmd/dijital-soyagaci.git
cd dijital-soyagaci
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın
```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 4. Veritabanını kurun
Supabase Dashboard → SQL Editor'de sırayla çalıştırın:
1. `supabase-schema.sql` — Tabloları oluşturur
2. `supabase-rls.sql` — Güvenlik politikalarını ekler
3. `supabase-fix.sql` — Trigger ve eksik policy'leri tamamlar

> ⚠️ **Önemli:** Supabase Dashboard → Authentication → Providers → Email bölümünde **"Confirm email"** seçeneğini kapatın (geliştirme için).

### 5. Uygulamayı başlatın
```bash
npm run dev
```

http://localhost:3000 adresinde açılır.

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard layout grubu
│   │   ├── dashboard/        # Ağaç listesi sayfası
│   │   └── tree/[treeId]/    # İnteraktif ağaç sayfası
│   ├── login/                # Giriş sayfası
│   ├── register/             # Kayıt sayfası
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Anasayfa
├── components/
│   ├── tree/                 # Ağaç bileşenleri
│   │   ├── family-member-node.tsx   # ReactFlow düğümü
│   │   ├── member-detail-sheet.tsx  # Üye detay paneli
│   │   └── member-dialog.tsx        # Üye ekleme formu
│   ├── ui/                   # UI bileşenleri (Radix UI)
│   └── navbar.tsx            # Navigasyon çubuğu
├── lib/
│   ├── services/             # Supabase servisleri
│   │   ├── tree.ts           # Ağaç CRUD
│   │   ├── node.ts           # Üye CRUD
│   │   └── edge.ts           # İlişki CRUD
│   ├── supabase/             # Supabase istemcileri
│   └── utils.ts              # Yardımcı fonksiyonlar
└── types/                    # TypeScript tip tanımları
```

## 📄 Lisans

MIT Lisansı ile lisanslanmıştır.
