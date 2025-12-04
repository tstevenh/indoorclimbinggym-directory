export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  link: string;
  badge?: string;
  category: 'shoes' | 'gear' | 'training' | 'apparel' | 'books';
}

export const AFFILIATE_PRODUCTS: Product[] = [
  // Add your products here. Example:
  /*
  {
    id: 'example-shoe',
    name: "Example Climbing Shoe",
    description: "Great for beginners.",
    price: "$89.00",
    imageUrl: "https://example.com/image.jpg",
    link: "https://your-affiliate-link.com",
    category: 'shoes'
  }
  */
];

export function getRandomProducts(count: number = 3, category?: string): Product[] {
  let filtered = AFFILIATE_PRODUCTS;
  if (category) {
    filtered = AFFILIATE_PRODUCTS.filter(p => p.category === category);
  }
  
  // Shuffle array
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}