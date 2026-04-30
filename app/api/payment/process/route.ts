import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      await dbConnect();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please ensure MongoDB is running.' },
        { status: 200 }
      );
    }

    const body = await request.json();
    const {
      items,
      total,
      email,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    } = body;

    // Extract stripePaymentIntentId from body or paymentDetails
    const stripePaymentIntentId = body.paymentIntentId || paymentDetails?.stripePaymentIntentId;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 200 }
      );
    }

    if (!email || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Email and shipping address are required' },
        { status: 200 }
      );
    }

    if (!paymentMethod || !['cod', 'card', 'stripe'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 200 }
      );
    }

    let paymentStatus = 'unpaid';

    // Determine payment status based on method
    if (paymentMethod === 'cod') {
      // COD orders are unpaid initially
      paymentStatus = 'unpaid';
    } else if (paymentMethod === 'card' || paymentMethod === 'stripe') {
      // Card and Stripe payments are marked as paid if details are provided
      if (paymentDetails && (paymentDetails.transactionId || stripePaymentIntentId)) {
        paymentStatus = 'paid';
      }
    }

    // Create order
    const order = await Order.create({
      userId: session.user.id,
      email,
      shippingAddress,
      items,
      totalAmount: total,
      paymentMethod,
      paymentDetails: {
        method: paymentMethod,
        ...paymentDetails,
        stripePaymentIntentId: stripePaymentIntentId || undefined,
      },
      status: 'pending',
      paymentStatus,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully',
        order: {
          _id: order._id,
          orderId: order._id,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error while processing order' },
      { status: 200 }
    );
  }
}
