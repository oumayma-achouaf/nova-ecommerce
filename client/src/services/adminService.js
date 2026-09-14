const STORAGE_PREFIX = 'nova_admin_'

export const adminProfileChangedEvent = 'nova:admin-profile-updated'

export const defaultAdminProfile = {
  firstName: 'Omaima',
  lastName: 'Achouaf',
  fullName: 'Omaima Achouaf',
  initials: 'OA',
  role: 'Administrateur',
  email: 'omaima.achouaf@nova.ma',
  phone: '+212 6 12 34 56 78',
  location: 'Maroc',
  memberSince: '12 mars 2023',
  address: '123 Avenue Mohammed V\nCasablanca, Maroc',
}

export const initialProducts = [
  {
    id: 1,
    name: 'Baskets Nova Premium',
    sku: 'NV001',
    description:
      'Baskets premium au style minimaliste, concues pour une silhouette moderne et un confort quotidien.',
    category: 'Chaussures',
    subcategory: 'Baskets',
    regularPrice: '850',
    salePrice: '680',
    taxRate: '20',
    quantity: '24',
    stockStatus: 'in-stock',
    lowStockThreshold: '6',
    sizes: ['42'],
    colors: ['Blanc casse'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: true,
    isNew: true,
    image: '/images/products/nova-product-sneakers.jpg',
    fallback: 'shoe',
    sales: 320,
    date: '28 sept. 2026',
  },
  {
    id: 2,
    name: 'Sac Elise',
    sku: 'NV002',
    description:
      'Sac structure avec finitions premium, pense pour accompagner les looks NOVA du quotidien.',
    category: 'Accessoires',
    subcategory: 'Sacs',
    regularPrice: '1290',
    salePrice: '',
    taxRate: '20',
    quantity: '15',
    stockStatus: 'in-stock',
    lowStockThreshold: '4',
    sizes: [],
    colors: ['Noir'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: true,
    isNew: false,
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'bag',
    sales: 280,
    date: '27 sept. 2026',
  },
  {
    id: 3,
    name: 'Pull en cachemire',
    sku: 'NV003',
    description:
      'Pull doux en cachemire melange, coupe confortable et finitions soignees.',
    category: 'Vetements',
    subcategory: 'Pulls',
    regularPrice: '1000',
    salePrice: '850',
    taxRate: '20',
    quantity: '8',
    stockStatus: 'low-stock',
    lowStockThreshold: '8',
    sizes: ['M'],
    colors: ['Beige'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: false,
    isNew: false,
    image: '/images/products/nova-product-sweater.jpg',
    fallback: 'clothes',
    sales: 250,
    date: '26 sept. 2026',
  },
  {
    id: 4,
    name: 'Montre Horizon',
    sku: 'NV004',
    description:
      'Montre minimaliste avec bracelet premium et cadran epure.',
    category: 'Accessoires',
    subcategory: 'Montres',
    regularPrice: '1490',
    salePrice: '',
    taxRate: '20',
    quantity: '12',
    stockStatus: 'in-stock',
    lowStockThreshold: '5',
    sizes: [],
    colors: ['Noir'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: true,
    isNew: false,
    image: '/images/products/nova-product-watch.jpg',
    fallback: 'watch',
    sales: 190,
    date: '25 sept. 2026',
  },
  {
    id: 5,
    name: 'Lunettes Solis',
    sku: 'NV005',
    description:
      'Lunettes solaires legeres avec protection UV et monture elegante.',
    category: 'Accessoires',
    subcategory: 'Lunettes',
    regularPrice: '550',
    salePrice: '',
    taxRate: '20',
    quantity: '0',
    stockStatus: 'out-stock',
    lowStockThreshold: '5',
    sizes: [],
    colors: ['Noir'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: false,
    isNew: false,
    image: '/images/products/nova-category-accessories.jpg',
    fallback: 'glasses',
    sales: 150,
    date: '24 sept. 2026',
  },
  {
    id: 6,
    name: 'Veste Elegance',
    sku: 'NV006',
    description:
      'Veste structuree pour un style habille, confortable au quotidien.',
    category: 'Vetements',
    subcategory: 'Vestes',
    regularPrice: '1200',
    salePrice: '',
    taxRate: '20',
    quantity: '18',
    stockStatus: 'in-stock',
    lowStockThreshold: '5',
    sizes: ['M', 'L'],
    colors: ['Noir'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: false,
    isNew: true,
    image: '/images/products/nova-category-men.jpg',
    fallback: 'jacket',
    sales: 120,
    date: '23 sept. 2026',
  },
  {
    id: 7,
    name: 'Chemise Classique',
    sku: 'NV007',
    description:
      'Chemise classique ivoire, facile a associer avec les essentiels NOVA.',
    category: 'Vetements',
    subcategory: 'Chemises',
    regularPrice: '450',
    salePrice: '',
    taxRate: '20',
    quantity: '6',
    stockStatus: 'low-stock',
    lowStockThreshold: '6',
    sizes: ['M'],
    colors: ['Ivoire'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: false,
    isNew: false,
    image: '/images/products/nova-category-men.jpg',
    fallback: 'shirt',
    sales: 98,
    date: '22 sept. 2026',
  },
  {
    id: 8,
    name: 'Casquette Nova',
    sku: 'NV008',
    description:
      'Casquette sobre avec broderie NOVA, taille ajustable.',
    category: 'Accessoires',
    subcategory: 'Casquettes',
    regularPrice: '350',
    salePrice: '',
    taxRate: '20',
    quantity: '0',
    stockStatus: 'out-stock',
    lowStockThreshold: '5',
    sizes: [],
    colors: ['Olive'],
    publicationStatus: 'published',
    visibility: 'visible',
    featured: false,
    isNew: false,
    image: '/images/products/nova-category-accessories.jpg',
    fallback: 'cap',
    sales: 75,
    date: '21 sept. 2026',
  },
]

export const initialCategories = [
  {
    id: 1,
    name: 'Chaussures',
    slug: 'chaussures',
    description: 'Baskets, sneakers et chaussures elegantes',
    products: 68,
    status: 'Active',
    statusType: 'active',
    date: '28 sept. 2026',
    image: '/images/products/nova-product-sneakers.jpg',
    fallback: 'shoes',
  },
  {
    id: 2,
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Sacs, montres, lunettes et plus',
    products: 52,
    status: 'Active',
    statusType: 'active',
    date: '27 sept. 2026',
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'bag',
  },
  {
    id: 3,
    name: 'Vetements Homme',
    slug: 'vetements-homme',
    description: 'Collection de vetements pour homme',
    products: 94,
    status: 'Active',
    statusType: 'active',
    date: '26 sept. 2026',
    image: '/images/products/nova-category-men.jpg',
    fallback: 'menswear',
  },
  {
    id: 4,
    name: 'Vetements Femme',
    slug: 'vetements-femme',
    description: 'Collection de vetements pour femme',
    products: 76,
    status: 'Active',
    statusType: 'active',
    date: '25 sept. 2026',
    image: '/images/products/nova-category-women.jpg',
    fallback: 'womenswear',
  },
  {
    id: 5,
    name: 'Lunettes',
    slug: 'lunettes',
    description: 'Lunettes de soleil et de vue',
    products: 28,
    status: 'Inactive',
    statusType: 'inactive',
    date: '24 sept. 2026',
    image: '',
    fallback: 'glasses',
  },
  {
    id: 6,
    name: 'Montres',
    slug: 'montres',
    description: 'Montres pour tous les styles',
    products: 34,
    status: 'Active',
    statusType: 'active',
    date: '23 sept. 2026',
    image: '/images/products/nova-product-watch.jpg',
    fallback: 'watch',
  },
  {
    id: 7,
    name: 'Casquettes',
    slug: 'casquettes',
    description: 'Casquettes et chapeaux tendance',
    products: 18,
    status: 'Inactive',
    statusType: 'inactive',
    date: '22 sept. 2026',
    image: '',
    fallback: 'cap',
  },
  {
    id: 8,
    name: 'Bijoux',
    slug: 'bijoux',
    description: 'Bijoux elegants et modernes',
    products: 12,
    status: 'Active',
    statusType: 'active',
    date: '21 sept. 2026',
    image: '',
    fallback: 'jewelry',
  },
]

export const initialCustomers = [
  {
    id: 1,
    name: 'Yassine Benali',
    initials: 'YB',
    email: 'yassine.benali@gmail.com',
    phone: '0701 23 45 67',
    city: 'Casablanca',
    orders: 12,
    spent: 7850,
    status: 'Actif',
    statusType: 'active',
    date: '12 sept. 2026',
    tags: ['VIP', 'Casablanca', 'Paiement carte'],
    note: 'Prefere la livraison en matinee. Tres bon historique de paiement.',
  },
  {
    id: 2,
    name: 'Sara El Amrani',
    initials: 'SA',
    email: 'sara.elamrani@gmail.com',
    phone: '0605 67 89 12',
    city: 'Rabat',
    orders: 8,
    spent: 5240,
    status: 'Actif',
    statusType: 'active',
    date: '10 sept. 2026',
    tags: ['Fidele', 'Rabat', 'PayPal'],
    note: 'Cliente reactive aux campagnes accessoires.',
  },
  {
    id: 3,
    name: 'Omar Haddad',
    initials: 'OH',
    email: 'omar.haddad@gmail.com',
    phone: '0662 34 56 78',
    city: 'Marrakech',
    orders: 15,
    spent: 12300,
    status: 'Actif',
    statusType: 'active',
    date: '8 sept. 2026',
    tags: ['Premium', 'Marrakech', 'Livraison rapide'],
    note: 'Panier moyen eleve sur les nouveautes homme.',
  },
  {
    id: 4,
    name: 'Lina Kettani',
    initials: 'LK',
    email: 'lina.kettani@gmail.com',
    phone: '0611 22 33 44',
    city: 'Fes',
    orders: 5,
    spent: 3200,
    status: 'Inactif',
    statusType: 'inactive',
    date: '5 sept. 2026',
    tags: ['Reactivation', 'Fes'],
    note: 'Aucune commande depuis plusieurs semaines.',
  },
  {
    id: 5,
    name: 'Mehdi Rachid',
    initials: 'MR',
    email: 'mehdi.rachid@gmail.com',
    phone: '0600 11 22 33',
    city: 'Tanger',
    orders: 9,
    spent: 6750,
    status: 'Actif',
    statusType: 'active',
    date: '3 sept. 2026',
    tags: ['Fidele', 'Promo'],
    note: 'Interesse par les offres accessoires.',
  },
  {
    id: 6,
    name: 'Adam El Fassi',
    initials: 'AF',
    email: 'adam.fassi@gmail.com',
    phone: '0612 98 76 54',
    city: 'Agadir',
    orders: 3,
    spent: 1950,
    status: 'Bloque',
    statusType: 'blocked',
    date: '28 aout 2026',
    tags: ['Verification'],
    note: 'Compte bloque localement pour verification.',
  },
  {
    id: 7,
    name: 'Nour El Idrissi',
    initials: 'NI',
    email: 'nour.idrissi@gmail.com',
    phone: '0655 44 33 22',
    city: 'Meknes',
    orders: 7,
    spent: 4800,
    status: 'Actif',
    statusType: 'active',
    date: '25 aout 2026',
    tags: ['Fidele'],
    note: 'Cliente reguliere sur les nouveautes.',
  },
  {
    id: 8,
    name: 'Karim Zahiri',
    initials: 'KZ',
    email: 'karim.zahiri@gmail.com',
    phone: '0677 88 99 00',
    city: 'Oujda',
    orders: 4,
    spent: 2150,
    status: 'Actif',
    statusType: 'active',
    date: '20 aout 2026',
    tags: ['Support'],
    note: 'A contacte le support pour une question de taille.',
  },
]

export const initialPromotions = [
  {
    id: 1,
    title: 'Offre Speciale Sneakers',
    code: 'SNEAKERS20',
    type: 'Code promo',
    typeClass: 'code',
    reduction: '-20%',
    period: '1 sept. 2026 - 30 sept. 2026',
    products: '24 produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-product-sneakers.jpg',
    fallback: 'sneakers',
  },
  {
    id: 2,
    title: 'Collection Automne',
    code: 'AUTOMNE15',
    type: 'Code promo',
    typeClass: 'code',
    reduction: '-15%',
    period: '15 sept. 2026 - 15 oct. 2026',
    products: '56 produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-category-women.jpg',
    fallback: 'women',
  },
  {
    id: 3,
    title: 'Livraison Gratuite',
    code: 'FREESHIP',
    type: 'Livraison',
    typeClass: 'delivery',
    reduction: 'Livraison gratuite',
    period: '1 sept. 2026 - 31 dec. 2026',
    products: 'Tous les produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'bag',
  },
  {
    id: 4,
    title: 'Jusqua 50% sur les lunettes',
    code: 'SUN50',
    type: 'Reduction',
    typeClass: 'discount',
    reduction: '-50%',
    period: '10 sept. 2026 - 25 sept. 2026',
    products: '12 produits',
    status: 'Planifiee',
    statusClass: 'planned',
    image: '/images/products/nova-category-accessories.jpg',
    fallback: 'glasses',
  },
  {
    id: 5,
    title: 'Offre Hommes',
    code: 'MEN10',
    type: 'Code promo',
    typeClass: 'code',
    reduction: '-10%',
    period: '5 sept. 2026 - 20 sept. 2026',
    products: '34 produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-category-men.jpg',
    fallback: 'men',
  },
  {
    id: 6,
    title: 'Offre Montres Premium',
    code: 'WATCH25',
    type: 'Reduction',
    typeClass: 'discount',
    reduction: '-25%',
    period: '12 sept. 2026 - 30 sept. 2026',
    products: '8 produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-product-watch.jpg',
    fallback: 'watch',
  },
  {
    id: 7,
    title: 'Soldes de fin de saison',
    code: 'SOLDES30',
    type: 'Reduction',
    typeClass: 'discount',
    reduction: '-30%',
    period: '1 aout 2026 - 15 sept. 2026',
    products: '120 produits',
    status: 'Expiree',
    statusClass: 'expired',
    image: '/images/products/nova-category-women.jpg',
    fallback: 'women',
  },
  {
    id: 8,
    title: 'Offre Accessoires',
    code: 'ACC10',
    type: 'Code promo',
    typeClass: 'code',
    reduction: '-10%',
    period: '18 sept. 2026 - 10 oct. 2026',
    products: '28 produits',
    status: 'Active',
    statusClass: 'active',
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'accessories',
  },
  {
    id: 9,
    title: 'Sacs de soiree',
    code: 'BAG18',
    type: 'Code promo',
    typeClass: 'code',
    reduction: '-18%',
    period: '22 sept. 2026 - 12 oct. 2026',
    products: '18 produits',
    status: 'Planifiee',
    statusClass: 'planned',
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'bag',
  },
  {
    id: 10,
    title: 'Avantage Fidelite',
    code: 'LOYAL12',
    type: 'Reduction',
    typeClass: 'discount',
    reduction: '-12%',
    period: '1 sept. 2026 - 30 sept. 2026',
    products: 'Tous les produits',
    status: 'Active',
    statusClass: 'active',
    image: '',
    fallback: 'loyalty',
  },
  {
    id: 11,
    title: 'Livraison Express offerte',
    code: 'EXPRESS',
    type: 'Livraison',
    typeClass: 'delivery',
    reduction: 'Livraison gratuite',
    period: '8 sept. 2026 - 28 sept. 2026',
    products: 'Tous les produits',
    status: 'Active',
    statusClass: 'active',
    image: '',
    fallback: 'delivery',
  },
  {
    id: 12,
    title: 'Archive Ete',
    code: 'SUMMER20',
    type: 'Reduction',
    typeClass: 'discount',
    reduction: '-20%',
    period: '15 aout 2026 - 5 sept. 2026',
    products: '44 produits',
    status: 'Expiree',
    statusClass: 'expired',
    image: '/images/products/nova-category-accessories.jpg',
    fallback: 'glasses',
  },
]

export const initialOrders = [
  {
    id: '#10024',
    initials: 'YB',
    customer: 'Yassine Benali',
    customerId: 1,
    products: '3 articles',
    amount: '1 290 DH',
    payment: 'Carte bancaire',
    paymentType: 'card',
    status: 'En attente',
    statusClass: 'pending',
    date: '30 sept. 2026',
  },
  {
    id: '#10023',
    initials: 'SA',
    customer: 'Sara El Amrani',
    customerId: 2,
    products: '1 article',
    amount: '850 DH',
    payment: 'PayPal',
    paymentType: 'paypal',
    status: 'Confirmee',
    statusClass: 'confirmed',
    date: '29 sept. 2026',
  },
  {
    id: '#10022',
    initials: 'OH',
    customer: 'Omar Haddad',
    customerId: 3,
    products: '2 articles',
    amount: '1 490 DH',
    payment: 'A la livraison',
    paymentType: 'delivery',
    status: 'En preparation',
    statusClass: 'preparing',
    date: '29 sept. 2026',
  },
  {
    id: '#10021',
    initials: 'LK',
    customer: 'Lina Kettani',
    customerId: 4,
    products: '1 article',
    amount: '680 DH',
    payment: 'Carte bancaire',
    paymentType: 'card',
    status: 'Expediee',
    statusClass: 'shipped',
    date: '28 sept. 2026',
  },
  {
    id: '#10020',
    initials: 'MR',
    customer: 'Mehdi Rachid',
    customerId: 5,
    products: '4 articles',
    amount: '2 350 DH',
    payment: 'PayPal',
    paymentType: 'paypal',
    status: 'Livree',
    statusClass: 'delivered',
    date: '27 sept. 2026',
  },
  {
    id: '#10019',
    initials: 'NC',
    customer: 'Nadia Cherif',
    customerId: 1,
    products: '2 articles',
    amount: '980 DH',
    payment: 'A la livraison',
    paymentType: 'delivery',
    status: 'Confirmee',
    statusClass: 'confirmed',
    date: '26 sept. 2026',
  },
  {
    id: '#10018',
    initials: 'KT',
    customer: 'Karim Tazi',
    customerId: 8,
    products: '1 article',
    amount: '750 DH',
    payment: 'Carte bancaire',
    paymentType: 'card',
    status: 'Annulee',
    statusClass: 'cancelled',
    date: '25 sept. 2026',
  },
  {
    id: '#10017',
    initials: 'SI',
    customer: 'Salma Idrissi',
    customerId: 7,
    products: '3 articles',
    amount: '1 890 DH',
    payment: 'PayPal',
    paymentType: 'paypal',
    status: 'Expediee',
    statusClass: 'shipped',
    date: '24 sept. 2026',
  },
]

export const orderStatusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmee',
  preparing: 'En preparation',
  shipped: 'Expediee',
  delivered: 'Livree',
  cancelled: 'Annulee',
}

export function readAdminStore(key, fallback) {
  try {
    const savedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`)

    return savedValue ? JSON.parse(savedValue) : fallback
  } catch {
    return fallback
  }
}

export function writeAdminStore(key, value) {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  return value
}

export function getAdminProfile() {
  return readAdminStore('profile', defaultAdminProfile)
}

export function saveAdminProfile(profile) {
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  const nextProfile = {
    ...profile,
    fullName: fullName || defaultAdminProfile.fullName,
    initials: getInitials(fullName || defaultAdminProfile.fullName),
  }

  writeAdminStore('profile', nextProfile)
  window.dispatchEvent(
    new CustomEvent(adminProfileChangedEvent, {
      detail: nextProfile,
    }),
  )

  return nextProfile
}

export function getInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

export function getProducts() {
  return readAdminStore('products', initialProducts)
}

export function saveProducts(products) {
  return writeAdminStore('products', products)
}

export function upsertProduct(product) {
  const products = getProducts()
  const id =
    product.id ||
    Math.max(0, ...products.map((item) => Number(item.id) || 0)) + 1
  const nextProduct = normalizeProductForList({
    ...product,
    id,
  })
  const exists = products.some((item) => Number(item.id) === Number(id))
  const nextProducts = exists
    ? products.map((item) =>
        Number(item.id) === Number(id) ? nextProduct : item,
      )
    : [nextProduct, ...products]

  saveProducts(nextProducts)
  return nextProduct
}

export function normalizeProductForList(product) {
  const regularPrice = Number(product.regularPrice || 0)
  const salePrice = Number(product.salePrice || 0)
  const quantity = Number(product.quantity || 0)
  const statusType =
    product.stockStatus ||
    (quantity === 0
      ? 'out-stock'
      : quantity <= Number(product.lowStockThreshold || 5)
        ? 'low-stock'
        : 'in-stock')

  return {
    ...product,
    regularPrice: String(product.regularPrice || regularPrice || ''),
    salePrice: product.salePrice ? String(product.salePrice) : '',
    quantity: String(product.quantity ?? quantity),
    lowStockThreshold: String(product.lowStockThreshold || 5),
    stockStatus: statusType,
    price: `${salePrice || regularPrice} DH`,
    oldPrice: salePrice && regularPrice ? `${regularPrice} DH` : null,
    stock: quantity,
    status:
      statusType === 'out-stock'
        ? 'Rupture'
        : statusType === 'low-stock'
          ? 'Stock faible'
          : 'En stock',
    statusType,
    sales: Number(product.sales || 0),
    date: product.date || 'Session locale',
    image: product.image || '',
    fallback: product.fallback || 'shoe',
  }
}

export function getCategories() {
  return readAdminStore('categories', initialCategories)
}

export function saveCategories(categories) {
  return writeAdminStore('categories', categories)
}

export function upsertCategory(category) {
  const categories = getCategories()
  const id =
    category.id ||
    Math.max(0, ...categories.map((item) => Number(item.id) || 0)) + 1
  const nextCategory = {
    ...category,
    id,
    slug: category.slug || slugify(category.name),
    status: category.statusType === 'inactive' ? 'Inactive' : 'Active',
    products: Number(category.products || 0),
    date: category.date || 'Session locale',
    fallback: category.fallback || 'jewelry',
  }
  const exists = categories.some((item) => Number(item.id) === Number(id))
  const nextCategories = exists
    ? categories.map((item) =>
        Number(item.id) === Number(id) ? nextCategory : item,
      )
    : [nextCategory, ...categories]

  saveCategories(nextCategories)
  return nextCategory
}

export function getCustomers() {
  return readAdminStore('customers', initialCustomers)
}

export function saveCustomers(customers) {
  return writeAdminStore('customers', customers)
}

export function getPromotions() {
  return readAdminStore('promotions', initialPromotions)
}

export function savePromotions(promotions) {
  return writeAdminStore('promotions', promotions)
}

export function upsertPromotion(promotion) {
  const promotions = getPromotions()
  const id =
    promotion.id ||
    Math.max(0, ...promotions.map((item) => Number(item.id) || 0)) + 1
  const nextPromotion = {
    ...promotion,
    id,
  }
  const exists = promotions.some((item) => Number(item.id) === Number(id))
  const nextPromotions = exists
    ? promotions.map((item) =>
        Number(item.id) === Number(id) ? nextPromotion : item,
      )
    : [nextPromotion, ...promotions]

  savePromotions(nextPromotions)
  return nextPromotion
}

export function getOrders() {
  return readAdminStore('orders', initialOrders)
}

export function saveOrders(orders) {
  return writeAdminStore('orders', orders)
}

export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function printInvoice(order) {
  const invoiceWindow = window.open('', '_blank', 'width=760,height=900')

  if (!invoiceWindow) {
    window.print()
    return
  }

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Facture ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #20231f; }
          h1 { margin: 0 0 8px; }
          .muted { color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
          .total { font-size: 20px; font-weight: 700; text-align: right; margin-top: 28px; }
        </style>
      </head>
      <body>
        <h1>NOVA - Facture ${order.id}</h1>
        <p class="muted">Client: ${order.customer}</p>
        <p class="muted">Date: ${order.date}</p>
        <table>
          <thead>
            <tr><th>Articles</th><th>Paiement</th><th>Statut</th><th>Montant</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.products}</td>
              <td>${order.payment}</td>
              <td>${order.status}</td>
              <td>${order.amount}</td>
            </tr>
          </tbody>
        </table>
        <p class="total">Total: ${order.amount}</p>
      </body>
    </html>
  `)
  invoiceWindow.document.close()
  invoiceWindow.focus()
  invoiceWindow.print()
}
