# 🚀 Supabase Database Schemas & Upload Guide for Juci Cool

This directory contains database schemas, indexes, triggers, row-level security (RLS) policies, and verified seed data ready to upload directly into **Supabase (PostgreSQL)**.

---

## 📁 Directory Structure

```text
supabase/
├── 00_FULL_SETUP.sql                 <-- ⚡ 1-Click All-in-One Setup (Recommended)
├── README.md                          <-- This guide
│
├── schemas/                           <-- Individual Table Schemas (Modular)
│   ├── 01_product_categories.sql      <-- Categories (Fruit drinks, Candy, etc.)
│   ├── 02_products.sql                <-- Products with retail/wholesale prices
│   ├── 03_product_images.sql          <-- Extra gallery pictures
│   ├── 04_users.sql                   <-- Admin, dealers, & customers
│   ├── 05_retail_orders.sql           <-- Direct customer orders
│   ├── 06_retail_order_items.sql      <-- Line items for retail orders
│   ├── 07_bulk_enquiries.sql          <-- B2B "Get Best Price" commercial tickets
│   ├── 08_bulk_enquiry_items.sql      <-- Line items for bulk enquiries
│   ├── 09_quotations.sql              <-- Wholesale dealer price quotations
│   ├── 10_quotation_items.sql         <-- Line items for quotations
│   ├── 11_wholesale_orders.sql        <-- Converted wholesale dealer orders
│   ├── 12_wholesale_order_items.sql   <-- Line items for wholesale orders
│   ├── 13_status_history.sql          <-- Lifecycle status change audit timeline
│   └── 14_audit_logs.sql              <-- Security & admin action logging
│
├── triggers_and_functions/
│   └── updated_at_triggers.sql        <-- Auto-updates 'updated_at' timestamps
│
├── security/
│   └── row_level_security.sql         <-- Supabase RLS security policies
│
└── seeds/
    ├── 01_seed_categories_and_products.sql
    ├── 02_seed_users.sql
    ├── 03_seed_orders_and_enquiries.sql
    └── all_seed_data.sql              <-- Combined seed data
```

---

## ⚡ Option 1: Quick 1-Click Setup (Recommended)

If you want your entire Supabase database created, indexed, secured with RLS, and populated with verified Juci Cool products and sample orders in **5 seconds**:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (or click **"New Project"**).
3. On the left sidebar, click the **SQL Editor** tab (the `>_` terminal icon).
4. Click **"New query"**.
5. Copy the entire contents of [`supabase/00_FULL_SETUP.sql`](./00_FULL_SETUP.sql).
6. Paste it into the query box and click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
7. You should see `Success. No rows returned`. All 14 tables, triggers, security policies, and seed data are now live!

---

## 🧩 Option 2: Step-by-Step / Modular Upload

If you prefer uploading tables and modules separately or modifying individual schemas:

### Step 2.1: Run Table Schemas in Order
Run the files in [`supabase/schemas/`](./schemas/) sequentially in the **SQL Editor**:

1. `01_product_categories.sql`
2. `02_products.sql`
3. `03_product_images.sql`
4. `04_users.sql`
5. `05_retail_orders.sql`
6. `06_retail_order_items.sql`
7. `07_bulk_enquiries.sql`
8. `08_bulk_enquiry_items.sql`
9. `09_quotations.sql`
10. `10_quotation_items.sql`
11. `11_wholesale_orders.sql`
12. `12_wholesale_order_items.sql`
13. `13_status_history.sql`
14. `14_audit_logs.sql`

### Step 2.2: Add Triggers
Run [`supabase/triggers_and_functions/updated_at_triggers.sql`](./triggers_and_functions/updated_at_triggers.sql). This automatically maintains timestamps on `updated_at` columns whenever orders or enquiries are modified.

### Step 2.3: Configure Row Level Security (RLS)
Run [`supabase/security/row_level_security.sql`](./security/row_level_security.sql). This configures:
- Public read access for active products and categories.
- Public insert access for new retail orders and bulk enquiries.
- Protected access for quotations, wholesale orders, and admin functions.

### Step 2.4: Seed Initial Data
Run [`supabase/seeds/all_seed_data.sql`](./seeds/all_seed_data.sql) (or run the files in `seeds/` individually).

---

## 🔑 Seed User Accounts & Passwords

The seed scripts create verified test accounts pre-hashed with bcrypt:

| Role | Email / Identifier | Password | Type |
|---|---|---|---|
| **Admin** | `jucicooladmin` | `juci@cool123` | Manufacturer |
| **Admin** | `admin@jucicool.com` | `juci@cool123` | Manufacturer |
| **Dealer** | `dealer@jucicool.com` | `dealer123` | Retailer |
| **Customer** | `customer@jucicool.com` | `password123` | Individual |

---

## 🔌 Connecting to Supabase from the Frontend

1. Go to **Supabase Dashboard** -> **Project Settings** -> **API**.
2. Copy the **Project URL** and the **`anon` public key**.
3. Create or update your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Use the pre-configured client in [`src/lib/supabaseClient.ts`](../src/lib/supabaseClient.ts):
   ```ts
   import { supabase } from '@/lib/supabaseClient';

   // Example: Fetch active products
   const { data: products, error } = await supabase
     .from('products')
     .select('*, product_categories(name, slug)')
     .eq('is_active', 1);
   ```
