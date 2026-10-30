
const { useState, useEffect, useMemo, useRef } = React;

// 1. DEFAULT DATA
const DEFAULT_PRODUCTS = [
  // 1. PHONES
  {
    id: "p1",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    fullName: "Apple iPhone 16 Pro Chính Hãng VN/A",
    brand: "apple",
    brandLabel: "Apple",
    category: "phones",
    categoryLabel: "Điện thoại",
    price: 28490000,
    originalPrice: 29990000,
    img: "src/assets/img/phone-iphone-16-pro.png",
    gallery: [
      "src/assets/img/phone-iphone-16-pro.png",
      "src/assets/img/hero-iphone-16-pro.png",
      "src/assets/img/banner-accessories.png",
    ],
    rating: 5.0,
    reviewCount: 3,
    specsShort: "Apple A18 Pro · Super Retina XDR 120Hz · Fusion 48MP",
    gift: "Tặng gói bảo hành VIP 12 tháng chính hãng",
    badge: "TRẢ GÓP 0%",
    desc: "<h3>1. Thiết kế Titan thế hệ mới với viền màn hình siêu mỏng</h3>\n<p>iPhone 16 Pro đánh dấu bước chuyển mình vượt bậc trong ngôn ngữ thiết kế của Apple. Sở hữu khung viền chế tác từ <strong>Titan Hạng 5</strong> với lớp hoàn thiện phủ vi hạt tinh xảo, máy không chỉ mang lại độ cứng cáp ấn tượng mà còn có trọng lượng tối ưu chỉ 199g. Điểm nổi bật nhất ở mặt trước chính là phần viền màn hình mỏng nhất từng xuất hiện trên bất kỳ thiết bị Apple nào, giúp mở rộng không gian hiển thị lên 6.3 inch mà kích thước tổng thể máy gần như không đổi so với thế hệ trước.</p>\n\n<p>Màn hình <strong>Super Retina XDR OLED</strong> với công nghệ <strong>ProMotion 120Hz</strong> đem lại trải nghiệm vuốt chạm mượt mà đỉnh cao. Độ sáng tối đa ngoài trời lên tới 2000 nits giúp bạn dễ dàng theo dõi bản đồ hay chụp ảnh ngay dưới ánh nắng gắt.</p>\n\n<h3>2. Nút Điều Khiển Camera (Camera Control) - Thao tác nhiếp ảnh chuyên nghiệp</h3>\n<p>Lần đầu tiên trên dòng iPhone Pro, Apple trang bị nút bấm cảm ứng lực <em>Camera Control</em> ở cạnh phải máy. Người dùng có thể trượt ngón tay để zoom mượt mà, nhấn nhẹ để khóa nét và nhấn đúp để chuyển đổi giữa các ống kính hoặc chế độ đo sáng. Đây là công cụ đắc lực cho những nhà sáng tạo nội dung và nhiếp ảnh gia đường phố.</p>\n\n<p>Cụm camera Fusion 48MP thế hệ thứ 2 mang đến cảm biến Quad-Pixel nhanh hơn, cho phép quay video <strong>4K 120 fps chuẩn Dolby Vision</strong> - tính năng chưa từng có trên bất kỳ smartphone nào trên thế giới. Ống kính Telephoto 5x sử dụng lăng kính tứ diện phản xạ (Tetraprism) hỗ trợ chụp ảnh chân dung từ xa sắc nét đến từng sợi tóc.</p>\n\n<h3>3. Hiệu năng vượt giới hạn với chip Apple A18 Pro</h3>\n<p>Trái tim của iPhone 16 Pro là vi xử lý <strong>Apple A18 Pro</strong> được sản xuất trên tiến trình 3nm thế hệ thứ 2. Với CPU 6 nhân mạnh hơn 15% và tiết kiệm điện 20%, cùng GPU 6 nhân hỗ trợ công nghệ Ray Tracing bằng phần cứng nhanh gấp 2 lần, máy dễ dàng cân mượt các tựa game đồ họa AAA đỉnh cao như Resident Evil 4 hay Death Stranding.</p>\n\n<ul>\n  <li><strong>Apple Intelligence:</strong> Hệ thống trí tuệ cá nhân hóa hỗ trợ tóm tắt email, sửa văn phong và tạo biểu tượng Genmoji tức thì.</li>\n  <li><strong>Cổng USB-C tốc độ cao:</strong> Tốc độ truyền tải lên đến 10Gb/s (USB 3), hỗ trợ xuất trực tiếp video ProRes sang ổ cứng SSD gắn ngoài.</li>\n  <li><strong>Pin bền bỉ:</strong> Thời lượng xem video liên tục đạt tới 27 giờ, cải tiến vượt trội giúp bạn yên tâm làm việc cả ngày dài.</li>\n</ul>\n\n<h3>4. Bảng thông số kỹ thuật chi tiết</h3>\n<div style=\"overflow-x:auto;\">\n<table style=\"width:100%; border-collapse:collapse; margin-top:12px; margin-bottom:16px; font-size:13px; text-align:left;\">\n  <thead>\n    <tr style=\"background-color:#F1F5F9; border-bottom:2px solid #CBD5E1;\">\n      <th style=\"padding:10px 14px; color:#141923; font-weight:700; width:35%;\">Thông số phần cứng</th>\n      <th style=\"padding:10px 14px; color:#141923; font-weight:700;\">Chi tiết trang bị</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr style=\"border-bottom:1px solid #E2E8F0;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Màn hình</td><td style=\"padding:10px 14px; color:#141923;\">6.3 inch, Super Retina XDR OLED, 120Hz ProMotion, 2000 nits đỉnh</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0; background-color:#F8FAFC;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Vi xử lý (CPU)</td><td style=\"padding:10px 14px; color:#141923;\">Apple A18 Pro 6 nhân (3nm thế hệ 2), GPU 6 nhân Ray Tracing</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Bộ nhớ RAM</td><td style=\"padding:10px 14px; color:#141923;\">8 GB Unified</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0; background-color:#F8FAFC;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Camera sau</td><td style=\"padding:10px 14px; color:#141923;\">Chính 48MP Fusion + Góc siêu rộng 48MP + Telephoto 5x 12MP</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Camera trước</td><td style=\"padding:10px 14px; color:#141923;\">12MP TrueDepth với Autofocus</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0; background-color:#F8FAFC;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Pin & Công nghệ sạc</td><td style=\"padding:10px 14px; color:#141923;\">Thời lượng xem video lên tới 27 giờ, Sạc nhanh 50% trong 30 phút</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Hệ điều hành</td><td style=\"padding:10px 14px; color:#141923;\">iOS 18 tích hợp Apple Intelligence</td></tr>\n    <tr style=\"border-bottom:1px solid #E2E8F0; background-color:#F8FAFC;\"><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Kháng nước & bụi</td><td style=\"padding:10px 14px; color:#141923;\">Chuẩn IP68 (Độ sâu 6 mét trong tối đa 30 phút)</td></tr>\n    <tr><td style=\"padding:10px 14px; font-weight:600; color:#475569;\">Trọng lượng</td><td style=\"padding:10px 14px; color:#141923;\">199 g</td></tr>\n  </tbody>\n</table>\n</div>",
    colors: [
      { id: "desert", name: "Titan Sa Mạc", hex: "#C5B29F" },
      { id: "natural", name: "Titan Tự Nhiên", hex: "#9E9A95" },
      { id: "white", name: "Titan Trắng", hex: "#E3E4E5" },
      { id: "black", name: "Titan Đen", hex: "#3C3B3A" },
    ],
    storageOptions: [
      { id: "128gb", label: "128 GB", priceDiff: 0 },
      { id: "256gb", label: "256 GB", priceDiff: 3000000 },
      { id: "512gb", label: "512 GB", priceDiff: 7500000 },
      { id: "1tb", label: "1 TB", priceDiff: 12000000 },
    ],
    specsDetailed: {
      screen: "6.3 inch, Super Retina XDR OLED, 120Hz ProMotion, 2000 nits",
      cpu: "Apple A18 Pro 6 nhân (3nm thế hệ 2), GPU 6 nhân với Ray Tracing",
      ram: "8 GB",
      cameraRear: "Chính 48MP Fusion + Góc siêu rộng 48MP + Telephoto 5x 12MP",
      cameraFront: "12MP TrueDepth với Autofocus",
      battery: "Thời lượng xem video lên tới 27 giờ, Sạc nhanh 50% trong 30 phút",
      os: "iOS 18 tích hợp Apple Intelligence",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.3, Cổng USB-C tốc độ 10Gb/s",
      weight: "199 g",
    },
    reviews: [
      {
        id: "r1",
        author: "Hoàng Minh",
        date: "20/10/2026",
        rating: 5,
        content: "Màu titan sa mạc bên ngoài nhìn sang chảnh hơn trong ảnh nhiều. Máy cầm đầm tay, viền màn hình siêu mỏng, camera zoom 5x sắc nét tuyệt vời!",
      },
      {
        id: "r2",
        author: "Thanh Hằng",
        date: "18/10/2026",
        rating: 5,
        content: "Giao hàng hỏa tốc 2h của nét. rất nhanh. Nhân viên tư vấn nhiệt tình, đóng gói cẩn thận và có đầy đủ hóa đơn VAT điện tử.",
      },
      {
        id: "r3",
        author: "Tuấn Anh",
        date: "14/10/2026",
        rating: 5,
        content: "Pin trâu hơn đời 15 Pro rõ rệt. Nút Camera Control ban đầu hơi lạ nhưng quen rồi thì chụp ảnh cực kỳ tiện.",
      },
    ],
  },
  {
    id: "p2",
    slug: "samsung-galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    fullName: "Samsung Galaxy S24 Ultra 12GB 256GB Chính Hãng",
    brand: "samsung",
    brandLabel: "Samsung",
    category: "phones",
    categoryLabel: "Điện thoại",
    price: 29990000,
    originalPrice: 33990000,
    img: "src/assets/img/phone-samsung-s24.png",
    gallery: [
      "src/assets/img/phone-samsung-s24.png",
      "src/assets/img/hero-iphone-16-pro.png",
    ],
    rating: 4.8,
    reviewCount: 1,
    specsShort: "Snapdragon 8 Gen 3 · 200MP Zoom 100x · Màn chống chói",
    gift: "Tặng củ sạc nhanh 45W chính hãng trị giá 990.000₫",
    badge: "TRẢ GÓP 0%",
    desc: "Khung viền Titan bền bỉ kết hợp kính Corning Gorilla Armor chống phản chiếu ánh sáng tới 75%. Quyền năng Galaxy AI hỗ trợ dịch trực tiếp cuộc gọi, khoanh tròn để tìm kiếm thông minh cùng bút S-Pen tích hợp.",
    colors: [
      { id: "grey", name: "Xám Titan", hex: "#7E7F83" },
      { id: "black", name: "Đen Titan", hex: "#2E2F32" },
      { id: "violet", name: "Tím Titan", hex: "#635B74" },
      { id: "yellow", name: "Vàng Titan", hex: "#E5D9BC" },
    ],
    storageOptions: [
      { id: "256gb", label: "256 GB", priceDiff: 0 },
      { id: "512gb", label: "512 GB", priceDiff: 4000000 },
      { id: "1tb", label: "1 TB", priceDiff: 8000000 },
    ],
    specsDetailed: {
      "Màn hình": "6.8 inch, Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits, Kính chống chói Gorilla Armor",
      "Vi xử lý (CPU)": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "RAM": "12 GB LPDDR5X",
      "Camera sau": "Chính 200MP OIS + 50MP Periscope 5x + 10MP Tele 3x + 12MP Ultra-wide",
      "Camera trước": "12MP Dual Pixel AF",
      "Pin & Công nghệ sạc": "5000 mAh, Sạc siêu nhanh 45W, Sạc không dây 15W",
      "Hệ điều hành": "Android 14, One UI 6.1 tích hợp Galaxy AI",
      "Trọng lượng": "232 g",
      "Bút S-Pen & Tiện ích": "Tích hợp bút S-Pen điều khiển từ xa, Kháng nước IP68, Wi-Fi 7"
},
    reviews: [
      {
        id: "r4",
        author: "Bảo Long",
        date: "21/10/2026",
        rating: 5,
        content: "Màn hình phẳng chống chói xuất sắc nhất hiện nay, ra ngoài trời nắng xem cực rõ. Bút S-Pen ký tài liệu rất tiện cho công việc.",
      },
    ],
  },
  {
    id: "p3",
    slug: "xiaomi-14t-pro",
    name: "Xiaomi 14T Pro 5G",
    fullName: "Xiaomi 14T Pro 5G 12GB 512GB Ống Kính Leica",
    brand: "xiaomi",
    brandLabel: "Xiaomi",
    category: "phones",
    categoryLabel: "Điện thoại",
    price: 16490000,
    originalPrice: 17990000,
    img: "src/assets/img/phone-xiaomi-14t.png",
    gallery: [
      "src/assets/img/phone-xiaomi-14t.png",
    ],
    rating: 4.8,
    reviewCount: 1,
    specsShort: "Dimensity 9300+ · Leica Summilux · Sạc 120W HyperCharge",
    gift: "Tặng tai nghe không dây Redmi Buds 5 Pro",
    badge: "TRẢ GÓP 0%",
    desc: "Ống kính quang học Leica Summilux đỉnh cao cùng cảm biến hình ảnh Light Fusion 900. Sức mạnh bùng nổ từ vi xử lý MediaTek Dimensity 9300+ và công nghệ sạc thần tốc 120W chỉ 19 phút đầy 100%.",
    colors: [
      { id: "black", name: "Đen Titan", hex: "#34383D" },
      { id: "grey", name: "Xám Titan", hex: "#7D8289" },
      { id: "blue", name: "Xanh Titan", hex: "#5C6A7B" },
    ],
    storageOptions: [
      { id: "256gb", label: "256 GB", priceDiff: 0 },
      { id: "512gb", label: "512 GB", priceDiff: 1500000 },
    ],
    specsDetailed: {
      "Màn hình": "6.67 inch, AMOLED 1.5K, 144Hz, 4000 nits đỉnh, Dolby Vision",
      "Vi xử lý (CPU)": "MediaTek Dimensity 9300+ (4nm)",
      "RAM": "12 GB LPDDR5X",
      "Ống kính Camera": "Leica Summilux: 50MP Chính + 50MP Tele 2.6x + 12MP Siêu rộng",
      "Camera trước": "32MP Góc rộng",
      "Pin & Sạc nhanh": "5000 mAh, Sạc có dây 120W HyperCharge (19 phút đầy 100%), Sạc không dây 50W",
      "Hệ điều hành": "Xiaomi HyperOS",
      "Kháng nước & Trọng lượng": "Kháng bụi nước chuẩn IP68, Trọng lượng 209 g"
},
    reviews: [
      {
        id: "r5",
        author: "Khánh Duy",
        date: "19/10/2026",
        rating: 5,
        content: "Sạc 120W dùng sướng không thể tả, cắm 15 phút rửa mặt xong là đầy pin. Nước ảnh Leica chụp chân dung có chiều sâu rất riêng.",
      },
    ],
  },
  {
    id: "p4",
    slug: "oppo-reno-12-5g",
    name: "OPPO Reno 12 5G",
    fullName: "OPPO Reno 12 5G 12GB 256GB Chuyên Gia Chân Dung AI",
    brand: "oppo",
    brandLabel: "OPPO",
    category: "phones",
    categoryLabel: "Điện thoại",
    price: 11490000,
    originalPrice: 12990000,
    img: "src/assets/img/phone-oppo-reno12.png",
    gallery: [
      "src/assets/img/phone-oppo-reno12.png",
    ],
    rating: 4.7,
    reviewCount: 1,
    specsShort: "Dimensity 7300-Energy · AI Portrait · Chống va đập 360°",
    gift: "Tặng loa Bluetooth Olike S4 thời trang",
    badge: "TRẢ GÓP 0%",
    desc: "Thiết kế dòng chảy bạc tương lai cực mỏng nhẹ. Hệ thống camera AI chân dung xóa phông tự nhiên và bộ công cụ AI xóa vật thể thông minh. Độ bền chuẩn quân đội chống va đập 360 độ.",
    colors: [
      { id: "silver", name: "Bạc Vũ Trụ", hex: "#D6D9E0" },
      { id: "brown", name: "Nâu Hoàng Hôn", hex: "#5E4A43" },
    ],
    storageOptions: [
      { id: "256gb", label: "256 GB", priceDiff: 0 },
      { id: "512gb", label: "512 GB", priceDiff: 1500000 },
    ],
    specsDetailed: {
      "Màn hình": "6.7 inch, 3D Curved AMOLED, 120Hz, FHD+, HDR10+",
      "Vi xử lý (CPU)": "MediaTek Dimensity 7300-Energy (4nm)",
      "RAM": "12 GB (+12GB RAM mở rộng ảo)",
      "Camera sau": "50MP Sony LYT-600 OIS + 8MP Góc rộng + 2MP Macro",
      "Camera trước": "32MP Tự động lấy nét",
      "Pin & Sạc nhanh": "5000 mAh, Sạc nhanh SuperVOOC 80W",
      "Hệ điều hành": "ColorOS 14.1 tích hợp bộ công cụ Chân dung AI",
      "Độ bền & Trọng lượng": "Độ bền chuẩn quân đội chống va đập 360°, Trọng lượng 177 g"
},
    reviews: [
      {
        id: "r6",
        author: "Mỹ Linh",
        date: "17/10/2026",
        rating: 5,
        content: "Máy nhẹ và mỏng bất ngờ, màu bạc ánh kim đổi màu dưới nắng đẹp mê. Tính năng AI xóa người lạ trong ảnh hoạt động rất mượt.",
      },
    ],
  },

  // 2. ECOSYSTEM PRODUCTS
  {
    id: "e1",
    slug: "macbook-air-13-m3",
    name: "MacBook Air 13 M3",
    fullName: "Apple MacBook Air 13 inch M3 16GB 256GB Chính Hãng",
    brand: "apple",
    brandLabel: "Apple",
    category: "laptops",
    categoryLabel: "Laptop",
    price: 24290000,
    originalPrice: 27990000,
    img: "src/assets/img/eco-macbook-air-m3.png",
    gallery: [
      "src/assets/img/eco-macbook-air-m3.png",
      "src/assets/img/banner-workspace.png",
    ],
    rating: 4.9,
    reviewCount: 1,
    specsShort: "Apple M3 8-core CPU · 16GB RAM · Mỏng 11.3mm",
    gift: "Tặng túi chống sốc Tomtoc cao cấp trị giá 450.000₫",
    badge: "ƯU ĐÃI SINH VIÊN",
    desc: "Chiếc laptop di động hoàn hảo với chip Apple M3 mạnh mẽ, hỗ trợ xuất cùng lúc 2 màn hình ngoài. Thiết kế nhôm nguyên khối siêu mỏng 11.3mm, bàn phím Magic Keyboard êm ái và pin bền bỉ suốt 18 tiếng liên tục.",
    colors: [
      { id: "midnight", name: "Midnight (Xanh đen)", hex: "#2E3642" },
      { id: "starlight", name: "Starlight (Vàng nhạt)", hex: "#E8E2D5" },
      { id: "spacegrey", name: "Space Grey (Xám)", hex: "#7D7E80" },
      { id: "silver", name: "Silver (Bạc)", hex: "#E3E4E5" },
    ],
    storageOptions: [
      { id: "256gb", label: "16GB / 256GB", priceDiff: 0 },
      { id: "512gb", label: "16GB / 512GB", priceDiff: 4500000 },
    ],
    specsDetailed: {
      "Màn hình": "13.6 inch, Liquid Retina, 2560 x 1664, 500 nits, Dải màu P3, True Tone",
      "Vi xử lý (CPU)": "Apple M3 (8 nhân CPU, tối đa 10 nhân GPU, 16 nhân Neural Engine)",
      "RAM": "16 GB Unified Memory (Bộ nhớ hợp nhất)",
      "Ổ cứng lưu trữ": "256 GB SSD tốc độ cao",
      "Cổng kết nối": "Cổng sạc MagSafe 3, 2 cổng Thunderbolt / USB 4, Jack tai nghe 3.5mm",
      "Thời lượng pin": "52.6 Wh, Thời lượng pin lên tới 18 giờ liên tục",
      "Trọng lượng": "1.24 kg (Mỏng chỉ 11.3 mm)",
      "Hệ điều hành": "macOS Sequoia"
},
    reviews: [
      {
        id: "r7",
        author: "Văn Đức",
        date: "22/10/2026",
        rating: 5,
        content: "Bản 16GB RAM đa nhiệm thoải mái hơn bản 8GB rất nhiều, mở 30 tab Chrome và Photoshop không hề giật lag. Pin trâu làm việc cả ngày không cần đem theo cục sạc.",
      },
    ],
  },
  {
    id: "e2",
    slug: "ipad-air-m2-11",
    name: "iPad Air M2 11 inch",
    fullName: "Apple iPad Air 11 inch M2 Wi-Fi 128GB Chính Hãng",
    brand: "apple",
    brandLabel: "Apple",
    category: "tablets",
    categoryLabel: "Máy tính bảng",
    price: 15490000,
    originalPrice: 16990000,
    img: "src/assets/img/eco-ipad-air-m2.png",
    gallery: [
      "src/assets/img/eco-ipad-air-m2.png",
    ],
    rating: 4.8,
    reviewCount: 1,
    specsShort: "Apple M2 · Liquid Retina · Hỗ trợ Apple Pencil Pro",
    gift: "Giảm 500.000₫ khi mua kèm bút Apple Pencil Pro",
    badge: "MỚI RA MẮT",
    desc: "iPad Air nay được tiếp sức mạnh bởi chip Apple M2 với hiệu năng CPU nhanh hơn 17% và GPU nhanh hơn 25%. Màn hình Liquid Retina sắc nét với camera trước chuyển sang cạnh ngang tối ưu cho các cuộc gọi video.",
    colors: [
      { id: "spacegrey", name: "Xám Không Gian", hex: "#68696E" },
      { id: "blue", name: "Xanh Dương", hex: "#B9C7D4" },
      { id: "purple", name: "Tím Nhạt", hex: "#D1CDDA" },
      { id: "starlight", name: "Vàng Ánh Sao", hex: "#E9E3D6" },
    ],
    storageOptions: [
      { id: "128gb", label: "128 GB", priceDiff: 0 },
      { id: "256gb", label: "256 GB", priceDiff: 2500000 },
      { id: "512gb", label: "512 GB", priceDiff: 7500000 },
    ],
    specsDetailed: {
      "Màn hình": "11 inch, Liquid Retina IPS, 2360 x 1640, 500 nits, True Tone, Chống chói",
      "Vi xử lý (CPU)": "Apple M2 (8 nhân CPU, 10 nhân GPU, 16 nhân Neural Engine)",
      "RAM": "8 GB RAM",
      "Camera": "Sau 12MP Wide 4K + Trước 12MP Ultra-wide góc ngang với Center Stage",
      "Thời lượng pin": "Lướt web và xem video lên tới 10 giờ qua Wi-Fi",
      "Phụ kiện tương thích": "Hỗ trợ Apple Pencil Pro, Apple Pencil USB-C, Magic Keyboard",
      "Trọng lượng": "462 g",
      "Hệ điều hành": "iPadOS 18"
},
    reviews: [
      {
        id: "r8",
        author: "Thùy Trang",
        date: "16/10/2026",
        rating: 5,
        content: "Ghi chép và vẽ vời với Apple Pencil Pro có phản hồi rung quá thật! Màn hình vừa vặn bỏ balo gọn gàng.",
      },
    ],
  },
  {
    id: "e3",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    fullName: "Tai Nghe Chống Ồn Không Dây Sony WH-1000XM5",
    brand: "sony",
    brandLabel: "Sony",
    category: "audio",
    categoryLabel: "Âm thanh",
    price: 6790000,
    originalPrice: 8490000,
    img: "src/assets/img/eco-sony-wh1000xm5.png",
    gallery: [
      "src/assets/img/eco-sony-wh1000xm5.png",
      "src/assets/img/banner-workspace.png",
    ],
    rating: 4.9,
    reviewCount: 1,
    specsShort: "Bộ xử lý kép V1 & QN1 · 30 giờ pin · Âm thanh Hi-Res",
    gift: "Tặng bao da bảo vệ chuyên dụng chính hãng Sony",
    badge: "CHỐNG ỒN SỐ 1",
    desc: "Tai nghe over-ear chống ồn hàng đầu thế giới với 2 bộ xử lý và 8 micro chuyên dụng. Đệm tai da tổng hợp mềm mại ôm trọn vành tai, công nghệ Speak-to-Chat tự động dừng nhạc khi bạn trò chuyện.",
    colors: [
      { id: "silver", name: "Bạc Ánh Bạch Kim", hex: "#E2DEC9" },
      { id: "black", name: "Đen Nhám", hex: "#222326" },
      { id: "blue", name: "Xanh Midnight", hex: "#1D2B44" },
    ],
    storageOptions: [
      { id: "standard", label: "Tiêu chuẩn", priceDiff: 0 },
    ],
    specsDetailed: {
      "Thời lượng pin": "Lên tới 30 giờ (bật chống ồn), 40 giờ (tắt chống ồn), Sạc nhanh 3 phút dùng 3 giờ",
      "Công nghệ chống ồn": "Chống ồn chủ động đỉnh cao với 2 vi xử lý V1 + QN1 và 8 micro định dạng",
      "Màng loa (Driver)": "30mm thiết kế sợi carbon chính xác, hỗ trợ âm thanh Hi-Res Audio & LDAC",
      "Chuẩn kết nối": "Bluetooth 5.2, Kết nối đa điểm 2 thiết bị cùng lúc, Jack 3.5mm",
      "Tính năng thông minh": "Speak-to-Chat tự động dừng nhạc khi bạn cất lời, Đeo vừa vặn êm ái",
      "Trọng lượng": "250 g"
},
    reviews: [
      {
        id: "r9",
        author: "Trần Quân",
        date: "20/10/2026",
        rating: 5,
        content: "Đeo êm như không đeo, cách âm tiếng ồn quán cafe và máy bay gần như 100%. Chất âm ấm áp chi tiết, nghe vocal cực đã.",
      },
    ],
  },
  {
    id: "e4",
    slug: "apple-watch-series-10",
    name: "Apple Watch Series 10",
    fullName: "Apple Watch Series 10 Nhôm GPS 46mm Chính Hãng",
    brand: "apple",
    brandLabel: "Apple",
    category: "watches",
    categoryLabel: "Đồng hồ",
    price: 9420000,
    originalPrice: 10990000,
    img: "src/assets/img/eco-apple-watch-10.png",
    gallery: [
      "src/assets/img/eco-apple-watch-10.png",
    ],
    rating: 4.8,
    reviewCount: 1,
    specsShort: "Màn hình OLED góc rộng lớn nhất · Mỏng 9.7mm · Đo ECG",
    gift: "Tặng thêm 01 dây đeo thể thao Silicon thể thao trị giá 350.000₫",
    badge: "MỎNG NHẤT LỊCH SỬ",
    desc: "Đồng hồ mỏng nhất và diện tích hiển thị lớn nhất từng có trên Apple Watch. Màn hình OLED góc nhìn rộng sáng hơn 40%, phát hiện ngưng thở khi ngủ và sạc nhanh lên tới 80% chỉ trong 30 phút.",
    colors: [
      { id: "jetblack", name: "Đen Bóng (Jet Black)", hex: "#0E0E0E" },
      { id: "rosegold", name: "Vàng Hồng", hex: "#E7C5B5" },
      { id: "silver", name: "Bạc", hex: "#E3E4E5" },
    ],
    storageOptions: [
      { id: "46mm", label: "Kích thước 46 mm", priceDiff: 0 },
      { id: "42mm", label: "Kích thước 42 mm", priceDiff: -700000 },
    ],
    specsDetailed: {
      "Kích thước màn hình": "Màn hình OLED góc nhìn rộng luôn bật (Always-On), sáng hơn tới 40% ở góc nghiêng",
      "Thời lượng pin": "Dùng thông thường 18 giờ, Chế độ nguồn điện thấp 36 giờ, Sạc nhanh 80% trong 30 phút",
      "Cảm biến sức khỏe": "Cảnh báo ngưng thở khi ngủ, Đo điện tâm đồ ECG, Đo oxy trong máu SpO2, Đo nhiệt độ nước",
      "Kháng nước & Độ bền": "Kháng nước độ sâu 50m (Bơi lội & Lặn thể thao), Cảm biến đo độ sâu và nhiệt độ nước",
      "Chất liệu & Độ mỏng": "Thiết kế nhôm mỏng nhất từ trước tới nay chỉ 9.7 mm",
      "Trọng lượng": "30 g (Bản nhôm 42mm)"
},
    reviews: [
      {
        id: "r10",
        author: "Phương Nam",
        date: "23/10/2026",
        rating: 5,
        content: "Bản Jet Black nhôm bóng bẩy nhìn không khác gì bản thép đắt tiền. Màn hình to nhìn chữ rõ ràng hơn hẳn con Series 7 cũ của mình.",
      },
    ],
  },
];
const DEFAULT_VOUCHERS = [
  { code: 'NETNEW', discountType: 'fixed', value: 200000, desc: 'Giảm 200.000₫ cho khách hàng mới', minOrder: 1000000 },
  { code: 'FREESHIP', discountType: 'shipping', value: 30000, desc: 'Miễn phí vận chuyển toàn quốc', minOrder: 500000 },
  { code: 'NET100', discountType: 'fixed', value: 100000, desc: 'Giảm 100.000₫ cho đơn từ 2.000.000₫', minOrder: 2000000 },
  { code: 'NETVIP', discountType: 'percent', value: 5, maxDiscount: 1000000, desc: 'Giảm 5% tối đa 1.000.000₫ cho hội viên', minOrder: 5000000 },
];
const DEFAULT_CATEGORIES = [
  { slug: "phones", name: "Điện thoại", count: "128 sản phẩm", icon: "smartphone", link: "#/category/phones" },
  { slug: "laptops", name: "Laptop", count: "86 sản phẩm", icon: "laptop", link: "#/category/laptops" },
  { slug: "tablets", name: "Máy tính bảng", count: "45 sản phẩm", icon: "tablet", link: "#/category/tablets" },
  { slug: "audio", name: "Âm thanh", count: "112 sản phẩm", icon: "headphones", link: "#/category/audio" },
  { slug: "watches", name: "Đồng hồ", count: "64 sản phẩm", icon: "watch", link: "#/category/watches" },
  { slug: "accessories", name: "Phụ kiện", count: "320 sản phẩm", icon: "cable", link: "#/category/accessories" },
];

