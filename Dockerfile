# Image chạy backend Express (+ phục vụ giao diện web trong thư mục frontend).
# node:sqlite có sẵn trong Node 24, không cần cài thêm thư viện SQLite.
FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# Cài thư viện trước để Docker cache được khi chỉ sửa mã nguồn
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY frontend ./frontend

# Fly.io định tuyến vào cổng này (khớp internal_port trong fly.toml)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "backend/server.js"]
