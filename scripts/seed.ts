import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Direct MongoDB connection for seeding
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zamora';

// Define schemas inline to avoid import issues with ts-node
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  dateAdded: { type: Date, default: Date.now },
});

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    });

    // Create products
    console.log('Creating products...');
    const products = [
      // Dresses (3 items)
      {
        name: 'Midnight Silk Gown',
        category: 'Dresses',
        subCategory: 'formal',
        price: 250.00,
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
        size: 'S,M,L',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 5),
      },
      {
        name: 'Ivory Cocktail Dress',
        category: 'Dresses',
        subCategory: 'party',
        price: 180.00,
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        size: 'XS,S,M',
        color: 'White',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 4),
      },
      {
        name: 'Structure Blazer Dress',
        category: 'Dresses',
        subCategory: 'office',
        price: 220.00,
        imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
        size: 'M,L,XL',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 3),
      },

      // Tops (3 items)
      {
        name: 'Sheer Organza Blouse',
        category: 'Tops',
        subCategory: 'party',
        price: 85.00,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        size: 'S,M',
        color: 'White',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 6),
      },
      {
        name: 'Classic Linen Button-Up',
        category: 'Tops',
        subCategory: 'office',
        price: 65.00,
        imageUrl: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop',
        size: 'S,M,L,XL',
        color: 'White',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 2),
      },
      {
        name: 'Silk Camisole',
        category: 'Tops',
        subCategory: 'casual',
        price: 95.00,
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
        size: 'S,M,L',
        color: 'Beige',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 1),
      },

      // Trousers (3 items)
      {
        name: 'Noir Wide Leg Trousers',
        category: 'Trousers',
        subCategory: 'office',
        price: 120.00,
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 7),
      },
      {
        name: 'Tailored Cigarette Pants',
        category: 'Trousers',
        subCategory: 'formal',
        price: 135.00,
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32,34',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(),
      },
      {
        name: 'Beige Linen Trousers',
        category: 'Trousers',
        subCategory: 'casual',
        price: 110.00,
        imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32',
        color: 'Beige',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 8),
      },

      // Denim (3 items)
      {
        name: 'Distressed Skinny Jeans',
        category: 'Denim',
        subCategory: 'casual',
        price: 95.00,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32,34',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 9),
      },
      {
        name: 'Classic Straight Denim',
        category: 'Denim',
        subCategory: 'casual',
        price: 105.00,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32,34',
        color: 'Navy',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 10),
      },
      {
        name: 'High-Rise Wide Leg Jeans',
        category: 'Denim',
        subCategory: 'casual',
        price: 115.00,
        imageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=800&auto=format&fit=crop',
        size: '28,30,32',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 11),
      },

      // Skirts (3 items)
      {
        name: 'Pleated Mini Skirt',
        category: 'Skirts',
        subCategory: 'casual',
        price: 55.00,
        imageUrl: 'https://images.unsplash.com/photo-1582142387190-6c9ab7f74e62?q=80&w=800&auto=format&fit=crop',
        size: 'S,M',
        color: 'White',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 12),
      },
      {
        name: 'Midi Pencil Skirt',
        category: 'Skirts',
        subCategory: 'office',
        price: 85.00,
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
        size: 'S,M,L',
        color: 'Black',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 13),
      },
      {
        name: 'Flowy Maxi Skirt',
        category: 'Skirts',
        subCategory: 'casual',
        price: 95.00,
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
        size: 'S,M,L,XL',
        color: 'Beige',
        inStock: true,
        dateAdded: new Date(Date.now() - 86400000 * 14),
      },
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
