import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('sub_category');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const sort = searchParams.get('sort');
    const inStock = searchParams.get('in_stock');
    const sizes = searchParams.get('sizes');       // comma-separated
    const colors = searchParams.get('colors');     // comma-separated

    // Build query
    const query: any = {};
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (inStock === 'true') query.inStock = true;
    
    // Price range
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    // Size filter (match any of selected sizes)
    if (sizes) {
      const sizeList = sizes.split(',').map((s) => s.trim()).filter(Boolean);
      if (sizeList.length > 0) {
        query.size = { $in: sizeList };
      }
    }

    // Color filter (match any of selected colors, case-insensitive)
    if (colors) {
      const colorList = colors.split(',').map((c) => c.trim()).filter(Boolean);
      if (colorList.length > 0) {
        query.color = { $in: colorList.map((c) => new RegExp(`^${c}$`, 'i')) };
      }
    }

    // Build sort option
    let sortOption: any = { dateAdded: -1 }; // default: newest first
    
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { dateAdded: 1 };

    const products = await Product.find(query).sort(sortOption).lean();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, category, subCategory, price, imageUrl, size, color, colorImages } = body;

    const product = await Product.create({
      name,
      category,
      subCategory,
      price,
      imageUrl,
      size,
      color,
      colorImages: colorImages || [],
      inStock: true,
      dateAdded: new Date(),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
