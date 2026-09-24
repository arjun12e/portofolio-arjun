# Portofolio Arjun — Live GitHub + Milestone Tracker

Portofolio single-page bernuansa neon/dark dengan repositori GitHub live dan
admin panel untuk input milestone instan.
Stack: **Next.js 16 (App Router, React 19, TypeScript) + Tailwind CSS v4 +
shadcn/ui + Framer Motion + Lucide + Supabase + Vercel**.

## Fitur

- **Hero** — efek ketik (typing) peran, teks gradien bergerak, CTA scroll halus
  ke proyek & link GitHub.
- **Live GitHub Repositories** — diambil di server dari
  `api.github.com/users/USERNAME/repos` (cache 1 jam), di-stream dengan
  `<Suspense>` + skeleton loader. Sortir bintang/terbaru/nama, filter bahasa,
  pencarian. Kartu glassmorphism dengan tilt 3D + glow mengikuti kursor, tag
  warna bahasa (linguist), tombol Kode & Live Demo (jika `homepage` diisi).
- **Rate-limit handling** — error bertipe (`rate_limit`/`not_found`/`network`)
  dengan hitung mundur reset kuota & tombol coba lagi.
- **Tech Stack grid** — Frontend, Backend, Tools, AI (`lib/site.ts`).
- **Statistik GitHub** — total bintang, fork, followers, bahasa teratas, dll.
  dihitung sendiri dari REST API (counter animasi).
- **Form kontak** — Server Action + validasi + honeypot, disimpan ke tabel
  Supabase `contact_messages`.
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
NEXT_PUBLIC_GITHUB_USERNAME=arjun12e
# Opsional, disarankan untuk produksi: limit 60 → 5.000 request/jam
GITHUB_TOKEN=github_pat_...
```

`GITHUB_TOKEN` cukup fine-grained token **tanpa scope apa pun** (hanya membaca
data publik). Jangan beri prefix `NEXT_PUBLIC_`.

Jika database sudah dibuat sebelumnya, jalankan ulang hanya bagian
`contact_messages` di akhir `supabase/schema.sql`.

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
| `app/page.tsx` | Halaman SPA: menyusun semua seksi + `<Suspense>` |
| `lib/github.ts` | Pemanggil GitHub API (server-only, cache, rate-limit) |
| `types/github.ts` | Interface `Repository`, `GitHubStats`, `GitHubResult`, dll. |
| `components/ProjectCard.tsx` | Kartu proyek (Framer Motion 3D tilt + glow) |
| `components/projects/*` | Explorer (sort/filter), skeleton, error state |
| `components/stats/*` | Statistik GitHub + counter animasi |
| `components/sections/*` | Navbar, Hero, Skills, Kontak, Footer |
| `components/ui/*` | Primitif shadcn/ui (Button, Badge, Card, Skeleton, Input) |
| `lib/site.ts` | Nama, bio, sosial media, daftar skill |
| `app/actions/contact.ts` | Server Action form kontak |
| `components/MilestoneTimeline.tsx` | Timeline + filter kategori (client) |
| `app/admin/login/page.tsx` | Login Supabase Auth |
| `app/admin/dashboard/page.tsx` | CRUD milestone + upload gambar |
| `proxy.ts` | Proteksi route `/admin/*` (redirect jika belum login) |
| `lib/supabase/client.ts` | Supabase browser client |
| `supabase/schema.sql` | Skema tabel, RLS, dan storage bucket |
