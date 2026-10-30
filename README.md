# nét. Tech Store — Hệ Thống Thương Mại Bán Linh Kiện Điện Tử

> **Đồ án học phần**: Các chủ đề nâng cao về hệ thống kinh doanh điện tử  
> **Lớp**: KHD5 — Học kỳ I, Năm học 2026 - 2027  
> **Khoa**: Kỹ thuật và Công nghệ — Đại học Huế (HUET)  
> **Giảng viên hướng dẫn**: Thầy Phạm Trung Đức  
> **Nhóm sinh viên thực hiện**: Nhóm 4 thành viên  

---

## 🚀 Giới Thiệu Dự Án
Hệ thống thương mại điện tử B2C chuyên kinh doanh thiết bị số và linh kiện điện tử **nét.**, ứng dụng phương pháp luận phát triển hiện đại:
* **UI/UX Design System**: Thiết kế chuẩn trên Figma.
* **Phương pháp phát triển**: Vibe Coding với trợ lý AI Google Antigravity.
* **Điểm sáng công nghệ**: Thanh toán động VietQR Napas 247, Lọc spam đơn hàng 2 tầng, Tính toán giá biến thể đa tầng và Bảng điều khiển quản trị nét. Store Manager.

---

## 🛠 Kiến Trúc Công Nghệ
* **Frontend Client & Admin**: Single Page Application (React 18, Tailwind CSS, CDN Standalone / Vite).
* **Backend Server**: Node.js, Express.js RESTful API (Port 5000).
* **Database**: SQLite cục bộ (`backend/database.sqlite`), tương thích `better-sqlite3`.

---

## 💻 Hướng Dẫn Cài Đặt & Khởi Chạy Cho Nhóm

### 1. Yêu cầu môi trường
* Đã cài đặt **Node.js** (khuyến nghị phiên bản 18+ hoặc 20+).
* Đã cài đặt **Git**.

### 2. Cài đặt dependencies (Lần đầu tiên clone về)
Mở Terminal/PowerShell tại thư mục gốc và di chuyển vào `backend`:
```bash
cd backend
npm install
```

### 3. Khởi chạy hệ thống trên Windows
Dự án đã tích hợp sẵn 3 tệp batch giúp nhóm chạy nhanh:
1. **Khởi động Backend**: Nhấp đúp vào `start_backend.bat` (Server chạy tại `http://localhost:5000`).
2. **Mở Storefront Khách hàng**: Nhấp đúp vào `start_frontend.bat` (Mở `frontend/index.html` trên trình duyệt).
3. **Mở Phân hệ Quản trị Admin**: Nhấp đúp vào `start_admin.bat` (Mở `frontend/admin.html` trên trình duyệt).

---

## 👥 Phân Công Nhiệm Vụ Thành Viên
1. **Sinh viên 1 (Nhóm trưởng)**: Quản trị tiến độ, Kiến trúc hệ thống & Thiết kế CSDL SQLite.
2. **Sinh viên 2**: Thiết kế UI/UX trên Figma, Xây dựng giao diện Storefront Client.
3. **Sinh viên 3**: Xây dựng Backend Express.js API, Cổng VietQR Napas 247 & Bộ lọc spam.
4. **Sinh viên 4**: Phân hệ nét. Store Manager, Đánh giá 5 Gaps Production & Viết tài liệu báo cáo.
