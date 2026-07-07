# 🎓 Al-Baraa Educational Platform

![Al-Baraa Platform Banner](https://via.placeholder.com/1200x400.png?text=Al-Baraa+Educational+Platform)

> A modern, full-stack educational dashboard built with React, Vite, Tailwind CSS, Cloudflare Pages, and D1 Serverless Database.

## ✨ Features

- **Role-Based Access Control**: Distinct dashboards and permissions for **Students**, **Teachers**, and **Admins**.
- **Modern UI/UX**: Built with `shadcn/ui` and Tailwind CSS for a fully responsive, accessible, and beautiful interface.
- **Serverless Architecture**: Deployed on **Cloudflare Pages** with Cloudflare Functions acting as the API layer.
- **Serverless Database**: Data is stored securely in **Cloudflare D1** (Serverless SQLite) with **Drizzle ORM** for type-safe queries.
- **Optimistic UI & Caching**: Data fetching powered by `@tanstack/react-query` for lightning-fast state management.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **Routing** | React Router DOM (v6) |
| **State/Data** | TanStack Query (React Query) |
| **Backend/API** | Cloudflare Pages Functions |
| **Database** | Cloudflare D1 (SQLite) |
| **ORM** | Drizzle ORM |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` package manager
- Cloudflare Wrangler CLI (`npm i -g wrangler`)

### Local Development Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Database Initialization**
   Initialize the local SQLite database using the provided schema:
   ```bash
   npx wrangler d1 execute al-baraa-db --local --file=./schema.sql
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🗄️ Database Schema Structure

The platform uses a relational SQLite database schema managed via Drizzle ORM:
- **`users`**: Core authentication and role management (`student`, `teacher`, `admin`).
- **`teachers`**: Teacher profiles, bios, and specialties.
- **`students`**: Student profiles and grades.
- **`lessons`**: Educational content linked to teachers.

---

## ☁️ Deployment (Cloudflare Pages)

This application is designed to be deployed directly to Cloudflare Pages, taking advantage of edge caching and serverless API functions.

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Create production database:
   ```bash
   npx wrangler d1 create al-baraa-db
   ```
   *Update `wrangler.toml` with the generated `database_id`.*
3. Apply schema to production:
   ```bash
   npx wrangler d1 execute al-baraa-db --remote --file=./schema.sql
   ```
4. Build and Deploy:
   ```bash
   pnpm build
   npx wrangler pages deploy dist
   ```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.
