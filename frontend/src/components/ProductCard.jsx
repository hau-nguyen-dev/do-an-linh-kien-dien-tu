import React from 'react';
import Icon from './Icon.jsx';
import { formatVND } from '../utils/formatters.js';

export function ProductCard({ product, isWishlisted, onAddToCart, onToggleWishlist, onQuickView, onSelect }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E8EC] overflow-hidden flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-200 group relative">
      {/* Image Area with Centered Content */}
      <div className="w-full h-[240px] p-4 bg-[#F5F6F8] relative flex flex-col justify-between items-start">
        {product.badge && (
          <div className="px-[9px] py-[5px] bg-white rounded-[6px] text-[#0275A9] text-[10px] font-semibold shadow-2xs z-10">
            {product.badge}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center transition shadow-2xs cursor-pointer z-10 hover:scale-110"
          title="Lưu yêu thích"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#F43F5E" : "none"}
            stroke={isWishlisted ? "#F43F5E" : "#707783"}
            strokeWidth="2"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Centered Image */}
        <div
          onClick={onSelect}
          className="w-full flex-1 flex items-center justify-center my-auto z-0 cursor-pointer"
        >
          <img
            src={product.img}
            alt={product.name}
            className="max-h-[170px] max-w-[200px] w-auto h-auto object-contain group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView();
          }}
          className="absolute bottom-3 right-3 text-xs bg-white/95 text-[#141923] hover:text-[#0275A9] px-2.5 py-1 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer font-medium"
        >
          Xem nhanh
        </button>
      </div>

      {/* Info Area */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <h3
          onClick={onSelect}
          className="text-[#141923] text-[16px] font-semibold h-[24px] truncate cursor-pointer hover:text-[#0275A9] transition"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-[#707783] text-[12px] font-normal truncate">{product.specsShort}</p>

        <div className="flex items-baseline gap-2">
          <span className="text-[#141923] text-[19px] font-bold">{formatVND(product.price)}</span>
          {Boolean(product.hasDiscount || (product.originalPrice && product.originalPrice > product.price)) && (
            <span className="text-[#707783] text-[11px] line-through font-normal">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>

        {product.gift && (
          <div className="w-full p-[9px] bg-[#EAF4FA] rounded-[6px] flex items-center gap-1.5 text-[#0275A9] text-[11px]">
            <span className="truncate">{product.gift}</span>
          </div>
        )}

        <div className="w-full pt-1 flex items-center justify-between mt-auto">
          <span className="text-[12px] text-[#707783]">Chính hãng 100%</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-8 h-8 rounded-full bg-[#F5F6F8] hover:bg-[#0275A9] hover:text-white text-[#141923] flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
            title="Thêm vào giỏ hàng"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// REUSABLE COMPONENT: AUTH MODAL
// =========================================================================
// =========================================================================
// REUSABLE MODAL: VOUCHER STORE SELECTOR
// =========================================================================
export default ProductCard;
