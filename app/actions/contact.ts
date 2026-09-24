"use server";

import { createClient } from "@supabase/supabase-js";

export type ContactField = "name" | "email" | "message";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Nilai terakhir agar form tidak kosong ketika validasi gagal. */
  values?: Partial<Record<ContactField, string>>;
  /** Diisi saat sukses; dipakai sebagai `key` untuk me-reset form. */
  sentAt?: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: bot biasanya mengisi semua field, termasuk yang tersembunyi.
  if (formData.get("company")) {
    return { status: "success", message: "Terima kasih! Pesan Anda terkirim.", sentAt: Date.now() };
  }

  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (values.name.length < 2 || values.name.length > 100) fieldErrors.name = "Nama 2–100 karakter.";
  if (!EMAIL_RE.test(values.email) || values.email.length > 200) fieldErrors.email = "Email tidak valid.";
  if (values.message.length < 10 || values.message.length > 2000)
    fieldErrors.message = "Pesan 10–2.000 karakter.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali isian Anda.", fieldErrors, values };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return {
      status: "error",
      message: "Form kontak belum dikonfigurasi. Silakan hubungi lewat email di bawah.",
      values,
    };
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("contact_messages").insert(values);
  if (error) {
    return { status: "error", message: "Gagal mengirim pesan. Coba lagi nanti.", values };
  }

  return { status: "success", message: "Terima kasih! Pesan Anda terkirim — saya akan segera membalas.",
    sentAt: Date.now(),
  };
}
