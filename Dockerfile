# Use an official Node.js runtime as a parent image
FROM node:current-alpine

# Create app directory
RUN mkdir -p /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . /usr/src/app

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Install the dependencies
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# How to run:
# Build image from Dockerfile
# docker build -t cmante/cms:vite-app .
# Run container from image
# docker run -p 3000:3000 --name cms-vite-app cmante/cms:vite-app
# Run pre-existing container
# docker start cms-vite-app
# Attach to container
# docker attach cms-vite-app