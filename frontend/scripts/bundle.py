import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def clean_module_code(code):
    """
    Remove ES module import/export statements and 'export default ...'
    for browser Babel standalone execution.
    """
    code = code.lstrip('\ufeff')
    lines = []
    in_multiline_import = False

    for line in code.splitlines():
        # Check if currently inside multiline import
        if in_multiline_import:
            if re.search(r"['\"][^'\"]+['\"]\s*;?", line):
                in_multiline_import = False
            continue

        # Check start of multiline import: import { ...
        if re.match(r'^[\ufeff\s]*import\s+\{', line) and not re.search(r"from\s+['\"][^'\"]+['\"]\s*;?", line):
            in_multiline_import = True
            continue

        # Strip single-line import statements
        if re.match(r'^[\ufeff\s]*import\s+', line):
            continue

        # Strip export default
        if re.match(r'^[\ufeff\s]*export\s+default\s+', line):
            continue

        # Replace 'export async function' -> 'async function'
        #         'export function' -> 'function'
        #         'export const/let/var/class' -> 'const/let/var/class'
        line = re.sub(r'^[\ufeff\s]*export\s+(async\s+function|function|const|let|var|class)\s+', r'\1 ', line)

        # Strip standalone export { ... }
        if re.match(r'^[\ufeff\s]*export\s*\{[^}]*\}\s*;?\s*$', line):
            continue

        lines.append(line)

    return "\n".join(lines)

def read_src(path):
    with open(os.path.join(ROOT, 'src', path), 'r', encoding='utf-8') as f:
        return clean_module_code(f.read().lstrip('\ufeff'))

def generate_bundle():
    print("Bundling src/ modules into index.html...")

    data_products = read_src('data/products.js')
    data_categories = read_src('data/categories.js')
    data_articles = read_src('data/articles.js')
    data_vouchers = read_src('data/vouchers.js')

    utils_formatters = read_src('utils/formatters.js')
    utils_storage = read_src('utils/storage.js')
    utils_vietqr = read_src('utils/vietqr.js')
    utils_coupon = read_src('utils/coupon.js')
    utils_router = read_src('utils/router.js')

    services_api = read_src('services/api.js')
    services_product = read_src('services/productService.js')
    services_order = read_src('services/orderService.js')
    services_voucher = read_src('services/voucherService.js')
    services_review = read_src('services/reviewService.js')

    comp_icon = read_src('components/Icon.jsx')
    comp_header = read_src('components/Header.jsx')
    comp_footer = read_src('components/Footer.jsx')
    comp_cart = read_src('components/CartDrawer.jsx')
    comp_toast = read_src('components/Toast.jsx')
    comp_quickview = read_src('components/QuickViewModal.jsx')
    comp_card = read_src('components/ProductCard.jsx')
    comp_voucher = read_src('components/VoucherModal.jsx')
    comp_order_detail = read_src('components/OrderDetailModal.jsx')
    comp_review = read_src('components/ReviewFormModal.jsx')
    comp_auth = read_src('components/AuthModal.jsx')

    page_home = read_src('pages/HomePage.jsx')
    page_pdp = read_src('pages/ProductDetailPage.jsx')
    page_checkout = read_src('pages/CheckoutPage.jsx')
    page_order_success = read_src('pages/OrderSuccessPage.jsx')
    page_category = read_src('pages/CategoryPage.jsx')
    page_orders = read_src('pages/OrdersHistoryPage.jsx')

    app_jsx = read_src('App.jsx')

    html_content = f"""<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>nét. — CÔNG NGHỆ ĐÚNG GU (E-commerce System)</title>
  <meta name="description" content="Công nghệ bạn thích. Trải nghiệm bạn tin. Mua sắm iPhone 16 Pro, MacBook, Samsung Galaxy S24, tai nghe chính hãng tại nét.">

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Lucide Icons (SVG Vector System) -->
  <script crossorigin src="https://unpkg.com/lucide@latest"></script>

  <!-- React 18, ReactDOM & Babel Standalone (Zero-config client runtime) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind Configuration matching Figma tokens -->
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          fontFamily: {{
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          }},
          colors: {{
            net: {{
              blue: '#0275A9',
              'blue-dark': '#02628e',
              'blue-soft': '#EAF4FA',
              'blue-light': '#9FCBE2',
              navy: '#161E3E',
              dark: '#141923',
              muted: '#707783',
              border: '#E5E8EC',
              gray: '#F5F6F8',
              'hero-gray': '#F0F2F4',
              'card-gray': '#F1F3F5',
              'text-dim': '#B9C2D6',
            }}
          }},
          boxShadow: {{
            'card': '0 2px 12px rgba(20, 25, 35, 0.06)',
            'card-hover': '0 8px 24px rgba(2, 117, 169, 0.12)',
            '2xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        }}
      }}
    }}
  </script>

  <!-- External Stylesheet (Design System, Tokens & Animations) -->
  <link rel="stylesheet" href="src/assets/css/style.css">
</head>
<body class="bg-white text-[#141923] min-h-screen">

  <!-- React Mount Root -->
  <div id="root"></div>

  <!-- React 18 Application Script (Modular Bundled Source) -->
  <script type="text/babel">
const {{ useState, useEffect, useMemo, useRef }} = React;

// =========================================================================
// 1. DATA MODULES
// =========================================================================
{data_products}

{data_categories}

{data_articles}

{data_vouchers}

// =========================================================================
// 2. UTILITY MODULES
// =========================================================================
{utils_formatters}

{utils_storage}

{utils_vietqr}

{utils_coupon}

{utils_router}

// =========================================================================
// 3. SERVICES LAYER (BACKEND READY)
// =========================================================================
{services_api}

{services_product}

{services_order}

{services_voucher}

{services_review}

// =========================================================================
// 4. COMPONENTS
// =========================================================================
{comp_icon}

{comp_toast}

{comp_header}

{comp_footer}

{comp_cart}

{comp_quickview}

{comp_card}

{comp_voucher}

{comp_order_detail}

{comp_review}

{comp_auth}

// =========================================================================
// 5. PAGES
// =========================================================================
{page_home}

{page_pdp}

{page_checkout}

{page_order_success}

{page_category}

{page_orders}

// =========================================================================
// 6. MAIN APP CONTAINER
// =========================================================================
{app_jsx}

// Mount React Root to DOM
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
  </script>
</body>
</html>
"""

    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html_content)

    print("Bundling completed successfully into index.html!")

if __name__ == '__main__':
    generate_bundle()
