FROM nginx:alpine

# Copy nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the application files to nginx's default serving directory
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY grade_analytics_logo.svg /usr/share/nginx/html/

# Set proper permissions
RUN chmod 644 /usr/share/nginx/html/* && \
    chown -R nginx:nginx /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Use daemon off to run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]