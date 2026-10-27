import {
  Brand,
  Category,
  CustomerRequest,
  Offer,
  Product,
  StoreSettings,
  UseCaseTag,
} from '../types/store';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: {
    ar: 'بيكسل ستور — PIXEL STORE',
    en: 'PIXEL STORE',
  },
  tagline: {
    ar: 'أجهزة لابتوب، قطع كمبيوتر، تجميعات مكتبية، وملحقات الألعاب والعمل',
    en: 'Laptops, PC Components, Custom Builds, & Gaming / Office Peripherals',
  },
  usdToSypRate: 12500,
  phone: '+963 XXX XXX XXX',
  whatsappNumber: '963000000000',
  address: {
    ar: '[عنوان المتجر — يتم تحديده من الإعدادات]',
    en: '[Store Location — Configurable in Settings]',
  },
  workingHours: {
    ar: '[أوقات العمل — يتم تحديدها من الإعدادات]',
    en: '[Working Hours — Configurable in Settings]',
  },
  instagramHandle: '@pixelstore',
  facebookPage: 'fb.com/pixelstore',
  telegramChannel: 't.me/pixelstore',
  topPromoBanner: {
    ar: 'أسعار المنتجات محدثة بالدولار والليرة السورية — سعر الصرف الحالي: 1$ = 12,500 ل.س',
    en: 'Dual USD & SYP Pricing — Current Exchange Rate: 1 USD = 12,500 SYP',
  },
  topPromoActive: true,
};

export const INITIAL_BRANDS: Brand[] = [
  { id: 'asus', name: 'ASUS ROG', country: { ar: 'تايوان', en: 'Taiwan' }, featured: true },
  { id: 'lenovo', name: 'Lenovo', country: { ar: 'الصين / عالمي', en: 'Global' }, featured: true },
  { id: 'logitech', name: 'Logitech G', country: { ar: 'سويسرا', en: 'Switzerland' }, featured: true },
  { id: 'razer', name: 'Razer', country: { ar: 'الولايات المتحدة', en: 'USA' }, featured: true },
  { id: 'redragon', name: 'Redragon', country: { ar: 'الصين', en: 'China' }, featured: true },
  { id: 'hyperx', name: 'HyperX', country: { ar: 'الولايات المتحدة', en: 'USA' }, featured: true },
  { id: 'nvidia', name: 'PNY / NVIDIA', country: { ar: 'الولايات المتحدة', en: 'USA' }, featured: true },
  { id: 'amd', name: 'AMD', country: { ar: 'الولايات المتحدة', en: 'USA' }, featured: true },
  { id: 'kingston', name: 'Kingston FURY', country: { ar: 'الولايات المتحدة', en: 'USA' }, featured: true },
  { id: 'moondrop', name: 'Moondrop Audio', country: { ar: 'الصين', en: 'China' }, featured: false },
  { id: 'anker', name: 'Anker', country: { ar: 'الصين', en: 'China' }, featured: false },
];

