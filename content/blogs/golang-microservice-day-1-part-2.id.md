---
title: "Day 1 Part 2 — Docker, GCP & Setup User Service"
date: "2026-06-06"
summary: "Hands-on Day 1: setup Docker Compose untuk local dev, daftar GCP untuk cloud deployment, dan clone user-service pertama dari go-skeleton."
tags: ["golang", "microservice", "docker", "gcp"]
series: "mastering-golang-microservice"
seriesDay: 1
seriesPart: 2
---

Setelah paham teorinya di Part 1, saatnya nyiapin environment dan mulai jalanin service pertama secara lokal.

---

## Setup Docker & Docker Compose

Di course ini, Docker dipakai buat local development — jauh lebih clean daripada install semua langsung di sistem.

Intinya Docker itu buat ngejalanin aplikasi dalam container yang terisolasi. Sedangkan Docker Compose ngatur banyak container sekaligus lewat satu file konfigurasi. Jadi misalnya mau jalanin PostgreSQL, Kafka, dan Consul sekaligus, tinggal tulis di satu `docker-compose.yaml` dan jalanin.

**Langkah-langkahnya:**

1. Download Docker Desktop di [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Install dan setup seperti biasa
3. Buat `docker-compose.yaml` — ini yang nentuin service apa aja yang mau dijalanin
4. Jalankan perintah:

```bash
docker compose up -d --build
```

![Docker Compose Up — proses build container berjalan](/images/blogs/golang-day-1/docker-compose-up.png)

Kalau build-nya sukses, Docker Desktop bakal nunjukin semua container yang lagi aktif.

![Docker Desktop setelah semua container berhasil jalan](/images/blogs/golang-day-1/docker-desktop.png)

---

## Register GCP

Sambil setup lokal, gue juga daftar ke **Google Cloud Platform (GCP)**. Ini buat nanti kalau mau coba deploy ke cloud. GCP kasih free trial **$300 selama 3 bulan** — lebih dari cukup buat belajar.

**Cara daftarnya:**

1. Buka [cloud.google.com](https://cloud.google.com), klik tombol **Start Free** di pojok kanan atas

![Halaman utama Google Cloud](/images/blogs/golang-day-1/gcp-homepage.png)

1. Klik **Agree and Continue**, isi data diri dan metode pembayaran

![Halaman registrasi GCP](/images/blogs/golang-day-1/gcp-register.png)

1. Klik **Start Trial**

![Konfirmasi start trial GCP](/images/blogs/golang-day-1/gcp-start-trial.png)

1. Done! Dashboard GCP udah bisa diakses

![Dashboard Google Cloud setelah registrasi berhasil](/images/blogs/golang-day-1/gcp-dashboard.png)

Kartu kredit/debit memang diminta pas registrasi, tapi **nggak ada charge** selama masih dalam free trial. Baru kena biaya kalau $300-nya habis atau 3 bulannya kelar, itupun harus upgrade manual dulu.

---

## User Service — Bikin Service Pertama

Nah ini yang paling seru — mulai nulis (lebih tepatnya clone) kode. Gue pakai **go-skeleton** dari mas Faisal sebagai base project buat user-service.

### Clone Project

Karena ini microservice, tiap service bakal punya repo sendiri. Supaya rapi, semua service gue taruh dalam satu folder induk: `go-projects`. Terus clone skeleton-nya dan langsung kasih nama `user-service`:

```bash
cd go-projects
git clone https://github.com/faisalilhami27/go-skeleton user-service
```

Ini tampilan struktur projectnya setelah di-clone:

![Struktur folder go-skeleton setelah clone](/images/blogs/golang-day-1/user-service-overview.png)

### Install Dependencies

Masuk ke folder `user-service`, lalu install semua package yang dibutuhkan:

```bash
go get gorm.io/gorm \
  gorm.io/driver/postgres \
  github.com/joho/godotenv \
  github.com/google/uuid \
  github.com/golang-jwt/jwt/v5 \
  github.com/sirupsen/logrus \
  github.com/spf13/cobra \
  github.com/spf13/viper \
  github.com/didip/tollbooth \
  github.com/gin-gonic/gin \
  github.com/hashicorp/consul/api \
  github.com/hashicorp/consul/sdk
```

![Proses install dependencies Go](/images/blogs/golang-day-1/user-service-install.png)

Rundown package-nya:

- **gorm** — ORM buat interaksi database
- **gin** — HTTP web framework yang populer di Go
- **jwt** — buat authentication
- **consul** — buat service discovery
- **viper + cobra** — konfigurasi dan CLI
- **logrus** — structured logging
- **tollbooth** — rate limiter

Setelah selesai, cek `go.mod` dan `go.sum` buat verifikasi package udah ke-install. Ini equivalentnya `package.json` dan `package-lock.json` di Node.js — bedanya, Go nggak bikin folder `node_modules`. Package-nya disimpen di global cache `~/go/pkg/mod`.

![go.mod dan go.sum setelah dependencies terinstall](/images/blogs/golang-day-1/user-service-gomod.png)

### Konfigurasi

Ada dua file yang perlu di-setup sebelum bisa jalan:

**`config.json`** — untuk setting service seperti nama service, port, admin user, key, dsb. Sesuaikan value-nya dengan kebutuhan project kamu.

![Contoh config.json untuk user-service](/images/blogs/golang-day-1/user-service-config.png)

**`.env`** — untuk environment variables, mostly database connection string dan secret keys.

![Setup .env untuk user-service](/images/blogs/golang-day-1/user-service-env.png)

---

## Key Points Hari Ini

- Docker + Docker Compose = setup environment lokal yang bersih dan portable
- GCP free trial $300/3 bulan — lebih dari cukup buat belajar, dan nggak ada charge selama belum upgrade manual
- Microservice = banyak folder terpisah, tiap service clone sendiri dalam satu folder induk
- `go.mod` dan `go.sum` = package management Go, mirip `package.json` tapi tanpa `node_modules`
