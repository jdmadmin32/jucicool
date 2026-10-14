import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "juci-cool-super-secret-jwt-key-2026";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const path = event.path.replace(/^\/.netlify\/functions\/api/, "").replace(/^\/api/, "") || "/";
  const method = event.httpMethod;
  const query = event.queryStringParameters || {};
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}

  const respond = (status, data) => ({
    statusCode: status,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  try {
    // Products
    if (path === "/products" && method === "GET") {
      const { category, search } = query;
      let q = supabase
        .from("products")
        .select("*, product_categories(name, slug, emoji)")
        .eq("is_active", true)
        .order("sort_order");

      if (category && category !== "all") {
        const { data: cat } = await supabase
          .from("product_categories")
          .select("id")
          .eq("slug", category)
          .single();
        if (cat) q = q.eq("category_id", cat.id);
      }
      if (search) q = q.ilike("name", `%${search}%`);

      const { data, error } = await q;
      if (error) return respond(500, { error: error.message });
      const products = (data || []).map((p) => ({
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
      return respond(200, products);
    }

    // Categories
    if (path === "/categories" && method === "GET") {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) return respond(500, { error: error.message });
      return respond(200, (data || []).map((c) => ({
        id: c.id, name: c.name, slug: c.slug, emoji: c.emoji, description: c.description,
      })));
    }

    // Auth: Login
    if (path === "/auth/login" && method === "POST") {
      const { email, password } = body;
      if (!email || !password) return respond(400, { error: "Email and password required" });
      const { data: user, error } = await supabase
        .from("users").select("*").eq("email", email.toLowerCase()).single();
      if (error || !user) return respond(401, { error: "Invalid credentials" });
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return respond(401, { error: "Invalid credentials" });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
        JWT_SECRET, { expiresIn: "7d" }
      );
      return respond(200, { token, user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name } });
    }

    // Orders: Create
    if (path === "/orders" && method === "POST") {
      const orderNum = `JC-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error } = await supabase.from("orders").insert({
        order_number: orderNum,
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail,
        delivery_address: body.deliveryAddress,
        total_amount: body.totalAmount,
        status: "pending",
        payment_method: body.paymentMethod || "cod",
      }).select().single();
      if (error) return respond(500, { error: error.message });
      if (body.items && order) {
        await supabase.from("order_items").insert(
          body.items.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.quantity * item.unitPrice,
          }))
        );
      }
      return respond(201, { orderNumber: orderNum, orderId: order?.id });
    }

    // Order Tracking
    if (path.startsWith("/orders/track") && method === "GET") {
      const q = query.q || query.query || "";
      const { data, error } = await supabase.from("orders")
        .select("*, order_items(*)")
        .or(`order_number.ilike.%${q}%,customer_phone.ilike.%${q}%`)
        .order("created_at", { ascending: false }).limit(5);
      if (error) return respond(500, { error: error.message });
      return respond(200, data || []);
    }

    // Bulk Enquiries
    if (path === "/enquiries" && method === "POST") {
      const enqNum = `ENQ-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase.from("bulk_enquiries").insert({
        enquiry_number: enqNum,
        business_name: body.businessName,
        contact_name: body.contactName,
        phone: body.phone,
        email: body.email,
        city: body.city,
        requirements: body.requirements,
        status: "pending",
      }).select().single();
      if (error) return respond(500, { error: error.message });
      return respond(201, { enquiryNumber: enqNum, id: data?.id });
    }

    // Health
    if (path === "/health") return respond(200, { status: "ok", platform: "netlify", ts: new Date().toISOString() });

    return respond(404, { error: `Not found: ${path}` });
  } catch (err) {
    console.error("[Netlify API Error]", err);
    return respond(500, { error: err.message || "Internal Server Error" });
  }
};
