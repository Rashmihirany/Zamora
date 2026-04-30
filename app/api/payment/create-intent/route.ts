import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, email, orderId, orderDescription } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stripe Secret Key is missing. Please add STRIPE_SECRET_KEY to your .env file.'
        },
        { status: 200 }
      );
    }

    if (!amount || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (amount or email)' },
        { status: 200 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'lkr',
      payment_method_types: ['card'],
      metadata: {
        orderId: orderId || 'unknown',
        email,
      },
      description: orderDescription || 'ZAMORA Store Purchase',
      receipt_email: email,
    });

    return NextResponse.json(
      {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error while creating payment intent' },
      { status: 200 }
    );
  }
}
