import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const reviews = await Review.find({ productId: params.productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
