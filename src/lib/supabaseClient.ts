
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.error(
    'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Vercel production environment.'
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);


// Types for Supabase Database Tables
export type Database = {
  public: {
    Tables: {
      product_categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          flavor: string;
          category_id: number;
          pack_size: string;
          packaging_type: string;
          description: string | null;
          retail_price: number;
          wholesale_price: number;
          stock_quantity: number;
          min_wholesale_qty: number;
          image_url: string;
          shot_image_url: string | null;
          is_active: number;
          featured: number;
          created_at: string;
        };
      };
      users: {
        Row: {
          id: number;
          email: string;
          password_hash: string;
          full_name: string;
          phone: string | null;
          role: 'admin' | 'sales_rep' | 'customer';
          business_name: string | null;
          customer_type: string | null;
          city: string | null;
          state: string | null;
          created_at: string;
        };
      };
      retail_orders: {
        Row: {
          id: number;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          delivery_address: string;
          city: string;
          state: string;
          pincode: string;
          subtotal: number;
          delivery_fee: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          order_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      retail_order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          product_name: string;
          pack_size: string;
          unit_price: number;
          quantity: number;
          total_price: number;
        };
      };
      bulk_enquiries: {
        Row: {
          id: number;
          enquiry_number: string;
          customer_name: string;
          phone_number: string;
          email: string | null;
          business_name: string;
          customer_type: string;
          city: string;
          state: string;
          preferred_contact_method: string;
          gstin: string | null;
          delivery_location: string | null;
          additional_notes: string | null;
          status: string;
          assigned_to: string | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      bulk_enquiry_items: {
        Row: {
          id: number;
          enquiry_id: number;
          product_id: number;
          product_name: string;
          pack_size: string;
          requested_quantity: number;
          unit_label: string;
        };
      };
      quotations: {
        Row: {
          id: number;
          quotation_number: string;
          enquiry_id: number;
          customer_name: string;
          business_name: string;
          phone_number: string;
          email: string | null;
          subtotal: number;
          discount_percent: number;
          discount_amount: number;
          tax_percent: number;
          tax_amount: number;
          delivery_charges: number;
          grand_total: number;
          validity_date: string;
          payment_terms: string;
          notes_conditions: string | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      wholesale_orders: {
        Row: {
          id: number;
          order_number: string;
          quotation_id: number | null;
          enquiry_id: number | null;
          business_name: string;
          contact_person: string;
          phone_number: string;
          email: string | null;
          delivery_address: string | null;
          city: string | null;
          state: string | null;
          agreed_total: number;
          advance_paid: number;
          payment_status: string;
          fulfillment_status: string;
          order_date: string;
          expected_delivery_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};