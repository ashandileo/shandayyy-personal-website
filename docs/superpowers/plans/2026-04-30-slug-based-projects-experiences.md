# Slug-based Projects & Experiences Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace array-position coupling between data files and locale JSON with stable per-item slugs, so adding/reordering/removing a project or experience is a single coherent edit per file.

**Architecture:** Each project and experience gets a `slug` field. Locale `projects.items` and `experience.jobs` change from arrays to objects keyed by slug. Experience styling (currently a parallel `EXPERIENCE_STYLES[]` array) is inlined onto each `Experience`. Consumers use `project.slug` / `experience.slug` for i18n lookups instead of array index.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, i18next + react-i18next, Tailwind v4. No test framework in this repo — verification is via `pnpm exec tsc --noEmit` plus a manual dev-server walkthrough at the end.

**Reference spec:** [docs/superpowers/specs/2026-04-30-slug-based-projects-experiences-design.md](../specs/2026-04-30-slug-based-projects-experiences-design.md)

**Commit style:** Single-line commit messages (no body, no `Co-Authored-By` trailers) per user convention.

---

## File Map

**Modify**

- `src/data/projects.ts` — add `slug` field
- `src/data/experiences.ts` — add `slug`, inline `style`, remove `descriptionCount` field, remove `EXPERIENCE_STYLES` export
- `src/locales/en.json` — `projects.items` and `experience.jobs` arrays → objects keyed by slug
- `src/locales/id.json` — same
- `src/app/_components/project-card.tsx` — i18n key uses `project.slug`
- `src/app/_components/project-dialog.tsx` — i18n keys use `project.slug`; drop `index` prop from public API
- `src/app/_components/projects-section.tsx` — drop locale-index threading; keep only display index for corner label
- `src/app/projects/_components/all-projects.tsx` — same
- `src/app/_components/experience-section.tsx` — drop `EXPERIENCE_STYLES` import; use `exp.style`
- `src/app/_components/experience-dialog.tsx` — drop `EXPERIENCES.indexOf` + `EXPERIENCE_STYLES`; use `experience.slug` + `experience.style`

**Not touched**

- `src/data/tech-stack.ts`, `src/data/contacts.ts`, `src/data/navigation.ts`
- `src/lib/i18n.ts`
- `src/app/_components/experience-card.tsx` — already takes `style` as a prop; no changes needed
- Anything under `src/app/blogs/`, `src/app/resume/`, `src/lib/blogs/`

---

## Task 1: Migrate projects to slug-based lookup

**Why this is one atomic commit:** The locale shape change (array → object) is incompatible with the old index-based lookup. Build/types break unless data + locales + consumers all change together.

**Files:**

- Modify: `src/data/projects.ts`
- Modify: `src/locales/en.json`
- Modify: `src/locales/id.json`
- Modify: `src/app/_components/project-card.tsx`
- Modify: `src/app/_components/project-dialog.tsx`
- Modify: `src/app/_components/projects-section.tsx`
- Modify: `src/app/projects/_components/all-projects.tsx`

### Step 1.1: Add `slug` to the `Project` interface and each project

- [ ] Open `src/data/projects.ts`. Add `slug: string` to the `Project` interface (first field), and add a `slug` value to every project entry. Use the slug values listed in the spec.

```ts
export interface Project {
  slug: string;
  title: string;
  images: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  gradient: string;
}
```

Slugs to assign, in current array order:

| Title | slug |
| --- | --- |
| MapTrack | `maptrack` |
| English AI Interview | `english-ai-interview` |
| Shopbot Assistant | `shopbot-assistant` |
| Echo Test | `echo-test` |
| Happy5 | `happy5` |
| Expense Tracker | `expense-tracker` |
| GoMovies | `gomovies` |
| Journal | `journal` |

For example, the first entry becomes:

```ts
{
  slug: "maptrack",
  title: "MapTrack",
  images: [
    "/projects/maptrack/maptrack-1.png",
    "/projects/maptrack/maptrack-11.mov",
  ],
  techStack: [
    "React.js",
    "Next.js",
    "Tailwind CSS",
    "Headless UI",
    "Supabase",
    "OpenAI",
    "React Hook Form",
    "TanStack Query",
    "TanStack DB",
    "Playwright",
  ],
  liveUrl: "https://maptrack.com",
  gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
},
```

Apply the same pattern to all 8 entries. Do not change any other field.

### Step 1.2: Convert `projects.items` to a slug-keyed object in `en.json`

- [ ] In `src/locales/en.json`, replace the `"projects.items"` array with an object keyed by slug. Move each existing item to the matching slug key (preserve `summary` and `description` strings exactly). Order in JSON does not matter — i18next will look up by key.

The new shape:

