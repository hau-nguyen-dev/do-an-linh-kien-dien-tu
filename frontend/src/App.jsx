import React, { useState, useEffect, useMemo, useRef } from 'react';

// Data & Utils & Services
import { parseRoute } from './utils/router.js';
import { getStorage, setStorage } from './utils/storage.js';
import { productService } from './services/productService.js';
import { reviewService } from './services/reviewService.js';
import { orderService } from './services/orderService.js';
import { INITIAL_PRODUCTS } from './data/products.js';
import { ARTICLES, FAQS } from './data/articles.js';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import QuickViewModal from './components/QuickViewModal.jsx';
import VoucherModal from './components/VoucherModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Toast from './components/Toast.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrdersHistoryPage from './pages/OrdersHistoryPage.jsx';

export function App() {
  // 1. ROUTER STATE
  const [currentRoute, setCurrentRoute] = useState(() =>
    parseRoute(window.location.hash)
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
  };

  // 2. BACKEND & PERSISTENT GLOBAL STATE
  const [products, setProducts] = useState(() => INITIAL_PRODUCTS);
  const [banners, setBanners] = useState([]);
  const [articles, setArticles] = useState(() => ARTICLES);
  const [faqs, setFaqs] = useState(() => FAQS);
  const [storeSettings, setStoreSettings] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [cart, setCart] = useState(() => getStorage("net_cart", []));
  const [wishlist, setWishlist] = useState(() => getStorage("net_wishlist", []));
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getStorage("net_user", null));
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
  const [productReviews, setProductReviews] = useState(() => getStorage("net_custom_reviews", {}));

  // Nạp dữ liệu thực tế từ SQLite Backend (nếu server đang chạy)
  useEffect(() => {
    productService.getAll()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch((err) => {
        console.warn('[App] Backend offline, hiển thị catalog sản phẩm cục bộ:', err);
      });

    orderService.getOrders()
      .then((data) => {
        if (data && data.length > 0) {
          setOrders(data);
        }
      })
      .catch((err) => console.error('[App] Lỗi tải đơn hàng từ backend:', err));

    fetch('http://localhost:5000/api/banners')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch((err) => console.error('[App] Lỗi tải banners:', err));

    fetch('http://localhost:5000/api/articles')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setArticles(data); })
      .catch((err) => console.error('[App] Lỗi tải articles:', err));

    fetch('http://localhost:5000/api/faqs')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setFaqs(data); })
      .catch((err) => console.error('[App] Lỗi tải faqs:', err));

    fetch('http://localhost:5000/api/settings')
      .then((res) => res.json())
      .then((data) => { if (data) setStoreSettings(data); })
      .catch((err) => console.error('[App] Lỗi tải settings:', err));
  }, []);

  // Tự động đồng bộ sản phẩm mới nhất từ SQLite (Realtime Polling 3s & Window Focus)
  useEffect(() => {
    const refreshData = () => {
      productService.getAll()
        .then((data) => {
          if (data && data.length > 0) setProducts(data);
        })
        .catch((err) => console.warn('[App] Auto-refresh products error:', err));

      orderService.getOrders()
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch((err) => console.warn('[App] Auto-refresh orders error:', err));
    };

    refreshData();
    const timer = setInterval(refreshData, 3000);
    window.addEventListener('focus', refreshData);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refreshData);
    };
  }, []);

  const handleAddOrder = async (newOrder) => {
    try {
      const created = await orderService.createOrder({
        orderId: newOrder.orderId,
        customerName: newOrder.customer?.fullName || newOrder.customerName || 'Khách vãng lai',
        phone: newOrder.customer?.phone || newOrder.phone || '',
        address: newOrder.customer?.address || newOrder.address || '',
        note: newOrder.customer?.note || newOrder.note || '',
        paymentMethod: newOrder.paymentMethod,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        discount: newOrder.discountAmount || 0,
        total: newOrder.total,
        status: newOrder.status,
      });
      setOrders((prev) => [created || newOrder, ...prev]);
    } catch (err) {
      console.error('[App] Lỗi lưu đơn hàng vào backend:', err);
      setOrders((prev) => [newOrder, ...prev]);
    }
  };

  const handleCancelOrder = (orderId, reason) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: "Đã hủy", cancelReason: reason } : o))
    );
    showToast(`Đã hủy thành công đơn hàng #${orderId}`, "info");
  };

  const handleReorder = (items) => {
    setCart((prev) => [...prev, ...items]);
    setIsCartOpen(true);
    showToast("Đã thêm các sản phẩm vào giỏ hàng!", "success");
  };

  const handleAddReview = async (productId, newReview) => {
    try {
      await reviewService.addReview(productId, newReview);
      const updated = await productService.getById(productId);
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      }
    } catch (err) {
      console.warn('[App] Lưu review lên SQLite thất bại, chuyển lưu cục bộ:', err);
    }
    setProductReviews((prev) => {
      const updated = { ...prev, [productId]: [newReview, ...(prev[productId] || [])] };
      setStorage("net_custom_reviews", updated);
      return updated;
    });
    showToast("Cảm ơn bạn đã gửi đánh giá!", "success");
    showToast("Cảm ơn bạn! Đánh giá đã được xuất bản trên nét.", "success");
  };

  useEffect(() => setStorage("net_cart", cart), [cart]);
  useEffect(() => setStorage("net_wishlist", wishlist), [wishlist]);
  useEffect(() => setStorage("net_orders", orders), [orders]);
  useEffect(() => setStorage("net_user", currentUser), [currentUser]);

  // 3. UI STATE
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});

  const searchInputRef = useRef(null);

  // Toast System
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // 4. CART INTERACTIONS
  const addToCart = (product, options = {}) => {
    const selectedColor = options.color || (product.colors && product.colors[0]?.name) || "Tiêu chuẩn";
    const selectedStorage = options.storage || (product.storageOptions && product.storageOptions[0]?.label) || "Tiêu chuẩn";
    const priceDiff = options.priceDiff || 0;
    const finalPrice = product.price + priceDiff;
    const cartItemId = `${product.id}-${selectedColor}-${selectedStorage}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + (options.quantity || 1) }
            : item
        );
      }
      return [
        ...prevCart,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          fullName: product.fullName || product.name,
          price: finalPrice,
          originalPrice: product.originalPrice + priceDiff,
          img: product.img,
          selectedColor,
          selectedStorage,
          quantity: options.quantity || 1,
        },
      ];
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Đã dọn sạch giỏ hàng", "info");
  };

  const totalCartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  // 5. WISHLIST TOGGLE
  const toggleWishlist = (productId, productName) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Đã bỏ "${productName}" khỏi yêu thích`, "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Đã lưu "${productName}" vào yêu thích!`);
        return [...prev, productId];
      }
    });
  };

  // 6. SEARCH & HOTKEY
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuickViewProduct(null);
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
        setIsAuthOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lọc sản phẩm hiển thị trên Client: Chỉ hiển thị các sản phẩm có trạng thái Đang bán (active), ẩn hoàn toàn các sản phẩm Tạm ẩn (inactive)
  const activeProducts = useMemo(() => {
    return products.filter((p) => (p.status || p.trangThai || "active") === "active");
  }, [products]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.specsShort && p.specsShort.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [activeProducts, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`#/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="NTTrangChCNgNgh w-full min-h-screen bg-white text-[#141923] flex flex-col font-sans selection:bg-[#0275A9] selection:text-white">
      {/* HEADER */}
      <Header
        storeSettings={storeSettings}
        currentRoute={currentRoute}
        navigate={navigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchResults={searchResults}
        handleSearchSubmit={handleSearchSubmit}
        totalCartCount={totalCartCount}
        wishlist={wishlist}
        currentUser={currentUser}
        setIsCartOpen={setIsCartOpen}
        setIsAuthOpen={setIsAuthOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        searchInputRef={searchInputRef}
        showToast={showToast}
      />

      {/* DYNAMIC ROUTED CONTENT AREA */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto">
        {currentRoute.page === "home" && (
          <HomePage
            products={activeProducts}
            banners={banners}
            articles={articles}
            faqs={faqs}
            settings={storeSettings}
            isLoading={isLoadingProducts}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onQuickView={setQuickViewProduct}
            onNavigate={navigate}
            faqOpen={faqOpen}
            setFaqOpen={setFaqOpen}
            onShowToast={showToast}
          />
        )}

        {currentRoute.page === "pdp" && (
          <ProductDetailPage
            products={products}
            productId={currentRoute.productId}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onNavigate={navigate}
            onShowToast={showToast}
            customReviews={productReviews[currentRoute.productId] || []}
            onAddReview={handleAddReview}
            storeSettings={storeSettings}
          />
        )}

        {currentRoute.page === "category" && (
          <CategoryPage
            products={activeProducts}
            categorySlug={currentRoute.categorySlug}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onQuickView={setQuickViewProduct}
            onNavigate={navigate}
            onShowToast={showToast}
          />
        )}

        {currentRoute.page === "checkout" && (
          <CheckoutPage
            cart={cart}
            cartSubtotal={cartSubtotal}
            onClearCart={clearCart}
            onNavigate={navigate}
            currentUser={currentUser}
            onAddOrder={handleAddOrder}
            onShowToast={showToast}
            selectedVoucherCode={selectedVoucherCode}
            onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
          />
        )}

        {currentRoute.page === "order-success" && (
          <OrderSuccessPage
            orderId={currentRoute.orderId}
            orders={orders}
            onNavigate={navigate}
          />
        )}

        {currentRoute.page === "orders" && (
          <OrdersHistoryPage
            orders={orders}
            onNavigate={navigate}
            onShowToast={showToast}
            onCancelOrder={handleCancelOrder}
            onReorder={handleReorder}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer navigate={navigate} showToast={showToast} storeSettings={storeSettings} />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        totalCartCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        updateQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate("#/checkout");
        }}
        navigate={navigate}
      />

      {/* VOUCHER MODAL */}
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSelectVoucher={(code) => {
          setSelectedVoucherCode(code);
          showToast(`Đã áp dụng mã ưu đãi: ${code}!`, "success");
        }}
        cartSubtotal={cartSubtotal}
        currentCode={selectedVoucherCode}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(userData) => {
          setCurrentUser(userData);
          showToast(`Chào mừng trở lại, ${userData.name}!`, "success");
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast("Đã đăng xuất tài khoản", "info");
        }}
        onNavigateOrders={() => {
          setIsAuthOpen(false);
          navigate("#/orders");
        }}
      />

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p) => addToCart(p)}
        onViewDetail={(id) => navigate(`#/product/${id}`)}
      />

      {/* TOAST SYSTEM */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default App;
