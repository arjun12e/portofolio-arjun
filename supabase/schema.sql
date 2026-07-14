-- ============================================================
-- MyPortfolio Backoffice & Milestone Tracker — Supabase Schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabel milestones (sesuai PRD bagian 5)
CREATE TABLE IF NOT EXISTS public.milestones (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date_achieved DATE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false
);

-- 2. Row Level Security (PRD bagian 6)
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- SELECT: diizinkan untuk semua orang (public)
CREATE POLICY "Public can read milestones"
    ON public.milestones FOR SELECT
    USING (true);

-- INSERT / UPDATE / DELETE: hanya pengguna terautentikasi
CREATE POLICY "Authenticated can insert milestones"
    ON public.milestones FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update milestones"
    ON public.milestones FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete milestones"
    ON public.milestones FOR DELETE
    TO authenticated
    USING (true);

-- 3. Storage bucket untuk gambar bukti proyek (FR-ADM-03)
INSERT INTO storage.buckets (id, name, public)
VALUES ('milestone-images', 'milestone-images', true)
ON CONFLICT (id) DO NOTHING;

-- Semua orang boleh melihat gambar (bucket publik)
CREATE POLICY "Public can view milestone images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'milestone-images');

-- Hanya admin terautentikasi yang boleh upload/mengelola gambar
CREATE POLICY "Authenticated can upload milestone images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'milestone-images');

CREATE POLICY "Authenticated can update milestone images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'milestone-images');

CREATE POLICY "Authenticated can delete milestone images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'milestone-images');
