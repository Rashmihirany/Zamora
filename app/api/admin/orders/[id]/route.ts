import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Order from '@/models/Order';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { status, paymentStatus } = body;

    const update: any = {};

    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      update.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['unpaid', 'paid', 'failed'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
      }
      update.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      update,
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Remove sensitive card details before sending to frontend
    const sanitizedOrder = {
      ...order,
      paymentDetails: order.paymentDetails
        ? {
            method: order.paymentDetails.method,
            ...(order.paymentDetails.cardType && { cardType: order.paymentDetails.cardType }),
            ...(order.paymentDetails.last4 && { last4: order.paymentDetails.last4 }),
            // Never send full card number, CVV, or transaction details to admin
          }
        : undefined,
    };

    return NextResponse.json(sanitizedOrder);
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
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
    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted' });
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
