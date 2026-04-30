# ZAMORA - Next.js + MongoDB E-commerce

A sophisticated e-commerce website built with Next.js 14, MongoDB, and TypeScript.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: CSS (Custom luxury theme)

## Features

- 🛍️ Product catalog with filtering and sorting
- 🛒 Shopping cart with persistent storage
- 👤 User authentication (login/register)
- 📝 Product reviews
- 📦 Order management
- 👨‍💼 Admin dashboard
- 📱 Fully responsive design
- ✨ Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Navigate to the project directory:
   ```bash
   cd zamora-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and update the values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/zamora
   NEXTAUTH_SECRET=your-super-secret-key-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
zamora-nextjs/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── orders/        # Order endpoints
│   │   ├── products/      # Product endpoints
│   │   └── reviews/       # Review endpoints
│   ├── auth/              # Auth pages (login/register)
│   ├── products/          # Product pages
│   ├── about/             # Static pages
│   ├── contact/
│   ├── faq/
│   ├── careers/
│   ├── services/
│   ├── terms/
│   ├── policies/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── CartSidebar.tsx
│   ├── FilterPanel.tsx
│   ├── Footer.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx
│   ├── Overlay.tsx
│   ├── ProductCard.tsx
│   ├── Providers.tsx
│   └── SideMenu.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # MongoDB connection
├── models/               # Mongoose models
│   ├── Order.ts
│   ├── Product.ts
│   ├── Review.ts
│   ├── User.ts
│   └── index.ts
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeder
├── store/               # State management
│   └── useStore.ts     # Zustand store
├── types/               # TypeScript types
│   └── next-auth.d.ts
├── .env.local          # Environment variables
├── next.config.js      # Next.js configuration
├── package.json
├── README.md
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Add review (authenticated)

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create order (authenticated)

## Default Admin Credentials

After running the seed script:
- **Username**: admin
- **Password**: admin123

## Conversion Notes

This project was converted from an Express.js + JSON file storage application to:
- Next.js 14 with App Router for full-stack capabilities
- MongoDB with Mongoose for production-ready database
- NextAuth.js for secure authentication
- Zustand for client-side state management

## License

ISC
