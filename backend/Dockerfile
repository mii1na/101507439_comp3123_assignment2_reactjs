FROM node:24-bookworm-slim

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend application
COPY . .

# Backend API port
EXPOSE 5001

# Start Express server
CMD ["npm", "start"]
