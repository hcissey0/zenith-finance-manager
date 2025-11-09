# Zenith Finance Manager

A modern, offline-first Progressive Web App (PWA) for personal finance management with beautiful visualizations, transaction tracking, and multi-account support.

## Features

- 📱 **Progressive Web App** - Installable, works offline
- 🔐 **Authentication** - Email/password and Google OAuth
- 📊 **Interactive Dashboard** - Income/expense calendar with pie charts
- 💰 **Multi-Account Support** - Manage multiple accounts with different currencies
- 📈 **Transaction Tracking** - Comprehensive transaction management with categories
- 🎯 **Quick Logging** - Fast transaction entry for common expenses
- 📅 **Calendar View** - Visual monthly overview with current day highlighting
- 🎨 **Modern UI** - Beautiful dark/light theme with smooth animations
- 💾 **Offline Sync** - Local storage with future cloud synchronization

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Charts**: Recharts for data visualization
- **PWA**: Vite PWA plugin for offline functionality
- **Icons**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zenith-finance-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)

   b. Go to Project Settings > API to get your project URL and anon key

   c. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   d. Update `.env.local` with your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   e. Run the database migration:

   ```bash
   # In your Supabase dashboard, go to SQL Editor and run:
   # supabase/migrations/20241108000000_initial_schema.sql
   ```

4. **Configure Google OAuth (Optional)**

   a. In Supabase Dashboard, go to Authentication > Providers
   b. Enable Google provider
   c. Add your Google OAuth credentials
   d. Set redirect URL to: `your-domain.com`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

The app uses the following main tables:

- `profiles` - User profiles with authentication data
- `accounts` - User accounts (checking, savings, etc.)
- `transactions` - Financial transactions with categories

All tables include Row Level Security (RLS) policies for data protection.

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard and charts
│   ├── layout/        # Header, navigation
│   ├── transactions/  # Transaction forms and lists
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Supabase client and utilities
├── types/            # TypeScript type definitions
└── constants/        # App constants and defaults
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
