# Helix Analytics

A modern, executive-grade profitability analytics platform built with Next.js, TypeScript, and TailwindCSS. Helix Analytics provides sector-aware financial intelligence dashboards with a premium glassy UI design.

![Helix Analytics Hero](public/hero.png)

## Overview

Helix Analytics is an internal profitability analytics dashboard designed for multiple sectors (Healthcare, Banking, Retail, Energy, Life Sciences, Public Sector). Each user sees only their own sector and organization's data, with automatic context detection from the backend.

### Key Features

- **Sector-Aware Dashboards**: Automatically detects user context (sector + organization) and displays relevant KPIs
- **Real-Time Profitability Metrics**: Live financial insights with configurable filters
- **Multi-Organization Support**: Secure, isolated data views per organization
- **Glassy Modern UI**: Premium dark theme with translucent panels and backdrop blur effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Config-Driven Architecture**: Easy to extend with new sectors and KPIs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4 with custom glassy theme
- **UI Components**: shadcn/ui + Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Icons**: Lucide React

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

Create a `.env.local` file in the root directory:

```env
# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret
JWT_SECRET=your_jwt_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Project Structure

```
helix-analytics/
├── app/
│   ├── dashboard/          # Dashboard pages and layout
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
│   ├── contexts/           # React contexts
│   │   └── user-context.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-user.ts
│   └── types/               # TypeScript type definitions
│       └── profitability.ts
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

- **Profitability Overview**: KPI cards with real-time metrics
- **Interactive Charts**: Time series and department breakdowns
- **Filterable Data**: Date range and department/product filters
- **Data Tables**: Sortable profitability tables
- **User Context**: Automatic sector and organization detection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier (recommended) for code formatting

## Architecture

### Data Flow

1. User authenticates via Google OAuth
2. Backend provides JWT with user context (sector, organization)
3. Frontend stores user context in React Context
4. Dashboard components fetch data based on user context
5. Filters update data queries dynamically

### Component Architecture

- **Server Components**: Landing page sections (where possible)
- **Client Components**: Interactive dashboard components
- **Shared Components**: Reusable UI primitives from shadcn/ui
- **Context Providers**: User authentication and state management

## Roadmap

- [ ] Complete authentication flow (Google OAuth + JWT)
- [ ] Real API integration (currently using mock data)
- [ ] Additional dashboard pages (Analytics, Reports, Settings)
- [ ] Data export functionality (CSV, PDF)
- [ ] Enhanced mobile navigation
- [ ] Error boundaries and improved error handling
- [ ] Performance optimizations (code splitting, caching)

## License

Private - Internal use only

## Contact

For questions or support, please contact the development team.
