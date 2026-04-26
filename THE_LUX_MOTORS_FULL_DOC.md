# The Lux Motors - Full Project Documentation

> This document reflects the current state of the project as of April 2026. It explains what is built, how the frontend and backend connect, what is working, and what still needs attention.

---

## 1. Project Overview

**The Lux Motors** is a full-stack luxury car showroom web application.

Visitors can:
- View the premium homepage.
- Browse cars by category.
- Open a detailed page for each car.
- View a car image gallery, specifications, price, and description.
- Submit a test drive booking request.
- Open WhatsApp contact from key CTA areas.

Admins can:
- Log in using the admin login page.
- Access a protected dashboard.
- View submitted test drive bookings.
- Update booking status as `pending`, `confirmed`, or `cancelled`.

The app uses:
- **React + Vite** for the frontend.
- **Express.js** for the backend API.
- **MongoDB + Mongoose** for database storage.
- **JWT authentication** for the admin dashboard.
- **Tailwind CSS utility classes** for most UI styling.
- **Lucide React** for icons.

---

## 2. Current Architecture

```text
User Browser
  |
  | React + Vite frontend
  | http://localhost:5173
  |
  | fetch()
  v
Express API server
  |
  | http://localhost:5000
  |
  | Mongoose
  v
MongoDB
```

Main API areas:
- `/api/cars` for car inventory.
- `/api/auth` for admin login.
- `/api/bookings` for test drive requests.
- `/health` for server health checks.

---

## 3. Important Commands

### Frontend

Run from the project root:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Frontend default URL:

```text
http://localhost:5173
```

### Backend

Run from the `server/` folder:

```bash
npm run dev
npm start
```

Backend default URL:

```text
http://localhost:5000
```

Required backend environment variables in `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Optional frontend environment variable:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not set, the frontend falls back to `http://localhost:5000`.

---

## 4. Frontend Folder Structure

```text
src/
  api/
    auth.js              Admin login API call
    bookings.js          Booking submit/fetch/update API calls
    cars.js              Car fetch helpers and normalizer

  components/
    CarCard.jsx          Reusable vehicle card
    Header.jsx           Fixed navigation/header
    Hero.jsx             Legacy/unused hero component
    ProtectedRoute.jsx   Guards admin routes

    home/
      BookingModal.jsx
      CategoriesSection.jsx
      constants.js
      ExperienceSection.jsx
      FeaturedSection.jsx
      Footer.jsx
      HeroSection.jsx
      MarqueeStrip.jsx
      StatsSection.jsx
      TestDriveCTA.jsx
      index.js

  context/
    AuthContext.jsx      Stores admin user/token and exposes login/logout

  hooks/
    useCars.js           Loads all cars and featured cars
    useReveal.js         Scroll reveal helper for elements with .reveal

  pages/
    AdminDashboard.jsx
    CarDetailPage.jsx
    CategoryPage.jsx
    Homepage.jsx
    LoginPage.jsx

  utils/
    formatters.js        Price formatting helper

  App.jsx                Route definitions
  main.jsx               React entry point
  index.css              Global CSS, fonts, animations, scrollbars
```

---

## 5. Backend Folder Structure

```text
server/
  index.js               Express setup, MongoDB connection, routes
  package.json
  .env                   Local secrets/config

  middleware/
    auth.js              JWT auth middleware for protected admin routes

  models/
    Booking.js           Test drive booking schema
    Car.js               Car inventory schema
    User.js              Admin user schema with password hashing

  routes/
    auth.js              Login and seed-admin route
    bookings.js          Booking create/list/status routes
    cars.js              Car list/detail routes
```

---

## 6. Frontend Routes

Routes are defined in `src/App.jsx`.

| Route | Page | Status |
|---|---|---|
| `/` | `Homepage.jsx` | Working |
| `/models` | `CategoryPage.jsx` | Working |
| `/car/:id` | `CarDetailPage.jsx` | Working |
| `/login` | `LoginPage.jsx` | Working |
| `/admin/dashboard` | `AdminDashboard.jsx` inside `ProtectedRoute` | Working after login |

---

## 7. Homepage Current Behavior

File: `src/pages/Homepage.jsx`

The homepage loads car data through `useCars()`, then renders the main showroom sections.

Section order:

1. `Header`
2. `HeroSection`
3. `StatsSection`
4. `MarqueeStrip`
5. `CategoriesSection`
6. `FeaturedSection`
7. `ExperienceSection`
8. `TestDriveCTA`
9. `Footer`
10. `BookingModal` when opened

