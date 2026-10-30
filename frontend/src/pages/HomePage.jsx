import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Icon from '../components/Icon.jsx';
import { ARTICLES } from '../data/articles.js';

function HomePage({
  products = [],
  banners = [],
  articles = [],
  faqs = [],
  settings = {},
  isLoading = false,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onQuickView,
  onNavigate,
  faqOpen,
  setFaqOpen,
  onShowToast,
}) {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedEcosystemTab, setSelectedEcosystemTab] = useState("work");

  // Lấy dữ liệu Hero Banner và Promo Banners thật từ Database Backend
  const heroBanner = banners.find((b) => b.id === "hero") || {
    tag: "01 / CHIẾN DỊCH CHÍNH",
    title: "Đỉnh cao.\nTrong tầm tay.",
    description: "Titan sa mạc. Nâng cấp camera 48MP Fusion và chip A18 Pro tối tân. Sẵn sàng cho mọi sáng tạo đỉnh cao.",
    buttonText: "Khám phá ngay",
    buttonLink: "#/product/p1",
    priceText: "28.490.000₫",
    img: "src/assets/img/hero-iphone-16-pro.png",
  };

  const promoTradein = banners.find((b) => b.id === "promo_tradein") || {
    tag: "THU CŨ ĐỔI MỚI",
    title: "Máy cũ trao tay.\nTrải nghiệm mới tới.",
    description: "Trợ giá đến 4.000.000₫ khi lên đời điện thoại, thủ tục chỉ 15 phút.",
    buttonText: "Xem định giá máy",
    buttonLink: "#/category/phones",
    img: "src/assets/img/banner-trade-in.png",
  };

  const promoAccessories = banners.find((b) => b.id === "promo_accessories") || {
    tag: "COMBO TIẾT KIỆM",
    title: "Thêm phụ kiện.\nTrọn trải nghiệm.",
    description: "Giảm đến 40% cho củ sạc, ốp lưng, tai nghe khi mua kèm thiết bị chính.",
    buttonText: "Mua combo ngay",
    buttonLink: "#/category/accessories",
    img: "src/assets/img/banner-accessories.png",
  };

  const displayArticles = articles && articles.length > 0 ? articles : ARTICLES;
  const displayFaqs = faqs && faqs.length > 0 ? faqs : FAQS;
  const displayUsps = settings.usps && settings.usps.length > 0 ? settings.usps : [
    { title: "Cam kết chính hãng 100% VN/A", icon: "shield-check" },
    { title: "Giao nhanh 2h nội thành", icon: "truck" },
    { title: "Trả góp 0% linh hoạt", icon: "credit-card" },
    { title: "Bảo hành chính hãng 12 tháng", icon: "shield" }
  ];

  const phones = useMemo(
    () => products.filter((p) => p.category === "phones"),
    [products]
  );

  const filteredPhones = useMemo(() => {
    if (selectedBrand === "all") return phones;
    return phones.filter((p) => p.brand === selectedBrand);
  }, [phones, selectedBrand]);

  const ecosystemProducts = useMemo(
    () => products.filter((p) => p.category !== "phones"),
    [products]
  );

  const filteredEcosystem = useMemo(() => {
    if (selectedEcosystemTab === "work") {
      return ecosystemProducts.filter((p) => ["laptops", "tablets"].includes(p.category));
    }
    if (selectedEcosystemTab === "entertainment") {
      return ecosystemProducts.filter((p) => p.category === "audio");
    }
    return ecosystemProducts.filter((p) => p.category === "watches");
  }, [ecosystemProducts, selectedEcosystemTab]);

  return (
    <div className="w-full flex flex-col space-y-12 pb-12 animate-in zoom-in-95 duration-200">
      {/* 1. HERO BANNER: Nạp dữ liệu thật từ Database */}
      <section className="ChiNDChNIBT w-full pt-6 px-4 sm:px-8 lg:px-8 flex flex-col justify-start items-start overflow-hidden">
        <div className="Iphone16Pro w-full min-h-[480px] lg:h-[520px] px-6 sm:px-12 lg:px-[52px] py-10 relative bg-[#F0F2F4] overflow-hidden rounded-[20px] flex flex-col lg:flex-row justify-between items-center">
          <div className="ThNgIPChiNDCh max-w-[500px] z-10 flex flex-col gap-[22px] items-start text-left relative">
            <div className="BSUTP text-[#0275A9] text-[11px] font-semibold tracking-wider uppercase">
              {heroBanner.tag}
            </div>
            <h1 className="TiuChINDCh text-[#141923] text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-tight lg:leading-[67.20px] tracking-tight whitespace-pre-line">
              {heroBanner.title}
            </h1>
            <p className="MT text-[#707783] text-[15px] font-normal leading-[24px] max-w-[400px]">
              {heroBanner.description}
            </p>

            <div className="MuaSnPhm flex flex-wrap items-center gap-[22px] pt-2">
              <button
                onClick={() => onNavigate(heroBanner.buttonLink || "#/product/p1")}
                className="NtHnhNg px-[22px] py-[14px] bg-[#0275A9] hover:bg-[#02628e] text-white text-[14px] font-semibold rounded-full flex items-center gap-4 transition shadow-md active:scale-95 duration-150 cursor-pointer"
              >
                <span>{heroBanner.buttonText || "Khám phá ngay"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>

              {heroBanner.priceText && (
                <div className="GiKhiIm flex flex-col gap-[3px]">
                  <span className="ChThchGi text-[#707783] text-[11px] font-normal">Giá chỉ từ</span>
                  <span className="Gi text-[#141923] text-[21px] font-semibold tracking-tight">{heroBanner.priceText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hero Banner Image */}
          <img
            src={heroBanner.img}
            alt={heroBanner.title}
            className="NhChiNDChIPhone w-full sm:w-[85%] lg:w-[846px] h-auto lg:h-[520px] static lg:absolute lg:right-0 lg:top-0 object-cover object-left lg:object-center pointer-events-none z-0 mt-8 lg:mt-0 drop-shadow-2xl"
          />
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHTS BAR */}
      <section className="ImNiBTDChV w-full px-4 sm:px-8 lg:px-8 py-5 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 border-b border-[#E5E8EC] text-[#707783] text-[12px]">
        {displayUsps.map((usp, uIdx) => (
          <div key={uIdx} className="flex items-center gap-[9px]">
            <div className="w-8 h-8 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center shrink-0 shadow-2xs">
              <Icon name={usp.icon || "shield-check"} className="w-4 h-4 text-[#0275A9]" />
            </div>
            <span className="font-medium text-[#141923]">{usp.title}</span>
          </div>
        ))}
      </section>

      {/* 3. CATEGORIES GRID */}
      <section className="KhmPhDanhMC w-full pt-[30px] pb-[40px] px-4 sm:px-8 lg:px-16 flex flex-col gap-6">
        <h2 className="text-[#141923] text-[22px] font-semibold tracking-tight">Công nghệ cho mọi nhịp sống</h2>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            const displayCount = count > 0 ? `${count} sản phẩm` : "Đang cập nhật";
            return (
              <div
                key={cat.slug}
                onClick={() => onNavigate(cat.link)}
                className="p-5 bg-[#F5F6F8] rounded-[12px] flex flex-col items-start gap-2.5 hover:bg-[#EAF4FA] transition duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0275A9] group-hover:bg-[#0275A9] group-hover:text-white group-hover:scale-110 transition shadow-2xs">
                  <Icon name={cat.icon} className="w-5 h-5 transition-colors" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[#141923] text-[14px] font-semibold">{cat.name}</div>
                  <div className="text-[#707783] text-[10px] font-normal">{displayCount}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PHONES */}
      <section id="phones" className="w-full px-4 sm:px-8 lg:px-16 flex flex-col gap-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="text-[#0275A9] text-[11px] font-semibold uppercase tracking-wider">BỘ SƯU TẬP THIẾT BỊ</div>
            <h2 className="text-[#141923] text-[20px] font-semibold tracking-tight">Điện thoại nổi bật</h2>
          </div>
          <button
            onClick={() => onNavigate("#/category/phones")}
            className="text-[#0275A9] text-[13px] font-semibold flex items-center gap-2 hover:underline cursor-pointer"
          >
            <span>Xem tất cả điện thoại</span>
            <span>→</span>
          </button>
        </div>

        {/* Brand Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "Tất cả" },
            { id: "apple", label: "Apple" },
            { id: "samsung", label: "Samsung" },
            { id: "xiaomi", label: "Xiaomi" },
            { id: "oppo", label: "OPPO" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBrand(tab.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium transition cursor-pointer whitespace-nowrap ${
                selectedBrand === tab.id
                  ? "bg-[#141923] text-white"
                  : "bg-[#F5F6F8] text-[#707783] hover:bg-[#E5E8EC] hover:text-[#141923]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPhones.map((phone) => (
            <ProductCard
              key={phone.id}
              product={phone}
              isWishlisted={wishlist.includes(phone.id)}
              onAddToCart={() => onAddToCart(phone)}
              onToggleWishlist={() => onToggleWishlist(phone.id, phone.name)}
              onQuickView={() => onQuickView(phone)}
              onSelect={() => onNavigate(`#/product/${phone.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. PROMO BANNERS: Dữ liệu thật từ Database */}
      <section className="w-full px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[286px] p-8 relative bg-[#161E3E] rounded-[16px] overflow-hidden flex flex-col justify-between gap-4 shadow-sm group">
          <div className="z-10 space-y-3">
            <div className="text-[#9FCBE2] text-[10px] font-semibold uppercase tracking-wider">{promoTradein.tag}</div>
            <h3 className="text-white text-[28px] sm:text-[30px] font-semibold leading-[34.5px] max-w-[315px] whitespace-pre-line">
              {promoTradein.title}
            </h3>
            <p className="text-[#B9C2D6] text-[12px] font-normal leading-[19.2px] max-w-[300px]">
              {promoTradein.description}
            </p>
          </div>
          <div className="z-10">
            <button
              onClick={() => onNavigate(promoTradein.buttonLink || "#/category/phones")}
              className="text-white text-[13px] font-semibold flex items-center gap-2 hover:underline cursor-pointer"
            >
              <span>{promoTradein.buttonText || "Xem chi tiết"}</span>
              <span>→</span>
            </button>
          </div>
          <img
            src={promoTradein.img}
            alt={promoTradein.title}
            className="absolute right-0 top-0 h-full w-[296px] object-contain object-right opacity-90 group-hover:scale-105 transition duration-300 pointer-events-none"
          />
        </div>

        <div className="flex-1 min-h-[286px] p-8 relative bg-[#EAF4FA] rounded-[16px] overflow-hidden flex flex-col justify-between gap-4 shadow-sm group">
          <div className="z-10 space-y-3">
            <div className="text-[#0275A9] text-[10px] font-semibold uppercase tracking-wider">{promoAccessories.tag}</div>
            <h3 className="text-[#141923] text-[28px] sm:text-[30px] font-semibold leading-[34.5px] max-w-[315px] whitespace-pre-line">
              {promoAccessories.title}
            </h3>
            <p className="text-[#707783] text-[12px] font-normal leading-[19.2px] max-w-[290px]">
              {promoAccessories.description}
            </p>
          </div>
          <div className="z-10">
            <button
              onClick={() => onNavigate(promoAccessories.buttonLink || "#/category/accessories")}
              className="text-[#0275A9] text-[13px] font-semibold flex items-center gap-2 hover:underline cursor-pointer"
            >
              <span>{promoAccessories.buttonText || "Mua combo ngay"}</span>
              <span>→</span>
            </button>
          </div>
          <img
            src={promoAccessories.img}
            alt={promoAccessories.title}
            className="absolute right-0 top-0 h-full w-[284px] object-contain object-right opacity-90 group-hover:scale-105 transition duration-300 pointer-events-none"
          />
        </div>
      </section>

      {/* 6. ECOSYSTEM SECTION */}
      <section id="ecosystem" className="w-full pt-10 pb-12 px-4 sm:px-8 lg:px-16 bg-[#F5F6F8] flex flex-col gap-[26px]">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="text-[#0275A9] text-[11px] font-semibold uppercase tracking-wider">HỆ SINH THÁI THIẾT BỊ</div>
            <h2 className="text-[#141923] text-[20px] font-semibold tracking-tight">Nâng cấp từng trải nghiệm</h2>
          </div>
          <button
            onClick={() => onNavigate("#/category/all")}
            className="text-[#0275A9] text-[13px] font-semibold flex items-center gap-2 hover:underline cursor-pointer"
          >
            <span>Xem hệ sinh thái</span>
            <span>→</span>
          </button>
        </div>

        {/* Ecosystem Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto border-b border-[#E5E8EC] pb-2">
          {[
            { id: "work", label: "Làm việc & Sáng tạo" },
            { id: "entertainment", label: "Giải trí đa phương tiện" },
            { id: "health", label: "Vận động & Sức khỏe" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEcosystemTab(tab.id)}
              className={`text-[12px] pb-1 transition cursor-pointer whitespace-nowrap ${
                selectedEcosystemTab === tab.id
                  ? "text-[#0275A9] font-semibold border-b-2 border-[#0275A9]"
                  : "text-[#707783] font-normal hover:text-[#141923]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ecosystem Product Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredEcosystem.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isWishlisted={wishlist.includes(item.id)}
              onAddToCart={() => onAddToCart(item)}
              onToggleWishlist={() => onToggleWishlist(item.id, item.name)}
              onQuickView={() => onQuickView(item)}
              onSelect={() => onNavigate(`#/product/${item.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 7. WORKSPACE BANNER */}
      <section className="w-full py-10 px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-stretch overflow-hidden">
        <img
          src="src/assets/img/banner-workspace.png"
          alt="Góc làm việc tối giản"
          className="w-full lg:w-[756px] h-[340px] lg:h-[388px] rounded-t-[16px] lg:rounded-tr-none lg:rounded-l-[16px] object-cover"
        />
        <div className="flex-1 min-h-[340px] lg:h-[388px] p-8 lg:p-10 bg-[#F1F3F5] rounded-b-[16px] lg:rounded-bl-none lg:rounded-r-[16px] flex flex-col justify-center items-start gap-[22px]">
          <div className="text-[#0275A9] text-[11px] font-semibold uppercase tracking-wider">GÓC LÀM VIỆC TỐI GIẢN</div>
          <h3 className="text-[#141923] text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight lg:leading-[41.4px]">
            Ít bừa bộn hơn.<br />Nhiều cảm hứng hơn.
          </h3>
          <p className="text-[#707783] text-[14px] font-normal leading-[22.4px]">
            Thiết lập không gian tập trung với màn hình chuẩn màu, bàn phím cơ không dây và giá đỡ công thái học.
          </p>
          <button
            onClick={() => onNavigate("#/category/laptops")}
            className="px-[22px] py-[14px] bg-[#0275A9] hover:bg-[#02628e] text-white text-[14px] font-semibold rounded-full flex items-center gap-4 transition shadow-sm cursor-pointer"
          >
            <span>Khám phá bộ sưu tập</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 8. ARTICLES */}
      <section className="w-full pb-8 px-4 sm:px-8 lg:px-16 flex flex-col gap-6">
        <div className="w-full flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[#0275A9] text-[11px] font-semibold uppercase tracking-wider">BÀI VIẾT NỔI BẬT</div>
            <h2 className="text-[#141923] text-[20px] font-semibold tracking-tight">Chuyện công nghệ, dễ hiểu.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onShowToast(`Đang mở bài viết: "${art.title}"`, "info")}
              className="bg-white rounded-xl border border-[#E5E8EC] overflow-hidden flex flex-col hover:shadow-md transition duration-200 cursor-pointer group"
            >
              <div className="h-48 overflow-hidden bg-[#F5F6F8]">
                <img src={art.img} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className="text-[10px] text-[#0275A9] font-semibold uppercase tracking-wider">{art.category}</span>
                <h3 className="text-sm font-bold text-[#141923] group-hover:text-[#0275A9] transition line-clamp-2">{art.title}</h3>
                <p className="text-xs text-[#707783] line-clamp-2">{art.excerpt}</p>
                <div className="mt-auto pt-2 text-[11px] text-[#707783] flex justify-between">
                  <span>{art.author}</span>
                  <span>{art.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-8 bg-[#F5F6F8] rounded-2xl">
        <h2 className="text-[#141923] text-xl font-bold mb-6 text-center">Câu hỏi thường gặp</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {displayFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[#E5E8EC] rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-full p-4 text-left font-semibold text-xs sm:text-sm flex justify-between items-center hover:bg-[#F8FAFC]"
              >
                <span>{faq.q}</span>
                <span className="text-[#0275A9] font-bold text-lg">{faqOpen[idx] ? "−" : "+"}</span>
              </button>
              {faqOpen[idx] && (
                <div className="p-4 pt-0 text-xs text-[#707783] leading-relaxed border-t border-[#F5F6F8]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// SUB-PAGE: PRODUCT DETAIL PAGE (PDP)
// =========================================================================

export default HomePage;
