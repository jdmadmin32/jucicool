
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// -----------------------------------------------------------------------------
// Server configuration
// -----------------------------------------------------------------------------
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

function verifyToken(req: VercelRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ") || !JWT_SECRET) return null;

  try {
    return jwt.verify(auth.slice(7), JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return null;
  }
}

function makeReference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!supabase || !JWT_SECRET) {
    console.error("Missing VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or JWT_SECRET");
    return res.status(500).json({
      error: "Server configuration is incomplete. Check Vercel environment variables.",
    });
  }

  const url = req.url || "/";
  const path = url.replace(/^\/api(?=\/|$)/, "").split("?")[0];

  try {
    // -------------------------------------------------------------------------
    // Public products
    // -------------------------------------------------------------------------
    if (path === "/products" && req.method === "GET") {
      const { category, search, featured } = req.query as Record<
        string,
        string
      >;

      let query = supabase
        .from("products")
        .select("*, product_categories(name, slug, emoji)")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (category && category !== "all") {
        const { data: cat, error: catError } = await supabase
          .from("product_categories")
          .select("id")
          .eq("slug", category)
          .maybeSingle();

        if (catError) {
          return res.status(500).json({ error: catError.message });
        }
        if (cat) query = query.eq("category_id", cat.id);
      }

      if (search) query = query.ilike("name", `%${search}%`);
      if (featured === "true") query = query.eq("is_featured", true);

      const { data, error } = await query;

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(
        (data || []).map((p: any) => ({
          ...p,
          price: Number(p.price),
          mrp: p.mrp == null ? null : Number(p.mrp),
          imageUrl: p.image_url,
          packSize: p.pack_size,
          categoryId: p.category_id,
          categoryName: p.product_categories?.name || "",
          categorySlug: p.product_categories?.slug || "",
          categoryEmoji: p.product_categories?.emoji || "",
          isActive: p.is_active,
          isFeatured: p.is_featured,
          stockQuantity: p.stock_quantity,
        }))
      );
    }

    const singleProduct = path.match(/^\/products\/(\d+)$/);
    if (singleProduct && req.method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(name, slug, emoji)")
        .eq("id", singleProduct[1])
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "Product not found" });

      return res.status(200).json(data);
    }

    // -------------------------------------------------------------------------
    // Categories
    // -------------------------------------------------------------------------
    if (path === "/categories" && req.method === "GET") {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------
    if (path === "/auth/login" && req.method === "POST") {
      const { email, identifier, password } = req.body || {};
      const loginEmail = String(email || identifier || "")
        .toLowerCase()
        .trim();

      if (!loginEmail || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", loginEmail)
        .maybeSingle();

      if (error || !user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
      });
    }

    // -------------------------------------------------------------------------
    // Customer registration
    // -------------------------------------------------------------------------
    if (path === "/auth/register" && req.method === "POST") {
      const { fullName, email, password, phone } = req.body || {};

      if (!fullName || !email || !password) {
        return res.status(400).json({
          error: "Name, email and password are required",
        });
      }

      if (String(password).length < 8) {
        return res.status(400).json({
          error: "Password must contain at least 8 characters",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const { data: user, error } = await supabase
        .from("users")
        .insert({
          full_name: String(fullName).trim(),
          email: String(email).toLowerCase().trim(),
          password_hash: hash,
          phone: phone || null,
          role: "customer",
        })
        .select("id, full_name, email, role")
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
        },
      });
    }

    // -------------------------------------------------------------------------
    // Retail order submission: POST /api/retail-orders
    // -------------------------------------------------------------------------
    if (path === "/retail-orders" && req.method === "POST") {
      const body = req.body || {};

      if (
        !body.customer_name ||
        !body.customer_phone ||
        !body.delivery_address ||
        !Array.isArray(body.items) ||
        body.items.length === 0
      ) {
        return res.status(400).json({
          error:
            "Customer name, phone, delivery address and at least one item are required",
        });
      }

      if (
        body.items.some(
          (item: any) =>
            !Number.isInteger(Number(item.product_id)) ||
            !Number.isFinite(Number(item.quantity)) ||
            Number(item.quantity) <= 0 ||
            !Number.isFinite(Number(item.unit_price)) ||
            Number(item.unit_price) < 0
        )
      ) {
        return res.status(400).json({ error: "Invalid order items" });
      }

      // Calculate totals on the server; don't trust client totals.
      const subtotal = body.items.reduce(
        (sum: number, item: any) =>
          sum + Number(item.unit_price) * Number(item.quantity),
        0
      );

      const deliveryFee = Math.max(0, Number(body.delivery_fee) || 0);
      const totalAmount = subtotal + deliveryFee;
      const orderNumber = makeReference("JC-RET");

      const { data: order, error: orderError } = await supabase
        .from("retail_orders")
        .insert({
          order_number: orderNumber,
          customer_name: String(body.customer_name).trim(),
          customer_phone: String(body.customer_phone).trim(),
          customer_email: body.customer_email || null,
          delivery_address: String(body.delivery_address).trim(),
          city: body.city || "",
          state: body.state || "",
          pincode: body.pincode || "",
          subtotal,
          delivery_fee: deliveryFee,
          total_amount: totalAmount,
          payment_method: body.payment_method || "COD",
          payment_status: "Pending",
          order_status: "New",
          notes: body.notes || null,
        })
        .select("id, order_number")
        .single();

      if (orderError || !order) {
        console.error("Retail order insert:", orderError);
        return res.status(500).json({
          error: orderError?.message || "Failed to create retail order",
        });
      }

      const items = body.items.map((item: any) => ({
        order_id: order.id,
        product_id: Number(item.product_id),
        product_name: String(item.product_name || ""),
        pack_size: String(item.pack_size || ""),
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        total_price: Number(item.unit_price) * Number(item.quantity),
      }));

      const { error: itemsError } = await supabase
        .from("retail_order_items")
        .insert(items);

      if (itemsError) {
        console.error("Retail order items insert:", itemsError);
        return res.status(500).json({
          error:
            "The order was created, but saving its items failed. Contact the store with order number " +
            order.order_number,
        });
      }

      return res.status(201).json({
        success: true,
        order_number: order.order_number,
        order_id: order.id,
      });
    }

    // -------------------------------------------------------------------------
    // Retail order tracking
    // -------------------------------------------------------------------------
    if (
      (path === "/retail-orders/track" ||
        path.startsWith("/retail-orders/track/")) &&
      req.method === "GET"
    ) {
      const query =
        String(
          (req.query as any).q ||
            (req.query as any).query ||
            path.split("/").pop() ||
            ""
        ).trim();

      if (!query) {
        return res.status(400).json({ error: "Enter an order number or phone" });
      }

      const { data, error } = await supabase
        .from("retail_orders")
        .select("*, retail_order_items(*)")
        .or(
          `order_number.ilike.%${query}%,customer_phone.ilike.%${query}%`
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) return res.status(500).json({ error: error.message });
      if (!data?.length) {
        return res.status(404).json({ error: "No matching order found" });
      }

      return res.status(200).json(data[0]);
    }

    // -------------------------------------------------------------------------
    // Bulk enquiry submission: POST /api/bulk-enquiries
    // -------------------------------------------------------------------------
    if (path === "/bulk-enquiries" && req.method === "POST") {
      const body = req.body || {};

      if (
        !body.customer_name ||
        !body.phone_number ||
        !body.business_name ||
        !Array.isArray(body.items)
      ) {
        return res.status(400).json({
          error:
            "Customer name, phone number, business name and items are required",
        });
      }

      if (
        body.items.some(
          (item: any) =>
            !Number.isInteger(Number(item.product_id)) ||
            !Number.isFinite(Number(item.requested_quantity)) ||
            Number(item.requested_quantity) <= 0
        )
      ) {
        return res.status(400).json({ error: "Invalid enquiry items" });
      }

      const enquiryNumber = makeReference("JC-BLK");

      const { data: enquiry, error: enquiryError } = await supabase
        .from("bulk_enquiries")
        .insert({
          enquiry_number: enquiryNumber,
          customer_name: String(body.customer_name).trim(),
          phone_number: String(body.phone_number).trim(),
          email: body.email || null,
          business_name: String(body.business_name).trim(),
          customer_type: body.customer_type || "Business",
          city: body.city || "",
          state: body.state || "",
          preferred_contact_method: body.preferred_contact_method || "Phone",
          gstin: body.gstin || null,
          delivery_location: body.delivery_location || null,
          additional_notes: body.additional_notes || null,
          status: "New",
        })
        .select("id, enquiry_number")
        .single();

      if (enquiryError || !enquiry) {
        console.error("Bulk enquiry insert:", enquiryError);
        return res.status(500).json({
          error: enquiryError?.message || "Failed to create bulk enquiry",
        });
      }

      if (body.items.length > 0) {
        const items = body.items.map((item: any) => ({
          enquiry_id: enquiry.id,
          product_id: Number(item.product_id),
          product_name: String(item.product_name || ""),
          pack_size: String(item.pack_size || ""),
          requested_quantity: Number(item.requested_quantity),
          unit_label: item.unit_label || "Units",
        }));

        const { error: itemsError } = await supabase
          .from("bulk_enquiry_items")
          .insert(items);

        if (itemsError) {
          console.error("Bulk enquiry items insert:", itemsError);
          return res.status(500).json({
            error:
              "The enquiry was created, but saving its items failed. Contact the store with enquiry number " +
              enquiry.enquiry_number,
          });
        }
      }

      return res.status(201).json({
        success: true,
        enquiry_number: enquiry.enquiry_number,
        enquiry_id: enquiry.id,
      });
    }

    // -------------------------------------------------------------------------
    // Bulk enquiry tracking
    // -------------------------------------------------------------------------
    if (
      (path === "/bulk-enquiries/track" ||
        path.startsWith("/bulk-enquiries/track/")) &&
      req.method === "GET"
    ) {
      const query = String(
        (req.query as any).q ||
          (req.query as any).query ||
          path.split("/").pop() ||
          ""
      ).trim();

      if (!query) {
        return res.status(400).json({
          error: "Enter an enquiry number or phone number",
        });
      }

      const { data, error } = await supabase
        .from("bulk_enquiries")
        .select("*, bulk_enquiry_items(*), quotations(*)")
        .or(
          `enquiry_number.ilike.%${query}%,phone_number.ilike.%${query}%`
        )
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) return res.status(500).json({ error: error.message });
      if (!data?.length) {
        return res.status(404).json({ error: "Enquiry not found" });
      }

      return res.status(200).json(data[0]);
    }

    // -------------------------------------------------------------------------
    // Backward-compatible legacy routes
    // -------------------------------------------------------------------------
    if (path === "/orders" && req.method === "POST") {
      return res.status(400).json({
        error:
          "Use /api/retail-orders with the retail order payload format.",
      });
    }

    if (path === "/enquiries" && req.method === "POST") {
      return res.status(400).json({
        error:
          "Use /api/bulk-enquiries with the bulk enquiry payload format.",
      });
    }

    // -------------------------------------------------------------------------
    // Health check
    // -------------------------------------------------------------------------
    if (path === "/health" && req.method === "GET") {
      return res.status(200).json({
        status: "ok",
        platform: "vercel-serverless",
        timestamp: new Date().toISOString(),
      });
    }

    // Admin routes are not implemented in this file yet.
    if (path.startsWith("/admin/")) {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      return res.status(501).json({
        error:
          "This admin API route is not implemented in api/index.ts yet.",
        route: path,
      });
    }

    return res.status(404).json({ error: `API route not found: ${path}` });
  } catch (err: any) {
    console.error("[API Error]", err);
    return res.status(500).json({
      error: err?.message || "Internal Server Error",
    });
  }
}
