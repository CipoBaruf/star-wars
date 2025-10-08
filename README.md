# ⭐ Star Wars Intelligence

A modern Next.js application for exploring the Star Wars universe with AI-powered chat assistance. Browse characters, planets, starships, and vehicles from the SWAPI database with infinite scrolling and intelligent search.

## ✨ Features

- 🎬 **Character Explorer** - Browse heroes, villains, and iconic characters
- 🌍 **Planet Database** - Explore worlds from Tatooine to Coruscant
- 🚀 **Starship Catalog** - Discover legendary vessels like the Millennium Falcon
- 🚗 **Vehicle Collection** - From AT-ATs to speeder bikes
- 🤖 **AI Chat Assistant** - Ask questions about the Star Wars universe powered by Google Gemini AI
- ♾️ **Infinite Scrolling** - Seamless data loading with IntersectionObserver
- 📱 **Responsive Design** - Mobile-friendly with adaptive navigation
- 🎨 **Modern UI** - Glass-morphism effects and smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file with:
# GOOGLE_API_KEY=your_google_gemini_api_key

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
```

## 🧪 Testing

This project includes a comprehensive test suite with **124 tests** covering all critical components, hooks, and utilities.

### Test Coverage

- ✅ **31 tests** for custom hooks (infinite scroll, data fetching, scroll detection)
- ✅ **30 tests** for chat utilities (AI intent detection, retry logic, timeouts)
- ✅ **53 tests** for UI components (ChatBox, Navigation, InfoCard)
- ✅ **10 tests** for utilities (class name merging)

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (for development)
pnpm test:watch

# With coverage report
pnpm test:coverage

# Windows alternative (if PowerShell scripts disabled)
node node_modules\jest\bin\jest.js
```

**Pass Rate**: 99%+ (123-124/124 tests passing)  
**Execution Time**: ~7-10 seconds

For detailed testing documentation, see the testing guides in the repository.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/              # API routes (SWAPI proxy, chat endpoints)
│   ├── characters/       # Character listing page
│   ├── planets/          # Planet listing page
│   ├── spaceships/       # Starship listing page
│   ├── vehicles/         # Vehicle listing page
│   └── chat/             # AI chat interface
├── lib/
│   ├── chatUtils.ts      # AI chat utilities (intent detection, retry logic)
│   ├── constants.ts      # App-wide constants
│   └── utils.ts          # Utility functions
└── shared/
    ├── components/       # Reusable UI components
    ├── hooks/            # Custom React hooks
    ├── locales/          # Internationalization
    └── types/            # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini AI (@google/generative-ai)
- **Data Source**: SWAPI (Star Wars API)
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 🎨 UI Design System

Built with a **custom component system** (no UI framework dependencies) for optimal performance and flexibility:

- **🎯 Atomic Design**: Modular components organized in focused folders (chat/, data-page/, navigation/)
- **⚡ Performance**: ~45KB bundle size (7x smaller than Material UI), optimized with RAF throttling and memoization
- **🔒 Type Safety**: 100% TypeScript coverage with zero `any` types
- **♿ Accessible**: ARIA labels throughout, semantic HTML, keyboard navigation
- **🎨 Custom Tokens**: Centralized design tokens (`UI_CONFIG`) for consistent spacing, timing, and thresholds

**Why custom over frameworks?** Full control, minimal bundle, no breaking changes from third-party updates, optimized for this specific use case.

## 🔑 Key Features Explained

### Infinite Scrolling

Custom `useInfiniteScroll` and `useInfiniteScrollData` hooks provide seamless pagination using IntersectionObserver API.

### AI Chat Assistant

Intelligent chatbot with:

- Intent detection (character, planet, starship, vehicle, film queries)
- Context-aware conversations
- Streaming responses
- Retry logic with exponential backoff

### Responsive Navigation

Mobile-first design with:

- Collapsible mobile menu
- Active route highlighting
- Scroll-based title display on mobile

## 🧪 Testing Philosophy

The test suite follows modern best practices:

- **Strategic Coverage**: Tests critical business logic, not trivial code
- **User-Centric**: Tests use semantic queries that mirror real user interactions
- **Comprehensive Edge Cases**: Null values, errors, loading states, race conditions
- **Proper Mocking**: IntersectionObserver, fetch, Next.js router, browser APIs
- **Fast Execution**: All 124 tests run in ~7-10 seconds

## 🙏 Acknowledgments

- [SWAPI](https://swapi.dev/) - The Star Wars API
- [Google Gemini AI](https://ai.google.dev/) - AI chat functionality
- [Next.js](https://nextjs.org/) - React framework