```json
"items": {
  "maptrack": {
    "summary": "One platform to manage your assets with real-time GPS tracking and monitoring.",
    "description": "MapTrack is a comprehensive asset management platform that provides real-time GPS tracking, battery monitoring, and device status indicators. Features include AI-powered PDF generation for custom forms, offline-first architecture powered by TanStack DB, and seamless integration with Supabase for data persistence. Built with a focus on reliability and performance in low-connectivity environments."
  },
  "english-ai-interview": {
    "summary": "Practice job interviews in English with an AI interviewer that adapts to your role and skills.",
    "description": "English AI Interview is a voice interview practice platform that helps users sharpen their English communication for real job interviews. Users can pick from ready-made interview templates or create fully customized setups — defining the interviewer's name, role, personality, target company, job title, key skills/topics, and additional notes that steer the AI's behavior. Each session runs in a focused practice mode powered by OpenAI, with dedicated start, respond, and score endpoints that drive the conversation and grade the user's performance. The dashboard surfaces recent sessions and personal setups, while the history page tracks score trends across attempts so users can measure their improvement. Built with Next.js 16, React 19, Supabase (auth, database, RLS), TanStack Query, Zustand, and Shadcn UI."
  },
  "shopbot-assistant": {
    "summary": "An AI-powered WhatsApp chatbot that helps SME owners manage product catalogs and serve customers automatically.",
    "description": "Shopbot Assistant is an AI-powered WhatsApp chatbot built for SME (UMKM) owners to manage their product catalog and automate customer interactions. Store owners can upload their product list through a web dashboard, and customers can check product availability directly via WhatsApp chat powered by Meta Cloud API. The bot uses Retrieval-Augmented Generation (RAG) with Supabase Vector Search and OpenAI embeddings to accurately answer product queries. Features include customizable bot persona settings, conversation history tracking, FAQ knowledge base management, and Supabase Auth with Row Level Security for multi-tenant support."
  },
  "echo-test": {
    "summary": "AI-powered interactive quiz platform for English language learning.",
    "description": "EchoTest is an AI-powered English learning platform where teachers create quizzes with AI assistance and students take interactive assessments. Teachers can upload PDF learning materials for AI-generated quiz questions, supporting multiple question types including multiple choice, essay, listening tests, and speaking tests with audio recording. Features include quiz management, student submission tracking, automated and manual grading, performance analytics, and Google authentication. Developed as an undergraduate thesis project."
  },
  "happy5": {
    "summary": "AI-powered performance management platform for aligning goals, work, and reviews.",
    "description": "Happy5 is an AI-powered performance management platform that unifies goal tracking, project management, and employee performance reviews. It enables organizations to align goals, work, and performance in one fully customizable platform. Supports multiple goal frameworks including OKRs, MBOs, and KPIs, with integrations to tools like Jira for comprehensive visibility into strategic alignment from executive level to individual contributors."
  },
  "expense-tracker": {
    "summary": "A personal finance app to track expenses and manage spending by category.",
    "description": "Expense Tracker is a personal finance management application built with Laravel and Inertia.js with React. Users can track daily expenses, organize spending by custom categories, and view a dashboard with financial summaries. Features include user authentication with login and registration, full CRUD for expenses and categories, responsive design for both desktop and mobile, and form validation powered by React Hook Form and Zod. The backend uses SQLite for lightweight data storage and Laravel for robust server-side logic."
  },
  "gomovies": {
    "summary": "A movie discovery app to search, explore, and view details about movies.",
    "description": "GoMovies is a movie application that provides users with information and details about movies. Users can search for movies, browse popular collections, view detailed information including ratings, duration, genres, and overviews, and print movie lists. Built with React.js and Next.js, it integrates with The Movie Database (TMDb) API for comprehensive movie data. Features include a hero banner with featured movies, an explore page with search functionality, detailed movie pages with production company info, and an about page."
  },
  "journal": {
    "summary": "A cross-platform personal journaling app with offline support and native deployment.",
    "description": "Built a cross-platform personal journaling app that lets users capture thoughts, attach photos, and tag locations. The app runs as a PWA with offline support and can be deployed natively to iOS and Android from a single React codebase using Ionic Capacitor. The backend is powered by Supabase for authentication, database, and file storage. Features include full-text search, dark mode, native sharing, and optimistic UI updates with TanStack Query."
  }
}
```

### Step 1.3: Convert `projects.items` to a slug-keyed object in `id.json`

- [ ] In `src/locales/id.json`, apply the same array-to-object transformation. The slug keys must be identical to `en.json`. The Indonesian `summary` and `description` strings are preserved verbatim from the existing array entries — only the structural shape changes.

