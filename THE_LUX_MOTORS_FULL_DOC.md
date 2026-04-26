# 📘 The Lux Motors — Full Project Documentation

> **Purpose of this doc:** A complete, plain-English walkthrough of everything the project does right now, how it does it, and what still needs to be built — so you can plan next features confidently.

---

## 1. What Is This Project?

**The Lux Motors** is a premium luxury car dealership website.

Think of it like a digital showroom — visitors can browse a curated collection of high-end cars, explore by category, and book a test drive. There is also an admin login portal (for the dealer/owner to manage the listing).

It is a **Full-Stack web application** with:
- A **React frontend** (what users see in the browser)
- An **Express.js backend** (the server that handles data)
- A **MongoDB database** (where car data is stored)

---

## 2. High-Level Architecture

```
┌──────────────────────────────┐
│     User's Browser           │
│  React + Vite (Port 5173)    │
│                              │
│  - Views pages               │
│  - Fetches car data via API  │
│  - Books test drive          │
└──────────────┬───────────────┘
               │  HTTP requests (fetch)
               ▼
┌──────────────────────────────┐
│   Express.js Server          │
│   (Port 5000)                │
│                              │
│  - /api/cars  → all cars     │
│  - /api/cars?featured=true   │
│  - /api/cars/:id             │
│  - /health (status check)    │
└──────────────┬───────────────┘
               │  Mongoose queries
               ▼
┌──────────────────────────────┐
│   MongoDB Database           │
│   (MongoDB Atlas / Local)    │
│                              │
│  Collection: cars            │
│  Fields: name, brand,        │
│  category, engine, images,   │
│  price, is_featured...       │
└──────────────────────────────┘
```

---

## 3. Folder Structure Explained

```
The Lux Motors/
│
├── src/                        ← All React frontend code
│   ├── pages/                  ← The 3 full pages of the site
│   │   ├── Homepage.jsx        ← Main landing page
│   │   ├── CategoryPage.jsx    ← Browse all cars by category
│   │   └── LoginPage.jsx       ← Admin login screen
│   │
│   ├── components/             ← Reusable UI pieces
│   │   ├── Header.jsx          ← Top navigation bar
│   │   ├── CarCard.jsx         ← Single car card (used in CategoryPage)
│   │   ├── Hero.jsx            ← (Legacy/unused — replaced by HeroSection)
│   │   └── home/               ← All homepage-specific sections
│   │       ├── HeroSection.jsx
│   │       ├── StatsSection.jsx
│   │       ├── MarqueeStrip.jsx
│   │       ├── CategoriesSection.jsx
│   │       ├── FeaturedSection.jsx
│   │       ├── ExperienceSection.jsx
│   │       ├── TestDriveCTA.jsx
│   │       ├── BookingModal.jsx
│   │       ├── Footer.jsx
│   │       └── constants.js    ← Category icons/metadata
│   │
│   ├── hooks/                  ← Custom React logic
│   │   ├── useCars.js          ← Fetches all + featured cars
│   │   └── useReveal.js        ← Scroll-based animation trigger
│   │
│   ├── api/                    ← All API call functions
│   │   └── cars.js             ← fetch wrappers + data normalizer
│   │
│   ├── App.jsx                 ← Route definitions
│   └── main.jsx                ← React entry point
│
├── server/                     ← Backend (Node.js / Express)
│   ├── index.js                ← Server entry, DB connect, middleware
│   ├── models/
│   │   └── Car.js              ← MongoDB Car schema
│   ├── routes/
│   │   └── cars.js             ← API route handlers
│   └── .env                    ← MONGO_URI, PORT (secret config)
│
├── index.html                  ← HTML shell
├── vite.config.js              ← Build config
└── package.json                ← Frontend dependencies
```

---

## 4. Pages — How Each One Works

### 4.1 🏠 Homepage (`/`)

**File:** `src/pages/Homepage.jsx`

This is the main page. When it loads, it does the following:

**Step 1 — Data Fetch**
```
Homepage mounts
    → calls useCars() hook
        → simultaneously fetches:
            ① GET /api/cars           → all cars
            ② GET /api/cars?featured=true  → featured cars only
        → if featured = empty, falls back to first 6 of all cars
    → sets loading = true while waiting
    → shows "LOADING COLLECTION..." screen
    → once done, renders all sections
```

**Step 2 — Sections rendered (top to bottom)**

