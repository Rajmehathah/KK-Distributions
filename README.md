#  KK Distributions (Indira)
### *Premium B2B Sacred Incense & FMCG Wholesale Platform*

Welcome to the production-grade distribution portal for **KK Distributions (Indira)**. This repository houses the completely migrated, modern frontend stack designed with advanced UI/UX interactions, B2B authentication guards, and premium Indian spiritual-luxury aesthetics.

---

## ✨ Primary Features & Enhancements

### 🪔 1. Sandalwood & Gold Luxury Aesthetic
- **Traditional-Modern Design**: A gorgeous, curated palette blending warm temple creams, rich sandalwood browns, and metallic gold accents.
- **Incense Smoke Particles Component**: An elegant `HTML5 Canvas` particle simulator that draws wispy, organic cream-white incense smoke trails and glowing gold particles in the background of the main landing Hero. Utilizes `requestAnimationFrame` for super-smooth 60 FPS rendering.
- **Cinematic Parallax & Float Loops**: Leveraging hardware-accelerated **GSAP** timelines for continuous float movements on core branded cards like **Royal Sandalwood Agarbathi** and **Varanasi Temple Sacred Dhoop**.

### ⚡ 2. Morphing Spring Quantity Selectors
- **Addictive Zepto/Blinkit UX**: Added custom spring-based quantity controllers (`framer-motion`) that replace standard layout additions.
- **Microinteractions**: Standard `+ ADD` buttons morph seamlessly into a rounded `[ - ]  Qty  [ + ]` pill upon click. Quantity changes trigger elastic spring-bounce number transitions.
- Fully integrated across all grid view cards, list entries, and slide-out quick preview modals.

### 🔐 3. B2B Credentials Authentication
- **Secure Route Guards**: The checkout route is strictly protected. Retailers are automatically redirected to the glassmorphic login gate.
- **Preset B2B Profile**: Configured for instantaneous login using standard credentials:
  - **Email**: `demo@kkdistributions.com`
  - **Password**: `123456`
- On successful validation, retailers are forwarded straight back to their active checkout session with bulk B2B shipping calculations loaded.

### 🖼️ 4. Category-Intelligent Auto Image Fetching
- **Zero Empty Containers**: Implemented an automated mapping pipeline that assigns high-resolution, relevant Unsplash ecommerce assets to items matching specific category headers (Agarbathis, Snacks, Beverages, Household, Grocery, etc.).
- **Visual Feedback**: Employs lazy loading, linear shimmer gradient placeholders during asset fetching, and smooth entry scale transitions.

### 📱 5. Sticky Bottom Navigation Mobile Bar
- **App-Like Portability**: Sticky mobile app bar fixed to the bottom on mobile devices.
- **Real-Time Integration**: Integrates shortcuts for Home, Products, Account, and Cart (with real-time cart counts and direct cart drawer side-sheets).

---

## 🛠️ Technology Stack

- **Core**: React.js 19 + TypeScript (Strict compiler rules)
- **Bundler**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Query Caching**: TanStack Query (React Query)
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **Server Connection**: Type-safe browser Fetch client

---

## 🚀 Getting Started

### 📦 1. Installation
Install all dependencies for the React frontend:
```bash
npm install
```

### ⚙️ 2. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

### 🏃 3. Run the Development Server
Launch the React frontend development environment:
```bash
npm run dev
```
*The dev application will run on [http://localhost:5173/](http://localhost:5173/)*

To start the local Express/MongoDB B2B backend API server:
```bash
node server/server.cjs
```
*The API endpoints will open on [http://localhost:5000/](http://localhost:5000/)*

### 🏗️ 4. Production Build
Compile the application using the strict TypeScript compiler checks and build Vite distribution bundles:
```bash
npm run build
```
The compiled, optimized assets will write directly to the `/dist` directory.