```json
"items": {
  "maptrack": {
    "summary": "Satu platform untuk mengelola aset dengan pelacakan GPS dan pemantauan real-time.",
    "description": "MapTrack adalah platform manajemen aset komprehensif yang menyediakan pelacakan GPS real-time, pemantauan baterai, dan indikator status perangkat. Fitur meliputi pembuatan PDF berbasis AI untuk formulir kustom, arsitektur offline-first yang didukung TanStack DB, dan integrasi mulus dengan Supabase untuk penyimpanan data. Dibangun dengan fokus pada keandalan dan performa di lingkungan dengan konektivitas rendah."
  },
  "english-ai-interview": {
    "summary": "Latihan wawancara kerja dalam Bahasa Inggris bersama AI interviewer yang menyesuaikan posisi dan skill Anda.",
    "description": "English AI Interview adalah platform latihan voice interview yang membantu pengguna mengasah komunikasi Bahasa Inggris untuk wawancara kerja sungguhan. Pengguna dapat memilih template wawancara siap pakai atau membuat setup sepenuhnya kustom — menentukan nama interviewer, role, kepribadian, perusahaan target, job title, key skills/topik, serta catatan tambahan yang mengarahkan perilaku AI. Setiap sesi dijalankan dalam mode practice yang fokus dan didukung OpenAI, dengan endpoint start, respond, dan score yang menggerakkan percakapan sekaligus menilai performa pengguna. Dashboard menampilkan sesi terbaru dan setup milik pengguna, sementara halaman history melacak tren skor antar percobaan agar pengguna dapat memantau peningkatan dari waktu ke waktu. Dibangun dengan Next.js 16, React 19, Supabase (auth, database, RLS), TanStack Query, Zustand, dan Shadcn UI."
  },
  "shopbot-assistant": {
    "summary": "Chatbot WhatsApp berbasis AI yang membantu pemilik UMKM mengelola katalog produk dan melayani pelanggan secara otomatis.",
    "description": "Shopbot Assistant adalah chatbot WhatsApp berbasis AI yang dibangun untuk pemilik UMKM dalam mengelola katalog produk dan mengotomatisasi interaksi dengan pelanggan. Pemilik toko dapat mengunggah daftar produk melalui dashboard web, dan pelanggan dapat mengecek ketersediaan produk langsung melalui chat WhatsApp yang didukung Meta Cloud API. Bot menggunakan Retrieval-Augmented Generation (RAG) dengan Supabase Vector Search dan OpenAI embeddings untuk menjawab pertanyaan produk secara akurat. Fitur meliputi pengaturan persona bot yang dapat dikustomisasi, pelacakan riwayat percakapan, manajemen knowledge base FAQ, serta Supabase Auth dengan Row Level Security untuk dukungan multi-tenant."
  },
  "echo-test": {
    "summary": "Platform kuis interaktif berbasis AI untuk pembelajaran Bahasa Inggris.",
    "description": "EchoTest adalah platform pembelajaran Bahasa Inggris berbasis AI di mana guru membuat kuis dengan bantuan AI dan siswa mengerjakan asesmen interaktif. Guru dapat mengunggah materi pembelajaran dalam format PDF untuk pembuatan soal kuis secara otomatis oleh AI, mendukung berbagai tipe soal termasuk pilihan ganda, esai, listening test, dan speaking test dengan perekaman audio. Fitur meliputi manajemen kuis, pelacakan submission siswa, penilaian otomatis dan manual, analitik performa, serta autentikasi Google. Dikembangkan sebagai proyek skripsi."
  },
  "happy5": {
    "summary": "Platform manajemen performa berbasis AI untuk menyelaraskan tujuan, pekerjaan, dan review.",
    "description": "Happy5 adalah platform manajemen performa berbasis AI yang menyatukan pelacakan tujuan, manajemen proyek, dan review performa karyawan. Platform ini memungkinkan organisasi menyelaraskan tujuan, pekerjaan, dan performa dalam satu platform yang sepenuhnya dapat disesuaikan. Mendukung berbagai framework tujuan termasuk OKR, MBO, dan KPI, dengan integrasi ke tools seperti Jira untuk visibilitas komprehensif terhadap keselarasan strategis dari level eksekutif hingga kontributor individu."
  },
  "expense-tracker": {
    "summary": "Aplikasi keuangan pribadi untuk melacak pengeluaran dan mengelola spending berdasarkan kategori.",
    "description": "Expense Tracker adalah aplikasi manajemen keuangan pribadi yang dibangun dengan Laravel dan Inertia.js dengan React. Pengguna dapat melacak pengeluaran harian, mengorganisir spending berdasarkan kategori kustom, dan melihat dashboard dengan ringkasan keuangan. Fitur meliputi autentikasi pengguna dengan login dan registrasi, CRUD lengkap untuk pengeluaran dan kategori, desain responsif untuk desktop dan mobile, serta validasi form menggunakan React Hook Form dan Zod. Backend menggunakan SQLite untuk penyimpanan data yang ringan dan Laravel untuk logika server-side yang robust."
  },
  "gomovies": {
    "summary": "Aplikasi pencarian film untuk mencari, menjelajahi, dan melihat detail tentang film.",
    "description": "GoMovies adalah aplikasi film yang menyediakan informasi dan detail tentang film. Pengguna dapat mencari film, menjelajahi koleksi populer, melihat informasi detail termasuk rating, durasi, genre, dan sinopsis, serta mencetak daftar film. Dibangun dengan React.js dan Next.js, aplikasi ini terintegrasi dengan The Movie Database (TMDb) API untuk data film yang komprehensif. Fitur meliputi banner hero dengan film unggulan, halaman explore dengan fungsi pencarian, halaman detail film dengan info perusahaan produksi, dan halaman about."
  },
  "journal": {
    "summary": "Aplikasi jurnal pribadi cross-platform dengan dukungan offline dan deployment native.",
    "description": "Membangun aplikasi jurnal pribadi cross-platform yang memungkinkan pengguna mencatat pikiran, melampirkan foto, dan menandai lokasi. Aplikasi berjalan sebagai PWA dengan dukungan offline dan dapat di-deploy secara native ke iOS dan Android dari satu codebase React menggunakan Ionic Capacitor. Backend didukung oleh Supabase untuk autentikasi, database, dan penyimpanan file. Fitur meliputi pencarian full-text, dark mode, native sharing, dan optimistic UI updates dengan TanStack Query."
  }
}
```

