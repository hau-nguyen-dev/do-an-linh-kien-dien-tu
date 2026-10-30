import React, { useState, useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CATEGORIES } from '../data/categories.js';

export function CategoryPage({ products = [], categorySlug, onAddToCart, onToggleWishlist, wishlist, onQuickView, onNavigate, onShowToast }) {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categoryName = useMemo(() => {
    if (categorySlug === "all") return "Tất cả thiết bị công nghệ";
    const found = CATEGORIES.find((c) => c.slug === categorySlug);
    return found ? found.name : "Danh mục sản phẩm";
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categorySlug && categorySlug !== "all") {
      list = list.filter((p) => p.category === categorySlug);
    }
    if (selectedBrand !== "all") {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    if (selectedPriceRange === "under-10") {
      list = list.filter((p) => p.price < 10000000);
    } else if (selectedPriceRange === "10-20") {
      list = list.filter((p) => p.price >= 10000000 && p.price <= 20000000);
    } else if (selectedPriceRange === "over-20") {
      list = list.filter((p) => p.price > 20000000);
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, categorySlug, selectedBrand, selectedPriceRange, sortBy]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-8 animate-in zoom-in-95 duration-200 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#707783] flex items-center gap-2">
        <button onClick={() => onNavigate("#/")} className="hover:text-[#0275A9]">Trang chủ</button>
        <span>/</span>
        <span className="text-[#141923] font-semibold">{categoryName}</span>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E8EC] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141923]">{categoryName}</h1>
          <p className="text-xs text-[#707783] mt-0.5">Tìm thấy {filteredProducts.length} sản phẩm chính hãng</p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#707783]">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg text-xs outline-none focus:border-[#0275A9]"
          >
            <option value="default">Mặc định (Nổi bật nhất)</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 p-5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl">
          {/* Brand Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#141923] uppercase tracking-wider">Thương hiệu</h3>
            <div className="space-y-1.5 text-xs text-[#707783]">
              {[
                { id: "all", label: "Tất cả thương hiệu" },
                { id: "apple", label: "Apple" },
                { id: "samsung", label: "Samsung" },
                { id: "xiaomi", label: "Xiaomi" },
                { id: "oppo", label: "OPPO" },
                { id: "sony", label: "Sony" },
              ].map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:text-[#141923]">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.id}
                    onChange={() => setSelectedBrand(b.id)}
                    className="text-[#0275A9]"
                  />
                  <span>{b.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 pt-4 border-t border-[#E5E8EC]">
            <h3 className="text-xs font-bold text-[#141923] uppercase tracking-wider">Khoảng giá</h3>
            <div className="space-y-1.5 text-xs text-[#707783]">
              {[
                { id: "all", label: "Tất cả mức giá" },
                { id: "under-10", label: "Dưới 10 triệu" },
                { id: "10-20", label: "Từ 10 - 20 triệu" },
                { id: "over-20", label: "Trên 20 triệu" },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-[#141923]">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === p.id}
                    onChange={() => setSelectedPriceRange(p.id)}
                    className="text-[#0275A9]"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedBrand("all");
              setSelectedPriceRange("all");
              setSortBy("default");
            }}
            className="w-full py-2 bg-white hover:bg-[#E5E8EC] border border-[#E5E8EC] text-xs font-semibold rounded-lg text-[#707783] hover:text-[#141923] transition"
          >
            Đặt lại bộ lọc
          </button>
        </div>

        {/* Right Product Grid (9 Cols) */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-[#707783] bg-[#F8FAFC] rounded-2xl border border-[#E5E8EC]">
              <div className="w-14 h-14 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Icon name="search" className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#141923] mb-1">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs">Hãy thử đổi thương hiệu hoặc nới lỏng khoảng giá.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlist.includes(p.id)}
                  onAddToCart={() => onAddToCart(p)}
                  onToggleWishlist={() => onToggleWishlist(p.id, p.name)}
                  onQuickView={() => onQuickView(p)}
                  onSelect={() => onNavigate(`#/product/${p.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-PAGE: ORDERS HISTORY
// =========================================================================
export default CategoryPage;
