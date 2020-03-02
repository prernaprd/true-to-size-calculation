#To create base image for node.js and npm
FROM node:13.8.0

# Set directory for the application files
WORKDIR /app
COPY package.json /app

# Download the required packages for production
RUN npm install

# Copy the application files
COPY . /app

# Make the application run when running the container
CMD ["npm", "start"]