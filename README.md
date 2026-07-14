# MyPortfolio Backoffice & Milestone Tracker

Portofolio dinamis dengan admin panel untuk input milestone instan.
Stack: **Next.js (App Router) + Supabase (PostgreSQL, Auth, Storage) + Vercel**.

## Fitur

- **Halaman publik (`/`)** — timeline milestone kronologis, selalu segar dari
  database (dynamic rendering, tanpa build ulang), dengan filter kategori.
- **Admin login (`/admin/login`)** — Supabase Auth email & password.
- **Dashboard (`/admin/dashboard`)** — CRUD milestone + upload gambar bukti
  proyek ke Supabase Storage. Dilindungi proxy/middleware; pengunjung yang
  belum login dialihkan ke halaman utama.
- **Keamanan** — RLS aktif: `SELECT` publik, `INSERT/UPDATE/DELETE` hanya
  untuk pengguna terautentikasi.

## Setup

### 1. Supabase

1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql)
   (membuat tabel `milestones`, kebijakan RLS, bucket `milestone-images`, dan
   kebijakan storage).
3. Buat akun admin: **Authentication > Users > Add user** (email & password).
   Matikan *Enable email signups* di **Authentication > Sign In / Up** agar
   tidak ada orang lain yang bisa mendaftar.

### 2. Environment variables

```bash
cp .env.example .env.local
```

Isi dari **Project Settings > API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — login admin di http://localhost:3000/admin/login.

### 4. Deploy ke Vercel

1. Push repo ini ke GitHub, lalu import di Vercel.
2. Tambahkan kedua environment variable di atas pada **Vercel > Settings >
   Environment Variables**.
3. Deploy. Data baru dari admin langsung tampil tanpa redeploy.

## Struktur penting

| Path | Fungsi |
| --- | --- |
| `app/page.tsx` | Halaman publik (fetch dinamis dari Supabase) |
| `components/MilestoneTimeline.tsx` | Timeline + filter kategori (client) |
| `app/admin/login/page.tsx` | Login Supabase Auth |
| `app/admin/dashboard/page.tsx` | CRUD milestone + upload gambar |
| `proxy.ts` | Proteksi route `/admin/*` (redirect jika belum login) |
| `lib/supabase/client.ts` | Supabase browser client |
| `supabase/schema.sql` | Skema tabel, RLS, dan storage bucket |
