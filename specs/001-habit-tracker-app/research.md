# Phase 0 Research: Habit Tracker App

**Date**: 2025-01-14 | **Feature**: habit-tracker-app | **Plan**: [plan.md](./plan.md)

## Technical Research Summary

### Next.js Static Export Approach

**Key Findings**:
- Next.js 14+ supports full static export via `next export` or `output: 'export'` in config
- App Router is fully compatible with static export when using client-side rendering
- Static export produces pure HTML/CSS/JS with no server dependencies
- localStorage works perfectly with static export for client-side data persistence

**Implementation Strategy**:
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
module.exports = nextConfig
```

**Validation Against Constitution**:
- ✅ **Static-First**: Produces only static files, no server required
- ✅ **Minimal Dependencies**: Next.js provides clear value (component system + build tooling)
- ✅ **Template-Driven**: React components act as declarative templates
- ✅ **Simplicity**: Default configuration works out-of-the-box

### Recharts Integration Research

**Library Assessment**:
- Recharts is a React wrapper around D3.js with ~2.8M weekly downloads
- Bundle size: ~180KB minified, tree-shakeable
- Designed for React applications with declarative chart components
- No external dependencies beyond React and D3 utilities

**Chart Requirements for Habit Tracker**:
1. **Weekly Progress Bar Chart**: Show daily completion rates
2. **Streak Line Chart**: Visualize habit streaks over time  
3. **Calendar Heatmap**: GitHub-style contribution calendar for habits
4. **Progress Pie Charts**: Overall completion percentage per habit

**Sample Implementation**:
```typescript
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Weekly progress data structure
const weeklyData = [
  { day: 'Mon', completed: 3, total: 5 },
  { day: 'Tue', completed: 4, total: 5 },
  // ...
];

// Simple progress chart component
const WeeklyProgressChart = ({ data }) => (
  <BarChart width={300} height={200} data={data}>
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="completed" fill="#10b981" />
  </BarChart>
);
```

**Validation Against Constitution**:
- ⚠️ **Minimal Dependencies**: Large dependency but justified for data visualization needs
- ✅ **Static-First**: Client-side rendering only, no server charts
- ✅ **Exit Strategy**: Can be replaced with native Canvas/SVG if needed

### Local Storage Data Architecture

**Storage Strategy**:
- Use browser localStorage for all habit data persistence
- Store data as JSON objects with versioned schema
- Implement data migration for schema updates
- Add export/import functionality for data portability

**Data Schema Design**:
```typescript
interface Habit {
  id: string;
  name: string;  
  description?: string;
  category: string;
  color: string;
  createdAt: Date;
  isActive: boolean;
}

interface Completion {
  id: string;
  habitId: string;
  completedAt: Date;
  notes?: string;
}

interface StorageSchema {
  version: number;
  habits: Habit[];
  completions: Completion[];
  settings: UserSettings;
}
```

**Storage Service Implementation**:
```typescript
class HabitStorageService {
  private readonly STORAGE_KEY = 'habit-tracker-data';
  private readonly CURRENT_VERSION = 1;

  save(data: StorageSchema): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  load(): StorageSchema {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return this.getDefaultData();
    
    const data = JSON.parse(stored);
    return this.migrateData(data);
  }

  // Handle data migration between versions
  private migrateData(data: any): StorageSchema {
    // Migration logic here
    return data;
  }
}
```

### Performance and Browser Support

**Performance Requirements Met**:
- Next.js code splitting keeps initial bundle < 500KB target
- Recharts lazy loading ensures charts don't block initial render  
- localStorage operations are synchronous and fast for expected data volume
- Static export eliminates server response time

**Browser Compatibility**:
- localStorage: Supported in all modern browsers (IE8+)
- Next.js/React: ES2020+ target covers 95%+ of users
- Recharts: Modern browser support matches our target

**Offline Capabilities**:
- Static export works fully offline once loaded
- localStorage persists between browser sessions
- Service worker can be added later for full PWA support

## Risk Assessment

### Technical Risks

**Low Risk**:
- ✅ Next.js static export is well-established and stable
- ✅ localStorage is reliable for target data volume (<10MB)
- ✅ Recharts has mature API and good documentation

**Medium Risk**:
- ⚠️ Data loss if localStorage is cleared (mitigation: export functionality)
- ⚠️ Bundle size growth with Recharts (mitigation: lazy loading, tree shaking)

**Mitigation Strategies**:
1. **Data Backup**: Implement JSON export/import functionality
2. **Progressive Enhancement**: Load charts only when stats page is accessed
3. **Graceful Degradation**: App works without charts if Recharts fails to load

### Constitution Compliance Issues

**Resolved**:
- ✅ Static-first requirement fully met with static export
- ✅ Template-driven approach using React components
- ✅ Test-first strategy defined for components and build process

**Justified Dependencies**:
- **Next.js**: Provides React framework + static site generation with clear migration path
- **Recharts**: Essential for data visualization requirement, no suitable native alternative
- **TypeScript**: Improves maintainability and catches errors at build time

## Phase 1 Preparation

**Ready to Proceed**: ✅ All technical unknowns resolved

**Next Phase Actions**:
1. Create detailed data model schema (data-model.md)
2. Define component contracts and interfaces (contracts/)  
3. Generate quickstart development guide (quickstart.md)

**Outstanding Questions**: None - ready to proceed to Phase 1 design.