| # | Section | What it shows |
|---|---|---|
| 1 | **Header** | Fixed nav bar — "THE LUX" logo + Models link + "Book a Test Drive" button |
| 2 | **HeroSection** | Full-screen auto-sliding car image gallery |
| 3 | **StatsSection** | 3–4 numbers (e.g. "150+ Cars", "12 Years", etc.) |
| 4 | **MarqueeStrip** | Scrolling text strip with brand names |
| 5 | **CategoriesSection** | Accordion-style category cards (hover to expand) |
| 6 | **FeaturedSection** | Grid of featured cars with filter tabs |
| 7 | **ExperienceSection** | Lifestyle/brand storytelling block |
| 8 | **TestDriveCTA** | Full-width call-to-action to schedule a test drive |
| 9 | **Footer** | Links, contact, branding |
| 10 | **BookingModal** | Pops up when user clicks "Book a Test Drive" |

**Step 3 — Test Drive Booking Flow**
```
User clicks "Book a Test Drive" (Header or CTA)
    → showModal state = true
    → BookingModal appears as overlay

User fills: Name, Phone, Preferred Vehicle
    → clicks "Submit Form"
        → currently: just shows alert("Form submitted!") ⚠️ NOT SAVED
    OR clicks "WhatsApp Us"
        → opens WhatsApp link (hardcoded number: 1234567890) ⚠️ WRONG NUMBER
```

**Step 4 — URL-based modal trigger**
```
If user visits /?bookTestDrive=1
    → URL param detected
    → modal auto-opens
    → param cleaned from URL
```

---

### 4.2 🚗 HeroSection — The Slider

**File:** `src/components/home/HeroSection.jsx`

```
On mount:
    If featuredCars (from DB) exist → use those (top 5)
    Else → use 5 static hardcoded slides (Porsche, BMW, Merc, Audi, Mustang)

Timer logic:
    Every 4 seconds → move to next slide (auto)
    If user manually clicks a dot → next auto-advance = 7 seconds

What's shown per slide:
    - Full-screen background image
    - Car name (e.g. "Porsche 911 Turbo S")
    - Engine spec (e.g. "3.8L Twin-Turbo Flat-6")
    - Slide counter top-right (01 / 05)
    - Dot pagination at bottom center
    - "Scroll" hint at bottom-left
```

---

### 4.3 🗂️ CategoriesSection — The Accordion

**File:** `src/components/home/CategoriesSection.jsx`

```
Shows 6 category cards side by side:
    Vintage | Sports | Sedan | Adventure | Ultra Luxury | (+ more)

Hover effect:
    Hovered card → expands width (flex-grow: 3)
    Others → shrink (flex-grow: 0.6)
    → Smooth CSS transition (0.55s cubic-bezier)

Image logic:
    For each category, finds the FIRST car from DB with that category
    and uses its first image as background → dynamic, not hardcoded

Click → navigates to /models?category=Sports
```

---

### 4.4 🏆 FeaturedSection — Car Grid

**File:** `src/components/home/FeaturedSection.jsx`

```
Receives featuredCars from DB

Filter tabs: All | Vintage | Sports | Sedan | Adventure | Ultra Luxury
    → Client-side filter (no new API call)

Each car card shows:
    - Car image (first from images[] array)
    - "Featured" badge (if is_featured = true)
    - Category · Year
    - Car name
    - Price (price_display string or ₹{price})
    - "Explore →" link → goes to /car/:id  ⚠️ PAGE DOESN'T EXIST YET
```

---

### 4.5 📋 Category Page (`/models`)

**File:** `src/pages/CategoryPage.jsx`

```
On mount:
    → fetchAllCars() → GET /api/cars
    → shows "LOADING COLLECTION..."
    → renders grid

Filter tabs: All | Vintage | Sports | Sedan | Adventure | Ultra Luxury
    → filter synced to URL ?category=Sports (shareable)
    → client-side filtering (no refetch)

Car grid: 1-2-3 column responsive
    → each car = <CarCard /> component
    → clicking a card → /car/:id  ⚠️ PAGE DOESN'T EXIST YET
```

---

### 4.6 🔐 Login Page (`/login`)

**File:** `src/pages/LoginPage.jsx`

```
Split screen layout:
    Left → Decorative car photo with floating animation + quote
    Right → Login form

Form fields: Email + Password
    
Validation (client-side only):
    - Email: required + format check
    - Password: required + min 6 chars
    - On error: red highlights + shake animation

Submit:
    → Fake 1.8s loading spinner
    → Navigates to /admin/dashboard  ⚠️ THAT ROUTE DOESN'T EXIST
    → NO real authentication, no token, no backend call
```

---

## 5. Backend — How the Server Works