Current notes:
- The category section is now static. The previous accordion grow/shrink animation was removed.
- Category cards use real Lucide icons.
- The Sedan category uses a safer fallback image to avoid the broken image issue.
- The homepage booking modal posts real booking data to the backend.

---

## 8. Category Section

File: `src/components/home/CategoriesSection.jsx`

Current behavior:
- Shows category cards for:
  - Vintage
  - Sports
  - Sedan
  - Adventure
  - Ultra Luxury
- Cards are static equal-width grid cards on desktop.
- No accordion animation.
- No hover image zoom.
- Category descriptions are always visible.
- Icons come from `lucide-react`.
- Images are selected from car data when available, with category fallbacks.
- Sedan has a dedicated fallback image because the first database image was breaking visually.

Clicking a card navigates to:

```text
/models?category=Sedan
```

---

## 9. Featured Cars

File: `src/components/home/FeaturedSection.jsx`

Current behavior:
- Receives featured cars from the homepage.
- Shows filter tabs.
- Filters client-side by category.
- Uses `CarCard.jsx` for each car.
- Clicking a car navigates to `/car/:id`.

`CarCard.jsx` currently shows:
- First image.
- Category/year.
- Car name.
- Price display or formatted numeric price.
- Explore text.

---

## 10. Category/Browse Page

File: `src/pages/CategoryPage.jsx`

Route:

```text
/models
```

Current behavior:
- Fetches all cars from `GET /api/cars`.
- Supports URL query category filtering:

```text
/models?category=Sports
```

- Category filter is client-side after the initial fetch.
- Uses `CarCard.jsx`.
- Empty category states are handled.
- Loading state is shown while data is being fetched.

---

## 11. Car Detail Page

File: `src/pages/CarDetailPage.jsx`

Route:

```text
/car/:id
```

Current behavior:
- Fetches one car from `GET /api/cars/:id`.
- Shows a premium detail layout.
- Shows brand, category, year, price, overview, specs, and CTAs.
- Includes a framed car gallery using `object-contain`, so car images are not aggressively cropped.
- Gallery includes:
  - Main contained image.
  - Previous/next arrow buttons.
  - Thumbnail buttons.
- Includes a sticky concierge/action panel.
- User can:
  - Book a test drive.
  - Open WhatsApp.

Car detail booking modal:
- Asks for name, phone, and optional message.
- Sends data to `POST /api/bookings`.
- Uses the car name as `preferredVehicle`.
- Shows success state after submission.

---

## 12. Login and Authentication

### Login Page

File:

```text
src/pages/LoginPage.jsx
```

Route:

```text
/login
```

Current behavior:
- Login is connected to the backend.
- Submits email/password to `POST /api/auth/login`.
- On success, stores:
  - JWT token
  - user object
- Redirects to `/admin/dashboard`.
- Shows API error messages for invalid login.

### Auth Context

File:

```text
src/context/AuthContext.jsx
```

Current behavior:
- Stores `user` and `token`.
- Persists them in `localStorage` as:
  - `lux_token`
  - `lux_user`
- Exposes:
  - `login(userData, jwtToken)`
  - `logout()`
  - `isAdmin`

### Protected Route

File:

```text
src/components/ProtectedRoute.jsx
```

Current behavior:
- Allows access when `isAdmin` is true.
- Redirects unauthenticated users to `/login`.

Important limitation:
- `isAdmin` currently means a user exists in auth context. It does not check role deeply on the frontend.
- Backend-protected routes still require a valid JWT.

---

## 13. Admin Dashboard

File:

```text
src/pages/AdminDashboard.jsx
```

Route:

```text
/admin/dashboard
```

Current behavior:
- Protected by `ProtectedRoute`.
- Fetches bookings using the JWT token.
- Shows booking stats:
  - total
  - pending
  - confirmed
  - cancelled
- Lists booking records in a table.
- Lets admin update booking status.
- Has logout behavior.

Current limitation:
- Admin can manage bookings only.
- There is no UI yet for adding, editing, or deleting cars.

---

## 14. Backend API

Base URL:

```text
http://localhost:5000
```

### Health

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Returns `{ status: "ok" }` |

