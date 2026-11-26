import { Router } from 'express';
import {
  authenticateAdmin,
  changeAdminPassword,
  isValidNewPassword,
  issueToken,
  requireAdmin,
} from '../middleware/adminAuth.js';
import { createFailureLimiter } from '../middleware/failureLimiter.js';

const router = Router();

const loginLimiter = createFailureLimiter({ maxFailures: 5, windowMs: 15 * 60 * 1000 });

// POST /api/admin/login
router.post('/login', (req, res) => {
  // Giới hạn theo cả IP lẫn tên đăng nhập để không né được bằng cách đổi IP
  const username = String(req.body?.username || '').trim();
  const keys = [`ip:${req.ip}`, `user:${username.toLowerCase()}`];
  if (keys.some((key) => loginLimiter.isLocked(key))) {
    return res.status(429).json({ success: false, message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  }

  const password = String(req.body?.password || '');
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  if (!authenticateAdmin(username, password)) {
    keys.forEach((key) => loginLimiter.record(key));
    return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  keys.forEach((key) => loginLimiter.clear(key));
  res.json({ success: true, token: issueToken(username), username });
});

// GET /api/admin/me - kiểm tra token còn hiệu lực
router.get('/me', requireAdmin, (req, res) => {
  res.json({ success: true, username: req.admin.sub });
});

// POST /api/admin/change-password
router.post('/change-password', requireAdmin, (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');

  if (!authenticateAdmin(req.admin.sub, currentPassword)) {
    return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
  }
  if (!isValidNewPassword(newPassword)) {
    return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
  }
  changeAdminPassword(req.admin.sub, newPassword);
  res.json({ success: true, message: 'Đã đổi mật khẩu.' });
});

export default router;
