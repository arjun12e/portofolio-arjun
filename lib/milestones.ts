import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Milestone } from "@/lib/types";

export async function getMilestones(): Promise<{
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
