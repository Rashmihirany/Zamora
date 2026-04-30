import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import GiftOrder from '@/models/GiftOrder';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await GiftOrder.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Gift order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Error updating gift order:', err);
    return NextResponse.json({ error: 'Failed to update gift order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const order = await GiftOrder.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Gift order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gift order deleted' });
  } catch (err: any) {
    console.error('Error deleting gift order:', err);
    return NextResponse.json({ error: 'Failed to delete gift order' }, { status: 500 });
  }
}
