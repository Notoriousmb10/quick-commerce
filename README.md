# Quick-Commerce System

A comprehensive Real-Time Order & Delivery System built with React, Node.js, Express, MongoDB, and Socket.io. Features role-based access for Customers, Delivery Partners, and Admins with live order tracking and concurrency handling.

## 🚀 Architecture

![Architecture](https://via.placeholder.com/800x400?text=Client+(React)+->+Nginx+->+Backend+(Node/Express)+->+MongoDB)

- **Frontend**: React.js (Containerized with Nginx)
- **Backend**: Node.js + Express (Containerized)
- **Database**: MongoDB (Containerized)
- **Real-Time**: Socket.io for live status updates and order locking.
- **Reverse Proxy**: Nginx handling routing (`/` -> Frontend, `/api` -> Backend) and WebSocket upgrades.

## 🛠️ Stack

- **Frontend**: React, React Router, Context API, Axios, Socket.io Client
- **Backend**: Node.js, Express, Mongoose, JWT, Socket.io
- **DevOps**: Docker, Docker Compose, Nginx

## 📂 System Roles

1. **Customer**: View products (`/products`), Place Order, Track Live Status.
2. **Delivery Partner**: View Available Orders Pool, Accept Order (Locks it), Update Status (Picked Up -> Delivered).
3. **Admin**: Global dashboard, Order metrics, Revenue tracking.

## 📦 Project Structure

```bash
/
├── backend/            # Express API
│   ├── src/
│   │   ├── config/     # DB Connection
│   │   ├── controllers/# Business Logic
│   │   ├── models/     # Mongoose Schemas (User, Order, Product)
│   │   ├── routes/     # API Routes
│   │   └── middleware/ # Auth & RBAC
├── frontend/           # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/      # Dashboard Views
│   │   └── context/    # Auth & Socket Context
├── nginx/              # Reverse Proxy Config
└── docker-compose.yml  # Orchestration
```

## 🔧 Setup & Deployment

### Prerequisites
- Docker & Docker Compose installed
- Node.js (for local dev without Docker)

### 1. Clone & Configure
```bash
git clone <repo-url>
cd app
```

### 2. Run with Docker (Production Ready)
This command builds the images and starts all services (Frontend, Backend, Mongo, Nginx).
```bash
docker-compose up --build -d
```
- Access Frontend: `http://localhost` (or your VM IP)
- Backend API: `http://localhost/api`

### 3. Deployment on Cloud VM (AWS/GCP/DigitalOcean)
1. **Provision VM**: Ubuntu 20.04/22.04.
2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
3. **Copy Files**: Use `scp` or `git clone` to transfer project to VM.
4. **Environment Variables**:
   edit `docker-compose.yml` or use `.env` file for:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (Set to your VM IP/Domain)
5. **Start Services**:
   ```bash
   docker-compose up --build -d
   ```

## 🔌 API & Socket Flow

### REST API
- `POST /api/auth/register`: Create account
- `POST /api/orders`: Place order
- `GET /api/orders/available`: Get pool (Partner)
- `PUT /api/orders/:id/accept`: **Lock Order** (Partner)

### Socket Events
- `join_room`: Client joins `order_{id}`
- `order_update`: Server emits status change -> Client updates UI
- `new_order_available`: Emitted to partners when order placed
- `order_accepted_by_partner`: Emitted to remove order from pool

## 💹 Scaling Plan
- **Load Balancing**: Run multiple backend replicas behind Nginx (requires Redis Adapter for Socket.io).
- **Caching**: Implement Redis for Product catalog and User sessions.
- **Database**: Use MongoDB Atlas for managed scaling.

## 🧪 Testing
1. Register a **Customer**. Place an Order.
2. Register a **Partner** (in incognito window).
3. Value Available Orders -> Click "Accept".
4. See status update on Customer screen instantly.
