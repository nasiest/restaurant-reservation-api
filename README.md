# Restaurant Reservation API

## Overview

A production-oriented REST API for managing restaurant table reservations, built with **TypeScript**, **Node.js**, and **Express**.  
The system models real-world restaurant constraints such as operating hours, table capacity limits, overlapping reservations, peak-hour rules, seating optimization, and waitlisting.

The project demonstrates backend engineering best practices including clean architecture, relational data modeling, correctness under edge cases, performance optimization with caching, automated testing, and containerized development.

---

## About

This project is a production-oriented REST API for restaurant table reservations, implemented using TypeScript and Node.js. It is designed to model real operational constraints found in reservation-based systems, including restaurant operating hours, table capacity limits, overlapping reservations, peak-hour policies, and efficient seat allocation.

The system exposes a clean, RESTful API that supports restaurant and table management, reservation creation with strict double-booking prevention, intelligent seating optimization using a best-fit strategy, waitlisting when capacity is exceeded, and reservation lifecycle management (confirmed, cancelled, completed). Availability checks are optimized using Redis caching to reduce database load during high-traffic periods.

The application is structured around clear separation of concerns: controllers handle HTTP concerns, services encapsulate business logic, and data models enforce relational integrity using PostgreSQL. Time-based reservation conflicts are handled explicitly at the business logic layer to ensure correctness beyond simple database constraints.

The system is containerized using Docker for consistent local development and deployability. Automated integration tests validate critical workflows such as overlapping reservations, capacity enforcement, and cancellation behavior. While intentionally scoped as a backend-focused project, the architecture is designed to scale to multiple restaurants and integrate cleanly with web or mobile clients.

---

## Features

- Restaurant management (operating hours)
- Table management (capacity, numbering)
- Reservation creation with:
  - Operating-hour validation
  - Capacity enforcement
  - Overlapping reservation prevention
- Seating optimization (best-fit table selection)
- Reservation lifecycle management (pending, confirmed, cancelled, completed)
- Waitlist system when no tables are available
- Peak-hour reservation duration limits
- Reservation cancellation
- Redis caching for availability checks
- PostgreSQL relational data integrity
- Dockerized development environment
- Automated tests with Jest & Supertest
- Postman collection for API exploration

---

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Cache:** Redis
- **Testing:** Jest, Supertest
- **Containerization:** Docker, Docker Compose

---

## Project Structure

```
restaurant-reservation/
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ services/
│  ├─ models/
│  ├─ utils/
│  └─ index.ts
├─ tests/
├─ postman/
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### Installation

```bash
git clone https://github.com/nasiest/restaurant-reservation-api.git
cd restaurant-reservation
npm install
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgres://postgres:postgres@db:5432/restaurantdb
REDIS_URL=redis://redis:6379
PORT=3000
```

### Start Services

```bash
docker-compose up
npm run seed
npm run dev
```

---

## API Endpoints (Summary)

- `POST /restaurants`
- `GET /restaurants/:id`
- `POST /reservations`
- `PATCH /reservations/:id/cancel`
- `GET /restaurants/:id/waitlist`

---

## Business Rules

- Reservations must be within operating hours
- Tables cannot be double-booked
- Party size must not exceed table capacity
- Peak hours restrict long reservations
- Best-fit seating minimizes wasted capacity
- FIFO waitlist when no tables are available

---

## Testing

```bash
npm test
```

---

## Postman Collection

Import:

```
postman/TallieReservation.postman_collection.json
```

---

## Known Limitations

- No authentication
- Mocked notifications
- Single-region assumption
- Manual waitlist promotion

---

## Future Improvements

- Reservation modification
- Authentication & RBAC
- Real notifications
- Event-driven waitlist promotion
- Analytics & reporting
- Horizontal scaling

---

## Assessment Context

This project was built as part of a backend engineering assessment to demonstrate real-world problem solving, system design, and production readiness.
