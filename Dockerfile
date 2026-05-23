# Use the official lightweight Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first so Docker can cache the npm install layer.
# This layer is only rebuilt when package.json or package-lock.json changes.
COPY package*.json ./

# Install only production dependencies (skip devDependencies)
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# Cloud Run (and most GCP services) route traffic to port 8080
EXPOSE 8080

# Start the Express server
CMD ["node", "app.js"]
