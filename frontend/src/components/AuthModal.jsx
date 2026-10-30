import React, { useState } from 'react';
import Icon from './Icon.jsx';

export function AuthModal({ isOpen, currentUser, onLogin, onLogout, onClose, onNavigateOrders }) {
  if (!isOpen) return null;

  const [authTab, setAuthTab] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    onLogin({
      name: name.trim() || "Khách hàng nét.",
      phone: phone.trim(),
      email: email.trim() || `${phone.trim()}@net.vn`,
      tier: "Hội viên Silver",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition"
          aria-label="Đóng"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>

        {currentUser ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-[#EAF4FA] text-[#0275A9] text-2xl font-black flex items-center justify-center mx-auto">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141923]">{currentUser.name}</h3>
              <div className="text-xs text-[#707783]">{currentUser.phone}</div>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                {currentUser.tier || "Hội viên nét. VIP"}
              </span>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={onNavigateOrders}
                className="w-full py-2.5 bg-[#F5F6F8] hover:bg-[#E5E8EC] text-xs font-semibold rounded-xl text-[#141923] transition flex items-center justify-center gap-2"
              >
                <Icon name="package" className="w-4 h-4 text-[#0275A9]" />
                <span>Đơn hàng của tôi</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-xs font-semibold rounded-xl text-rose-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex border-b border-[#E5E8EC]">
              <button
                onClick={() => setAuthTab("login")}
                className={`flex-1 py-2 text-xs font-bold transition border-b-2 ${
                  authTab === "login"
                    ? "border-[#0275A9] text-[#0275A9]"
                    : "border-transparent text-[#707783] hover:text-[#141923]"
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setAuthTab("register")}
                className={`flex-1 py-2 text-xs font-bold transition border-b-2 ${
                  authTab === "register"
                    ? "border-[#0275A9] text-[#0275A9]"
                    : "border-transparent text-[#707783] hover:text-[#141923]"
                }`}
              >
                Đăng ký nét. VIP
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              {authTab === "register" && (
                <div>
                  <label className="block text-[#707783] mb-1 font-medium">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full p-2.5 border border-[#E5E8EC] rounded-xl focus:border-[#0275A9] focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-[#707783] mb-1 font-medium">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full p-2.5 border border-[#E5E8EC] rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              {authTab === "register" && (
                <div>
                  <label className="block text-[#707783] mb-1 font-medium">Email (nhận ưu đãi)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 border border-[#E5E8EC] rounded-xl focus:border-[#0275A9] focus:outline-none"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white font-bold rounded-xl transition shadow-card mt-2"
              >
                {authTab === "login" ? "Đăng nhập ngay" : "Tạo tài khoản thành viên"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
