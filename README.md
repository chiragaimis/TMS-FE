# Tuition Management System - Frontend

A modern, production-grade React.js frontend for managing coaching classes and tuition institutes.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts
- **Lucide Icons** - Modern icon library
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header)
│   └── ui/              # Reusable UI components
├── pages/               # Page components
├── services/            # API services
├── store/               # Zustand stores
├── types/               # TypeScript types
├── utils/               # Helper functions
└── hooks/               # Custom React hooks
```

## 🎨 Features

### Dashboard
- Real-time statistics cards
- Revenue and student growth charts
- Recent activity feed
- Quick action buttons

### Student Management
- Complete student records
- Search and filter functionality
- Fee status tracking
- Attendance percentage
- Student profile view
- Add/Edit/Delete operations

### Teacher Management
- Teacher profiles
- Subject assignments
- Batch assignments
- Salary information

### Batch Management
- Create and manage batches
- Assign teachers and students
- Schedule management
- Batch details view

### Attendance System
- Daily attendance marking
- Batch-wise attendance
- Bulk mark present/absent
- Date-wise tracking

### Fee Management
- Fee collection tracking
- Payment status
- Pending fees overview
- Receipt generation

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```
VITE_API_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🎯 Key Components

### UI Components
- **Card** - Container component with shadow
- **Button** - Multiple variants (primary, secondary, danger, ghost)
- **Input** - Form input with label and error states
- **Badge** - Status indicators
- **Table** - Data table with sorting
- **Modal** - Animated modal dialogs

### Layout Components
- **Sidebar** - Collapsible navigation sidebar
- **Header** - Top navigation bar with search
- **Layout** - Main layout wrapper

## 🎨 Design System

### Colors
- Primary: Indigo (#6366f1)
- Background: Light Gray (#F8FAFC)
- Cards: White with subtle shadows
- Text: Gray scale

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700

### Spacing
- Consistent Tailwind spacing scale
- 4px base unit

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu

## 🔌 API Integration

The app uses Axios for API calls. All API services are in `src/services/api.ts`.

Example usage:
```typescript
import { studentApi } from './services/api';

// Fetch all students
const students = await studentApi.getAll();

// Create a student
await studentApi.create(studentData);
```

## 🗂️ State Management

Using Zustand for global state:
```typescript
import { useAppStore } from './store/appStore';

const { sidebarOpen, toggleSidebar } = useAppStore();
```

## 🎭 Mock Data

Mock data is available in `src/utils/mockData.ts` for development and testing.

## 🚀 Performance Optimizations

- Code splitting with React.lazy
- Optimized re-renders with React.memo
- Efficient state management with Zustand
- Query caching with TanStack Query
- Optimized bundle size with Vite

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add menu item in `src/components/layout/Sidebar.tsx`

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the component naming conventions
4. Write clean, maintainable code
5. Test responsive design

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ for modern tuition management