// Available image gallery for admin quick selection
const PRESET_IMAGES = [
  { label: "iPhone 16 Pro", path: "src/assets/img/phone-iphone-16-pro.png" },
  { label: "Samsung S24 Ultra", path: "src/assets/img/phone-samsung-s24.png" },
  { label: "Oppo Reno 12 Pro", path: "src/assets/img/phone-oppo-reno12.png" },
  { label: "Xiaomi 14T Pro", path: "src/assets/img/phone-xiaomi-14t.png" },
  { label: "MacBook Air M3", path: "src/assets/img/eco-macbook-air-m3.png" },
  { label: "iPad Air M2", path: "src/assets/img/eco-ipad-air-m2.png" },
  { label: "Apple Watch Series 10", path: "src/assets/img/eco-apple-watch-10.png" },
  { label: "Sony WH-1000XM5", path: "src/assets/img/eco-sony-wh1000xm5.png" },
  { label: "Banner Phụ Kiện", path: "src/assets/img/banner-accessories.png" },
  { label: "Banner Góc làm việc", path: "src/assets/img/banner-workspace.png" },
  { label: "Banner Thu cũ đổi mới", path: "src/assets/img/banner-trade-in.png" },
];

// Utility: Storage & Formatters
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

function formatVND(amount) {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

function formatDate(isoStr) {
  if (!isoStr) return '--';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  } catch {
    return isoStr;
  }
}

