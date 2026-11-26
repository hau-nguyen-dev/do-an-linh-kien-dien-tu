import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Nạp backend/.env (nếu có) trước mọi module khác đọc process.env.
// Trên hosting, biến môi trường được cấp trực tiếp nên file .env có thể không tồn tại.
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
try {
  process.loadEnvFile(envPath);
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.warn('[Env] Không đọc được backend/.env:', err.message);
  }
}
