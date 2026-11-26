import './config/env.js';
import express from 'express';
import cors from 'cors';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { ensureAdminSeed, guardWrites } from './middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Chỉ tin header X-Forwarded-For khi chạy sau reverse proxy của hosting (đặt TRUST_PROXY=1),
// nếu không khách có thể giả IP để né giới hạn đăng nhập sai.
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}
ensureAdminSeed();

// Middleware & CORS PNA Support (Ho tro file:/// va localhost)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Mọi thao tác ghi (POST/PUT/DELETE) đều cần đăng nhập admin, trừ danh sách công khai của khách hàng
app.use('/api', guardWrites);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Modular Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', settingRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const details = process.env.NODE_ENV === 'production' ? undefined : err.message;
  res.status(500).json({ error: 'Lỗi máy chủ nội bộ', details });
});

// Start Server (Bind 0.0.0.0 de ho tro mang LAN & moi truong Online)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NÉT. Express Backend Server running on http://localhost:${PORT}`);
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`🌐 LAN Storefront: http://${net.address}:${PORT}/index.html`);
        console.log(`🌐 LAN Admin:      http://${net.address}:${PORT}/admin.html`);
      }
    }
  }
});
