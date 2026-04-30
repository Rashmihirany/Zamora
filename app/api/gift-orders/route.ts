import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GiftOrder from '@/models/GiftOrder';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      product,
      senderName,
      senderEmail,
      recipientName,
      recipientPhone,
      giftMessage,
      shippingAddress,
      total,
    } = body;

    if (!product || !product.productId) {
      return NextResponse.json({ error: 'No product specified' }, { status: 400 });
    }

    if (!recipientName || !recipientPhone) {
      return NextResponse.json({ error: 'Recipient details are required' }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    const order = await GiftOrder.create({
      userId: session.user.id,
      product,
      senderName,
      senderEmail,
      recipientName,
      recipientPhone,
      giftMessage: giftMessage || '',
      shippingAddress,
      totalAmount: total,
      status: 'pending',
    });

    return NextResponse.json(
      { success: true, message: 'Gift order placed successfully', order },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating gift order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create gift order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const orders = await GiftOrder.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching gift orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift orders' },
      { status: 500 }
    );
  }
}
