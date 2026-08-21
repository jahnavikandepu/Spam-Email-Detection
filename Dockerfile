# Use official Node.js 20 Debian slim image
FROM node:20-slim

# Install Python 3, pip, and minimal build utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt || pip3 install --no-cache-dir -r requirements.txt

# Copy Node.js backend package manifest and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy Express backend source code and Python prediction script & trained model artifacts
COPY backend/src ./backend/src
COPY backend/services ./backend/services
COPY backend/predict.py ./backend/predict.py
COPY backend/model ./backend/model

# Production environment configuration
ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_EXECUTABLE=python3

# Expose backend port
EXPOSE 5000

# Start Express application server
CMD ["node", "backend/src/server.js"]
