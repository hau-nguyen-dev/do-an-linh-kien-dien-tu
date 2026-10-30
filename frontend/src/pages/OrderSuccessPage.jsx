import React, { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function OrderSuccessPage({ orderId, orders, onNavigate }) {
  const order = orders.find((o) => o.orderId === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-lg font-bold">Không tìm thấy đơn hàng</h2>
        <button onClick={() => onNavigate("#/")} className="mt-4 px-4 py-2 bg-[#0275A9] text-white text-xs rounded-lg">
          Về trang chủ
        </button>
      </div>
    );
  }

  const qrUrl = generateVietQRUrl({
    bankId: "MB",
    accountNo: "0901234567",
    accountName: "NET STORE VN",
    amount: order.total,
    memo: order.orderId,
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-200 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm pulse-success">
          <Icon name="check-circle-2" className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141923]">Đặt hàng thành công!</h1>
        <p className="text-xs text-[#707783]">
          Cảm ơn bạn đã tin tưởng mua sắm tại <span className="font-bold text-[#141923]">nét.</span>. Mã đơn hàng của bạn là:
        </p>
        <div className="inline-block px-4 py-1.5 bg-[#EAF4FA] text-[#0275A9] font-black text-base rounded-full border border-[#0275A9]/20">
          #{order.orderId}
        </div>
      </div>

      {/* VietQR Box if payment is VietQR */}
      {order.paymentMethod === "vietqr" && (
        <div className="qr-box p-6 rounded-2xl border space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-bold text-[#141923]">Quét mã VietQR để hoàn tất chuyển khoản</h3>
            <p className="text-xs text-[#707783] mt-0.5">
              Mở App ngân hàng bất kỳ (Vietcombank, MB, Techcombank, VPBank...) và chọn Quét QR
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <div className="p-3 bg-white rounded-xl shadow-md border border-[#E5E8EC]">
              <img src={qrUrl} alt="VietQR Payment" className="w-48 h-auto object-contain rounded-lg" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Ngân hàng thụ hưởng</div>
                <div className="font-bold text-[#141923]">MBBank (Ngân hàng Quân Đội)</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Số tài khoản</div>
                <div className="font-mono font-bold text-[#0275A9] text-sm">0901 2345 67</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Chủ tài khoản</div>
                <div className="font-bold text-[#141923]">NET STORE VN</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Số tiền thanh toán</div>
                <div className="font-bold text-rose-600 text-sm">{formatVND(order.total)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Details */}
      <div className="p-6 bg-white border border-[#E5E8EC] rounded-2xl shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#141923]">Chi tiết người nhận</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#707783]">
          <div>Người nhận: <span className="text-[#141923] font-medium">{order.customer.fullName}</span></div>
          <div>Số điện thoại: <span className="text-[#141923] font-medium">{order.customer.phone}</span></div>
          <div className="sm:col-span-2">Địa chỉ: <span className="text-[#141923] font-medium">{order.customer.address}, {order.customer.district}, {order.customer.city}</span></div>
        </div>

        <div className="pt-3 border-t border-[#E5E8EC]">
          <h4 className="font-bold text-xs text-[#141923] mb-2">Sản phẩm đã đặt:</h4>
          <div className="divide-y divide-[#E5E8EC]">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2 flex justify-between items-center">
                <span className="font-medium text-[#141923]">{item.name} × {item.quantity}</span>
                <span className="text-[#0275A9] font-bold">{formatVND(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#E5E8EC] flex justify-between font-bold text-sm">
            <span>Tổng tiền:</span>
            <span className="text-[#0275A9] text-base">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => onNavigate("#/orders")}
          className="px-6 py-3 bg-[#141923] hover:bg-[#0275A9] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Xem lịch sử đơn hàng
        </button>
        <button
          onClick={() => onNavigate("#/")}
          className="px-6 py-3 bg-[#F5F6F8] hover:bg-[#E5E8EC] text-[#141923] text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Tiếp tục mua sắm tại nét.
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-PAGE: CATEGORY & FACETED FILTER PAGE
// =========================================================================
export default OrderSuccessPage;
