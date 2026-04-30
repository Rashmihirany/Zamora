import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Settings from '@/models/Settings';

// GET /api/admin/settings
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();

    // Get or create default settings (singleton)
    let settings: any = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create({});
      settings = created.toObject();
    }

    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();

    const body = await request.json();

    const allowedFields = [
      'storeName',
      'storeEmail',
      'storePhone',
      'storeAddress',
      'currency',
      'timezone',
      'maintenanceMode',
      'notifications',
    ];

    const update: Record<string, any> = { updatedAt: new Date() };
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(update);
    } else {
      Object.assign(settings, update);
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
