# 🕉️ कुंभ Ride (Kumbh Ride) — PWA Demo

> **Your Journey. Your Kumbh.**  
> Official interactive mobile-first Progressive Web App (PWA) demo for the **Nashik–Trimbakeshwar Simhastha Kumbh Mela 2028**.

---

## 📱 Overview

**कुंभ Ride** is a consumer-grade travel booking platform designed for pilgrims attending the sacred Simhastha Kumbh Mela 2028. It provides end-to-end booking for station-to-ghat transit and accommodation near holy pilgrimage sites, complete with offline PWA support, 3-language localization, local demo persistence, and simulated payments.

---

## 🌟 Key Features

### 🚖 1. Ride Booking Experience
- **Route A**: *Nashik Road Railway Station ↔ Panchvati / Ramkund*
  - Bike Taxi: ₹300/person (Round Trip)
  - AC Sedan / SUV: ₹300/person (Round Trip)
- **Route B**: *Manmad Junction ↔ Nashik City*
  - AC Four-Wheeler only: ₹600/person (Round Trip)
  - Two-wheelers strictly disabled on highway route with safety notice.
- **Dynamic Fleet Allocation**:
  - Bike taxis allocate 1 captain per pilgrim (e.g. 3 pilgrims = 3 bikes).
  - Four-wheelers calculate vehicle capacity (e.g. 5 passengers = 2 cars).
- **Auspicious Shahi Snan Highlights**:
  - Highlights auspicious 2028 bathing dates (Guru Purnima, Shravan Purnima, Krishna Ashtami, etc.) with special demand warnings.
- **9-Step Booking Flow**: Route → Vehicle → Date → Timings → Passengers → Contact → Summary → Demo Payment → Instant QR Boarding Pass.

### 🏨 2. Hotel & Dharamshala Discovery
- Curated stays starting from **₹1,000/night**:
  - *Ramkund Heritage Dharamshala* (200m from Ramkund Ghat)
  - *Trimbak Divine Yatri Niwas* (near Trimbakeshwar Jyotirlinga)
  - *Godavari Riverside Resort* (Gangapur Road)
  - *Kumbh Yatri Bhawan* (Nashik Road Station)
- Filters by budget, proximity to ghats, and pilgrim amenities (Satvik Bhojan, 24/7 Hot Water, Temple Shuttle).
- Interactive room selection, date range calculator, and demo reservation checkout.

### 💳 3. Simulated Demo Payment Gateway
- Razorpay / PhonePe inspired checkout sheet with clear **DEMO MODE** notice.
- Instant selectable methods: **UPI** (`demo@kumbhride`), **Card** (one-click demo card autofill), and **Net Banking**.
- Live 1.5s simulated processing state and a **Simulate Failure** switch to verify error handling.
- Instant scannable QR ticket generation on payment success.

### 🎫 4. My Bookings & Digital Boarding Pass
- Stored locally via `localStorage` for offline access and refresh persistence.
- Categorized tabs: *Upcoming*, *Completed*, *Cancelled*.
- Interactive "Cancel Booking" action with demo refund calculation.
- Digital ticket with unique PNR, route timeline, vehicle allocation, and printable format.

### 🌐 5. Multilingual Localization (i18n)
Full localization across 3 languages with persistent selection:
- **English**
- **हिंदी (Hindi)**
- **मराठी (Marathi)**

### 📲 6. Progressive Web App (PWA)
- Fully installable on **Android** and **iOS** home screens.
- Web app manifest with standalone display mode and theme color `#F97316`.
- Custom 192x192, 512x512, maskable, and Apple touch icons.
- Workbox service worker caching app shell and static assets.
- Offline status detection banner.
- Custom step-by-step install guide for iOS Safari and Android Chrome.

---

## 🎨 Brand Identity

- **Primary Orange**: `#F97316` (Sacred Kesari)
- **Festival Yellow**: `#FFC928` (Marigold Gold)
- **Deep Orange**: `#C2410C` (Temple Terracotta)
- **Background**: `#FFF9ED` (Sacred Cream)
- **Text**: `#292524` (Charcoal)

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Routing**: React Router DOM v6
- **PWA**: `vite-plugin-pwa` + Workbox
- **QR Code**: `qrcode.react`
- **Architecture**: Modular and ready for FastAPI + PostgreSQL backend integration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Sumitb20/Kumbh-Ride.git
cd Kumbh-Ride

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License. Created for the Nashik–Trimbakeshwar Simhastha Kumbh Mela 2028 demonstration.

