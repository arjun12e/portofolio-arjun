"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { sendContactMessage, type ContactField, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle", message: "" };

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-xs text-destructive">
      {error}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const err = (f: ContactField) => state.fieldErrors?.[f];
  // Form di-reset (remount) setelah sukses dengan mengganti key.
  const formKey = state.sentAt ?? "form";

  return (
    <form key={formKey} action={formAction} noValidate className="glass flex flex-col gap-5 rounded-xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">Nama</label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={state.values?.name}
            aria-invalid={!!err("name")}
            aria-describedby={err("name") ? "name-error" : undefined}
            placeholder="Nama Anda"
          />
          <FieldError id="name-error" error={err("name")} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={!!err("email")}
            aria-describedby={err("email") ? "email-error" : undefined}
            placeholder="anda@email.com"
          />
          <FieldError id="email-error" error={err("email")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">Pesan</label>
        <Textarea
          id="message"
          name="message"
          required
          defaultValue={state.values?.message}
          aria-invalid={!!err("message")}
          aria-describedby={err("message") ? "message-error" : undefined}
          placeholder="Ceritakan proyek atau ide Anda…"
        />
        <FieldError id="message-error" error={err("message")} />
      </div>

      {/* Honeypot anti-spam — tidak terlihat oleh manusia. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AnimatePresence mode="wait">
          {state.message && (
            <motion.p
              key={state.message}
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex items-center gap-2 text-sm",
                state.status === "success" ? "text-primary" : "text-destructive"
              )}
            >
              {state.status === "success" ? <CircleCheck className="size-4" /> : <TriangleAlert className="size-4" />}
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" size="lg" disabled={pending} className="sm:ml-auto">
          {pending ? <LoaderCircle className="animate-spin" /> : <Send />}
          {pending ? "Mengirim…" : "Kirim Pesan"}
        </Button>
      </div>
    </form>
  );
}
