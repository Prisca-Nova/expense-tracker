FROM node:18

WORKDIR /app

# Copy only backend package files first
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code - including all subdirectories
COPY backend/ ./

# Create public directory and copy frontend files
COPY frontend/public/ ./public/

EXPOSE 5000

CMD ["npm", "start"]