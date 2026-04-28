---
title: "Membuat blog markdown bilingual"
date: "2026-04-28"
summary: "Cara saya bikin blog ini tanpa database, pakai file markdown dan setup Next.js + i18n yang sudah ada."
tags: ["nextjs", "blog", "lessons"]
---

Saya pengen punya tempat buat nulis hal-hal yang saya pelajari — tapi saya gak mau setup CMS, ngurus database, atau host service tambahan. Jadi saya bikin blog ini dengan pendekatan paling simple yang bisa jalan: folder berisi file markdown, dibaca pas build.

## Kenapa markdown

Tiga alasan:

1. **Tanpa infrastruktur.** Gak ada database, gak ada CMS, gak ada API. File-nya ada di samping code, ikut version control bareng yang lain.
2. **Portable.** Kalau suatu saat saya rebuild website-nya, tinggal copy folder `content/` dan semua tulisan ikut. Gak perlu script export.
3. **Cepat dipakai.** Buka editor, ketik markdown, save. Gak ada tombol "publish", gak ada draft state, gak ada admin panel.

## Cara setup-nya

Setiap post itu dua file — satu per bahasa:

```
content/blogs/<slug>.en.md
content/blogs/<slug>.id.md
```

Library kecil baca folder-nya, parse frontmatter, compile body ke HTML, lalu kasih data-nya ke Server Component:

```ts
import { getAllPosts } from "@/lib/blogs";

export default function BlogsPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
```

Server Component handle file I/O pas build time, terus pass data-nya ke Client Component yang ngurus language switching pakai setup i18n yang sudah ada. Halaman tiap post di-generate statis via `generateStaticParams`.

### Tools yang dipakai

- [`gray-matter`](https://github.com/jonschlinkert/gray-matter) buat parse frontmatter
- `unified` + `remark-parse` + `remark-rehype` buat pipeline markdown → HTML
- [`rehype-pretty-code`](https://rehype-pretty.pages.dev/) (powered by Shiki) buat syntax highlighting — library yang sama yang Vercel pakai di docs mereka
- `reading-time` buat auto-calculate indikator "5 menit baca"

## Yang tidak ada

Blog ini sengaja minimal. Tidak ada search, tidak ada komentar, tidak ada RSS feed, tidak ada sistem draft, tidak ada related posts. Kalau nanti saya butuh salah satunya, saya tambah — tapi mulai kecil bikin lebih sedikit yang harus di-maintain dan lebih sedikit yang harus dipikirin pas mau nulis aja.

> Sistem terbaik adalah yang benar-benar Anda pakai.

Itu tujuannya. Lebih sedikit ceremony, lebih banyak nulis.
