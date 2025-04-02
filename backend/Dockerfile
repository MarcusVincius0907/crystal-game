# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the app
RUN npm run build

# Expose necessary ports
EXPOSE 3005 3006

# Start the application
CMD ["npm", "run", "start:prod"]
