# Skill Tournaments - Microservices System

A demonstration of microservices architecture using **Kafka** (CQRS pattern), **NATS** (service-to-service communication), **PostgreSQL** (data persistence), and **NestJS** (application framework).

### Services

| Service | Description | Communication | Port |
|---------|-------------|---------------|------|
| **Gateway** | HTTP API for clients | Kafka (to Tournament Svc) | 3000 |
| **Tournament Service** | Core business logic | Kafka (from Gateway) + NATS (to User Svc) + PostgreSQL | 3001 |
| **User Service** | User data provider | NATS only (no DB, hardcoded users) | - |

### Layered Architecture

Each service follows **Controller → Service → Repository → Models**:

- **Controller**: Handles external communication (HTTP / Kafka / NATS)
- **Service**: Contains business logic and orchestration
- **Repository**: Abstracts data access (database or in-memory)
- **Models**: Data structures and TypeORM entities

---


## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### Run the Full Stack

```bash
# Clone/navigate to the project directory
cd "Task - Wiener Games"

# Start everything with a single command
docker-compose up --build
```

This will start:
1. **Zookeeper** (Kafka dependency)
2. **Kafka** (CQRS message broker)
3. **NATS** (service-to-service messaging)
4. **PostgreSQL** (tournament data storage)
5. **Gateway** (HTTP API on port 3000)
6. **Tournament Service** (Kafka consumer, NATS client)
7. **User Service** (NATS responder)

> **Note**: Services will wait for their dependencies to be healthy before starting. Initial startup may take 30-60 seconds while Kafka and PostgreSQL initialize.

### Stop the Stack

```bash
docker-compose down

# To also remove volumes (database data):
docker-compose down -v
```


### Using JWT Authentication

Once you have a token, you can use it instead of passing `playerId` in the request:

```bash
# Join tournament with JWT
curl -X POST http://localhost:3000/tournaments/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "gameType": "poker",
    "tournamentType": "round-robin",
    "entryFee": 50
  }'

# Get my tournaments with JWT
curl http://localhost:3000/tournaments/my-tournaments \
  -H "Authorization: Bearer <your-token>"
```


## Testing Guide

### Available Test Users

| Player ID | Name | Balance |
|-----------|------|---------|
| `player-1` | Alice Johnson | $1,000 |
| `player-2` | Bob Smith | $500 |
| `player-3` | Charlie Brown | $250 |
| `player-4` | Diana Prince | $2,000 |
| `player-5` | Eve Martinez | $50 |

- each player has bcrypt password

## Design Decisions and Assumptions

### Design Decisions
1. **Layered Architecture** for separation of concerns and testability
2. **Request-Response via Kafka** using NestJS `ClientKafka.send()` with correlation IDs
3. **NATS Request-Reply** for synchronous-style user info lookups (5s timeout)
4. **TypeORM with `synchronize: true`** for automatic schema creation
5. **Optional JWT** - endpoints work both with and without authentication
6. **Hardcoded Users** in User Service repository (no database needed)


### Assumptions
1. `playerId` is provided in the request body/query params (or via JWT)
2. Entry fee validation checks the user's balance (via User Service over NATS)
3. A player can only join a tournament once (duplicate prevention)
4. Kafka topics are auto-created
5. UUIDs (v4) are used as correlation IDs for Kafka request-response

## Postman Collection

- The created postman collection could be used for testing the available endpoints 