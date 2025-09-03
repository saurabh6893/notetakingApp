# 🚀 MERN Task Manager

A full-stack task management application built with modern web technologies, featuring smooth animations, user authentication, and real-time task operations.

## 📋 Live Demo

- **Frontend**: [https://saurabhsnotetakingapp.netlify.app](https://saurabhsnotetakingapp.netlify.app)
- **Backend API**: [https://notetakingapp-l5tp.onrender.com](https://notetakingapp-l5tp.onrender.com)

## ✨ Features

### 🔐 Authentication System

- **User Registration** with secure password hashing (bcrypt)
- **JWT-based Login** with 7-day token expiration
- **Protected Routes** - Tasks accessible only to authenticated users
- **Automatic Logout** functionality
- **LocalStorage Token Persistence** for seamless user experience

### 📝 Task Management

- **Create Tasks** with real-time API integration
- **Edit Tasks** with inline editing interface
- **Delete Tasks** with confirmation
- **Toggle Completion** status with PATCH requests
- **User Isolation** - Users see only their own tasks
- **Persistent Storage** with MongoDB Atlas

### 🎨 UI/UX Features

- **Smooth GSAP Animations**
  - Button hover effects with scale transitions
  - Page transition animations (fade + slide)
  - Staggered task list entry animations
  - Interactive card hover effects
- **Responsive Design** with Tailwind CSS v4
- **Modern Interface** with clean, professional styling
- **Loading States** and error handling
- **Single Page Application** with client-side routing

### 🏗️ Technical Architecture

- **TypeScript** throughout entire stack for type safety
- **Monorepo Structure** with separate client/server folders
- **Production Deployment** on Render.com (backend) and Netlify (frontend)
- **Environment-based Configuration** for different deployment stages

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** with modern hooks and context
- **TypeScript 5.8.3** for type safety
- **Vite 7.1.2** for fast development and builds
- **React Router 7.8.2** for client-side routing
- **GSAP 3.13.0** for smooth animations
- **Tailwind CSS 4.1.12** for utility-first styling

### Backend

- **Node.js** with Express 5.1.0 framework
- **TypeScript** for type-safe server development
- **MongoDB Atlas** with Mongoose 8.18.0 ODM
- **JWT Authentication** with jsonwebtoken 9.0.2
- **bcrypt 6.0.0** for password hashing
- **CORS** configured for secure cross-origin requests

### DevOps & Tools

- **ESLint** with TypeScript integration
- **Prettier** for consistent code formatting
- **Git** with conventional commit messages
- **Environment Variables** for configuration management

## 📁 Project Structure

```
notetakingApp/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── Components/       # Reusable React components
│   │   │   ├── AnimatedButton.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   └── TaskInput.tsx
│   │   ├── Pages/            # Route-level components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Tasks.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/          # React Context for state management
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── TaskContext.tsx
│   │   │   └── useTasks.tsx
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── config.ts         # Environment configuration
│   │   └── App.tsx           # Main app component
│   ├── package.json
│   └── vite.config.ts
├── server/                   # Backend Node.js application
│   ├── src/
│   │   ├── models/          # MongoDB/Mongoose schemas
│   │   │   ├── task.ts
│   │   │   └── user.ts
│   │   ├── routes/          # Express route handlers
│   │   │   ├── auth.ts
│   │   │   └── tasks.ts
│   │   ├── middleware/      # Custom middleware
│   │   │   └── auth.ts
│   │   ├── db.ts           # Database connection
│   │   └── index.ts        # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── netlify.toml             # Netlify deployment config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/saurabh6893/notetakingApp.git
cd notetakingApp
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
PORT=4000
```

Start development server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:

```env
VITE_API_BASE=http://localhost:4000
```

Start development server:

```bash
npm run dev
```

### 4. Access Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

## 🏭 Production Deployment

### Backend (Render.com)

1. Connect your GitHub repository
2. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string for JWT signing
   - `PORT`: 4000 (optional, Render sets this automatically)

### Frontend (Netlify)

1. Connect your GitHub repository
2. Configure build settings:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. Add environment variables:
   - `VITE_API_BASE`: Your deployed backend URL (e.g., `https://your-app.onrender.com`)

4. The `netlify.toml` file handles redirects for SPA routing

## 📊 API Endpoints

### Authentication

```
POST /api/auth/register   # User registration
POST /api/auth/login      # User login
```

### Tasks (Protected Routes)

```
GET    /api/tasks         # Fetch user's tasks
POST   /api/tasks         # Create new task
PUT    /api/tasks/:id     # Update task text
PATCH  /api/tasks/:id/complete  # Toggle completion status
DELETE /api/tasks/:id     # Delete task
```

## 🎯 Key Features Explained

### GSAP Animations

- **AnimatedButton**: Hover scale effects on all interactive buttons
- **PageTransition**: Smooth fade and slide-up animations for route changes
- **Task List**: Staggered animations when tasks load or update
- **Card Interactions**: Hover lift effects with dynamic shadows

### Authentication Flow

1. User registers/logs in → JWT token generated
2. Token stored in localStorage for persistence
3. Token included in all API requests via Authorization header
4. Protected routes redirect to login if no valid token
5. Automatic logout clears token and redirects

### Task Management

- **Real-time Updates**: Changes reflected immediately in UI
- **Optimistic Updates**: UI updates before server confirmation
- **Error Handling**: Graceful handling of network failures
- **User Isolation**: Each user sees only their own tasks

## 📈 Performance & Optimization

- **Vite** for fast development builds and HMR
- **TypeScript** for compile-time error detection
- **Tree Shaking** for smaller bundle sizes
- **Lazy Loading** with React code splitting
- **Optimized Images** and static assets
- **Efficient Re-renders** with React Context optimization

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: Server-side validation for all requests
- **Environment Variables**: Sensitive data never committed

## 🧪 Development Workflow

### Code Quality

- **ESLint** with TypeScript rules for code consistency
- **Prettier** for automatic code formatting
- **Strict TypeScript** configuration for type safety
- **Git Hooks** (recommended) for pre-commit checks

### Conventional Commits

```
feat(auth): add JWT middleware for protected routes
fix(ui): resolve mobile responsive issues in task cards
docs(readme): update installation instructions
refactor(context): optimize task state management
```

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Saurabh** - [GitHub](https://github.com/saurabh6893)

---

Built with ❤️ using the MERN stack + TypeScript + GSAP
