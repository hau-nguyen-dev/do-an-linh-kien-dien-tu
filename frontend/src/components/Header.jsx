import React from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function Header({
  currentRoute,
  navigate,
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchResults,
  handleSearchSubmit,
  totalCartCount,
  wishlist = [],
  currentUser,
  setIsCartOpen,
  setIsAuthOpen,
  setIsMobileMenuOpen,
  searchInputRef,
  showToast,
  storeSettings = {}
}) {
  const hotline = storeSettings?.hotline || "1900 6868";
  const announcement = storeSettings?.announcement || "Công nghệ bạn thích. Trải nghiệm bạn tin.";
  return (
    <header className="IUHNg w-full flex flex-col sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E8EC] transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="ThNgBO w-full h-[32px] bg-[#161E3E] text-white overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto h-full px-4 sm:px-8 lg:px-16 flex justify-between items-center text-[11px]">
          <div className="truncate">
            <span>{announcement}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href={`tel:${hotline}`} className="hover:text-[#9FCBE2] transition">
              Tư vấn {hotline}
            </a>
            <span className="opacity-60">·</span>
            <a
              href="#/category/all"
              onClick={() => showToast && showToast("Hệ thống 4 cửa hàng tại Hà Nội & TP.HCM", "info")}
              className="hover:text-[#9FCBE2] transition flex items-center gap-1"
            >
              <span>Hệ thống cửa hàng</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Brand Logo, Live Search Bar & Action Buttons */}
      <div className="TMKiMVTIKhoN w-full min-h-[72px] lg:h-[84px] flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex justify-between lg:justify-start items-center gap-4 sm:gap-6 lg:gap-[34px]">
          {/* Logo */}
          <div className="w-auto sm:w-[215px] flex items-center gap-4 sm:gap-5 shrink-0">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate("#/");
              }}
              className="Logo flex items-baseline select-none cursor-pointer group"
            >
              <span className="text-[#141923] text-[36px] sm:text-[40px] font-extrabold tracking-tight group-hover:opacity-90 transition">
                nét
              </span>
              <span className="text-[#0275A9] text-[36px] sm:text-[40px] font-extrabold">.</span>
            </a>
            <div className="hidden sm:block text-[#707783] text-[10px] font-normal leading-[15px] tracking-wider uppercase border-l border-[#E5E8EC] pl-3">
              CÔNG NGHỆ<br />ĐÚNG GU
            </div>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="TMKiM flex-1 max-w-[580px] h-[44px] px-3.5 bg-[#F5F6F8] rounded-xl border border-transparent focus-within:border-[#0275A9] focus-within:bg-white transition-all relative flex items-center"
          >
            <div className="text-[#707783] shrink-0 mr-2.5">
              <Icon name="search" className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Bạn đang tìm điện thoại, tai nghe hay laptop?"
              className="w-full bg-transparent text-[13px] text-[#141923] placeholder-[#707783] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#707783] hover:text-[#141923] p-1 text-xs"
              >
                ✕
              </button>
            )}
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-[#E5E8EC] rounded text-[10px] text-[#707783] font-mono shrink-0 shadow-2xs">
              <span>⌘</span><span>K</span>
            </div>

            {/* Live Search Popup */}
            {isSearchFocused && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-card-hover border border-[#E5E8EC] p-3 z-50 space-y-2 animate-in zoom-in-95 duration-150">
                <div className="text-[11px] font-semibold text-[#707783] px-2 uppercase tracking-wider">
                  Gợi ý sản phẩm ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onMouseDown={() => {
                      setSearchQuery("");
                      navigate(`#/product/${item.id}`);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-[#F5F6F8] rounded-lg cursor-pointer transition"
                  >
                    <img src={item.img} alt={item.name} className="w-10 h-10 object-contain rounded bg-[#F5F6F8] p-1" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#141923] truncate">{item.name}</div>
                      <div className="text-[11px] text-[#0275A9] font-bold">{formatVND(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Action Buttons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!wishlist || wishlist.length === 0) {
                  showToast && showToast("Bạn chưa lưu sản phẩm yêu thích nào!", "info");
                } else {
                  showToast && showToast(`Bạn đang lưu ${wishlist.length} sản phẩm yêu thích!`, "info");
                }
              }}
              className="hidden md:flex items-center gap-2 text-[#141923] hover:text-[#0275A9] transition relative"
              title="Danh sách yêu thích"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={wishlist && wishlist.length > 0 ? "#F43F5E" : "none"}
                stroke={wishlist && wishlist.length > 0 ? "#F43F5E" : "currentColor"}
                strokeWidth="2"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlist && wishlist.length > 0 && (
                <span className="text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.2 font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              onClick={() => setIsAuthOpen && setIsAuthOpen(true)}
              className="flex items-center gap-[9px] text-[#141923] hover:text-[#0275A9] transition cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path
                  d="M10 10.83C12.3 10.83 14.17 8.97 14.17 6.67C14.17 4.37 12.3 2.5 10 2.5C7.7 2.5 5.83 4.37 5.83 6.67C5.83 8.97 7.7 10.83 10 10.83ZM10 12.79C12.5 12.79 16.67 14.04 16.67 16.67V17.5H3.33V16.67C3.33 14.04 7.5 12.79 10 12.79Z"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-[12px] font-normal hidden sm:block">
                {currentUser ? currentUser.name : "Tài khoản"}
              </div>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen && setIsCartOpen(true)}
              className="flex items-center gap-[9px] text-[#141923] hover:text-[#0275A9] transition relative cursor-pointer"
            >
              <div className="relative">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path
                    d="M13.33 8.33C13.33 10.17 11.83 11.67 10 11.67C8.17 11.67 6.67 10.17 6.67 8.33M2.59 5.03H17.41M2.59 5.03L4.5 2.33C4.86 1.84 5.32 1.67 5.83 1.67H14.17C14.68 1.67 15.14 1.84 15.5 2.33L17.41 5.03M17.5 5.56V16.67C17.5 17.59 16.75 18.33 15.83 18.33H4.17C3.25 18.33 2.5 17.59 2.5 16.67V5.56"
                    strokeLinecap="round"
                  />
                </svg>
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0275A9] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="text-[12px] font-normal">
                Giỏ hàng (<span>{totalCartCount}</span>)
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#141923] hover:text-[#0275A9]"
              aria-label="Mở menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Bar */}
      <nav className="DanhMCIUHNg w-full h-[48px] border-t border-[#E5E8EC] hidden lg:flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 overflow-x-auto flex justify-between items-center text-[13px]">
          <div
            onClick={() => navigate("#/category/all")}
            className="flex items-center gap-2 cursor-pointer font-semibold text-[#141923] hover:text-[#0275A9] transition shrink-0 pr-6"
          >
            <Icon name="grid" className="w-4 h-4 text-[#0275A9]" />
            <span>Tất cả danh mục</span>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            {[
              { name: "Điện thoại", link: "#/category/phones" },
              { name: "Laptop", link: "#/category/laptops" },
              { name: "Máy tính bảng", link: "#/category/tablets" },
              { name: "Âm thanh", link: "#/category/audio" },
              { name: "Đồng hồ", link: "#/category/watches" },
              { name: "Phụ kiện", link: "#/category/accessories" },
            ].map((cat) => (
              <a
                key={cat.name}
                href={cat.link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(cat.link);
                }}
                className={`py-3 transition text-[#141923] hover:text-[#0275A9] border-b-2 ${
                  currentRoute && currentRoute.page === "category" && currentRoute.categorySlug === cat.link.replace("#/category/", "")
                    ? "border-[#0275A9] text-[#0275A9] font-semibold"
                    : "border-transparent"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>

          <div className="shrink-0 pl-6">
            <a
              href="#/category/all?filter=discount"
              onClick={(e) => {
                e.preventDefault();
                navigate("#/category/all?filter=discount");
              }}
              className="text-[#0275A9] font-semibold hover:underline flex items-center gap-1.5"
            >
              <Icon name="sparkles" className="w-4 h-4 text-[#0275A9]" />
              <span>Góc giá tốt</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
