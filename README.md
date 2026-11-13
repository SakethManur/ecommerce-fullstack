# 🛍️ Full Stack E-Commerce Platform

> [**🔴 LIVE DEMO**](https://ecommerce-fullstack-95md.vercel.app/) | [**⚙️ BACKEND API**](https://my-shop-api-r0me.onrender.com)

A production-ready E-Commerce application architected with a **decoupled Client-Server model**. This project demonstrates a complete shopping lifecycle, complex relational database management, and role-based access control, fully deployed to a modern cloud environment.

---

## 🤖 AI-Accelerated Development

This project leverages **Generative AI as a Pair Programmer** to simulate real-world, high-velocity engineering workflows. AI was used for:

- **Rapid Prototyping:** React components & CSS modules.
- **Database Engineering:** Debugging SQL schemas and Foreign Key conflicts (TiDB).
- **DevOps & CI/CD:** Fixing deployment issues on Vercel + Render (SPA routing, env configs).
- **Code Refactoring:** Improving backend modularity, SSL handling & cloud compatibility.

---

## ✨ Key Features

### 🛒 Customer Experience
- **Dynamic Inventory:** Real-time product listings with category filtering & price sorting  
- **Smart Cart & Wishlist:** Persistent cart and Save-for-Later (SQL-backed)  
- **Checkout Logic:** Auto stock deduction post-purchase  
- **Order History:** Track order status (Pending → Shipped → Delivered)  
- **Responsive UI:** Mobile-first, skeleton loaders & custom CSS  

### 🔐 Admin Dashboard
- **RBAC Authentication:** User vs Admin permissions  
- **Order Command Center:** Global order management & shipping updates  
- **Inventory Control:** Live stock indicators and product insights  

---

## 🛠️ Architecture & Tech Stack

A **3-tier architecture** deployed across multiple cloud platforms:

| Layer      | Technology                      | Hosting Provider        |
|------------|----------------------------------|--------------------------|
| Frontend   | React.js, Vite, HashRouter, Axios | Vercel (Global CDN)     |
| Backend    | Node.js, Express.js (REST API)   | Render (Cloud Compute)  |
| Database   | MySQL / SQL                      | TiDB Cloud (Serverless) |

---

## 🗄️ Database Schema

Normalized relational database includes:

- **accounts** – User authentication & roles  
- **products** – Inventory with stock tracking  
- **cart** – Temporary user cart  
- **orders** – Immutable purchase records (JSON-based items)  
- **reviews** – User feedback  
- **wishlist** – Saved products  

---

## 🐳 Run with Docker (recommended)

One command brings up MySQL (schema + demo data loaded automatically), the
API and the client:

```sh
docker compose up --build
```

| Service | URL |
|---------|-----|
| Client  | http://localhost:8080 |
| API     | http://localhost:5001 (health check: `/health`) |
| MySQL   | localhost:3307 (user `ecommerce`, password `ecommerce_pass`) |

Demo logins seeded for local development only -- the API stores passwords in
plaintext, so treat these as throwaway:

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | `admin@example.com`    | `admin123`    |
| Customer | `customer@example.com` | `customer123` |

`docker compose down -v` removes the database volume, so the next `up`
re-runs `server/db/schema.sql` and `server/db/seed.sql` from scratch.

---

## 🚀 Local Installation

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/ecommerce-fullstack.git
cd ecommerce-fullstack

### Backend Setup
```sh
cd server
npm install

# Create the tables and (optionally) load demo data:
#   mysql -u root -p < db/schema.sql
#   mysql -u root -p < db/seed.sql

# Create a .env file (see server/.env.example for all keys):
# DB_HOST=your_host
# DB_USER=your_user
# DB_PASSWORD=your_password
# DB_NAME=your_database

npm start      # or: npm run dev  (nodemon)


### 3. Frontend Setup
```md
### Frontend Setup
```sh
cd ../client
npm install

# Create .env with (see client/.env.example):
# VITE_API_URL=http://localhost:5001

npm run dev


---

## 👤 Admin Access (Demo)

**Email:** `manursaketh@gmail.com`  
**Password:** *(Use the password created during signup)*  

---

## 👨‍💻 Developed By

**Saketh Manur**

---

