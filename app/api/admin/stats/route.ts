import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import GiftOrder from '@/models/GiftOrder';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();

    const [totalProducts, totalOrders, totalUsers, revenueResult, recentOrders, ordersByStatus, topProducts, totalGiftOrders, giftRevenueResult, recentGiftOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Order.find().sort({ createdAt: -1 }).limit(5).lean(),
        Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Order.aggregate([
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
        ]),
        GiftOrder.countDocuments(),
        GiftOrder.aggregate([
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        GiftOrder.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const giftRevenue = giftRevenueResult[0]?.total || 0;

    const statusMap: Record<string, number> = {};
    ordersByStatus.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue + giftRevenue,
      totalGiftOrders,
      giftRevenue,
      recentOrders,
      recentGiftOrders,
      ordersByStatus: statusMap,
      topProducts,
    });
  } catch (err: any) {
    console.error('Error fetching admin stats:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
