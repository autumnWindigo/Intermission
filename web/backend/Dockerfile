# Base image with Python and Node.js
FROM node:18-slim

# Install Python and other tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    mariadb-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory for backend
WORKDIR /usr/src/app

# Copy backend files
COPY package.json package-lock.json ./
RUN npm install

# Copy backend source code
COPY . .

# Set up Python environment
WORKDIR /usr/src/app/python

# Copy Python dependencies and sjuRegression
# Python requirements
COPY ../../requirements.txt .
# sjuRegression module
COPY ../../sjuRegression ./sjuRegression

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Return to backend directory
WORKDIR /usr/src/app

# Expose ports for backend
EXPOSE 8000

# Define environment variables for Node.js and Python
ENV TEST_DIR=/usr/src/tests
ENV PYTHON_EXEC=/usr/bin/python3

CMD ["npm", "run", "dev"]