export const INITIAL_USE_CASE_TAGS: UseCaseTag[] = [
  {
    id: 'gaming',
    name: { ar: 'مخصص للألعاب (Gaming)', en: 'Gaming & Esports' },
    subtitle: {
      ar: 'استجابة فائقة، إضاءة RGB، ومعدلات تحديث عالية للمحترفين',
      en: 'Ultra-low latency, high polling rates, and tournament-grade performance',
    },
    applicableCategories: ['laptops', 'accessories', 'keyboards', 'mice', 'audio', 'pc-builds'],
    accentColor: 'purple',
    visualKey: 'usecase-gaming',
  },
  {
    id: 'office',
    name: { ar: 'مكتبي واحترافي (Office)', en: 'Office & Ergonomic' },
    subtitle: {
      ar: 'كتابة هادئة، راحة لساعات العمل الطويلة، واتصال لاسلكي متعدد',
      en: 'Quiet switches, ergonomic comfort, and multi-device productivity',
    },
    applicableCategories: ['accessories', 'keyboards', 'mice'],
    accentColor: 'coral',
    visualKey: 'usecase-office',
  },
  {
    id: 'work-study',
    name: { ar: 'للعمل والدراسة والمونتاج', en: 'Work, Study & Creator' },
    subtitle: {
      ar: 'أداء موثوق للبرمجة، التصميم الهندسي، والمحاضرات الجامعية',
      en: 'Dependable battery life and compute power for coding, CAD, and university',
    },
    applicableCategories: ['laptops', 'pc-builds'],
    accentColor: 'pink',
    visualKey: 'usecase-work',
  },
  {
    id: 'everyday',
    name: { ar: 'للاستخدام اليومي (Everyday)', en: 'Everyday & Portable' },
    subtitle: {
      ar: 'خفيف الوزن، عملي، وقيمة ممتازة مقابل السعر للاستخدام اليومي',
      en: 'Lightweight, practical hardware with exceptional everyday value',
    },
    applicableCategories: ['laptops', 'audio', 'accessories'],
    accentColor: 'coral',
    visualKey: 'usecase-everyday',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  // Top-level categories
  {
    id: 'laptops',
    name: { ar: 'اللابتوبات', en: 'Laptops' },
    description: {
      ar: 'لابتوبات جديدة ومستعملة مفحوصة بدقة للألعاب، الهندسة، والدراسة الجامعية.',
      en: 'Brand-new and certified clean used laptops for gaming, engineering, and study.',
    },
    iconKey: 'laptop',
    useCaseIds: ['gaming', 'work-study', 'everyday'],
    visualKey: 'cat-laptops',
  },
  {
    id: 'pc-components',
    name: { ar: 'قطع الكمبيوتر (PC Components)', en: 'PC Components' },
    description: {
      ar: 'كروت شاشة، معالجات، لوحات أم، رامات، وحدات تخزين NVMe، ومزودات طاقة أصلية.',
      en: 'Graphics cards, CPUs, motherboards, DDR5 RAM, NVMe SSDs, and 80+ Gold PSUs.',
    },
    iconKey: 'cpu',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'cat-components',
  },
  {
    id: 'accessories',
    name: { ar: 'الإكسسوارات والملحقات', en: 'Accessories & Peripherals' },
    description: {
      ar: 'لوحات مفاتيح ميكانيكية ومكتبية، ماوسات احترافية، شواحن GaN وكابلات أصلية.',
      en: 'Mechanical & office keyboards, precision mice, GaN chargers, and high-speed cables.',
    },
    iconKey: 'keyboard',
    useCaseIds: ['gaming', 'office', 'everyday'],
    visualKey: 'cat-accessories',
  },
  {
    id: 'audio',
    name: { ar: 'الصوتيات والسماعات', en: 'Audio & Headsets' },
    description: {
      ar: 'سماعات محيطية للألعاب، سماعات Earbuds لاسلكية، وسماعات IEM احترافية.',
      en: 'Surround gaming headsets, ANC wireless earbuds, and audiophile IEM monitors.',
    },
    iconKey: 'headphones',
    useCaseIds: ['gaming', 'everyday'],
    visualKey: 'cat-audio',
  },
  {
    id: 'pc-builds',
    name: { ar: 'تجميعات PC احترافية', en: 'Custom PC Builds' },
    description: {
      ar: 'تجميعات جاهزة ومختبرة للألعاب بدقة 2K/4K ومحطات عمل للمونتاج والرندر.',
      en: 'Pre-tested custom gaming rigs and creator workstations with clean cable routing.',
    },
    iconKey: 'pc',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'cat-builds',
  },

  // Subcategories under Laptops
  {
    id: 'new-laptops',
    parentId: 'laptops',
    name: { ar: 'لابتوبات جديدة (New)', en: 'New Laptops' },
    description: {
      ar: 'أحدث اللابتوبات بالكرتونة المختومة مع كفالة Pixel Store.',
      en: 'Factory-sealed brand new laptops with full store warranty.',
    },
    iconKey: 'laptop',
    useCaseIds: ['gaming', 'work-study', 'everyday'],
    visualKey: 'sub-new-laptops',
  },
  {
    id: 'used-laptops',
    parentId: 'laptops',
    name: { ar: 'لابتوبات مستعملة نظيفة (Used)', en: 'Used Laptops' },
    description: {
      ar: 'لابتوبات مستعملة بحالة ممتازة ومفحوصة بالكامل بأفضل سعر.',
      en: 'Thoroughly tested pre-owned laptops in clean condition at great value.',
    },
    iconKey: 'laptop',
    useCaseIds: ['gaming', 'work-study', 'everyday'],
    visualKey: 'sub-used-laptops',
  },

  // Subcategories under Accessories
  {
    id: 'keyboards',
    parentId: 'accessories',
    name: { ar: 'لوحات المفاتيح (Keyboards)', en: 'Keyboards' },
    description: {
      ar: 'اختر بين لوحات المفاتيح الميكانيكية للألعاب أو اللوحات الهادئة للعمل المكتبي.',
      en: 'Choose between mechanical gaming keyboards and whisper-quiet office keyboards.',
    },
    iconKey: 'keyboard',
    useCaseIds: ['gaming', 'office'],
    visualKey: 'sub-keyboards',
  },
  {
    id: 'mice',
    parentId: 'accessories',
    name: { ar: 'الفأرات (Mice)', en: 'Mice' },
    description: {
      ar: 'ماوسات ألعاب فائقة الخفة وماوسات مكتبية مريحة لليد.',
      en: 'Ultra-lightweight esports mice and ergonomic wireless office mice.',
    },
    iconKey: 'mouse',
    useCaseIds: ['gaming', 'office'],
    visualKey: 'sub-mice',
  },
  {
    id: 'chargers-cables',
    parentId: 'accessories',
    name: { ar: 'الشواحن والكابلات والمحولات', en: 'Chargers, Cables & Adapters' },
    description: {
      ar: 'شواحن GaN سريعة، كابلات Type-C PD، وموزعات USB-C متعدّدة المنافذ.',
      en: 'GaN fast chargers, 100W Type-C cables, DisplayPort 1.4 cables, and USB-C hubs.',
    },
    iconKey: 'cable',
    useCaseIds: ['everyday', 'office'],
    visualKey: 'sub-chargers',
  },

  // Subcategories under Audio
  {
    id: 'gaming-headsets',
    parentId: 'audio',
    name: { ar: 'سماعات الألعاب (Gaming Headsets)', en: 'Gaming Headsets' },
    description: {
      ar: 'صوت محيطي 7.1 وميكروفون عازل للضوضاء لتحديد خطوات الخصم بدقة.',
      en: 'Spatial 7.1 surround sound and noise-canceling boom mics for competitive play.',
    },
    iconKey: 'headphones',
    useCaseIds: ['gaming'],
    visualKey: 'sub-headsets',
  },
  {
    id: 'earbuds',
    parentId: 'audio',
    name: { ar: 'سماعات لاسلكية (Wireless Earbuds)', en: 'Wireless Earbuds' },
    description: {
      ar: 'سماعات بلوتوث بعزل ضوضاء ANC وبطارية تدوم طوال اليوم.',
      en: 'True wireless earbuds with active noise cancellation and low-latency mode.',
    },
    iconKey: 'earbuds',
    useCaseIds: ['everyday', 'gaming'],
    visualKey: 'sub-earbuds',
  },
  {
    id: 'iem',
    parentId: 'audio',
    name: { ar: 'سماعات IEM الاحترافية', en: 'IEM Earphones' },
    description: {
      ar: 'سماعات داخل الأذن بدقة صوتية عالية للألعاب التنافسية والاستماع الاحترافي.',
      en: 'In-ear monitors with dynamic & planar drivers for competitive gaming and audio.',
    },
    iconKey: 'iem',
    useCaseIds: ['gaming', 'everyday'],
    visualKey: 'sub-iem',
  },

  // Subcategories under PC Components
  {
    id: 'graphics-cards',
    parentId: 'pc-components',
    name: { ar: 'كروت الشاشة (Graphics Cards)', en: 'Graphics Cards' },
    description: {
      ar: 'معماريات NVIDIA RTX و AMD Radeon للألعاب والرندر الثلاثي الأبعاد.',
      en: 'NVIDIA GeForce RTX & AMD Radeon GPUs for high-FPS gaming and 3D rendering.',
    },
    iconKey: 'gpu',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'sub-gpu',
  },
  {
    id: 'processors',
    parentId: 'pc-components',
    name: { ar: 'المعالجات (Processors)', en: 'Processors (CPU)' },
    description: {
      ar: 'معالجات AMD Ryzen و Intel Core للأجيال الحديثة.',
      en: 'Latest generation AMD Ryzen X3D and Intel Core desktop processors.',
    },
    iconKey: 'cpu',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'sub-cpu',
  },
  {
    id: 'motherboards',
    parentId: 'pc-components',
    name: { ar: 'اللوحات الأم (Motherboards)', en: 'Motherboards' },
    description: {
      ar: 'لوحات B650 و X670 و B760 و Z790 بدعم DDR5 و PCIe 5.0.',
      en: 'B650, X670, B760, and Z790 motherboards with PCIe 5.0 and Wi-Fi 6E.',
    },
    iconKey: 'motherboard',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'sub-mobo',
  },
  {
    id: 'ram',
    parentId: 'pc-components',
    name: { ar: 'الذاكرة العشوائية (RAM)', en: 'RAM Memory' },
    description: {
      ar: 'ذواكر DDR5 و DDR4 بسرعات عالية وتواقيت منخفضة.',
      en: 'High-frequency DDR5 & DDR4 kits with XMP 3.0 and EXPO profiles.',
    },
    iconKey: 'ram',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'sub-ram',
  },
  {
    id: 'storage',
    parentId: 'pc-components',
    name: { ar: 'وحدات التخزين (Storage)', en: 'Storage (SSD & NVMe)' },
    description: {
      ar: 'أقراص M.2 NVMe Gen4 ووحدات تخزين خارجية فائقة السرعة.',
      en: 'PCIe 4.0 M.2 NVMe SSDs and portable USB 3.2 solid-state storage.',
    },
    iconKey: 'storage',
    useCaseIds: ['gaming', 'work-study', 'everyday'],
    visualKey: 'sub-storage',
  },
  {
    id: 'power-supplies',
    parentId: 'pc-components',
    name: { ar: 'مزودات الطاقة (Power Supplies)', en: 'Power Supplies (PSU)' },
    description: {
      ar: 'بوارات ATX 3.1 بشهادات 80+ Gold و Platinum وكابلات PCIe 5.0.',
      en: 'ATX 3.1 full-modular power supplies with 80+ Gold & Platinum certification.',
    },
    iconKey: 'psu',
    useCaseIds: ['gaming', 'work-study'],
    visualKey: 'sub-psu',
  },
  {
    id: 'cases-cooling',
    parentId: 'pc-components',
    name: { ar: 'الكيسات والتبريد (Cases & Cooling)', en: 'Cases & Cooling' },
    description: {
      ar: 'كيسات بانورامية بتدفق هواء ممتاز ومبردات مائية AIO.',
      en: 'Panoramic tempered-glass cases and 360mm ARGB liquid CPU coolers.',
    },
    iconKey: 'case',
    useCaseIds: ['gaming'],
    visualKey: 'sub-cases',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Gaming Laptop (NEW) - has Offer
  {
    id: 'prod-rog-strix-g16',
    sku: 'PXL-LAP-001',
    name: {
      ar: 'لابتوب ألعاب ASUS ROG Strix G16 (2026) — RTX 4070',
      en: 'ASUS ROG Strix G16 Gaming Laptop — Core i7 / RTX 4070',
    },
    description: {
      ar: 'لابتوب ألعاب احترافي مزود بمعالج Intel Core i7-14650HX وكرت شاشة RTX 4070 بكامل طاقته 140W مع شاشة ROG Nebula بدقة 2.5K ومعدل تحديث 240Hz وتبريد معدن سائل.',
      en: 'High-performance gaming laptop equipped with Intel Core i7-14650HX, full-wattage 140W GeForce RTX 4070, and a 16-inch 240Hz QHD+ Nebula display with Tri-Fan cooling.',
    },
    categoryId: 'laptops',
    subcategoryId: 'new-laptops',
    brandId: 'asus',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 1490,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'laptop-rog-front',
    secondaryImage: 'laptop-rog-side',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    laptopSpecs: {
      processor: 'Intel Core i7-14650HX (16 Cores, up to 5.2GHz)',
      memory: '16GB DDR5 5600MHz (Upgradeable to 64GB)',
      storage: '1TB PCIe 4.0 NVMe M.2 SSD',
      display: '16" QHD+ (2560×1600) 240Hz IPS 100% DCI-P3',
    },
    specs: [
      { label: { ar: 'كرت الشاشة', en: 'Graphics' }, value: { ar: 'NVIDIA RTX 4070 8GB GDDR6 (140W)', en: 'NVIDIA RTX 4070 8GB GDDR6 (140W)' } },
      { label: { ar: 'البطارية', en: 'Battery' }, value: { ar: '90Wh مع شحن سريع Type-C 100W', en: '90Wh with 100W Type-C PD charging' } },
      { label: { ar: 'التوصيل والمنافذ', en: 'Connectivity' }, value: { ar: 'Wi-Fi 6E + Thunderbolt 4 + HDMI 2.1', en: 'Wi-Fi 6E + Thunderbolt 4 + HDMI 2.1' } },
    ],
    createdAt: '2026-10-24T10:00:00Z',
  },

  // 2. Used Clean Laptop (Work/Study)
  {
    id: 'prod-thinkpad-t14-used',
    sku: 'PXL-LAP-002',
    name: {
      ar: 'لابتوب Lenovo ThinkPad T14 Gen 3 — حالة الوكالة',
      en: 'Lenovo ThinkPad T14 Gen 3 Business Laptop (Clean Used)',
    },
    description: {
      ar: 'لابتوب عملي فائق المتانة للبرمجة والدراسة والعمل المكتبي، مفحوص بالكامل بنسبة بطارية ممتازة 92% ولوحة مفاتيح مريحة مقاومة للسوائل.',
      en: 'Enterprise-grade durability for software engineering, university, and office workflows. Fully inspected with 92% battery health and backlit spill-resistant keyboard.',
    },
    categoryId: 'laptops',
    subcategoryId: 'used-laptops',
    brandId: 'lenovo',
    useCaseIds: ['work-study', 'everyday'],
    priceUsd: 465,
    condition: 'USED',
    availability: 'IN_STOCK',
    primaryImage: 'laptop-thinkpad-front',
    secondaryImage: 'laptop-thinkpad-angle',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    laptopSpecs: {
      processor: 'Intel Core i7-1260P (12 Cores / 16 Threads)',
      memory: '16GB DDR4 3200MHz Dual-Channel',
      storage: '512GB NVMe PCIe Gen4 SSD',
      display: '14" WUXGA (1920×1200) IPS Anti-Glare 400 nits',
    },
    specs: [
      { label: { ar: 'حالة الجهاز', en: 'Condition Grade' }, value: { ar: 'نظافة عالية جداً خالي من الخدوش العميقة', en: 'Clean A+ Grade, tested 100%' } },
      { label: { ar: 'الوزن', en: 'Weight' }, value: { ar: '1.36 كغ فقط', en: '1.36 kg ultra-portable' } },
    ],
    createdAt: '2026-10-18T14:00:00Z',
  },

  // 3. Everyday / Work New Laptop
  {
    id: 'prod-lenovo-loq-15',
    sku: 'PXL-LAP-003',
    name: {
      ar: 'لابتوب Lenovo LOQ 15IRX9 — RTX 4060',
      en: 'Lenovo LOQ 15IRX9 Gaming & Engineering Laptop — RTX 4060',
    },
    description: {
      ar: 'الخيار الأكثر توازناً لطلاب الهندسة والعمارة والألعاب، بمعالج i7 الجيل الثالث عشر وكرت RTX 4060 8GB وشاشة 144Hz 100% sRGB.',
      en: 'The sweet spot for architecture students and gamers featuring Intel Core i7-13650HX, RTX 4060 8GB, and 100% sRGB 144Hz display.',
    },
    categoryId: 'laptops',
    subcategoryId: 'new-laptops',
    brandId: 'lenovo',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 980,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'laptop-loq-front',
    secondaryImage: 'laptop-loq-back',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: false,
    laptopSpecs: {
      processor: 'Intel Core i7-13650HX (14 Cores)',
      memory: '16GB DDR5 4800MHz',
      storage: '512GB M.2 PCIe 4.0 NVMe',
      display: '15.6" FHD (1920×1080) IPS 144Hz 100% sRGB G-SYNC',
    },
    specs: [
      { label: { ar: 'كرت الشاشة', en: 'Graphics' }, value: { ar: 'NVIDIA GeForce RTX 4060 8GB (115W)', en: 'NVIDIA GeForce RTX 4060 8GB (115W)' } },
    ],
    createdAt: '2026-10-22T09:00:00Z',
  },

  // 4. Used Gaming Laptop
  {
    id: 'prod-asus-zephyrus-g14-used',
    sku: 'PXL-LAP-004',
    name: {
      ar: 'لابتوب ASUS ROG Zephyrus G14 — Ryzen 9 (مستعمل نظيف)',
      en: 'ASUS ROG Zephyrus G14 — Ryzen 9 / RTX 3060 (Clean Used)',
    },
    description: {
      ar: 'قوة الألعاب والمونتاج في هيكل 14 إنش خفيف الوزن من المغنيسيوم، مفحوص بالكامل مع الشاحن الأصلي.',
      en: 'Compact 14-inch powerhouse in magnesium-alloy chassis. Tested and verified with original charger.',
    },
    categoryId: 'laptops',
    subcategoryId: 'used-laptops',
    brandId: 'asus',
    useCaseIds: ['gaming', 'work-study', 'everyday'],
    priceUsd: 690,
    condition: 'USED',
    availability: 'IN_STOCK',
    primaryImage: 'laptop-zephyrus-front',
    secondaryImage: 'laptop-zephyrus-lid',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    laptopSpecs: {
      processor: 'AMD Ryzen 9 5900HS (8 Cores / 16 Threads)',
      memory: '16GB DDR4 3200MHz',
      storage: '1TB NVMe M.2 SSD',
      display: '14" QHD (2560×1440) 120Hz Pantone Validated',
    },
    specs: [
      { label: { ar: 'كرت الشاشة', en: 'Graphics' }, value: { ar: 'NVIDIA GeForce RTX 3060 6GB', en: 'NVIDIA GeForce RTX 3060 6GB' } },
    ],
    createdAt: '2026-10-12T11:30:00Z',
  },

  // 5. Everyday New Laptop
  {
    id: 'prod-asus-vivobook-15',
    sku: 'PXL-LAP-005',
    name: {
      ar: 'لابتوب ASUS VivoBook 15 OLED — للاستخدام اليومي والجامعي',
      en: 'ASUS VivoBook 15 OLED — Core i5 13th Gen Everyday Laptop',
    },
    description: {
      ar: 'شاشة OLED مذهلة بألوان سينمائية مع معالج i5 الجيل الثالث عشر ووزن خفيف مثالي للمحاضرات والعمل اليومي.',
      en: 'Vibrant FHD OLED panel paired with 13th Gen Intel Core i5, slim bezels, and lightweight build for everyday productivity.',
    },
    categoryId: 'laptops',
    subcategoryId: 'new-laptops',
    brandId: 'asus',
    useCaseIds: ['everyday', 'work-study'],
    priceUsd: 540,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'laptop-vivobook-front',
    secondaryImage: 'laptop-vivobook-side',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    laptopSpecs: {
      processor: 'Intel Core i5-1335U (10 Cores, up to 4.6GHz)',
      memory: '16GB DDR4',
      storage: '512GB NVMe M.2 SSD',
      display: '15.6" FHD OLED 400 nits 100% DCI-P3',
    },
    specs: [
      { label: { ar: 'البصمة', en: 'Biometrics' }, value: { ar: 'مستشعر بصمة مدمج في لوحة اللمس', en: 'Integrated Touchpad Fingerprint Sensor' } },
    ],
    createdAt: '2026-10-25T16:00:00Z',
  },

  // 6. Gaming Keyboard 1 (Offer)
  {
    id: 'prod-redragon-k617',
    sku: 'PXL-KB-001',
    name: {
      ar: 'لوحة مفاتيح ميكانيكية Redragon K617 Fizz 60% RGB',
      en: 'Redragon K617 Fizz 60% RGB Mechanical Gaming Keyboard',
    },
    description: {
      ar: 'كيبورد ألعاب مدمج بحجم 60% بمفاتيح Red الخطية الهادئة والسريعة مع قابلية تبديل المفاتيح Hot-Swap وإضاءة RGB بـ 20 نمطاً.',
      en: 'Ultra-compact 60% layout with hot-swappable linear Red switches, vibrant 20-mode RGB backlighting, and detachable USB-C cable.',
    },
    categoryId: 'accessories',
    subcategoryId: 'keyboards',
    brandId: 'redragon',
    useCaseIds: ['gaming'],
    priceUsd: 38,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'kb-fizz-front',
    secondaryImage: 'kb-fizz-switches',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    specs: [
      { label: { ar: 'نوع السويتش', en: 'Switch Type' }, value: { ar: 'Red Linear Hot-Swappable', en: 'Red Linear Hot-Swappable' } },
      { label: { ar: 'الحجم', en: 'Form Factor' }, value: { ar: '60% (61 مفتاحاً)', en: '60% (61 Keys)' } },
      { label: { ar: 'التوصيل', en: 'Connectivity' }, value: { ar: 'سلكي USB-C قابل للفصل', en: 'Detachable Wired USB-C' } },
    ],
    createdAt: '2026-10-10T10:00:00Z',
  },

  // 7. Gaming Keyboard 2 (High-End)
  {
    id: 'prod-razer-huntsman-v3',
    sku: 'PXL-KB-002',
    name: {
      ar: 'لوحة مفاتيح Razer Huntsman V3 Pro TKL Analog Optical',
      en: 'Razer Huntsman V3 Pro TKL Analog Optical Esports Keyboard',
    },
    description: {
      ar: 'كيبورد الرياضات الإلكترونية الاحترافي بمفاتيح بصرية الجيل الثاني مع ميزة Rapid Trigger وتعديل نقطة التفعيل من 0.1 إلى 4.0 مم.',
      en: 'Pro esports TKL keyboard with Gen-2 Analog Optical Switches, Rapid Trigger mode, adjustable actuation (0.1–4.0mm), and magnetic wrist rest.',
    },
    categoryId: 'accessories',
    subcategoryId: 'keyboards',
    brandId: 'razer',
    useCaseIds: ['gaming'],
    priceUsd: 195,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'kb-huntsman-front',
    secondaryImage: 'kb-huntsman-dial',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    specs: [
      { label: { ar: 'نوع السويتش', en: 'Switch Type' }, value: { ar: 'Razer Analog Optical Gen-2 (Rapid Trigger)', en: 'Razer Analog Optical Gen-2 (Rapid Trigger)' } },
      { label: { ar: 'السطح العلوي', en: 'Top Plate' }, value: { ar: 'ألمنيوم مصقول 5052', en: 'Brushed 5052 Aluminum Alloy' } },
    ],
    createdAt: '2026-10-26T08:00:00Z',
  },

  // 8. Office Keyboard (Logitech MX Keys S)
  {
    id: 'prod-logitech-mx-keys-s',
    sku: 'PXL-KB-003',
    name: {
      ar: 'لوحة مفاتيح لاسلكية مكتبية Logitech MX Keys S — عربي/إنكليزي',
      en: 'Logitech MX Keys S Wireless Illuminated Office Keyboard (AR/EN)',
    },
    description: {
      ar: 'مصممة للبرمجة والكتابة المكتبية السريعة والهادئة، مع مفاتيح مقعرة مريحة للأصابع، إضاءة ذكية تقترب من اليد، وربط حتى 3 أجهزة.',
      en: 'Engineered for fluid, whisper-quiet office typing and coding. Spherically dished keys, smart proximity illumination, and Easy-Switch for 3 devices.',
    },
    categoryId: 'accessories',
    subcategoryId: 'keyboards',
    brandId: 'logitech',
    useCaseIds: ['office', 'work-study'],
    priceUsd: 112,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'kb-mxkeys-front',
    secondaryImage: 'kb-mxkeys-side',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'الحروف', en: 'Key Legend' }, value: { ar: 'حفر ليزري عربي + إنكليزي أصلي', en: 'Dual Arabic / English Laser Etched' } },
      { label: { ar: 'الاتصال', en: 'Connectivity' }, value: { ar: 'Bluetooth Low Energy + Logi Bolt USB', en: 'Bluetooth LE + Logi Bolt Receiver' } },
    ],
    createdAt: '2026-10-14T12:00:00Z',
  },

  // 9. Office Compact Keyboard (Logitech Pebble Keys 2)
  {
    id: 'prod-logitech-pebble-k380s',
    sku: 'PXL-KB-004',
    name: {
      ar: 'كيبورد بلوتوث مكتبي محمول Logitech Pebble Keys 2 K380s',
      en: 'Logitech Pebble Keys 2 K380s Multi-Device Bluetooth Keyboard',
    },
    description: {
      ar: 'كيبورد مكتبي نحيف وخفيف يعمل مع اللابتوب والآيباد والهواتف الذكية ببطارية تدوم حتى 36 شهراً.',
      en: 'Slim, minimalist office keyboard for laptop, tablet, and phone workflows with 36-month battery life and quiet scoop keys.',
    },
    categoryId: 'accessories',
    subcategoryId: 'keyboards',
    brandId: 'logitech',
    useCaseIds: ['office', 'everyday'],
    priceUsd: 39,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'kb-pebble-front',
    secondaryImage: 'kb-pebble-angle',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'عمر البطارية', en: 'Battery Life' }, value: { ar: 'حتى 36 شهراً', en: 'Up to 36 months' } },
    ],
    createdAt: '2026-10-08T10:00:00Z',
  },

  // 10. Gaming Mouse (Logitech G Pro X Superlight 2) - Offer
  {
    id: 'prod-gpro-superlight-2',
    sku: 'PXL-MS-001',
    name: {
      ar: 'ماوس ألعاب لاسلكي Logitech G PRO X SUPERLIGHT 2 (60g)',
      en: 'Logitech G PRO X SUPERLIGHT 2 Wireless Esports Mouse',
    },
    description: {
      ar: 'الماوس الأول عالمياً للاعبي الرياضات الإلكترونية بوزن 60 غرام فقط، حساس HERO 2 بدقة 32,000 DPI، ومفاتيح LIGHTFORCE الهجينة.',
      en: '60g championship-winning wireless gaming mouse with HERO 2 32K sensor, 4000Hz wireless polling rate, and LIGHTFORCE hybrid optical-mechanical switches.',
    },
    categoryId: 'accessories',
    subcategoryId: 'mice',
    brandId: 'logitech',
    useCaseIds: ['gaming'],
    priceUsd: 155,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'mouse-superlight-front',
    secondaryImage: 'mouse-superlight-side',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    specs: [
      { label: { ar: 'الوزن', en: 'Weight' }, value: { ar: '60 غرام فائق الخفة', en: '60g Ultra-Lightweight' } },
      { label: { ar: 'معدل التحديث', en: 'Polling Rate' }, value: { ar: '4000Hz LIGHTSPEED Wireless', en: '4000Hz LIGHTSPEED Wireless' } },
    ],
    createdAt: '2026-10-23T11:00:00Z',
  },

  // 11. Office Mouse (Logitech MX Master 3S)
  {
    id: 'prod-mx-master-3s',
    sku: 'PXL-MS-002',
    name: {
      ar: 'ماوس مكتبي احترافي Logitech MX Master 3S Quiet Click',
      en: 'Logitech MX Master 3S Wireless Ergonomic Office Mouse',
    },
    description: {
      ar: 'أفضل ماوس للمبرمجين والمصممين والعمل المكتبي، مع عجلة التمرير المغناطيسية MagSpeed فائقة السرعة ونقرات صامتة بنسبة 90%.',
      en: 'Iconic ergonomic office mouse featuring 8K DPI track-on-glass sensor, Quiet Click switches, and electromagnetic MagSpeed scroll wheel.',
    },
    categoryId: 'accessories',
    subcategoryId: 'mice',
    brandId: 'logitech',
    useCaseIds: ['office', 'work-study'],
    priceUsd: 105,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'mouse-mxmaster-front',
    secondaryImage: 'mouse-mxmaster-wheel',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'الحساس', en: 'Sensor' }, value: { ar: '8000 DPI يعمل على الزجاج', en: '8000 DPI Darkfield Track-on-Glass' } },
      { label: { ar: 'النقرات', en: 'Switches' }, value: { ar: 'صامتة بنسبة 90%', en: '90% Noise-Reduced Quiet Clicks' } },
    ],
    createdAt: '2026-10-16T09:00:00Z',
  },

  // 12. Budget Gaming Mouse (Redragon M916 Pro)
  {
    id: 'prod-redragon-m916',
    sku: 'PXL-MS-003',
    name: {
      ar: 'ماوس ألعاب لاسلكي Redragon M916 PRO K1NG 4K (49g)',
      en: 'Redragon M916 PRO K1NG 49g 3-Mode Wireless Gaming Mouse',
    },
    description: {
      ar: 'ماوس ألعاب احترافي بسعر اقتصادي وحساس PixArt PAW3395 ووزن 49 غرام مع 3 أوضاع اتصال (2.4GHz / Bluetooth / سلكي).',
      en: 'Featherlight 49g gaming mouse powered by PixArt PAW3395 flagship sensor with tri-mode wireless connectivity.',
    },
    categoryId: 'accessories',
    subcategoryId: 'mice',
    brandId: 'redragon',
    useCaseIds: ['gaming'],
    priceUsd: 42,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'mouse-redragon-front',
    secondaryImage: 'mouse-redragon-bottom',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    specs: [
      { label: { ar: 'الحساس', en: 'Sensor' }, value: { ar: 'PixArt PAW3395 (26,000 DPI)', en: 'PixArt PAW3395 (26,000 DPI)' } },
    ],
    createdAt: '2026-10-25T12:00:00Z',
  },

  // 13. Audio: Gaming Headset (HyperX Cloud III Wireless) - Offer
  {
    id: 'prod-hyperx-cloud-3',
    sku: 'PXL-AUD-001',
    name: {
      ar: 'سماعة ألعاب لاسلكية HyperX Cloud III Wireless — بطارية 120 ساعة',
      en: 'HyperX Cloud III Wireless Gaming Headset — 120h Battery',
    },
    description: {
      ar: 'الراحة الأسطورية من HyperX مع مشغلات 53مم مائلة وميكروفون 10مم فائق الوضوح وبطارية استثنائية تدوم حتى 120 ساعة شحن.',
      en: 'Signature HyperX memory foam comfort with angled 53mm drivers, crystal-clear 10mm detachable mic, and up to 120 hours of 2.4GHz wireless battery.',
    },
    categoryId: 'audio',
    subcategoryId: 'gaming-headsets',
    brandId: 'hyperx',
    useCaseIds: ['gaming'],
    priceUsd: 138,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'audio-cloud3-front',
    secondaryImage: 'audio-cloud3-mic',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    specs: [
      { label: { ar: 'عمر البطارية', en: 'Battery Life' }, value: { ar: 'حتى 120 ساعة لاسلكياً', en: 'Up to 120 Hours (2.4GHz Wireless)' } },
      { label: { ar: 'المشغلات الصوتية', en: 'Drivers' }, value: { ar: '53mm Angled Dynamic Drivers + DTS Spatial', en: '53mm Angled Drivers + DTS Headphone:X' } },
    ],
    createdAt: '2026-10-19T15:00:00Z',
  },

  // 14. Audio: IEM Earphones (Moondrop Aria 2)
  {
    id: 'prod-moondrop-aria-2',
    sku: 'PXL-AUD-002',
    name: {
      ar: 'سماعات مونيتور داخل الأذن Moondrop Aria 2 Hi-Fi IEM',
      en: 'Moondrop Aria 2 Ceramic-Diaphragm In-Ear Monitors (IEM)',
    },
    description: {
      ar: 'سماعة IEM احترافية بهيكل معدني مصبوب وكابل قابل للفصل 0.78mm 2-Pin مع قابس مزدوج 3.5mm و 4.4mm، مثالية للألعاب التنافسية والموسيقى.',
      en: 'Precision CNC metal shell IEM with TiN ceramic-coated dome diaphragm and swappable 3.5mm/4.4mm balanced cable for pinpoint gaming imaging.',
    },
    categoryId: 'audio',
    subcategoryId: 'iem',
    brandId: 'moondrop',
    useCaseIds: ['gaming', 'everyday'],
    priceUsd: 89,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'audio-iem-front',
    secondaryImage: 'audio-iem-cable',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    specs: [
      { label: { ar: 'الكابل', en: 'Cable' }, value: { ar: 'نحاس مطلي بالفضة قابل للفصل 0.78mm', en: 'Detachable 0.78mm Silver-Plated Litz Cable' } },
      { label: { ar: 'الحساسية', en: 'Sensitivity' }, value: { ar: '122dB/Vrms (@1kHz)', en: '122dB/Vrms (@1kHz)' } },
    ],
    createdAt: '2026-10-26T10:00:00Z',
  },

  // 15. Audio: Wireless Earbuds (Razer Hammerhead Pro HyperSpeed)
  {
    id: 'prod-razer-hammerhead',
    sku: 'PXL-AUD-003',
    name: {
      ar: 'سماعات أذن لاسلكية Razer Hammerhead Pro HyperSpeed ANC',
      en: 'Razer Hammerhead Pro HyperSpeed Wireless Gaming Earbuds',
    },
    description: {
      ar: 'سماعات Earbuds لاسلكية مع دونجل 2.4GHz لزمن انتقال منخفض جداً (أقل من 30ms) للعب على PC و PS5 والهاتف بالإضافة إلى بلوتوث 5.3 وعزل ضوضاء ANC.',
      en: 'True wireless earbuds featuring 2.4GHz HyperSpeed USB-C dongle for ultra-low latency gaming plus Bluetooth 5.3 and THX Certified ANC.',
    },
    categoryId: 'audio',
    subcategoryId: 'earbuds',
    brandId: 'razer',
    useCaseIds: ['gaming', 'everyday'],
    priceUsd: 145,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'audio-earbuds-front',
    secondaryImage: 'audio-earbuds-case',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    specs: [
      { label: { ar: 'الاتصال المزدوج', en: 'Dual Wireless' }, value: { ar: 'دونجل 2.4GHz USB-C + Bluetooth 5.3', en: '2.4GHz USB-C Dongle + Bluetooth 5.3' } },
    ],
    createdAt: '2026-10-21T14:00:00Z',
  },

  // 16. PC Component: Graphics Card (RTX 4070 Super) - Offer
  {
    id: 'prod-pny-rtx-4070-super',
    sku: 'PXL-GPU-001',
    name: {
      ar: 'كرت شاشة PNY GeForce RTX 4070 SUPER 12GB VERTO OC Dual Fan',
      en: 'PNY GeForce RTX 4070 SUPER 12GB GDDR6X VERTO OC Edition',
    },
    description: {
      ar: 'أداء خارق لألعاب 1440p Ultra وبرامج الرندر والذكاء الاصطناعي مع معمارية Ada Lovelace وتقنية DLSS 3.5 Frame Generation.',
      en: '7168 CUDA cores and 12GB ultra-fast GDDR6X VRAM delivering max-setting 1440p gaming and accelerated Blender/CUDA workflows.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'graphics-cards',
    brandId: 'nvidia',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 645,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-gpu-front',
    secondaryImage: 'comp-gpu-backplate',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    specs: [
      { label: { ar: 'ذاكرة الفيديو', en: 'VRAM' }, value: { ar: '12GB GDDR6X (192-bit)', en: '12GB GDDR6X (192-bit)' } },
      { label: { ar: 'منفذ الطاقة', en: 'Power Connector' }, value: { ar: '16-Pin PCIe Gen 5 (محول مرفق)', en: '16-Pin PCIe Gen 5 (Adapter Included)' } },
    ],
    createdAt: '2026-10-25T11:00:00Z',
  },

  // 17. PC Component: Processor (AMD Ryzen 7 7800X3D)
  {
    id: 'prod-ryzen-7800x3d',
    sku: 'PXL-CPU-001',
    name: {
      ar: 'معالج الألعاب الأول AMD Ryzen 7 7800X3D — 3D V-Cache',
      en: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread 3D V-Cache Processor',
    },
    description: {
      ar: 'أقوى معالج للألعاب بفضل ذاكرة الكاش الهائلة 96MB L3 3D V-Cache وكفاءة استهلاك طاقة استثنائية على مقبس AM5.',
      en: 'The undisputed gaming CPU champion featuring 96MB of 3D V-Cache technology on the AM5 socket with up to 5.0GHz boost clock.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'processors',
    brandId: 'amd',
    useCaseIds: ['gaming'],
    priceUsd: 435,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-cpu-front',
    secondaryImage: 'comp-cpu-chip',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    specs: [
      { label: { ar: 'الأنوية / الخيوط', en: 'Cores / Threads' }, value: { ar: '8 أنوية / 16 خيط معالجة', en: '8 Cores / 16 Threads' } },
      { label: { ar: 'ذاكرة الكاش', en: 'L3 Cache' }, value: { ar: '96MB AMD 3D V-Cache', en: '96MB AMD 3D V-Cache' } },
    ],
    createdAt: '2026-10-15T10:00:00Z',
  },

  // 18. PC Component: Motherboard (ASUS TUF Gaming B650-PLUS WIFI)
  {
    id: 'prod-asus-tuf-b650',
    sku: 'PXL-MB-001',
    name: {
      ar: 'لوحة أم ASUS TUF GAMING B650-PLUS WIFI — مقبس AM5 DDR5',
      en: 'ASUS TUF GAMING B650-PLUS WIFI AM5 ATX Motherboard',
    },
    description: {
      ar: 'لوحة أم متينة بدوائر طاقة 12+2 مرحلة، دعم ذواكر DDR5، منفذ M.2 PCIe 5.0، وشبكة لاسلكية Wi-Fi 6 مدمجة.',
      en: 'Military-grade AM5 motherboard featuring 12+2 teamed power stages, PCIe 5.0 M.2 support, Realtek 2.5Gb Ethernet, and Wi-Fi 6.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'motherboards',
    brandId: 'asus',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 210,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-mobo-front',
    secondaryImage: 'comp-mobo-io',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'المقبس', en: 'Socket' }, value: { ar: 'AMD Socket AM5 (Ryzen 7000/8000/9000)', en: 'AMD Socket AM5 (Ryzen 7000/8000/9000)' } },
    ],
    createdAt: '2026-10-14T08:00:00Z',
  },

  // 19. PC Component: RAM (Kingston FURY Beast 32GB DDR5) - Offer
  {
    id: 'prod-kingston-ddr5-32gb',
    sku: 'PXL-RAM-001',
    name: {
      ar: 'رامات Kingston FURY Beast RGB 32GB (2×16GB) DDR5 6000MHz CL30',
      en: 'Kingston FURY Beast RGB 32GB (2x16GB) DDR5 6000MT/s CL30 Kit',
    },
    description: {
      ar: 'التوقيت الذهبي CL30 مع سرعة 6000MHz ودعم كل من ملفات AMD EXPO و Intel XMP 3.0 وإضاءة RGB متزامنة.',
      en: 'Sweet-spot DDR5-6000 CL30 low-latency memory kit certified for both AMD EXPO and Intel XMP 3.0 with Infrared Sync RGB.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'ram',
    brandId: 'kingston',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 128,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-ram-front',
    secondaryImage: 'comp-ram-rgb',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: false,
    specs: [
      { label: { ar: 'السعة والسرعة', en: 'Capacity & Speed' }, value: { ar: '32GB (2×16GB) 6000MT/s CL30', en: '32GB (2×16GB) 6000MT/s CL30' } },
    ],
    createdAt: '2026-10-20T10:00:00Z',
  },

  // 20. PC Component: Storage (Kingston KC3000 1TB NVMe)
  {
    id: 'prod-kingston-kc3000-1tb',
    sku: 'PXL-SSD-001',
    name: {
      ar: 'وحدة تخزين Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (7000MB/s)',
      en: 'Kingston KC3000 1TB PCIe 4.0 NVMe M.2 SSD (7,000MB/s)',
    },
    description: {
      ar: 'قرص NVMe احترافي مزود بذاكرة كاش DRAM ومشتت حراري من الغرافين والألمنيوم بسرعات قراءة وكتابة تصل إلى 7000MB/s.',
      en: 'High-performance Gen4x4 NVMe SSD with onboard DRAM cache and low-profile graphene aluminum heat spreader.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'storage',
    brandId: 'kingston',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 88,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-ssd-front',
    secondaryImage: 'comp-ssd-installed',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'سرعة القراءة', en: 'Sequential Read' }, value: { ar: '7,000 MB/s', en: '7,000 MB/s' } },
    ],
    createdAt: '2026-10-11T10:00:00Z',
  },

  // 21. PC Component: Power Supply (850W ATX 3.1 Gold)
  {
    id: 'prod-psu-850w-gold',
    sku: 'PXL-PSU-001',
    name: {
      ar: 'مزود طاقة ASUS TUF Gaming 850W 80+ Gold ATX 3.0 Fully Modular',
      en: 'ASUS TUF Gaming 850W 80+ Gold ATX 3.0 Full-Modular PSU',
    },
    description: {
      ar: 'مزود طاقة كامل الفصل بمعيار ATX 3.0 وكابل 16-Pin أصلي لكروت RTX 40 مع مكثفات يابانية تتحمل أقسى ظروف التشغيل.',
      en: 'ATX 3.0 compatible 850W power supply with native 16-pin PCIe 5.0 cable, dual-ball fan bearings, and protective PCB coating.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'power-supplies',
    brandId: 'asus',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 135,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-psu-front',
    secondaryImage: 'comp-psu-cables',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'الاستطاعة والشهادة', en: 'Wattage & Rating' }, value: { ar: '850W — 80 Plus Gold ATX 3.0', en: '850W — 80 Plus Gold ATX 3.0' } },
    ],
    createdAt: '2026-10-09T10:00:00Z',
  },

  // 22. PC Component: Case & Cooling
  {
    id: 'prod-case-panoramic-argb',
    sku: 'PXL-CASE-001',
    name: {
      ar: 'كيس بانورامي ASUS TUF Gaming GT502 Dual-Chamber — أبيض',
      en: 'ASUS TUF Gaming GT502 Dual-Chamber Panoramic ATX Case',
    },
    description: {
      ar: 'تصميم حجرتين مستقلتين لعزل حرارة المعالج وكرت الشاشة عن مزود الطاقة ووحدات التخزين، مع واجهة وجانب من الزجاج المقسى.',
      en: 'Dual-chamber chassis with panoramic tempered glass front and side panels, tool-free side panels, and support for up to 13 fans.',
    },
    categoryId: 'pc-components',
    subcategoryId: 'cases-cooling',
    brandId: 'asus',
    useCaseIds: ['gaming'],
    priceUsd: 148,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'comp-case-front',
    secondaryImage: 'comp-case-interior',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    specs: [
      { label: { ar: 'التصميم', en: 'Layout' }, value: { ar: 'Dual-Chamber ATX / Micro-ATX', en: 'Dual-Chamber ATX / Micro-ATX' } },
    ],
    createdAt: '2026-10-24T13:00:00Z',
  },

  // 23. Chargers & Cables: Anker Prime 100W GaN Charger
  {
    id: 'prod-anker-100w-gan',
    sku: 'PXL-ACC-001',
    name: {
      ar: 'شاحن جداري سريع Anker Prime 100W GaN — 3 منافذ للابتوب والهاتف',
      en: 'Anker Prime 100W GaN Wall Charger (2× USB-C + 1× USB-A)',
    },
    description: {
      ar: 'اشحن لابتوبك وهاتفك وسماعتك في وقت واحد بحجم صغير بفضل تقنية GaNPrime المتطورة وحماية ActiveShield 2.0.',
      en: 'Ultra-compact 3-port GaN wall charger capable of delivering 100W PD to MacBook/Gaming USB-C laptops and phones simultaneously.',
    },
    categoryId: 'accessories',
    subcategoryId: 'chargers-cables',
    brandId: 'anker',
    useCaseIds: ['everyday', 'office', 'work-study'],
    priceUsd: 58,
    condition: 'NEW',
    availability: 'IN_STOCK',
    primaryImage: 'acc-charger-front',
    secondaryImage: 'acc-charger-ports',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    specs: [
      { label: { ar: 'الاستطاعة القصوى', en: 'Max Output' }, value: { ar: '100W Power Delivery 3.0', en: '100W Power Delivery 3.0' } },
    ],
    createdAt: '2026-10-17T10:00:00Z',
  },

  // 24. Custom PC Build: Pixel Nebula Pro RTX 4070 Super Rig (Offer)
  {
    id: 'prod-pcbuild-pixel-nebula',
    sku: 'PXL-BLD-001',
    name: {
      ar: 'تجميعة PIXEL NEBULA PRO — Ryzen 7 7800X3D + RTX 4070 SUPER',
      en: 'PIXEL NEBULA PRO Custom Gaming PC — 7800X3D + RTX 4070 SUPER',
    },
    description: {
      ar: 'تجميعة احترافية مركبة ومختبرة بعناية في قسم التجميع مع تنظيم كابلات احترافي، تحديث BIOS وتفعيل EXPO، جاهزة للتشغيل الفوري بدقة 2K/4K.',
      en: 'Hand-assembled and stress-tested custom PC build. Includes clean cable management, updated BIOS with EXPO enabled, and full thermal verification.',
    },
    categoryId: 'pc-builds',
    brandId: 'asus',
    useCaseIds: ['gaming', 'work-study'],
    priceUsd: 1790,
    condition: 'NEW',
    availability: 'ON_REQUEST',
    primaryImage: 'build-nebula-front',
    secondaryImage: 'build-nebula-angle',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    specs: [
      { label: { ar: 'المعالج', en: 'Processor' }, value: { ar: 'AMD Ryzen 7 7800X3D', en: 'AMD Ryzen 7 7800X3D' } },
      { label: { ar: 'كرت الشاشة', en: 'Graphics Card' }, value: { ar: 'GeForce RTX 4070 SUPER 12GB', en: 'GeForce RTX 4070 SUPER 12GB' } },
      { label: { ar: 'الذاكرة والتخزين', en: 'RAM & Storage' }, value: { ar: '32GB DDR5 6000MHz + 1TB KC3000 NVMe', en: '32GB DDR5 6000MHz + 1TB KC3000 NVMe' } },
      { label: { ar: 'التبريد والباور', en: 'Cooling & PSU' }, value: { ar: 'تيرمال رايت 360mm AIO + 850W 80+ Gold', en: '360mm ARGB Liquid Cooler + 850W 80+ Gold' } },
    ],
    createdAt: '2026-10-26T15:00:00Z',
  },
];

