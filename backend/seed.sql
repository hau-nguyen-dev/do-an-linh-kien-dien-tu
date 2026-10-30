-- =============================================================================
-- NÉT. Tech Store - Initial Seed Data (100% Real Production Data)
-- =============================================================================

-- 1. XÓA DỮ LIỆU CŨ TRƯỚC KHI NẠP
DELETE FROM products;
DELETE FROM categories;
DELETE FROM vouchers;
DELETE FROM banners;
DELETE FROM articles;
DELETE FROM faqs;
DELETE FROM store_settings;

-- 2. NẠP DANH MỤC
INSERT INTO categories (slug, name, count, icon, link) VALUES ('phones', 'Điện thoại', '128 sản phẩm', 'smartphone', '#/category/phones');
INSERT INTO categories (slug, name, count, icon, link) VALUES ('laptops', 'Laptop', '86 sản phẩm', 'laptop', '#/category/laptops');
INSERT INTO categories (slug, name, count, icon, link) VALUES ('tablets', 'Máy tính bảng', '45 sản phẩm', 'tablet', '#/category/tablets');
INSERT INTO categories (slug, name, count, icon, link) VALUES ('audio', 'Âm thanh', '112 sản phẩm', 'headphones', '#/category/audio');
INSERT INTO categories (slug, name, count, icon, link) VALUES ('watches', 'Đồng hồ', '64 sản phẩm', 'watch', '#/category/watches');
INSERT INTO categories (slug, name, count, icon, link) VALUES ('accessories', 'Phụ kiện', '320 sản phẩm', 'cable', '#/category/accessories');

-- 3. NẠP MÃ GIẢM GIÁ
INSERT INTO vouchers (code, discount_type, discount_value, min_order, description) VALUES ('NETNEW', 'fixed', 200000, 1000000, 'Giảm 200.000₫ cho khách hàng mới');
INSERT INTO vouchers (code, discount_type, discount_value, min_order, description) VALUES ('FREESHIP', 'shipping', 30000, 500000, 'Miễn phí vận chuyển toàn quốc');
INSERT INTO vouchers (code, discount_type, discount_value, min_order, description) VALUES ('NET100', 'fixed', 100000, 2000000, 'Giảm 100.000₫ cho đơn từ 2.000.000₫');
INSERT INTO vouchers (code, discount_type, discount_value, min_order, description) VALUES ('NETVIP', 'percent', 5, 5000000, 'Giảm 5% tối đa 1.000.000₫ cho hội viên');