### Step 1.4: Update `ProjectCard` to use slug for i18n

- [ ] In `src/app/_components/project-card.tsx`, change the locale lookup from `index`-based to `project.slug`-based. The `index` prop stays — but only for the corner label display ("01", "01 / 08"), not for translation.

Replace line 133:

```tsx
{t(`projects.items.${index}.summary`)}
```

with:

```tsx
{t(`projects.items.${project.slug}.summary`)}
```

No other changes in this file. The `index` prop continues to drive `cornerLabel`.

### Step 1.5: Update `ProjectDialog` to use slug for i18n

- [ ] In `src/app/_components/project-dialog.tsx`, drop the `index` prop entirely. The dialog only needs `project` (which carries `slug`). Replace the inner component signature, the wrapper signature, and both i18n calls.

Inner component (lines 20–28) becomes:

```tsx
function ProjectDialogInner({
  project,
  onOpenChange,
}: {
  project: Project;
  onOpenChange: (open: boolean) => void;
}) {
```

Replace the two i18n calls:

- Line 41: `{t(\`projects.items.${index}.summary\`)}` → `{t(\`projects.items.${project.slug}.summary\`)}`
- Line 104: `{t(\`projects.items.${index}.description\`)}` → `{t(\`projects.items.${project.slug}.description\`)}`

Outer wrapper (lines 163–182) becomes:

```tsx
export function ProjectDialog({
  project,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;
  return (
    <ProjectDialogInner
      key={project.title}
      project={project}
      onOpenChange={onOpenChange}
    />
  );
}
```

Note: the `open: boolean` field stays in the public prop type even though it is unused inside the function (parent components pass it). Leaving it preserves the existing call sites without churn.

### Step 1.6: Update `ProjectsSection` to drop the dialog `index` thread

- [ ] In `src/app/_components/projects-section.tsx`, the dialog `index` prop is gone. Update the local state shape and the `<ProjectDialog>` call. The corner-label `index` stays on `<ProjectCard>` because that's a display index.

Change the state declaration on line 16:

```tsx
const [selected, setSelected] = useState<Project | null>(null);
```

Update the featured `setSelected` callback (line 54):

```tsx
onSelect={() => setSelected(featured)}
```

Update the loop's `setSelected` callback (line 76):

```tsx
onSelect={() => setSelected(project)}
```

Update the `<ProjectDialog>` element (lines 94–101). Remove the `index` prop:

```tsx
<ProjectDialog
  project={selected}
  open={!!selected}
  onOpenChange={(open) => {
    if (!open) setSelected(null);
  }}
/>
```

The `<ProjectCard>` calls keep their `index` prop unchanged — that's the corner-label position, not a locale key.

### Step 1.7: Update `AllProjects` to drop the dialog `index` thread

- [ ] In `src/app/projects/_components/all-projects.tsx`, mirror the same change.

State (line 16):

```tsx
const [selected, setSelected] = useState<Project | null>(null);
```

`setSelected` callback (line 89):

```tsx
onSelect={() => setSelected(project)}
```

`<ProjectDialog>` (lines 96–103):

```tsx
<ProjectDialog
  project={selected}
  open={!!selected}
  onOpenChange={(open) => {
    if (!open) setSelected(null);
  }}
/>
```

`<ProjectCard>` keeps its `index={idx}` — display position.

### Step 1.8: Verify types

- [ ] Run typecheck.

