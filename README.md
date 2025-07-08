# ☕ Carikopi

**Carikopi** is a modern coffee shop discovery web app that helps users find nearby cafes, explore their details, and save personal favorites. Built with **Next.js**, **Leaflet**, **MongoDB**, **Redis**, and **SerpAPI**, this app focuses on user experience, performance, and real-time data handling.


🔗 Live Site: [https://carikopiapp.vercel.app](https://carikopiapp.vercel.app)

![Screenshot of Carikopi](https://github.com/user-attachments/assets/7ecdb21b-bccc-413c-92d8-8d4f9d03b861)

---

## 🌟 Features

- 🔍 **Explore Nearby Coffee Shops**
  - Uses **Google Places API** to find coffee shops near your location
  - Manual "Find My Location" button with fallback if denied
  - Auto-geolocation after welcome (if permission granted)

- 🧭 **Interactive Map**
  - Leaflet-based map with smooth `flyTo` animation
  - Markers with detailed popup cards
  - View shop photos, hours, contact info, and reviews
  - Mobile-first design with collapsible UI

- 💖 **Favorites**
  - Add and remove coffee shops to/from favorites
  - View your favorites on a dedicated `/favorites` page
  - Tap "View on map" to fly to the shop on the homepage
  - Automatically cleaned when account is deleted

- 🗺️ **Directions**
  - Get directions from your location to a selected coffee shop
  - Uses Google Maps Directions API
  - Shows estimated time, distance, and polyline on map

- 📋 **Shop Detail via SerpAPI**
  - Fetch rich shop data (photos, reviews, hours, contact info)
  - More complete and structured than Google Places `/details`
  - Cached using Redis for fast reaccess

- 🔐 **User Authentication**
  - Secure login and registration
  - Email verification and password reset
  - JWT token stored in HTTP-only cookies

- ⚙️ **Account Management**
  - Edit name and email directly from account settings
  - Validates email availability and format
  - Delete account with confirmation (also deletes favorites)

- 📦 **Performance Enhancements**
  - Server-side pagination for nearby results (20 per page)
  - Redis caching for shop metadata and SerpAPI data
  - Autocomplete limited to top 5–8 results for lower billing and faster UX

- 🎉 **Global Top Alerts**
  - Slide-down animated success/error alerts
  - Managed via `AlertContext` across all pages

- 🌐 **Google Places Autocomplete**
  - Debounced search input (min 3 characters)
  - Session-based billing for optimized API usage
  - Custom styled dropdown results

---

## 🧠 Tech Stack

| Layer        | Stack Used                            |
|--------------|----------------------------------------|
| Frontend     | Next.js 14, React 18, TypeScript       |
| UI           | MUI v5, Tailwind CSS                   |
| Maps         | Leaflet, React-Leaflet                 |
| Auth         | JSON Web Tokens (JWT)                  |
| Backend DB   | MongoDB (via Atlas)                    |
| Cache        | Redis (photo & shop metadata caching)  |
| APIs         | Google Places API, Google Directions API, **SerpAPI** |
| Animations   | Framer Motion                          |
| State Mgmt   | React Context (User, Location, Alerts) |

---

## 📁 Folder Structure

```
carikopi/
├── components/         # UI Components (Map, Alerts, ShopDetail)
├── contexts/           # Global Context Providers
├── lib/                # DB logic, Google API utils, SerpAPI handlers
├── pages/              # Routes like /, /login, /favorites
├── public/             # Static assets
├── styles/             # Global and custom styling
├── types/              # TypeScript types
```

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/carikopi.git
cd carikopi
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=your_mongo_connection_string

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret

# Google APIs
GOOGLE_API_KEY=your_google_places_and_directions_key

# SerpAPI
SERP_API_KEY=your_serpapi_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Unique Highlights

- Smooth Leaflet `flyTo` animations and delayed marker render
- SerpAPI integration for reliable shop info (richer than Places API `/details`)
- Intelligent caching of both images and SerpAPI results in Redis
- Global alert system with animated transitions
- Session-based Places Autocomplete with debounce and low cost
- Mobile-optimized interface with proper overflow and backdrops

---

## 🔒 Security Notes

- JWTs stored in secure, HTTP-only cookies
- Email and password never exposed to client
- Email verification and password reset flows supported

---

## 📸 Screenshots

> Desktop Version

![Screenshot of Carikopi Desktop Version](https://github.com/user-attachments/assets/054b2f25-2b78-4211-a5e2-050d8e219a13)

> Desktop Version (Shop Detail)

![Screenshot of Carikopi Desktop Version (Shop Detail)](https://github.com/user-attachments/assets/cbb083f8-75a7-4edd-8dec-e4f976937077)

> Mobile Version

![Screenshot of Carikopi Mobile Version](https://github.com/user-attachments/assets/b9afac4b-18b1-42b7-8c48-4d7d08904e00)

> Mobile Version (Shop Detail)

![Screenshot of Carikopi Mobile Version (Shop Detail)](https://github.com/user-attachments/assets/da266c2c-95ae-41f9-9db4-e08ed8f553f5)

> Mobile Version (Favorites Page)

![Screenshot of Carikopi Mobile Version (Favorites Page)](https://github.com/user-attachments/assets/91b82889-1da3-4734-b7ee-51933aac60b6)

---

## 🧑‍💻 Author

Built with ❤️ by [Kevin Mahendra](https://github.com/thekevinkun)

---

## 📄 License

This project is open-source under the MIT License.
