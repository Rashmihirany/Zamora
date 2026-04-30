import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly'; // weekly | monthly | yearly

    const now = new Date();
    let startDate: Date;
    let groupFormat: string;
    let labels: string[] = [];

    if (period === 'yearly') {
      // Last 12 months
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      groupFormat = '%Y-%m';
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      }
    } else if (period === 'monthly') {
      // Last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else {
      // Last 7 days
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupFormat = '%Y-%m-%d';
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    }

    // Revenue over time
    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order count over time
    const orderData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQty: { $sum: '$items.qty' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          imageUrl: { $first: '$items.imageUrl' },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    // Revenue summary
    const totalRevenueAll = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenuePeriod = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalOrdersPeriod = await Order.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Build revenue/order arrays mapped to labels
    const revenueMap = new Map(revenueData.map((r: any) => [r._id, r.revenue]));
    const orderMap = new Map(orderData.map((o: any) => [o._id, o.count]));

    // Generate expected date keys
    const revenueValues: number[] = [];
    const orderValues: number[] = [];

    if (period === 'yearly') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        revenueValues.push(revenueMap.get(key) || 0);
        orderValues.push(orderMap.get(key) || 0);
      }
    } else {
      const days = period === 'monthly' ? 30 : 7;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        revenueValues.push(revenueMap.get(key) || 0);
        orderValues.push(orderMap.get(key) || 0);
      }
    }

    return NextResponse.json({
      labels,
      revenue: revenueValues,
      orders: orderValues,
      topProducts,
      summary: {
        totalRevenueAll: totalRevenueAll[0]?.total || 0,
        totalRevenuePeriod: totalRevenuePeriod[0]?.total || 0,
        totalOrdersPeriod,
        avgOrderValue:
          totalOrdersPeriod > 0
            ? (totalRevenuePeriod[0]?.total || 0) / totalOrdersPeriod
            : 0,
      },
    });
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
