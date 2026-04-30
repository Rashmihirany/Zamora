import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import GiftOrder from '@/models/GiftOrder';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const orders = await GiftOrder.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('Error fetching gift orders:', err);
    return NextResponse.json({ error: 'Failed to fetch gift orders' }, { status: 500 });
  }
}