// Create initial offers with dynamic start/end dates relative to current session
export function createInitialOffers(referenceNowMs: number): Offer[] {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneHourMs = 60 * 60 * 1000;

  return [
    {
      id: 'offer-rog-g16',
      productId: 'prod-rog-strix-g16',
      title: {
        ar: 'عرض القمة على لابتوب ROG Strix G16 RTX 4070',
        en: 'Flagship Deal on ROG Strix G16 RTX 4070',
      },
      badgeText: { ar: 'عرض حصري', en: 'Exclusive Offer' },
      offerPriceUsd: 1365,
      startTime: new Date(referenceNowMs - 2 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 2 * oneDayMs + 6 * oneHourMs).toISOString(),
      isExclusive: true,
    },
    {
      id: 'offer-rtx4070-super',
      productId: 'prod-pny-rtx-4070-super',
      title: {
        ar: 'تخفيض خاص على كرت الشاشة RTX 4070 SUPER 12GB',
        en: 'Special Markdown on RTX 4070 SUPER 12GB',
      },
      badgeText: { ar: 'خصم حصري', en: 'Exclusive Offer' },
      offerPriceUsd: 589,
      startTime: new Date(referenceNowMs - 1 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 1 * oneDayMs + 14 * oneHourMs).toISOString(),
      isExclusive: true,
    },
    {
      id: 'offer-superlight-2',
      productId: 'prod-gpro-superlight-2',
      title: {
        ar: 'عرض البطولات — Logitech G PRO X SUPERLIGHT 2',
        en: 'Esports Week — Logitech G PRO X SUPERLIGHT 2',
      },
      badgeText: { ar: 'عرض محدود', en: 'Limited Offer' },
      offerPriceUsd: 132,
      startTime: new Date(referenceNowMs - 1 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 18 * oneHourMs).toISOString(),
      isExclusive: true,
    },
    {
      id: 'offer-redragon-k617',
      productId: 'prod-redragon-k617',
      title: {
        ar: 'عرض نهاية الأسبوع — كيبورد Redragon K617 Fizz',
        en: 'Weekend Flash — Redragon K617 Fizz 60%',
      },
      badgeText: { ar: 'خصم 24%', en: 'Save 24%' },
      offerPriceUsd: 29,
      startTime: new Date(referenceNowMs - 3 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 9 * oneHourMs + 42 * 60 * 1000).toISOString(),
      isExclusive: false,
    },
    {
      id: 'offer-hyperx-cloud3',
      productId: 'prod-hyperx-cloud-3',
      title: {
        ar: 'عرض الصوت المحيطي — HyperX Cloud III Wireless',
        en: 'Pro Audio Deal — HyperX Cloud III Wireless',
      },
      badgeText: { ar: 'عرض خاص', en: 'Special Offer' },
      offerPriceUsd: 115,
      startTime: new Date(referenceNowMs - 2 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 3 * oneDayMs + 4 * oneHourMs).toISOString(),
      isExclusive: false,
    },
    {
      id: 'offer-kingston-ddr5',
      productId: 'prod-kingston-ddr5-32gb',
      title: {
        ar: 'عرض الترقية — رامات Kingston FURY 32GB DDR5',
        en: 'Upgrade Deal — Kingston FURY 32GB DDR5 6000',
      },
      badgeText: { ar: 'عرض الأسبوع', en: 'Weekly Deal' },
      offerPriceUsd: 109,
      startTime: new Date(referenceNowMs - 1 * oneDayMs).toISOString(),
      endTime: new Date(referenceNowMs + 4 * oneDayMs).toISOString(),
      isExclusive: false,
    },
  ];
}