**File:** `server/index.js`

```
Server starts:
    1. Reads MONGO_URI from .env
    2. Connects to MongoDB via Mongoose
    3. On success → starts listening on Port 5000
    4. On failure → logs error + exits process

Middleware:
    - CORS: allows requests from localhost:5173 and localhost:3000
    - express.json(): parses JSON request bodies
```

### API Endpoints

| Method | Endpoint | Query Params | What it returns |
|---|---|---|---|
| GET | `/api/cars` | — | All cars (with images) |
| GET | `/api/cars` | `?featured=true` | Only `is_featured: true` cars |
| GET | `/api/cars` | `?category=Sports` | Cars matching category (case-insensitive) |
| GET | `/api/cars` | `?limit=5` | Limited number of cars |
| GET | `/api/cars/:id` | — | Single car by MongoDB `_id` |
| GET | `/health` | — | `{ status: "ok" }` (health check) |

> **Note:** Only READ (GET) endpoints exist. There is no way to add, edit or delete cars via the API yet.

---

## 6. Database — Car Data Model

**File:** `server/models/Car.js`

Every car document in MongoDB has these fields:

| Field | Type | Description |
|---|---|---|
| `name` | String *(required)* | e.g. "Porsche 911 Turbo S" |
| `brand` | String | e.g. "Porsche" |
| `category` | String | "Sports", "Vintage", "Sedan", etc. |
| `year` | Number | e.g. 2023 |
| `description` | String | Long text description |
| `engine` | String | e.g. "3.8L Twin-Turbo Flat-6" |
| `top_speed` | String | e.g. "330 km/h" |
| `acceleration` | String | e.g. "0–100 in 2.7s" |
| `seats` | Number | e.g. 2 |
| `fuel_type` | String | "Petrol", "Electric", etc. |
| `price_display` | String | e.g. "₹2.5 Cr" |
| `price` | Number | Raw number for sorting |
| `images` | [String] | Array of image URLs |
| `is_featured` | Boolean | Whether to show in featured sections |
| `createdAt` / `updatedAt` | Date | Auto-managed by Mongoose |

---

## 7. Data Flow — End to End

Here is the complete journey from database to what the user sees:

```
MongoDB (Atlas)
    ↓  Car.find({ is_featured: true })
Express Route  /api/cars?featured=true
    ↓  res.json(cars)
Frontend  src/api/cars.js → fetchFeaturedCars()
    ↓  normalizeCar() maps DB fields → camelCase frontend shape
    ↓  top_speed → topSpeed, is_featured → isFeatured, etc.
Custom Hook  src/hooks/useCars.js
    ↓  { allCars, featuredCars, loading, error }
Homepage.jsx
    ↓  heroCars = featuredCars.slice(0, 5)
    ↓  passes cars as props to each section
HeroSection / FeaturedSection / CategoriesSection
    ↓  renders car images, names, prices, etc.
User's screen ✅
```

---

## 8. Design System

### Color Palette
| Name | Hex | Used For |
|---|---|---|
| Gold | `#bda588`, `#e9c176`, `#C9A84C` | Accents, buttons, borders, labels |
| Dark BG | `#080808`, `#0a0a0a`, `#111` | Page backgrounds |
| Off-white | `#f3f4f6`, `#e5e2e1`, `#F5F0E8` | Headings, text |
| Muted | `#888`, `#666`, `#a0a0a0` | Sub-labels, secondary text |
| Danger | `#e05555` | Validation errors |

### Typography
| Font | Style | Used For |
|---|---|---|
| Playfair Display | Serif | All headings (H1, H2, H3) |
| Montserrat | Sans-serif | Labels, buttons, body copy |
| Cormorant Garamond | Elegant Serif | Login page only |

### Animations & Effects
- **Film grain overlay** — CSS SVG noise texture on all pages
- **Scroll reveal** — Elements fade in as user scrolls (`useReveal` hook)
- **Hero slider** — Crossfade between images (opacity transition, 1s duration)
- **Category accordion** — Horizontal flex-grow expand on hover
- **Card hover** — Lift + shadow + gold border on car cards
- **Shimmer button** — Animated gradient on Login submit button
- **Shake animation** — Form shakes on validation error

---

## 9. Header Behavior

**File:** `src/components/Header.jsx`

