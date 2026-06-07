---
title: "Day 1 Part 2 — Docker, GCP & User Service Setup"
date: "2026-06-06"
summary: "Hands-on Day 1: setting up Docker Compose for local dev, registering GCP for cloud deployment, and cloning the first user-service from go-skeleton."
tags: ["golang", "microservice", "docker", "gcp"]
series: "mastering-golang-microservice"
seriesDay: 1
seriesPart: 2
---

With the theory covered in Part 1, it was time to set up the actual environment and get the first service running locally.

---

## Setup Docker & Docker Compose

The course uses Docker for local development — way cleaner than installing everything directly on the system.

Docker lets you run applications in isolated containers. Docker Compose manages multiple containers at once through a single config file. So if I need PostgreSQL, Kafka, and Consul all running together, I just define them in one `docker-compose.yaml` and fire it up.

**Steps:**

1. Download Docker Desktop at [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Install and set it up like any other app
3. Create a `docker-compose.yaml` — this defines which services to run
4. Run the command:

```bash
docker compose up -d --build
```

![Docker Compose Up — containers being built](/images/blogs/golang-day-1/docker-compose-up.png)

Once the build succeeds, Docker Desktop shows all the running containers.

![Docker Desktop after all containers are up](/images/blogs/golang-day-1/docker-desktop.png)

---

## Register GCP

Alongside the local setup, I also registered for **Google Cloud Platform (GCP)** — for when I eventually want to try deploying to the cloud. GCP offers a free trial of **$300 for 3 months**, which is more than enough for learning.

**How to register:**

1. Go to [cloud.google.com](https://cloud.google.com), click **Start Free** in the top right corner

![Google Cloud homepage](/images/blogs/golang-day-1/gcp-homepage.png)

1. Click **Agree and Continue**, fill in your personal info and payment method

![GCP registration page](/images/blogs/golang-day-1/gcp-register.png)

1. Click **Start Trial**

![GCP start trial confirmation](/images/blogs/golang-day-1/gcp-start-trial.png)

1. Done! The GCP dashboard is now accessible

![Google Cloud dashboard after successful registration](/images/blogs/golang-day-1/gcp-dashboard.png)

A credit/debit card is required during registration, but **nothing gets charged** within the free trial. You'd only get billed once the $300 runs out or the 3 months are up — and even then, you'd need to manually upgrade first.

---

## User Service — Building the First Service

This was the most exciting part — actually writing (well, cloning) code. I used **go-skeleton** by mas Faisal as the base project for the user-service.

### Clone the Project

Since this is microservices, each service gets its own repo. To keep things tidy, I put all services under one parent folder: `go-projects`. Then I cloned the skeleton and named it `user-service`:

```bash
cd go-projects
git clone https://github.com/faisalilhami27/go-skeleton user-service
```

Here's the project structure after cloning:

![go-skeleton folder structure after clone](/images/blogs/golang-day-1/user-service-overview.png)

### Install Dependencies

Navigate into the `user-service` folder, then install all the required packages:

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

![Go dependencies installation in progress](/images/blogs/golang-day-1/user-service-install.png)

Package breakdown:

- **gorm** — ORM for database interaction
- **gin** — popular HTTP web framework for Go
- **jwt** — for authentication
- **consul** — for service discovery
- **viper + cobra** — configuration and CLI
- **logrus** — structured logging
- **tollbooth** — rate limiter

Once done, check `go.mod` and `go.sum` to verify everything installed correctly. These are Go's equivalent of `package.json` and `package-lock.json` — the key difference is Go doesn't create a `node_modules` folder. Packages are cached globally at `~/go/pkg/mod`.

![go.mod and go.sum after dependencies are installed](/images/blogs/golang-day-1/user-service-gomod.png)

### Configuration

Two files need to be set up before the service can run:

**`config.json`** — for service settings like service name, port, admin user, key, etc. Adjust the values to fit your project.

![config.json example for user-service](/images/blogs/golang-day-1/user-service-config.png)

**`.env`** — for environment variables, mostly the database connection string and secret keys.

![.env setup for user-service](/images/blogs/golang-day-1/user-service-env.png)

---

## Key Takeaways

- Docker + Docker Compose = clean, portable local environment setup
- GCP free trial $300/3 months — more than enough for learning, with no charges unless you manually upgrade
- Microservices = multiple separate repos, each service cloned into one parent folder
- `go.mod` and `go.sum` = Go's package management, similar to `package.json` but without `node_modules`
