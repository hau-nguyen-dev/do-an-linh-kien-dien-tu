/**
 * Phân tích hash route URL của trình duyệt thành route object
 * Hỗ trợ các trang: home, pdp, category, checkout, order-success, orders
 */
export function parseRoute(hashString) {
  const hash = hashString ? hashString.replace(/^#\/?/, "") : "";
  if (!hash) return { page: "home" };

  const parts = hash.split("/");
  if (parts[0] === "product" && parts[1]) {
    return { page: "pdp", productId: parts[1] };
  }
  if (parts[0] === "category" && parts[1]) {
    return { page: "category", categorySlug: parts[1] };
  }
  if (parts[0] === "checkout") {
    return { page: "checkout" };
  }
  if (parts[0] === "order-success" && parts[1]) {
    return { page: "order-success", orderId: parts[1] };
  }
  if (parts[0] === "orders") {
    return { page: "orders" };
  }
  return { page: "home" };
}