```
Default state (Homepage, not scrolled):
    → Transparent background
    → Larger padding

After scroll (> 32px) or on other pages:
    → Frosted glass: dark bg + backdrop-blur
    → Compact padding

Nav links:
    → "Models" → /models (active)
    → "Lifestyle" → # (placeholder, no page)
    → "Heritage" → # (placeholder, no page)

"Book a Test Drive" button:
    → If on Homepage → opens BookingModal directly
    → If on another page → navigates to /?bookTestDrive=1
         → Homepage detects param → auto-opens modal
```

---

## 10. What Is Working ✅ vs What Is Not ❌

### ✅ Working & Complete
- Homepage loads and shows all 8 sections
- Hero slider auto-advances, manual dot control works
- Car data fetched live from MongoDB (all + featured)
- Category accordion expand/shrink animation on hover
- Featured section filter tabs (client-side)
- Category page (`/models`) with URL-synced filters
- Header scroll behavior (transparent → frosted glass)
- "Book a Test Drive" modal opens and shows form
- WhatsApp button opens WhatsApp (TestDriveCTA section)
- Loading and error states on data-heavy pages
- Scroll reveal animations (`useReveal`)
- Admin login page UI is fully designed

---

### ❌ Broken / Incomplete / Missing

| What | Current State | Impact |
|---|---|---|
| **Car Detail Page** `/car/:id` | Route doesn't exist | All car links → 404. Users can't see car details |
| **Admin Dashboard** `/admin/dashboard` | Route doesn't exist | Login redirect fails |
| **Real Authentication** | Login is 100% fake | Anyone can log in. No security |
| **Booking form submission** | Just shows `alert()` | Test drive requests are lost, never saved |
| **WhatsApp number in modal** | Hardcoded as `1234567890` | Goes to wrong number |
| **Admin Car Management** | No POST/PUT/DELETE API | Can't add/edit/delete cars without touching DB directly |
| **"Lifestyle" & "Heritage" nav links** | Point to `#` (empty) | Dead links in navigation |
| **Mobile/Responsive navigation** | No mobile menu (hamburger) | Nav hidden on small screens |
| **Car search** | Not implemented | No way to search by name/keyword |
| **Image gallery per car** | Cars have `images[]` array | Only first image ever shown — rest unused |
| **SEO / Meta tags** | Not implemented | Bad for search engine discoverability |

---

## 11. How to Run the Project

### Start Frontend
```bash
# In project root (The Lux Motors/)
npm run dev
# Opens at: http://localhost:5173
```

### Start Backend
```bash
# In server/ folder
node index.js
# or: npm run dev (if nodemon set up)
# Runs at: http://localhost:5000
```

> ⚠️ Make sure `server/.env` contains:
> ```
> MONGO_URI=mongodb+srv://...
> PORT=5000
> ```

---

## 12. Summary of All Files

| File | Purpose |
|---|---|
| `src/App.jsx` | Defines the 3 routes: `/`, `/models`, `/login` |
| `src/main.jsx` | React entry point, wraps app in `<BrowserRouter>` |
| `src/pages/Homepage.jsx` | Orchestrates the full homepage, manages modal state |
| `src/pages/CategoryPage.jsx` | Browse + filter full car collection |
| `src/pages/LoginPage.jsx` | Admin login UI (currently mocked) |
| `src/components/Header.jsx` | Fixed nav bar with scroll-aware styling |
| `src/components/CarCard.jsx` | Reusable car card for category page |
| `src/components/home/HeroSection.jsx` | Full-screen image slider |
| `src/components/home/StatsSection.jsx` | Static numbers/stats block |
| `src/components/home/MarqueeStrip.jsx` | Scrolling brand name ticker |
| `src/components/home/CategoriesSection.jsx` | Horizontal accordion category cards |
| `src/components/home/FeaturedSection.jsx` | Filterable featured car grid |
| `src/components/home/ExperienceSection.jsx` | Brand lifestyle section |
| `src/components/home/TestDriveCTA.jsx` | Test drive call-to-action banner |
| `src/components/home/BookingModal.jsx` | Test drive booking overlay form |
| `src/components/home/Footer.jsx` | Page footer |
| `src/components/home/constants.js` | Category icons + descriptions |
| `src/hooks/useCars.js` | Parallel fetch of all + featured cars |
| `src/hooks/useReveal.js` | Scroll-triggered reveal animation |
| `src/api/cars.js` | All API call functions + data normalizer |
| `server/index.js` | Express server + MongoDB connection |
| `server/models/Car.js` | Mongoose Car schema |
| `server/routes/cars.js` | GET /api/cars and GET /api/cars/:id |
| `server/.env` | Secret config (MONGO_URI, PORT) |

---

*This document reflects the project state as of April 2026. Use this as the base to plan new features and updates.*