```bash
pnpm exec tsc --noEmit
```

Expected: exits 0 with no output. If errors appear, the most likely causes are:

- A consumer was missed (search for `projects.items.${`).
- A locale entry uses a slug that doesn't exist in `projects.ts` (or vice versa).

### Step 1.9: Commit

- [ ] Stage and commit.

```bash
git add src/data/projects.ts src/locales/en.json src/locales/id.json src/app/_components/project-card.tsx src/app/_components/project-dialog.tsx src/app/_components/projects-section.tsx src/app/projects/_components/all-projects.tsx
git commit -m "refactor(projects): slug-based locale lookup"
```

---

## Task 2: Migrate experiences to slug-based lookup

**Why this is one atomic commit:** Same reason as Task 1 — locale shape, data shape, and consumers are all coupled.

**Files:**

- Modify: `src/data/experiences.ts`
- Modify: `src/locales/en.json`
- Modify: `src/locales/id.json`
- Modify: `src/app/_components/experience-section.tsx`
- Modify: `src/app/_components/experience-dialog.tsx`

`src/app/_components/experience-card.tsx` does not change — it already accepts `style` as a prop.

### Step 2.1: Rewrite `src/data/experiences.ts`

- [ ] Replace the file contents. The new file (a) adds `slug` to each entry, (b) inlines `style` into each entry, (c) deletes the `descriptionCount` field, and (d) removes the `EXPERIENCE_STYLES` array export.

```ts
export interface ExperienceStyle {
  color: string;
  initials: string;
  lightBg: string;
  isLightInitials?: boolean;
}

export interface Experience {
  slug: string;
  role: string;
  company: string;
  location: string;
  period: string;
  skills: string[];
  website?: string;
  style: ExperienceStyle;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "maptrack-fullstack",
    role: "Product Software Engineer (Fullstack)",
    company: "MapTrack",
    location: "Remote, Full-time",
    period: "Jan 2025 — Present",
    skills: ["Next.js", "TypeScript", "Supabase", "OpenAI", "TanStack DB"],
    website: "https://maptrack.com",
    style: {
      color: "var(--primary)",
      lightBg: "color-mix(in oklch, var(--primary) 8%, transparent)",
      initials: "MT",
    },
  },
  {
    slug: "happy5-fullstack",
    role: "Frontend Web/Mobile Engineer",
    company: "Happy5",
    location: "Remote, Full-time",
    period: "Mar 2021 — Dec 2025",
    skills: ["React", "React Native", "TypeScript", "Tailwind CSS", "Cypress", "Storybook", "Amplitude"],
    website: "https://www.happy5.co/",
    style: {
      color: "var(--secondary)",
      lightBg: "color-mix(in oklch, var(--secondary) 8%, transparent)",
      initials: "H5",
    },
  },
  {
    slug: "kodegiri",
    role: "Frontend Web Engineer",
    company: "Kodegiri",
    location: "Remote, Freelance",
    period: "Mar 2024 — Jun 2024",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Ant Design"],
    style: {
      color: "var(--accent)",
      lightBg: "color-mix(in oklch, var(--accent) 10%, transparent)",
      initials: "KG",
      isLightInitials: true,
    },
  },
  {
    slug: "rakamin",
    role: "Frontend Web Engineer",
    company: "Rakamin Academy",
    location: "Remote, Freelance",
    period: "Mar 2022 — Apr 2022",
    skills: ["React.js", "React Query", "Styled Components"],
    style: {
      color: "oklch(0.45 0.14 190)",
      lightBg: "color-mix(in oklch, oklch(0.45 0.14 190) 8%, transparent)",
      initials: "RA",
    },
  },
  {
    slug: "smarteschool",
    role: "Frontend Web Engineer",
    company: "Smarteschool",
    location: "Remote, Freelance",
    period: "Jul 2021 — Feb 2022",
    skills: ["Next.js", "Bootstrap", "React"],
    style: {
      color: "oklch(0.5 0.18 290)",
      lightBg: "color-mix(in oklch, oklch(0.5 0.18 290) 8%, transparent)",
      initials: "SS",
    },
  },
  {
    slug: "happy5-intern",
    role: "Frontend Web Engineer (Intern)",
    company: "Happy5",
    location: "Remote, Intern",
    period: "May 2020 — Mar 2021",
    skills: ["React", "Cypress", "@react-pdf/renderer"],
    website: "https://www.happy5.co/",
    style: {
      color: "oklch(0.75 0.18 29)",
      lightBg: "color-mix(in oklch, oklch(0.75 0.18 29) 8%, transparent)",
      initials: "H5",
      isLightInitials: true,
    },
  },
];
```

The `EXPERIENCE_STYLES` array and the `descriptionCount` field are gone. The style values are unchanged from the original — they are just relocated.

