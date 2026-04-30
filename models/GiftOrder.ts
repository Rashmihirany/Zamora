import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGiftOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  product: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    size: string;
    qty: number;
  };
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  giftMessage: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

const GiftOrderSchema = new Schema<IGiftOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  giftMessage: { type: String, default: '' },
  shippingAddress: { type: String, required: true },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

GiftOrderSchema.index({ userId: 1, createdAt: -1 });

const GiftOrder: Model<IGiftOrder> =
  mongoose.models.GiftOrder || mongoose.model<IGiftOrder>('GiftOrder', GiftOrderSchema);

export default GiftOrder;
