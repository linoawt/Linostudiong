
# 🌐 Lino Studio NG — Studio Infrastructure

[![Live Demo](https://img.shields.io/badge/Live-Demo-4F46E5?style=for-the-badge)](https://linostudiong.vercel.app)
[![Deployment](https://img.shields.io/badge/Status-Live_on_Vercel-3ECF8E?style=for-the-badge)](https://linostudiong.vercel.app)

> **Designing Visual Identity. Building Digital Experiences.**

Lino Studio NG is a premium, claymorphic portfolio built for high conversion. This repository is optimized for deployment on **Vercel**.

---

## 🚀 Deployment Guide (Vercel)

To host your studio at `linostudiong.vercel.app`:

1.  **Push to GitHub**:
    Ensure all files (`index.html`, `index.tsx`, etc.) are in the root directory and pushed to your `main` branch.
2.  **Vercel Configuration**:
    - Log in to [Vercel](https://vercel.com).
    - Import your GitHub repository `Linostudiong`.
    - Vercel will automatically detect the static project.
    - Ensure your environment variables (like `API_KEY` for Gemini) are set in the Vercel Dashboard if required.
3.  **Final Step**: Vercel will build and deploy your site. It will be live at: [https://linostudiong.vercel.app](https://linostudiong.vercel.app).

---

## 🛠️ Hybrid Architecture

- **Frontend**: Hosted on **Vercel**. Handles the UI, Portfolio, and Gemini AI.
- **Database**: **Supabase** handles real-time leads and site configuration.
- **Notifications**: Form submissions fallback to WhatsApp/Supabase automatically. To enable email notifications via `server.js`, you may need to convert the server logic into Vercel Serverless Functions in the `/api` directory.

---

## 🔐 Admin Access
The **Studio Command Center** can be accessed via the dashboard button in the footer. Ensure you have added your admin credentials to the Supabase Auth section.

---
&copy; 2025 Lino Studio NG &bull; Syncing Design with Reality.
