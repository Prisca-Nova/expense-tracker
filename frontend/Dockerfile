# Use Nginx as the base image
FROM nginx:alpine

# Copy frontend files to Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

