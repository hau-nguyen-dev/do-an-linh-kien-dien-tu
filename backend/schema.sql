-- =============================================================================
-- NÉT. Tech Store - Database Schema (SQLite)
-- Chuẩn hóa dữ liệu cho E-commerce Storefront & Admin Portal
-- =============================================================================

-- 1. BẢNG SẢN PHẨM (PRODUCTS)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT,
    brand TEXT NOT NULL,
    brand_label TEXT,
    category TEXT NOT NULL,
    category_label TEXT,
    price INTEGER NOT NULL,
    original_price INTEGER,
    discount_amount INTEGER DEFAULT 0,
    is_installment INTEGER DEFAULT 1,
    img TEXT NOT NULL,
    gallery TEXT,               -- Lưu trữ JSON mảng các đường dẫn ảnh
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    specs_short TEXT,
    gift TEXT,
    badge TEXT,
    desc TEXT,
    colors TEXT,                -- Lưu trữ JSON mảng màu sắc: [{id, name, hex}]
    storage_options TEXT,       -- Lưu trữ JSON mảng dung lượng: [{id, label, priceDiff}]
    specs_detailed TEXT,        -- Lưu trữ JSON object thông số kỹ thuật chi tiết
    reviews TEXT,               -- Lưu trữ JSON mảng đánh giá: [{id, author, date, rating, content}]
    stock INTEGER DEFAULT 50,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    note TEXT,
    payment_method TEXT NOT NULL,
    items TEXT NOT NULL,         -- Lưu trữ JSON mảng giỏ hàng [{id, name, price, qty, img, color, storage}]
    subtotal INTEGER NOT NULL,
    discount INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'Đang xử lý',
    cancel_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG DANH MỤC (CATEGORIES)
CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    count TEXT,
    icon TEXT,
    link TEXT
);

-- 4. BẢNG MÃ GIẢM GIÁ (VOUCHERS)
CREATE TABLE IF NOT EXISTS vouchers (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL, -- 'percent' hoặc 'fixed'
    discount_value INTEGER NOT NULL,
    min_order INTEGER DEFAULT 0,
    description TEXT
);

-- 5. BẢNG BANNER & CHIẾN DỊCH QUẢNG CÁO (BANNERS)
CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,         -- 'hero', 'promo_tradein', 'promo_accessories'
    tag TEXT,                    -- '01 / CHIẾN DỊCH CHÍNH', 'COMBO TIẾT KIỆM'
    title TEXT NOT NULL,         -- 'Đỉnh cao. Trong tầm tay.'
    description TEXT,
    button_text TEXT,            -- 'Khám phá ngay'
    button_link TEXT,            -- '#/product/p1'
    price_text TEXT,             -- '28.490.000₫'
    img TEXT,                    -- 'src/assets/img/hero-iphone-16-pro.png'
    is_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG BÀI VIẾT & TIN TỨC CÔNG NGHỆ (ARTICLES)
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,               -- 'TƯ VẤN MUA', 'PHONG CÁCH SỐ', 'MẸO CÔNG NGHỆ'
    read_time TEXT,              -- '5 phút đọc'
    author TEXT,
    date TEXT,
    img TEXT,
    excerpt TEXT,
    content TEXT,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG CÂU HỎI THƯỜNG GẶP (FAQS)
CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_num INTEGER DEFAULT 0
);

-- 8. BẢNG CẤU HÌNH CỬA HÀNG & THƯƠNG HIỆU (STORE_SETTINGS)
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,        -- 'hotline', 'announcement', 'showrooms', 'usps'
    value TEXT NOT NULL
);

-- 9. BẢNG HỎI ĐÁP & BÌNH LUẬN SẢN PHẨM (COMMENTS)
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_phone TEXT,
    content TEXT NOT NULL,
    admin_reply TEXT,
    status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Chỉ mục hỗ trợ tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);

