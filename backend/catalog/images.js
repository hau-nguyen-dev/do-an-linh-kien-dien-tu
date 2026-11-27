// Kế hoạch ảnh của mỗi sản phẩm trong danh mục mẫu: dùng chung cho bước vẽ ảnh (tools/catalog)
// và bước dựng dữ liệu (build.js), để đường dẫn ảnh trong CSDL luôn khớp file đã vẽ.

export const IMAGE_ROOT = 'src/assets/img/products';
const MAX_COLOR_SHOTS_IN_ALBUM = 3;

export function imagePath(productId, fileName) {
  return `${IMAGE_ROOT}/${productId}/${fileName}`;
}

export function colorImagePath(productId, colorIndex) {
  return imagePath(productId, `mau-${colorIndex + 1}.svg`);
}

/**
 * Danh sách ảnh cần vẽ cho một sản phẩm.
 * - Mỗi màu một ảnh mặt trước (dùng làm ảnh của biến thể màu đó).
 * - Album: tối đa 3 ảnh màu + ảnh mặt sau + (ảnh góc nghiêng nếu chỉ có 1 màu) + thẻ thông số = 4-5 ảnh.
 */
export function imagePlan(product) {
  const colorShots = product.colors.map((color, index) => ({
    view: 'front',
    color,
    file: colorImagePath(product.id, index),
  }));
  const firstColor = product.colors[0];
  const extraShots = [{ view: 'back', color: firstColor, file: imagePath(product.id, 'mat-sau.svg') }];
  if (product.colors.length === 1) {
    extraShots.push({ view: 'side', color: firstColor, file: imagePath(product.id, 'goc-nghieng.svg') });
  }
  extraShots.push({ view: 'card', color: firstColor, file: imagePath(product.id, 'thong-so.svg') });

  return {
    all: [...colorShots, ...extraShots],
    album: [...colorShots.slice(0, MAX_COLOR_SHOTS_IN_ALBUM), ...extraShots].map((shot) => shot.file),
  };
}
