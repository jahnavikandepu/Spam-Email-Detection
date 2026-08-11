# SpamGuard - Express REST API Backend

Node.js + Express backend service for the SpamGuard Spam Email Detection project.

## Features
- REST APIs for email prediction (`POST /api/predict`), prediction history (`GET /api/history`), item details (`GET /api/history/:id`), clearing history (`DELETE /api/history`), single item deletion (`DELETE /api/history/:id`), and statistics (`GET /api/stats`).
- MongoDB persistence with Mongoose.
- Inter-service communication with FastAPI ML service via HTTP.

## How to Run

```bash
cd backend
npm install
npm run dev
```

Server runs at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`
