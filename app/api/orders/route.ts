import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS so customer orders always land in the DB
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// POST /api/orders — place a new customer order
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    city,
    notes,
    payment_method,
    items,
    total_amount,
  } = body as {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    city: string;
    notes?: string;
    payment_method: string;
    items: unknown[];
    total_amount: number;
  };

  // Basic validation
  if (!id || !customer_name || !customer_email || !customer_phone || !delivery_address || !city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await supabase.from('orders').insert({
    id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    city,
    notes: notes || null,
    payment_method: payment_method || 'Cash on Delivery',
    items,
    total_amount,
    status: 'pending',
  }).select().single();

  if (error) {
    console.error('[POST /api/orders] Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, order: data }, { status: 201 });
}
