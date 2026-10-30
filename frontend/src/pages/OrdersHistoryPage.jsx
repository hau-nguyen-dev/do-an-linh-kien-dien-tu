import React, { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function OrdersHistoryPage({ orders, onNavigate, onShowToast }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in zoom-in-95 duration-200 space-y-6">
      <div className="flex items-center gap-2 text-xs text-[#707783]">
        <button onClick={() => onNavigate("#/")} className="hover:text-[#0275A9]">Trang chủ</button>
        <span>/</span>
        <span className="text-[#141923] font-semibold">Lịch sử đơn hàng</span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-[#141923]">Đơn hàng của bạn</h1>
        <p className="text-xs text-[#707783] mt-0.5">Theo dõi tình trạng đơn và lịch sử mua sắm tại nét.</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center text-[#707783] bg-[#F8FAFC] rounded-2xl border border-[#E5E8EC]">
          <div className="w-16 h-16 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Icon name="package" className="w-8 h-8" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-[#141923] mb-1">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs mb-6">Hãy đặt mua các sản phẩm công nghệ bạn yêu thích ngay hôm nay!</p>
          <button
            onClick={() => onNavigate("#/category/all")}
            className="px-6 py-2.5 bg-[#0275A9] text-white text-xs font-semibold rounded-full hover:bg-[#02628e] transition"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.orderId} className="p-5 bg-white border border-[#E5E8EC] rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-[#E5E8EC]">
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#0275A9] text-sm">#{ord.orderId}</span>
                  <span className="text-xs text-[#707783]">Đặt ngày: {ord.date} lúc {ord.time}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  {ord.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {ord.items.map((it) => (
                  <div key={it.cartItemId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.img} alt="" className="w-10 h-10 object-contain bg-[#F8FAFC] rounded p-1" />
                      <div>
                        <div className="font-bold text-[#141923]">{it.name}</div>
                        <div className="text-[11px] text-[#707783]">
                          SL: {it.quantity} · {it.selectedColor}
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold text-[#141923]">{formatVND(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E5E8EC] flex flex-wrap justify-between items-center gap-2 text-xs">
                <div>
                  <span className="text-[#707783]">Phương thức: </span>
                  <span className="font-semibold uppercase">{ord.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#707783]">Tổng thanh toán:</span>
                  <span className="text-base font-extrabold text-[#0275A9]">{formatVND(ord.total)}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="pt-2 flex flex-wrap justify-end gap-2 border-t border-dashed border-[#E5E8EC]">
                {ord.status === "Chờ xác nhận" && (
                  <button
                    onClick={() => {
                      if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
                        onCancelOrder(ord.orderId, "Khách hàng yêu cầu hủy trên web");
                      }
                    }}
                    className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Hủy đơn
                  </button>
                )}
                <button
                  onClick={() => onReorder(ord.items)}
                  className="px-3 py-1.5 border border-[#E5E8EC] text-[#141923] hover:bg-[#F5F6F8] rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Mua lại
                </button>
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="px-4 py-1.5 bg-[#0275A9] hover:bg-[#02628e] text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  Chi tiết & Theo dõi →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// REUSABLE COMPONENT: PRODUCT CARD
// =========================================================================
export default OrdersHistoryPage;
