# ⚡ Quick Start — HN Scraper

Get up and running in **under 5 minutes**.

---

## ✅ Prerequisites

Before you start, make sure these are installed:

- **Node.js v18+** → https://nodejs.org  
- **MongoDB** (choose one):
  - 🖥 **Local:** https://www.mongodb.com/try/download/community  
  - ☁️ **Atlas (free cloud):** https://www.mongodb.com/atlas  

---

## Step 1 — Clone the Project

```bash
git clone https://github.com/YOUR_USERNAME/hn-scraper.git
cd hn-scraper
```

---

## Step 2 — Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` in your editor and set:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hn-scraper
JWT_SECRET=replace_this_with_a_long_random_string_32chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

> **Using MongoDB Atlas?**  
> Replace `MONGO_URI` with your Atlas connection string, e.g.:  
> `MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hn-scraper`

**Start the backend:**

```bash
npm run dev
```

✅ You should see:
```
✅ MongoDB connected
🔄 Running initial scrape...
✅ Initial scrape complete
🚀 Server running on http://localhost:5000
```

---

## Step 3 — Frontend Setup (1 minute)

Open a **new terminal**, then:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should have:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

✅ Open **http://localhost:3000** in your browser.

---

## Step 4 — Try It Out

| Action | How |
|--------|-----|
| View stories | Open http://localhost:3000 |
| Register | Click **Register** in the navbar |
| Login | Click **Login** in the navbar |
| Bookmark a story | Click 📌 on any story card |
| View bookmarks | Click **Bookmarks** (login required) |
| Re-scrape HN | Click **🔄 Refresh** button on Home page |

---

## 🔧 API Quick Test (curl)

```bash
# Trigger scrape
curl -X POST http://localhost:5000/api/scrape

# Get stories (paginated)
curl "http://localhost:5000/api/stories?page=1&limit=5"

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'

# Login (copy the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Bookmark a story (replace TOKEN and STORY_ID)
curl -X POST http://localhost:5000/api/stories/STORY_ID/bookmark \
  -H "Authorization: Bearer TOKEN"

# Get my bookmarks
curl http://localhost:5000/api/stories/bookmarks \
  -H "Authorization: Bearer TOKEN"

# Health check
curl http://localhost:5000/api/health
```

---

## 🚨 Troubleshooting

| Problem | Fix |
|---------|-----|
| **MongoDB not connecting** | Run `mongod` in terminal, or check Atlas connection string |
| **Port 5000 in use** | Change `PORT=5001` in `backend/.env` and update `VITE_API_URL` accordingly |
| **CORS error in browser** | Make sure backend is running and `VITE_API_URL` is correct |
| **No stories showing** | Click 🔄 Refresh — backend auto-scrapes on start |
| **`npm install` fails** | Make sure you're in the right folder (`backend/` or `frontend/`) |
| **Login not working** | Check that `JWT_SECRET` is set in `backend/.env` |

---

## 📁 Useful Commands

```bash
# From root — start both servers at once (requires concurrently)
npm run dev

# From root — install all dependencies
npm run install:all

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

---

That's it! Happy coding 🚀
