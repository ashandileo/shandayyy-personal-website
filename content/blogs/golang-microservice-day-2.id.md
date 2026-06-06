---
title: "Day 2 — Membangun HTTP Server & Routing"
date: "2026-06-07"
summary: "Hari kedua: setup HTTP server dari scratch pakai net/http, define routes, dan struktur handler yang bersih."
tags: ["golang", "microservice", "http"]
series: "mastering-golang-microservice"
seriesDay: 2
---

Hari kedua dimulai dari yang paling fundamental: server HTTP. Sebelum kita bicara tentang service mesh, gRPC, atau Kubernetes — kita harus ngerti dulu gimana Go handle HTTP request di level paling bawah.

## Kenapa `net/http` bukan framework?

Banyak developer Go langsung reach for Gin, Echo, atau Fiber. Itu valid — tapi sebelum pakai abstraksi, penting banget paham apa yang ada di bawahnya.

`net/http` dari standard library Go sudah production-ready. Netflix, Cloudflare, dan banyak perusahaan besar jalanin Go service mereka langsung di atas `net/http` tanpa framework tambahan.

```go
package main

import (
    "log"
    "net/http"
)

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("GET /health", healthHandler)
    mux.HandleFunc("GET /api/v1/users", listUsersHandler)
    mux.HandleFunc("POST /api/v1/users", createUserHandler)
    mux.HandleFunc("GET /api/v1/users/{id}", getUserHandler)

    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    log.Println("Server running on :8080")
    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

Perhatiin `ReadTimeout`, `WriteTimeout`, dan `IdleTimeout`. Ini bukan optional — tanpa ini, satu koneksi yang lambat bisa drain goroutine dan bikin service lu OOM.

## Struktur Handler yang Bersih

Handler yang buruk itu handler yang tau terlalu banyak. Dia tau tentang database, tau tentang HTTP, tau tentang business logic — semua dalam satu fungsi. Ini yang kita hindari.

```go
type UserHandler struct {
    svc UserService
}

func NewUserHandler(svc UserService) *UserHandler {
    return &UserHandler{svc: svc}
}

func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
    users, err := h.svc.ListUsers(r.Context())
    if err != nil {
        writeError(w, http.StatusInternalServerError, "failed to fetch users")
        return
    }
    writeJSON(w, http.StatusOK, users)
}
```

Handler hanya tau dua hal: gimana ngambil data dari request, dan gimana nulis response. Business logic ada di service layer. Database ada di repository layer. Masing-masing layer punya satu tanggung jawab.

## Middleware Pattern

Middleware di Go itu cuma fungsi yang wrap `http.Handler`:

```go
type Middleware func(http.Handler) http.Handler

func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

func Chain(h http.Handler, middlewares ...Middleware) http.Handler {
    for i := len(middlewares) - 1; i >= 0; i-- {
        h = middlewares[i](h)
    }
    return h
}
```

Dengan pattern ini, lu bisa compose middleware sesuka hati tanpa magic. Eksplisit, mudah di-trace, mudah di-test.

## Response Helper

Daripada nulis `json.NewEncoder(w).Encode(v)` di mana-mana, buat helper sekali:

```go
func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    if err := json.NewEncoder(w).Encode(v); err != nil {
        log.Printf("writeJSON: %v", err)
    }
}

func writeError(w http.ResponseWriter, status int, msg string) {
    writeJSON(w, status, map[string]string{"error": msg})
}
```

Sederhana, tapi ini yang bikin codebase lu konsisten. Setiap error response punya format yang sama, setiap success response punya format yang sama.

## Apa yang Dipelajari Hari Ini

- `net/http` sudah cukup powerful untuk production — tidak selalu butuh framework
- Timeout di server config itu wajib, bukan opsional
- Handler yang baik itu tipis — dia hanya jadi jembatan antara HTTP dan service layer
- Middleware adalah fungsi yang wrap handler, bukan magic annotation
- Helper function kecil untuk JSON response membuat kode lebih konsisten

Besok kita masuk ke database layer: connect ke PostgreSQL, setup connection pool, dan implementasi repository pattern yang bersih.
