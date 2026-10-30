import React from 'react';
import Icon from './Icon.jsx';

export function Footer({ navigate, showToast, storeSettings = {} }) {
  const hotline = storeSettings?.hotline || "1900 6868";
  return (
<footer className="ChnTrang w-full bg-[#FFFFFF] border-t border-[#E5E8EC] pt-12 pb-8 text-[#707783] text-[13px]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E5E8EC]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#/" onClick={() => navigate("#/")} className="Logo flex items-baseline">
              <span className="text-[#141923] text-[32px] font-extrabold tracking-tight">nét</span>
              <span className="text-[#0275A9] text-[32px] font-extrabold">.</span>
            </a>
            <p className="max-w-sm text-[13px] leading-relaxed">
              Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu Việt Nam. Nơi công nghệ đúng gu đồng hành cùng trải nghiệm uy tín.
            </p>
            <div className="pt-2 text-[12px] space-y-1">
              <div>Hotline CSKH & Khiếu nại: <a href="tel:19006868" className="text-[#0275A9] font-bold">{hotline}</a> (8h00 - 21h30)</div>
              <div>Email liên hệ: <a href="mailto:cskh@net.vn" className="text-[#0275A9]">cskh@net.vn</a></div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-[#141923] font-semibold mb-3">Về nét.</h4>
            <ul className="space-y-2 text-[12px]">
              <li><a href="#/" onClick={() => navigate("#/")} className="hover:text-[#0275A9] transition">Giới thiệu thương hiệu</a></li>
              <li><a href="#/category/all" onClick={() => navigate("#/category/all")} className="hover:text-[#0275A9] transition">Hệ thống 4 cửa hàng</a></li>
              <li><a href="#/" onClick={() => showToast("Đang cập nhật trang tuyển dụng nét.", "info")} className="hover:text-[#0275A9] transition">Tuyển dụng nhân tài</a></li>
              <li><a href="#/" onClick={() => showToast("Chính sách hợp tác doanh nghiệp B2B", "info")} className="hover:text-[#0275A9] transition">Hợp tác kinh doanh</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-[#141923] font-semibold mb-3">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-[12px]">
              <li><a href="#/orders" onClick={() => navigate("#/orders")} className="hover:text-[#0275A9] transition">Tra cứu đơn hàng</a></li>
              <li><a href="#/" onClick={() => showToast("Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền toàn quốc", "info")} className="hover:text-[#0275A9] transition">Chính sách bảo hành</a></li>
              <li><a href="#/" onClick={() => showToast("Chính sách đổi mới 1 đổi 1 trong 30 ngày cho lỗi phần cứng", "info")} className="hover:text-[#0275A9] transition">Chính sách đổi trả 30 ngày</a></li>
              <li><a href="#/" onClick={() => showToast("Giao hàng hỏa tốc 2 giờ nội thành", "info")} className="hover:text-[#0275A9] transition">Giao hàng hỏa tốc 2h</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-[#141923] font-semibold mb-3">Thanh toán an toàn</h4>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#141923]">
              <span className="px-2 py-1 bg-[#F5F6F8] rounded border border-[#E5E8EC]">VietQR</span>
              <span className="px-2 py-1 bg-[#F5F6F8] rounded border border-[#E5E8EC]">Thẻ Visa/Master</span>
              <span className="px-2 py-1 bg-[#F5F6F8] rounded border border-[#E5E8EC]">COD Tiền mặt</span>
              <span className="px-2 py-1 bg-[#F5F6F8] rounded border border-[#E5E8EC]">Trả góp 0%</span>
            </div>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-[#EAF4FA] text-[#0275A9] font-bold text-xs rounded-full">
                100% Chính Hãng VN/A
              </span>
            </div>
          </div>
        </div>

        <div className="w-full pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#707783] gap-3">
          <div>© 2026 nét. Corporation. All rights reserved. Bản quyền thuộc về nét. công nghệ đúng gu.</div>
          <div className="flex gap-4">
            <button type="button" onClick={() => showToast("Điều khoản sử dụng: Khách hàng được đổi mới 1-1 trong 30 ngày và bảo hành chính hãng 12 tháng.", "info")} className="hover:underline cursor-pointer">Điều khoản sử dụng</button>
            <button type="button" onClick={() => showToast("Chính sách bảo mật: Cam kết bảo mật thông tin cá nhân khách hàng 100% theo quy định pháp luật.", "info")} className="hover:underline cursor-pointer">Chính sách bảo mật</button>
          </div>
        </div>
        </div>
      </footer>
  );
}

export default Footer;
