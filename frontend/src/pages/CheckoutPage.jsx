import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon.jsx';
import { formatVND, generateOrderId } from '../utils/formatters.js';
import { generateVietQRUrl } from '../utils/vietqr.js';
import { applyCoupon } from '../utils/coupon.js';
import { voucherService } from '../services/voucherService.js';

export function CheckoutPage({ cart, cartSubtotal, onClearCart, onNavigate, currentUser, onAddOrder, onShowToast, selectedVoucherCode, onOpenVoucherModal }) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    city: "Hà Nội",
    district: "Quận Cầu Giấy",
    address: "",
    note: "",
    shippingMethod: "standard",
    paymentMethod: "vietqr",
  });

  const [errors, setErrors] = useState({});
  const [couponInput, setCouponInput] = useState(selectedVoucherCode || "");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vouchersCount, setVouchersCount] = useState(0);

  useEffect(() => {
    voucherService.getVouchers()
      .then((data) => {
        if (Array.isArray(data)) setVouchersCount(data.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedVoucherCode) {
      setCouponInput(selectedVoucherCode);
      const res = applyCoupon(selectedVoucherCode, cartSubtotal, formData.shippingMethod === "instant" ? 30000 : 0);
      if (res.valid) {
        setAppliedVoucher(res.voucher);
        setDiscountAmount(res.discountAmount);
        onShowToast(res.message);
      }
    }
  }, [selectedVoucherCode, cartSubtotal]);

  const validateField = (name, value) => {
    let err = "";
    if (name === "fullName") {
      if (!value.trim()) err = "Vui lòng nhập họ và tên";
      else if (value.trim().split(" ").length < 2) err = "Vui lòng nhập cả họ và tên đầy đủ";
    }
    if (name === "phone") {
      const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
      if (!value.trim()) err = "Vui lòng nhập số điện thoại nhận hàng";
      else if (!phoneRegex.test(value.trim())) err = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)";
    }
    if (name === "email" && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) err = "Định dạng email không hợp lệ";
    }
    if (name === "address") {
      if (!value.trim()) err = "Vui lòng nhập số nhà, tên đường chi tiết";
      else if (value.trim().length < 5) err = "Địa chỉ nhận hàng quá ngắn";
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const shippingFee = formData.shippingMethod === "instant" ? 30000 : 0;
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      onShowToast("Vui lòng nhập mã giảm giá", "info");
      return;
    }
    try {
      const res = await voucherService.applyVoucher(couponInput.trim(), cartSubtotal);
      if (res && res.valid) {
        setAppliedVoucher(res.voucher || { code: res.code, desc: res.message });
        setDiscountAmount(res.discount || res.discountAmount || 0);
        onShowToast(res.message, "success");
        return;
      }
    } catch (err) {
      console.warn("[Checkout] Gọi API voucher thất bại, kiểm tra cục bộ:", err);
    }
    // Fallback local
    const fallbackRes = applyCoupon(couponInput, cartSubtotal, shippingFee);
    if (fallbackRes.valid) {
      setAppliedVoucher(fallbackRes.voucher);
      setDiscountAmount(fallbackRes.discountAmount);
      onShowToast(fallbackRes.message, "success");
    } else {
      onShowToast(fallbackRes.message, "info");
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const e1 = validateField("fullName", formData.fullName);
    const e2 = validateField("phone", formData.phone);
    const e3 = validateField("email", formData.email);
    const e4 = validateField("address", formData.address);

    if (e1 || e2 || e3 || e4) {
      onShowToast("Vui lòng kiểm tra và sửa các thông tin chưa đúng!", "info");
      return;
    }

    if (cart.length === 0) {
      onShowToast("Giỏ hàng đang trống!", "info");
      return;
    }

    const orderId = generateOrderId();
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString("vi-VN"),
      time: new Date().toLocaleTimeString("vi-VN"),
      customer: { ...formData },
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount,
      total: finalTotal,
      paymentMethod: formData.paymentMethod,
      status: "Chờ xác nhận",
    };

    onAddOrder(newOrder);
    onClearCart();
    onNavigate(`#/order-success/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Icon name="shopping-bag" className="w-8 h-8" strokeWidth={1.75} />
        </div>
        <h2 className="text-xl font-bold text-[#141923] mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-[#707783] mb-6">
          Vui lòng chọn sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <button
          onClick={() => onNavigate("#/category/all")}
          className="px-6 py-2.5 bg-[#0275A9] text-white text-xs font-semibold rounded-full hover:bg-[#02628e] transition"
        >
          Khám phá sản phẩm nét.
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2 text-xs text-[#707783] mb-6">
        <button onClick={() => onNavigate("#/")} className="hover:text-[#0275A9]">Trang chủ</button>
        <span>/</span>
        <span className="text-[#141923] font-semibold">Thanh toán đơn hàng</span>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Info */}
          <div className="p-6 bg-white border border-[#E5E8EC] rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#141923] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0275A9] text-white text-xs flex items-center justify-center font-bold">1</span>
              Thông tin người nhận hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[#707783] mb-1 font-medium">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
                />
              </div>
              <div>
                <label className="block text-[#707783] mb-1 font-medium">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[#707783] mb-1 font-medium">Email nhận hóa đơn điện tử VAT</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[#707783] mb-1 font-medium">Tỉnh / Thành phố *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>
              <div>
                <label className="block text-[#707783] mb-1 font-medium">Quận / Huyện *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Quận / Huyện"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[#707783] mb-1 font-medium">Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Số 123 đường Cầu Giấy, P. Dịch Vọng..."
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
              />
            </div>

            <div className="text-xs">
              <label className="block text-[#707783] mb-1 font-medium">Ghi chú giao hàng</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Ví dụ: Giao trong giờ hành chính, gọi trước khi đến..."
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg outline-none focus:border-[#0275A9] text-[#141923]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 bg-white border border-[#E5E8EC] rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#141923] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0275A9] text-white text-xs flex items-center justify-center font-bold">2</span>
              Phương thức thanh toán
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* VietQR Option */}
              <label
                className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition ${
                  formData.paymentMethod === "vietqr"
                    ? "border-[#0275A9] bg-[#EAF4FA]"
                    : "border-[#E5E8EC] hover:border-[#CBD5E1]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "vietqr"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "vietqr" })}
                  className="mt-0.5 text-[#0275A9]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#141923] flex items-center gap-2">
                    <span>Chuyển khoản ngân hàng qua VietQR</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-[#707783] text-[11px] mt-0.5">
                    Quét mã QR qua ứng dụng ngân hàng bất kỳ. Tự động điền số tiền & xác nhận tức thì.
                  </p>
                </div>
              </label>

              {/* COD Option */}
              <label
                className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition ${
                  formData.paymentMethod === "cod"
                    ? "border-[#0275A9] bg-[#EAF4FA]"
                    : "border-[#E5E8EC] hover:border-[#CBD5E1]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "cod"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  className="mt-0.5 text-[#0275A9]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#141923]">Thanh toán tiền mặt khi nhận hàng (COD)</div>
                  <p className="text-[#707783] text-[11px] mt-0.5">
                    Nhận hàng, kiểm tra ngoại quan máy và thanh toán trực tiếp cho nhân viên giao hàng.
                  </p>
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition ${
                  formData.paymentMethod === "card"
                    ? "border-[#0275A9] bg-[#EAF4FA]"
                    : "border-[#E5E8EC] hover:border-[#CBD5E1]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "card"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "card" })}
                  className="mt-0.5 text-[#0275A9]"
                />
                <div className="flex-1">
                  <div className="font-bold text-[#141923]">Thẻ ATM nội địa / Visa / Mastercard / JCB</div>
                  <p className="text-[#707783] text-[11px] mt-0.5">
                    Cổng thanh toán mã hóa bảo mật 256-bit chuẩn PCI-DSS.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Voucher (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#141923]">Đơn hàng ({cart.length} sản phẩm)</h3>

            {/* Items Mini List */}
            <div className="divide-y divide-[#E5E8EC] max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center gap-3 text-xs">
                  <img src={item.img} alt="" className="w-12 h-12 object-contain bg-white rounded p-1 border border-[#E5E8EC]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#141923] truncate">{item.name}</div>
                    <div className="text-[11px] text-[#707783]">
                      SL: {item.quantity} · {item.selectedColor}
                    </div>
                  </div>
                  <span className="font-semibold text-[#141923]">{formatVND(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Voucher Box */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#141923]">Mã giảm giá (Voucher)</label>
                <button
                  type="button"
                  onClick={onOpenVoucherModal}
                  className="text-[11px] text-[#0275A9] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="gift" className="w-3.5 h-3.5" />
                  <span>Kho voucher {vouchersCount > 0 ? `(${vouchersCount})` : ""}</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Nhập mã hoặc chọn từ kho"
                  className="flex-1 p-2 bg-white border border-[#E5E8EC] rounded-lg text-xs outline-none focus:border-[#0275A9]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 bg-[#141923] hover:bg-[#0275A9] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
              {appliedVoucher && (
                <div className="text-[11px] text-emerald-600 mt-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <Icon name="check" className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                    <span>Đã áp dụng mã {appliedVoucher.code}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setDiscountAmount(0);
                      onShowToast("Đã hủy áp dụng mã giảm giá", "info");
                    }}
                    className="text-rose-500 hover:underline"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#E5E8EC] space-y-2 text-xs">
              <div className="flex justify-between text-[#707783]">
                <span>Tạm tính tiền hàng:</span>
                <span className="text-[#141923] font-medium">{formatVND(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#707783]">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600 font-medium">
                  {shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E5E8EC] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#141923]">Tổng thanh toán:</span>
                <span className="text-xl font-black text-[#0275A9]">{formatVND(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#0275A9] hover:bg-[#02628e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md active:scale-98 cursor-pointer mt-4"
            >
              Xác nhận đặt hàng ngay
            </button>
            <p className="text-[11px] text-center text-[#707783]">
              Bằng cách đặt hàng, bạn đồng ý với Điều khoản mua sắm của nét.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

// =========================================================================
// SUB-PAGE: ORDER SUCCESS WITH VIETQR
// =========================================================================
export default CheckoutPage;