### Step 2.2: Convert `experience.jobs` to a slug-keyed object in `en.json`

- [ ] In `src/locales/en.json`, replace the `experience.jobs` array with a slug-keyed object. Strings are preserved exactly; only the shape changes.

```json
"jobs": {
  "maptrack-fullstack": {
    "description": [
      "Integrated OpenAI-powered PDF generation for custom forms, enabling dynamic form creation, intelligent content structuring, and automated document generation.",
      "Refactored the data layer using TanStack DB to support an offline-first architecture, improving reliability and user experience in low-connectivity environments.",
      "Implemented AI streaming with OpenAI's streaming mode to progressively render generated content, significantly improving perceived responsiveness and user experience while waiting for AI generation."
    ]
  },
  "happy5-fullstack": {
    "description": [
      "Conducted thorough code reviews, optimizing overall performance.",
      "Successfully refactored JavaScript codebases into TypeScript, ensuring improved efficiency and maintainability.",
      "Converting designs from the design team (mockups, wireframes) into interactive web pages using HTML, Tailwind CSS, and JavaScript/TypeScript.",
      "Implemented end-to-end testing using Cypress, enhancing the reliability of the application.",
      "Designed reusable components and meticulously documented them with Storybook, facilitating easier development and collaboration.",
      "Successfully guided new intern engineers in developing features and resolving bugs.",
      "Managed Amplitude analytics integration, providing valuable insights into user behavior.",
      "Built Happy5 Culture application using React Native, enhancing performance and code maintainability.",
      "Set up Tailwind CSS within the mobile application framework, streamlining the styling process and ensuring a consistent design system."
    ]
  },
  "kodegiri": {
    "description": [
      "Successfully revamped the VRMS web application with a new design and additional features using React.js.",
      "Styling components using Tailwind CSS.",
      "Utilized Ant Design as the base component library.",
      "Successfully refactored JavaScript codebases into TypeScript, ensuring improved efficiency and maintainability."
    ]
  },
  "rakamin": {
    "description": [
      "Enhanced features to improve user experience and functionality.",
      "Implemented designs into React components, ensuring a seamless transition from mockups to code.",
      "Integrated the application with backend services, enabling dynamic and interactive features.",
      "Consumed backend endpoints using React Query, optimizing data fetching and state management.",
      "Styled React components using the Styled Components library, ensuring consistent and maintainable styling across the application."
    ]
  },
  "smarteschool": {
    "description": [
      "Developed new features using Next.js.",
      "Utilized Bootstrap as the CSS framework, ensuring a responsive and aesthetically pleasing design.",
      "Created reusable functions to efficiently consume backend endpoints, promoting code reusability and maintainability.",
      "Conducted thorough code reviews, ensuring high code quality.",
      "Implemented design specifications into React components, translating visual designs into interactive elements.",
      "Revamped outdated pages, improving their performance, design, and functionality to meet modern standards."
    ]
  },
  "happy5-intern": {
    "description": [
      "Successfully developed formal review results using @react-pdf/renderer, enabling the generation of PDF documents within the application.",
      "Implemented end-to-end testing using Cypress, enhancing the reliability of the application.",
      "Identified and fixed bugs, as well as implemented improvements to ensure the application's stability and performance.",
      "Integrated the application with backend services, ensuring seamless communication and data flow between frontend and backend."
    ]
  }
}
```

### Step 2.3: Convert `experience.jobs` to a slug-keyed object in `id.json`

- [ ] Same shape change in `src/locales/id.json`. Indonesian strings preserved verbatim.

