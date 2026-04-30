import ProductDetail from './ProductDetail';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    
    return {
      ...product,
      _id: product._id.toString(),
      dateAdded: product.dateAdded.toISOString(),
      colorImages: (product.colorImages || []).map((ci: any) => ({
        color: ci.color,
        imageUrl: ci.imageUrl,
      })),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getReviews(productId: string) {
  try {
    await dbConnect();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
    return reviews.map(review => ({
      ...review,
      _id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      createdAt: review.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, reviews] = await Promise.all([
    getProduct(params.id),
    getReviews(params.id),
  ]);

  if (!product) {
    return (
      <section className="view active">
        <div className="page-container">
          <h1>Product Not Found</h1>
          <p>The requested product could not be found.</p>
        </div>
      </section>
    );
  }

  return <ProductDetail product={product} reviews={reviews} />;
}