-- 4. NẠP 8 SẢN PHẨM CÔNG NGHỆ THỰC TẾ (100% TIẾNG VIỆT THUẦN)
INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('p1', 'iphone-16-pro', 'iPhone 16 Pro', 'Apple iPhone 16 Pro 128GB Chính Hãng VN/A', 'apple', 'Apple', 'phones', 'Điện thoại', 28490000, 29990000, 'src/assets/img/phone-iphone-16-pro.png', '["src/assets/img/phone-iphone-16-pro.png","src/assets/img/hero-iphone-16-pro.png","src/assets/img/banner-accessories.png"]', 4.9, 3, 'Apple A18 Pro · Super Retina XDR 120Hz · Fusion 48MP', 'Tặng gói bảo hành VIP 12 tháng chính hãng', 'TRẢ GÓP 0%', '<h3>1. Thiết kế Titan thế hệ mới với viền màn hình siêu mỏng</h3>
<p>iPhone 16 Pro đánh dấu bước chuyển mình vượt bậc trong ngôn ngữ thiết kế của Apple. Sở hữu khung viền chế tác từ <strong>Titan Hạng 5</strong> với lớp hoàn thiện phủ vi hạt tinh xảo, máy không chỉ mang lại độ cứng cáp ấn tượng mà còn có trọng lượng tối ưu chỉ 199g. Điểm nổi bật nhất ở mặt trước chính là phần viền màn hình mỏng nhất từng xuất hiện trên bất kỳ thiết bị Apple nào, giúp mở rộng không gian hiển thị lên 6.3 inch mà kích thước tổng thể máy gần như không đổi so với thế hệ trước.</p>

<p>Màn hình <strong>Super Retina XDR OLED</strong> với công nghệ <strong>ProMotion 120Hz</strong> đem lại trải nghiệm vuốt chạm mượt mà đỉnh cao. Độ sáng tối đa ngoài trời lên tới 2000 nits giúp bạn dễ dàng theo dõi bản đồ hay chụp ảnh ngay dưới ánh nắng gắt.</p>

<h3>2. Nút Điều Khiển Camera (Camera Control) - Thao tác nhiếp ảnh chuyên nghiệp</h3>
<p>Lần đầu tiên trên dòng iPhone Pro, Apple trang bị nút bấm cảm ứng lực <em>Camera Control</em> ở cạnh phải máy. Người dùng có thể trượt ngón tay để zoom mượt mà, nhấn nhẹ để khóa nét và nhấn đúp để chuyển đổi giữa các ống kính hoặc chế độ đo sáng. Đây là công cụ đắc lực cho những nhà sáng tạo nội dung và nhiếp ảnh gia đường phố.</p>

<p>Cụm camera Fusion 48MP thế hệ thứ 2 mang đến cảm biến Quad-Pixel nhanh hơn, cho phép quay video <strong>4K 120 fps chuẩn Dolby Vision</strong> - tính năng chưa từng có trên bất kỳ smartphone nào trên thế giới. Ống kính Telephoto 5x sử dụng lăng kính tứ diện phản xạ (Tetraprism) hỗ trợ chụp ảnh chân dung từ xa sắc nét đến từng sợi tóc.</p>

<h3>3. Hiệu năng vượt giới hạn với chip Apple A18 Pro</h3>
<p>Trái tim của iPhone 16 Pro là vi xử lý <strong>Apple A18 Pro</strong> được sản xuất trên tiến trình 3nm thế hệ thứ 2. Với CPU 6 nhân mạnh hơn 15% và tiết kiệm điện 20%, cùng GPU 6 nhân hỗ trợ công nghệ Ray Tracing bằng phần cứng nhanh gấp 2 lần, máy dễ dàng cân mượt các tựa game đồ họa AAA đỉnh cao như Resident Evil 4 hay Death Stranding.</p>

<ul>
  <li><strong>Apple Intelligence:</strong> Hệ thống trí tuệ cá nhân hóa hỗ trợ tóm tắt email, sửa văn phong và tạo biểu tượng Genmoji tức thì.</li>
  <li><strong>Cổng USB-C tốc độ cao:</strong> Tốc độ truyền tải lên đến 10Gb/s (USB 3), hỗ trợ xuất trực tiếp video ProRes sang ổ cứng SSD gắn ngoài.</li>
  <li><strong>Pin bền bỉ:</strong> Thời lượng xem video liên tục đạt tới 27 giờ, cải tiến vượt trội giúp bạn yên tâm làm việc cả ngày dài.</li>
</ul>', '[{"id":"desert","name":"Titan Sa Mạc","hex":"#C5B29F"},{"id":"natural","name":"Titan Tự Nhiên","hex":"#9E9A95"},{"id":"white","name":"Titan Trắng","hex":"#E3E4E5"},{"id":"black","name":"Titan Đen","hex":"#3C3B3A"}]', '[{"id":"128gb","label":"128 GB","priceDiff":0},{"id":"256gb","label":"256 GB","priceDiff":3000000},{"id":"512gb","label":"512 GB","priceDiff":7500000},{"id":"1tb","label":"1 TB","priceDiff":12000000}]', '{"Màn hình": "6.3 inch, Super Retina XDR OLED, 120Hz ProMotion, 2000 nits đỉnh", "Vi xử lý (CPU)": "Apple A18 Pro 6 nhân (3nm thế hệ 2), GPU 6 nhân với Ray Tracing", "RAM": "8 GB", "Camera sau": "Chính 48MP Fusion + Góc siêu rộng 48MP + Telephoto 5x 12MP", "Camera trước": "12MP TrueDepth với Autofocus", "Pin & Công nghệ sạc": "Thời lượng xem video lên tới 27 giờ, Sạc nhanh 50% trong 30 phút", "Hệ điều hành": "iOS 18 tích hợp Apple Intelligence", "Trọng lượng": "199 g", "Kết nối & Tiện ích": "5G, Wi-Fi 7, Bluetooth 5.3, Cổng USB-C tốc độ 10Gb/s"}', '[{"id":"r1","author":"Hoàng Minh","date":"20/10/2026","rating":5,"content":"Màu titan sa mạc bên ngoài nhìn sang chảnh hơn trong ảnh nhiều. Máy cầm đầm tay, viền màn hình siêu mỏng, camera zoom 5x sắc nét tuyệt vời!"},{"id":"r2","author":"Thanh Hằng","date":"18/10/2026","rating":5,"content":"Giao hàng hỏa tốc 2h của nét. rất nhanh. Nhân viên tư vấn nhiệt tình, đóng gói cẩn thận và có đầy đủ hóa đơn VAT điện tử."},{"id":"r3","author":"Tuấn Anh","date":"14/10/2026","rating":4.8,"content":"Pin trâu hơn đời 15 Pro rõ rệt. Nút Camera Control ban đầu hơi lạ nhưng quen rồi thì chụp ảnh cực kỳ tiện."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('p2', 'samsung-galaxy-s24-ultra', 'Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra 12GB 256GB Chính Hãng', 'samsung', 'Samsung', 'phones', 'Điện thoại', 29990000, 33990000, 'src/assets/img/phone-samsung-s24.png', '["src/assets/img/phone-samsung-s24.png","src/assets/img/hero-iphone-16-pro.png"]', 5.0, 1, 'Snapdragon 8 Gen 3 · 200MP Zoom 100x · Màn chống chói', 'Tặng củ sạc nhanh 45W chính hãng trị giá 990.000₫', 'TRẢ GÓP 0%', '<h3>1. Quyền năng Galaxy AI đỉnh cao - Trợ lý thông minh trong lòng bàn tay</h3>
<p>Samsung Galaxy S24 Ultra định hình kỷ nguyên smartphone AI thế hệ mới với bộ công cụ <strong>Galaxy AI</strong> độc quyền. Tính năng <em>Khoanh tròn để tìm kiếm (Circle to Search)</em> hợp tác cùng Google cho phép bạn tra cứu bất kỳ vật thể nào trên màn hình chỉ bằng một vòng tròn vẽ bằng ngón tay hoặc bút S-Pen. Bên cạnh đó, tính năng <em>Dịch trực tiếp hai chiều cuộc gọi</em> phá vỡ hoàn toàn rào cản ngôn ngữ khi làm việc quốc tế.</p>

<h3>2. Màn hình phẳng chống chói toàn diện & Khung viền Titan siêu bền</h3>
<p>Trang bị kính cường lực <strong>Corning Gorilla Armor</strong> độc quyền giúp giảm độ phản xạ ánh sáng bề mặt lên tới 75%, Galaxy S24 Ultra mang lại khả năng hiển thị ngoài trời sắc nét, không bị lóa mắt. Tấm nền Dynamic AMOLED 2X kích thước 6.8 inch với độ sáng cực đại 2600 nits và tần số quét thích ứng 1-120Hz tái hiện màu sắc sống động và tiết kiệm điện năng tối đa.</p>

<h3>3. Hệ thống Camera Mắt Thần Bóng Đêm 200MP & Zoom Quad Tele</h3>
<p>Cảm biến chính 200MP được tăng cường thuật toán xử lý ảnh ProVisual Engine mang lại những bức ảnh chi tiết sắc nét ngay cả trong điều kiện thiếu sáng. Hệ thống zoom quang học kép 3x và 5x kết hợp AI Zoom cho phép thu phóng rõ nét đến 100x.</p>', '[{"id":"grey","name":"Xám Titan","hex":"#7E7F83"},{"id":"black","name":"Đen Titan","hex":"#2E2F32"},{"id":"violet","name":"Tím Titan","hex":"#635B74"},{"id":"yellow","name":"Vàng Titan","hex":"#E5D9BC"}]', '[{"id":"256gb","label":"256 GB","priceDiff":0},{"id":"512gb","label":"512 GB","priceDiff":4000000},{"id":"1tb","label":"1 TB","priceDiff":8000000}]', '{"Màn hình": "6.8 inch, Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits, Kính chống chói Gorilla Armor", "Vi xử lý (CPU)": "Snapdragon 8 Gen 3 for Galaxy (4nm)", "RAM": "12 GB LPDDR5X", "Camera sau": "Chính 200MP OIS + 50MP Periscope 5x + 10MP Tele 3x + 12MP Ultra-wide", "Camera trước": "12MP Dual Pixel AF", "Pin & Công nghệ sạc": "5000 mAh, Sạc siêu nhanh 45W, Sạc không dây 15W", "Hệ điều hành": "Android 14, One UI 6.1 tích hợp Galaxy AI", "Trọng lượng": "232 g", "Bút S-Pen & Tiện ích": "Tích hợp bút S-Pen điều khiển từ xa, Kháng nước IP68, Wi-Fi 7"}', '[{"id":"r4","author":"Bảo Long","date":"21/10/2026","rating":5,"content":"Màn hình phẳng chống chói xuất sắc nhất hiện nay, ra ngoài trời nắng xem cực rõ. Bút S-Pen ký tài liệu rất tiện cho công việc."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('p3', 'xiaomi-14t-pro', 'Xiaomi 14T Pro 5G', 'Xiaomi 14T Pro 5G 12GB 512GB Ống Kính Leica', 'xiaomi', 'Xiaomi', 'phones', 'Điện thoại', 16490000, 17990000, 'src/assets/img/phone-xiaomi-14t.png', '["src/assets/img/phone-xiaomi-14t.png"]', 5.0, 1, 'Dimensity 9300+ · Leica Summilux · Sạc 120W HyperCharge', 'Tặng tai nghe không dây Redmi Buds 5 Pro', 'TRẢ GÓP 0%', 'Ống kính quang học Leica Summilux đỉnh cao cùng cảm biến hình ảnh Light Fusion 900. Sức mạnh bùng nổ từ vi xử lý MediaTek Dimensity 9300+ và công nghệ sạc thần tốc 120W chỉ 19 phút đầy 100%.', '[{"id":"black","name":"Đen Titan","hex":"#34383D"},{"id":"grey","name":"Xám Titan","hex":"#7D8289"},{"id":"blue","name":"Xanh Titan","hex":"#5C6A7B"}]', '[{"id":"256gb","label":"256 GB","priceDiff":0},{"id":"512gb","label":"512 GB","priceDiff":1500000}]', '{"Màn hình": "6.67 inch, AMOLED 1.5K, 144Hz, 4000 nits đỉnh, Dolby Vision", "Vi xử lý (CPU)": "MediaTek Dimensity 9300+ (4nm)", "RAM": "12 GB LPDDR5X", "Ống kính Camera": "Leica Summilux: 50MP Chính + 50MP Tele 2.6x + 12MP Siêu rộng", "Camera trước": "32MP Góc rộng", "Pin & Sạc nhanh": "5000 mAh, Sạc có dây 120W HyperCharge (19 phút đầy 100%), Sạc không dây 50W", "Hệ điều hành": "Xiaomi HyperOS", "Kháng nước & Trọng lượng": "Kháng bụi nước chuẩn IP68, Trọng lượng 209 g"}', '[{"id":"r5","author":"Khánh Duy","date":"19/10/2026","rating":5,"content":"Sạc 120W dùng sướng không thể tả, cắm 15 phút rửa mặt xong là đầy pin. Nước ảnh Leica chụp chân dung có chiều sâu rất riêng."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('p4', 'oppo-reno-12-5g', 'OPPO Reno 12 5G', 'OPPO Reno 12 5G 12GB 256GB Chuyên Gia Chân Dung AI', 'oppo', 'OPPO', 'phones', 'Điện thoại', 11490000, 12990000, 'src/assets/img/phone-oppo-reno12.png', '["src/assets/img/phone-oppo-reno12.png"]', 5.0, 1, 'Dimensity 7300-Energy · AI Portrait · Chống va đập 360°', 'Tặng loa Bluetooth Olike S4 thời trang', 'TRẢ GÓP 0%', 'Thiết kế dòng chảy bạc tương lai cực mỏng nhẹ. Hệ thống camera AI chân dung xóa phông tự nhiên và bộ công cụ AI xóa vật thể thông minh. Độ bền chuẩn quân đội chống va đập 360 độ.', '[{"id":"silver","name":"Bạc Vũ Trụ","hex":"#D6D9E0"},{"id":"brown","name":"Nâu Hoàng Hôn","hex":"#5E4A43"}]', '[{"id":"256gb","label":"256 GB","priceDiff":0},{"id":"512gb","label":"512 GB","priceDiff":1500000}]', '{"Màn hình": "6.7 inch, 3D Curved AMOLED, 120Hz, FHD+, HDR10+", "Vi xử lý (CPU)": "MediaTek Dimensity 7300-Energy (4nm)", "RAM": "12 GB (+12GB RAM mở rộng ảo)", "Camera sau": "50MP Sony LYT-600 OIS + 8MP Góc rộng + 2MP Macro", "Camera trước": "32MP Tự động lấy nét", "Pin & Sạc nhanh": "5000 mAh, Sạc nhanh SuperVOOC 80W", "Hệ điều hành": "ColorOS 14.1 tích hợp bộ công cụ Chân dung AI", "Độ bền & Trọng lượng": "Độ bền chuẩn quân đội chống va đập 360°, Trọng lượng 177 g"}', '[{"id":"r6","author":"Mỹ Linh","date":"17/10/2026","rating":5,"content":"Máy nhẹ và mỏng bất ngờ, màu bạc ánh kim đổi màu dưới nắng đẹp mê. Tính năng AI xóa người lạ trong ảnh hoạt động rất mượt."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('e1', 'macbook-air-13-m3', 'MacBook Air 13 M3', 'Apple MacBook Air 13 inch M3 16GB 256GB Chính Hãng', 'apple', 'Apple', 'laptops', 'Laptop', 24290000, 27990000, 'src/assets/img/eco-macbook-air-m3.png', '["src/assets/img/eco-macbook-air-m3.png","src/assets/img/banner-workspace.png"]', 5.0, 1, 'Apple M3 8-core CPU · 16GB RAM · Mỏng 11.3mm', 'Tặng túi chống sốc Tomtoc cao cấp trị giá 450.000₫', 'ƯU ĐÃI SINH VIÊN', '<h3>1. Sức mạnh vượt trội từ chip Apple M3</h3>
<p>MacBook Air 13 inch được nâng cấp vi xử lý <strong>Apple M3</strong> với 8 nhân CPU và tối đa 10 nhân GPU, được sản xuất trên tiến trình 3nm tiên tiến. Máy cho tốc độ xử lý nhanh hơn 60% so với thế hệ M1 và hỗ trợ công nghệ Ray Tracing cùng Mesh Shading bằng phần cứng, mang lại khả năng render 3D và dựng phim 4K mượt mà trong một thân máy không cần quạt tản nhiệt (hoàn toàn yên tĩnh 100%).</p>

<h3>2. Thiết kế nhôm nguyên khối siêu mỏng nhẹ chỉ 11.3mm</h3>
<p>Với độ dày chỉ 11.3mm và trọng lượng nhẹ 1.24kg, MacBook Air M3 là người bạn đồng hành lý tưởng cho sinh viên, doanh nhân và người làm việc tự do. Bàn phím Magic Keyboard êm ái cùng cảm biến vân tay Touch ID tiện lợi giúp đăng nhập nhanh chóng chỉ bằng một chạm.</p>

<h3>3. Hỗ trợ xuất cùng lúc 2 màn hình ngoài</h3>
<p>Cải tiến lớn nhất được người dùng mong đợi: MacBook Air M3 hỗ trợ kết nối đồng thời <strong>2 màn hình ngoài</strong> ở chế độ gập máy (Clamshell Mode), biến chiếc laptop mỏng nhẹ thành một trạm làm việc đa màn hình chuyên nghiệp tại văn phòng.</p>', '[{"id":"midnight","name":"Midnight (Xanh đen)","hex":"#2E3642"},{"id":"starlight","name":"Starlight (Vàng nhạt)","hex":"#E8E2D5"},{"id":"spacegrey","name":"Space Grey (Xám)","hex":"#7D7E80"},{"id":"silver","name":"Silver (Bạc)","hex":"#E3E4E5"}]', '[{"id":"256gb","label":"16GB / 256GB","priceDiff":0},{"id":"512gb","label":"16GB / 512GB","priceDiff":4500000}]', '{"Màn hình": "13.6 inch, Liquid Retina, 2560 x 1664, 500 nits, Dải màu P3, True Tone", "Vi xử lý (CPU)": "Apple M3 (8 nhân CPU, tối đa 10 nhân GPU, 16 nhân Neural Engine)", "RAM": "16 GB Unified Memory (Bộ nhớ hợp nhất)", "Ổ cứng lưu trữ": "256 GB SSD tốc độ cao", "Cổng kết nối": "Cổng sạc MagSafe 3, 2 cổng Thunderbolt / USB 4, Jack tai nghe 3.5mm", "Thời lượng pin": "52.6 Wh, Thời lượng pin lên tới 18 giờ liên tục", "Trọng lượng": "1.24 kg (Mỏng chỉ 11.3 mm)", "Hệ điều hành": "macOS Sequoia"}', '[{"id":"r7","author":"Văn Đức","date":"22/10/2026","rating":5,"content":"Bản 16GB RAM đa nhiệm thoải mái hơn bản 8GB rất nhiều, mở 30 tab Chrome và Photoshop không hề giật lag. Pin trâu làm việc cả ngày không cần đem theo cục sạc."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('e2', 'ipad-air-m2-11', 'iPad Air M2 11 inch', 'Apple iPad Air 11 inch M2 Wi-Fi 128GB Chính Hãng', 'apple', 'Apple', 'tablets', 'Máy tính bảng', 15490000, 16990000, 'src/assets/img/eco-ipad-air-m2.png', '["src/assets/img/eco-ipad-air-m2.png"]', 5.0, 1, 'Apple M2 · Liquid Retina · Hỗ trợ Apple Pencil Pro', 'Giảm 500.000₫ khi mua kèm bút Apple Pencil Pro', 'MỚI RA MẮT', 'iPad Air nay được tiếp sức mạnh bởi chip Apple M2 với hiệu năng CPU nhanh hơn 17% và GPU nhanh hơn 25%. Màn hình Liquid Retina sắc nét với camera trước chuyển sang cạnh ngang tối ưu cho các cuộc gọi video.', '[{"id":"spacegrey","name":"Xám Không Gian","hex":"#68696E"},{"id":"blue","name":"Xanh Dương","hex":"#B9C7D4"},{"id":"purple","name":"Tím Nhạt","hex":"#D1CDDA"},{"id":"starlight","name":"Vàng Ánh Sao","hex":"#E9E3D6"}]', '[{"id":"128gb","label":"128 GB","priceDiff":0},{"id":"256gb","label":"256 GB","priceDiff":2500000},{"id":"512gb","label":"512 GB","priceDiff":7500000}]', '{"Màn hình": "11 inch, Liquid Retina IPS, 2360 x 1640, 500 nits, True Tone, Chống chói", "Vi xử lý (CPU)": "Apple M2 (8 nhân CPU, 10 nhân GPU, 16 nhân Neural Engine)", "RAM": "8 GB RAM", "Camera": "Sau 12MP Wide 4K + Trước 12MP Ultra-wide góc ngang với Center Stage", "Thời lượng pin": "Lướt web và xem video lên tới 10 giờ qua Wi-Fi", "Phụ kiện tương thích": "Hỗ trợ Apple Pencil Pro, Apple Pencil USB-C, Magic Keyboard", "Trọng lượng": "462 g", "Hệ điều hành": "iPadOS 18"}', '[{"id":"r8","author":"Thùy Trang","date":"16/10/2026","rating":5,"content":"Ghi chép và vẽ vời với Apple Pencil Pro có phản hồi rung quá thật! Màn hình vừa vặn bỏ balo gọn gàng."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('e3', 'sony-wh-1000xm5', 'Sony WH-1000XM5', 'Tai Nghe Chống Ồn Không Dây Sony WH-1000XM5', 'sony', 'Sony', 'audio', 'Âm thanh', 6790000, 8490000, 'src/assets/img/eco-sony-wh1000xm5.png', '["src/assets/img/eco-sony-wh1000xm5.png","src/assets/img/banner-workspace.png"]', 5.0, 1, 'Bộ xử lý kép V1 & QN1 · 30 giờ pin · Âm thanh Hi-Res', 'Tặng bao da bảo vệ chuyên dụng chính hãng Sony', 'CHỐNG ỒN SỐ 1', 'Tai nghe over-ear chống ồn hàng đầu thế giới với 2 bộ xử lý và 8 micro chuyên dụng. Đệm tai da tổng hợp mềm mại ôm trọn vành tai, công nghệ Speak-to-Chat tự động dừng nhạc khi bạn trò chuyện.', '[{"id":"silver","name":"Bạc Ánh Bạch Kim","hex":"#E2DEC9"},{"id":"black","name":"Đen Nhám","hex":"#222326"},{"id":"blue","name":"Xanh Midnight","hex":"#1D2B44"}]', '[{"id":"standard","label":"Tiêu chuẩn","priceDiff":0}]', '{"Thời lượng pin": "Lên tới 30 giờ (bật chống ồn), 40 giờ (tắt chống ồn), Sạc nhanh 3 phút dùng 3 giờ", "Công nghệ chống ồn": "Chống ồn chủ động đỉnh cao với 2 vi xử lý V1 + QN1 và 8 micro định dạng", "Màng loa (Driver)": "30mm thiết kế sợi carbon chính xác, hỗ trợ âm thanh Hi-Res Audio & LDAC", "Chuẩn kết nối": "Bluetooth 5.2, Kết nối đa điểm 2 thiết bị cùng lúc, Jack 3.5mm", "Tính năng thông minh": "Speak-to-Chat tự động dừng nhạc khi bạn cất lời, Đeo vừa vặn êm ái", "Trọng lượng": "250 g"}', '[{"id":"r9","author":"Trần Quân","date":"20/10/2026","rating":5,"content":"Đeo êm như không đeo, cách âm tiếng ồn quán cafe và máy bay gần như 100%. Chất âm ấm áp chi tiết, nghe vocal cực đã."}]', 50, '2026-10-24 13:34:43');

INSERT INTO products (id, slug, name, full_name, brand, brand_label, category, category_label, price, original_price, img, gallery, rating, review_count, specs_short, gift, badge, desc, colors, storage_options, specs_detailed, reviews, stock, created_at) VALUES ('e4', 'apple-watch-series-10', 'Apple Watch Series 10', 'Apple Watch Series 10 Nhôm GPS 46mm Chính Hãng', 'apple', 'Apple', 'watches', 'Đồng hồ', 9420000, 10990000, 'src/assets/img/eco-apple-watch-10.png', '["src/assets/img/eco-apple-watch-10.png"]', 5.0, 1, 'Màn hình OLED góc rộng lớn nhất · Mỏng 9.7mm · Đo ECG', 'Tặng thêm 01 dây đeo thể thao Silicon thể thao trị giá 350.000₫', 'MỎNG NHẤT LỊCH SỬ', 'Đồng hồ mỏng nhất và diện tích hiển thị lớn nhất từng có trên Apple Watch. Màn hình OLED góc nhìn rộng sáng hơn 40%, phát hiện ngưng thở khi ngủ và sạc nhanh lên tới 80% chỉ trong 30 phút.', '[{"id":"jetblack","name":"Đen Bóng (Jet Black)","hex":"#0E0E0E"},{"id":"rosegold","name":"Vàng Hồng","hex":"#E7C5B5"},{"id":"silver","name":"Bạc","hex":"#E3E4E5"}]', '[{"id":"46mm","label":"Kích thước 46 mm","priceDiff":0},{"id":"42mm","label":"Kích thước 42 mm","priceDiff":-700000}]', '{"Kích thước màn hình": "Màn hình OLED góc nhìn rộng luôn bật (Always-On), sáng hơn tới 40% ở góc nghiêng", "Thời lượng pin": "Dùng thông thường 18 giờ, Chế độ nguồn điện thấp 36 giờ, Sạc nhanh 80% trong 30 phút", "Cảm biến sức khỏe": "Cảnh báo ngưng thở khi ngủ, Đo điện tâm đồ ECG, Đo oxy trong máu SpO2, Đo nhiệt độ nước", "Kháng nước & Độ bền": "Kháng nước độ sâu 50m (Bơi lội & Lặn thể thao), Cảm biến đo độ sâu và nhiệt độ nước", "Chất liệu & Độ mỏng": "Thiết kế nhôm mỏng nhất từ trước tới nay chỉ 9.7 mm", "Trọng lượng": "30 g (Bản nhôm 42mm)"}', '[{"id":"r10","author":"Phương Nam","date":"23/10/2026","rating":5,"content":"Bản Jet Black nhôm bóng bẩy nhìn không khác gì bản thép đắt tiền. Màn hình to nhìn chữ rõ ràng hơn hẳn con Series 7 cũ của mình."}]', 50, '2026-10-24 13:34:43');

-- 5. NẠP BANNER CHIẾN DỊCH QUẢNG CÁO
INSERT INTO banners (id, tag, title, description, button_text, button_link, price_text, img, is_active) VALUES (
  'hero',
  '01 / CHIẾN DỊCH CHÍNH',
  'Đỉnh cao.
Trong tầm tay.',
  'Titan sa mạc. Nâng cấp camera 48MP Fusion và chip A18 Pro tối tân. Sẵn sàng cho mọi sáng tạo đỉnh cao.',
  'Khám phá ngay',
  '#/product/p1',
  '28.490.000₫',
  'src/assets/img/hero-iphone-16-pro.png',
  1
);

INSERT INTO banners (id, tag, title, description, button_text, button_link, price_text, img, is_active) VALUES (
  'promo_tradein',
  'THU CŨ ĐỔI MỚI',
  'Máy cũ trao tay.
Trải nghiệm mới tới.',
  'Trợ giá đến 4.000.000₫ khi lên đời điện thoại, thủ tục chỉ 15 phút.',
  'Xem định giá máy',
  '#/category/phones',
  'Trợ giá đến 4.000.000₫',
  'src/assets/img/banner-trade-in.png',
  1
);

INSERT INTO banners (id, tag, title, description, button_text, button_link, price_text, img, is_active) VALUES (
  'promo_accessories',
  'COMBO TIẾT KIỆM',
  'Thêm phụ kiện.
Trọn trải nghiệm.',
  'Giảm đến 40% cho củ sạc, ốp lưng, tai nghe khi mua kèm thiết bị chính.',
  'Mua combo ngay',
  '#/category/accessories',
  'Giảm đến 40%',
  'src/assets/img/banner-accessories.png',
  1
);

-- 6. NẠP BÀI VIẾT & TIN TỨC CÔNG NGHỆ
INSERT INTO articles (id, title, category, read_time, author, date, img, excerpt, content, is_published) VALUES (
  1,
  'Chọn điện thoại theo nhu cầu, đừng chỉ theo thông số',
  'TƯ VẤN MUA',
  '5 phút đọc',
  'BTV Hoàng Sơn',
  '20/10/2026',
  'src/assets/img/article-1.png',
  'Thông số megapixel camera hay dung lượng RAM khủng có thực sự mang lại trải nghiệm mượt mà mỗi ngày? Cùng nét. bóc tách những tiêu chí chọn mua thiết thực nhất.',
  'Khi chọn mua một chiếc smartphone, hầu hết người dùng thường bị choáng ngợp bởi ma trận thông số kỹ thuật: cảm biến 200MP, tần số quét 144Hz, sạc siêu nhanh 120W hay RAM 16GB. Tuy nhiên, sự tối ưu giữa phần cứng và hệ điều hành mới là yếu tố quyết định sự mượt mà sau 2-3 năm sử dụng...',
  1
);

INSERT INTO articles (id, title, category, read_time, author, date, img, excerpt, content, is_published) VALUES (
  2,
  'Những thiết bị đáng mang trong balo cho ngày bận rộn',
  'PHONG CÁCH SỐ',
  '4 phút đọc',
  'Mai Phương',
  '18/10/2026',
  'src/assets/img/article-2.png',
  'Gọn gàng, đa năng và bền bỉ: Điểm danh 5 món đồ công nghệ không thể thiếu để duy trì năng suất làm việc từ văn phòng ra quán cafe.',
  'Làm việc linh hoạt (hybrid working) đòi hỏi các thiết bị vừa nhẹ, vừa có thời lượng pin đủ cho một ngày dài mà không cần cắm sạc liên tục. Một chiếc MacBook Air M3 kết hợp cùng tai nghe chống ồn Sony WH-1000XM5 sẽ biến mọi quán cafe thành không gian làm việc chuyên nghiệp...',
  1
);

INSERT INTO articles (id, title, category, read_time, author, date, img, excerpt, content, is_published) VALUES (
  3,
  'Mẹo tối ưu pin và nhiệt độ giúp laptop dùng bền hơn',
  'MẸO CÔNG NGHỆ',
  '6 phút đọc',
  'KTV Minh Trí',
  '15/10/2026',
  'src/assets/img/article-3.png',
  'Không cần quạt tản nhiệt cồng kềnh, chỉ với 4 thói quen sạc pin đúng chuẩn và thiết lập hệ thống cơ bản, chiếc máy tính của bạn sẽ luôn mát mẻ và bền bỉ.',
  'Pin laptop hao mòn nhanh chủ yếu do 2 kẻ thù: nhiệt độ cao và việc sạc xả liên tục ở mức 0% - 100%. Bằng cách kích hoạt tính năng sạc tối ưu (Optimized Battery Charging) giới hạn ở mức 80%, bạn có thể kéo dài tuổi thọ cell pin lên gấp đôi...',
  1
);

-- 7. NẠP CÂU HỎI THƯỜNG GẶP (FAQS)
INSERT INTO faqs (id, question, answer, order_num) VALUES (
  1,
  '1. Sản phẩm tại nét. có được bảo hành chính hãng toàn quốc không?',
  'Tất cả sản phẩm điện thoại, máy tính, phụ kiện do nét. phân phối đều là hàng chính hãng 100%, có đầy đủ hóa đơn VAT và được áp dụng chính sách bảo hành chính thức tại các Trung tâm ủy quyền hãng (AASP, Samsung Brand Shop, Xiaomi Center) trên toàn quốc.',
  1
);

INSERT INTO faqs (id, question, answer, order_num) VALUES (
  2,
  '2. Chính sách thu cũ đổi mới (Trade-in) trợ giá diễn ra như thế nào?',
  'Bạn chỉ cần mang thiết bị cũ đến bất kỳ chi nhánh nào thuộc hệ thống nét. Kỹ thuật viên sẽ kiểm tra ngoại quan và chức năng trong vòng 15 phút, báo giá minh bạch và trợ giá cộng thêm lên tới 4.000.000₫ trừ trực tiếp vào sản phẩm mới.',
  2
);

INSERT INTO faqs (id, question, answer, order_num) VALUES (
  3,
  '3. Giao hàng hỏa tốc 2 giờ áp dụng tại các khu vực nào?',
  'Dịch vụ giao siêu tốc 2 giờ áp dụng hoàn toàn miễn phí cho đơn hàng từ 2.000.000₫ trong khu vực nội thành Hà Nội và TP. Hồ Chí Minh khi đặt hàng trước 18:00 mỗi ngày.',
  3
);

INSERT INTO faqs (id, question, answer, order_num) VALUES (
  4,
  '4. Chính sách 1 đổi 1 trong 30 ngày có điều kiện gì?',
  'Nếu thiết bị phát sinh lỗi phần cứng từ nhà sản xuất trong vòng 30 ngày đầu tiên tính từ thời điểm nhận hàng, nét. hỗ trợ đổi ngay một thân máy mới 100% cùng model và màu sắc, không phát sinh bất kỳ phụ phí nào.',
  4
);

-- 8. NẠP CẤU HÌNH CỬA HÀNG & THƯƠNG HIỆU
INSERT INTO store_settings (key, value) VALUES ('hotline', '1900 6868');
INSERT INTO store_settings (key, value) VALUES ('announcement', 'Công nghệ bạn thích. Trải nghiệm bạn tin.');
INSERT INTO store_settings (key, value) VALUES ('site_name', 'nét. — CÔNG NGHỆ ĐÚNG GU');
INSERT INTO store_settings (key, value) VALUES ('showrooms', '[
  {"name":"nét. Flagship Tràng Tiền","address":"Số 18 Tràng Tiền, Q. Hoàn Kiếm, Hà Nội","phone":"024 3988 6868"},
  {"name":"nét. Cầu Giấy","address":"142 Cầu Giấy, Q. Cầu Giấy, Hà Nội","phone":"024 3822 6868"},
  {"name":"nét. Flagship Nguyễn Huệ","address":"68 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh","phone":"028 3829 6868"},
  {"name":"nét. Sư Vạn Hạnh","address":"782 Sư Vạn Hạnh, Quận 10, TP. Hồ Chí Minh","phone":"028 3866 6868"}
]');
INSERT INTO store_settings (key, value) VALUES ('usps', '[
  {"title":"Cam kết chính hãng 100% VN/A","icon":"shield-check"},
  {"title":"Giao nhanh 2h nội thành","icon":"truck"},
  {"title":"Trả góp 0% linh hoạt","icon":"credit-card"},
  {"title":"Bảo hành chính hãng 12 tháng","icon":"shield"}
]');


