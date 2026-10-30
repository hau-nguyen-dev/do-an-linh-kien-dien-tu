with open('backend/routes/productRoutes.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = [
    "  const coTraGop = p.isInstallment !== undefined ? (p.isInstallment ? 1 : 0) : (p.coTraGop !== undefined ? (p.coTraGop ? 1 : 0) : current.co_tra_gop);\n",
    "  const hinhAnh = p.img ?? p.hinhAnh ?? current.hinh_anh;\n",
    "  const baiVietMoTa = p.desc ?? p.baiVietMoTa ?? current.bai_viet_mo_ta;\n",
    "  const tonKho = p.stock !== undefined ? Number(p.stock) : (p.tonKho !== undefined ? Number(p.tonKho) : current.ton_kho);\n",
    "  const albumAnh = (p.gallery !== undefined) ? JSON.stringify(p.gallery) : ((p.albumAnh !== undefined) ? JSON.stringify(p.albumAnh) : current.album_anh);\n",
    "  const nhomPhanLoai = (p.variantGroups !== undefined) ? JSON.stringify(p.variantGroups) : ((p.nhomPhanLoai !== undefined) ? JSON.stringify(p.nhomPhanLoai) : current.nhom_phan_loai);\n",
    "  const bienThe = (p.variants !== undefined) ? JSON.stringify(p.variants) : ((p.bienThe !== undefined) ? JSON.stringify(p.bienThe) : current.bien_the);\n",
    "  const thongSoKyThuat = (p.specsDetailed !== undefined) ? JSON.stringify(p.specsDetailed) : ((p.thongSoKyThuat !== undefined) ? JSON.stringify(p.thongSoKyThuat) : current.thong_so_ky_thuat);\n",
    "  const thongSoNgan = p.specsShort !== undefined ? p.specsShort : (p.thongSoNgan !== undefined ? p.thongSoNgan : current.thong_so_ngan);\n",
    "  const quaTang = p.gift !== undefined ? p.gift : (p.quaTang !== undefined ? p.quaTang : current.qua_tang);\n",
    "  const huyHieu = p.badge !== undefined ? p.badge : (p.huyHieu !== undefined ? p.huyHieu : current.huy_hieu);\n",
    "  const trangThai = p.status ?? p.trangThai ?? current.trang_thai;\n"
]

# Find where 'const coTraGop' starts
start_idx = None
for i, l in enumerate(lines):
    if 'const coTraGop =' in l:
        start_idx = i
        break

if start_idx is not None:
    lines[start_idx:start_idx+12] = new_block
    with open('backend/routes/productRoutes.js', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Updated backend/routes/productRoutes.js successfully!")
else:
    print("Could not find coTraGop in productRoutes.js")

