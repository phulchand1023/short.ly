# Short.ly — Full-Stack URL Shortener

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack URL shortening service built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Users can shorten URLs anonymously or create an account to track all their links and click analytics from a personal dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [API Reference](#api-reference)
- [Data Flow](#data-flow)
- [Authentication Flow](#authentication-flow)
- [Database Models](#database-models)

---

## Features

- **Anonymous URL Shortening** — Shorten any URL without an account
- **User Registration & Login** — JWT-based authentication system
- **Password Hashing** — Passwords are hashed with `bcrypt` (salt rounds: 10) before storage
- **Protected Dashboard** — Authenticated users see all their created links with click counts
- **Click Tracking** — Every redirect increments the click counter in real-time
- **Automatic Redirection** — Short codes redirect to the original URL via HTTP 301
- **Client-side Validation** — URL format and form field validation before any API call is made
- **Responsive UI** — Built with Tailwind CSS v4

---

## Tech Stack

### Backend (`/server`)
| Package | Purpose |
|---|---|
| Node.js + Express.js v5 | HTTP server and routing |
| MongoDB + Mongoose | Database and ODM |
| `jsonwebtoken` | JWT generation and verification |
| `bcrypt` | Password hashing |
| `nanoid` v5 | Generating 7-character unique URL codes |
| `valid-url` | Server-side URL validation |
| `dotenv` | Environment variable management |
| `nodemon` | Dev server auto-restart |

### Frontend (`/client`)
| Package | Purpose |
|---|---|
| React 19 + Vite | UI library and build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP requests to the backend API |
| Tailwind CSS v4 | Utility-first styling |
| React Context API | Global authentication state |

---

## Project Structure

```
URLShortner/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Persistent nav, shows auth-aware links
│       │   ├── PrivateRoute.jsx   # Redirects unauthenticated users to /login
│       │   └── Spinner.jsx        # Loading indicator
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state (token, login, logout)
│       ├── pages/
│       │   ├── HomePage.jsx       # URL shortening form
│       │   ├── LoginPage.jsx      # Login form
│       │   ├── RegisterPage.jsx   # Registration form
│       │   └── DashboardPage.jsx  # User's link history table
│       └── services/
│           ├── apiService.js      # POST /api/shorten
│           ├── authService.js     # POST /api/auth/register & /login
│           └── linkService.js     # GET /api/my-links (with auth header)
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection via Mongoose
    ├── controllers/
    │   ├── authController.js      # Register and login logic
    │   ├── urlController.js       # Shorten URL and redirect logic
    │   └── linkController.js      # Fetch links for authenticated user
    ├── middleware/
    │   ├── auth.js                # JWT verification middleware (optional auth)
    │   └── errorMiddleware.js     # Centralized error handler
    ├── models/
    │   ├── User.js                # User schema
    │   └── Url.js                 # URL schema
    ├── routes/
    │   ├── auth.js                # /api/auth/*
    │   ├── url.js                 # /api/shorten
    │   ├── links.js               # /api/my-links
    │   └── index.js               # /:code (redirect)
    └── server.js                  # App entry point
```

---

## Environment Variables

Create a `.env` file inside the `/server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:5000
```

---

## Installation and Setup

### Prerequisites
- Node.js v14+
- npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/phulchand1023/short.ly.git
cd short.ly
```

### 2. Setup the backend
```bash
cd server
npm install
# create your .env file as described above
npm run dev
```
Server starts on `http://localhost:5000`

### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```
Client starts on `http://localhost:5173`

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues during development.

---

## API Reference

All request and response bodies use `Content-Type: application/json`.

---

### Auth Routes — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "<user_id>",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error responses:**
- `400` — Missing fields or email already registered
- `500` — Internal server error

---

#### `POST /api/auth/login`
Authenticate a user and receive a JWT.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response `200`:**
```json
{
  "success": true,
  "token": "<jwt_token>"
}
```

**Error responses:**
- `400` — Missing fields or invalid credentials
- `500` — Internal server error

---

### URL Routes

#### `POST /api/shorten`
Shorten a long URL. The `x-auth-token` header is optional — if provided and valid, the URL is linked to the user's account.

**Request header (optional):**
```
x-auth-token: <jwt_token>
```

**Request body:**
```json
{
  "longUrl": "https://www.example.com/some/very/long/path"
}
```

**Success response `201` (new) or `200` (already exists):**
```json
{
  "success": true,
  "data": {
    "_id": "<url_id>",
    "urlCode": "aB3xY7z",
    "longUrl": "https://www.example.com/some/very/long/path",
    "shortUrl": "http://localhost:5000/aB3xY7z",
    "clicks": 0,
    "date": "2025-01-01T00:00:00.000Z",
    "user": "<user_id_or_null>"
  }
}
```

**Error responses:**
- `400` — Missing or invalid URL
- `500` — Server error

---

#### `GET /:code`
Redirect to the original URL. Increments the click counter.

**Example:** `GET /aB3xY7z`

**Success:** HTTP `301` redirect to `longUrl`

**Error response `404`:**
```json
{
  "success": false,
  "error": "No URL found"
}
```

---

### Links Routes — `/api` (Protected)

#### `GET /api/my-links`
Fetch all URLs created by the authenticated user, sorted newest first.

**Request header (required):**
```
Authorization: Bearer <jwt_token>
```

**Success response `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "<url_id>",
      "urlCode": "aB3xY7z",
      "longUrl": "https://www.example.com/...",
      "shortUrl": "http://localhost:5000/aB3xY7z",
      "clicks": 14,
      "date": "2025-01-01T00:00:00.000Z",
      "user": "<user_id>"
    }
  ]
}
```

**Error responses:**
- `401` — No token or invalid token
- `500` — Internal server error

---

## Data Flow

### 1. Shortening a URL (Anonymous)

```
User types URL in HomePage
        │
        ▼
Client-side validation (regex check)
        │
        ▼
POST /api/shorten  { longUrl }
        │
        ▼
auth middleware  ──► no token found → req.user = undefined → next()
        │
        ▼
urlController.shortenUrl()
  ├── valid-url checks longUrl
  ├── Url.findOne({ longUrl }) → if exists, return existing doc
  ├── nanoid(7) generates urlCode (e.g. "aB3xY7z")
  ├── shortUrl = BASE_URL + "/" + urlCode
  ├── req.user is undefined → user field omitted from doc
  └── Url.create({ longUrl, shortUrl, urlCode })
        │
        ▼
Response: { success: true, data: { shortUrl, ... } }
        │
        ▼
HomePage displays shortUrl with Copy button
```

---

### 2. Shortening a URL (Authenticated User)

```
Same as above, but:
  ├── Request includes header: x-auth-token: <jwt>
  ├── auth middleware verifies JWT → sets req.user = { id: "<user_id>" }
  └── Url.create({ longUrl, shortUrl, urlCode, user: req.user.id })
```
The URL document is now associated with the user and will appear on their dashboard.

---

### 3. Redirect Flow

```
Browser visits http://localhost:5000/aB3xY7z
        │
        ▼
GET /:code  →  indexRoutes  →  urlController.redirectToUrl()
        │
        ▼
Url.findOne({ urlCode: "aB3xY7z" })
        │
        ▼
url.clicks++  →  url.save()
        │
        ▼
res.redirect(301, url.longUrl)
        │
        ▼
Browser navigates to original URL
```

---

### 4. Registration Flow

```
User fills RegisterPage form
        │
        ▼
Client-side validation (name, email regex, password min 6 chars)
        │
        ▼
POST /api/auth/register  { name, email, password }
        │
        ▼
authController.registerUser()
  ├── Check all fields present
  ├── User.findOne({ email }) → reject if already exists
  ├── bcrypt.genSalt(10) + bcrypt.hash(password, salt)
  └── User.create({ name, email, password: hashedPassword })
        │
        ▼
Response: { success: true, data: { _id, name, email } }
        │
        ▼
RegisterPage shows success message → user navigates to /login
```

---

### 5. Login & Token Storage Flow

```
User fills LoginPage form
        │
        ▼
POST /api/auth/login  { email, password }
        │
        ▼
authController.loginUser()
  ├── User.findOne({ email }).select("+password")
  ├── bcrypt.compare(password, user.password)
  └── jwt.sign({ user: { id } }, JWT_SECRET, { expiresIn: "120h" })
        │
        ▼
Response: { success: true, token: "<jwt>" }
        │
        ▼
LoginPage calls AuthContext.login(token)
  └── localStorage.setItem("token", token)
  └── isAuthenticated = true
        │
        ▼
React Router navigates to /dashboard
```

---

### 6. Dashboard Data Fetch Flow

```
User lands on /dashboard
        │
        ▼
PrivateRoute checks AuthContext.isAuthenticated
  └── false → redirect to /login
  └── true  → render DashboardPage
        │
        ▼
DashboardPage useEffect fires
        │
        ▼
GET /api/my-links
  Header: Authorization: Bearer <token>
        │
        ▼
auth middleware
  ├── Reads x-auth-token header  ← Note: linkService sends "Authorization: Bearer"
  └── Verifies JWT → sets req.user
        │
        ▼
linkController.getmyLinks()
  └── Url.find({ user: req.user.id }).sort({ date: -1 })
        │
        ▼
Response: { success: true, count: N, data: [...links] }
        │
        ▼
DashboardPage renders table with longUrl, shortUrl, clicks
```

---

## Database Models

### User
```
_id        ObjectId   (auto)
name       String     required
email      String     required, unique
password   String     required, minlength: 6, select: false (excluded from queries by default)
createdAt  Date       (auto, timestamps: true)
updatedAt  Date       (auto, timestamps: true)
```

### Url
```
_id        ObjectId   (auto)
urlCode    String     required  — 7-char nanoid (e.g. "aB3xY7z")
longUrl    String     required  — original URL
shortUrl   String     required  — full short URL (BASE_URL + "/" + urlCode)
clicks     Number     default: 0
date       Date       default: Date.now
user       ObjectId   ref: User, optional — null for anonymous links
```

---

## License

[MIT](https://opensource.org/licenses/MIT)
