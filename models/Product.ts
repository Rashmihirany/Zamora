import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  colorImages: { color: string; imageUrl: string }[];
  inStock: boolean;
  dateAdded: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Dresses', 'Tops', 'Trousers', 'Denim', 'Skirts'],
  },
  subCategory: {
    type: String,
    required: true,
    enum: ['formal', 'party', 'office', 'casual'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  colorImages: [
    {
      color: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for common queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ dateAdded: -1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
