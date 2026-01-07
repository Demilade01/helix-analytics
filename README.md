# Helix Analytics

A modern, executive-grade profitability analytics platform built with Next.js, TypeScript, and TailwindCSS. Helix Analytics provides sector-aware financial intelligence dashboards with a premium glassy UI design.

![Helix Analytics Hero](public/hero.png)

## Overview

Helix Analytics is an internal profitability analytics dashboard designed for multiple sectors (Healthcare, Banking, Retail, Energy, Life Sciences, Public Sector). Each user sees only their own sector and organization's data, with automatic context detection from the backend.

### Key Features

- **Sector-Aware Dashboards**: Automatically detects user context (sector + organization) and displays relevant KPIs
- **Real-Time Profitability Metrics**: Live financial insights with configurable filters
- **Multi-Organization Support**: Secure, isolated data views per organization
- **JWT Authentication**: Secure session management with HTTP-only cookies
- **Database-Backed**: PostgreSQL with Prisma ORM for reliable data storage
- **Comprehensive Reports**: Detailed financial reports with metrics, KPIs, and breakdowns
- **Compact Currency Display**: Large numbers formatted as K/M notation with full values on hover
- **Glassy Modern UI**: Premium dark theme with translucent panels and backdrop blur effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Config-Driven Architecture**: Easy to extend with new sectors and KPIs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based session management with HTTP-only cookies
- **Styling**: TailwindCSS 4 with custom glassy theme
- **UI Components**: shadcn/ui + Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs

## Design System

### Color Palette

- **Base Background**: `#010203` (very dark navy-black)
- **Primary Accent**: `#64748B` (glassy slate blue)
- **Surface Panels**: `rgba(255, 255, 255, 0.07)` with `backdrop-blur-md`
- **Borders**: `rgba(255, 255, 255, 0.12)`
- **Headings**: `#F8FAFC`
- **Body Text**: `#94A3B8`

### Theme Characteristics

- Dark, glassy, premium aesthetic
- Minimal, enterprise-ready design
- Transparent layers with backdrop blur
- Soft white glow shadows
- High contrast for readability

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd helix-analytics
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/helix_analytics?schema=public

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Ensure PostgreSQL is running and create a database:
```bash
createdb helix_analytics
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev
```

3. (Optional) Seed the database with sample data:
```bash
npm run seed
```

## Project Structure

```
helix-analytics/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints (login, signup, logout, me)
│   │   ├── analytics/       # Analytics data endpoint
│   │   ├── profitability/  # Profitability data endpoint
│   │   ├── reports/        # Reports endpoints
│   │   └── user/           # User management endpoints
│   ├── dashboard/          # Dashboard pages
│   │   ├── analytics/      # Analytics page
│   │   ├── reports/        # Reports page
│   │   ├── settings/       # Settings page
│   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   └── page.tsx        # Dashboard overview
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── profitability-filters.tsx
│   │   └── profitability-table.tsx
│   ├── sections/           # Landing page sections
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── sectors.tsx
│   │   ├── navbar.tsx
│   │   └── motion-presets.ts
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── api/                # API client and mock data
│   │   └── mock-profitability.ts
│   ├── auth/               # Authentication utilities
│   │   └── session.ts      # JWT session management
│   ├── contexts/           # React contexts
│   │   └── user-context.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-user.ts
│   ├── prisma.ts           # Prisma client instance
│   └── types/              # TypeScript type definitions
│       ├── profitability.ts
│       └── user.ts
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
└── public/                  # Static assets
```

## Features in Detail

### Landing Page

- **Hero Section**: Compelling headline with CTA buttons and floating analytics preview
- **Features Section**: Platform capabilities with metrics
- **Sectors Section**: Industry-specific dashboard previews
- **Analytics Preview**: Interactive chart demonstrations
- **Call-to-Action**: Contact and demo scheduling

### Dashboard

- **Overview Page**: KPI cards with real-time profitability metrics, interactive charts, and sortable data tables
- **Analytics Page**: Deep dive analytics with time-series data, revenue/cost/profit comparisons, and performance trends
- **Reports Page**: List of generated financial reports with detailed view modal showing:
  - Key financial metrics (Revenue, Costs, Profit)
  - Margin percentages (Gross, Operating, Net)
  - KPIs with trend indicators
  - Department revenue breakdown
  - Cost breakdown by category
- **Settings Page**: User profile management (name, email, organization, sector)
- **Filterable Data**: Date range and department/product filters
- **Compact Currency Formatting**: Large numbers displayed as K/M notation (e.g., $6.8M) with full value on hover
- **User Context**: Automatic sector and organization detection from authenticated user

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npx prisma migrate dev` - Create and apply database migrations
- `npx prisma studio` - Open Prisma Studio to view database data

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier (recommended) for code formatting

## Architecture

### Data Flow

1. User signs up/logs in with email and password
2. Backend hashes password with bcryptjs and creates user in database
3. Backend generates JWT token with user context (sector, organization)
4. JWT stored in HTTP-only cookie for secure session management
5. Frontend stores user context in React Context
6. Dashboard components fetch data from API routes based on user context
7. API routes verify JWT from cookie and query database with Prisma
8. Filters update data queries dynamically

### Authentication

- **Signup**: Email, password, first name, last name, sector, organization
- **Login**: Email and password
- **Session**: JWT stored in HTTP-only cookie (secure, not accessible via JavaScript)
- **Authorization**: All API routes verify JWT before processing requests
- **User Context**: React Context provides authenticated user data throughout the app

### Database Schema

- **Sectors**: Healthcare, Banking, Retail, Energy, Life Sciences, Public Sector
- **Organizations**: Multiple organizations per sector
- **Users**: Linked to sector and organization with role-based access
- **Profitability Snapshots**: Period-based financial data
- **Department Metrics**: Revenue, cost, profit by department
- **Cost Categories**: Categorized cost breakdowns
- **KPI Definitions & Values**: Configurable KPIs with trend tracking

### Component Architecture

- **Server Components**: Landing page sections (where possible)
- **Client Components**: Interactive dashboard components, forms, charts
- **API Routes**: Next.js route handlers for backend logic
- **Shared Components**: Reusable UI primitives from shadcn/ui
- **Context Providers**: User authentication and state management

## Roadmap

### Completed ✅

- [x] Complete authentication flow (JWT-based with HTTP-only cookies)
- [x] Real API integration with PostgreSQL database
- [x] Dashboard pages (Overview, Analytics, Reports, Settings)
- [x] Report detail view with comprehensive financial data
- [x] Compact currency formatting (K/M notation)
- [x] Custom scrollbar styling
- [x] Password visibility toggles
- [x] Database seeding with sample data

### In Progress / Next Steps

- [ ] Data export functionality (CSV, PDF)
- [ ] Forgot password flow
- [ ] Error boundaries and improved error handling
- [ ] Toast notifications for user feedback
- [ ] Enhanced mobile navigation
- [ ] Performance optimizations (code splitting, caching)
- [ ] Real-time updates (WebSockets or polling)
- [ ] User roles and permissions system
- [ ] Email notifications

## License

Private - Internal use only

## Contact

For questions or support, please contact the development team.
