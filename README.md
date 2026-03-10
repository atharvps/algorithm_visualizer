# 🚀 AlgoViz — Algorithm Visualizer Platform

A full-stack, production-ready algorithm and data structure visualization platform built for FAANG-level portfolio quality.

---

## 📸 Features

- **16 Algorithm Categories** — Sorting, Searching, Graph, Tree, Linked List, Stack/Queue, DP, Sliding Window, Recursion, String, Complexity, Race Mode
- **40+ Algorithms & Data Structures** — Fully animated, step-by-step
- **Code Sync** — Live C++ and Python code highlighting alongside animation
- **Race Mode** — Compare two sorting algorithms side-by-side
- **JWT Authentication** — Register, login, save favorites, custom inputs
- **Responsive Design** — Desktop and mobile optimized
- **Dark Mode** — Electric-cyan dark theme throughout

---

## 🗂️ Project Structure

```
algo-visualizer/
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Sidebar, Layout
│   │   │   ├── auth/           # ProtectedRoute
│   │   │   ├── common/         # CodePanel, StatsPanel, ComplexityBadges
│   │   │   └── visualizers/    # All visualizer components
│   │   │       ├── sorting/    # SortingVisualizer, RaceModeVisualizer
│   │   │       ├── searching/
│   │   │       ├── graph/
│   │   │       ├── tree/
│   │   │       ├── linkedlist/
│   │   │       ├── stackqueue/
│   │   │       ├── dp/
│   │   │       ├── sliding-window/
│   │   │       ├── recursion/
│   │   │       ├── string-algo/
│   │   │       └── complexity/
│   │   ├── pages/              # All route pages
│   │   ├── store/              # Zustand auth store
│   │   ├── utils/              # API client, array generator, sorting algos
│   │   ├── constants/          # Algorithm metadata, code snippets
│   │   └── styles/             # Global CSS + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                    # Node.js + Express API
    ├── src/
    │   ├── controllers/        # authController, algorithmController, dataController
    │   ├── models/             # User, SavedAlgorithm, SavedInput, Favorite
    │   ├── routes/             # All API routes
    │   ├── middleware/         # auth, errorHandler, validators
    │   ├── utils/              # jwt helpers, response helpers
    │   └── server.js
    └── config/
        └── database.js
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/algo-visualizer
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AlgoViz
```

---

## 🏃 Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)

### Backend
```bash
cd backend
cp .env.example .env    # Fill in your values
npm install
npm run dev             # Starts on port 5000
```

### Frontend
```bash
cd frontend
cp .env.example .env    # Fill in API URL
npm install
npm run dev             # Starts on port 5173
```

---

## 🗄️ MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user with password
4. Whitelist your IP (or `0.0.0.0/0` for development)
5. Copy the connection string into `MONGODB_URI`
6. Collections are auto-created: `users`, `savedalgorithms`, `savedinputs`, `favorites`

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build

# Or connect GitHub repo to Vercel:
# 1. Push to GitHub
# 2. Import project in vercel.com
# 3. Set build command: npm run build
# 4. Set output dir: dist
# 5. Add env vars: VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
```
1. Push backend to GitHub
2. Create new Web Service on render.com
3. Root directory: backend
4. Build command: npm install
5. Start command: node src/server.js
6. Add all environment variables from .env
7. Set NODE_ENV=production
```

### Post-Deployment
- Update `CLIENT_URL` in backend env to your Vercel URL
- Update `VITE_API_URL` in frontend env to your Render URL
- Redeploy both services

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |
| PUT  | `/api/auth/password` | Change password |

### Algorithms (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/algorithms` | Get saved algorithms |
| POST   | `/api/algorithms` | Save/update algorithm |
| GET    | `/api/algorithms/:id` | Get one |
| PUT    | `/api/algorithms/:id` | Update |
| DELETE | `/api/algorithms/:id` | Delete |

### Favorites (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/favorites` | Get all favorites |
| POST   | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove |
| PATCH  | `/api/favorites/:id/pin` | Toggle pin |
| GET    | `/api/favorites/check/:algorithmId` | Check if favorited |

### Inputs (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/inputs` | Get saved inputs |
| POST   | `/api/inputs` | Save input |
| DELETE | `/api/inputs/:id` | Delete |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Canvas | HTML5 Canvas API |
| Charts | Recharts |
| State | Zustand |
| HTTP | Axios |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Validation | express-validator |
| Security | Helmet, CORS, Rate Limiting |

---

## 📊 Database Schemas

### User
```
username, email, password (bcrypt), bio, role, preferences{theme,speed,arraySize}, stats{sessions,favorites,visualized}, refreshToken, lastLogin
```

### SavedAlgorithm
```
userId, algorithmId, name, category, description, notes, timeComplexity{best,avg,worst}, spaceComplexity, tags, lastViewed, viewCount
```

### SavedInput
```
userId, label, algorithmCategory, inputType, data{array,nodes,edges,text,matrix}, generatorType, metadata
```

### Favorite
```
userId, algorithmId, name, category, timeComplexity, spaceComplexity, notes, tags, isPinned, pinnedAt
```

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens (7 day expiry) + refresh tokens (30 day)
- Rate limiting: 100 req/15min globally, 20 auth attempts/15min
- Helmet security headers
- CORS whitelist
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

---

Built with ❤️.
