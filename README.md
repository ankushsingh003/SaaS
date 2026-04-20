# 🚀 SaaSify: Multi-Tenant Analytics Dashboard

SaaSify is a production-grade, multi-tenant analytics platform built for scalability and real-time insights. It features a robust architecture including secure JWT-based authentication, workspace-oriented access control, real-time data streaming via Socket.io, and a premium subscription engine powered by Stripe.

---

## ✨ Features

### 👤 Advanced Authentication
- **Dual-Token System**: Secure JWT access tokens and HTTP-only refresh tokens.
- **Session Restoration**: Automatic session recovery and silent token rotation.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions (Owner, Admin, Member).

### 🏢 Multi-Tenancy Architecture
- **Workspace Isolation**: Users can create, manage, and switch between multiple organizations.
- **Secure Onboarding**: Automated workspace setup flow for new users.
- **Unique Slugs**: Human-readable workspace identifiers.

### 📊 Real-Time Analytics
- **Interactive Dashboards**: Data visualization using Recharts.
- **Socket.io Streaming**: Live activity notifications and instant metric updates.
- **Performance Optimized**: Built with Vite and Tailwind CSS v4 for ultra-fast UI response.

### 💳 Commerce & Billing
- **Stripe Checkout**: Seamless subscription flow for Pro and Enterprise plans.
- **Automatic Webhooks**: Real-time handling of payment successes, upgrades, and cancellations.
- **Pricing Management**: Tiered feature access control.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19** + **Vite**
- **Redux Toolkit** (State Management)
- **Tailwind CSS v4** (Modern Styling)
- **Recharts** (Data Viz)
- **Lucide React** (Icons)

**Backend:**
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.io** (Real-time)
- **Stripe SDK** (Payments)
- **Joi** (Validation)

**Infrastructure:**
- **Docker** & **Docker Compose**
- **Nginx** (Production Frontend Server)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas)
- Docker (Optional, for containerized setup)

### 2. Environment Setup
Create a `.env` file in the `server` directory with the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:5173
```

### 3. Installation & Local Development

**For the Backend:**
```bash
cd server
npm install
npm run dev
```

**For the Frontend:**
```bash
cd client
npm install
npm run dev
```

### 4. Running with Docker (Recommended)
Launch the entire stack (Client, Server, MongoDB) with one command:
```bash
docker-compose up --build
```
Access the app at: `http://localhost:5173`

---

## 🏗️ Folder Structure
```text
root/
├── client/          # React Frontend (Vite)
├── server/          # Node.js Backend (Express)
│   ├── config/      # Database & Socket setup
│   ├── controllers/ # Logic handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic layer
│   └── validations/ # Joi schemas
└── docker-compose.yml
```

---

## 🤝 Contribution
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License
MIT License. Created by [Your Name].
