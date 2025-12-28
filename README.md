
# 🌐 Lino Studio NG — Studio Infrastructure

This is the core repository for **Lino Studio NG**, a premium portfolio built with React, TypeScript, Supabase, and Gemini AI.

## 🔐 Admin Dashboard Access

The Admin Dashboard is protected by **Supabase Authentication**.

### To Create Your Admin Login:
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** > **Users**.
3. Click **Add User** > **Create new user**.
4. Enter your preferred admin email and a strong password.

---

## ☁️ Cloud Database Setup (Supabase)

If the app shows "Table not found" warnings, run this script in your **Supabase SQL Editor**:

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

-- 5. Row Level Security
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
