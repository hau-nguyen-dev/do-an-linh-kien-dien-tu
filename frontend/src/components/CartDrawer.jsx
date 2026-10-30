import React from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  totalCartCount,
  cartSubtotal,
  updateQuantity,
  removeFromCart,
  clearCart,
  onOpenVoucherModal,
  onCheckout,
  navigate
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5E8EC] flex justify-between items-center bg-[#F5F6F8]">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#141923] text-base">Giỏ hàng của bạn</h3>
            <span className="bg-[#0275A9] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {totalCartCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white rounded-lg text-[#707783] hover:text-[#141923] transition flex items-center justify-center"
            aria-label="Đóng giỏ hàng"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#707783]">
              <div className="w-16 h-16 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center mb-4 shadow-sm">
                <Icon name="shopping-bag" className="w-8 h-8" strokeWidth={1.75} />
              </div>
              <div className="font-semibold text-base text-[#141923] mb-1">Giỏ hàng đang trống</div>
              <p className="text-xs max-w-xs mb-6">
                Hãy lựa chọn những thiết bị công nghệ chính hãng bạn ưng ý nhất để bắt đầu!
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (navigate) navigate("#/category/all");
                }}
                className="px-6 py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-semibold rounded-full transition shadow-sm"
              >
                Khám phá sản phẩm ngay
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-center gap-3.5 pb-4 border-b border-[#E5E8EC] last:border-0"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-lg bg-[#F5F6F8] p-1.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#141923] truncate">{item.name}</h4>
                  <div className="text-[11px] text-[#707783] mt-0.5">
                    {item.selectedColor} · {item.selectedStorage}
                  </div>
                  <div className="text-xs text-[#0275A9] font-bold mt-1">
                    {formatVND(item.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 border border-[#E5E8EC] rounded-lg p-1 bg-[#F5F6F8]">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="w-5 h-5 flex items-center justify-center text-[#707783] hover:text-[#141923] hover:bg-white rounded transition"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="w-5 h-5 flex items-center justify-center text-[#707783] hover:text-[#141923] hover:bg-white rounded transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Xóa khỏi giỏ"
                >
                  <Icon name="trash-2" className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E5E8EC] bg-[#F5F6F8] space-y-3">
            {/* Voucher Selector Button */}
            <button
              type="button"
              onClick={onOpenVoucherModal}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-dashed border-[#0275A9]/40 rounded-xl text-xs font-medium text-[#0275A9] hover:bg-[#EAF4FA] transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="gift" className="w-3.5 h-3.5" />
                <span>Chọn kho ưu đãi (4 mã khả dụng)</span>
              </div>
              <span className="text-[11px] underline">Xem →</span>
            </button>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#707783]">Tạm tính ({totalCartCount} sản phẩm):</span>
              <span className="text-base font-bold text-[#141923]">{formatVND(cartSubtotal)}</span>
            </div>

            <div className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-medium">
              <Icon name="check" className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2.5} />
              <span>Đã đủ điều kiện miễn phí giao hàng hỏa tốc 2h</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-[#0275A9] hover:bg-[#02628e] text-white font-bold text-xs rounded-xl transition shadow-card flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiến hành đặt hàng</span>
              <span>→</span>
            </button>

            <div className="flex justify-between text-[11px] text-[#707783] pt-1">
              <button onClick={clearCart} className="hover:text-rose-500 underline">
                Dọn giỏ hàng
              </button>
              <button onClick={onClose} className="hover:underline">
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