### Cars

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cars` | No | Get all cars with images |
| GET | `/api/cars?featured=true` | No | Get featured cars |
| GET | `/api/cars?category=Sedan` | No | Get cars by category |
| GET | `/api/cars?limit=5` | No | Limit result count |
| GET | `/api/cars/:id` | No | Get one car by MongoDB ID |

Important implementation detail:
- `GET /api/cars` filters out cars with empty images:

```js
filter.images = { $exists: true, $ne: [] };
```

Current limitation:
- There are no car create/update/delete API routes yet.

### Authentication

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login admin and return JWT |
| POST | `/api/auth/seed-admin` | No | Create default admin user if missing |

Default seed-admin user:

```text
email: admin@thelux.com
password: thelux2024
```

Security note:
- `/api/auth/seed-admin` should be disabled or protected before production deployment.

### Bookings

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/bookings` | No | Create a test drive booking |
| GET | `/api/bookings` | Bearer token | List all bookings newest first |
| PATCH | `/api/bookings/:id/status` | Bearer token | Update status |

Allowed booking statuses:

```text
pending
confirmed
cancelled
```

---

## 15. Database Models

### Car

File:

```text
server/models/Car.js
```

Fields:

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `brand` | String | Optional |
| `category` | String | Optional |
| `year` | Number | Optional |
| `description` | String | Optional |
| `engine` | String | Optional |
| `top_speed` | String | Optional |
| `acceleration` | String | Optional |
| `seats` | Number | Optional |
| `fuel_type` | String | Optional |
| `price_display` | String | Optional |
| `price` | Number | Optional raw numeric price |
| `images` | Array of strings | Image URLs |
| `is_featured` | Boolean | Defaults to false |
| `createdAt` / `updatedAt` | Date | Added by timestamps |

Frontend normalized shape from `src/api/cars.js`:

```js
{
  id,
  name,
  brand,
  category,
  year,
  description,
  engine,
  topSpeed,
  acceleration,
  seats,
  fuelType,
  priceDisplay,
  price,
  images,
  isFeatured
}
```

### Booking

File:

```text
server/models/Booking.js
```

Fields:

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `phone` | String | Required |
| `preferredVehicle` | String | Defaults to empty string |
| `message` | String | Defaults to empty string |
| `status` | String | `pending`, `confirmed`, or `cancelled` |
| `createdAt` / `updatedAt` | Date | Added by timestamps |

### User

File:

```text
server/models/User.js
```

Fields:

| Field | Type | Notes |
|---|---|---|
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, hashed with bcrypt before save |
| `role` | String | Only `admin` currently |
| `name` | String | Defaults to `Admin` |
| `createdAt` / `updatedAt` | Date | Added by timestamps |

---

## 16. Data Flow

### Homepage data

```text
Homepage
  -> useCars()
  -> fetchAllCars() and fetchFeaturedCars()
  -> GET /api/cars
  -> GET /api/cars?featured=true
  -> normalizeCar()
  -> render HeroSection, CategoriesSection, FeaturedSection
```

### Car detail data

```text
CarCard click
  -> /car/:id
  -> CarDetailPage
  -> fetchCarById(id)
  -> GET /api/cars/:id
  -> normalizeCar()
  -> render gallery, specs, price, booking CTA
```

### Booking data

```text
User submits booking
  -> submitBooking()
  -> POST /api/bookings
  -> Booking.create()
  -> AdminDashboard can fetch it later
```

### Admin data

```text
Admin logs in
  -> POST /api/auth/login
  -> receives JWT
  -> token saved in localStorage
  -> AdminDashboard
  -> GET /api/bookings with Authorization header
```

---

## 17. Design System Notes

### Main colors

| Usage | Colors |
|---|---|
| Backgrounds | `#050505`, `#080808`, `#0a0a0a`, `#111` |
| Gold accents | `#bda588`, `#d8bf97`, `#e9c176`, `#9f7e3a` |
| Text | `#f3f4f6`, `#e5e2e1`, `#a0a0a0`, `#888`, `#666` |
| Error | red tones such as `text-red-400` |

### Typography

Global font import is in `src/index.css`.

| Font | Usage |
|---|---|
| Playfair Display | Main headings, car names, luxury-style display text |
| Montserrat | Body text, labels, nav, buttons |
| Cormorant Garamond | Login page decorative typography |

### Animations currently used

- Homepage hero slider transitions.
- Scroll reveal for selected `.reveal` elements.
- Car card fade-up via `.card-pop`.
- Header scroll transition.
- Login page shimmer/spinner/shake effects.
- Category section accordion animation has been removed.

---

## 18. Current Working Status

