# 🚀 Dynamic Portfolio Application

**Tech:** Next.js 14, TypeScript, Tailwind CSS, MongoDB, Prisma
**Dev & Deployment:** Docker (optional), Vercel, Environment-based configuration

A production-ready portfolio application built to showcase projects, experience, and real-world engineering practices. Designed with scalability, maintainability, and deployment workflows in mind.

🔗 **Live Demo:** [https://nagarjun-avala.vercel.app](https://nagarjun-avala.vercel.app)

---

## ✨ What This Project Demonstrates

- Modern **Next.js App Router** architecture
- Component-driven UI using **Tailwind CSS** and **ShadCN/UI**
- Type-safe forms and validation with **React Hook Form** and **Zod**
- Secure **admin authentication** using JWT and bcrypt
- Database modeling and access with **Prisma + MongoDB**
- Environment-based configuration for development and production
- Real-world deployment experience (build → deploy → maintain)

---

## 🧱 Core Features

- Dynamic portfolio content (skills, projects, experience, blog)
- Admin dashboard for content management
- Visitor analytics with basic geographic insights
- Secure contact form with validation and spam protection
- Fully responsive UI with smooth animations (Framer Motion)

---

## 🛠️ Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- ShadCN/UI

### Backend & Data

- MongoDB
- Prisma ORM
- JWT authentication
- bcrypt password hashing

### Dev & Deployment

- Git & GitHub
- Environment variables (`.env`)
- Vercel deployment
- Docker (optional, for consistent local builds)
- GitHub Actions (CI/CD)

---

## 🔁 CI/CD Pipeline

This project uses **GitHub Actions** to run a Continuous Integration (CI) pipeline on every push and pull request.

### CI Workflow Includes

- Dependency installation
- Lint checks to enforce code quality
- Production build validation

This ensures that the application remains stable and deployable as new changes are introduced.

---

## ⚙️ Local Setup

```bash
git clone https://github.com/nagarjun-avala/nagarjun_avala.git
cd nagarjun_avala
npm install
npm run dev
```

Create a `.env.local` file:

```env
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_secret
```

---

## 📁 Project Structure

```
app/        → Pages and layouts (Next.js App Router)
components/ → Reusable UI components
lib/        → Database and utility logic
prisma/     → Database schema
scripts/    → Setup and admin utilities
```

---

## 🎯 Why This Project Matters

This project goes beyond a static portfolio. It demonstrates how I approach real applications:

- clean and maintainable architecture
- secure data handling and authentication
- scalable UI components
- production-ready deployment mindset

---

## 📫 Contact

- 🌐 Portfolio: [https://nagarjun-avala.vercel.app](https://nagarjun-avala.vercel.app)
- 💼 LinkedIn: [https://www.linkedin.com/in/nagarjun-avala/](https://www.linkedin.com/in/nagarjun-avala/)
- 📧 Email: [nagarjun.avala.official@gmail.com](mailto:nagarjun.avala.official@gmail.com)

---

## 📝 License

MIT
