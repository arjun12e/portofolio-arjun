// Satu-satunya tempat untuk mengubah identitas & konten statis portofolio.

export const siteConfig = {
  name: "Arjun",
  roles: [
    "Full-Stack Engineer",
    "AI Enthusiast",
    "Industrial IoT Developer",
    "Automation Builder",
  ],
  bio: "Saya membangun produk web end-to-end — dari antarmuka yang responsif hingga backend, otomatisasi industri, dan integrasi AI — dengan fokus pada performa dan pengalaman pengguna.",
  location: "Indonesia",
  email: "arjunsefuloh6@gmail.com",
  // Bisa di-override lewat env agar mudah dipakai ulang tanpa ubah kode.
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "arjun12e",
  socials: {
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "arjun12e"}`,
    linkedin: "https://www.linkedin.com/in/", // TODO: isi URL LinkedIn Anda
  },
} as const;

export const navItems = [
  { href: "#projects", label: "Proyek" },
  { href: "#skills", label: "Keahlian" },
  { href: "#stats", label: "Statistik" },
  { href: "#journey", label: "Perjalanan" },
  { href: "#contact", label: "Kontak" },
] as const;

export type SkillCategory = "Frontend" | "Backend" | "Tools" | "AI";

export interface SkillGroup {
  category: SkillCategory;
  description: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    description: "Antarmuka cepat, aksesibel, dan animatif.",
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    category: "Backend",
    description: "API, database, dan layanan real-time.",
    skills: ["Node.js", "PostgreSQL", "Supabase", "REST API", "MQTT", "Python"],
  },
  {
    category: "Tools",
    description: "Alur kerja, DevOps, dan deployment.",
    skills: ["Git & GitHub", "Docker", "Vercel", "Linux", "Node-RED", "PLC / SCADA"],
  },
  {
    category: "AI",
    description: "Integrasi LLM & otomatisasi cerdas.",
    skills: ["Claude API", "Prompt Engineering", "RAG", "LangChain", "Computer Vision"],
  },
];
