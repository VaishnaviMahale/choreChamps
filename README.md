# Bachelor's Flat Life Manager

A comprehensive MERN stack web application designed to help flatmates manage their shared living space efficiently. Track tasks, groceries, expenses, meal planning, and calendar events all in one place.

## 🚀 Tech Stack

**Frontend:**
- React 18 with Vite
- Material-UI (MUI) v6+
- React Router v6
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas (Free Tier)

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### 📊 Dashboard
- Overview of all modules
- Quick stats and metrics
- Recent tasks display

### ✅ Tasks Module
- Create, read, update, and delete tasks
- Assign tasks to flatmates
- Set due dates
- Track status (pending, in-progress, completed)

### 🛒 Groceries Module
- Manage grocery lists
- Mark items as needed or purchased
- Track who added each item

### 💰 Expenses Module
- Record shared expenses
- Automatic expense splitting
- Balance summary showing who owes whom
- Track payment history

### 🍽️ Meals Planner
- Weekly meal planning
- Assign cooking duties
- Organize by day and meal type (breakfast, lunch, dinner)

### 📅 Calendar
- Shared calendar for flatmates
- Add events and reminders
- View upcoming and past events

### 🎨 UI Features
- Dark mode toggle
- Responsive sidebar layout
- Mobile-friendly design
- Modern Material-UI components

## 📁 Project Structure

```
flatlife-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGO_URI=mongodb://localhost:27017/flatlife
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## ☁️ Deployment Guide

### 1. MongoDB Atlas Setup (Free Tier)

1. **Create an Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Select "Free" tier (M0)
   - Choose your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Grant "Read and write to any database" permission

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is necessary for Render to connect
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `flatlife`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flatlife?retryWrites=true&w=majority
```

### 2. Backend Deployment on Render

1. **Prepare the Backend**
   - Ensure your `server/package.json` has the start script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Create a Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

3. **Create a New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `flatlife-backend` (or your choice)
     - **Region**: Choose closest to you
     - **Branch**: `main` (or your default branch)
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Add Environment Variables**
   - Scroll to "Environment Variables"
   - Add the following:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flatlife?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
   - Note: You'll update `CORS_ORIGIN` after deploying the frontend

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Copy your backend URL (e.g., `https://flatlife-backend.onrender.com`)

### 3. Frontend Deployment on Vercel

1. **Prepare the Frontend**
   - Ensure your `client/package.json` has the build script:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```

2. **Create a Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New..."
   - Select "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework

4. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
   ```
   VITE_API_URL=https://flatlife-backend.onrender.com
   ```
   - Use your actual Render backend URL

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://flatlife.vercel.app`)

7. **Update Backend CORS**
   - Go back to Render
   - Update the `CORS_ORIGIN` environment variable with your Vercel URL
   - Trigger a redeploy

### 4. Post-Deployment Steps

1. **Test the Application**
   - Visit your Vercel URL
   - Register a new user
   - Test all features

2. **Create Multiple Users**
   - Register 2-3 users to test task assignment and expense splitting

3. **Monitor**
   - Check Render logs for any backend errors
   - Check Vercel deployment logs for frontend issues

## 🔧 Environment Variables Reference

### Backend (.env)
```env
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<strong random string>
PORT=5000
CORS_ORIGIN=<frontend URL>
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=<backend URL>
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (protected)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Groceries
- `GET /api/groceries` - Get all groceries
- `GET /api/groceries/:id` - Get single grocery
- `POST /api/groceries` - Create grocery item
- `PUT /api/groceries/:id` - Update grocery item
- `DELETE /api/groceries/:id` - Delete grocery item

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get single expense
- `GET /api/expenses/summary` - Get balance summary
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Meals
- `GET /api/meals` - Get all meals (can filter by week)
- `GET /api/meals/:id` - Get single meal
- `POST /api/meals` - Create meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Calendar
- `GET /api/calendar` - Get all events
- `GET /api/calendar/:id` - Get single event
- `POST /api/calendar` - Create event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variable protection
- Token expiration (30 days)

## 🎨 UI Components

- **Material-UI Components**: Cards, Tables, Dialogs, Forms
- **Responsive Sidebar**: Collapsible on mobile
- **Dark Mode**: Toggle between light and dark themes
- **Color-coded Status**: Visual indicators for task and grocery status
- **Responsive Tables**: Mobile-friendly data display

## 🐛 Troubleshooting

### Backend Issues

**Cannot connect to MongoDB:**
- Verify your connection string
- Check that IP address 0.0.0.0/0 is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

**CORS errors:**
- Verify `CORS_ORIGIN` environment variable matches your frontend URL
- Check that frontend is using correct backend URL

**JWT errors:**
- Ensure `JWT_SECRET` is set
- Check that token is being sent in Authorization header

### Frontend Issues

**API calls failing:**
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Verify backend is running

**Build fails on Vercel:**
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check Vercel build logs

### Common Deployment Issues

**Render free tier sleeps:**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds

**Environment variables not updating:**
- Trigger a manual redeploy after changing environment variables

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your needs!

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using the MERN stack

