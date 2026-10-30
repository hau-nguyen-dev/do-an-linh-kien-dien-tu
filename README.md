# nét. Tech Store — Hệ Thống Thương Mại Bán Linh Kiện Điện Tử

> **Đồ án học phần**: Các chủ đề nâng cao về hệ thống kinh doanh điện tử  
> **Lớp**: KHD5 — Học kỳ I, Năm học 2026 - 2027  
> **Khoa**: Kỹ thuật và Công nghệ — Đại học Huế (HUET)  
> **Giảng viên hướng dẫn**: Thầy Phạm Trung Đức  
> **Nhóm thực hiện**: Nhóm 4 thành viên  

---

## ⚠️ 1. Quy Tắc Quan Trọng Về Đường Dẫn Thư Mục (Folder Path Rules)

Khi tải hoặc sao chép dự án về máy tính của từng thành viên, **bắt buộc tuân thủ quy tắc sau**:
* ✅ **Đường dẫn chuẩn (KHÔNG dấu tiếng Việt, KHÔNG khoảng trắng)**:
  * Ví dụ chuẩn: `D:\projects\net-tech-store` hoặc `C:\workspace\net-tech-store` hoặc `D:\KHD5\net-tech-store`
* ❌ **Tránh đặt đường dẫn có dấu tiếng Việt hoặc dấu cách**:
  * Ví dụ lỗi: `D:\Đồ Án Nhóm 4\net-tech-store` hoặc `C:\Users\Nguyễn Văn A\Desktop\đồ án\...`
  * *Lý do*: Đường dẫn có dấu tiếng Việt sẽ khiến trình thông dịch Node.js và hệ cơ sở dữ liệu SQLite gặp lỗi không tìm thấy file (`ENOENT` hoặc lỗi mã hóa Unicode đường dẫn).
* 💡 **Đường dẫn trong dự án là đường dẫn tương đối (`%~dp0`)**:
  * Các file khởi chạy `.bat` tự động nhận diện thư mục hiện tại của dự án trên máy của bạn, dù bạn để ở ổ đĩa `C:`, `D:` hay `E:` đều hoạt động chính xác mà không cần sửa code.

---

## 🛠 2. Hướng Dẫn Cài Đặt Môi Trường Cho Thành Viên (Từ A - Z)

