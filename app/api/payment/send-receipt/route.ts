import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import nodemailer from 'nodemailer';
import { authOptions } from '@/lib/auth';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateReceiptHTML(order: any): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsHTML = order.items
    .map(
      (item: any) =>
        `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs ${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs ${(item.price * item.qty).toFixed(2)}</td>
    </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f7f4; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #C5A358, rgba(197, 163, 88, 0.8)); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .order-info { background: white; padding: 20px; margin: 10px 0; border-radius: 4px; }
          .order-info h2 { color: #C5A358; font-size: 18px; margin-bottom: 15px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .items-table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
          .items-table th { background: #C5A358; color: white; padding: 12px; text-align: left; }
          .totals { background: white; padding: 20px; margin: 10px 0; border-radius: 4px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .grand-total { font-size: 20px; font-weight: bold; color: #C5A358; border-bottom: none; }
          .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; }
          .status-badge { display: inline-block; background: #C5A358; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>

          <div class="order-info">
            <h2>Order Details</h2>
            <div class="info-row">
              <span>Order ID:</span>
              <strong>#${order._id}</strong>
            </div>
            <div class="info-row">
              <span>Order Date:</span>
              <strong>${orderDate}</strong>
            </div>
            <div class="info-row">
              <span>Payment Status:</span>
              <strong>${order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</strong>
            </div>
            <div class="info-row">
              <span>Payment Method:</span>
              <strong>${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Card Payment' : 'Stripe'}</strong>
            </div>
          </div>

          <div class="order-info">
            <h2>Shipping Address</h2>
            <div class="info-row">
              <span>${order.shippingAddress.fullName}</span>
            </div>
            <div class="info-row">
              <span>${order.shippingAddress.street}, ${order.shippingAddress.city}</span>
            </div>
            <div class="info-row">
              <span>${order.shippingAddress.state}, ${order.shippingAddress.zip}</span>
            </div>
            <div class="info-row">
              <span>${order.shippingAddress.country}</span>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>Rs ${order.items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0).toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>Rs ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: white; padding: 20px; margin: 10px 0; border-radius: 4px; text-align: center;">
            <p style="color: #999; margin: 0;">Your order will be processed soon. Track your order status on your ZAMORA account.</p>
          </div>

          <div class="footer">
            <p>Thank you for shopping with ZAMORA. For support, contact us at support@zamora.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(orderId).populate('userId');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this order
    if (order.userId._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate receipt HTML
    const receiptHTML = generateReceiptHTML(order);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@zamora.com',
      to: order.email,
      subject: `Your ZAMORA Receipt - Order #${order._id}`,
      html: receiptHTML,
    });

    // Update receipt sent flag
    order.receiptSent = true;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Receipt sent successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send receipt' },
      { status: 500 }
    );
  }
}