### Working

- Frontend builds successfully.
- ESLint passes.
- Backend health endpoint works when server is running.
- Homepage loads live cars.
- Featured cars render.
- Category browse page works.
- Car detail page exists and fetches individual car data.
- Car detail gallery shows images in a contained frame to avoid bad cropping.
- Test drive bookings are saved to MongoDB.
- Admin login is connected to backend authentication.
- Admin dashboard is protected.
- Admin dashboard can list bookings and update their status.

### Still incomplete or needs improvement

| Area | Current state |
|---|---|
| Car management | No admin UI/API for adding, editing, or deleting cars |
| Seed admin route | `/api/auth/seed-admin` exists and should be disabled/protected before production |
| Navigation | `Lifestyle` and `Heritage` still point to `#` placeholders |
| Mobile navigation | No hamburger/mobile menu yet |
| Search | No search by car name/brand/keyword |
| SEO | No real meta/SEO setup yet |
| Image reliability | Many images are external URLs, so some can break if the source blocks or removes them |
| Deployment | No production deployment configuration documented yet |

---

## 19. Recent Project Updates

Recent improvements made in this project:

- Added/confirmed `CarDetailPage.jsx` route at `/car/:id`.
- Improved car detail page UI with a contained image gallery.
- Added real booking submission from car detail page.
- Connected login page to backend auth.
- Added protected admin dashboard route.
- Added admin booking management.
- Fixed ESLint configuration for frontend React files and backend CommonJS files.
- Removed category section accordion animation per preference.
- Fixed Sedan category image fallback.
- Replaced category text-symbol icons with Lucide icons.
- Cleaned some broken display characters in frontend UI files.

---

## 20. Quality Checks

Use these before considering the project healthy:

```bash
npm run lint
npm run build
```

Both commands were passing after the latest code updates.

For backend health:

```bash
curl http://localhost:5000/health
```

Expected:

```json
{ "status": "ok" }
```

---

## 21. Recommended Next Steps

1. Build admin car management:
   - Add car
   - Edit car
   - Delete car
   - Upload or manage image URLs

2. Secure production auth:
   - Remove or protect `/api/auth/seed-admin`.
   - Add stronger role checks.
   - Consider token expiry handling on frontend.

3. Improve image handling:
   - Store images in a controlled source instead of relying on random third-party URLs.
   - Add image validation/fallbacks on all image-heavy components.

4. Add mobile nav:
   - Hamburger menu.
   - Mobile-friendly nav links.
   - Better header spacing on small screens.

5. Add search/filter improvements:
   - Search by name/brand.
   - Sort by price/year.
   - Multi-filter categories.

6. Add production deployment docs:
   - Frontend hosting.
   - Backend hosting.
   - MongoDB Atlas environment variables.
   - CORS production origin.

---

## 22. File Purpose Summary

| File | Purpose |
|---|---|
| `src/App.jsx` | Defines all frontend routes |
| `src/main.jsx` | React entry point and providers |
| `src/pages/Homepage.jsx` | Main homepage composition |
| `src/pages/CategoryPage.jsx` | Browse/filter inventory page |
| `src/pages/CarDetailPage.jsx` | Single car detail page with gallery and booking CTA |
| `src/pages/LoginPage.jsx` | Admin login screen |
| `src/pages/AdminDashboard.jsx` | Admin booking dashboard |
| `src/context/AuthContext.jsx` | Auth state, token/user persistence |
| `src/components/ProtectedRoute.jsx` | Protects admin dashboard route |
| `src/components/Header.jsx` | Global navigation/header |
| `src/components/CarCard.jsx` | Reusable car listing card |
| `src/components/home/CategoriesSection.jsx` | Homepage category cards |
| `src/components/home/BookingModal.jsx` | Homepage booking modal |
| `src/api/cars.js` | Car API helpers and normalizer |
| `src/api/auth.js` | Admin login API helper |
| `src/api/bookings.js` | Booking API helpers |
| `src/utils/formatters.js` | Price formatting |
| `server/index.js` | Express server entry |
| `server/routes/cars.js` | Car API routes |
| `server/routes/auth.js` | Auth API routes |
| `server/routes/bookings.js` | Booking API routes |
| `server/middleware/auth.js` | JWT middleware |
| `server/models/Car.js` | Car schema |
| `server/models/Booking.js` | Booking schema |
| `server/models/User.js` | Admin user schema |

---

This documentation is now aligned with the current project state.
