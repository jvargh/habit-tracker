# 🎯 Habit Tracker

A modern, responsive habit tracking application built with Next.js 15, TypeScript, and Tailwind CSS. Track your daily habits, visualize progress, and build better routines with an intuitive interface.

**Developed using [GitHub SpecKit](https://github.com/github/spec-kit)** - An AI-powered development framework that transforms natural language specifications into fully functional applications through systematic implementation phases.

## ✨ Features

- 📊 **Comprehensive Habit Management**: Create, edit, delete, and track habits
- 📈 **Real-time Statistics**: Completion rates, streaks, and progress tracking
- 🔍 **Advanced Filtering**: Search, sort by completion rate, streak, or name
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 💾 **Data Persistence**: Local storage with sample data included
- 🎨 **Modern UI**: Clean design with dark/light mode support
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🧪 **Well Tested**: Comprehensive test suite with Jest and React Testing Library

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd habit-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

That's it! The app will load with sample data so you can start exploring immediately.

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm start` | Start production server (requires build first) |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code quality with ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 🔧 Built with SpecKit

This project was developed using **[GitHub SpecKit](https://github.com/github/spec-kit)**, an innovative AI-powered development framework that revolutionizes how applications are built from specifications.

### What is SpecKit?
SpecKit transforms natural language requirements and specifications into fully functional, production-ready applications through a systematic, phase-based approach. Instead of writing code from scratch, developers can describe what they want to build, and SpecKit handles the implementation details.

### Development Process
This habit tracker was built through SpecKit's structured phases:
- **📋 Specification Analysis**: Breaking down requirements into actionable tasks
- **🏗️ Architecture Planning**: Designing component structure and data flow
- **⚡ Rapid Implementation**: Generating components, tests, and functionality
- **🧪 Quality Assurance**: Comprehensive testing and validation
- **✨ Feature Integration**: Seamless integration of complex features like edit modals

### Why SpecKit?
- **Speed**: Rapid development from concept to working application
- **Quality**: Built-in best practices and comprehensive testing
- **Consistency**: Standardized code structure and patterns
- **Maintainability**: Clean, well-documented, and extensible codebase

The result is this fully-featured habit tracker with 43/43 passing tests, complete UI functionality, and production-ready code - all generated from high-level specifications.

## 🎮 How to Use

### Getting Started
1. **Load Sample Data**: Click "Load Sample Habits" on first visit or "Reset to Sample Data"
2. **View Habits**: Browse your habit cards in grid or list layout
3. **Track Progress**: Click "Complete" buttons to log habit completions

### Managing Habits
- **Edit Habit**: Click the "Edit" button to open a modal and modify name, category, target, etc.
- **Delete Habit**: Click "Delete" and confirm to remove a habit
- **Complete Habit**: Click "Complete" to log today's completion with target value
- **Reset Data**: Use "Reset to Sample Data" to restore example habits

### Features Overview
- **Search**: Type in the search box to filter habits by name
- **Sort**: Use the dropdown to sort by name, completion rate, or streak
- **Layout**: Toggle between grid and list views with the layout buttons
- **Statistics**: View real-time completion rates and streak counters on each card

## 🏗️ Project Structure

```
habit-tracker/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── habits/                  # Habit-related components
│   │   ├── HabitCard.tsx       # Individual habit card
│   │   ├── HabitList.tsx       # Habits container
│   │   └── EditHabitModal.tsx  # Edit habit modal
│   └── ui/                      # Reusable UI components
│       └── Button.tsx           # Button component
├── lib/                         # Utility libraries
│   ├── data/                    # Data management
│   │   └── sample-data.ts      # Sample habit data
│   ├── storage/                 # Local storage utilities
│   │   └── index.ts            # Storage service
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # Type definitions
│   └── utils/                   # Helper utilities
│       └── index.ts            # Habit calculations
├── tests/                       # Test files
│   └── components/              # Component tests
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest testing configuration
└── README.md                   # This file
```

## 🧪 Testing

The project includes comprehensive testing coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

**Current Test Results**: ✅ 43/43 tests passing
- Component rendering and props
- User interactions (clicks, form inputs)
- Habit statistics calculations
- Data persistence and retrieval
- Error handling and edge cases

## 🎨 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- **Storage**: Browser localStorage with JSON serialization

## 🔧 Troubleshooting

### Common Issues

**Server won't start**
```bash
# Kill existing Node processes (Windows)
taskkill /f /im node.exe

# Or on Mac/Linux
pkill node

# Restart the server
npm run dev
```

**TypeScript errors**
```bash
# Run type checking
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Tests failing**
```bash
# Run specific test
npm test HabitCard.test.tsx

# Update snapshots if UI changed
npm test -- --updateSnapshot
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Automatic deployments on every push

### Other Platforms
- **Netlify**: Build command `npm run build`, publish directory `out`
- **GitHub Pages**: Enable static export in `next.config.js`

## 📈 Roadmap

- [ ] **Progress Charts**: Visual habit completion trends (T027)
- [ ] **Weekly Views**: Calendar-style habit tracking (T028)  
- [ ] **Achievement Badges**: Milestone rewards system (T029)
- [ ] **Data Export**: CSV/JSON export functionality
- [ ] **Habit Reminders**: Browser notification system

## 📄 License

This project is licensed under the MIT License.

---

**Happy habit tracking!** 🎯✨

Built with ❤️ using [GitHub SpecKit](https://github.com/github/spec-kit), Next.js, TypeScript, and Tailwind CSS.

*Demonstrating the power of AI-assisted development through systematic specification-to-code transformation.*
