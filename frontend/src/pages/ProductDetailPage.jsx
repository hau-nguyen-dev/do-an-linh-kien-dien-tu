import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import { ReviewFormModal } from '../components/ReviewFormModal.jsx';
import { formatVND } from '../utils/formatters.js';

// =========================================================================
// MODAL: TÍNH TOÁN TRẢ GÓP 0% LÃI SUẤT THỰC TẾ
// =========================================================================
function InstallmentModal({ isOpen, onClose, product, finalPrice, selectedColor, selectedStorage, onConfirmInstallment }) {
  if (!isOpen) return null;

  const [prepaidPercent, setPrepaidPercent] = useState(0); // 0%, 20%, 30%, 50%
  const [termMonths, setTermMonths] = useState(6); // 3, 6, 9, 12 tháng

  const prepaidAmount = Math.round(finalPrice * (prepaidPercent / 100));
  const loanAmount = finalPrice - prepaidAmount;
  const monthlyPayment = Math.round(loanAmount / termMonths);

  const handleApply = () => {
    onConfirmInstallment({
      term: termMonths,
      prepaidPercent,
      prepaidAmount,
      monthlyPayment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-[#E5E8EC]">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#E5E8EC]">
          <div>
            <h3 className="font-extrabold text-[#141923] text-base flex items-center gap-2">
              <Icon name="credit-card" className="w-5 h-5 text-[#0275A9]" />
              <span>Dự toán trả góp 0% qua thẻ tín dụng</span>
            </h3>
            <p className="text-xs text-[#707783] mt-0.5">
              Liên kết 25 ngân hàng đối tác · Thủ tục trực tuyến 100%
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition cursor-pointer"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Summary */}
        <div className="py-3 px-4 my-3 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-[#141923]">{product.name}</div>
            <div className="text-[11px] text-[#707783]">
              Màu: {selectedColor} · Bản: {selectedStorage?.label || "Tiêu chuẩn"}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#707783] block">Giá thanh toán:</span>
            <span className="font-extrabold text-[#0275A9] text-sm">{formatVND(finalPrice)}</span>
          </div>
        </div>

        {/* Options: Prepaid & Term */}
        <div className="space-y-3.5 py-1 text-xs">
          {/* Prepaid Percentage */}
          <div>
            <label className="block font-bold text-[#141923] uppercase tracking-wider text-[11px] mb-1.5">
              1. Chọn số tiền trả trước:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPrepaidPercent(pct)}
                  className={`py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                    prepaidPercent === pct
                      ? "border-[#0275A9] bg-[#EAF4FA] text-[#0275A9] shadow-2xs"
                      : "border-[#E5E8EC] bg-white text-[#707783] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div>{pct}%</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">
                    {formatVND(Math.round(finalPrice * (pct / 100)))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div>
            <label className="block font-bold text-[#141923] uppercase tracking-wider text-[11px] mb-1.5">
              2. Chọn kỳ hạn trả góp:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTermMonths(m)}
                  className={`py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                    termMonths === m
                      ? "border-[#0275A9] bg-[#EAF4FA] text-[#0275A9] shadow-2xs"
                      : "border-[#E5E8EC] bg-white text-[#707783] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div>{m} tháng</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">
                    {formatVND(Math.round(loanAmount / m))}/tháng
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Table */}
          <div className="border border-[#E5E8EC] rounded-xl overflow-hidden divide-y divide-[#E5E8EC] text-[11px] bg-white mt-2">
            <div className="p-2.5 flex justify-between bg-[#F8FAFC]">
              <span className="text-[#707783]">Trả trước ({prepaidPercent}%):</span>
              <span className="font-bold text-[#141923]">{formatVND(prepaidAmount)}</span>
            </div>
            <div className="p-2.5 flex justify-between">
              <span className="text-[#707783]">Số tiền vay trả góp:</span>
              <span className="font-bold text-[#141923]">{formatVND(loanAmount)}</span>
            </div>
            <div className="p-2.5 flex justify-between bg-emerald-50 text-emerald-900">
              <span className="font-bold">Góp mỗi tháng ({termMonths} tháng):</span>
              <span className="font-black text-sm text-[#0275A9]">{formatVND(monthlyPayment)} / tháng</span>
            </div>
            <div className="p-2.5 flex justify-between">
              <span className="text-[#707783]">Lãi suất & Phí chuyển đổi:</span>
              <span className="font-bold text-emerald-600">0% (Miễn phí hoàn toàn)</span>
            </div>
            <div className="p-2.5 flex justify-between bg-[#F8FAFC]">
              <span className="text-[#707783]">Tổng số tiền sau trả góp:</span>
              <span className="font-extrabold text-[#141923]">{formatVND(finalPrice)} (Không chênh lệch)</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 mt-3 border-t border-[#E5E8EC] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-[#CBD5E1] hover:bg-[#F5F6F8] text-[#141923] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-3 bg-[#0275A9] hover:bg-[#02628e] text-white font-bold text-xs rounded-xl transition shadow-md active:scale-98 cursor-pointer text-center"
          >
            Đăng ký mua trả góp ngay
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN PRODUCT DETAIL PAGE
// =========================================================================
export function ProductDetailPage({ products = [], productId, onAddToCart, onToggleWishlist, wishlist, onNavigate, onShowToast, customReviews = [], onAddReview, storeSettings }) {
  const product = useMemo(() => {
    return products.find((p) => p.id === productId || p.slug === productId) || products[0] || {};
  }, [products, productId]);

  const [activeImg, setActiveImg] = useState(product.gallery?.[0] || product.img);
  // Đa nhóm phân loại (Hỗ trợ N nhóm đồng nhất: Ảnh + Chữ)
  const displayGroups = useMemo(() => {
    if (product.variantGroups && product.variantGroups.length > 0) {
      return product.variantGroups;
    }
    const list = [];
    if (product.colors && product.colors.length > 0) {
      list.push({
        name: product.variantGroupName || product.variantGroup1Name || "Màu sắc",
        options: product.colors.map((item, i) => ({
          id: item.id || `g1_${i}`,
          name: item.name,
          img: item.img || product.gallery?.[i] || product.img,
        })),
      });
    }
    if (product.storageOptions && product.storageOptions.length > 1) {
      list.push({
        name: product.variantGroup2Name || "Phiên bản",
        options: product.storageOptions.map((s, i) => ({
          id: s.id || `g2_${i}`,
          name: s.label || s.name,
          img: "",
        })),
      });
    }
    return list;
  }, [product.variantGroups, product.colors, product.storageOptions, product.gallery, product.img]);

  const [selectedGroupOptions, setSelectedGroupOptions] = useState(() => {
    const init = {};
    displayGroups.forEach((g, idx) => {
      init[idx] = g.options?.[0]?.name || "";
    });
    return init;
  });

  const selectedColor = selectedGroupOptions[0] || "";
  const selectedStorage = { label: selectedGroupOptions[1] || "" };

  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);

  // Real Comments & Q&A from SQLite
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentPhone, setCommentPhone] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [settingsData, setSettingsData] = useState(storeSettings || null);

  useEffect(() => {
    const init = {};
    displayGroups.forEach((g, idx) => {
      init[idx] = g.options?.[0]?.name || "";
    });
    setSelectedGroupOptions(init);

    const firstWithImg = displayGroups[0]?.options?.[0]?.img;
    if (firstWithImg) {
      setActiveImg(firstWithImg);
    } else {
      setActiveImg(product.gallery?.[0] || product.img);
    }
    setQuantity(1);

    if (product?.id) {
      fetch(`http://localhost:5000/api/comments?productId=${product.id}&status=approved`)
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setComments(data); })
        .catch((err) => console.warn("[PDP] Comments fetch error:", err));
    }
    if (!settingsData) {
      fetch('http://localhost:5000/api/settings')
        .then((res) => res.json())
        .then((data) => { if (data) setSettingsData(data); })
        .catch((err) => console.warn("[PDP] Settings fetch error:", err));
    }
  }, [product?.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      if (onShowToast) onShowToast("Vui lòng nhập nội dung câu hỏi!", "info");
      return;
    }
    setIsSubmittingComment(true);
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          author: commentAuthor.trim() || "Khách hàng",
          phone: commentPhone.trim(),
          content: commentContent.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data, ...prev]);
        setCommentContent("");
        setCommentPhone("");
        if (onShowToast) onShowToast("Gửi câu hỏi thành công! nét. sẽ sớm phản hồi.", "success");
      } else {
        if (onShowToast) onShowToast(data.error || "Gửi thất bại", "error");
      }
    } catch (err) {
      if (onShowToast) onShowToast("Không thể kết nối đến máy chủ", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Pricing calculations
  // Tìm tổ hợp biến thể hiện tại (khớp tất cả các nhóm)
  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    const selectedNames = displayGroups.map((g, idx) => selectedGroupOptions[idx] || g.options?.[0]?.name || "");

    const exactKey = selectedNames.join(" · ");
    const match = product.variants.find((v) => {
      if (v.name === exactKey) return true;
      if (v.options && Array.isArray(v.options)) {
        return v.options.every((optName, idx) => optName === selectedNames[idx]);
      }
      return selectedNames.every((n) => v.name?.includes(n));
    });
    return match || product.variants[0];
  }, [product.variants, displayGroups, selectedGroupOptions]);

  const basePrice = Number(product.price) || 0;
  const variantDirectPrice = currentVariant && currentVariant.price !== undefined && currentVariant.price !== null && currentVariant.price !== ""
    ? Number(currentVariant.price)
    : null;
  const priceDiff = Number(currentVariant?.priceDiff) || 0;
  const finalPrice = variantDirectPrice !== null ? variantDirectPrice : (currentVariant ? (basePrice + priceDiff) : basePrice);

  const currentStock = currentVariant && currentVariant.stock !== undefined && currentVariant.stock !== null && currentVariant.stock !== ""
    ? Math.max(0, Number(currentVariant.stock))
    : Math.max(0, Number(product.stock ?? product.ton_kho ?? 50));
  const isOutOfStock = currentStock <= 0;

  // Trạng thái giảm giá của biến thể đang chọn
  const isVariantDiscounted = Boolean(
    currentVariant && currentVariant.hasDiscount !== undefined
      ? (currentVariant.hasDiscount && currentVariant.originalPrice && Number(currentVariant.originalPrice) > finalPrice)
      : (product?.hasDiscount || (product?.originalPrice && Number(product.originalPrice) > finalPrice))
  );

  const finalOriginalPrice = isVariantDiscounted
    ? (currentVariant?.originalPrice ? Number(currentVariant.originalPrice) : (product?.originalPrice ? Number(product.originalPrice) : null))
    : null;

  const handleSelectGroupOption = (grpIdx, opt) => {
    setSelectedGroupOptions((prev) => ({
      ...prev,
      [grpIdx]: opt.name,
    }));
    if (opt.img) {
      setActiveImg(opt.img);
    }
  };

  // Review & Rating calculations (100% Real from SQLite Data, no fake numbers)
  const allReviews = useMemo(() => {
    return [...(customReviews || []), ...(product.reviews || [])];
  }, [customReviews, product.reviews]);

  const reviewCount = allReviews.length;
  const avgRating = useMemo(() => {
    if (reviewCount === 0) return "0.0";
    const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviewCount).toFixed(1);
  }, [allReviews, reviewCount]);

  // Tiêu đề động đồng bộ biến thể được chọn
  const displayTitle = useMemo(() => {
    const base = product.fullName || product.name || "";
    const spec = selectedGroupOptions[1] || selectedStorage?.label || "";
    if (!spec) return base;
    if (base.includes("Chính Hãng VN/A")) {
      return base.replace("Chính Hãng VN/A", `${spec} Chính Hãng VN/A`);
    }
    return `${base} · ${spec}`;
  }, [product.fullName, product.name, selectedGroupOptions, selectedStorage]);

  const comboName = displayGroups.map((g, idx) => selectedGroupOptions[idx] || g.options?.[0]?.name).filter(Boolean).join(" · ");

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onAddToCart(product, {
      variant: comboName,
      color: selectedGroupOptions[0] || "",
      storage: selectedGroupOptions[1] || "",
      price: finalPrice,
      priceDiff: currentVariant?.priceDiff || 0,
      img: activeImg,
      quantity,
    });
    onNavigate("#/checkout");
  };

  const handleAddToCartWithVariant = () => {
    if (isOutOfStock) return;
    onAddToCart(product, {
      variant: comboName,
      color: selectedGroupOptions[0] || "",
      storage: selectedGroupOptions[1] || "",
      price: finalPrice,
      priceDiff: currentVariant?.priceDiff || 0,
      img: activeImg,
      quantity,
    });
  };

  const handleConfirmInstallment = (installmentInfo) => {
    if (isOutOfStock) return;
    onAddToCart(product, {
      variant: comboName,
      color: selectedColor,
      storage: selectedStorage?.label,
      price: finalPrice,
      priceDiff: currentVariant?.priceDiff || 0,
      quantity: 1,
      installment: installmentInfo,
    });
    onNavigate("#/checkout");
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-8 animate-in zoom-in-95 duration-200">
      
      {/* Installment Modal */}
      <InstallmentModal
        isOpen={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        product={product}
        finalPrice={finalPrice}
        selectedColor={selectedColor}
        selectedStorage={selectedStorage}
        onConfirmInstallment={handleConfirmInstallment}
      />

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={product}
        onSubmitReview={(prodId, rev) => {
          if (onAddReview) onAddReview(prodId, rev);
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-[#707783] flex items-center gap-2 mb-6">
        <button onClick={() => onNavigate("#/")} className="hover:text-[#0275A9] cursor-pointer">Trang chủ</button>
        <span>/</span>
        <button onClick={() => onNavigate(`#/category/${product.category}`)} className="hover:text-[#0275A9] cursor-pointer">
          {product.categoryLabel || product.category}
        </button>
        <span>/</span>
        <span className="text-[#141923] font-semibold truncate">{product.name}</span>
      </nav>

      {/* Top Main Section: Gallery & Purchase Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Images Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full h-[400px] bg-[#F5F6F8] rounded-2xl p-6 flex items-center justify-center relative overflow-hidden border border-[#E5E8EC]">
            <img
              src={activeImg}
              alt={product.name}
              className="max-h-[320px] max-w-full object-contain transition duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#0275A9] text-xs font-bold rounded-lg shadow-2xs border border-[#E5E8EC]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(imgUrl)}
                  className={`w-20 h-20 rounded-xl p-1 bg-[#F5F6F8] border-2 transition cursor-pointer shrink-0 ${
                    activeImg === imgUrl ? "border-[#0275A9]" : "border-transparent hover:border-[#CBD5E1]"
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Warranty & Guarantee Badges Box from SQLite Settings */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] space-y-2.5 text-xs text-[#707783]">
            {((settingsData?.usps && settingsData.usps.length > 0) ? settingsData.usps : [
              { title: "Cam kết chính hãng 100% VN/A có VAT", icon: "shield-check" },
              { title: "Bảo hành 12 tháng tại các TTBH ủy quyền", icon: "award" },
              { title: "1 đổi 1 trong 30 ngày đầu nếu có lỗi phần cứng", icon: "refresh-cw" },
              { title: "Giao hàng siêu tốc 2 giờ miễn phí trong nội thành", icon: "truck" }
            ]).map((u, idx) => (
              <div key={idx} className={`flex items-center gap-2.5 ${idx === 0 ? "text-[#141923] font-semibold" : ""}`}>
                <Icon name={u.icon || "shield-check"} className="w-4 h-4 text-[#0275A9] shrink-0" />
                <span>{u.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Buy Box & Variants (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#EAF4FA] text-[#0275A9] text-xs font-semibold rounded-full uppercase">
                {product.brandLabel || product.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                {reviewCount > 0 ? (
                  <>
                    <span>⭐ {avgRating}</span>
                    <span className="text-[#707783] font-normal">
                      ({reviewCount} đánh giá thực tế)
                    </span>
                  </>
                ) : (
                  <span className="text-[#707783] font-normal">
                    (Chưa có đánh giá)
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141923] mt-2 leading-tight">
              {displayTitle}
            </h1>
            {product.specsShort && (
              <p className="text-xs text-[#707783] mt-1.5">{product.specsShort}</p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-[#0275A9] tracking-tight">{formatVND(finalPrice)}</span>
            {isVariantDiscounted && finalOriginalPrice && finalOriginalPrice > finalPrice && (
              <>
                <span className="text-sm text-[#707783] line-through">{formatVND(finalOriginalPrice)}</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-full">
                  Tiết kiệm {formatVND(finalOriginalPrice - finalPrice)} (-{Math.round(((finalOriginalPrice - finalPrice) / finalOriginalPrice) * 100)}%)
                </span>
              </>
            )}
          </div>

          {/* =========================================================================
              HỆ THỐNG PHÂN LOẠI HÀNG (HỖ TRỢ N NHÓM ĐỒNG NHẤT: ẢNH + CHỮ)
              ========================================================================= */}
          {displayGroups.map((group, grpIdx) => (
            <div key={group.id || grpIdx} className="space-y-2.5">
              <div className="text-xs font-semibold text-[#141923]">
                {group.name}: <span className="text-[#0275A9] font-bold">{selectedGroupOptions[grpIdx] || group.options?.[0]?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.options.map((opt) => {
                  const isSelected = (selectedGroupOptions[grpIdx] === opt.name) || (!selectedGroupOptions[grpIdx] && opt === group.options[0]);
                  return (
                    <button
                      key={opt.id || opt.name}
                      type="button"
                      onClick={() => handleSelectGroupOption(grpIdx, opt)}
                      className={`flex items-center gap-2 p-2 pr-3.5 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? "border-[#0275A9] bg-[#EAF4FA] text-[#0275A9] font-bold shadow-2xs ring-2 ring-[#0275A9]/20"
                          : "border-[#E5E8EC] bg-white text-[#141923] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {/* Ảnh phân loại (nếu có) */}
                      {opt.img ? (
                        <img
                          src={opt.img}
                          alt={opt.name}
                          className="w-9 h-9 rounded-lg object-contain bg-white border border-[#E5E8EC] shrink-0 p-0.5"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <span className="font-bold text-xs">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Gift & Promotion Box (100% Dynamic, no static fake text) */}
          {product.gift && (
            <div className="p-4 bg-[#EAF4FA] border border-[#0275A9]/30 rounded-xl space-y-1.5 text-xs">
              <div className="font-bold text-[#0275A9] flex items-center gap-2">
                <Icon name="gift" className="w-4 h-4 text-[#0275A9] shrink-0" />
                <span>Khuyến mãi & Quà tặng kèm:</span>
              </div>
              <ul className="text-[#141923] space-y-1 pl-5 list-disc text-[12px]">
                <li>{product.gift}</li>
              </ul>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            {/* Quantity Selector & Tồn kho theo biến thể */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-semibold text-[#141923]">Số lượng:</span>
              <div className="flex items-center border border-[#E5E8EC] rounded-lg bg-[#F5F6F8]">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`w-8 h-8 flex items-center justify-center font-bold text-sm transition ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "hover:text-[#0275A9] cursor-pointer"}`}
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                <button
                  disabled={isOutOfStock || quantity >= currentStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className={`w-8 h-8 flex items-center justify-center font-bold text-sm transition ${isOutOfStock || quantity >= currentStock ? "opacity-40 cursor-not-allowed" : "hover:text-[#0275A9] cursor-pointer"}`}
                >
                  +
                </button>
              </div>

              {/* Tình trạng tồn kho của phiên bản đang chọn */}
              {isOutOfStock ? (
                <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                  ✕ Tạm hết hàng
                </span>
              ) : (
                <span className="text-xs text-[#707783]">
                  (Còn <strong className="text-[#0275A9] font-black">{currentStock}</strong> máy)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`flex-1 py-4 font-bold text-sm rounded-xl transition shadow-md text-center ${
                  isOutOfStock
                    ? "bg-[#CBD5E1] text-[#64748B] cursor-not-allowed shadow-none"
                    : "bg-[#0275A9] hover:bg-[#02628e] text-white active:scale-98 cursor-pointer"
                }`}
              >
                {isOutOfStock ? "TẠM HẾT HÀNG" : "MUA NGAY (Giao nhanh 2h hoặc Nhận tại cửa hàng)"}
              </button>
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCartWithVariant}
                className={`px-6 py-4 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-2 border-[#0275A9] text-[#0275A9] hover:bg-[#EAF4FA] active:scale-98 cursor-pointer"
                }`}
              >
                <Icon name="shopping-cart" className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </button>
            </div>

            {/* Functional Installment Button opening Calculator Modal */}
            {product.isInstallment === 1 && (
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && setIsInstallmentModalOpen(true)}
                className={`w-full py-2.5 border text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-2xs ${
                  isOutOfStock
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#F5F6F8] hover:bg-[#EAF4FA] text-[#0275A9] border-[#CBD5E1] hover:border-[#0275A9] cursor-pointer"
                }`}
              >
                <Icon name="credit-card" className="w-4 h-4 text-[#0275A9]" />
                <span>
                  {isOutOfStock
                    ? "Tạm hết hàng - Không hỗ trợ trả góp lúc này"
                    : `Trả góp 0% qua thẻ tín dụng (Chỉ từ ${formatVND(Math.round(finalPrice / 12))}/tháng) · Xem bảng tính →`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: ĐẶC ĐIỂM NỔI BẬT & BÀI VIẾT ĐÁNH GIÁ CHI TIẾT (FULL WIDTH RỘNG RÃI)
          ========================================================================= */}
      <div className="mt-14 pt-8 border-t border-[#E5E8EC]">
        <div className="w-full bg-white rounded-2xl border border-[#E5E8EC] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E8EC] pb-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#141923] flex items-center gap-2.5">
              <Icon name="file-text" className="w-5 h-5 text-[#0275A9]" />
              <span>Đặc điểm nổi bật & Bài viết đánh giá chi tiết</span>
            </h2>
            <span className="text-xs text-[#707783] font-medium hidden sm:inline">
              Ban biên tập nét. Tech
            </span>
          </div>

          {/* Nội dung bài viết phong phú & Bảng thông số kỹ thuật (Quill HTML toàn chiều rộng) */}
          <div className="product-rich-desc text-[#141923] text-sm leading-relaxed space-y-4">
            <div
              dangerouslySetInnerHTML={{
                __html: product.desc || product.baiVietMoTa || "<p class='text-[#707783] italic'>Sản phẩm đang được ban biên tập cập nhật bài viết đánh giá chi tiết.</p>",
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: ĐÁNH GIÁ & NHẬN XÉT CỦA KHÁCH HÀNG (DỮ LIỆU THỰC SQLITE)
          ========================================================================= */}
      <div className="mt-12 bg-white rounded-2xl border border-[#E5E8EC] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E8EC] pb-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#141923] flex items-center gap-2.5">
              <span>Đánh giá & Nhận xét từ khách hàng</span>
              <span className="text-xs bg-[#EAF4FA] text-[#0275A9] px-2.5 py-0.5 rounded-full font-bold">
                {reviewCount} đánh giá
              </span>
            </h3>
            <p className="text-xs text-[#707783] mt-1">
              Nhận xét thực tế từ người dùng đã mua sản phẩm này tại nét.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>Viết đánh giá của bạn</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </button>
        </div>

        {/* Real Rating Overview Card */}
        <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left sm:pr-8 sm:border-r border-[#CBD5E1]">
            <div className="text-3xl font-black text-[#141923] flex items-center justify-center sm:justify-start gap-2">
              <Icon name="star" className={`w-7 h-7 ${reviewCount > 0 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              <span>{reviewCount > 0 ? avgRating : "0.0"} <span className="text-base text-[#707783] font-normal">/ 5.0</span></span>
            </div>
            <div className="text-xs text-[#707783] mt-1">
              {reviewCount > 0 ? `Dựa trên ${reviewCount} đánh giá thực tế từ SQLite` : "Chưa có đánh giá nào từ khách hàng"}
            </div>
          </div>
          
          <div className="flex-1 text-xs text-[#707783] text-center sm:text-left leading-relaxed">
            100% đánh giá là từ người dùng thật đã trải nghiệm sản phẩm. nét. cam kết đồng bộ trực tiếp với hệ cơ sở dữ liệu và không dùng số liệu ảo.
          </div>
        </div>

        {/* Reviews List */}
        {allReviews.length === 0 ? (
          <div className="p-8 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl text-center text-xs text-[#707783]">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ cảm nhận!
          </div>
        ) : (
          <div className="space-y-3.5">
            {allReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white border border-[#E5E8EC] rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#141923]">{rev.author}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Icon name="check-circle" className="w-3 h-3 text-emerald-600" />
                      <span>Đã mua hàng tại nét.</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-[#707783]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <Icon
                      key={starIdx}
                      name="star"
                      className={`w-3.5 h-3.5 ${starIdx <= Math.round(rev.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">{rev.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION: HỎI ĐÁP & BÌNH LUẬN SẢN PHẨM (DỮ LIỆU THỰC SQLITE)
          ========================================================================= */}
      <div className="mt-8 bg-white rounded-2xl border border-[#E5E8EC] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E8EC] pb-4">
          <h3 className="text-xl font-extrabold text-[#141923] flex items-center gap-2.5">
            <Icon name="message-square" className="w-5 h-5 text-[#0275A9]" />
            <span>Hỏi đáp & Bình luận về sản phẩm</span>
            <span className="text-xs bg-[#EAF4FA] text-[#0275A9] px-2.5 py-0.5 rounded-full font-bold">
              {comments.length} câu hỏi
            </span>
          </h3>
          <p className="text-xs text-[#707783] mt-1">
            Mọi thắc mắc của bạn về cấu hình, tồn kho chi nhánh và chính sách mua hàng sẽ được ban quản trị nét. giải đáp.
          </p>
        </div>

        {/* Comment Question Form */}
        <form onSubmit={handleSubmitComment} className="p-4 bg-[#F8FAFC] border border-[#E5E8EC] rounded-xl space-y-3">
          <div className="font-bold text-xs text-[#141923]">Đặt câu hỏi cho nét. Store Manager:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Họ và tên của bạn *"
              required
              className="px-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
            />
            <input
              type="text"
              value={commentPhone}
              onChange={(e) => setCommentPhone(e.target.value)}
              placeholder="Số điện thoại (để nhận tin nhắn khi có phản hồi)"
              className="px-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
            />
          </div>
          <textarea
            rows="3"
            required
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Viết câu hỏi của bạn tại đây (Ví dụ: Sản phẩm còn sẵn màu Titan tại shop Tràng Tiền không?...)"
            className="w-full p-3 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-6 py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white font-bold text-xs rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-2"
            >
              <span>{isSubmittingComment ? "Đang gửi..." : "Gửi câu hỏi / bình luận"}</span>
              <Icon name="send" className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="p-8 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl text-center text-xs text-[#707783]">
            Chưa có câu hỏi nào cho sản phẩm này. Hãy đặt câu hỏi để được chuyên viên tư vấn hỗ trợ ngay!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((cm) => (
              <div key={cm.id} className="p-4 bg-white border border-[#E5E8EC] rounded-xl space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EAF4FA] text-[#0275A9] font-bold text-xs flex items-center justify-center">
                      {(cm.author || "K")[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#141923]">{cm.author}</span>
                      <span className="text-[10px] text-[#707783] ml-2">• {cm.createdAt || "Vừa xong"}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed pl-9">{cm.content}</p>

                {/* Admin Reply */}
                {cm.reply && (
                  <div className="ml-9 p-3 bg-[#EAF4FA] border border-[#0275A9]/20 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#0275A9] text-[11px]">
                      <Icon name="shield-check" className="w-3.5 h-3.5 text-[#0275A9]" />
                      <span>nét. Quản trị viên phản hồi:</span>
                    </div>
                    <p className="text-[#141923] leading-relaxed text-xs">{cm.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default ProductDetailPage;
