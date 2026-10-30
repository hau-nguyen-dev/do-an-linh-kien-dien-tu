import React from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onViewDetail
}) {
  if (!product) return null;
  const quickViewProduct = product;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition"
          aria-label="Đóng"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-full sm:w-1/2 h-64 bg-[#F5F6F8] rounded-xl flex items-center justify-center p-4">
            <img src={quickViewProduct.img} alt={quickViewProduct.name} className="max-h-52 object-contain" />
          </div>
          <div className="w-full sm:w-1/2 space-y-3">
            <span className="text-[10px] bg-[#EAF4FA] text-[#0275A9] font-semibold px-2 py-0.5 rounded-full uppercase">
              {quickViewProduct.brandLabel || quickViewProduct.brand}
            </span>
            <h3 className="text-lg font-bold text-[#141923]">{quickViewProduct.name}</h3>
            <p className="text-xs text-[#707783]">{quickViewProduct.specsShort}</p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl font-bold text-[#0275A9]">{formatVND(quickViewProduct.price)}</span>
              <span className="text-xs text-[#707783] line-through font-normal">{formatVND(quickViewProduct.originalPrice)}</span>
            </div>
            <div className="p-2.5 bg-[#EAF4FA] border border-[#0275A9]/20 rounded-lg text-xs text-[#141923] space-y-1">
              <div className="font-semibold text-[#0275A9] flex items-center gap-1.5">
                <Icon name="gift" className="w-4 h-4 text-[#0275A9]" />
                <span>Quà tặng kèm:</span>
              </div>
              <div className="text-[11px] text-[#707783]">{quickViewProduct.gift}</div>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  if (onAddToCart) onAddToCart(quickViewProduct);
                  if (onClose) onClose();
                }}
                className="flex-1 py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={() => {
                  if (onClose) onClose();
                  if (onViewDetail) onViewDetail(quickViewProduct.id);
                }}
                className="px-4 py-2.5 bg-[#F5F6F8] hover:bg-[#E5E8EC] text-[#141923] text-xs font-semibold rounded-xl transition"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
