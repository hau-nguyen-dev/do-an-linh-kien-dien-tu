export const AVAILABLE_VOUCHERS = [
  { code: 'NETNEW', discountType: 'fixed', value: 200000, desc: 'Giảm 200.000₫ cho khách hàng mới', minOrder: 1000000 },
  { code: 'FREESHIP', discountType: 'shipping', value: 30000, desc: 'Miễn phí vận chuyển toàn quốc', minOrder: 500000 },
  { code: 'NET100', discountType: 'fixed', value: 100000, desc: 'Giảm 100.000₫ cho đơn từ 2.000.000₫', minOrder: 2000000 },
  { code: 'NETVIP', discountType: 'percent', value: 5, maxDiscount: 1000000, desc: 'Giảm 5% tối đa 1.000.000₫ cho hội viên', minOrder: 5000000 },
];
