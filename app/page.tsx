import { Suspense } from "react";
import { Mail, MapPin } from "lucide-react";
import { Background } from "@/components/sections/Background";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer, SocialLinks } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Navbar } from "@/components/sections/Navbar";
import { Section } from "@/components/sections/Section";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { GitHubProjects } from "@/components/projects/GitHubProjects";
import { ProjectsSkeleton } from "@/components/projects/ProjectsSkeleton";
import { GitHubStats } from "@/components/stats/GitHubStats";
import { StatsSkeleton } from "@/components/stats/StatsSkeleton";
import { Reveal } from "@/components/motion/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/site";

// Milestone (Supabase) selalu segar tiap request. Data GitHub tetap di-cache
// 1 jam lewat `fetch(..., { next: { revalidate } })` di lib/github.ts.
export const dynamic = "force-dynamic";

/**
 * Single-page portfolio. Shell (hero, skills, kontak) langsung dikirim;
 * bagian yang butuh data (GitHub, Supabase) di-stream lewat <Suspense>
 * dengan skeleton loader sebagai fallback.
 */
export default function Home() {
  return (
    <>
      <Background />
      <Navbar />

      <main>
        <Hero />

        <Section
          id="projects"
          eyebrow="Live dari GitHub"
          title={
            <>
              Proyek <span className="text-gradient">Terbaru</span>
            </>
          }
          description={`Repositori publik @${siteConfig.githubUsername}, ditarik langsung dari GitHub API. Urutkan berdasarkan bintang, aktivitas terbaru, atau filter per bahasa.`}
        >
          <Suspense fallback={<ProjectsSkeleton />}>
            <GitHubProjects />
          </Suspense>
        </Section>

        <Section
          id="skills"
          eyebrow="Tech Stack"
          title="Keahlian & Tools"
          description="Teknologi yang saya pakai sehari-hari untuk membangun produk dari ujung ke ujung."
        >
          <SkillsGrid />
        </Section>

        <Section
          id="stats"
          eyebrow="Statistik"
          title="Aktivitas GitHub"
          description="Ringkasan otomatis yang dihitung dari data repositori publik."
        >
          <Suspense fallback={<StatsSkeleton />}>
            <GitHubStats />
          </Suspense>
        </Section>

        <Section
          id="journey"
          eyebrow="Milestone"
          title="Perjalanan Karier"
          description="Pencapaian proyek Industrial IoT, otomatisasi, dan software — diperbarui langsung dari admin panel."
        >
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-xl" />
                ))}
              </div>
            }
          >
            <Journey />
          </Suspense>
        </Section>

        <Section
          id="contact"
          eyebrow="Kontak"
          title={
            <>
              Mari <span className="text-gradient">berkolaborasi</span>
            </>
          }
          description="Punya ide proyek, peluang kerja, atau sekadar ingin menyapa? Kirim pesan — saya biasanya membalas dalam 1–2 hari."
        >
          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal className="flex flex-col gap-6 lg:col-span-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="glass flex items-center gap-4 rounded-xl p-5 transition-colors hover:border-primary/40"
              >
                <Mail aria-hidden className="size-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="truncate font-medium">{siteConfig.email}</p>
                </div>
              </a>
              <div className="glass flex items-center gap-4 rounded-xl p-5">
                <MapPin aria-hidden className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p className="font-medium">{siteConfig.location}</p>
                </div>
              </div>
              <SocialLinks />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
