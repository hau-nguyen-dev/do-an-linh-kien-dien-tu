import React, { useState } from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function OrderDetailModal({ order, isOpen, onClose, onCancelOrder, onReorder }) {
  if (!isOpen || !order) return null;

  const isCancelled = order.status === "Đã hủy";
  const canCancel = order.status === "Chờ xác nhận";

  const steps = [
    { label: "Đặt hàng", desc: "Đã tiếp nhận đơn", done: true },
    { label: "Xác nhận", desc: isCancelled ? "Đơn đã bị hủy" : "nét. đã duyệt", done: !isCancelled },
    { label: "Vận chuyển", desc: "Đang giao nhanh 2h", done: order.status === "Đang vận chuyển" || order.status === "Giao thành công" },
    { label: "Thành công", desc: "Đã nhận hàng", done: order.status === "Giao thành công" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#E5E8EC]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#0275A9] text-base">#{order.orderId}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isCancelled
                  ? "bg-rose-100 text-rose-700"
                  : order.status === "Giao thành công"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-[#707783] mt-0.5">Đặt ngày: {order.date} lúc {order.time}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Tracking Stepper */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC]">
            <h4 className="text-xs font-bold text-[#141923] mb-3">Tiến trình đơn hàng</h4>
            {isCancelled ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <Icon name="x" className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đơn hàng đã hủy ({order.cancelReason || "Khách hàng yêu cầu hủy"}).</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                {steps.map((st, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      st.done ? "bg-[#0275A9] text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {st.done ? <Icon name="check" className="w-3.5 h-3.5" /> : (i + 1)}
                    </div>
                    <span className="text-[11px] font-semibold text-[#141923]">{st.label}</span>
                    <span className="text-[9px] text-[#707783]">{st.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="p-4 bg-white border border-[#E5E8EC] rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-[#141923] flex items-center gap-1.5">
              <Icon name="map-pin" className="w-3.5 h-3.5 text-[#0275A9]" />
              <span>Thông tin nhận hàng</span>
            </h4>
            <div className="text-[#141923] font-semibold">
              {order.customer?.fullName} · {order.customer?.phone}
            </div>
            <div className="text-[#707783]">
              {order.customer?.address}, {order.customer?.district}, {order.customer?.city}
            </div>
            {order.customer?.note && (
              <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded">
                Ghi chú: {order.customer?.note}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#141923]">Sản phẩm ({order.items.length})</h4>
            {order.items.map((it) => (
              <div key={it.cartItemId} className="p-3 bg-[#F8FAFC] border border-[#E5E8EC] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={it.img} alt="" className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-[#E5E8EC]" />
                  <div>
                    <div className="font-bold text-[#141923]">{it.name}</div>
                    <div className="text-[11px] text-[#707783]">
                      Phân loại: {it.selectedColor} · {it.selectedStorage}
                    </div>
                    <div className="text-[11px] text-[#0275A9] font-semibold">
                      SL: {it.quantity} x {formatVND(it.price)}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-[#141923]">{formatVND(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Payment & QR */}
          {order.paymentMethod === "vietqr" && !isCancelled && (
            <div className="p-4 bg-[#EAF4FA] border border-[#0275A9]/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0275A9]">Mã QR thanh toán chuyển khoản:</span>
                <span className="text-[11px] bg-white text-[#0275A9] font-bold px-2 py-0.5 rounded border border-[#0275A9]/20">VietQR Napas247</span>
              </div>
              <div className="flex justify-center p-2 bg-white rounded-lg border border-[#E5E8EC]">
                <img
                  src={generateVietQRUrl(order.total, order.orderId)}
                  alt="VietQR"
                  className="max-h-40 object-contain"
                />
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#707783]">
              <span>Tạm tính:</span>
              <span>{formatVND(order.subtotal || order.total)}</span>
            </div>
            <div className="flex justify-between text-[#707783]">
              <span>Phí vận chuyển:</span>
              <span>{order.shippingFee ? formatVND(order.shippingFee) : "Miễn phí (0₫)"}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Giảm giá voucher:</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#141923] font-bold text-sm pt-2 border-t border-[#E5E8EC]">
              <span>Tổng thanh toán:</span>
              <span className="text-[#0275A9]">{formatVND(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E5E8EC] flex justify-between items-center gap-3">
          {canCancel ? (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
                  onCancelOrder(order.orderId, "Khách hàng yêu cầu hủy trên web");
                }
              }}
              className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Hủy đơn hàng
            </button>
          ) : (
            <span className="text-xs text-[#707783]">
              {isCancelled ? "Đơn đã đóng" : "Đang xử lý"}
            </span>
          )}

          <button
            onClick={() => {
              onReorder(order.items);
              onClose();
            }}
            className="px-4 py-2 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Mua lại đơn này
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// REUSABLE MODAL: PRODUCT REVIEW SUBMISSION
// =========================================================================
export default OrderDetailModal;
