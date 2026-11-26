import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';
import { generateVietQRUrl } from '../utils/vietqr.js';
import { paymentService } from '../services/paymentService.js';
import { API_BASE_URL } from '../services/api.js';

const QR_POLL_INTERVAL_MS = 4000;

/**
 * Khung thanh toán chuyển khoản: hiển thị mã QR do admin tải lên, hoặc tự tạo mã VietQR
 * từ thông tin tài khoản. Khi admin xác nhận đã nhận tiền, khung tự chuyển sang "Đã nhận thanh toán".
 */
export function PaymentQrBox({ order }) {
  const [config, setConfig] = useState(null);
  const [paidByPolling, setPaidByPolling] = useState(false);
  const isPaid = paidByPolling || Boolean(order.isPaid);
  const isCancelled = order.status === 'Đã hủy' || order.statusCode === 'cancelled';

  useEffect(() => {
    paymentService.getConfig()
      .then(setConfig)
      .catch(() => setConfig({ configured: false }));
  }, []);

  useEffect(() => {
    if (isPaid || isCancelled) return undefined;
    const timer = setInterval(() => {
      paymentService.getStatus(order.orderId)
        .then((s) => { if (s.paid) setPaidByPolling(true); })
        .catch(() => { /* lần thăm dò sau sẽ thử lại */ });
    }, QR_POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [order.orderId, isPaid, isCancelled]);

  if (isCancelled) return null;

  if (isPaid) {
    return (
      <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center gap-3">
        <Icon name="check-circle-2" className="w-8 h-8 text-emerald-600 shrink-0" />
        <div>
          <div className="text-sm font-bold text-emerald-700">Đã nhận thanh toán</div>
          <div className="text-xs text-emerald-700/80">Cảm ơn bạn! Đơn hàng #{order.orderId} đang được xử lý.</div>
        </div>
      </div>
    );
  }

  if (!config) {
    return <div className="p-5 text-xs text-[#707783] text-center">Đang tải thông tin thanh toán...</div>;
  }

  if (!config.configured) {
    return (
      <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
        Cửa hàng chưa cấu hình tài khoản nhận tiền nên chưa thể tạo mã QR. Vui lòng liên hệ hotline để được hỗ trợ thanh toán đơn #{order.orderId}.
      </div>
    );
  }

  // Ảnh admin tải lên là mã QR tĩnh (không kèm số tiền); mã tự tạo đã điền sẵn số tiền và nội dung
  const qrSrc = config.hasQrImage
    ? `${API_BASE_URL}/payment/qr-image?v=${config.qrImageVersion}`
    : generateVietQRUrl({
        bankId: config.bankId,
        accountNo: config.accountNo,
        accountName: config.accountName,
        amount: order.total,
        memo: order.orderId,
      });

  return (
    <div className="qr-box p-6 rounded-2xl border space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-bold text-[#141923]">Quét mã QR để chuyển khoản</h3>
        <p className="text-xs text-[#707783] mt-0.5">
          {config.hasQrImage
            ? "Mở app ngân hàng, quét mã rồi nhập đúng số tiền và nội dung bên dưới."
            : "Mở app ngân hàng bất kỳ và chọn Quét QR, số tiền và nội dung đã được điền sẵn."}
          {" "}Cửa hàng sẽ xác nhận ngay khi nhận được tiền.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        <div className="p-3 bg-white rounded-xl shadow-md border border-[#E5E8EC]">
          <img src={qrSrc} alt="Mã QR thanh toán" className="w-48 h-auto object-contain rounded-lg" />
        </div>

        <div className="space-y-2 text-xs">
          {config.hasBankInfo && (
            <>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Ngân hàng thụ hưởng</div>
                <div className="font-bold text-[#141923]">{config.bankId}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Số tài khoản</div>
                <div className="font-mono font-bold text-[#0275A9] text-sm">{config.accountNo}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
                <div className="text-[#707783] text-[10px]">Chủ tài khoản</div>
                <div className="font-bold text-[#141923]">{config.accountName}</div>
              </div>
            </>
          )}
          <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
            <div className="text-[#707783] text-[10px]">Số tiền thanh toán</div>
            <div className="font-bold text-rose-600 text-sm">{formatVND(order.total)}</div>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-[#E5E8EC]">
            <div className="text-[#707783] text-[10px]">Nội dung chuyển khoản (giữ nguyên)</div>
            <div className="font-mono font-bold text-[#141923]">{order.orderId}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentQrBox;
