# 🥗 NutriVue – AI-Powered Nutrition Tracker

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)]()
[![React](https://img.shields.io/badge/React-18%2B-61DAFB)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)]()

**NutriVue** is a smart nutrition tracking app that uses **AI (Gemini LLM)** to analyze food from images, log meals, track calories & macros, and help users reach their health goals — all with seamless Firebase authentication and a modern React + FastAPI stack.

---

## 🔗 Repositories

- **Frontend**: [https://github.com/mohdyaserkt/Nutrivue-Frontend](https://github.com/mohdyaserkt/Nutrivue-Frontend)  
- **Backend**: [https://github.com/mohdyaserkt/Nutrivue-Backend](https://github.com/mohdyaserkt/Nutrivue-Backend)

---

## 🚀 Features

- 🔐 **Firebase Auth**: Google OAuth + Email/Password + Email Verification  
- 📸 **AI Food Scanner**: Upload or capture food → Gemini LLM identifies items + nutrition  
- 🏠 **Dashboard**: Real-time calorie progress, macro breakdown (Protein/Carbs/Fats)  
- 📅 **Calendar View**: Daily logs with color-coded goal status  
- ✍️ **Manual Override**: Edit grams or add foods manually if AI misses something  
- 💾 **Persistent Logging**: PostgreSQL-backed food & user data  
- ⚡ **Fast & Cached**: Redis for session/cache management  

---

## 🛠️ Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React (Vite), Tailwind CSS, Firebase SDK, Chart.js, react-webcam, react-calendar |
| **Backend**  | FastAPI, Python 3.10+, SQLAlchemy ORM, Alembic |
| **Database** | PostgreSQL |
| **Cache**    | Redis |
| **AI**       | Google Gemini LLM API |
| **Auth**     | Firebase Authentication |
| **Dev Tools**| Poetry, Uvicorn, Vite, Prettier, ESLint |

---

## 📦 Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (running locally or Docker)
- Redis (running locally or Docker)
- Firebase Project + Service Account Key
- Google Cloud Project with **Gemini API enabled**

---

### 🔧 Backend Setup (`Nutrivue-Backend`)

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/mohdyaserkt/Nutrivue-Backend.git
   cd Nutrivue-Backend
   poetry install
   ```

2. **Set Up Environment Variables**  
   Create a `.env` file in the root:
   ```env
   ENV=dev

   # Firebase
   FIREBASE_CREDENTIALS_PATH=./serviceAccountKey.json

   # CORS
   BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173

   # PostgreSQL
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nutrivue
   DATABASE_URL_SYNC=postgresql+psycopg2://postgres:your_password@localhost:5432/nutrivue

   # Gemini
   GOOGLE_API_KEY="your_gemini_api_key"

   # Redis
   REDIS_URL=redis://localhost:6379
   CACHE_EXPIRE_HOURS=24
   ```

3. **Add Firebase Service Account**  
   Download your `serviceAccountKey.json` from Firebase Console → Project Settings → Service Accounts → **Generate new private key**  
   Place it in the project root as `serviceAccountKey.json`.

4. **Run Database Migrations**
   ```bash
   alembic revision --autogenerate -m "create_users_table"
   alembic upgrade head
   ```

5. **Start the Server**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```
   → API will be live at `http://localhost:8000/api/v1`

---

### 🎨 Frontend Setup (`Nutrivue-Frontend`)

1. **Clone & Install**
   ```bash
   git clone https://github.com/mohdyaserkt/Nutrivue-Frontend.git
   cd Nutrivue-Frontend
   npm install
   ```

2. **Environment Variables**  
   Create `.env.local` in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_FIREBASE_API_KEY=xxxxxxx-Kfo
   VITE_FIREBASE_AUTH_DOMAIN=nutrivue-xxxxxfirebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nutrivue-axxxx
   VITE_FIREBASE_APP_ID=1:xxxxxxx:web:2xxxxxxxx
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxx
   VITE_FIREBASE_STORAGE_BUCKET=nutrivue-xxxx.firebasestorage.app
   VITE_FIREBASE_MEASUREMENT_ID=G-xxxx
   VITE_FIREBASE_EMAIL_LINK_REDIRECT=http://localhost:5173/verify
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```
   → App runs at `http://localhost:5173`

---

## 📂 Project Structure (Backend Highlights)

```
src/
├── main.py                 # FastAPI app entry
├── api/
│   ├── v1/
│   │   ├── auth.py         # Firebase + JWT auth
│   │   ├── user.py         # Profile CRUD
│   │   ├── scan.py         # AI image analysis
│   │   ├── log.py          # Food logging
│   │   └── calendar.py     # Daily/monthly logs
├── core/
│   ├── config.py           # Settings + env loading
│   ├── security.py         # JWT utils
│   └── ai.py               # Gemini LLM integration
├── db/
│   ├── session.py          # DB session
│   └── models/             # SQLAlchemy models
└── utils/
    └── redis_cache.py      # Redis caching
```

---

## 🧪 Testing

- Backend: Use `pytest` (add tests in `tests/`)
- Frontend: Jest + React Testing Library (planned)

---

## 🚀 Deployment (Future)

- **Frontend**: Vercel / Netlify  
- **Backend**: AWS EC2 / GCP Compute + Docker  
- **DB**: Managed PostgreSQL (AWS RDS / Supabase)  
- **Redis**: Upstash or AWS ElastiCache

---

## 📅 Roadmap

✅ Auth + User Profile  
✅ AI Food Scanner (Gemini)  
✅ Daily Logging + Dashboard  
🔜 Barcode Scanner  
🔜 Meal Planning AI  
🔜 Water Tracking & Fitness Sync

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR with improvements.

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

> 💡 **Tip**: Always keep `.env` and `serviceAccountKey.json` out of version control! Add them to `.gitignore`.
