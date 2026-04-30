import ProductsContent from './ProductsContent';

export const dynamic = 'force-dynamic';

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams();
  
  if (searchParams.category) params.append('category', searchParams.category as string);
  if (searchParams.sub_category) params.append('sub_category', searchParams.sub_category as string);
  if (searchParams.price_max) params.append('price_max', searchParams.price_max as string);
  if (searchParams.sort) params.append('sort', searchParams.sort as string);
  if (searchParams.in_stock) params.append('in_stock', searchParams.in_stock as string);
  if (searchParams.sizes) params.append('sizes', searchParams.sizes as string);
  if (searchParams.colors) params.append('colors', searchParams.colors as string);

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error('Failed to fetch products');
    
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);
  const category = searchParams.category as string | undefined;

  return (
    <ProductsContent 
      initialProducts={products} 
      category={category} 
    />
  );
}