### Bước 1: Cài đặt Node.js (Bắt buộc cho Backend)
1. Truy cập trang chủ chính thức: [https://nodejs.org/](https://nodejs.org/)
2. Tải phiên bản **LTS (Khuyến nghị bản 18, 20 hoặc 22)** dành cho hệ điều hành của bạn.
3. Chạy file cài đặt vừa tải về, bấm **Next** liên tục (giữ nguyên cài đặt mặc định, đảm bảo mục *"Add to PATH"* được chọn).
4. Kiểm tra cài đặt thành công: Mở **Command Prompt (cmd)** hoặc **PowerShell** và gõ:
   ```bash
   node -v
   npm -v
   ```
   *(Nếu hiển thị số phiên bản như `v20.x.x` và `10.x.x` là đã thành công).*

### Bước 2: Cài đặt Git & Trình soạn thảo VS Code
* **Git**: Tải tại [https://git-scm.com/](https://git-scm.com/) và cài đặt mặc định để clone/push mã nguồn.
* **VS Code**: Tải tại [https://code.visualstudio.com/](https://code.visualstudio.com/) để chỉnh sửa code.
* **Extension khuyên dùng trên VS Code**:
  * `SQLite Viewer` (của Florian Klampfer): Giúp mở và xem trực quan các bảng dữ liệu trong file `backend/database.sqlite` trực tiếp trên VS Code mà không cần cài phần mềm ngoài.
  * `Tailwind CSS IntelliSense`: Hỗ trợ gợi ý class giao diện.

---

## 📥 3. Hướng Dẫn Tải (Clone) Và Cài Đặt Dự Án

### Bước 1: Mở Terminal tại thư mục bạn muốn lưu dự án
Mở PowerShell hoặc Command Prompt tại thư mục làm việc (ví dụ `D:\projects`), sau đó chạy:
```bash
git clone https://github.com/nthaubot-gif/net-tech-store.git
cd net-tech-store
```
*(Thay link trên bằng link Repository chính thức của nhóm).*

### Bước 2: Cài đặt thư viện dependencies cho Backend
Tại thư mục gốc của dự án, di chuyển vào thư mục `backend` và cài đặt các gói cần thiết:
```bash
cd backend
npm install
cd ..
```
*(Lệnh này sẽ tự động tải các gói `express`, `better-sqlite3`, `cors`, `body-parser` vào thư mục `backend/node_modules/`).*

---

## 🚀 4. Hướng Dẫn Khởi Chạy Hệ Thống

Dự án đã được tích hợp sẵn 3 tệp batch thông minh:

### Cách 1: Khởi chạy nhanh bằng nhấp đúp chuột (Khuyến nghị trên Windows)
1. **Khởi động Backend (Máy chủ API & Database)**:
   * Nhấp đúp vào file [`start_backend.bat`](start_backend.bat).
   * Cửa sổ dòng lệnh sẽ tự động kiểm tra Node.js và khởi động server tại cổng `5000`.
   * *Thông báo thành công*: `[Database SQLite] Da ket noi thanh cong: database.sqlite` và `Backend Server dang chay tai: http://localhost:5000`.
   * ⚠️ *Lưu ý*: Giữ nguyên cửa sổ đen này không tắt để Backend liên tục hoạt động.
2. **Khởi động Storefront (Trang mua sắm khách hàng)**:
   * Nhấp đúp vào file [`start_frontend.bat`](start_frontend.bat).
   * Trình duyệt mặc định sẽ tự động mở trang web bán hàng (`frontend/index.html`).
3. **Khởi động Admin (Trang quản trị cửa hàng nét. Store Manager)**:
   * Nhấp đúp vào file [`start_admin.bat`](start_admin.bat).
   * Trình duyệt sẽ mở trang quản trị (`frontend/admin.html`), kết nối trực tiếp với database SQLite port 5000.

### Cách 2: Khởi chạy bằng dòng lệnh Terminal (Dành cho lập trình viên)
```bash
# Terminal 1: Chạy Backend
cd backend
node server.js

# Terminal 2: Mở Frontend Client hoặc Admin
# Mở trực tiếp file frontend/index.html hoặc frontend/admin.html trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc)
```

---

## 🗄 5. Cấu Trúc Thư Mục & Quản Lý Cơ Sở Dữ Liệu SQLite

```text
├── backend/
│   ├── config/
│   │   └── db.js               # Kết nối SQLite & Hàm định dạng chuẩn hóa đơn hàng
│   ├── routes/                 # Các API Endpoint (auth, products, orders, settings...)
│   ├── database.sqlite         # File CSDL SQLite thực tế (10 bảng dữ liệu)
│   ├── init_db.js              # Script khởi tạo/reset CSDL về trạng thái ban đầu
│   ├── schema.sql              # Cấu trúc bảng CSDL (CREATE TABLE)
│   ├── seed.sql                # Dữ liệu mẫu ban đầu (Sản phẩm, danh mục, voucher)
│   ├── server.js               # File máy chủ chính Express.js
│   └── package.json            # Khai báo thư viện Backend
├── frontend/
│   ├── admin.html              # Phân hệ Quản trị nét. Store Manager độc lập
│   ├── index.html              # Phân hệ Bán hàng Storefront Client
│   ├── scripts/                # Script build và đóng gói
│   └── src/                    # Mã nguồn React Component & Pages
├── tools/                      # Công cụ kiểm thử và tài nguyên phát triển
├── Bao_Cao_Do_An_Dai_Hoc_Hue.docx # Báo cáo Word chuẩn phôi Đại học Huế (22 trang chính văn)
├── Slide_Thuyet_Trinh.pptx     # 19 slide thuyết trình PowerPoint
├── start_backend.bat           # File khởi chạy nhanh Backend
├── start_frontend.bat          # File mở nhanh Storefront
├── start_admin.bat             # File mở nhanh Admin Manager
└── .gitignore                  # File loại trừ file rác & thư viện nặng khi đẩy lên Git
```

### Cách Reset lại Cơ sở dữ liệu về ban đầu (Khi cần)
Nếu trong quá trình test dữ liệu bị lỗi hoặc muốn xóa sạch các đơn hàng thử nghiệm để trở về trạng thái gốc:
```bash
cd backend
node init_db.js
```
Lệnh trên sẽ tự động đọc lại `schema.sql` và `seed.sql` để làm mới CSDL `database.sqlite`.

---

## 🌿 6. Quy Trình Phối Hợp Làm Việc Nhóm Bằng Git (Git Team Workflow)

Để 4 thành viên cùng code mà **không bị xung đột (conflict)**:

1. **Trước khi bắt đầu code**: Luôn lấy code mới nhất về máy:
   ```bash
   git pull origin main
   ```
2. **Tạo nhánh riêng khi làm tính năng mới**:
   ```bash
   # Ví dụ bạn làm chức năng bộ lọc sản phẩm:
   git checkout -b feature/filter-products
   ```
3. **Lưu lại các thay đổi sau khi code xong**:
   ```bash
   git status                         # Xem các file vừa sửa
   git add .                          # Thêm các file đã sửa
   git commit -m "feat: mo ta ngan gon ve chuc nang vua sua"
   git push origin feature/filter-products
   ```
4. **Tạo Pull Request trên GitHub**:
   * Truy cập GitHub Repository của nhóm, bấm vào thông báo **"Compare & pull request"**.
   * Nhóm trưởng duyệt và bấm **"Merge pull request"** để gộp code vào nhánh `main`.
   * Các bạn còn lại chỉ cần gõ `git checkout main && git pull` là có code mới nhất.

---

## 👥 7. Phân Công Nhiệm Vụ 4 Thành Viên (Lớp KHD5)
| STT | Thành viên | Vai trò | Phân hệ phụ trách chính |
| :---: | :--- | :---: | :--- |
| 1 | **Sinh viên 1** | Nhóm trưởng | Quản trị tiến độ, Thiết kế kiến trúc tổng thể, CSDL SQLite 10 bảng & API Auth. |
| 2 | **Sinh viên 2** | Thành viên | Thiết kế Design System trên Figma, Xây dựng giao diện Storefront Client (Trang chủ, Chi tiết SP, Giỏ hàng). |
| 3 | **Sinh viên 3** | Thành viên | Phát triển RESTful API Express.js, Cổng thanh toán VietQR Napas 247 & Cơ chế lọc chống spam 2 tầng. |
| 4 | **Sinh viên 4** | Thành viên | Xây dựng phân hệ Quản trị nét. Store Manager, Đánh giá 5 Gaps Production & Hoàn thiện báo cáo học thuật. |