```json
"jobs": {
  "maptrack-fullstack": {
    "description": [
      "Mengintegrasikan pembuatan PDF berbasis OpenAI untuk formulir kustom, memungkinkan pembuatan formulir dinamis, penataan konten cerdas, dan pembuatan dokumen otomatis.",
      "Melakukan refaktor lapisan data menggunakan TanStack DB untuk mendukung arsitektur offline-first, meningkatkan keandalan dan pengalaman pengguna di lingkungan dengan konektivitas rendah.",
      "Mengimplementasikan AI streaming menggunakan mode streaming OpenAI untuk merender konten yang dihasilkan secara bertahap, secara signifikan meningkatkan persepsi responsivitas dan pengalaman pengguna selama proses generasi AI berlangsung."
    ]
  },
  "happy5-fullstack": {
    "description": [
      "Melakukan code review secara menyeluruh, mengoptimalkan performa secara keseluruhan.",
      "Berhasil melakukan refaktor codebase JavaScript ke TypeScript, memastikan peningkatan efisiensi dan kemudahan pemeliharaan.",
      "Mengonversi desain dari tim desain (mockup, wireframe) menjadi halaman web interaktif menggunakan HTML, Tailwind CSS, dan JavaScript/TypeScript.",
      "Mengimplementasikan pengujian end-to-end menggunakan Cypress, meningkatkan keandalan aplikasi.",
      "Merancang komponen yang dapat digunakan kembali dan mendokumentasikannya secara detail dengan Storybook, memfasilitasi pengembangan dan kolaborasi yang lebih mudah.",
      "Berhasil membimbing engineer magang baru dalam mengembangkan fitur dan menyelesaikan bug.",
      "Mengelola integrasi analitik Amplitude, memberikan wawasan berharga tentang perilaku pengguna.",
      "Membangun aplikasi Happy5 Culture menggunakan React Native, meningkatkan performa dan kemudahan pemeliharaan kode.",
      "Menyiapkan Tailwind CSS dalam framework aplikasi mobile, menyederhanakan proses styling dan memastikan sistem desain yang konsisten."
    ]
  },
  "kodegiri": {
    "description": [
      "Berhasil merombak aplikasi web VRMS dengan desain baru dan fitur tambahan menggunakan React.js.",
      "Melakukan styling komponen menggunakan Tailwind CSS.",
      "Menggunakan Ant Design sebagai library komponen dasar.",
      "Berhasil melakukan refaktor codebase JavaScript ke TypeScript, memastikan peningkatan efisiensi dan kemudahan pemeliharaan."
    ]
  },
  "rakamin": {
    "description": [
      "Meningkatkan fitur untuk memperbaiki pengalaman pengguna dan fungsionalitas.",
      "Mengimplementasikan desain ke dalam komponen React, memastikan transisi yang mulus dari mockup ke kode.",
      "Mengintegrasikan aplikasi dengan layanan backend, memungkinkan fitur yang dinamis dan interaktif.",
      "Mengonsumsi endpoint backend menggunakan React Query, mengoptimalkan pengambilan data dan manajemen state.",
      "Melakukan styling komponen React menggunakan library Styled Components, memastikan styling yang konsisten dan mudah dipelihara di seluruh aplikasi."
    ]
  },
  "smarteschool": {
    "description": [
      "Mengembangkan fitur baru menggunakan Next.js.",
      "Menggunakan Bootstrap sebagai framework CSS, memastikan desain yang responsif dan estetis.",
      "Membuat fungsi yang dapat digunakan kembali untuk mengonsumsi endpoint backend secara efisien, mendorong reusabilitas dan kemudahan pemeliharaan kode.",
      "Melakukan code review secara menyeluruh, memastikan kualitas kode yang tinggi.",
      "Mengimplementasikan spesifikasi desain ke dalam komponen React, menerjemahkan desain visual menjadi elemen interaktif.",
      "Merombak halaman yang sudah usang, meningkatkan performa, desain, dan fungsionalitas agar memenuhi standar modern."
    ]
  },
  "happy5-intern": {
    "description": [
      "Berhasil mengembangkan hasil review formal menggunakan @react-pdf/renderer, memungkinkan pembuatan dokumen PDF dalam aplikasi.",
      "Mengimplementasikan pengujian end-to-end menggunakan Cypress, meningkatkan keandalan aplikasi.",
      "Mengidentifikasi dan memperbaiki bug, serta mengimplementasikan peningkatan untuk memastikan stabilitas dan performa aplikasi.",
      "Mengintegrasikan aplikasi dengan layanan backend, memastikan komunikasi dan aliran data yang lancar antara frontend dan backend."
    ]
  }
}
```

### Step 2.4: Update `ExperienceSection` to use `exp.style`

- [ ] In `src/app/_components/experience-section.tsx`:

Replace the import on line 6:

```tsx
import { EXPERIENCES, type Experience } from "@/data/experiences";
```

Replace the `EXPERIENCES.map` block (lines 44–62). The `style` is now read from `exp.style`, and `key` uses the slug:

```tsx
{EXPERIENCES.map((exp, i) => {
  const isCurrent = i === 0;
  return (
    <li key={exp.slug} className="stagger-item relative">
      <span
        aria-hidden
        className="absolute left-[-30px] top-5 size-4 border-[2.5px] border-border shadow-[2px_2px_0_var(--border)]"
        style={{ background: exp.style.color }}
      />
      <ExperienceCard
        experience={exp}
        style={exp.style}
        isCurrent={isCurrent}
        onSelect={() => setSelectedExperience(exp)}
      />
    </li>
  );
})}
```

`isCurrent` still depends on the array position (the first entry is "current"), which is intentional — the most recent role is conceptually the first item, regardless of slug.

### Step 2.5: Update `ExperienceDialog` to use `experience.slug` and `experience.style`

- [ ] In `src/app/_components/experience-dialog.tsx`:

Replace the import on line 14:

```tsx
import { EXPERIENCES, type Experience } from "@/data/experiences";
```

