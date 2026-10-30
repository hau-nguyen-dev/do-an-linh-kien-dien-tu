import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { voucherService } from '../services/voucherService.js';
import { formatVND } from '../utils/formatters.js';

export function VoucherModal({ isOpen, onClose, cartSubtotal, onSelectVoucher, currentCode, vouchers: propVouchers }) {
  const [vouchersList, setVouchersList] = useState(propVouchers || []);

  useEffect(() => {
    if (propVouchers && propVouchers.length > 0) {
      setVouchersList(propVouchers);
    } else if (isOpen) {
      voucherService.getVouchers()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setVouchersList(data);
        })
        .catch((err) => console.warn("[VoucherModal] Error loading vouchers:", err));
    }
  }, [propVouchers, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-[#E5E8EC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF4FA] text-[#0275A9] flex items-center justify-center">
              <Icon name="gift" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#141923] text-base">Kho ưu đãi nét.</h3>
              <p className="text-[11px] text-[#707783]">Chọn mã giảm giá đồng bộ từ SQLite Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition cursor-pointer"
            aria-label="Đóng"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 max-h-96 overflow-y-auto">
          {vouchersList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#707783] bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
              Hiện chưa có mã giảm giá nào trong hệ thống.
            </div>
          ) : (
            vouchersList.map((v) => {
              const isEligible = cartSubtotal >= (v.minOrder || 0);
              const isSelected = currentCode && currentCode.toUpperCase() === v.code.toUpperCase();
              return (
                <div
                  key={v.code}
                  className={`p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    isSelected
                      ? "bg-[#EAF4FA] border-[#0275A9]"
                      : isEligible
                      ? "bg-white border-[#E5E8EC] hover:border-[#0275A9]/50"
                      : "bg-[#F8FAFC] border-[#E5E8EC] opacity-75"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#0275A9] text-xs px-2 py-0.5 bg-white border border-[#0275A9]/30 rounded">
                          {v.code}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                            <Icon name="check" className="w-3 h-3" /> Đang dùng
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-xs text-[#141923] mt-1">{v.desc || v.description}</div>
                      <div className="text-[11px] text-[#707783] mt-0.5">
                        Đơn tối thiểu: {formatVND(v.minOrder || 0)}
                      </div>
                    </div>
                    <button
                      disabled={!isEligible}
                      onClick={() => {
                        onSelectVoucher(v.code);
                        onClose();
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
                        !isEligible
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#0275A9] text-white"
                          : "bg-[#141923] hover:bg-[#0275A9] text-white cursor-pointer"
                      }`}
                    >
                      {isSelected ? "Đang áp dụng" : isEligible ? "Dùng mã" : "Chưa đủ ĐK"}
                    </button>
                  </div>
                  {!isEligible && (
                    <div className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Mua thêm {formatVND((v.minOrder || 0) - cartSubtotal)} để mở khóa mã này
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default VoucherModal;
