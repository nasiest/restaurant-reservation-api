# Restaurant Reservation System API

## Overview
A production-ready REST API for managing restaurant table reservations, built with TypeScript, Node.js, and Express. The system models real-world constraints such as operating hours, table capacities, overlapping reservations, peak-hour rules, seating optimization, and waitlisting.

This project demonstrates backend engineering best practices including clean architecture, relational data modeling, correctness under edge cases, Redis-based performance optimization, automated testing, and Dockerized development.

---

## Features
- Restaurant and table management
- Reservation creation with double-booking prevention
- Operating-hour and capacity enforcement
- Best-fit seating optimization
- Reservation lifecycle management (confirmed, cancelled, completed)
- Waitlist when no tables are available
- Peak-hour reservation duration limits
- Redis caching for availability checks
- PostgreSQL persistence
- Dockerized environment
- Automated integration tests
- Postman collection included

---

## Tech Stack
- TypeScript, Node.js, Express  
- PostgreSQL  
- Redis  
- Docker & Docker Compose  
- Jest & Supertest  

---

## Setup

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Installation
```bash
git clone https://github.com/nasiest/restaurant-reservation.git
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

### Run the Application
```bash
docker-compose up
npm run seed
npm run dev
```

API available at `http://localhost:3000`

---

## Core Endpoints
- `POST /restaurants` – Create restaurant
- `GET /restaurants/:id` – Get restaurant details
- `POST /reservations` – Create reservation
- `PATCH /reservations/:id/cancel` – Cancel reservation
- `GET /restaurants/:id/waitlist` – View waitlist

---

## Business Rules
- Reservations must be within operating hours
- Tables cannot be double-booked for overlapping times
- Party size must not exceed table capacity
- Best-fit table selection minimizes unused seats
- Peak hours restrict long reservations
- Waitlist is FIFO

---

## Testing
```bash
npm test
```

---

## Notes
- Authentication not implemented (out of scope)
- Notifications are mocked (console logs)
- Designed to scale to multiple restaurants and clients

---

## Assessment Context
Built as part of a backend engineering assessment to demonstrate real-world system design, business logic correctness, and production readiness.
