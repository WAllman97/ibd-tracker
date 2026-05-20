# IBD Tracker: Evolution from Static Site to Multi-User App

## Current State Review
✅ **Strengths:**
- Clean, semantic HTML structure
- Excellent responsive CSS with proper mobile support
- Well-organized form covering 12+ symptoms
- Professional design (teal color scheme)
- Easy to understand for learning

❌ **Gaps for Multi-User SaaS:**
- No user authentication
- No data persistence (form data lost on page refresh)
- No history or trend analysis
- No analytics or warning logic
- Static GitHub Pages deployment (can't support backends)

---

## Recommended Tech Stack

### **Phase 1-2: Backend & Database**
- **Backend Framework:** Node.js + Express.js (JavaScript full-stack = single language learning curve)
- **Database:** PostgreSQL (reliable, relational data = perfect for health tracking)
- **Authentication:** JWT (JSON Web Tokens) + bcrypt for passwords
- **Hosting:** Vercel, Railway, or Render (free tier, easy Node.js deployment)

### **Phase 3: Frontend Enhancement**
- **Library:** React.js (component reusability for charts, dashboards)
- **Charts:** Chart.js or Recharts (easy data visualization)
- **HTTP Client:** Axios (simplified API communication)

### **Phase 4: Advanced Features**
- **Data Export:** PDFKit (Node.js library for report generation)
- **Email Notifications:** SendGrid or Nodemailer
- **Advanced Analytics:** TensorFlow.js or simple Python backend service

---

## Phased Implementation Roadmap

### **PHASE 1: Foundation (Weeks 1-2)**
**Goal:** Deploy backend + basic user accounts

**Tasks:**
1. Set up Node.js project with Express
2. Set up PostgreSQL database locally
3. Create user table (id, email, password_hash, created_at)
4. Build auth endpoints:
   - POST /api/auth/register (create user)
   - POST /api/auth/login (issue JWT)
   - GET /api/auth/me (verify token)
5. Create symptom entries table (id, user_id, date, bloating, pain, stress, etc.)
6. Build entry endpoints:
   - POST /api/entries (save check-in)
   - GET /api/entries (list user's history)
7. Deploy to Render or Railway (free tier)

**Frontend Update:**
- Add login/signup forms
- Store JWT in localStorage
- Send JWT with API requests

---

### **PHASE 2: History & Persistence (Weeks 3-4)**
**Goal:** Users can see their past entries

**Tasks:**
1. Build entry list page (table with date, flare status, pain score)
2. Filter by date range
3. Delete/edit past entries
4. Local data backup option

---

### **PHASE 3: Dashboard & Insights (Weeks 5-7)**
**Goal:** Visualize trends + basic warnings

**Tasks:**
1. Install React (refactor static HTML → React components)
2. Add dashboard page with:
   - 7-day symptom trend chart (bloating, pain, fatigue)
   - Flare probability (% of past 30 days in flare)
   - Food frequency heatmap
3. Simple warning logic:
   - Alert if pain scores rising 3+ days in a row
   - Alert if flare detected + blood present
4. Calculate "Flare Risk Score" (0-100)

---

### **PHASE 4: Advanced Analytics (Weeks 8-10)**
**Goal:** Correlation analysis + actionable insights

**Tasks:**
1. Build food/trigger correlation:
   - Parse "Key Foods" entries
   - Calculate pain spike 24h after specific foods
2. Build reports:
   - Weekly summary PDF
   - Monthly trend report
3. Email option: Weekly summary to user email
4. User settings page (notification preferences, export data)

---

### **PHASE 5: Polish & Scale (Weeks 11+)**
**Goal:** Production-ready SaaS

**Tasks:**
1. Add HTTPS, security headers
2. Rate limiting on APIs
3. User data export (GDPR compliance)
4. Account deletion
5. Admin dashboard (optional: aggregate anonymized stats)
6. Mobile app (React Native or PWA)

---

## Learning Path for You

**If you're new to backend:**
1. Learn Node.js basics (callbacks, async/await)
2. Learn Express routing
3. Learn SQL basics + PostgreSQL
4. Learn authentication (JWT concepts)

**Estimated Timeline:** 8-12 weeks for full app (if learning in parallel)

---

## Database Schema (Phase 1 Start)

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptom entries
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  bloating INTEGER CHECK (bloating >= 0 AND bloating <= 10),
  pain INTEGER CHECK (pain >= 0 AND pain <= 10),
  stress INTEGER CHECK (stress >= 0 AND stress <= 10),
  fatigue INTEGER CHECK (fatigue >= 0 AND fatigue <= 10),
  stool_score INTEGER CHECK (stool_score >= 1 AND stool_score <= 7),
  day_type VARCHAR(50),
  flare_status VARCHAR(50),
  blood_mucus VARCHAR(50),
  key_foods TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, entry_date)
);

-- Index for faster queries
CREATE INDEX idx_entries_user_date ON entries(user_id, entry_date DESC);
```

---

## First Actionable Step

1. **Backup current HTML/CSS** (you have it working!)
2. **Create GitHub repo** for new app (separate from GitHub Pages)
3. **Set up Node.js locally:**
   ```bash
   mkdir ibd-tracker-app
   cd ibd-tracker-app
   npm init -y
   npm install express cors dotenv pg bcryptjs jsonwebtoken
   ```
4. **Create basic Express server** with `/api/health` endpoint
5. **Deploy to Render or Railway** (test it works)

Once this baseline is running, Phase 1 becomes straightforward!

---

## Resource Links (Recommended)
- Node.js + Express: [expressjs.com](https://expressjs.com)
- PostgreSQL: [postgresql.org/download](https://postgresql.org/download)
- JWT Auth Tutorial: [auth0.com/blog/nodejs-jwt-authentication](https://auth0.com/blog/nodejs-jwt-authentication)
- Render Deployment: [render.com](https://render.com)
- React Charts: [recharts.org](https://recharts.org)
