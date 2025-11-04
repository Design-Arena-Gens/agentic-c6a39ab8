# EduPortal - Complete Education Platform

A comprehensive education platform with web application, mobile apps (iOS & Android), REST APIs, and AI-powered quiz generation.

## 🚀 Live Demo

**Web Application:** https://agentic-c6a39ab8.vercel.app

### Demo Credentials

- **Admin:** admin@demo.com / admin123
- **Student:** student@demo.com / student123
- **Tutor:** tutor@demo.com / tutor123
- **Support:** support@demo.com / support123

## ✨ Features

### Student Portal
- Browse and enroll in courses
- Track learning progress with analytics
- Take AI-powered quizzes after each lesson
- View course content (videos, lessons, sections)
- Rate and review courses
- Dashboard with personalized statistics

### Tutor Portal
- Create and manage courses
- Add sections and lessons to courses
- Generate AI-powered quizzes automatically
- Track student enrollments and revenue
- Publish/unpublish courses
- View course analytics

### Admin Portal
- System-wide analytics dashboard
- User management (Students, Tutors, Support)
- Course moderation
- **AI Configuration Panel** - Configure AI models for quiz generation
  - Support for OpenAI, Anthropic, and Google AI
  - Customizable temperature and token limits
  - Switch between different AI models
- Revenue tracking
- Support ticket overview

### Support Portal
- View and manage support tickets
- Real-time messaging with users
- Ticket status management (Open, In Progress, Resolved, Closed)
- Priority levels (Low, Medium, High, Urgent)
- Ticket filtering and search

### AI-Powered Features
- **Automatic Quiz Generation:** AI generates quiz questions based on lesson content
- **Configurable AI Models:** Admins can choose between:
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude)
  - Google (Gemini)
- **Customizable Parameters:** Temperature, max tokens, model selection

## 🏗️ Architecture

### Technology Stack

**Frontend (Web):**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Zustand (State management)
- Axios (HTTP client)

**Mobile Apps:**
- React Native (Expo)
- React Navigation
- TypeScript
- iOS & Android support

**Backend:**
- Next.js API Routes (REST API)
- JWT Authentication
- bcryptjs for password hashing

**Database:**
- SQLite (Development)
- Prisma ORM
- Full relational schema

**AI Integration:**
- OpenAI API
- Anthropic API
- Google AI API
- Configurable from admin panel

## 📁 Project Structure

```
eduportal/
├── app/                      # Next.js app directory
│   ├── api/                  # REST API endpoints
│   │   ├── auth/            # Authentication
│   │   ├── courses/         # Course management
│   │   ├── enrollments/     # Course enrollments
│   │   ├── lessons/         # Lesson management
│   │   ├── quizzes/         # Quiz management
│   │   ├── support/         # Support tickets
│   │   └── admin/           # Admin endpoints
│   ├── student/             # Student portal pages
│   ├── tutor/               # Tutor portal pages
│   ├── admin/               # Admin portal pages
│   ├── support/             # Support portal pages
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── page.tsx             # Landing page
├── components/              # Reusable React components
├── lib/                     # Utility libraries
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Authentication utilities
│   └── ai.ts               # AI integration
├── prisma/                  # Database schema & migrations
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data script
│   └── migrations/         # Database migrations
├── mobile-app-src/          # React Native mobile app
│   ├── screens/            # Mobile app screens
│   ├── App.tsx             # Mobile app entry point
│   └── package.json        # Mobile dependencies
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Core Models

- **User:** Students, Tutors, Admins, Support staff
- **Course:** Course information and metadata
- **Section:** Course sections/modules
- **Lesson:** Individual lessons with content and videos
- **Quiz:** Quizzes linked to lessons
- **Question:** Quiz questions with multiple choice answers
- **QuizAttempt:** Student quiz attempts and scores
- **Enrollment:** Student course enrollments
- **Progress:** Lesson completion tracking
- **Review:** Course ratings and reviews
- **SupportTicket:** Support ticket system
- **Message:** Support ticket messages
- **AIConfig:** AI model configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eduportal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev --name init
   npx tsx prisma/seed.ts
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Navigate to http://localhost:3000

### Configure AI (Optional)

1. Log in as admin (admin@demo.com / admin123)
2. Go to Admin Portal
3. Click "AI Configuration"
4. Add your AI API keys (OpenAI, Anthropic, or Google)
5. Set one configuration as active

## 📱 Mobile App Setup

### Prerequisites
- Node.js 18+
- Expo CLI

### Installation

1. **Navigate to mobile app directory**
   ```bash
   cd mobile-app-src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API URL**
   Edit the `API_URL` in screen files to point to your backend:
   ```typescript
   const API_URL = 'https://agentic-c6a39ab8.vercel.app';
   ```

