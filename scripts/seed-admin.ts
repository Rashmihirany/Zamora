import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Seed a single admin user without wiping existing data
// Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-admin.ts

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zamora';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

async function seedAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`User "${username}" already exists (role: ${existing.role}).`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated "${username}" role to admin.`);
      } else {
        console.log('Already an admin. Nothing to do.');
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Admin user "${username}" created successfully!`);
    }

    console.log('\nAdmin credentials:');
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDone.');
  }
}

seedAdmin();