// SVG Icon Component
function Icon({ name, className = "w-5 h-5", size = 20 }) {
  const icons = {
    "layout-dashboard": (
      <path d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z" />
    ),
    "shopping-bag": (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    "package": (
      <>
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
    "tag": (
      <>
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </>
    ),
    "message-square": (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    "search": (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    "plus": (
      <path d="M5 12h14m-7-7v14" />
    ),
    "external-link": (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
    "check-circle": (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    "clock": (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    "truck": (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </>
    ),
    "x-circle": (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    "trash-2": (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
    "edit": (
      <>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </>
    ),
    "refresh-cw": (
      <>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </>
    ),
    "printer": (
      <>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
      </>
    ),
    "x": (
      <path d="M18 6 6 18M6 6l12 12" />
    ),
    "trending-up": (
      <>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </>
    ),
    "dollar-sign": (
      <>
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    "star": (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
    ),
    "upload": (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    )
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}

// Status Badge Component
function OrderStatusBadge({ status }) {
  const configs = {
    "Chờ thanh toán QR": {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: "clock",
    },
    "Đang xử lý": {
      bg: "bg-blue-50 text-[#0275A9] border-blue-200",
      icon: "refresh-cw",
    },
    "Đang giao": {
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      icon: "truck",
    },
    "Đã giao": {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "check-circle",
    },
    "Đã hoàn thành": {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "check-circle",
    },
    "Đã hủy": {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: "x-circle",
    },
  };

  const conf = configs[status] || { bg: "bg-gray-100 text-gray-700 border-gray-200", icon: "clock" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.bg}`}>
      <Icon name={conf.icon} className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

// =========================================================================
// PRODUCT FORM MODAL COMPONENT (2-COLUMN MODERN DASHBOARD FORM)
// =========================================================================
// =========================================================================
// RICH TEXT EDITOR COMPONENT (Quill.js 2.0 WYSIWYG)
// =========================================================================
// =========================================================================
// RICH TEXT EDITOR COMPONENT (Quill.js 2.0 WYSIWYG + Live Preview + Fullscreen)
// =========================================================================
// =========================================================================
// RICH TEXT EDITOR COMPONENT (Quill.js 2.0 WYSIWYG + Live Preview + Fullscreen)
// =========================================================================
function RichTextEditor({ initialValue = "", onChange, editorId = "product-quill-editor" }) {
  const editorDivRef = React.useRef(null);
  const quillRef = React.useRef(null);
  const [activeMode, setActiveMode] = React.useState("edit"); // "edit" | "preview"
  const [content, setContent] = React.useState(initialValue || "");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (editorDivRef.current && window.Quill && !quillRef.current) {
      try {
        const quill = new window.Quill(editorDivRef.current, {
          theme: "snow",
          placeholder: "Soạn thảo bài viết đánh giá, cấu hình, thông số chi tiết (hỗ trợ tiêu đề H1/H2, bảng biểu, in đậm/nghiêng, chèn ảnh, video, danh sách)...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "code-block"],
              [{ align: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
          },
        });

        if (initialValue) {
          quill.clipboard.dangerouslyPasteHTML(initialValue);
        }

        quill.on("text-change", () => {
          if (!isMounted) return;
          const html = quill.root.innerHTML;
          setContent(html);
          if (onChange) onChange(html);
        });

        quillRef.current = quill;
      } catch (err) {
        console.warn("[Quill Init Error]", err);
      }
    }

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, []);

  // Update content if initialValue changes externally
  React.useEffect(() => {
    if (quillRef.current && initialValue && quillRef.current.root.innerHTML !== initialValue) {
      quillRef.current.clipboard.dangerouslyPasteHTML(initialValue);
      setContent(initialValue);
    }
  }, [initialValue]);

  return (
    <div className={`space-y-3 ${isFullscreen ? "fixed inset-0 z-[100] bg-white p-6 overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150" : ""}`}>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] border border-[#CBD5E1] p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode("edit")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === "edit" ? "bg-[#0275A9] text-white shadow-2xs" : "bg-white text-[#707783] hover:text-[#141923] border border-[#E5E8EC]"
            }`}
          >
            <Icon name="file-text" className="w-3.5 h-3.5" />
            <span>Soạn thảo bài viết</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("preview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === "preview" ? "bg-[#0275A9] text-white shadow-2xs" : "bg-white text-[#707783] hover:text-[#141923] border border-[#E5E8EC]"
            }`}
          >
            <Icon name="eye" className="w-3.5 h-3.5" />
            <span>Xem trước giao diện khách hàng (Live Preview)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#707783] hidden sm:inline">Trình soạn thảo chuẩn Word (Quill WYSIWYG)</span>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0275A9] text-[#141923] font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <Icon name={isFullscreen ? "minimize-2" : "maximize-2"} className="w-3.5 h-3.5" />
            <span>{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeMode === "edit" ? (
        <div className="border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs bg-white">
          <div ref={editorDivRef} style={{ minHeight: "380px" }} />
        </div>
      ) : (
        <div className="p-6 bg-white border border-[#CBD5E1] rounded-xl shadow-2xs min-h-[420px] max-h-[700px] overflow-y-auto">
          <div className="text-xs font-bold text-[#0275A9] mb-4 pb-2 border-b border-[#E5E8EC] flex items-center gap-2">
            <Icon name="check-circle" className="w-4 h-4 text-emerald-600" />
            <span>Xem trước bài viết thực tế sẽ xuất hiện trên trang chi tiết sản phẩm:</span>
          </div>
          <div
            className="product-rich-desc text-[#141923] text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: content || "<p class='text-[#707783] italic'>Chưa có nội dung mô tả nào. Hãy bấm sang tab Soạn thảo để viết bài.</p>",
            }}
          />
        </div>
      )}
    </div>
  );
}

// =========================================================================
// MODAL: PRODUCT ADD / EDIT (3-Tab Widescreen Layout)
// =========================================================================
function ProductFormModal({ product, onClose, onSave, categories, presetImages }) {
  const isEditing = Boolean(product && product.id);

  // 1. Basic Commercial Information & Pricing
  const [name, setName] = useState(product?.name || "");
  const [fullName, setFullName] = useState(product?.fullName || product?.tenDayDu || product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "apple");
  const [category, setCategory] = useState(product?.category || "phones");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 0);
  const [price, setPrice] = useState(product?.price || 0);
  const [discountAmount, setDiscountAmount] = useState(() => {
    if (product?.discountAmount !== undefined) return product.discountAmount;
    if (product?.originalPrice && product?.price && product.originalPrice > product.price) {
      return product.originalPrice - product.price;
    }
    return 0;
  });
  const [isInstallment, setIsInstallment] = useState(() => {
    if (product?.isInstallment !== undefined) return Boolean(product.isInstallment);
    if (product?.category === "accessories" || (product?.price && product.price < 1000000)) return false;
    return true;
  });
  const [stock, setStock] = useState(product?.stock ?? 50);
  const [status, setStatus] = useState(product?.status || "active");
  const [badge, setBadge] = useState(product?.badge || "");
  const [gift, setGift] = useState(product?.gift || "");
  const [specsShort, setSpecsShort] = useState(product?.specsShort || product?.thongSoNgan || "");
  // Two-way Dynamic Pricing Calculation
  const handleOriginalPriceChange = (val) => {
    const orig = Number(val) || 0;
    setOriginalPrice(orig);
    const disc = Number(discountAmount) || 0;
    if (disc > 0 && orig >= disc) {
      setPrice(orig - disc);
    } else {
      setPrice(orig);
      setDiscountAmount(0);
    }
  };

  const handleDiscountAmountChange = (val) => {
    const disc = Math.max(0, Number(val) || 0);
    setDiscountAmount(disc);
    const orig = Number(originalPrice) || 0;
    setPrice(Math.max(0, orig - disc));
  };

  const handlePriceChange = (val) => {
    const p = Math.max(0, Number(val) || 0);
    setPrice(p);
    const orig = Number(originalPrice) || 0;
    if (orig > p) {
      setDiscountAmount(orig - p);
    } else {
      setDiscountAmount(0);
    }
  };

  const applyQuickPercentDiscount = (percent) => {
    const orig = Number(originalPrice) || 0;
    if (orig <= 0) return;
    const disc = Math.round((orig * percent) / 100);
    setDiscountAmount(disc);
    setPrice(orig - disc);
  };

  // 2. Images & Gallery
  const [gallery, setGallery] = useState(() => {
    if (product?.gallery && product.gallery.length > 0) return product.gallery;
    if (product?.img) return [product.img];
    return [presetImages[0]?.path || "src/assets/img/phone-iphone-16-pro.png"];
  });
  const [img, setImg] = useState(() => {
    if (product?.img) return product.img;
    return gallery[0] || presetImages[0]?.path || "src/assets/img/phone-iphone-16-pro.png";
  });
  const [customUrl, setCustomUrl] = useState("");

  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const validFiles = files.filter((f) => f.size <= 2 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("Một số hình ảnh vượt quá 2MB đã được bỏ qua để tối ưu dung lượng bộ nhớ.");
    }
    const readers = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((results) => {
      const successful = results.filter(Boolean);
      if (successful.length > 0) {
        setGallery((prev) => {
          const merged = [...prev, ...successful];
          if (!img || prev.length === 0) setImg(successful[0]);
          return merged;
        });
      }
    });
  };

  const handleAddPreset = (path) => {
    if (!gallery.includes(path)) {
      setGallery((prev) => [...prev, path]);
      if (!img) setImg(path);
    } else {
      setImg(path);
    }
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    if (!gallery.includes(trimmed)) {
      setGallery((prev) => [...prev, trimmed]);
      if (!img) setImg(trimmed);
      setCustomUrl("");
    }
  };

  const handleRemoveImage = (idxToRemove) => {
    if (gallery.length <= 1) {
      alert("Sản phẩm cần có ít nhất 1 hình ảnh đại diện.");
      return;
    }
    const targetUrl = gallery[idxToRemove];
    const updated = gallery.filter((_, idx) => idx !== idxToRemove);
    if (targetUrl === img) setImg(updated[0]);
    setGallery(updated);
  };

  // 3. Hệ thống Phân loại hàng Đa nhóm (Không giới hạn số nhóm, các nhóm có chức năng giống hệt nhau: Ảnh + Chữ)
  const [hasVariants, setHasVariants] = useState(() => {
    return Boolean(
      (product?.variantGroups && product.variantGroups.length > 0) ||
      (product?.variants && product.variants.length > 0) ||
      (product?.colors && product.colors.length > 0)
    );
  });

  const [variantGroups, setVariantGroups] = useState(() => {
    const baseImg = product?.img || (product?.gallery?.[0] || "");
    if (product?.variantGroups && product.variantGroups.length > 0) {
      return product.variantGroups.map((g, i) => ({
        id: g.id || ("grp_" + (i + 1)),
        name: g.name || ("Nhóm " + (i + 1)),
        options: (g.options && g.options.length > 0)
          ? g.options.map((o, j) => ({
              id: o.id || ("opt_" + (i + 1) + "_" + (j + 1)),
              name: o.name || ("Lựa chọn " + (j + 1)),
              img: o.img || "",
              priceDiff: o.priceDiff !== undefined ? Number(o.priceDiff) : 0,
            }))
          : [{ id: "opt_" + (i + 1) + "_1", name: "Lựa chọn 1", img: i === 0 ? baseImg : "", priceDiff: 0 }],
      }));
    }
    if (product?.colors && product.colors.length > 0) {
      const g1 = {
        id: "grp_1",
        name: product?.variantGroupName || product?.variantGroup1Name || "Màu sắc",
        options: product.colors.map((c, i) => ({
          id: c.id || ("opt_1_" + i),
          name: c.name || ("Lựa chọn " + (i + 1)),
          img: c.img || product?.gallery?.[i] || baseImg,
        })),
      };
      const result = [g1];
      if (product?.storageOptions && product.storageOptions.length > 1) {
        result.push({
          id: "grp_2",
          name: product?.variantGroup2Name || "Phiên bản / Quy cách",
          options: product.storageOptions.map((s, i) => ({
            id: s.id || ("opt_2_" + i),
            name: s.label || s.name || ("Bản " + (i + 1)),
            img: "",
            priceDiff: s.priceDiff !== undefined ? Number(s.priceDiff) : 0,
          })),
        });
      }
      return result;
    }
    return [
      {
        id: "grp_1",
        name: "Màu sắc",
        options: [{ id: "opt_1_1", name: "Lựa chọn 1", img: baseImg }],
      },
    ];
  });

  const [combinationPrices, setCombinationPrices] = useState(() => {
    const prices = {};
    if (product?.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        const key = v.name || (v.options ? v.options.join(" · ") : v.group1);
        if (v.price !== undefined) {
          prices[key] = Number(v.price);
        }
      });
    }
    return prices;
  });

  const [batchPriceInput, setBatchPriceInput] = useState("");

  const handleAddGroup = () => {
    const nextIdx = variantGroups.length + 1;
    setVariantGroups((prev) => [
      ...prev,
      {
        id: "grp_" + Date.now(),
        name: "Nhóm " + nextIdx,
        options: [
          { id: "opt_" + Date.now() + "_1", name: "Lựa chọn 1", img: "" },
        ],
      },
    ]);
  };

  const handleRemoveGroup = (grpIdx) => {
    if (variantGroups.length <= 1) {
      alert("Cần giữ lại ít nhất 1 nhóm phân loại!");
      return;
    }
    setVariantGroups((prev) => prev.filter((_, i) => i !== grpIdx));
  };

  const handleUpdateGroupName = (grpIdx, newName) => {
    setVariantGroups((prev) =>
      prev.map((g, i) => (i === grpIdx ? { ...g, name: newName } : g))
    );
  };

  const handleAddOption = (grpIdx) => {
    setVariantGroups((prev) =>
      prev.map((g, i) => {
        if (i !== grpIdx) return g;
        const nextOptIdx = g.options.length + 1;
        const defaultImg = (gallery && gallery.length > 0)
          ? gallery[g.options.length % gallery.length]
          : "";
        return {
          ...g,
          options: [
            ...g.options,
            { id: "opt_" + Date.now(), name: "Lựa chọn " + nextOptIdx, img: defaultImg },
          ],
        };
      })
    );
  };

  const handleRemoveOption = (grpIdx, optIdx) => {
    setVariantGroups((prev) =>
      prev.map((g, i) => {
        if (i !== grpIdx) return g;
        if (g.options.length <= 1) {
          alert("Mỗi nhóm cần tối thiểu 1 lựa chọn!");
          return g;
        }
        return {
          ...g,
          options: g.options.filter((_, j) => j !== optIdx),
        };
      })
    );
  };

  const handleUpdateOption = (grpIdx, optIdx, field, val) => {
    setVariantGroups((prev) =>
      prev.map((g, i) => {
        if (i !== grpIdx) return g;
        return {
          ...g,
          options: g.options.map((o, j) => (j === optIdx ? { ...o, [field]: val } : o)),
        };
      })
    );
  };

  const handleApplyBatchPrice = (combosList) => {
    const p = Math.max(0, Number(batchPriceInput) || 0);
    if (!p) {
      alert("Vui lòng nhập giá hợp lệ để áp dụng!");
      return;
    }
    const updated = { ...combinationPrices };
    combosList.forEach((c) => {
      updated[c.key] = p;
    });
    setCombinationPrices(updated);
    setBatchPriceInput("");
  };

  const handleUpdateCombinationPrice = (key, val) => {
    const p = Math.max(0, Number(val) || 0);
    setCombinationPrices((prev) => ({ ...prev, [key]: p }));
  };

  // 4. Rich Description (Includes All Technical Specs & Highlights in Word format)
  const [desc, setDesc] = useState(product?.desc || "");

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }

    const primaryImg = img || gallery[0] || "src/assets/img/phone-iphone-16-pro.png";
    const finalGallery = gallery.length > 0 ? gallery : [primaryImg];

    // Xây dựng danh sách tổ hợp biến thể và nhóm phân loại (hỗ trợ N nhóm)
    const currentBasePrice = Number(price) || 0;
    let finalCombinations = [];
    const finalVariantGroups = [];

    if (hasVariants) {
      variantGroups.forEach((g) => {
        const validOptions = (g.options || []).filter((o) => o.name && o.name.trim());
        if (validOptions.length > 0) {
          finalVariantGroups.push({
            id: g.id || ("grp_" + Date.now()),
            name: (g.name || "").trim() || "Phân loại",
            options: validOptions,
          });
        }
      });

      if (finalVariantGroups.length > 0) {
        const groupOptions = finalVariantGroups.map((g) => g.options);
        const cartesianCombos = groupOptions.reduce(
          (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
          [[]]
        );

        finalCombinations = cartesianCombos.map((combo, idx) => {
          const names = combo.map((item) => item.name);
          const key = names.join(" · ");
          const comboImg = combo.find((item) => item.img)?.img || primaryImg;
          let combPrice = combinationPrices[key];
          if (combPrice === undefined) {
            const foundV = product?.variants?.find((v) => v.name === key || (v.options && v.options.join(" · ") === key));
            if (foundV && foundV.price !== undefined) {
              combPrice = Number(foundV.price);
            } else {
              const diffSum = combo.reduce((sum, item) => sum + (Number(item.priceDiff) || 0), 0);
              combPrice = currentBasePrice + diffSum;
            }
          }

          return {
            id: "comb_" + idx + "_" + combo.map((item) => item.id || "").join("_"),
            key,
            name: key,
            options: names,
            group1: names[0] || "",
            group2: names[1] || "",
            img: comboImg,
            price: combPrice,
            priceDiff: combPrice - currentBasePrice,
          };
        });
      }
    }

    onSave({
      ...product,
      name: name.trim(),
      fullName: (fullName.trim() || name.trim()),
      ten: name.trim(),
      tenDayDu: (fullName.trim() || name.trim()),
      brand,
      category,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      discountAmount: Number(discountAmount) || 0,
      isInstallment: isInstallment ? 1 : 0,
      img: primaryImg,
      gallery: finalGallery,
      stock: Number(stock) || 0,
      status,
      badge: badge.trim(),
      gift: gift.trim(),
      specsShort: specsShort.trim(),
      variants: hasVariants ? finalCombinations : [],
      variantGroups: hasVariants ? finalVariantGroups : [],
      colors: hasVariants && finalVariantGroups[0] ? finalVariantGroups[0].options.map((o) => ({ id: o.id, name: o.name, img: o.img })) : [],
      storageOptions: hasVariants && finalVariantGroups[1] ? finalVariantGroups[1].options.map((o) => ({ id: o.id, label: o.name, priceDiff: 0 })) : [],
      variantGroupName: hasVariants && finalVariantGroups[0] ? finalVariantGroups[0].name : "",
      variantGroup2Name: hasVariants && finalVariantGroups[1] ? finalVariantGroups[1].name : "",
      specsDetailed: product?.specsDetailed || {},
      thongSoKyThuat: product?.thongSoKyThuat || {},
      desc: desc.trim(),
    });
  };

  const numPrice = Number(price) || 0;
  const numOrig = Number(originalPrice) || 0;
  const numDisc = Number(discountAmount) || 0;
  const discountPercent = numOrig > numPrice && numOrig > 0 ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 border border-[#E5E8EC]">
        
        {/* Header (Cohesive Single-Page Form) */}
        <div className="p-5 border-b border-[#E5E8EC] flex items-center justify-between bg-white rounded-t-2xl">
          <div>
            <h3 className="font-extrabold text-base text-[#141923] flex items-center gap-2">
              <Icon name="package" className="w-5 h-5 text-[#0275A9]" />
              <span>{isEditing ? `Chỉnh sửa: ${product.name}` : "Thêm sản phẩm mới"}</span>
            </h3>
            <p className="text-xs text-[#707783] mt-0.5">
              Form quản lý sản phẩm nhất quán trên 1 trang duy nhất: Thông tin, Giá bán, Biến thể và Bài viết mô tả.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#707783] hover:text-[#141923] hover:bg-[#F5F6F8] rounded-xl transition cursor-pointer"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body: Single-Page Scrollable Layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* =========================================================================
              PHẦN 1: THÔNG TIN CƠ BẢN, GIÁ BÁN & CHÍNH SÁCH
              ========================================================================= */}
          <div className="bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-[#E5E8EC] pb-3">
              <span className="w-6 h-6 rounded-lg bg-[#0275A9] text-white flex items-center justify-center text-xs font-black">1</span>
              <h4 className="font-extrabold text-sm text-[#141923]">Thông tin cơ bản & Giá bán thương mại</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cột Trái: Tên, Hãng, Danh mục, Badge */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                    Tên sản phẩm (Ngắn gọn) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: iPhone 16 Pro"
                    className="w-full px-4 py-2.5 text-xs font-bold border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                    Tên hiển thị đầy đủ trang chi tiết (Full Name)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Apple iPhone 16 Pro Chính Hãng VN/A"
                    className="w-full px-4 py-2.5 text-xs font-bold border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                  <p className="text-[11px] text-[#707783] mt-1">Đồng bộ với tiêu đề trang chi tiết sản phẩm (PDP).</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                      Thương hiệu *
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-bold border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                    >
                      <option value="apple">Apple</option>
                      <option value="samsung">Samsung</option>
                      <option value="xiaomi">Xiaomi</option>
                      <option value="oppo">OPPO</option>
                      <option value="sony">Sony</option>
                      <option value="marshall">Marshall</option>
                      <option value="anker">Anker</option>
                      <option value="other">Thương hiệu khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                      Danh mục *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-bold border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                    >
                      <option value="phones">📱 Điện thoại</option>
                      <option value="laptops">💻 Laptop</option>
                      <option value="tablets">📱 Máy tính bảng</option>
                      <option value="audio">🎧 Âm thanh / Tai nghe</option>
                      <option value="watches">⌚ Đồng hồ thông minh</option>
                      <option value="accessories">🔌 Phụ kiện công nghệ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                    Huy hiệu sản phẩm (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="VD: TRẢ GÓP 0%, HOT DEAL, BÁN CHẠY, MỚI RA MẮT..."
                    className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {["TRẢ GÓP 0%", "HOT DEAL", "BÁN CHẠY", "MỚI RA MẮT"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBadge(b)}
                        className="px-2 py-0.5 bg-white border border-[#CBD5E1] hover:border-[#0275A9] hover:text-[#0275A9] rounded text-[10px] font-semibold text-[#707783] transition cursor-pointer"
                      >
                        +{b}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setBadge("")}
                      className="px-2 py-0.5 bg-white border border-rose-200 text-rose-600 rounded text-[10px] font-semibold hover:bg-rose-50 transition cursor-pointer"
                    >
                      Xóa badge
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                    Quà tặng kèm theo (Gift)
                  </label>
                  <input
                    type="text"
                    value={gift}
                    onChange={(e) => setGift(e.target.value)}
                    placeholder="Ví dụ: Tặng gói bảo hành VIP 12 tháng, hoặc Tặng củ sạc 45W..."
                    className="w-full px-4 py-2.5 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#141923] font-bold text-xs uppercase tracking-wider mb-1.5">
                    Thông số tóm tắt ngắn (Specs Short)
                  </label>
                  <input
                    type="text"
                    value={specsShort}
                    onChange={(e) => setSpecsShort(e.target.value)}
                    placeholder="Ví dụ: Apple A18 Pro · Super Retina XDR 120Hz · Fusion 48MP"
                    className="w-full px-4 py-2.5 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Cột Phải: Giá niêm yết, Mức giảm trực tiếp, Giá bán, Trả góp, Tồn kho */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#E5E8EC] space-y-3 shadow-2xs">
                  <div className="text-xs font-extrabold text-[#141923] uppercase tracking-wider border-b border-[#E5E8EC] pb-2 flex items-center justify-between">
                    <span>Tính toán giá niêm yết & Giảm giá trực tiếp</span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold text-[10px]">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#707783] font-bold text-[11px] uppercase mb-1">
                        Giá niêm yết gốc (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={originalPrice}
                        onChange={(e) => handleOriginalPriceChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white text-[#707783]"
                      />
                      <div className="text-[11px] text-[#707783] line-through mt-0.5 truncate">
                        = {formatVND(numOrig)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#707783] font-bold text-[11px] uppercase mb-1">
                        Giảm trực tiếp (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={discountAmount}
                        onChange={(e) => handleDiscountAmountChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold border border-rose-300 rounded-xl focus:border-rose-600 focus:outline-none bg-rose-50/30 text-rose-700"
                      />
                      <div className="text-[11px] text-rose-600 font-bold mt-0.5 truncate">
                        - {formatVND(numDisc)}
                      </div>
                    </div>
                  </div>

                  {/* Nút % Giảm nhanh */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-[#707783] font-medium">Giảm nhanh:</span>
                    {[5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyQuickPercentDiscount(pct)}
                        className="px-2 py-0.5 bg-[#F1F3F5] hover:bg-[#E5E8EC] rounded text-[10px] font-bold text-[#141923] transition cursor-pointer"
                      >
                        -{pct}%
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleDiscountAmountChange(0)}
                      className="px-2 py-0.5 bg-[#F1F3F5] hover:bg-rose-50 hover:text-rose-600 rounded text-[10px] font-semibold text-[#707783] transition cursor-pointer"
                    >
                      Không giảm
                    </button>
                  </div>

                  {/* Giá bán thực tế chốt */}
                  <div className="pt-2 border-t border-[#E5E8EC]">
                    <label className="block text-[#0275A9] font-black text-xs uppercase tracking-wider mb-1">
                      Giá bán thực tế (Khách thanh toán) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      required
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-black border-2 border-[#0275A9] rounded-xl focus:outline-none bg-[#EAF4FA]/30 text-[#0275A9]"
                    />
                    <div className="flex items-center justify-between text-xs font-bold text-[#0275A9] mt-1.5">
                      <span>Hiển thị trên web: {formatVND(numPrice)}</span>
                      {numDisc > 0 && (
                        <span className="text-rose-600">Tiết kiệm {formatVND(numDisc)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trả góp 0% Switch */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E8EC] shadow-2xs">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInstallment}
                      onChange={(e) => setIsInstallment(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#0275A9] rounded border-[#CBD5E1] focus:ring-[#0275A9] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#141923]">
                        Hỗ trợ trả góp 0% qua thẻ tín dụng (is_installment)
                      </div>
                      <p className="text-[11px] text-[#707783] mt-0.5">
                        Khi bật: Hiển thị nhãn TRẢ GÓP 0% và nút tính lãi suất trả góp trên trang sản phẩm. Bỏ chọn đối với phụ kiện hoặc sản phẩm giá rẻ.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Tồn kho & Trạng thái kinh doanh */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-[#E5E8EC]">
                    <label className="block text-[#141923] font-bold text-[11px] uppercase mb-1">
                      Số lượng tồn kho *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[10, 50, 100].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStock((prev) => (Number(prev) || 0) + num)}
                          className="px-1.5 py-0.5 bg-[#F1F3F5] hover:bg-[#E5E8EC] rounded text-[10px] font-bold text-[#707783] transition cursor-pointer"
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E5E8EC]">
                    <label className="block text-[#141923] font-bold text-[11px] uppercase mb-1">
                      Trạng thái bán
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                    >
                      <option value="active">🟢 Đang bán</option>
                      <option value="inactive">⚪ Tạm ẩn</option>
                    </select>
                    <p className="text-[10px] text-[#707783] mt-1">
                      {status === "active" ? "Hiển thị công khai" : "Ẩn khỏi cửa hàng"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              PHẦN 2: HÌNH ẢNH SẢN PHẨM (ĐẠI DIỆN & THƯ VIỆN)
              ========================================================================= */}
          <div className="bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E8EC] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0275A9] text-white flex items-center justify-center text-xs font-black">2</span>
                <h4 className="font-extrabold text-sm text-[#141923]">Hình ảnh sản phẩm & Bộ sưu tập ({gallery.length} ảnh)</h4>
              </div>
              <span className="text-xs text-[#707783]">Click ảnh để đặt làm ảnh đại diện chính</span>
            </div>

            {/* Gallery Thumbnails List */}
            <div className="flex flex-wrap gap-3 items-center">
              {gallery.map((gImg, idx) => {
                const isPrimary = img === gImg;
                return (
                  <div
                    key={idx}
                    className={`relative w-24 h-24 rounded-xl border-2 p-1.5 bg-white transition group flex items-center justify-center ${
                      isPrimary ? "border-[#0275A9] shadow-md ring-2 ring-[#0275A9]/20" : "border-[#E5E8EC] hover:border-[#CBD5E1]"
                    }`}
                  >
                    <img
                      src={gImg}
                      alt=""
                      onClick={() => setImg(gImg)}
                      className="w-full h-full object-contain cursor-pointer"
                    />
                    {isPrimary ? (
                      <span className="absolute top-1 left-1 bg-[#0275A9] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow-2xs">
                        Chính
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setImg(gImg)}
                        className="absolute bottom-1 inset-x-1 text-[9px] bg-[#141923]/80 hover:bg-[#0275A9] text-white font-bold py-0.5 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer text-center"
                      >
                        Đặt chính
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Upload Button */}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0275A9] hover:bg-[#EAF4FA]/40 bg-white flex flex-col items-center justify-center text-center p-2 cursor-pointer transition">
                <Icon name="upload" className="w-5 h-5 text-[#0275A9] mb-1" />
                <span className="text-[10px] font-bold text-[#141923]">+ Tải ảnh</span>
                <span className="text-[9px] text-[#707783]">Max 2MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Custom URL Input & Preset Images Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Dán đường dẫn ảnh trực tuyến (https://...)"
                  className="flex-1 px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-4 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0275A9] text-[#141923] text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                >
                  Thêm URL
                </button>
              </div>

              {/* Presets Quick Pick */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-[11px] text-[#707783] shrink-0 font-medium">Kho ảnh mẫu:</span>
                {presetImages.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => handleAddPreset(preset.path)}
                    className="p-1 rounded-lg border border-[#E5E8EC] hover:border-[#0275A9] bg-white shrink-0 cursor-pointer"
                    title={preset.name}
                  >
                    <img src={preset.path} alt="" className="w-6 h-6 object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              PHẦN 3: PHÂN LOẠI HÀNG / BIẾN THỂ (KHÔNG GIỚI HẠN SỐ NHÓM, CHỨC NĂNG ĐỒNG NHẤT: ẢNH + CHỮ)
              ========================================================================= */}
          <div className="bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E8EC] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0275A9] text-white flex items-center justify-center text-xs font-black">3</span>
                <div>
                  <h4 className="font-extrabold text-sm text-[#141923]">Phân loại hàng / Biến thể (Tùy chọn)</h4>
                  <p className="text-[11px] text-[#707783]">Thêm không giới hạn nhóm phân loại (Màu sắc, Dung lượng, Kích cỡ, Công suất, Bảo hành...). Các nhóm có chức năng hoàn toàn giống nhau (Ảnh + Chữ).</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#CBD5E1]">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="w-4 h-4 text-[#0275A9] rounded border-[#CBD5E1] focus:ring-[#0275A9] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#141923]">Sản phẩm có nhiều phân loại</span>
              </label>
            </div>

            {hasVariants && (() => {
              // Tính toán tổ hợp động từ các nhóm hợp lệ
              const validGroups = variantGroups.filter((g) => (g.name || "").trim() && g.options.some((o) => (o.name || "").trim()));
              const groupOptions = validGroups.map((g) => g.options.filter((o) => (o.name || "").trim()));
              
              const liveCombos = validGroups.length > 0 ? groupOptions.reduce(
                (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
                [[]]
              ).map((combo, idx) => {
                const names = combo.map((item) => item.name);
                const key = names.join(" · ");
                const comboImg = combo.find((item) => item.img)?.img || (img || (gallery && gallery[0]) || "");
                let vPrice = combinationPrices[key];
                if (vPrice === undefined) {
                  const foundV = product?.variants?.find((v) => v.name === key || (v.options && v.options.join(" · ") === key));
                  if (foundV && foundV.price !== undefined) {
                    vPrice = Number(foundV.price);
                  } else {
                    const diffSum = combo.reduce((sum, item) => sum + (Number(item.priceDiff) || 0), 0);
                    vPrice = numPrice + diffSum;
                  }
                }
                return {
                  id: "comb_" + idx,
                  key,
                  name: key,
                  options: names,
                  img: comboImg,
                  price: vPrice,
                  priceDiff: vPrice - numPrice,
                };
              }) : [];

              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* DANH SÁCH CÁC NHÓM PHÂN LOẠI (CHỨC NĂNG HOÀN TOÀN GIỐNG NHAU) */}
                  <div className="space-y-4">
                    {variantGroups.map((group, grpIdx) => (
                      <div key={group.id || grpIdx} className="p-4 bg-white border border-[#E5E8EC] rounded-xl space-y-3 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E8EC] pb-2.5">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="px-2.5 py-0.5 bg-[#EAF4FA] text-[#0275A9] font-black text-xs rounded-md">
                              Nhóm {grpIdx + 1}
                            </span>
                            <label className="text-xs font-bold text-[#707783] shrink-0">Tên nhóm:</label>
                            <input
                              type="text"
                              value={group.name}
                              onChange={(e) => handleUpdateGroupName(grpIdx, e.target.value)}
                              placeholder="VD: Màu sắc, Dung lượng, Kích cỡ, Công suất, Bảo hành..."
                              className="w-full max-w-xs px-2.5 py-1 text-xs font-bold text-[#141923] border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-[#F8FAFC]"
                            />
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleAddOption(grpIdx)}
                              className="px-3 py-1.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Icon name="plus" className="w-3.5 h-3.5" />
                              <span>Thêm lựa chọn</span>
                            </button>
                            {variantGroups.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveGroup(grpIdx)}
                                className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-lg transition cursor-pointer"
                                title="Xóa nhóm phân loại này"
                              >
                                Xóa nhóm
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Danh sách lựa chọn của nhóm này (Ảnh + Chữ đồng nhất) */}
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {group.options.map((opt, optIdx) => (
                            <div key={opt.id || optIdx} className="p-2.5 bg-[#F8FAFC] border border-[#E5E8EC] rounded-lg flex items-center gap-2.5">
                              {/* Thumbnail xem trước ảnh */}
                              <div className="w-10 h-10 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center shrink-0 overflow-hidden">
                                {opt.img ? (
                                  <img src={opt.img} alt={opt.name} className="w-full h-full object-contain p-0.5" onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                  <Icon name="image" className="w-4 h-4 text-[#94A3B8]" />
                                )}
                              </div>

                              {/* Ô nhập URL ảnh */}
                              <div className="w-2/5 min-w-0">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={opt.img || ""}
                                    onChange={(e) => handleUpdateOption(grpIdx, optIdx, "img", e.target.value)}
                                    placeholder="URL ảnh (tùy chọn)..."
                                    className="w-full px-2 py-1 text-xs border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                                  />
                                  {gallery && gallery.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextImg = gallery[optIdx % gallery.length] || gallery[0];
                                        handleUpdateOption(grpIdx, optIdx, "img", nextImg);
                                      }}
                                      className="px-2 py-1 text-[10px] font-semibold text-[#0275A9] hover:bg-[#EAF4FA] border border-[#CBD5E1] rounded-lg transition shrink-0 cursor-pointer"
                                      title="Lấy ảnh từ thư viện sản phẩm"
                                    >
                                      Mẫu
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Ô nhập tên lựa chọn (Chữ) */}
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={opt.name}
                                  onChange={(e) => handleUpdateOption(grpIdx, optIdx, "name", e.target.value)}
                                  placeholder="Tên lựa chọn (VD: Titan Sa Mạc, 128 GB, 65W, Size L...)"
                                  className="w-full px-2.5 py-1 text-xs font-bold border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                                />
                              </div>

                              {/* Nút xóa lựa chọn */}
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(grpIdx, optIdx)}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer shrink-0"
                                title="Xóa lựa chọn này"
                              >
                                <Icon name="trash-2" className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NÚT THÊM NHÓM MỚI (KHÔNG GIỚI HẠN SỐ NHÓM) */}
                  <div className="text-center py-2">
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="px-5 py-2.5 bg-white hover:bg-[#EAF4FA] text-[#0275A9] border-2 border-dashed border-[#0275A9]/40 hover:border-[#0275A9] text-xs font-extrabold rounded-xl transition cursor-pointer inline-flex items-center gap-2 shadow-2xs"
                    >
                      <Icon name="plus" className="w-4 h-4 text-[#0275A9]" />
                      <span>+ Thêm nhóm phân loại mới (Nhóm {variantGroups.length + 1})</span>
                    </button>
                  </div>

                  {/* BẢNG DANH SÁCH TỔ HỢP PHÂN LOẠI & GIÁ BÁN THỰC TẾ */}
                  <div className="p-4 bg-white border border-[#E5E8EC] rounded-xl space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E8EC] pb-3">
                      <div>
                        <h5 className="font-extrabold text-xs text-[#141923] uppercase">
                          Bảng danh sách phân loại hàng kết hợp & Giá bán thực tế
                        </h5>
                        <p className="text-[11px] text-[#707783]">
                          Tự động sinh ra {liveCombos.length} tổ hợp từ {validGroups.map(g => `${g.options.length} ${g.name}`).join(" × ")}
                        </p>
                      </div>

                      {/* Thanh áp dụng giá nhanh */}
                      <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#CBD5E1]">
                        <span className="text-[11px] font-bold text-[#707783] pl-1 hidden sm:inline">Áp dụng giá nhanh:</span>
                        <input
                          type="number"
                          step="10000"
                          min="0"
                          value={batchPriceInput}
                          onChange={(e) => setBatchPriceInput(e.target.value)}
                          placeholder="Nhập giá chung..."
                          className="w-32 px-2.5 py-1 text-xs font-bold border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyBatchPrice(liveCombos)}
                          className="px-2.5 py-1 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                        >
                          Áp dụng tất cả
                        </button>
                      </div>
                    </div>

                    <div className="border border-[#E5E8EC] rounded-xl overflow-hidden divide-y divide-[#E5E8EC] max-h-80 overflow-y-auto">
                      {/* Header bảng */}
                      <div className="bg-[#F8FAFC] px-4 py-2 flex items-center text-[10px] font-extrabold text-[#707783] uppercase">
                        <div className="flex-1">Tổ hợp phân loại hàng</div>
                        <div className="w-44 text-right">Giá bán (VNĐ)</div>
                      </div>

                      {/* Các dòng tổ hợp */}
                      {liveCombos.map((combo) => {
                        const diff = combo.price - numPrice;
                        return (
                          <div key={combo.key} className="px-4 py-2.5 flex items-center justify-between hover:bg-[#F8FAFC] gap-2">
                            <div className="flex-1 flex items-center gap-2.5 min-w-0">
                              {combo.img && (
                                <img src={combo.img} alt={combo.name} className="w-7 h-7 rounded object-contain border border-[#E5E8EC] shrink-0" />
                              )}
                              <span className="text-xs font-bold text-[#141923] truncate">{combo.name}</span>
                            </div>
                            <div className="w-44 flex items-center justify-end gap-2 shrink-0">
                              {diff > 0 ? (
                                <span className="text-emerald-700 font-bold text-[10px] hidden sm:inline">(+{formatVND(diff)})</span>
                              ) : diff < 0 ? (
                                <span className="text-rose-600 font-bold text-[10px] hidden sm:inline">(-{formatVND(Math.abs(diff))})</span>
                              ) : (
                                <span className="text-[#707783] text-[10px] hidden sm:inline">(Bằng gốc)</span>
                              )}
                              <input
                                type="number"
                                step="10000"
                                min="0"
                                value={combo.price}
                                onChange={(e) => handleUpdateCombinationPrice(combo.key, e.target.value)}
                                className="w-32 px-2 py-1 text-xs font-bold text-right text-[#0275A9] border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* =========================================================================
              PHẦN 4: BÀI VIẾT MÔ TẢ & THÔNG SỐ KỸ THUẬT (QUILL WYSIWYG 2.0 KẺ BẢNG)
              ========================================================================= */}
          <div className="bg-[#F8FAFC] border border-[#E5E8EC] rounded-2xl p-5 space-y-4">
            <div className="border-b border-[#E5E8EC] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0275A9] text-white flex items-center justify-center text-xs font-black">4</span>
                <h4 className="font-extrabold text-sm text-[#141923]">Bài viết mô tả & Thông số kỹ thuật (Soạn thảo văn bản & Kẻ bảng)</h4>
              </div>
              <p className="text-xs text-[#707783] mt-1">
                Soạn thảo nội dung đánh giá chi tiết, chèn hình ảnh và kẻ bảng thông số kỹ thuật trực tiếp bằng trình soạn thảo.
              </p>
            </div>

            <RichTextEditor
              editorId="product-unified-desc-editor"
              initialValue={desc}
              onChange={(content) => setDesc(content)}
            />
          </div>

        </form>

        {/* Modal Footer (Sticky Summary Bar) */}
        <div className="p-4 px-6 border-t border-[#E5E8EC] flex items-center justify-between bg-white rounded-b-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-[#E5E8EC] bg-[#F8FAFC] flex items-center justify-center p-1 shrink-0">
              <img
                src={img || "src/assets/img/phone-iphone-16-pro.png"}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "src/assets/img/phone-iphone-16-pro.png"; }}
              />
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#141923] truncate max-w-xs">{name || "Chưa đặt tên sản phẩm"}</div>
              <div className="text-[11px] text-[#707783] flex items-center gap-2">
                <span className="font-bold text-[#0275A9]">{formatVND(numPrice)}</span>
                {numDisc > 0 && <span className="text-rose-600 font-semibold">(Tiết kiệm {formatVND(numDisc)})</span>}
                {isInstallment && <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 rounded">Trả góp 0%</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#141923] hover:bg-[#F5F6F8] transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#0275A9] hover:bg-[#02628e] text-xs font-bold text-white transition shadow-sm active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Icon name="check" className="w-4 h-4" />
              <span>{isEditing ? "Cập nhật sản phẩm" : "Lưu sản phẩm mới"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function AdminApp() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState(() => getStorage("net_orders", []));
  const [products, setProducts] = useState(() => getStorage("net_products", DEFAULT_PRODUCTS));
  const [vouchers, setVouchers] = useState(() => getStorage("net_vouchers", DEFAULT_VOUCHERS));
  const [reviews, setReviews] = useState(() => getStorage("net_custom_reviews", {}));
  const [comments, setComments] = useState([]);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // State quản lý Banners, Articles, FAQs, Settings từ Backend SQLite
  const [banners, setBanners] = useState([]);
  const [articles, setArticles] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [storeSettings, setStoreSettings] = useState({});
  const [heroForm, setHeroForm] = useState({
    tag: "01 / CHIẾN DỊCH CHÍNH",
    title: "Đỉnh cao.\nTrong tầm tay.",
    description: "Titan sa mạc. Nâng cấp camera 48MP Fusion và chip A18 Pro tối tân. Sẵn sàng cho mọi sáng tạo đỉnh cao.",
    buttonText: "Khám phá ngay",
    buttonLink: "#/product/p1",
    priceText: "28.490.000₫",
    img: "src/assets/img/hero-iphone-16-pro.png",
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const BACKEND_URL = "http://localhost:5000/api";

  // Nạp toàn bộ dữ liệu thật trực tiếp từ SQLite Database khi mở Admin
  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend products:", err));

    fetch(`${BACKEND_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend orders:", err));

    fetch(`${BACKEND_URL}/banners`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBanners(data);
          const h = data.find((b) => b.id === "hero");
          if (h) setHeroForm({ ...h });
        }
      })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend banners:", err));

    fetch(`${BACKEND_URL}/articles`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setArticles(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend articles:", err));

    fetch(`${BACKEND_URL}/faqs`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setFaqs(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend faqs:", err));

    fetch(`${BACKEND_URL}/settings`)
      .then((res) => res.json())
      .then((data) => { if (data) setStoreSettings(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend settings:", err));

    fetch(`${BACKEND_URL}/comments`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setComments(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend comments:", err));

    fetch(`${BACKEND_URL}/vouchers`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVouchers(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend vouchers:", err));

    fetch(`${BACKEND_URL}/products/reviews`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch((err) => console.warn("[Admin] Chưa kết nối được Backend reviews:", err));
  }, []);

  // Sync back to storage on change
  useEffect(() => { setStorage("net_orders", orders); }, [orders]);
  useEffect(() => { setStorage("net_products", products); }, [products]);
  useEffect(() => { setStorage("net_vouchers", vouchers); }, [vouchers]);
  useEffect(() => { setStorage("net_custom_reviews", reviews); }, [reviews]);

  // Modals & UI States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [productCatFilter, setProductCatFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReplyComment = async (commentId) => {
    if (!replyContent.trim()) {
      showToast("Vui lòng nhập nội dung phản hồi", "info");
      return;
    }
    try {
      await fetch(`${BACKEND_URL}/comments/${commentId}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyContent.trim() })
      });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, reply: replyContent.trim() } : c));
      setReplyingCommentId(null);
      setReplyContent("");
      showToast("Đã gửi phản hồi của QTV thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi gửi phản hồi: " + err.message, "rose");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này khỏi hệ thống?")) return;
    try {
      await fetch(`${BACKEND_URL}/comments/${commentId}`, { method: "DELETE" });
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast("Đã xóa bình luận thành công!", "info");
    } catch (err) {
      showToast("Lỗi khi xóa: " + err.message, "rose");
    }
  };

  // Order Handlers
  const handleStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
    try {
      await fetch(`${BACKEND_URL}/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Đã chuyển trạng thái đơn #${orderId}!`, "success");
    } catch {
      showToast(`Đã chuyển trạng thái đơn #${orderId} (offline)`, "info");
    }
  };

  // Product Handlers
  const handleSaveProduct = async (prodData) => {
    if (prodData.id) {
      // Update
      setProducts((prev) => prev.map((p) => (p.id === prodData.id ? prodData : p)));
      try {
        await fetch(`${BACKEND_URL}/products/${prodData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prodData),
        });
        showToast(`Đã cập nhật sản phẩm: ${prodData.name}!`, "success");
      } catch {
        showToast(`Đã lưu cục bộ sản phẩm: ${prodData.name}`, "info");
      }
    } else {
      // Create new
      const newProd = {
        ...prodData,
        id: "p_" + Date.now(),
        slug: prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        rating: 5.0,
        reviewCount: 0,
        stock: prodData.stock ?? 50,
      };
      setProducts((prev) => [newProd, ...prev]);
      try {
        await fetch(`${BACKEND_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProd),
        });
        showToast(`Đã thêm sản phẩm mới vào Database: ${newProd.name}!`, "success");
      } catch {
        showToast(`Đã thêm sản phẩm mới: ${newProd.name}`, "info");
      }
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    const p = products.find((x) => x.id === productId);
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${p?.name || productId}" khỏi hệ thống?`)) return;
    setProducts((prev) => prev.filter((x) => x.id !== productId));
    try {
      await fetch(`${BACKEND_URL}/products/${productId}`, { method: "DELETE" });
      showToast(`Đã xóa sản phẩm: ${p?.name || productId}`, "info");
    } catch {
      showToast(`Đã xóa sản phẩm cục bộ`, "info");
    }
  };

    // Voucher Handlers
  const handleCreateVoucher = async (newVoucher) => {
    try {
      await fetch(`${BACKEND_URL}/vouchers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newVoucher.code,
          discountType: newVoucher.type,
          value: newVoucher.discount,
          minOrder: newVoucher.minSpend,
          desc: newVoucher.desc
        })
      });
      showToast(`Đã lưu voucher ${newVoucher.code} vào SQLite!`, "success");
    } catch {
      showToast(`Đã tạo voucher ${newVoucher.code} (cục bộ)!`, "info");
    }
    setVouchers((prev) => [newVoucher, ...prev.filter(v => v.code !== newVoucher.code)]);
    setIsVoucherModalOpen(false);
  };

  const handleDeleteVoucher = async (code) => {
    if (!confirm(`Bạn có chắc muốn xóa mã voucher "${code}" khỏi SQLite?`)) return;
    try {
      await fetch(`${BACKEND_URL}/vouchers/${encodeURIComponent(code)}`, { method: "DELETE" });
      showToast(`Đã xóa mã voucher ${code} khỏi SQLite!`, "info");
    } catch {
      showToast(`Đã xóa mã voucher ${code} (cục bộ)!`, "info");
    }
    setVouchers((prev) => prev.filter((v) => v.code !== code));
  };

  // Review Handlers
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này khỏi SQLite?")) return;
    try {
      await fetch(`${BACKEND_URL}/products/reviews/${encodeURIComponent(reviewId)}`, { method: "DELETE" });
      showToast("Đã xóa đánh giá vi phạm khỏi SQLite!", "success");
    } catch {
      showToast("Đã xóa đánh giá vi phạm (cục bộ)!", "info");
    }
    setReviews((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((r) => r.id !== reviewId);
      }
      const updated = { ...prev };
      for (const prodId in updated) {
        updated[prodId] = updated[prodId].filter((r) => r.id !== reviewId);
      }
      return updated;
    });
  };

  // Banner Handlers
  const handleSaveHeroBanner = async () => {
    try {
      await fetch(`${BACKEND_URL}/banners/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroForm),
      });
      setBanners((prev) => prev.map((b) => (b.id === "hero" ? { ...b, ...heroForm } : b)));
      showToast("Đã lưu chiến dịch Hero Banner thành công!", "success");
    } catch {
      showToast("Lỗi lưu Hero Banner vào Backend", "error");
    }
  };

  const handleSavePromoBanner = async (bannerId, bannerData) => {
    try {
      await fetch(`${BACKEND_URL}/banners/${bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData),
      });
      setBanners((prev) => prev.map((b) => (b.id === bannerId ? { ...b, ...bannerData } : b)));
      showToast(`Đã lưu Banner "${bannerId}" thành công!`, "success");
    } catch {
      showToast("Lỗi lưu Banner vào Backend", "error");
    }
  };

  // Article Handlers
  const handleSaveArticle = async (articleData) => {
    if (articleData.id) {
      try {
        await fetch(`${BACKEND_URL}/articles/${articleData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
        setArticles((prev) => prev.map((a) => (a.id === articleData.id ? { ...a, ...articleData } : a)));
        showToast(`Đã cập nhật bài viết: ${articleData.title}!`, "success");
      } catch {
        showToast("Lỗi cập nhật bài viết", "error");
      }
    } else {
      try {
        const res = await fetch(`${BACKEND_URL}/articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
        const created = await res.json();
        setArticles((prev) => [created, ...prev]);
        showToast(`Đã xuất bản bài viết mới!`, "success");
      } catch {
        showToast("Lỗi thêm bài viết mới", "error");
      }
    }
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = async (artId) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    try {
      await fetch(`${BACKEND_URL}/articles/${artId}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== artId));
      showToast("Đã xóa bài viết thành công!", "info");
    } catch {
      showToast("Lỗi xóa bài viết", "error");
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (newSettings) => {
    try {
      await fetch(`${BACKEND_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      setStoreSettings((prev) => ({ ...prev, ...newSettings }));
      showToast("Đã lưu toàn bộ Cấu hình Cửa hàng & Showrooms!", "success");
    } catch {
      showToast("Lỗi lưu cấu hình", "error");
    }
  };

  // KPI Calculations
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending_qr" || o.status === "processing").length;
  const inStockCount = products.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F6F8] text-[#141923]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg bg-[#141923] text-white text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Icon name="check-circle" className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E5E8EC] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E5E8EC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-[#141923]">nét<span className="text-[#0275A9]">.</span></span>
            <span className="px-2 py-0.5 bg-[#0275A9] text-white text-[10px] font-extrabold uppercase rounded tracking-wider">
              Admin
            </span>
          </div>
          <a
            href="index.html"
            target="_blank"
            title="Mở trang bán hàng khách xem"
            className="p-1.5 text-[#707783] hover:text-[#0275A9] hover:bg-[#F5F6F8] rounded-lg transition"
          >
            <Icon name="external-link" className="w-4 h-4" />
          </a>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: "overview", label: "Tổng quan", icon: "layout-dashboard" },
            { id: "orders", label: "Quản lý đơn hàng", icon: "shopping-bag", badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: "products", label: "Kho sản phẩm", icon: "package" },
            { id: "banners", label: "Chiến dịch & Banner", icon: "image" },
            { id: "articles", label: "Bài viết & Tin tức", icon: "newspaper" },
            { id: "vouchers", label: "Mã ưu đãi", icon: "ticket" },
            { id: "reviews", label: "Đánh giá khách hàng", icon: "star" },
            { id: "comments", label: "Hỏi đáp & Bình luận", icon: "message-square", badge: comments.filter(c => !c.reply).length || null },
            { id: "settings", label: "Cấu hình cửa hàng", icon: "settings" },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#EAF4FA] text-[#0275A9]"
                    : "text-[#707783] hover:bg-[#F5F6F8] hover:text-[#141923]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5E8EC] bg-[#F8FAFC]">
          <div className="text-xs font-bold text-[#141923] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Chế độ Quản trị Khách hàng</span>
          </div>
          <p className="text-[10px] text-[#707783] mt-1">
            Đồng bộ 2 chiều tức thì với giao diện Storefront
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-[#E5E8EC] px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base font-extrabold text-[#141923] capitalize">
              {activeTab === "overview" && "Bảng điều khiển Tổng quan"}
              {activeTab === "orders" && "Quản lý Đơn đặt hàng"}
              {activeTab === "products" && "Quản lý Kho sản phẩm"}
              {activeTab === "banners" && "Chiến dịch Quảng cáo & Banner Trang chủ"}
              {activeTab === "articles" && "Quản lý Bài viết & Tin tức Công nghệ"}
              {activeTab === "vouchers" && "Mã khuyến mãi & Voucher"}
              {activeTab === "reviews" && "Kiểm duyệt Nhận xét"}
              {activeTab === "comments" && "Hỏi đáp & Bình luận Sản phẩm"}
              {activeTab === "settings" && "Cấu hình Cửa hàng & Showrooms"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-[#707783]">
              Hệ thống: <span className="font-bold text-[#141923]">nét. Store Manager</span>
            </div>
          </div>
        </header>

        {/* TAB PANELS */}
        <div className="p-6 flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs">
                  <div className="flex items-center justify-between text-[#707783] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Doanh thu thực tế</span>
                    <Icon name="trending-up" className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-[#0275A9] tracking-tight">{formatVND(totalRevenue)}</div>
                  <div className="text-[11px] text-[#707783] mt-1">Đã loại trừ đơn hàng hủy</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs">
                  <div className="flex items-center justify-between text-[#707783] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tổng số đơn hàng</span>
                    <Icon name="shopping-bag" className="w-4 h-4 text-[#0275A9]" />
                  </div>
                  <div className="text-2xl font-black text-[#141923] tracking-tight">{totalOrdersCount} đơn</div>
                  <div className="text-[11px] text-[#707783] mt-1">Tất cả giao dịch trên hệ thống</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs">
                  <div className="flex items-center justify-between text-[#707783] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Đơn cần xử lý gấp</span>
                    <Icon name="clock" className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600 tracking-tight">{pendingOrdersCount} đơn</div>
                  <div className="text-[11px] text-[#707783] mt-1">Chờ QR & Đang xử lý</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs">
                  <div className="flex items-center justify-between text-[#707783] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Sản phẩm trên kệ</span>
                    <Icon name="package" className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-[#141923] tracking-tight">{inStockCount} sản phẩm</div>
                  <div className="text-[11px] text-[#707783] mt-1">Đang kích hoạt bán</div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#141923]">Đơn hàng mới nhất cần duyệt</h3>
                    <p className="text-xs text-[#707783] mt-0.5">Xử lý ngay để chuyển hàng cho khách</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#0275A9] hover:underline cursor-pointer"
                  >
                    Xem tất cả đơn →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-[#707783] text-xs">Chưa có đơn hàng nào được ghi nhận.</div>
                ) : (
                  <div className="divide-y divide-[#E5E8EC]">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="font-bold text-[#141923]">#{o.id} — {o.customerName}</div>
                          <div className="text-[#707783] text-[11px] mt-0.5">{o.phone} · {formatDate(o.createdAt)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-[#0275A9]">{formatVND(o.total || 0)}</span>
                          <OrderStatusBadge status={o.status} />
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E8EC] rounded-lg font-bold text-[#141923] transition cursor-pointer"
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E8EC] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "pending_qr", label: "Chờ QR" },
                    { id: "processing", label: "Đang xử lý" },
                    { id: "shipping", label: "Đang giao" },
                    { id: "delivered", label: "Đã giao" },
                    { id: "cancelled", label: "Đã hủy" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        orderFilter === st.id
                          ? "bg-[#0275A9] text-white"
                          : "bg-[#F5F6F8] text-[#707783] hover:text-[#141923]"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm mã đơn, tên, SĐT..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E8EC] text-[#707783] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Mã đơn</th>
                      <th className="p-4">Khách hàng</th>
                      <th className="p-4">Ngày đặt</th>
                      <th className="p-4">Thanh toán</th>
                      <th className="p-4">Tổng tiền</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E8EC]">
                    {orders
                      .filter((o) => (orderFilter === "all" ? true : o.status === orderFilter))
                      .filter((o) => {
                        if (!orderSearch) return true;
                        const s = orderSearch.toLowerCase();
                        return (
                          (o.id || "").toLowerCase().includes(s) ||
                          (o.customerName || "").toLowerCase().includes(s) ||
                          (o.phone || "").includes(s)
                        );
                      })
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-[#F8FAFC] transition">
                          <td className="p-4 font-bold text-[#141923]">#{o.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-[#141923]">{o.customerName}</div>
                            <div className="text-[#707783] text-[11px]">{o.phone}</div>
                          </td>
                          <td className="p-4 text-[#707783]">{formatDate(o.createdAt)}</td>
                          <td className="p-4 uppercase text-[11px] font-bold text-[#707783]">
                            {o.paymentMethod === "vietqr" ? "VietQR ⚡" : "COD 💵"}
                          </td>
                          <td className="p-4 font-black text-[#0275A9]">{formatVND(o.total || 0)}</td>
                          <td className="p-4">
                            <OrderStatusBadge status={o.status} />
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 bg-[#EAF4FA] text-[#0275A9] hover:bg-[#0275A9] hover:text-white rounded-lg font-bold text-xs transition cursor-pointer"
                            >
                              Xem & Xử lý
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-4">
              {/* Product Controls */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E8EC] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white font-medium"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label || c.name}</option>
                    ))}
                  </select>

                  <div className="relative w-64">
                    <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm tên, thương hiệu..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setEditingProduct({})}
                  className="px-4 py-2 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>Thêm sản phẩm mới</span>
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E8EC] text-[#707783] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Sản phẩm</th>
                      <th className="p-4">Hãng</th>
                      <th className="p-4">Danh mục</th>
                      <th className="p-4">Giá bán</th>
                      <th className="p-4">Tồn kho</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E8EC]">
                    {products
                      .filter((p) => (productCatFilter === "all" ? true : p.category === productCatFilter))
                      .filter((p) => {
                        if (!productSearch) return true;
                        const s = productSearch.toLowerCase();
                        return (
                          (p.name || "").toLowerCase().includes(s) ||
                          (p.brand || "").toLowerCase().includes(s)
                        );
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.img}
                                alt={p.name}
                                className="w-10 h-10 object-contain rounded-lg border border-[#E5E8EC] bg-white p-1"
                                onError={(e) => { e.target.onerror = null; e.target.src = "src/assets/img/phone-iphone-16-pro.png"; }}
                              />
                              <div>
                                <div className="font-bold text-[#141923]">{p.name}</div>
                                {p.badge && (
                                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-extrabold uppercase">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 uppercase text-[#707783] font-bold">{p.brand}</td>
                          <td className="p-4 text-[#707783] capitalize">{p.category}</td>
                          <td className="p-4">
                            <div className="font-black text-[#0275A9]">{formatVND(p.price)}</div>
                            {p.originalPrice > p.price && (
                              <div className="text-[11px] text-[#707783] line-through">{formatVND(p.originalPrice)}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (p.stock || 0) > 10
                                ? "bg-emerald-100 text-emerald-800"
                                : (p.stock || 0) > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              {(p.stock || 0) > 0 ? `Còn ${p.stock} máy` : "Hết hàng"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}>
                              {p.status === "active" ? "Đang bán" : "Tạm ẩn"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-[#0275A9] hover:bg-[#EAF4FA] rounded-lg transition cursor-pointer"
                                title="Chỉnh sửa sản phẩm"
                              >
                                <Icon name="edit" className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Xóa sản phẩm"
                              >
                                <Icon name="trash" className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "vouchers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#141923]">Danh sách mã khuyến mãi</h3>
                  <p className="text-xs text-[#707783]">Mã giảm giá áp dụng tự động cho khách hàng khi mua sắm</p>
                </div>
                <button
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="px-4 py-2 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>Tạo mã ưu đãi mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vouchers.map((v) => (
                  <div key={v.code} className="p-4 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 bg-[#EAF4FA] text-[#0275A9] font-black text-xs rounded-lg uppercase tracking-wider">
                        {v.code}
                      </span>
                      <button
                        onClick={() => handleDeleteVoucher(v.code)}
                        className="text-[#707783] hover:text-rose-600 p-1 rounded transition cursor-pointer"
                        title="Xóa voucher"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-bold text-sm text-[#141923] mb-1">
                      {v.type === "percent" ? `Giảm ${v.discount}%` : `Giảm ${formatVND(v.discount)}`}
                    </div>
                    <p className="text-xs text-[#707783] mb-2">{v.desc}</p>
                    <div className="text-[11px] text-[#707783] pt-2 border-t border-[#F1F3F5] flex justify-between">
                      <span>Đơn tối thiểu:</span>
                      <span className="font-bold text-[#141923]">{formatVND(v.minSpend || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#141923]">Kiểm duyệt Nhận xét Khách hàng</h3>
                <p className="text-xs text-[#707783]">Xem và kiểm duyệt đánh giá gửi từ trang web bán hàng</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden shadow-2xs divide-y divide-[#E5E8EC]">
                {(Array.isArray(reviews) ? reviews : Object.values(reviews).flat()).length === 0 ? (
                  <div className="p-8 text-center text-[#707783] text-xs">Chưa có đánh giá nào từ khách hàng.</div>
                ) : (
                  (Array.isArray(reviews) ? reviews : Object.values(reviews).flat()).map((rev) => (
                    <div key={rev.id} className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-[#141923]">{rev.author}</span>
                          <span className="text-[11px] text-amber-500 font-bold">⭐ {rev.rating}/5</span>
                          <span className="text-[10px] text-[#707783]">• {rev.date}</span>
                        </div>
                        <p className="text-xs text-[#707783]">{rev.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Xóa vi phạm
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: HỎI ĐÁP & BÌNH LUẬN KHÁCH HÀNG */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-[#141923]">Hỏi đáp & Bình luận Sản phẩm</h3>
                  <p className="text-xs text-[#707783]">Trả lời thắc mắc của khách hàng, phản hồi sẽ xuất hiện trực tiếp trên trang chi tiết sản phẩm</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0275A9] bg-[#EAF4FA] px-3 py-1 rounded-full">
                    {comments.length} câu hỏi ({comments.filter(c => !c.reply).length} chưa trả lời)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden shadow-2xs divide-y divide-[#E5E8EC]">
                {comments.length === 0 ? (
                  <div className="p-8 text-center text-[#707783] text-xs">Chưa có câu hỏi hoặc bình luận nào từ khách hàng.</div>
                ) : (
                  comments.map((cm) => (
                    <div key={cm.id} className="p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F3F5] pb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-xs text-[#141923]">{cm.author}</span>
                          {cm.phone && (
                            <span className="text-[11px] text-[#707783] bg-[#F5F6F8] px-2 py-0.5 rounded font-mono">
                              SĐT: {cm.phone}
                            </span>
                          )}
                          <span className="text-[10px] text-[#707783]">• {cm.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#0275A9] bg-[#EAF4FA] px-2.5 py-0.5 rounded-full truncate max-w-xs">
                            SP: {cm.productName || cm.productId}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(cm.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Xóa câu hỏi này"
                          >
                            <Icon name="trash-2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Content */}
                      <p className="text-xs text-[#141923] font-medium leading-relaxed pl-2 border-l-2 border-[#0275A9]">
                        "{cm.content}"
                      </p>

                      {/* Store Reply or Reply Form */}
                      {cm.reply ? (
                        <div className="p-3 bg-[#EAF4FA]/60 border border-[#0275A9]/20 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[#0275A9] font-bold text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <Icon name="check-circle" className="w-3.5 h-3.5 text-emerald-600" />
                              <span>nét. Quản trị viên phản hồi:</span>
                            </span>
                            <button
                              onClick={() => {
                                setReplyingCommentId(cm.id);
                                setReplyContent(cm.reply);
                              }}
                              className="text-[10px] text-[#0275A9] hover:underline cursor-pointer"
                            >
                              Sửa câu trả lời
                            </button>
                          </div>
                          <p className="text-[#141923] text-xs leading-relaxed">{cm.reply}</p>
                        </div>
                      ) : replyingCommentId === cm.id ? (
                        <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
                          <label className="block text-xs font-bold text-[#0275A9]">
                            Nhập câu trả lời của nét. Store Manager:
                          </label>
                          <textarea
                            rows="3"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Dạ nét. chào anh/chị, hiện tại sản phẩm này..."
                            className="w-full p-2.5 text-xs border border-[#CBD5E1] rounded-lg focus:border-[#0275A9] focus:outline-none bg-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingCommentId(null);
                                setReplyContent("");
                              }}
                              className="px-3 py-1.5 text-xs text-[#707783] hover:bg-[#E5E8EC] rounded-lg font-bold transition cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReplyComment(cm.id)}
                              className="px-4 py-1.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                            >
                              Gửi phản hồi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => {
                              setReplyingCommentId(cm.id);
                              setReplyContent("");
                            }}
                            className="px-3 py-1.5 bg-[#0275A9] hover:bg-[#02628e] text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Icon name="message-square" className="w-3.5 h-3.5" />
                            <span>Trả lời khách hàng</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: BANNERS & CHIẾN DỊCH QUẢNG CÁO */}
          {activeTab === "banners" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-extrabold text-sm text-[#141923]">Chiến dịch & Banner Trang chủ</h3>
                <p className="text-xs text-[#707783]">Chỉnh sửa nội dung Hero Banner chính và các banner khuyến mãi chiến dịch</p>
              </div>

              {/* 1. HERO BANNER CHÍNH */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#141923]">1. Hero Banner Chính (Đầu trang chủ)</h4>
                    <p className="text-xs text-[#707783]">Banner nổi bật nhất khi khách hàng vừa bước vào website</p>
                  </div>
                  <button
                    onClick={handleSaveHeroBanner}
                    className="px-5 py-2.5 rounded-xl bg-[#0275A9] hover:bg-[#02628e] text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <Icon name="check" className="w-4 h-4" />
                    <span>Lưu Hero Banner</span>
                  </button>
                </div>

                {/* Live Preview Box */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#707783] uppercase tracking-wider">Xem trước trực quan (Live Preview)</span>
                  <div className="w-full min-h-[260px] p-8 relative bg-[#F0F2F4] rounded-2xl overflow-hidden flex flex-col justify-between border border-[#CBD5E1]">
                    <div className="z-10 max-w-[360px] space-y-2 text-left">
                      <span className="text-[#0275A9] text-[10px] font-bold uppercase tracking-wider">
                        {heroForm.tag || "01 / CHIẾN DỊCH CHÍNH"}
                      </span>
                      <h2 className="text-[#141923] text-3xl font-extrabold leading-tight tracking-tight whitespace-pre-line">
                        {heroForm.title || "Đỉnh cao.\nTrong tầm tay."}
                      </h2>
                      <p className="text-[#707783] text-xs leading-relaxed line-clamp-3">
                        {heroForm.description || "Mô tả chiến dịch"}
                      </p>
                      <div className="pt-2 flex items-center gap-4">
                        <span className="px-4 py-2 bg-[#0275A9] text-white text-xs font-bold rounded-full shadow-sm">
                          {heroForm.buttonText || "Khám phá ngay"} →
                        </span>
                        {heroForm.priceText && (
                          <div>
                            <span className="text-[10px] text-[#707783] block">Giá chỉ từ</span>
                            <span className="text-sm font-bold text-[#141923]">{heroForm.priceText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {heroForm.img && (
                      <img
                        src={heroForm.img}
                        alt="Hero Preview"
                        className="absolute right-4 bottom-2 max-h-[220px] max-w-[50%] object-contain drop-shadow-lg pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Tag chiến dịch nhỏ</label>
                    <input
                      type="text"
                      value={heroForm.tag || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, tag: e.target.value })}
                      placeholder="01 / CHIẾN DỊCH CHÍNH"
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Giá hiển thị ưu đãi</label>
                    <input
                      type="text"
                      value={heroForm.priceText || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, priceText: e.target.value })}
                      placeholder="28.490.000₫"
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-[#141923] block mb-1">Tiêu đề chính (Headline)</label>
                    <textarea
                      rows={2}
                      value={heroForm.title || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      placeholder="Đỉnh cao.&#10;Trong tầm tay."
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-[#141923] block mb-1">Mô tả chiến dịch</label>
                    <textarea
                      rows={2}
                      value={heroForm.description || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                      placeholder="Mô tả tóm tắt điểm nổi bật..."
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Chữ trên nút bấm</label>
                    <input
                      type="text"
                      value={heroForm.buttonText || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                      placeholder="Khám phá ngay"
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Đường dẫn khi bấm nút</label>
                    <input
                      type="text"
                      value={heroForm.buttonLink || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                      placeholder="#/product/p1"
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-bold text-[#141923] block mb-1">Đường dẫn ảnh Banner</label>
                    <input
                      type="text"
                      value={heroForm.img || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, img: e.target.value })}
                      placeholder="src/assets/img/hero-iphone-16-pro.png"
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. CÁC BANNER KHUYẾN MÃI CHIẾN DỊCH PHỤ */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-[#141923]">2. Banner Khuyến mãi phụ (Thu cũ đổi mới & Combo)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.filter((b) => b.id !== "hero").map((bn) => (
                    <div key={bn.id} className="p-5 bg-white rounded-2xl border border-[#E5E8EC] shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#EAF4FA] text-[#0275A9] font-bold text-[10px] rounded uppercase">
                          {bn.id === "promo_tradein" ? "Thu cũ đổi mới" : "Combo phụ kiện"}
                        </span>
                        <button
                          onClick={() => handleSavePromoBanner(bn.id, bn)}
                          className="px-3 py-1 bg-[#0275A9] text-white rounded-lg text-xs font-bold hover:bg-[#02628e] transition cursor-pointer"
                        >
                          Lưu Banner
                        </button>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-[#141923] block mb-1">Tag nhỏ</label>
                          <input
                            type="text"
                            value={bn.tag || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBanners((prev) => prev.map((item) => (item.id === bn.id ? { ...item, tag: v } : item)));
                            }}
                            className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-[#141923] block mb-1">Tiêu đề</label>
                          <textarea
                            rows={2}
                            value={bn.title || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBanners((prev) => prev.map((item) => (item.id === bn.id ? { ...item, title: v } : item)));
                            }}
                            className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-[#141923] block mb-1">Mô tả tóm tắt</label>
                          <textarea
                            rows={2}
                            value={bn.description || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBanners((prev) => prev.map((item) => (item.id === bn.id ? { ...item, description: v } : item)));
                            }}
                            className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-[#141923] block mb-1">Đường dẫn ảnh</label>
                          <input
                            type="text"
                            value={bn.img || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBanners((prev) => prev.map((item) => (item.id === bn.id ? { ...item, img: v } : item)));
                            }}
                            className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BÀI VIẾT & TIN TỨC CÔNG NGHỆ */}
          {activeTab === "articles" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#141923]">Quản lý Bài viết & Tin tức Công nghệ</h3>
                  <p className="text-xs text-[#707783]">Soạn thảo và xuất bản các bài viết tư vấn, thủ thuật, đánh giá công nghệ</p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticle({
                      title: "",
                      category: "TƯ VẤN MUA",
                      time: "5 phút đọc",
                      author: "BTV nét.",
                      date: new Date().toLocaleDateString("vi-VN"),
                      img: "src/assets/img/article-1.png",
                      excerpt: "",
                      content: "",
                    });
                    setIsArticleModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0275A9] text-white rounded-xl text-xs font-bold hover:bg-[#02628e] transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>Viết bài mới</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E8EC] text-[#707783] font-bold">
                    <tr>
                      <th className="p-4">Ảnh</th>
                      <th className="p-4">Tiêu đề & Tóm tắt</th>
                      <th className="p-4">Chuyên mục</th>
                      <th className="p-4">Tác giả & Ngày</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E8EC]">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#F8FAFC]">
                        <td className="p-4 w-24">
                          <img src={art.img} alt={art.title} className="w-16 h-12 object-cover rounded-lg border border-[#E5E8EC]" />
                        </td>
                        <td className="p-4 max-w-md">
                          <div className="font-bold text-[#141923] text-xs line-clamp-1">{art.title}</div>
                          <div className="text-[11px] text-[#707783] line-clamp-2 mt-0.5">{art.excerpt}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-[#EAF4FA] text-[#0275A9] font-bold text-[10px] rounded uppercase">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-[#707783]">
                          <div>{art.author}</div>
                          <div>{art.date} ({art.time})</div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingArticle({ ...art });
                              setIsArticleModalOpen(true);
                            }}
                            className="p-1.5 text-[#0275A9] hover:bg-[#EAF4FA] rounded-lg transition cursor-pointer"
                            title="Chỉnh sửa bài viết"
                          >
                            <Icon name="edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CẤU HÌNH CỬA HÀNG & SHOWROOMS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#141923]">Cấu hình Hệ thống Website & Cửa hàng</h3>
                  <p className="text-xs text-[#707783]">Quản lý hotline hỗ trợ, thông báo topbar, 4 cam kết dịch vụ và hệ thống showrooms</p>
                </div>
                <button
                  onClick={() => handleSaveSettings(storeSettings)}
                  className="px-5 py-2.5 rounded-xl bg-[#0275A9] hover:bg-[#02628e] text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Icon name="check" className="w-4 h-4" />
                  <span>Lưu Toàn Bộ Cấu Hình</span>
                </button>
              </div>

              {/* Thông tin chung */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] p-6 shadow-2xs space-y-4">
                <h4 className="font-extrabold text-sm text-[#141923]">1. Hotline & Thông điệp Topbar</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Tên website / Thương hiệu</label>
                    <input
                      type="text"
                      value={storeSettings.site_name || "nét. — CÔNG NGHỆ ĐÚNG GU"}
                      onChange={(e) => setStoreSettings({ ...storeSettings, site_name: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Hotline tư vấn</label>
                    <input
                      type="text"
                      value={storeSettings.hotline || "1900 6868"}
                      onChange={(e) => setStoreSettings({ ...storeSettings, hotline: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141923] block mb-1">Thông điệp Topbar</label>
                    <input
                      type="text"
                      value={storeSettings.announcement || "Công nghệ bạn thích. Trải nghiệm bạn tin."}
                      onChange={(e) => setStoreSettings({ ...storeSettings, announcement: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hệ thống Showrooms */}
              <div className="bg-white rounded-2xl border border-[#E5E8EC] p-6 shadow-2xs space-y-4">
                <h4 className="font-extrabold text-sm text-[#141923]">2. Hệ thống Cửa hàng / Showrooms (4 Chi nhánh)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(storeSettings.showrooms || []).map((sh, sIdx) => (
                    <div key={sIdx} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] space-y-2 text-xs">
                      <div className="font-bold text-[#0275A9]">Chi nhánh #{sIdx + 1}</div>
                      <div>
                        <label className="text-[11px] text-[#707783] block">Tên Showroom</label>
                        <input
                          type="text"
                          value={sh.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...(storeSettings.showrooms || [])];
                            updated[sIdx] = { ...updated[sIdx], name: val };
                            setStoreSettings({ ...storeSettings, showrooms: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#707783] block">Địa chỉ</label>
                        <input
                          type="text"
                          value={sh.address}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...(storeSettings.showrooms || [])];
                            updated[sIdx] = { ...updated[sIdx], address: val };
                            setStoreSettings({ ...storeSettings, showrooms: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#707783] block">Số điện thoại</label>
                        <input
                          type="text"
                          value={sh.phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...(storeSettings.showrooms || [])];
                            updated[sIdx] = { ...updated[sIdx], phone: val };
                            setStoreSettings({ ...storeSettings, showrooms: updated });
                          }}
                          className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ORDER DETAIL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E5E8EC] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#141923]">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                <p className="text-xs text-[#707783] mt-0.5">Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#707783] hover:text-[#141923] rounded-lg transition"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Customer info */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] space-y-2">
                <div className="font-bold text-[#141923]">Thông tin giao hàng:</div>
                <div className="grid grid-cols-2 gap-2 text-[#707783]">
                  <div>Người nhận: <span className="font-bold text-[#141923]">{selectedOrder.customerName}</span></div>
                  <div>SĐT: <span className="font-bold text-[#141923]">{selectedOrder.phone}</span></div>
                  <div className="col-span-2">Địa chỉ: <span className="font-bold text-[#141923]">{selectedOrder.address}</span></div>
                  {selectedOrder.note && (
                    <div className="col-span-2">Ghi chú: <span className="italic text-[#141923]">{selectedOrder.note}</span></div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="p-4 bg-[#EAF4FA] rounded-xl border border-[#0275A9]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0275A9]">Trạng thái đơn hàng:</div>
                  <div className="mt-1"><OrderStatusBadge status={selectedOrder.status} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#707783]">Đổi thành:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold border border-[#0275A9] rounded-xl bg-white text-[#0275A9] focus:outline-none"
                  >
                    <option value="pending_qr">Chờ QR</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="font-bold text-[#141923] mb-2">Sản phẩm đặt mua ({selectedOrder.items?.length || 0}):</div>
                <div className="divide-y divide-[#E5E8EC] border border-[#E5E8EC] rounded-xl overflow-hidden">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <img src={it.img} alt="" className="w-10 h-10 object-contain rounded p-1 border" onError={(e) => { e.target.onerror = null; e.target.src = "src/assets/img/phone-iphone-16-pro.png"; }} />
                        <div>
                          <div className="font-bold text-[#141923]">{it.name}</div>
                          <div className="text-[11px] text-[#707783]">Số lượng: {it.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-[#0275A9]">{formatVND(it.price * (it.quantity || 1))}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E8EC] space-y-1.5">
                <div className="flex justify-between text-[#707783]">
                  <span>Tạm tính:</span>
                  <span>{formatVND(selectedOrder.subtotal || selectedOrder.total || 0)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Giảm giá voucher:</span>
                    <span>-{formatVND(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#707783]">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#141923] pt-2 border-t border-[#E5E8EC]">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-[#0275A9] text-base">{formatVND(selectedOrder.total || 0)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E8EC] flex items-center justify-between bg-white rounded-b-2xl">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#141923] hover:bg-[#F5F6F8] transition flex items-center gap-2 cursor-pointer no-print"
              >
                <Icon name="printer" className="w-4 h-4" />
                <span>In phiếu giao hàng</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#0275A9] text-white font-bold text-xs rounded-xl hover:bg-[#02628e] transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT FORM */}
      {editingProduct && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
          categories={DEFAULT_CATEGORIES}
          presetImages={PRESET_IMAGES}
        />
      )}

      {/* MODAL: ADD VOUCHER */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-extrabold text-base text-[#141923] mb-4">Tạo mã ưu đãi mới</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                handleCreateVoucher({
                  code: form.code.value.trim().toUpperCase(),
                  type: form.type.value,
                  discount: Number(form.discount.value) || 0,
                  minSpend: Number(form.minSpend.value) || 0,
                  desc: form.desc.value.trim(),
                  expiry: form.expiry.value.trim() || "31/12/2026",
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[#141923] font-bold mb-1">Mã Code (In hoa) *</label>
                <input
                  name="code"
                  required
                  placeholder="Ví dụ: SALE50K"
                  className="w-full px-3 py-2 border rounded-xl font-bold uppercase focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#141923] font-bold mb-1">Loại giảm *</label>
                  <select name="type" className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none">
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="freeship">Miễn phí ship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#141923] font-bold mb-1">Mức giảm *</label>
                  <input
                    name="discount"
                    type="number"
                    required
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-xl focus:border-[#0275A9] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#141923] font-bold mb-1">Đơn tối thiểu (VNĐ)</label>
                <input
                  name="minSpend"
                  type="number"
                  placeholder="500000"
                  className="w-full px-3 py-2 border rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#141923] font-bold mb-1">Mô tả hiển thị</label>
                <input
                  name="desc"
                  placeholder="Giảm 50.000₫ cho đơn hàng công nghệ từ 500k"
                  className="w-full px-3 py-2 border rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#141923] font-bold mb-1">Hạn sử dụng</label>
                <input
                  name="expiry"
                  defaultValue="31/12/2026"
                  className="w-full px-3 py-2 border rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold hover:bg-[#F5F6F8]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0275A9] text-white font-bold rounded-xl hover:bg-[#02628e]"
                >
                  Lưu voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOẠN THẢO BÀI VIẾT */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E5E8EC] flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#141923]">
                {editingArticle.id ? "Chỉnh sửa bài viết" : "Soạn bài viết công nghệ mới"}
              </h3>
              <button
                onClick={() => { setIsArticleModalOpen(false); setEditingArticle(null); }}
                className="p-1.5 text-[#707783] hover:text-[#141923] rounded-lg transition"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#141923] block mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={editingArticle.title || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#141923] block mb-1">Chuyên mục</label>
                  <select
                    value={editingArticle.category || "TƯ VẤN MUA"}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none bg-white"
                  >
                    <option value="TƯ VẤN MUA">TƯ VẤN MUA</option>
                    <option value="PHONG CÁCH SỐ">PHONG CÁCH SỐ</option>
                    <option value="MẸO CÔNG NGHỆ">MẸO CÔNG NGHỆ</option>
                    <option value="ĐÁNH GIÁ">ĐÁNH GIÁ</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#141923] block mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={editingArticle.author || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    placeholder="BTV Hoàng Sơn"
                    className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-[#141923] block mb-1">Đường dẫn ảnh bìa</label>
                <input
                  type="text"
                  value={editingArticle.img || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, img: e.target.value })}
                  placeholder="src/assets/img/article-1.png"
                  className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#141923] block mb-1">Đoạn tóm tắt (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#141923] block mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={5}
                  value={editingArticle.content || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Nội dung bài viết đầy đủ..."
                  className="w-full px-3.5 py-2 border border-[#CBD5E1] rounded-xl focus:border-[#0275A9] focus:outline-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-[#E5E8EC] bg-[#F8FAFC] flex justify-end gap-3">
              <button
                onClick={() => { setIsArticleModalOpen(false); setEditingArticle(null); }}
                className="px-4 py-2 border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#707783] hover:bg-white transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSaveArticle(editingArticle)}
                className="px-5 py-2 bg-[#0275A9] text-white rounded-xl text-xs font-bold hover:bg-[#02628e] transition shadow-sm cursor-pointer"
              >
                Lưu bài viết
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
  