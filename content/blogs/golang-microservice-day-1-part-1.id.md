---
title: "Day 1 Part 1 — Microservice Architecture & Message Broker"
date: "2026-06-06"
summary: "Teori dulu: memahami microservice architecture, perbandingannya dengan monolith, dan kenapa message broker seperti Apache Kafka itu penting."
tags: ["golang", "microservice", "kafka"]
series: "mastering-golang-microservice"
seriesDay: 1
seriesPart: 1
---

Oke, jadi hari ini gue mulai perjalanan belajar Golang microservice. Seri ini mendokumentasikan apa yang gue pelajari hari per hari dari course **Mastering Microservice Golang: Online Soccer Field Booking** di [BuildWithAngga](https://buildwithangga.com), dibimbing oleh **[Muhamad Faisal Ilhami Akbar](https://www.linkedin.com/in/faisalilhamiakbar/)**. Makasih banyak mas Faisal atas materi yang jelas, terstruktur, dan langsung bisa dipraktikkan — ini salah satu pengalaman belajar terbaik yang pernah gue rasain.

Hari pertama dibagi dua: teori dulu, baru langsung hands-on setup environment. Part ini fokus ke teorinya — karena ini yang perlu dikuasain dulu sebelum loncat ke implementasi.

Dua hal besar yang gue pelajarin hari ini: **Microservice Architecture** dan **Message Broker**. Let's break it down.

---

## Microservice Architecture

Sederhananya, microservice itu pendekatan membangun aplikasi dimana kamu pecah aplikasinya jadi service-service kecil yang berdiri sendiri. Setiap service punya satu fungsi bisnis spesifik, bisa dikembangkan sendiri, di-deploy sendiri, dan di-scale sendiri.

Contoh konkretnya:

- **Order Service** → ngurusin semua yang berhubungan dengan order
- **User Service** → ngurusin data user

Mereka jalan independen. Kalau Order Service lagi di-update, User Service tetap jalan normal.

![Diagram Microservice Architecture](/images/blogs/golang-day-1/microservice-diagram.png)

### Kelebihan Microservice

Yang bikin microservice menarik itu ada beberapa hal:

1. **Independensi pengembangan** — Tim bisa develop, test, dan deploy service mereka masing-masing tanpa blocking tim lain.
2. **Skalabilitas** — Kalau Order Service lagi overload, tinggal scale service itu aja, bukan seluruh aplikasi.
3. **Bebas pilih teknologi** — Satu service bisa pakai Go, service lain bisa pakai Python atau Node.js. Sesuai kebutuhan.
4. **Resiliensi** — Kalau satu service down, service lain tetap jalan. Aplikasi nggak langsung mati total.
5. **Pengembangan lebih cepat** — Tim kecil fokus di satu service, lebih gampang diatur dan lebih cepat gerak.

---

## Microservice vs Monolith

Ini perbandingannya:

| Aspek | Microservice | Monolith |
|-------|-------------|---------|
| Struktur | Banyak service kecil yang berdiri sendiri | Semua fungsi dalam satu codebase besar |
| Skalabilitas | Scale per service | Harus scale keseluruhan |
| Teknologi | Bebas pilih per service | Biasanya satu teknologi |
| Resiliensi | Satu service down, yang lain tetap jalan | Satu komponen gagal, seluruh app bisa terganggu |
| Deployment | Setiap service bisa deploy independen | Perubahan kecil = redeploy seluruh app |

### Kapan Pakai Microservice?

Nggak semua project cocok pakai microservice. Ini cocok buat yang:

- Aplikasi besar dengan banyak fitur
- Tim development besar dan terdistribusi
- Butuh skalabilitas tinggi
- Organisasi yang mau adopt DevOps

Kalau masih startup kecil atau project personal, mulai dari monolith dulu — lebih simple dan lebih gampang dikelola.

---

## Message Broker — Jembatan Antar Service

Kalau udah punya banyak service yang berdiri sendiri, gimana mereka berkomunikasi? Di sinilah **Message Broker** masuk.

Message Broker itu software yang memfasilitasi komunikasi antar aplikasi atau service dengan cara mengirim dan menerima pesan. Intinya: service-service nggak perlu langsung "nyambung" satu sama lain — mereka cukup kirim pesan ke broker, dan broker yang urus pengirimannya.

Ini yang bikin sistemnya lebih fleksible dan terdesentralisasi.

Beberapa Message Broker yang populer:

- **Apache Kafka**
- **RabbitMQ**
- **Amazon SQS**
- **ActiveMQ**
- **Azure Service Bus**

---

## Apache Kafka

Yang paling sering muncul kalau ngomongin microservice itu **Apache Kafka**. Ini platform stream-processing berbasis distribusi yang fungsi utamanya sebagai Message Broker.

Kafka banyak dipakai untuk:

- Integrasi antar sistem microservice
- Pemrosesan data real-time

![Diagram Apache Kafka Architecture](/images/blogs/golang-day-1/kafka-diagram.png)

Kafka itu beda dari message broker biasa karena dia juga bisa nyimpen message history — bukan cuma kirim-terima biasa. Ini yang bikin dia powerful buat use case streaming dan event sourcing.

---

## Key Points Hari Ini

- Microservice = aplikasi dipecah jadi service-service kecil yang independen
- Setiap service punya satu tanggung jawab bisnis yang spesifik
- Kelebihan utama: bisa scale & deploy per service, tim lebih fleksible, satu service down nggak bikin semua mati
- Monolith masih valid — jangan langsung microservice kalau project-nya kecil
- Message Broker = perantara komunikasi antar service, biar mereka nggak perlu terhubung langsung
- Apache Kafka = Message Broker paling populer, bonus bisa handle streaming data real-time
