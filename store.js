/* =====================================================
   STORE.JS — Dados e configurações da loja
   ===================================================== */

const STORE_CONFIG = {
  name: 'Hospen',
  currency: 'BRL',
  freeShippingThreshold: 150,
  shippingCost: 15.90,
};

const CATEGORIES = [
  { id: 'eletronicos', name: 'Eletrônicos', icon: '📱' },
  { id: 'moda', name: 'Moda', icon: '👗' },
  { id: 'casa', name: 'Casa & Deco', icon: '🏠' },
  { id: 'esportes', name: 'Esportes', icon: '⚽' },
  { id: 'beleza', name: 'Beleza', icon: '💄' },
  { id: 'livros', name: 'Livros', icon: '📚' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Camisa dry fit',
    category: '',
    categoryLabel: '',
    price: 129.90,
    originalPrice: 189.90,
    image: 'camisa1.png',
    rating: 4.8,
    reviews: 134,
    badge: 'sale',
    featured: true,
    bestSeller: true,
    description: 'Camisa dry fit confortável, ideal para atividades físicas e uso diário.',
    stock: 25,
  },
  {
    id: 2,
    name: 'Tênis Esportivo Urban Runner',
    category: 'esportes',
    categoryLabel: 'Esportes',
    price: 219.90,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    rating: 4.9,
    reviews: 89,
    badge: 'new',
    featured: true,
    bestSeller: true,
    description: 'Tênis com tecnologia de amortecimento avançado, ideal para corridas e treinos intensos.',
    stock: null,
  },
  {
    id: 3,
    name: 'Smartwatch Fit Pro Series 5',
    category: 'eletronicos',
    categoryLabel: 'Eletrônicos',
    price: 349.90,
    originalPrice: 499.90,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    rating: 4.7,
    reviews: 212,
    badge: 'sale',
    featured: true,
    bestSeller: false,
    description: 'Smartwatch com monitor cardíaco, GPS, 50+ modos esportivos e 7 dias de bateria.',
    stock: null,
  },
  {
    id: 4,
    name: 'Mochila Executiva Slim',
    category: 'moda',
    categoryLabel: 'Moda',
    price: 129.90,
    originalPrice: 179.90,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    rating: 4.6,
    reviews: 67,
    badge: 'sale',
    featured: true,
    bestSeller: false,
    description: 'Mochila elegante e funcional com compartimento para notebook de até 15.6" e porta USB.',
    stock: null,
  },
  {
    id: 5,
    name: 'Luminária LED de Mesa',
    category: 'casa',
    categoryLabel: 'Casa & Deco',
    price: 89.90,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    rating: 4.5,
    reviews: 45,
    badge: 'new',
    featured: false,
    bestSeller: true,
    description: 'Luminária LED com 3 modos de cor, intensidade ajustável e carregador USB integrado.',
    stock: null,
  },
  {
    id: 6,
    name: 'Kit Skincare Hidratação Intensa',
    category: 'beleza',
    categoryLabel: 'Beleza',
    price: 149.90,
    originalPrice: 200.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    rating: 4.9,
    reviews: 178,
    badge: 'sale',
    featured: false,
    bestSeller: true,
    description: 'Kit completo com sérum, hidratante e protetor solar para uma pele radiante.',
    stock: null,
  },
  {
    id: 7,
    name: 'Caixa de Som Portátil 360°',
    category: 'eletronicos',
    categoryLabel: 'Eletrônicos',
    price: 279.90,
    originalPrice: 349.90,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    rating: 4.7,
    reviews: 93,
    badge: 'sale',
    featured: false,
    bestSeller: true,
    description: 'Caixa de som com som 360°, resistente à água, 24h de bateria e conexão Bluetooth 5.0.',
    stock: null,
  },
  {
    id: 8,
    name: 'Camiseta Premium Básica',
    category: 'moda',
    categoryLabel: 'Moda',
    price: 59.90,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    rating: 4.4,
    reviews: 312,
    badge: 'new',
    featured: false,
    bestSeller: true,
    description: 'Camiseta de algodão premium, corte moderno, disponível em diversas cores e tamanhos.',
    stock: null,
  },
  {
    id: 9,
    name: 'Panela Antiaderente Ceramic Pro',
    category: 'casa',
    categoryLabel: 'Casa & Deco',
    price: 119.90,
    originalPrice: 160.00,
    image: 'https://images.unsplash.com/photo-1584990347449-39e56b58fa93?w=400&q=80',
    rating: 4.8,
    reviews: 56,
    badge: 'sale',
    featured: false,
    bestSeller: false,
    description: 'Panela com revestimento cerâmico antiaderente, base de indução e cabo ergonômico.',
    stock: null,
  },
  {
    id: 10,
    name: 'Livro: Mindset — A Nova Psicologia do Sucesso',
    category: 'livros',
    categoryLabel: 'Livros',
    price: 42.90,
    originalPrice: 54.90,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    rating: 4.9,
    reviews: 428,
    badge: 'sale',
    featured: false,
    bestSeller: false,
    description: 'Bestseller internacional que explica como a mentalidade influencia nossas conquistas.',
    stock: null,
  },
  {
    id: 11,
    name: 'Óculos de Sol Polarizado UV400',
    category: 'moda',
    categoryLabel: 'Moda',
    price: 139.90,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    rating: 4.6,
    reviews: 71,
    badge: 'new',
    featured: false,
    bestSeller: false,
    description: 'Óculos com lentes polarizadas, proteção UV400 e armação leve de acetato.',
    stock: null,
  },
  {
    id: 12,
    name: 'Tapete Fitness Antiderrapante',
    category: 'esportes',
    categoryLabel: 'Esportes',
    price: 99.90,
    originalPrice: 139.90,
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80',
    rating: 4.7,
    reviews: 188,
    badge: 'sale',
    featured: false,
    bestSeller: false,
    description: 'Tapete de yoga e fitness com espessura de 6mm, material TPE ecológico e antiderrapante.',
    stock: null,
  },
];

/* =====================================================
   HELPERS
   ===================================================== */
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcDiscount(original, current) {
  if (!original) return 0;
  return Math.round(((original - current) / original) * 100);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getProductsByFilter(filter) {
  if (filter === 'sale') return PRODUCTS.filter(p => p.badge === 'sale');
  if (filter === 'new') return PRODUCTS.filter(p => p.badge === 'new');
  return PRODUCTS;
}