Replace the body of `ExperienceDialogInner` (lines 23–32). The `EXPERIENCES.indexOf` lookup is gone; `style` and the bullets key now come straight from the experience.

```tsx
const { t } = useTranslation();
const style = experience.style;
const isCurrent = EXPERIENCES[0]?.slug === experience.slug;
const [location, type] = experience.location.split(",").map((s) => s.trim());
const bullets = t(`experience.jobs.${experience.slug}.description`, {
  returnObjects: true,
}) as string[];
```

The `isCurrent` check now compares slugs against the first entry, preserving the "the first experience is current" semantic without coupling to array index. The `EXPERIENCES` import is kept just for that comparison.

The `key` on `ExperienceDialogInner` (line 141) is fine as-is (`experience.company + experience.period`), but for consistency switch it to the slug:

```tsx
key={experience.slug}
```

### Step 2.6: Verify types

- [ ] Run typecheck.

```bash
pnpm exec tsc --noEmit
```

Expected: exits 0 with no output. If errors appear, the most likely causes are:

- An import of `EXPERIENCE_STYLES` was missed (search for `EXPERIENCE_STYLES`).
- A reference to `descriptionCount` was missed (search for `descriptionCount`).
- A consumer was missed (search for `experience.jobs.${`).

### Step 2.7: Commit

- [ ] Stage and commit.

```bash
git add src/data/experiences.ts src/locales/en.json src/locales/id.json src/app/_components/experience-section.tsx src/app/_components/experience-dialog.tsx
git commit -m "refactor(experience): slug-based locale lookup, inline styles"
```

---

## Task 3: Manual verification in dev server

The previous tasks rely on the type system to catch structural mistakes. This task catches runtime issues that the type system can't see — most importantly, locale key drift.

**Files:** none modified.

### Step 3.1: Start the dev server

- [ ] Run:

```bash
pnpm dev
```

Wait for the "Ready" line, then open the printed URL (default `http://localhost:3000`).

### Step 3.2: Verify the home page in English

- [ ] Confirm the language toggle is set to EN (the saved preference may be in localStorage; clear it if needed via DevTools → Application → Local Storage).
- [ ] Scroll to the **Projects** section. All five visible cards must render their summary text. No "projects.items.maptrack.summary" raw key visible.
- [ ] Scroll to the **Experience** section. All six experience cards render company name, role, period, and skills. The two Happy5 entries have **different colored badges** (orange tone for the intern, teal/secondary for the fullstack role).

### Step 3.3: Verify project dialogs

- [ ] Click each visible project card on the home page. The dialog opens with summary, image carousel, full description, tech stack, and any Live/Code buttons. Close it (Esc).
- [ ] Click **View All Projects** to navigate to `/projects`. Open at least 3 dialogs across different rows. All summaries and descriptions render.

### Step 3.4: Verify experience dialogs

- [ ] On the home page, click each of the six experience cards. The dialog header inherits the matching color, and the bullet list renders the correct number of items per role.
- [ ] Pay attention to the two Happy5 entries:
  - "Frontend Web/Mobile Engineer" (`happy5-fullstack`) → 9 bullets, secondary color header.
  - "Frontend Web Engineer (Intern)" (`happy5-intern`) → 4 bullets, orange-tone color header.
- [ ] If either Happy5 dialog shows the wrong bullet count or wrong color, slug keys are mis-paired. Stop and grep `happy5-` across `experiences.ts` and both locale files.

### Step 3.5: Switch to Indonesian and re-verify

- [ ] Toggle the language to ID (the navbar toggle, or via the language switcher).
- [ ] Repeat 3.2 + 3.3 + 3.4 in Indonesian. Confirm Indonesian summaries, descriptions, and bullets render. Especially the two Happy5 dialogs should still show correct, distinct content.

### Step 3.6: Sanity-check the console

- [ ] Open DevTools → Console. Look for i18next warnings of the form `i18next::translator: missingKey ... projects.items.<slug>.summary` or `experience.jobs.<slug>.description`. Any such warning means the slug is present in `projects.ts` / `experiences.ts` but missing from the matching locale file. Fix the locale entry.

### Step 3.7: Final cleanup

- [ ] Stop the dev server. No additional commit is needed if no fixes were required.
- [ ] If verification turned up missing keys and you fixed them, commit:

```bash
git add src/locales/en.json src/locales/id.json
git commit -m "fix(locales): add missing slug keys"
```

---

## Done

At this point:

- Adding a new project means: append one entry to `PROJECTS` (with a new slug), add one entry under that slug in `en.json` and `id.json`. Three edits, no index bookkeeping.
- Adding a new experience means: append one entry to `EXPERIENCES` (slug + inline style + skills), add one entry under that slug in `en.json` and `id.json`. Three edits, no parallel-array bookkeeping.
- Reordering an entry means moving one block in the data file. Locales follow by key, not position.
