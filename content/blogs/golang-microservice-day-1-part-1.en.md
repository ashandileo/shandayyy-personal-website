---
title: "Day 1 Part 1 — Microservice Architecture & Message Broker"
date: "2026-06-06"
summary: "Theory first: understanding microservice architecture, how it compares to monoliths, and why message brokers like Apache Kafka exist."
tags: ["golang", "microservice", "kafka"]
series: "mastering-golang-microservice"
seriesDay: 1
seriesPart: 1
---

Alright, so today I kicked off my Golang microservice learning journey. This series documents what I learn day by day from the course **Mastering Microservice Golang: Online Soccer Field Booking** on [BuildWithAngga](https://buildwithangga.com), guided by **[Muhamad Faisal Ilhami Akbar](https://www.linkedin.com/in/faisalilhamiakbar/)**. Huge thanks to mas Faisal for the clear, structured, and practical material — genuinely one of the best learning experiences I've had.

Day one was split in two: theory first, then straight into hands-on environment setup. This part covers the theory — the foundation that needs to click before jumping into implementation.

Two big topics today: **Microservice Architecture** and **Message Broker**. Let's break it down.

---

## Microservice Architecture

Simply put, microservices is an approach to building applications where you split the app into small, independent services. Each service has one specific business function, can be developed independently, deployed independently, and scaled independently.

Concrete example:

- **Order Service** → handles everything order-related
- **User Service** → handles user data

They run independently. If Order Service is being updated, User Service keeps running normally.

![Microservice Architecture Diagram](/images/blogs/golang-day-1/microservice-diagram.png)

### Why Microservices?

A few things make microservices appealing:

1. **Development independence** — Teams can develop, test, and deploy their own services without blocking others.
2. **Scalability** — If Order Service is overloaded, just scale that one service, not the whole app.
3. **Technology freedom** — One service can use Go, another Python or Node.js. Pick what fits.
4. **Resilience** — If one service goes down, the others keep running. The whole app doesn't die.
5. **Faster development** — Small teams focused on one service move faster and stay organized.

---

## Microservice vs Monolith

Here's the comparison:

| Aspect | Microservice | Monolith |
|--------|-------------|---------|
| Structure | Many small independent services | All functions in one big codebase |
| Scalability | Scale per service | Must scale everything |
| Technology | Free to choose per service | Usually one stack |
| Resilience | One service down, others keep running | One failure can break the whole app |
| Deployment | Each service deploys independently | Small change = redeploy everything |

### When Should You Use Microservices?

Not every project is a good fit. Microservices make sense when:

- It's a large application with many features
- You have a large, distributed development team
- You need high scalability
- The organization wants to adopt DevOps

If you're a small startup or working on a personal project, start with a monolith — it's simpler and easier to manage.

---

## Message Broker — The Bridge Between Services

Once you have many independent services, how do they communicate? That's where the **Message Broker** comes in.

A Message Broker is software that facilitates communication between applications or services by sending and receiving messages. The key idea: services don't need to be directly connected to each other — they just send messages to the broker, and the broker handles delivery.

This is what makes the system more flexible and decentralized.

Popular Message Brokers:

- **Apache Kafka**
- **RabbitMQ**
- **Amazon SQS**
- **ActiveMQ**
- **Azure Service Bus**

---

## Apache Kafka

**Apache Kafka** is probably the most talked-about tool in microservices. It's a distributed stream-processing platform that primarily functions as a Message Broker.

Kafka is widely used for:

- Integration between microservice systems
- Real-time data processing

![Apache Kafka Architecture Diagram](/images/blogs/golang-day-1/kafka-diagram.png)

What makes Kafka different from a typical message broker is that it also stores message history — not just send-and-forget. This makes it powerful for streaming and event sourcing use cases.

---

## Key Takeaways

- Microservice = application split into small, independent services
- Each service has one specific business responsibility
- Main advantages: scale & deploy per service, flexible teams, one service down doesn't take everything with it
- Monolith is still valid — don't jump to microservices for small projects
- Message Broker = intermediary for service communication, so they don't need to connect directly
- Apache Kafka = most popular Message Broker, with bonus real-time data streaming capabilities
