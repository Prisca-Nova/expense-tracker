# Use Node.js as base image
FROM node:18 AS backend

# Set the working directory
WORKDIR /app

# Copy backend files
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend .

# Create a public directory and copy frontend files
RUN mkdir -p /app/public
COPY frontend/index.html /app/public/index.html
COPY frontend/style.css /app/public/style.css
COPY frontend/script.js /app/public/script.js

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
