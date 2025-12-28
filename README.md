
# 🌐 Lino Studio NG — Studio Infrastructure

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub_Pages-4F46E5?style=for-the-badge&logo=github)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)
[![Database](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI](https://img.shields.io/badge/AI-Gemini_3-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

> **Designing Visual Identity. Building Digital Experiences.**

Lino Studio NG is a premium, claymorphic portfolio built for high conversion. It leverages a modern tech stack to provide real-time lead generation and a sophisticated administrative suite.

---

## 🚀 Live Deployment
**View the live site here:** [https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

*Note: Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19 (ES6 Modules), TypeScript, Tailwind CSS.
- **UI Style:** Claymorphism (Soft shadows, rounded glassmorphism).
- **Database:** Supabase (Real-time leads & site configuration).
- **AI Engine:** Google Gemini 3 Flash (Automated lead summarization).
- **Hosting:** 
    - **Frontend:** GitHub Pages (Static).
    - **Notifications:** Node.js / Express (Heroku/Render/Vercel).

---

## 📦 Deployment to GitHub Pages

This project is optimized for GitHub Pages. Follow these steps:

1. **Environment Variables:** 
   Ensure your `process.env.API_KEY` (Gemini) is handled. If deploying purely as a static site, consider using a build tool like Vite or injecting variables via GitHub Actions.
   
2. **GitHub Actions Workflow:**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: . # The folder the action should deploy.
             branch: gh-pages
   ```

3. **Settings:**
   - Go to your Repository **Settings** > **Pages**.
   - Set **Source** to "Deploy from a branch".
   - Select `gh-pages` (after the action runs) or `main`.

---

## ☁️ Cloud Database Setup (Supabase)

Run this script in your **Supabase SQL Editor** to initialize the studio engine:

```sql
-- 1. Infrastructure Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Inquiry Management (Leads)
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'HIRE_ME',
    budget TEXT,
    message TEXT,
    reference_code TEXT UNIQUE,
    email_formatted TEXT
);

-- 3. Projects Management (Portfolio)
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    thumbnail TEXT,
    description TEXT,
    project_url TEXT
);

-- 4. Core Site Settings
CREATE TABLE public.settings (
    id SERIAL PRIMARY KEY,
    site_name TEXT DEFAULT 'Lino Studio NG',
    tagline TEXT,
    hero_headline TEXT,
    hero_subtext TEXT,
    theme TEXT DEFAULT 'light',
    seo JSONB,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    instagram_url TEXT DEFAULT '#',
    linkedin_url TEXT DEFAULT '#',
    coupon_prefix TEXT DEFAULT 'LINO-',
    skills JSONB,
    faqs JSONB,
    plans JSONB
);

-- Initialize Default Settings
INSERT INTO public.settings (id, site_name, tagline) 
VALUES (1, 'Lino Studio NG', 'Designing Identity. Building Reality.');

-- 5. Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow admin all access" ON public.leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin all access projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin update settings" ON public.settings FOR UPDATE TO authenticated USING (true);
```

---

## 🔐 Admin Access
The Studio Command Center is available at the footer of the site. Access requires an account created in your **Supabase Auth** dashboard.

---
&copy; 2025 Lino Studio NG. All rights reserved.
