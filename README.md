# The Lux Motors

> A premium, high-performance web application tailored for luxury vehicle dealerships. The Lux Motors provides an elegant showroom experience and a secure, comprehensive admin dashboard for inventory and booking management.

![The Lux Motors Banner](./screenshots/banner.png) *(Placeholder for Banner)*

## 🚀 Live Demo
[View Live Demo Here](https://theluxmotors-demo.com) *(Update with your deployment link)*

## ✨ Features
* **Immersive Showroom**: A stunning, responsive UI built with dark luxury aesthetics, utilizing Stitches for precise styling and Framer Motion for buttery-smooth micro-animations.
* **Full-Stack Inventory Management**: Secure Admin Dashboard (JWT authenticated) with complete CRUD capabilities for vehicles.
* **Test Drive Bookings**: Customers can seamlessly request test drives. Admins can track, update, and manage bookings instantly.
* **Modern Authentication**: Protected backend routes and frontend guards utilizing custom Hooks and Context API.

## 🛠 Tech Stack

### Frontend
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![Framer Motion](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)
* **Stitches CSS-in-JS** (`@stitches/react`) for luxury component styling

### Backend & Database
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* **JWT** (`jsonwebtoken`) for secure auth

---

## 📸 Screenshots

| Home Page Showroom | Admin Dashboard Inventory |
| ------------------ | ------------------------- |
| ![Home](./screenshots/home.png) | ![Inventory](./screenshots/inventory.png) |

| Vehicle Details | Test Drive Booking |
| --------------- | ------------------ |
| ![Details](./screenshots/details.png) | ![Booking](./screenshots/booking.png) |

*(Note: Create a `/screenshots` directory in the repository and upload your images there)*

---

## ⚙️ Local Setup & Installation

Follow these steps to get the project running locally.

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB database (local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/The-Lux-Motors.git
cd The-Lux-Motors
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### 3. Backend Setup
Open a new terminal window and navigate to the server directory:
```bash
cd server

# Install backend dependencies
npm install
```

Create a `.env` file inside the `/server` folder and configure the following variables:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/The-Lux-Motors?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
npm start
# or use nodemon for development
npm run dev
```

### 4. Seed the Admin User
To access the Admin Dashboard, you need an initial admin account. Run the server and make a `POST` request (via Postman or a simple `curl` command) to:
`http://localhost:5000/api/auth/seed-admin`

This will generate the default credentials:
* **Email:** `admin@thelux.com`
* **Password:** `thelux2024`

You can then log in at `http://localhost:5173/login`.

---

## 📂 Project Structure

```
The-Lux-Motors/
├── server/                 # Node.js + Express Backend
│   ├── models/             # Mongoose schemas (Car, User, Booking)
│   ├── routes/             # API Endpoints (auth, cars, bookings)
│   ├── middleware/         # Custom JWT Auth middleware
│   └── index.js            # Server entry point
├── src/                    # React Frontend
│   ├── api/                # Axios/Fetch logic for backend communication
│   ├── components/         # Reusable UI elements (Stitches & Tailwind)
│   ├── context/            # React Context (AuthContext)
│   ├── pages/              # Main Route Views (Home, Admin, Login)
│   └── App.jsx             # React Router configuration
└── package.json            # Frontend dependencies
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the MIT License.
