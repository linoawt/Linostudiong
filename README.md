
# 🌐 Lino Studio NG — Studio Infrastructure

[![Live Demo](https://img.shields.io/badge/Live-Demo-4F46E5?style=for-the-badge)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)
[![Deployment](https://img.shields.io/badge/Status-Live_on_GitHub_Pages-3ECF8E?style=for-the-badge)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

> **Designing Visual Identity. Building Digital Experiences.**

Lino Studio NG is a premium, claymorphic portfolio built for high conversion. This repository is configured for automated deployment to **GitHub Pages**.

---

## 🚀 Quick Deployment Guide

Since you have installed the `gh-pages` package, follow these steps to sync your project to the web:

1.  **Configure URL**: Open `package.json` and replace `YOUR_USERNAME` and `YOUR_REPO_NAME` in the `homepage` field with your actual GitHub details.
2.  **Sync & Deploy**: Run the following command in your terminal:
    ```bash
    npm run deploy
    ```
3.  **Finalize**: Go to your GitHub Repository **Settings** > **Pages** and ensure the branch is set to `gh-pages`.

---

## 🛠️ Hybrid Architecture

- **Frontend (Static)**: Hosted on **GitHub Pages**. Handles the UI, Portfolio, and Gemini AI interactions.
- **Database (Cloud)**: **Supabase** handles real-time leads and site configuration.
- **Notifications (API)**: The `server.js` file is a Node.js notification engine. **Note:** GitHub Pages does not support Node.js execution. To keep the email notification system alive, host `server.js` on a platform like Render, Railway, or Vercel and update the fetch URL in `Contact.tsx`.

---

## ☁️ Database Sync (Supabase)

Initialize your studio environment by running the SQL provided in the project root within your Supabase SQL Editor. This ensures your leads and projects are synced to the cloud.

---

## 🔐 Admin Access
The **Studio Command Center** can be accessed via the dashboard button in the footer. Ensure you have added your admin credentials to the Supabase Auth section.

---
&copy; 2025 Lino Studio NG &bull; Syncing Design with Reality.
