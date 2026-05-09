<div align="center">

# ▲ HN Stories — MERN Full Stack App

A production-ready full-stack web application built with the **MERN stack** that scrapes and displays top stories from [Hacker News](https://news.ycombinator.com) with JWT authentication and bookmark functionality.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔍 **Web Scraper** | Scrapes top 10 stories from Hacker News (title, URL, points, author, time) using Axios + Cheerio |
| ⚡ **Auto Scrape** | Scraper runs automatically on every server start |
| 🔁 **Manual Trigger** | Re-scrape anytime via `POST /api/scrape` or the Refresh button |
| 🔐 **JWT Auth** | Register & Login with bcrypt-hashed passwords + JWT tokens |
| 🔖 **Bookmarks** | Toggle bookmarks per user, persisted in MongoDB, protected route |
| 📄 **Pagination** | Server-side pagination with `?page=1&limit=10` support |
| 📱 **Responsive UI** | Mobile-first dark theme, works on all screen sizes |
| 🌙 **Dark Theme** | Clean dark design with skeleton loading states |

---

## 🗂 Project Structure

```
hn-scraper/
├── backend/                       # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js      # Register & login logic
│   │   ├── storyController.js     # Stories, bookmarks CRUD
│   │   └── scrapeController.js    # Trigger scrape endpoint
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, bookmarks[])
│   │   └── Story.js               # Story schema (title, url, points, author, postedAt)
│   ├── routes/
│   │   ├── auth.js                # POST /api/auth/{register,login}
│   │   ├── stories.js             # GET/POST /api/stories/*
│   │   └── scrape.js              # POST /api/scrape
│   ├── scraper/
│   │   └── scraper.js             # Cheerio-based HN scraper
│   ├── .env.example               # Environment variable template
│   ├── server.js                  # App entry point, bootstrap
│   └── package.json
│
├── frontend/                      # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive nav with mobile hamburger
│   │   │   ├── StoryCard.jsx      # Story display + bookmark toggle
│   │   │   └── ProtectedRoute.jsx # Auth guard with redirect
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth & bookmark state (Context API)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Story list + pagination + scrape trigger
│   │   │   ├── Login.jsx          # Login form with redirect-back
│   │   │   ├── Register.jsx       # Register with inline validation
│   │   │   └── Bookmarks.jsx      # Protected bookmarks page
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with JWT interceptor
│   │   ├── App.jsx                # Router setup
│   │   ├── main.jsx
│   │   └── index.css              # Design tokens + responsive CSS
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json                   # Root dev scripts (concurrently)
├── QUICK_START.md                 # 5-minute setup guide
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | bundled with Node.js |
| MongoDB | Local or Atlas | https://mongodb.com |

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hn-scraper.git
cd hn-scraper
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hn-scraper
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
# Install both at once from root
npm run install:all

# OR manually:
cd backend  && npm install
cd ../frontend && npm install
```

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
🔄 Running initial scrape...
✅ Initial scrape complete
🚀 Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Register a new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login, returns JWT token |

### Stories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/stories` | ❌ | All stories sorted by points desc |
| `GET` | `/api/stories?page=1&limit=10` | ❌ | Paginated stories |
| `GET` | `/api/stories/:id` | ❌ | Single story by ID |
| `GET` | `/api/stories/bookmarks` | ✅ | Current user's bookmarked stories |
| `POST` | `/api/stories/:id/bookmark` | ✅ | Toggle bookmark on/off |

### Scraper

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scrape` | Manually trigger Hacker News scrape |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |

> **Auth Header:** `Authorization: Bearer <token>`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: `5000`) | No |
| `NODE_ENV` | `development` or `production` | No |
| `MONGO_URI` | MongoDB connection string | **Yes** |
| `JWT_SECRET` | Secret for signing JWT tokens | **Yes** |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d`, `24h` | No |
| `CLIENT_URL` | Frontend URL for CORS | No |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | **Yes** |

---

## 🌐 Deployment Guide

### Backend → Render

1. Push code to GitHub
2. New **Web Service** on [render.com](https://render.com)
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from `backend/.env` in Render dashboard

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. **Framework Preset:** Vite
3. **Root Directory:** `frontend`
4. **Environment Variable:** `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Security → Network Access:** Add `0.0.0.0/0` (allow all IPs for Render)
3. **Database → Connect:** Copy connection string
4. Set as `MONGO_URI` in Render dashboard

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite | UI framework + build tool |
| **Routing** | React Router v6 | Client-side routing |
| **State** | React Context API | Auth & bookmark state |
| **HTTP Client** | Axios | API calls + JWT interceptor |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Auth** | JWT + bcryptjs | Secure authentication |
| **Scraping** | Axios + Cheerio | HTML parsing of HN |
| **Styling** | Custom CSS | Responsive dark theme |

---

## 📋 Commit Convention

```
feat:     add bookmark toggle API
fix:      handle missing story URL gracefully
chore:    add .gitignore
docs:     update README setup steps
refactor: extract scraper into separate module
style:    improve mobile responsive layout
test:     add auth endpoint tests
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built as a MERN Full Stack Developer assignment — demonstrating scraping, REST API design, JWT authentication, and React state management.</sub>
</div>
