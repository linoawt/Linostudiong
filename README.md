
# 🌐 Lino Studio NG — Studio Infrastructure

[![Live Demo](https://img.shields.io/badge/Live-Demo-4F46E5?style=for-the-badge)](https://linostudiong.vercel.app)
[![Deployment](https://img.shields.io/badge/Status-Live_on_Vercel-3ECF8E?style=for-the-badge)](https://linostudiong.vercel.app)

> **Designing Visual Identity. Building Digital Experiences.**

Lino Studio NG is a premium, claymorphic portfolio built for high conversion. This repository is optimized for deployment on **Vercel**.

---

## 🚀 Deployment Guide (Vercel)

1.  **Push to GitHub**:
    Ensure all files (`index.html`, `index.tsx`, etc.) are in the root directory and pushed to your `main` branch.
2.  **Vercel Configuration**:
    - Log in to [Vercel](https://vercel.com).
    - Import your GitHub repository.
    - Vercel will detect Vite and build automatically.
3.  **Environment Variables**:
    - Add `API_KEY` in Vercel Dashboard for Gemini AI features.

---

## 🛠️ Hybrid Architecture

- **Frontend**: Hosted on **Vercel**. React + Vite + Tailwind CSS.
- **Database**: **Supabase** handles real-time leads, portfolio items, and settings.
- **AI Integration**: **Gemini-3 Flash** auto-summarizes project inquiries.

---

## 🔐 Admin Dashboard Access

The Studio Command Center is now separated from the main portfolio for security and performance.

**URL**: `https://linostudiong.vercel.app/admin`

### Instructions:
1. Navigate to the `/admin` path.
2. Log in with your Supabase administrator credentials.
3. Manage Portfolio items, track leads, and monitor system health.

---
&copy; 2025 Lino Studio NG & bull; Syncing Design with Reality.