4. **Run the app**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web (for testing)
   npm run web
   ```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🔌 API Documentation

### Authentication

**POST /api/auth/register**
- Register new user
- Body: `{ email, password, name, role }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ user, token }`

### Courses

**GET /api/courses**
- Get all published courses
- Query params: `category`, `level`, `instructorId`

**POST /api/courses**
- Create course (Tutor/Admin only)
- Body: `{ title, description, category, level, price }`

**GET /api/courses/:id**
- Get course details with sections and lessons

**PUT /api/courses/:id**
- Update course (Owner/Admin only)

**DELETE /api/courses/:id**
- Delete course (Owner/Admin only)

**POST /api/courses/:id/enroll**
- Enroll in course (Student only)

### Enrollments

**GET /api/enrollments**
- Get user's enrollments with progress

### Quizzes

**POST /api/lessons/:id/quiz/generate**
- Generate AI-powered quiz (Tutor/Admin only)

**GET /api/quizzes/:id**
- Get quiz with questions

**POST /api/quizzes/:id/submit**
- Submit quiz answers
- Body: `{ answers: { questionId: answer } }`

### Support

**GET /api/support/tickets**
- Get tickets (own tickets or all if Support/Admin)

**POST /api/support/tickets**
- Create support ticket
- Body: `{ subject, description, priority }`

**GET /api/support/tickets/:id**
- Get ticket details with messages

**PUT /api/support/tickets/:id**
- Update ticket status (Support/Admin only)

**POST /api/support/tickets/:id/messages**
- Add message to ticket

### Admin

**GET /api/admin/stats**
- Get platform statistics (Admin only)

**GET /api/admin/ai-config**
- Get AI configurations (Admin only)

**POST /api/admin/ai-config**
- Create AI configuration (Admin only)
- Body: `{ provider, model, apiKey, temperature, maxTokens, active }`

**PUT /api/admin/ai-config/:id**
- Update AI configuration (Admin only)

**DELETE /api/admin/ai-config/:id**
- Delete AI configuration (Admin only)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration

## 🎨 Design Features

- Responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS
- Gradient backgrounds
- Card-based layouts
- Interactive components
- Loading states
- Error handling
- Toast notifications
- Modal dialogs

## 📊 Analytics & Tracking

- Course enrollment tracking
- Student progress monitoring
- Quiz performance analytics
- Revenue tracking
- Support ticket metrics
- User activity statistics

## 🚢 Deployment

### Vercel (Web App)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel deploy --prod
   ```

### Database

For production, consider using:
- PostgreSQL (Vercel Postgres, Supabase)
- MySQL (PlanetScale)
- Update `DATABASE_URL` in environment variables

### Environment Variables

Set these in your deployment platform:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL` - API base URL (for mobile apps)

## 🌟 Key Highlights

1. **Full-Stack Solution:** Web, mobile, APIs, and database
2. **AI-Powered:** Automatic quiz generation using OpenAI, Anthropic, or Google AI
3. **Multi-Portal:** Separate interfaces for Students, Tutors, Admins, and Support
4. **Production Ready:** Deployed on Vercel with live demo
5. **Modern Tech Stack:** Next.js 14, React Native, Prisma, TypeScript
6. **Comprehensive Features:** Courses, quizzes, progress tracking, support system
7. **Scalable Architecture:** Clean code structure, modular components
8. **Security First:** JWT auth, role-based access, password hashing

---

Built with ❤️ using Next.js, React Native, and AI
