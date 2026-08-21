# Use official Node.js 20 Debian slim image
FROM node:20-slim

# Install Python 3 and pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements.txt and install Python libraries
COPY ../requirements.txt ./requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt || pip3 install --no-cache-dir -r requirements.txt

# Copy package files and install Node packages
COPY package*.json ./
RUN npm install --production

# Copy backend files (excluding dataset & train.py via .dockerignore)
COPY . .

ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_EXECUTABLE=python3

EXPOSE 5000

CMD ["node", "src/server.js"]
