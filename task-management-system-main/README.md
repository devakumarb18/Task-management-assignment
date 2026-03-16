# Task Management System

A full-stack task management application built with **Node.js**, **TypeScript**, **Next.js**, and **Prisma**.

## 🚀 Features

- ✅ **User Authentication** (JWT-based)
- ✅ **Task CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Search & Filter** tasks by status
- ✅ **Modern UI** with glassmorphism design
- ✅ **Responsive** design for mobile and desktop
- ✅ **Type-safe** with TypeScript throughout

## 📦 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (easily switchable to PostgreSQL)
- JWT for authentication
- Zod for validation
- Bcrypt for password hashing

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- Lucide React (icons)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs on **http://localhost:3000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3001**

## 📖 API Documentation

### Authentication

**Register**
```
POST /auth/register
Body: { "email": "user@example.com", "password": "password123" }
```

**Login**
```
POST /auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "accessToken": "...", "refreshToken": "..." }
```

### Tasks (Protected Routes)

**Get All Tasks**
```
GET /tasks?status=OPEN&search=query
Headers: { "Authorization": "Bearer <token>" }
```

**Create Task**
```
POST /tasks
Headers: { "Authorization": "Bearer <token>" }
Body: { "title": "Task Title", "description": "Optional description" }
```

**Update Task**
```
PATCH /tasks/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { "title": "New Title", "status": "DONE" }
```

**Delete Task**
```
DELETE /tasks/:id
Headers: { "Authorization": "Bearer <token>" }
```

## 🎨 UI Features

- **Glassmorphism Design**: Modern backdrop-blur effects
- **Gradient Backgrounds**: Vibrant color schemes
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first approach
- **Dark Theme**: Easy on the eyes

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret"
PORT=3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

1. Start both backend and frontend servers
2. Navigate to http://localhost:3001
3. Register a new account
4. Create, edit, and manage tasks
5. Test search and filter functionality

## 📂 Project Structure

```
TASK/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── login/
    │   ├── register/
    │   ├── dashboard/
    │   └── layout.tsx
    ├── contexts/
    ├── lib/
    └── package.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation with Zod
- CORS and Helmet middleware

## 🚧 Known Issues

- `ts-node` resolution on Windows: Fixed by using `npx ts-node` in npm scripts

## 📄 License

MIT

## 👤 Author

Built as part of a Full-Stack Engineer assessment.
