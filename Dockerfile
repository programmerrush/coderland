# Use a lightweight Node.js image
FROM node:24-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3210

# Set a default environment variable (optional, can be overridden)
# ENV SERVER_URL="http://example.com"

# Start the application
CMD ["npm", "start"]
