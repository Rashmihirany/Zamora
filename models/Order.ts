import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  imageUrl: string;
}

export interface IShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactNumber: string;
}

export interface IPaymentDetails {
  method: 'cod' | 'card' | 'stripe';
  cardType?: 'credit' | 'debit';
  last4?: string;
  transactionId?: string;
  stripePaymentIntentId?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'card' | 'stripe';
  paymentDetails?: IPaymentDetails;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  receiptSent?: boolean;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, required: true },
}, { _id: false });

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  contactNumber: { type: String, required: true },
}, { _id: false });

const PaymentDetailsSchema = new Schema<IPaymentDetails>({
  method: { type: String, enum: ['cod', 'card', 'stripe'], required: true },
  cardType: { type: String, enum: ['credit', 'debit'] },
  last4: { type: String },
  transactionId: { type: String },
  stripePaymentIntentId: { type: String },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: [(v: IOrderItem[]) => v.length > 0, 'Order must have at least one item'],
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'stripe'],
    required: true,
  },
  paymentDetails: {
    type: PaymentDetailsSchema,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid',
  },
  receiptSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for user order history
OrderSchema.index({ userId: 1, createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