export const INITIAL_CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: 'req-101',
    productId: 'prod-rog-strix-g16',
    productName: {
      ar: 'لابتوب ألعاب ASUS ROG Strix G16 (2026) — RTX 4070',
      en: 'ASUS ROG Strix G16 Gaming Laptop — Core i7 / RTX 4070',
    },
    productSku: 'PXL-LAP-001',
    priceUsdAtRequest: 1365,
    priceSypAtRequest: 17062500,
    customerName: 'طارق الحسن (Tarek Al-Hassan)',
    phoneNumber: '+963 9XX XXX 890',
    note: 'أرغب بالاستفسار عن إمكانية ترقية الرام إلى 32GB عند الاستلام.',
    createdAt: '2026-10-27T08:30:00Z',
    status: 'NEW',
  },
  {
    id: 'req-102',
    productId: 'prod-pny-rtx-4070-super',
    productName: {
      ar: 'كرت شاشة PNY GeForce RTX 4070 SUPER 12GB VERTO OC Dual Fan',
      en: 'PNY GeForce RTX 4070 SUPER 12GB GDDR6X VERTO OC Edition',
    },
    productSku: 'PXL-GPU-001',
    priceUsdAtRequest: 589,
    priceSypAtRequest: 7362500,
    customerName: 'كريم الصباغ (Karim Al-Sabbagh)',
    phoneNumber: '+963 9XX XXX 112',
    note: 'هل الكرت متوفر للاستلام اليوم المساء؟',
    createdAt: '2026-10-26T19:15:00Z',
    status: 'CONTACTED',
  },
  {
    id: 'req-103',
    productId: 'prod-logitech-mx-keys-s',
    productName: {
      ar: 'لوحة مفاتيح لاسلكية مكتبية Logitech MX Keys S — عربي/إنكليزي',
      en: 'Logitech MX Keys S Wireless Illuminated Office Keyboard (AR/EN)',
    },
    productSku: 'PXL-KB-003',
    priceUsdAtRequest: 112,
    priceSypAtRequest: 1400000,
    customerName: 'رنا عبيد (Rana Obeid)',
    phoneNumber: '+963 9XX XXX 204',
    note: 'يرجى التأكيد أن الحروف العربية محفورة بالليزر باللون الرمادي الداكن.',
    createdAt: '2026-10-25T14:40:00Z',
    status: 'COMPLETED',
  },
];
