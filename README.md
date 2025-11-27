# 🛍️ Full Stack E-Commerce Platform

> [**🔴 LIVE DEMO**](https://ecommerce-fullstack-95md.vercel.app/) | [**⚙️ BACKEND API**](https://my-shop-api-r0me.onrender.com)

A production-ready E-Commerce application architected with a **decoupled Client-Server model**. This project demonstrates a complete shopping lifecycle, complex relational database management, and role-based access control, fully deployed to a cloud environment.

---

## 🤖 AI-Accelerated Development

This project leverages **Generative AI as a Pair Programmer** to simulate a real-world, high-velocity engineering environment. AI was utilized for:

- **Rapid Prototyping:** Accelerating the creation of React components and CSS modules.  
- **Database Engineering:** Debugging SQL schema conflicts and Foreign Key constraints for TiDB.  
- **DevOps & CI/CD:** Resolving deployment issues on Vercel and Render (SPA routing, env configuration).  
- **Code Refactoring:** Optimizing backend logic for cloud compatibility (SSL handling, modular routing).

---

## ✨ Key Features

### 🛒 Customer Experience
- **Dynamic Inventory:** Real-time product fetching with category filtering and price sorting.  
- **Smart Cart & Wishlist:** Persistent shopping bag and Save-for-Later system backed by SQL relations.  
- **Checkout Logic:** Automated stock deduction after order placement.  
- **Order History:** Track order status (Pending → Shipped → Delivered).  
- **Responsive UI:** Mobile + Desktop optimized with custom CSS and Skeleton loaders.

### 🔐 Admin Dashboard (Business Logic)
- **RBAC:** Secure login differentiating between User and Admin roles.  
- **Order Command Center:** View and update all global orders in real-time.  
- **Inventory Control:** Stock level indicators and detailed product management tools.

---

## 🛠️ Architecture & Tech Stack

This application uses a **3-Tier Architecture** deployed across three cloud providers for optimal scalability.

| Layer      | Technology                                | Hosting Provider      |
|------------|--------------------------------------------|------------------------|
| Frontend   | React.js, Vite, HashRouter, Axios          | Vercel (Global CDN)   |
| Backend    | Node.js, Express.js (REST API)             | Render (Cloud Compute) |
| Database   | MySQL / SQL                                | TiDB Cloud (Serverless) |

---

## 🗄️ Database Schema

Normalized relational database structure includes:

- **accounts:** User authentication + role management  
- **products:** Inventory with stock tracking  
- **cart:** Temporary cart linked to user  
- **orders:** Immutable transactions with JSON item storage  
- **reviews:** User feedback  
- **wishlist:** Saved products for future purchase  

---

## 🚀 Local Installation

If you prefer to run the app locally:

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/ecommerce-fullstack.git
cd ecommerce-fullstack
