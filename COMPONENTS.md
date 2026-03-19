# 📚 Component Documentation

## UI Components Guide

### Card Component

**Location:** `src/components/ui/Card.tsx`

**Usage:**
```tsx
import { Card } from '../components/ui/Card';

<Card>
  <h3>Title</h3>
  <p>Content goes here</p>
</Card>

// With hover effect
<Card hover>
  <p>Hover me!</p>
</Card>

// With custom className
<Card className="p-8">
  <p>Custom padding</p>
</Card>
```

**Props:**
- `children`: ReactNode (required)
- `className`: string (optional)
- `hover`: boolean (optional) - Adds hover shadow effect

---

### Button Component

**Location:** `src/components/ui/Button.tsx`

**Usage:**
```tsx
import { Button } from '../components/ui/Button';

// Primary button (default)
<Button onClick={handleClick}>Click Me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Saving...</Button>

// With icon
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add New
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- All standard button HTML attributes

---

### Input Component

**Location:** `src/components/ui/Input.tsx`

**Usage:**
```tsx
import { Input } from '../components/ui/Input';

// Basic input
<Input placeholder="Enter text" />

// With label
<Input label="Full Name" placeholder="John Doe" />

// With error
<Input 
  label="Email" 
  error="Invalid email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Different types
<Input type="email" label="Email" />
<Input type="password" label="Password" />
<Input type="date" label="Date of Birth" />
```

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- All standard input HTML attributes

---

### Badge Component

**Location:** `src/components/ui/Badge.tsx`

**Usage:**
```tsx
import { Badge } from '../components/ui/Badge';

// Variants
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Overdue</Badge>
<Badge variant="info">Active</Badge>
<Badge variant="default">Default</Badge>
```

**Props:**
- `variant`: 'success' | 'warning' | 'error' | 'info' | 'default'
- `children`: ReactNode

---

### Table Components

**Location:** `src/components/ui/Table.tsx`

**Usage:**
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <button>Edit</button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Components:**
- `Table`: Main wrapper
- `TableHeader`: Header section
- `TableBody`: Body section
- `TableRow`: Table row
- `TableHead`: Header cell
- `TableCell`: Body cell

---

### Modal Component

**Location:** `src/components/ui/Modal.tsx`

**Usage:**
```tsx
import { Modal } from '../components/ui/Modal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Student"
        size="lg"
      >
        <form>
          <Input label="Name" />
          <Input label="Email" />
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `children`: ReactNode (required)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (optional, default: 'md')

**Features:**
- Animated entrance/exit
- Backdrop click to close
- Close button
- Body scroll lock when open

---

## Layout Components

### Layout Component

**Location:** `src/components/layout/Layout.tsx`

**Usage:**
```tsx
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <YourPageContent />
    </Layout>
  );
}
```

**Features:**
- Includes Sidebar and Header
- Responsive margin adjustment
- Mobile-friendly

---

### Sidebar Component

**Location:** `src/components/layout/Sidebar.tsx`

**Features:**
- Collapsible navigation
- Active route highlighting
- Icon + label menu items
- Smooth animations

**Menu Items:**
- Dashboard, Students, Teachers, Batches
- Attendance, Fees, Payments, Schedule
- Reports, Announcements, Settings

**Customization:**
Edit the `menuItems` array in `Sidebar.tsx`:
```tsx
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  // Add your items here
];
```

---

### Header Component

**Location:** `src/components/layout/Header.tsx`

**Features:**
- Search bar
- Notification bell with badge
- User profile section
- Mobile menu toggle

---

## State Management

### App Store (Zustand)

**Location:** `src/store/appStore.ts`

**Usage:**
```tsx
import { useAppStore } from '../store/appStore';

function MyComponent() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();

  return (
    <button onClick={toggleSidebar}>
      Toggle Sidebar
    </button>
  );
}
```

**Available State:**
- `sidebarOpen`: boolean
- `toggleSidebar`: () => void
- `setSidebarOpen`: (open: boolean) => void

---

## Utility Functions

### Helper Functions

**Location:** `src/utils/helpers.ts`

**cn() - Class Name Merger**
```tsx
import { cn } from '../utils/helpers';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)}>
  Content
</div>
```

**formatCurrency()**
```tsx
import { formatCurrency } from '../utils/helpers';

const price = formatCurrency(5000); // ₹5,000.00
```

**formatDate()**
```tsx
import { formatDate } from '../utils/helpers';

const date = formatDate('2024-03-12'); // 12 Mar, 2024
```

**getInitials()**
```tsx
import { getInitials } from '../utils/helpers';

const initials = getInitials('John Doe'); // JD
```

---

## API Services

### Using API Services

**Location:** `src/services/api.ts`

**Example:**
```tsx
import { studentApi } from '../services/api';
import { useQuery, useMutation } from '@tanstack/react-query';

function Students() {
  // Fetch students
  const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentApi.getAll(),
  });

  // Create student
  const createMutation = useMutation({
    mutationFn: (data) => studentApi.create(data),
    onSuccess: () => {
      // Refetch or update cache
    },
  });

  const handleSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    // Your component JSX
  );
}
```

**Available APIs:**
- `studentApi`: getAll, getById, create, update, delete
- `teacherApi`: getAll, getById, create, update, delete
- `batchApi`: getAll, getById, create, update, delete
- `attendanceApi`: getAll, markAttendance, getByBatch
- `feeApi`: getAll, collectFee, getPending
- `dashboardApi`: getStats, getRecentActivity

---

## TypeScript Types

**Location:** `src/types/index.ts`

**Available Types:**
- `Student`
- `Teacher`
- `Batch`
- `Attendance`
- `Fee`
- `Payment`
- `Announcement`
- `DashboardStats`

**Usage:**
```tsx
import { Student } from '../types';

const student: Student = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
};
```

---

## Best Practices

### Component Structure
```tsx
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function MyComponent() {
  const [state, setState] = useState();

  const handleAction = () => {
    // Logic here
  };

  return (
    <div className="space-y-6">
      <Card>
        <Button onClick={handleAction}>Action</Button>
      </Card>
    </div>
  );
}
```

### Styling
- Use Tailwind utility classes
- Use `cn()` for conditional classes
- Follow spacing scale: space-y-4, space-y-6, gap-4, etc.
- Use consistent padding: p-4, p-6

### Forms
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  <div className="flex gap-3">
    <Button type="submit">Submit</Button>
    <Button type="button" variant="secondary">Cancel</Button>
  </div>
</form>
```

---

## Common Patterns

### Loading State
```tsx
if (isLoading) {
  return <div>Loading...</div>;
}
```

### Empty State
```tsx
{data.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500">No data found</p>
  </div>
)}
```

### Error State
```tsx
{error && (
  <div className="bg-red-50 text-red-600 p-4 rounded-lg">
    {error.message}
  </div>
)}
```

---

## Icons

**Using Lucide Icons:**
```tsx
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';

<Plus className="w-4 h-4" />
<Edit className="w-5 h-5 text-gray-600" />
```

**Common Icons:**
- Plus, Edit, Trash2, Eye, Search
- Users, GraduationCap, BookOpen
- ClipboardCheck, DollarSign, Calendar
- Bell, Settings, Menu, X

---

This documentation covers all the main components and patterns used in the Tuition Management System. Refer to individual component files for implementation details.
