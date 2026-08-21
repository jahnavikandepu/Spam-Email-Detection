FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend application
COPY . .

ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_EXECUTABLE=python3

EXPOSE 5000

CMD ["node", "src/server.js"]