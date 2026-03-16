# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Two terminal windows

---

## Step 1: Start Backend

Open **Terminal 1** and run:

```bash
cd backend
npm run dev
```

✅ You should see: `Server running on port 3000`

**If you see errors:**
- Make sure you're in the `backend` directory
- Dependencies are already installed ✓
- Database is already set up ✓

---

## Step 2: Start Frontend

Open **Terminal 2** and run:

```bash
cd frontend
npm run dev
```

✅ You should see: `Ready on http://localhost:3001`

---

## Step 3: Use the App

1. **Open browser**: http://localhost:3001
2. **Register**: Create a new account
3. **Dashboard**: You'll be redirected automatically
4. **Create tasks**: Click "New Task" button
5. **Manage tasks**: 
   - Click circle icon to toggle status
   - Click edit icon to modify
   - Click trash icon to delete
   - Use search bar to find tasks
   - Use dropdown to filter by status

---

## 🎯 Test Credentials

You can create any account you want:
- Email: `test@example.com`
- Password: `password123` (minimum 6 characters)

---

## 🔧 Troubleshooting

**Backend won't start?**
- Check if port 3000 is already in use
- Run `npm install` again in backend folder

**Frontend won't start?**
- Check if port 3001 is already in use
- Run `npm install` again in frontend folder

**Can't login?**
- Make sure backend is running first
- Check browser console for errors

---

## 📝 API Endpoints

Backend is running on `http://localhost:3000`

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /tasks` - Get all tasks (requires auth)
- `POST /tasks` - Create task (requires auth)
- `PATCH /tasks/:id` - Update task (requires auth)
- `DELETE /tasks/:id` - Delete task (requires auth)

---

## ✨ Features to Try

1. **Create multiple tasks** with different titles
2. **Toggle status** by clicking the circle icon
3. **Search** for specific tasks
4. **Filter** by Open/Done status
5. **Edit** task details
6. **Delete** completed tasks
7. **Logout** and login again

---

Enjoy managing your tasks! 🎉
