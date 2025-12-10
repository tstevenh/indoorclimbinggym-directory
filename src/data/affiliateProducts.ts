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
  // Shoes
  {
    id: 'ls-tarantulace-mens',
    name: "La Sportiva Men's Tarantulace",
    description: "Comfortable, unlined leather climbing shoe perfect for beginners and all-day wear.",
    price: "$98.95",
    imageUrl: "https://m.media-amazon.com/images/I/61uJgiKrioL._AC_SY695_.jpg",
    link: "https://amzn.to/4rO704b",
    badge: "Best for Beginners",
    category: 'shoes'
  },
  {
    id: 'ls-tarantulace-womens',
    name: "La Sportiva Women's Tarantulace",
    description: "Women's specific fit. Comfortable, unlined leather shoe for beginners.",
    price: "$98.95",
    imageUrl: "https://m.media-amazon.com/images/I/61pOv0UoPZL._AC_SY695_.jpg",
    link: "https://amzn.to/48vk9HU",
    category: 'shoes'
  },
  {
    id: 'ls-solution-comp-mens',
    name: "La Sportiva Men's Solution Comp",
    description: "High-performance shoe designed for maximum grip on plastic holds.",
    price: "$228.95",
    imageUrl: "https://m.media-amazon.com/images/I/81algaGliDL._AC_SY695_.jpg",
    link: "https://amzn.to/4pZYgGf",
    badge: "Pro Choice",
    category: 'shoes'
  },
  {
    id: 'ls-solution-comp-womens',
    name: "La Sportiva Women's Solution Comp",
    description: "High-performance women's shoe with softer heel cup for bouldering.",
    price: "$228.95",
    imageUrl: "https://m.media-amazon.com/images/I/81jimuENF-L._AC_SY695_.jpg",
    link: "https://amzn.to/48Yvy2Z",
    category: 'shoes'
  },
  {
    id: 'bd-momentum-mens',
    name: "Black Diamond Men's Momentum",
    description: "Engineered knit technology for breathability and all-day comfort.",
    price: "$94.88",
    imageUrl: "https://m.media-amazon.com/images/I/71A507cEy0L._AC_SX679_.jpg",
    link: "https://amzn.to/3KSWs30",
    category: 'shoes'
  },
  {
    id: 'bd-momentum-womens',
    name: "Black Diamond Women's Momentum",
    description: "Breathable, comfortable knit shoe designed for women's feet.",
    price: "$74.96",
    imageUrl: "https://m.media-amazon.com/images/I/712D3m9Vc5L._AC_SY695_.jpg",
    link: "https://amzn.to/4psi8Sy",
    badge: "Great Value",
    category: 'shoes'
  },

  // Gear (Harnesses, Chalk, etc.)
  {
    id: 'generic-chalk-bag',
    name: "Premium Rock Climbing Chalk Bag",
    description: "Large zipper storage pockets for phone/keys. Essential for gym and outdoor climbing.",
    price: "$15.99",
    imageUrl: "https://m.media-amazon.com/images/I/81CcE7HnHFL._AC_SL1500_.jpg",
    link: "https://amzn.to/3KnuKvh",
    category: 'gear'
  },
  {
    id: 'friction-labs-loose',
    name: "Friction Labs Premium Loose Chalk",
    description: "High purity magnesium carbonate for superior grip and healthier skin.",
    price: "$29.99",
    imageUrl: "https://m.media-amazon.com/images/I/81GWHsWfhBL._AC_SL1500_.jpg",
    link: "https://amzn.to/48FpRFS",
    badge: "Top Rated",
    category: 'gear'
  },
  {
    id: 'friction-labs-liquid',
    name: "Friction Labs Secret Stuff Liquid Chalk",
    description: "Alcohol-free liquid chalk base layer for maximum friction.",
    price: "$19.00",
    imageUrl: "https://m.media-amazon.com/images/I/710AgDIOioL._AC_SL1500_.jpg",
    link: "https://amzn.to/44i1zAp",
    category: 'gear'
  },
  {
    id: 'bd-momentum-harness',
    name: "Black Diamond Men's Momentum Harness",
    description: "The most popular all-around climbing harness. Dual core construction.",
    price: "$59.88",
    imageUrl: "https://m.media-amazon.com/images/I/71JceyaGVLL._AC_SL1200_.jpg",
    link: "https://amzn.to/48xmgLm",
    badge: "Gym Standard",
    category: 'gear'
  },
  {
    id: 'petzl-corax-harness',
    name: "Petzl Corax Harness",
    description: "Versatile, adjustable harness suitable for all body types and climbing styles.",
    price: "$79.95",
    imageUrl: "https://m.media-amazon.com/images/I/71MNnxhkixL._AC_SL1200_.jpg",
    link: "https://amzn.to/48x3aEY",
    category: 'gear'
  },
  {
    id: 'petzl-grigri',
    name: "Petzl Grigri Belay Device",
    description: "The industry standard belay device with cam-assisted blocking for sport and gym climbing.",
    price: "$103.00",
    imageUrl: "https://m.media-amazon.com/images/I/61kfRMRS5KS._AC_SY879_.jpg",
    link: "https://amzn.to/491TJ0u",
    badge: "Essential",
    category: 'gear'
  },
  {
    id: 'friction-labs-tape',
    name: "Friction Labs Finger Tape",
    description: "High-performance zinc oxide tape for skin protection and finger support.",
    price: "$9.99",
    imageUrl: "https://m.media-amazon.com/images/I/61lpTOEE8bL._AC_SX679_.jpg",
    link: "https://amzn.to/48Gu9g3",
    category: 'gear'
  },

  // Training
  {
    id: 'power-guidance-hangboard',
    name: "Power Guidance Wooden Hangboard",
    description: "Portable wooden hangboard for finger strength training anywhere.",
    price: "$79.99",
    imageUrl: "https://m.media-amazon.com/images/I/612VajAJwJL._AC_SL1500_.jpg",
    link: "https://amzn.to/4931eEg",
    category: 'training'
  },
  {
    id: 'fitbeast-grip-kit',
    name: "FitBeast Grip Strengthener Kit",
    description: "5-pack grip strength trainer kit including adjustable hand gripper, finger stretcher, and more.",
    price: "$16.99",
    imageUrl: "https://m.media-amazon.com/images/I/718tBdzFF6L._AC_SL1500_.jpg",
    link: "https://amzn.to/492OddW",
    category: 'training'
  }
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