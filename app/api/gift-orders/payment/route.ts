import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import GiftOrder from '@/models/GiftOrder';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateGiftReceiptHTML(order: any): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          .section { background: white; padding: 20px; margin: 10px 0; border-radius: 4px; }
          .section h2 { color: #C5A358; font-size: 18px; margin-bottom: 15px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .gift-icon { font-size: 24px; margin-bottom: 10px; }
          .totals { background: white; padding: 20px; margin: 10px 0; border-radius: 4px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .grand-total { font-size: 20px; font-weight: bold; color: #C5A358; border-bottom: none; }
          .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; }
          .status-badge { display: inline-block; background: #C5A358; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
          .sender-recipient { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
          .sender-box, .recipient-box { padding: 15px; background: #f5f5f5; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="gift-icon">🎁</div>
            <h1>Gift Order Confirmation</h1>
            <p>Thank you for sending a gift!</p>
          </div>

          <div class="section">
            <h2>Gift Order Details</h2>
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
              <strong>Paid</strong>
            </div>
          </div>

          <div class="sender-recipient">
            <div class="sender-box">
              <h3 style="margin-top: 0; color: #C5A358;">From</h3>
              <p><strong>${order.senderName}</strong></p>
              <p>${order.senderEmail}</p>
            </div>
            <div class="recipient-box">
              <h3 style="margin-top: 0; color: #C5A358;">To</h3>
              <p><strong>${order.recipientName}</strong></p>
              <p>${order.recipientPhone}</p>
            </div>
          </div>

          <div class="section">
            <h2>Gift Item</h2>
            <div class="info-row">
              <span>Product:</span>
              <strong>${order.product.name}</strong>
            </div>
            <div class="info-row">
              <span>Size:</span>
              <strong>${order.product.size}</strong>
            </div>
            <div class="info-row">
              <span>Quantity:</span>
              <strong>${order.product.qty}</strong>
            </div>
            <div class="info-row">
              <span>Unit Price:</span>
              <strong>Rs ${order.product.price.toFixed(2)}</strong>
            </div>
          </div>

          ${order.giftMessage ? `
            <div class="section">
              <h2>Gift Message</h2>
              <p style="font-style: italic; color: #666; border-left: 3px solid #C5A358; padding-left: 15px;">
                "${order.giftMessage}"
              </p>
            </div>
          ` : ''}

          <div class="section">
            <h2>Shipping Address</h2>
            <p>${order.shippingAddress}</p>
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Product Subtotal</span>
              <span>Rs ${(order.product.price * order.product.qty).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>${(order.product.price * order.product.qty) > 5000 ? 'FREE' : 'Rs 350.00'}</span>
            </div>
            <div class="total-row">
              <span>Gift Wrapping</span>
              <span>Rs 150.00</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount</span>
              <span>Rs ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="section" style="background: #e8f5e9; border: 2px solid #4caf50;">
            <p style="color: #2e7d32; font-weight: bold; margin: 0;">
              ✓ Payment Successful
            </p>
            <p style="color: #2e7d32; margin: 5px 0 0 0; font-size: 14px;">
              Your gift order has been confirmed and will be processed shortly.
            </p>
          </div>

          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2024 ZAMORA. All rights reserved.</p>
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
      paymentMethod,
      paymentDetails,
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

    if (!paymentMethod || paymentMethod !== 'card') {
      return NextResponse.json({ error: 'Only card payment is supported for gifts' }, { status: 400 });
    }

    if (!paymentDetails || !paymentDetails.transactionId) {
      return NextResponse.json({ error: 'Payment details are required' }, { status: 400 });
    }

    // Create gift order with payment
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
      paymentMethod: 'card',
      paymentStatus: 'paid',
      paymentDetails: {
        method: 'card',
        cardType: paymentDetails.cardType,
        transactionId: paymentDetails.transactionId,
      },
    });

    // Send confirmation email to sender
    try {
      const receiptHTML = generateGiftReceiptHTML(order);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: senderEmail,
        subject: `Gift Order Confirmation #${order._id}`,
        html: receiptHTML,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue even if email fails
    }

    // Send notification email to recipient (optional - you can customize this)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientName, // Note: This should be recipient email if available
        subject: `You have received a gift from ${senderName}!`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>You have received a gift from ${senderName}! 🎁</h2>
              <p>Hello ${recipientName},</p>
              <p>Great news! ${senderName} has sent you a special gift from ZAMORA.</p>
              ${giftMessage ? `<p><strong>Message from ${senderName}:</strong><br>"${giftMessage}"</p>` : ''}
              <p>Your gift will be delivered to:</p>
              <p>${shippingAddress}</p>
              <p>Thank you for being part of our community!</p>
              <p>Best regards,<br>ZAMORA Team</p>
            </body>
          </html>
        `,
      });
    } catch (notificationError) {
      console.error('Error sending recipient notification:', notificationError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Gift order placed and payment processed successfully',
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
    console.error('Error processing gift payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process gift payment' },
      { status: 500 }
    );
  }
}
