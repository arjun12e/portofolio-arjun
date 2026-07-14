"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Milestone } from "@/lib/types";

const STORAGE_BUCKET = "milestone-images";
const CATEGORY_SUGGESTIONS = [
  "Industrial IoT",
  "Software Development",
  "Academic",
  "Otomatisasi Industri",
];

interface FormState {
  title: string;
  category: string;
  date_achieved: string;
  description: string;
  is_featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  date_achieved: "",
  description: "",
  is_featured: false,
};

// FR-ADM-02 (CRUD) + FR-ADM-03 (upload gambar ke Supabase Storage)
export default function AdminDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMilestones = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .order("date_achieved", { ascending: false });

      if (error) throw new Error(error.message);
      setMilestones(data ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEdit(m: Milestone) {
    setEditingId(m.id);
    setForm({
      title: m.title,
      category: m.category,
      date_achieved: m.date_achieved,
      description: m.description,
      is_featured: m.is_featured,
    });
    setExistingImageUrl(m.image_url);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(`Upload gambar gagal: ${error.message}`);

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      let imageUrl = existingImageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = { ...form, image_url: imageUrl };

      const { error } = editingId
        ? await supabase.from("milestones").update(payload).eq("id", editingId)
        : await supabase.from("milestones").insert(payload);

      if (error) throw new Error(error.message);

      resetForm();
      await loadMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m: Milestone) {
    if (!window.confirm(`Hapus milestone "${m.title}"?`)) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", m.id);

      if (error) throw new Error(error.message);
      if (editingId === m.id) resetForm();
      await loadMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus.");
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="admin-header">
        <div className="container">
          <h1>Milestone Manager</h1>
          <div className="actions">
            <a className="btn small" href="/" target="_blank">
              Lihat Situs
            </a>
            <button className="btn small" onClick={handleSignOut}>
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert" style={{ marginTop: "1.5rem" }}>
            {error}
          </div>
        )}

        <div className="admin-grid">
          <form className="panel" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit Milestone" : "Tambah Milestone"}</h2>

            <div className="field">
              <label htmlFor="title">Judul</label>
              <input
                id="title"
                required
                maxLength={255}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="category">Kategori</label>
              <input
                id="category"
                required
                maxLength={50}
                list="category-options"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <datalist id="category-options">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="field">
              <label htmlFor="date_achieved">Tanggal Pencapaian</label>
              <input
                id="date_achieved"
                type="date"
                required
                value={form.date_achieved}
                onChange={(e) =>
                  setForm({ ...form, date_achieved: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label htmlFor="description">Deskripsi</label>
              <textarea
                id="description"
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label htmlFor="image">Gambar Bukti Proyek (opsional)</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {!imageFile && existingImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="upload-preview"
                  src={existingImageUrl}
                  alt="Gambar saat ini"
                />
              )}
            </div>

            <div className="checkbox-row">
              <input
                id="is_featured"
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
              />
              <label htmlFor="is_featured">Tandai sebagai unggulan</label>
            </div>

            <button className="btn block" type="submit" disabled={saving}>
              {saving
                ? "Menyimpan…"
                : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Milestone"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn ghost block"
                style={{ marginTop: "0.5rem" }}
                onClick={resetForm}
              >
                Batal Edit
              </button>
            )}
          </form>

          <section className="panel">
            <h2>Daftar Milestone ({milestones.length})</h2>

            {loading ? (
              <p className="empty-state">Memuat…</p>
            ) : milestones.length === 0 ? (
              <p className="empty-state">Belum ada milestone.</p>
            ) : (
              milestones.map((m) => (
                <div className="milestone-row" key={m.id}>
                  <div className="info">
                    <strong>
                      {m.is_featured && "★ "}
                      {m.title}
                    </strong>
                    <span>
                      {m.category} ·{" "}
                      {new Date(m.date_achieved).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button
                      className="btn ghost small"
                      onClick={() => startEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn danger small"
                      onClick={() => handleDelete(m)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
    </>
  );
}
