import { createClient } from "@supabase/supabase-js";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import type { Milestone } from "@/lib/types";

// FR-PUB-01: data selalu diambil segar dari Supabase — milestone baru yang
// di-input admin langsung tampil tanpa build ulang.
export const dynamic = "force-dynamic";

async function getMilestones(): Promise<{
  milestones: Milestone[];
  error: string | null;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      milestones: [],
      error:
        "Supabase belum dikonfigurasi. Salin .env.example menjadi .env.local lalu isi kredensial proyek Supabase Anda.",
    };
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .order("date_achieved", { ascending: false });

    if (error) {
      return { milestones: [], error: error.message };
    }
    return { milestones: data ?? [], error: null };
  } catch {
    return {
      milestones: [],
      error: "Tidak dapat terhubung ke Supabase. Periksa kredensial di .env.local.",
    };
  }
}

export default async function Home() {
  const { milestones, error } = await getMilestones();

  return (
    <>
      <header className="site-header">
        <div className="container">
          <p className="kicker">Portofolio &amp;</p>
          <h1>Arjun Sefuloh — IT Practitioner &amp; Developer</h1>
          <p className="lede">
            Rekam jejak proyek Industrial IoT, otomatisasi industri, dan
            pengembangan software kustom — diperbarui secara langsung setiap
            ada pencapaian baru.
          </p>
        </div>
      </header>

      <main className="container">
        {error ? (
          <div className="notice">⚠ {error}</div>
        ) : (
          <MilestoneTimeline milestones={milestones} />
        )}
      </main>

      <footer className="container site-footer">
        <span>© {new Date().getFullYear()} Arjun</span>
        <a href="/admin/login">Admin</a>
      </footer>
    </>
  );
}
