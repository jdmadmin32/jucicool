
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
    
    
    // Retail order submission: POST /api/retail-orders
    if (path === "/retail-orders" && req.method === "POST") {
      const body = req.body || {};

      // Support both camelCase and snake_case payloads.
      const customerName = body.customerName ?? body.customer_name;
      const customerPhone = body.customerPhone ?? body.customer_phone;
      const customerEmail = body.customerEmail ?? body.customer_email;
      const deliveryAddress =
        body.deliveryAddress ?? body.delivery_address;
      const paymentMethod =
        body.paymentMethod ?? body.payment_method ?? "COD";
      const deliveryFeeValue =
        body.deliveryFee ?? body.delivery_fee ?? 0;
      const notes = body.notes;

      const rawItems = body.items;

      // Validate customer details and order items.
      if (
        typeof customerName !== "string" ||
        !customerName.trim() ||
        typeof customerPhone !== "string" ||
        !customerPhone.trim() ||
        typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim() ||
        !Array.isArray(rawItems) ||
        rawItems.length === 0
      ) {
        return res.status(400).json({
          error:
            "Customer name, phone, delivery address and at least one item are required",
        });
      }

      // Validate product IDs and quantities before querying Supabase.
      const requestedItems = rawItems.map((item: any) => ({
        product_id: Number(item.productId ?? item.product_id),
        quantity: Number(item.quantity),
      }));

      if (
        requestedItems.some(
          (item: any) =>
            !Number.isInteger(item.product_id) ||
            item.product_id <= 0 ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
        )
      ) {
        return res.status(400).json({
          error: "Invalid product ID or quantity",
        });
      }

      // Retrieve product details from the database.
      const productIds = [
        ...new Set(
          requestedItems.map((item: any) => item.product_id)
        ),
      ];

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) {
        console.error("Retail order product lookup:", productsError);

        return res.status(500).json({
          error: "Unable to validate order products",
        });
      }

      const productMap = new Map(
        (products ?? []).map((product: any) => [
          Number(product.id),
          product,
        ])
      );

      // Build order items using database product details and prices.
      const items: any[] = [];

      for (const requestedItem of requestedItems) {
        const product: any = productMap.get(
          requestedItem.product_id
        );

        if (!product) {
          return res.status(400).json({
            error: `Product ID ${requestedItem.product_id} was not found`,
          });
        }

        // Change "price", "name", or "pack_size" here if your
        // Supabase products table uses different column names.
        const unitPrice = Number(product.retail_price);

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          console.error(
            "Invalid product price in database:",
            requestedItem.product_id
          );

          return res.status(500).json({
            error: `Product ID ${requestedItem.product_id} has an invalid database price`,
          });
        }

        items.push({
          product_id: requestedItem.product_id,
          product_name: String(product.name ?? ""),
          pack_size: String(product.pack_size ?? ""),
          unit_price: unitPrice,
          quantity: requestedItem.quantity,
          total_price: unitPrice * requestedItem.quantity,
        });
      }

      // Calculate totals on the server.
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.total_price,
        0
      );

      const parsedDeliveryFee = Number(deliveryFeeValue);
      const deliveryFee = Number.isFinite(parsedDeliveryFee)
        ? Math.max(0, parsedDeliveryFee)
        : 0;

      const totalAmount = subtotal + deliveryFee;
      const orderNumber = makeReference("JC-RET");

      // Create the order record.
      const { data: order, error: orderError } = await supabase
        .from("retail_orders")
        .insert({
          order_number: orderNumber,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email:
            typeof customerEmail === "string" && customerEmail.trim()
              ? customerEmail.trim()
              : null,
          delivery_address: deliveryAddress.trim(),
          city: body.city ?? "",
          state: body.state ?? "",
          pincode: body.pincode == null
            ? ""
            : String(body.pincode),
          subtotal,
          delivery_fee: deliveryFee,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_status: "Pending",
          order_status: "New",
          notes: notes || null,
        })
        .select("id, order_number")
        .single();

      if (orderError || !order) {
        console.error("Retail order insert:", orderError);

        return res.status(500).json({
          error:
            orderError?.message || "Failed to create retail order",
        });
      }

      // Save the items belonging to the new order.
      const itemsToInsert = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        pack_size: item.pack_size,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from("retail_order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Retail order items insert:", itemsError);

        return res.status(500).json({
          error:
            "Order was created but saving its items failed. Order reference: " +
            order.order_number,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Retail order placed successfully",
        order_number: order.order_number,
        order_id: order.id,
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
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
    
    // Bulk enquiry submission: POST /api/bulk-enquiries
    if (path === "/bulk-enquiries" && req.method === "POST") {
      const body = req.body || {};

      // Accept both camelCase and snake_case payloads.
      const customerName = body.customerName ?? body.customer_name;
      const phoneNumber = body.phoneNumber ?? body.phone_number;
      const businessName = body.businessName ?? body.business_name;
      const customerType = body.customerType ?? body.customer_type;
      const preferredContactMethod =
        body.preferredContactMethod ?? body.preferred_contact_method;
      const deliveryLocation =
        body.deliveryLocation ?? body.delivery_location;
      const additionalNotes =
        body.additionalNotes ?? body.additional_notes;

      if (
        !customerName ||
        !phoneNumber ||
        !businessName ||
        !Array.isArray(body.items) ||
        body.items.length === 0
      ) {
        return res.status(400).json({
          error: "Customer name, phone number, business name and items are required",
        });
      }

      const items = body.items.map((item: any) => ({
        product_id: Number(item.productId ?? item.product_id),
        product_name: String(item.productName ?? item.product_name ?? ""),
        pack_size: String(item.packSize ?? item.pack_size ?? ""),
        requested_quantity: Number(
          item.quantity ?? item.requestedQuantity ?? item.requested_quantity
        ),
        unit_label: item.unitLabel ?? item.unit_label ?? "Units",
      }));

      if (
        items.some(
          (item: any) =>
            !Number.isInteger(item.product_id) ||
            !Number.isFinite(item.requested_quantity) ||
            item.requested_quantity <= 0
        )
      ) {
        return res.status(400).json({
          error: "Invalid product or requested quantity",
        });
      }

      const enquiryNumber = `JC-BLK-${Date.now().toString().slice(-6)}`;

      const { data: enquiry, error: enquiryError } = await supabase
        .from("bulk_enquiries")
        .insert({
          enquiry_number: enquiryNumber,
          customer_name: String(customerName).trim(),
          phone_number: String(phoneNumber).trim(),
          email: body.email || null,
          business_name: String(businessName).trim(),
          customer_type: customerType || "Retailer",
          city: body.city || "",
          state: body.state || "",
          preferred_contact_method: preferredContactMethod || "Phone",
          gstin: body.gstin || null,
          delivery_location: deliveryLocation || null,
          additional_notes: additionalNotes || null,
          status: "New",
        })
        .select("id, enquiry_number")
        .single();

      if (enquiryError || !enquiry) {
        console.error("Bulk enquiry insert failed:", enquiryError);
        return res.status(500).json({
          error: enquiryError?.message || "Failed to create bulk enquiry",
        });
      }

      const enquiryItems = items.map((item: any) => ({
        enquiry_id: enquiry.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("bulk_enquiry_items")
        .insert(enquiryItems);

      if (itemsError) {
        console.error("Bulk enquiry items insert failed:", itemsError);
        return res.status(500).json({
          error:
            "Enquiry was created, but saving its products failed. Reference: " +
            enquiry.enquiry_number,
        });
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
    
    // -------------------------------------------------------------------------
    // ADMIN: List bulk enquiries
    // GET /api/admin/bulk-enquiries
    // -------------------------------------------------------------------------
    if (path === "/admin/bulk-enquiries" && req.method === "GET") {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      let query = supabase
        .from("bulk_enquiries")
        .select("*, bulk_enquiry_items(*), quotations(*)")
        .order("created_at", { ascending: false });

      const status = String(req.query.status || "").trim();
      const search = String(req.query.search || "").trim();

      if (status && status.toLowerCase() !== "all") {
        query = query.eq("status", status);
      }

      if (search) {
        const safeSearch = search.replace(/[,%()]/g, " ").trim();

        if (safeSearch) {
          query = query.or(
            `customer_name.ilike.%${safeSearch}%,phone_number.ilike.%${safeSearch}%,business_name.ilike.%${safeSearch}%,enquiry_number.ilike.%${safeSearch}%`
          );
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Admin bulk enquiry list failed:", error);
        return res.status(500).json({
          error: "Failed to fetch bulk enquiries",
        });
      }

      return res.status(200).json(data || []);
    }

    // -------------------------------------------------------------------------
    // ADMIN: Get one bulk enquiry
    // GET /api/admin/bulk-enquiries/:id
    // -------------------------------------------------------------------------
    const adminEnquiryMatch = path.match(
      /^\/admin\/bulk-enquiries\/(\d+)$/
    );

    if (
      adminEnquiryMatch &&
      req.method === "GET"
    ) {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { data, error } = await supabase
        .from("bulk_enquiries")
        .select("*, bulk_enquiry_items(*), quotations(*)")
        .eq("id", Number(adminEnquiryMatch[1]))
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Bulk enquiry not found" });
      }

      return res.status(200).json(data);
    }

    // -------------------------------------------------------------------------
    // ADMIN: Update bulk enquiry status
    // PATCH /api/admin/bulk-enquiries/:id
    // -------------------------------------------------------------------------
    if (
      adminEnquiryMatch &&
      req.method === "PATCH"
    ) {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const body = req.body || {};
      const updates: Record<string, any> = {};

      if (body.status !== undefined) {
        const allowedStatuses = [
          "New",
          "Contacted",
          "Quoted",
          "Converted",
          "Rejected",
          "Closed",
        ];

        if (!allowedStatuses.includes(body.status)) {
          return res.status(400).json({
            error: "Invalid enquiry status",
          });
        }

        updates.status = body.status;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: "No supported fields provided for update",
        });
      }

      const { data, error } = await supabase
        .from("bulk_enquiries")
        .update(updates)
        .eq("id", Number(adminEnquiryMatch[1]))
        .select("*, bulk_enquiry_items(*), quotations(*)")
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Bulk enquiry not found" });
      }

      return res.status(200).json(data);
    }

    
    // GET /admin/retail-orders
    if (path === "/admin/retail-orders" && req.method === "GET") {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      let query = supabase
        .from("retail_orders")
        .select("*, retail_order_items(*)")
        .order("created_at", { ascending: false });

      const status = req.query?.status;
      const search = req.query?.search;

      if (status) {
        query = query.eq("order_status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Retail orders query failed:", error);
        return res.status(500).json({ error: error.message });
      }

      let orders = data || [];

      if (search) {
        const term = String(search).toLowerCase();

        orders = orders.filter((order: any) =>
          [
            order.order_number,
            order.customer_name,
            order.customer_phone,
            order.customer_email,
          ].some((value) =>
            String(value || "").toLowerCase().includes(term)
          )
        );
      }

      return res.status(200).json(orders);
    }

    // GET /admin/retail-orders/:id
    const retailOrderMatch = path.match(
      /^\/admin\/retail-orders\/([^/]+)$/
    );

    if (retailOrderMatch && req.method === "GET") {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { data, error } = await supabase
        .from("retail_orders")
        .select("*, retail_order_items(*)")
        .eq("id", retailOrderMatch[1])
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "Retail order not found" });
      }

      return res.status(200).json(data);
    }

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
