import React, { useState } from 'react';
import Icon from './Icon.jsx';

export function ReviewFormModal({ isOpen, onClose, product, onSubmitReview }) {
  if (!isOpen || !product) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [verifiedBuyer, setVerifiedBuyer] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      alert("Vui lòng điền họ tên và nội dung đánh giá!");
      return;
    }

    const newRev = {
      id: "rev_" + Date.now(),
      author: author.trim(),
      phone: phone.trim(),
      rating,
      date: "Vừa xong",
      content: content.trim(),
      verified: verifiedBuyer
    };

    onSubmitReview(product.id, newRev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-[#E5E8EC]">
          <div>
            <h3 className="font-bold text-[#141923] text-base">Đánh giá sản phẩm</h3>
            <p className="text-xs text-[#707783]">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F6F8] hover:bg-[#E5E8EC] flex items-center justify-center text-[#707783] hover:text-[#141923] transition"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC]">
            <div className="font-semibold text-[#141923] mb-2">Bạn đánh giá sản phẩm này thế nào?</div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-125 cursor-pointer"
                >
                  <Icon
                    name="star"
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">
              {rating === 5 ? "Rất hài lòng ⭐⭐⭐⭐⭐" : rating === 4 ? "Hài lòng ⭐⭐⭐⭐" : rating === 3 ? "Bình thường ⭐⭐⭐" : rating === 2 ? "Không hài lòng ⭐⭐" : "Rất tệ ⭐"}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#141923] mb-1">Họ và tên của bạn *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Hoàng Minh"
              className="w-full p-2.5 bg-white border border-[#E5E8EC] rounded-xl outline-none focus:border-[#0275A9]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#141923] mb-1">Số điện thoại (để xác thực)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0912 345 678"
              className="w-full p-2.5 bg-white border border-[#E5E8EC] rounded-xl outline-none focus:border-[#0275A9]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#141923] mb-1">Cảm nhận chi tiết *</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ về camera, pin, độ mượt hay cảm giác cầm nắm..."
              className="w-full p-2.5 bg-white border border-[#E5E8EC] rounded-xl outline-none focus:border-[#0275A9]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedBuyer}
              onChange={(e) => setVerifiedBuyer(e.target.checked)}
              className="w-4 h-4 text-[#0275A9] rounded"
            />
            <span className="text-[#707783]">Tôi xác nhận đã mua và trải nghiệm thực tế tại nét.</span>
          </label>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E5E8EC] text-[#707783] hover:bg-[#F5F6F8] rounded-xl font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0275A9] hover:bg-[#02628e] text-white rounded-xl font-bold transition shadow-sm cursor-pointer"
            >
              Gửi nhận xét
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ReviewFormModal;
