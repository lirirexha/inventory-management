# Product Inventory & Order Management


The app allows users to view products, create orders with one or more products, and safely update stock when an order is placed.

---

## Tech Stack

### Frontend
- React
- TypeScript

### Backend
- Node.js
- NestJS
- TypeScript
- Prisma ORM

### Database
- PostgreSQL

---

## Features

- Product CRUD API
- Create an order with one or more products
- Validate requested product quantities
- Basic input validation and error handling
- Seed data for demo products
- Backend tests for core order logic
- Simple CI for linting and tests

---

## Project Structure

```txt
.
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src
│       ├── products
│       ├── orders
│       └── prisma
│
├── frontend
│   └── src
│       ├── api
│       ├── components
│       └── types
│
├── docker-compose.yml
└── README.md

```
## Requirements

To run this project for the first time, you need:

- Node.js 22+
- npm
- Docker
- Docker Compose
- Git

If using Docker, you do not need to install PostgreSQL locally because the database runs inside a Docker container.

## running the project for the first time

### 1. clone the repository

### 2. create environment file

Create `backend/.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public"
```

### 3. run the app with Docker

```bash
docker compose up --build
```

The app will be available at:

    - Frontend: http://localhost:5173

    - Backend:  http://localhost:3000

*data is seeded during the build process*

## Database choice

I chose PostgreSQL because this project has naturally relational data: products, orders, and order items are connected. The data is structured and the schema is not expected to change often. We also need strict relationships and constraints

## Data Model

The main database models are:

    - Product: Represents an item in the shop

    - Order: Represents a placed order

    - OrderItem: connects Order and Product (bridge entity)

## Concurrency handling

When an order is placed, the backend updates stock using an atomic database operation inside a transaction.

Instead of checking stock first and updating later separately, the update only succeeds if enough stock is still available

## API Endpoints

```bash
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id

POST /orders
GET  /orders
```

## Tests

The backend includes a few tests for order logic

## CI

A simple GitHub Actions workflow is included to check linting and tests

## Trade-offs

Since this is a small project and was estimated to take around 4 hours, I prioritized getting the core business logic right, keeping the code easy to follow, and maintaining a clear structure rather than adding extra features.

Some trade-offs:

- The frontend is intentionally simple and focused on the required flow.
- Authentication is not included.
- Product management in the frontend is minimal (product CRUD exists in the backend API).
- Tests focus mainly on backend business logic rather than full end-to-end coverage.

## What I Would Improve With More Time
    - Add authentication
    - Add authorization for write endpoints
    - Add pagination and filtering for product and order lists
    - Add better frontend form validation
    - Add product create/edit/delete screens in the frontend
    - Add an end-to-end test for the full order flow
    - Improve UI styling and loading states
    - Add API documentation
    - Add better error response formatting