# Job Application Tracker

A modern, full-stack application designed to streamline job search workflows. Track applications, manage interview schedules, store resume variations, and leverage AI insights to land your target roles.

---

## 🌟 Overview

The **Job Application Tracker** provides job seekers with a centralized hub for organizing their job search lifecycle. From initial application submission to offer negotiation, the system helps monitor progress, track deadlines, analyze application conversion rates, and organize recruiter communications.

---

## 📁 Repository Structure

```
job-application-tracker/
├── backend/            # NestJS API backend (TypeScript, Node.js)
├── frontend/           # React 19 + Vite frontend web application
└── docs/               # System architecture & product documentation
    ├── SRS.md                  # System Requirements Specification
    ├── SYSTEM_DESIGN.md        # Architecture & Design Overview
    ├── DATABASE_DESIGN.md      # Database Schema & Data Models
    ├── API_SPECIFICATION.md    # REST & WebSocket API Specs
    └── DEVELOPMENT_PLAN.md    # Milestones & Roadmap
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS 11](https://nestjs.com/) (Node.js & TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest & Supertest

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Modern CSS with CSS variables, Glassmorphism design tokens & responsive layouts
- **Linting & Code Style**: ESLint 10

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/job-application-tracker.git
   cd job-application-tracker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   The backend API server will run at `http://localhost:3000`.

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.

---

## 📚 Documentation Index

Comprehensive documentation for the architecture and implementation details is available in the [`docs/`](./docs) folder:

- 📄 [Software Requirements Specification (SRS)](./docs/SRS.md)
- 🏗️ [System Design & Architecture](./docs/SYSTEM_DESIGN.md)
- 🗄️ [Database Design & Data Models](./docs/DATABASE_DESIGN.md)
- 🔌 [API Specification](./docs/API_SPECIFICATION.md)
- 🗓️ [Development Plan & Roadmap](./docs/DEVELOPMENT_PLAN.md)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
