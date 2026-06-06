---
title: "Day 3 — Database Layer & Repository Pattern"
date: "2026-06-08"
summary: "Hari ketiga: connect ke PostgreSQL, setup pgx connection pool, dan implementasi repository pattern yang bersih dan testable."
tags: ["golang", "microservice", "postgresql", "database"]
series: "mastering-golang-microservice"
seriesDay: 3
---

Database adalah jantung dari hampir semua microservice. Hari ini kita set up koneksi ke PostgreSQL dan tulis repository layer yang benar — bukan yang cuma "jalan", tapi yang mudah di-test, mudah di-maintain, dan tidak bocorkan detail implementasi ke layer lain.

## Pilih Driver yang Tepat

Ada dua opsi populer untuk PostgreSQL di Go:

- `database/sql` + `lib/pq` — standard library interface, compatible dengan banyak tools
- `pgx` — PostgreSQL-native, lebih performant, fitur lebih lengkap

Untuk microservice baru, `pgx` adalah pilihan yang lebih baik. Ini yang kita pakai.

```go
import (
    "context"

    "github.com/jackc/pgx/v5/pgxpool"
)

func NewPool(ctx context.Context, connString string) (*pgxpool.Pool, error) {
    cfg, err := pgxpool.ParseConfig(connString)
    if err != nil {
        return nil, fmt.Errorf("parse config: %w", err)
    }

    cfg.MaxConns = 25
    cfg.MinConns = 5
    cfg.MaxConnLifetime = 30 * time.Minute
    cfg.MaxConnIdleTime = 5 * time.Minute
    cfg.HealthCheckPeriod = 1 * time.Minute

    pool, err := pgxpool.NewWithConfig(ctx, cfg)
    if err != nil {
        return nil, fmt.Errorf("create pool: %w", err)
    }

    if err := pool.Ping(ctx); err != nil {
        return nil, fmt.Errorf("ping db: %w", err)
    }

    return pool, nil
}
```

`MaxConns` 25 adalah starting point yang reasonable untuk microservice dengan load sedang. Sesuaikan berdasarkan profiling — terlalu banyak connection justru bikin overhead di sisi PostgreSQL.

## Repository Pattern

Repository pattern memisahkan "gimana data disimpan" dari "gimana data dipakai". Handler dan service tidak tahu apakah kita pakai PostgreSQL, Redis, atau flat file — mereka hanya tahu interface.

```go
type User struct {
    ID        uuid.UUID
    Email     string
    Name      string
    CreatedAt time.Time
}

type UserRepository interface {
    FindByID(ctx context.Context, id uuid.UUID) (*User, error)
    FindAll(ctx context.Context) ([]User, error)
    Create(ctx context.Context, u *User) error
    Update(ctx context.Context, u *User) error
    Delete(ctx context.Context, id uuid.UUID) error
}
```

Interface ini yang di-inject ke service layer. Implementasi PostgreSQL-nya baru kita tulis terpisah:

```go
type pgUserRepository struct {
    pool *pgxpool.Pool
}

func NewPgUserRepository(pool *pgxpool.Pool) UserRepository {
    return &pgUserRepository{pool: pool}
}

func (r *pgUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
    const q = `
        SELECT id, email, name, created_at
        FROM users
        WHERE id = $1
    `

    var u User
    err := r.pool.QueryRow(ctx, q, id).Scan(
        &u.ID, &u.Email, &u.Name, &u.CreatedAt,
    )
    if errors.Is(err, pgx.ErrNoRows) {
        return nil, ErrNotFound
    }
    if err != nil {
        return nil, fmt.Errorf("find user by id: %w", err)
    }
    return &u, nil
}
```

Perhatikan `ErrNotFound` — ini sentinel error yang kita definisikan sendiri, bukan expose pgx error ke layer atas. Ini penting: kalau suatu saat kita ganti database, layer atas tidak perlu tahu.

## Error Wrapping yang Baik

Setiap database error harus di-wrap dengan context yang meaningful:

```go
var (
    ErrNotFound   = errors.New("not found")
    ErrDuplicate  = errors.New("already exists")
)

func pgError(err error, op string) error {
    if errors.Is(err, pgx.ErrNoRows) {
        return fmt.Errorf("%s: %w", op, ErrNotFound)
    }
    var pgErr *pgconn.PgError
    if errors.As(err, &pgErr) && pgErr.Code == "23505" {
        return fmt.Errorf("%s: %w", op, ErrDuplicate)
    }
    return fmt.Errorf("%s: %w", op, err)
}
```

Dengan ini, service layer bisa cek `errors.Is(err, ErrNotFound)` tanpa tahu bahwa di bawahnya ada PostgreSQL.

## Testing Repository

Keuntungan terbesar dari interface adalah testability. Untuk unit test service, kita bisa pakai mock:

```go
type MockUserRepo struct {
    users map[uuid.UUID]*User
}

func (m *MockUserRepo) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
    u, ok := m.users[id]
    if !ok {
        return nil, ErrNotFound
    }
    return u, nil
}
```

Untuk integration test yang lebih reliable, pakai `testcontainers-go` untuk spin up PostgreSQL container sementara:

```go
func TestUserRepository(t *testing.T) {
    ctx := context.Background()
    
    pg, err := postgres.Run(ctx,
        "postgres:16-alpine",
        postgres.WithDatabase("testdb"),
        postgres.WithUsername("test"),
        postgres.WithPassword("test"),
    )
    require.NoError(t, err)
    defer pg.Terminate(ctx)

    pool, err := NewPool(ctx, pg.MustConnectionString(ctx))
    require.NoError(t, err)
    
    repo := NewPgUserRepository(pool)
    // ... run migrations, then test
}
```

## Ringkasan Hari Ini

- `pgx` adalah pilihan terbaik untuk PostgreSQL di Go — performa lebih baik dari `lib/pq`
- Connection pool harus dikonfigurasi eksplisit, bukan pakai default
- Repository pattern memisahkan storage concern dari business logic
- Interface di Go memungkinkan mock yang bersih untuk testing
- Error wrapping yang baik membuat debugging jauh lebih mudah

Besok kita mulai bahas service-to-service communication: kapan pakai REST, kapan pakai gRPC, dan bagaimana handle circuit breaking.
