import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// --- Supabase Client ----------------------------------------------------------
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "juci-cool-super-secret-jwt-key-2026";

// --- CORS Helper -------------------------------------------------------------
function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// --- Auth Helper -------------------------------------------------------------
function verifyToken(req: VercelRequest) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    return jwt.verify(auth.split(" ")[1], JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return null;
  }
}

// --- Main Handler -------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url = "/" } = req;
  // Strip /api prefix
  const path = url.replace(/^\/api/, "").split("?")[0];

  try {
    // -- Products -------------------------------------------------------------
    if (path === "/products" && req.method === "GET") {
      const { category, search, featured } = req.query as Record<string, string>;
      let query = supabase
        .from("products")
        .select(`*, product_categories(name, slug, emoji)`)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (category && category !== "all") {
        const { data: cat } = await supabase
          .from("product_categories")
          .select("id")
          .eq("slug", category)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      if (featured === "true") {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ error: error.message });

      const products = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        mrp: p.mrp ? parseFloat(p.mrp) : null,
        imageUrl: p.image_url,
        unit: p.unit,
        packSize: p.pack_size,
        categoryId: p.category_id,
        categoryName: p.product_categories?.name || "",
        categorySlug: p.product_categories?.slug || "",
        categoryEmoji: p.product_categories?.emoji || "??",
        isActive: p.is_active,
        isFeatured: p.is_featured,
        stockQuantity: p.stock_quantity,
        sku: p.sku,
      }));

      return res.status(200).json(products);
    }

    // -- Single Product --------------------------------------------------------
    if (path.match(/^\/products\/\d+$/) && req.method === "GET") {
      const id = path.split("/").pop();
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_categories(name, slug, emoji)`)
        .eq("id", id)
        .single();
      if (error || !data) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(data);
    }

    // -- Categories ------------------------------------------------------------
    if (path === "/categories" && req.method === "GET") {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) return res.status(500).json({ error: error.message });
      const cats = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        emoji: c.emoji,
        description: c.description,
        sortOrder: c.sort_order,
      }));
      return res.status(200).json(cats);
    }

    // -- Auth: Login -----------------------------------------------------------
    if (path === "/auth/login" && req.method === "POST") {
      const { email, password, identifier } = req.body || {};
      const id = (email || identifier || "").toLowerCase().trim();
      if (!id || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", id)
        .single();

      if (error || !user) return res.status(401).json({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name } });
    }

    // -- Auth: Register ---------------------------------------------------------
    if (path === "/auth/register" && req.method === "POST") {
      const { fullName, email, password, phone } = req.body || {};
      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "Name, email and password required" });
      }
      const hash = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("users")
        .insert({ full_name: fullName, email: email.toLowerCase(), password_hash: hash, phone, role: "customer" })
        .select()
        .single();
      if (error) return res.status(400).json({ error: error.message });
      const token = jwt.sign(
        { id: data.id, email: data.email, role: data.role, fullName: data.full_name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(201).json({ token, user: data });
    }

    // -- Orders: Create --------------------------------------------------------
    if (path === "/orders" && req.method === "POST") {
      const body = req.body || {};
      const orderNum = `JC-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNum,
          customer_name: body.customerName,
          customer_phone: body.customerPhone,
          customer_email: body.customerEmail,
          delivery_address: body.deliveryAddress,
          total_amount: body.totalAmount,
          status: "pending",
          payment_method: body.paymentMethod || "cod",
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      // Insert order items
      if (body.items && order) {
        const items = body.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.quantity * item.unitPrice,
        }));
        await supabase.from("order_items").insert(items);
      }

      return res.status(201).json({ orderNumber: orderNum, orderId: order?.id });
    }

    // -- Order Tracking --------------------------------------------------------
    if (path.startsWith("/orders/track") && req.method === "GET") {
      const query = (req.query as any).q || (req.query as any).query || "";
      const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .or(`order_number.ilike.%${query}%,customer_phone.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    // -- Bulk Enquiries --------------------------------------------------------
    if (path === "/enquiries" && req.method === "POST") {
      const body = req.body || {};
      const enqNum = `ENQ-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase
        .from("bulk_enquiries")
        .insert({
          enquiry_number: enqNum,
          business_name: body.businessName,
          contact_name: body.contactName,
          phone: body.phone,
          email: body.email,
          city: body.city,
          requirements: body.requirements,
          status: "pending",
        })
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ enquiryNumber: enqNum, id: data?.id });
    }

    // -- Enquiry Tracking ------------------------------------------------------
    if (path.startsWith("/enquiries/track") && req.method === "GET") {
      const query = (req.query as any).q || "";
      const { data, error } = await supabase
        .from("bulk_enquiries")
        .select("*")
        .or(`enquiry_number.ilike.%${query}%,phone.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    // -- Health Check ----------------------------------------------------------
    if (path === "/health" && req.method === "GET") {
      return res.status(200).json({ status: "ok", platform: "vercel-serverless", ts: new Date().toISOString() });
    }

    return res.status(404).json({ error: `API route not found: ${path}` });
  } catch (err: any) {
    console.error("[API Error]", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
