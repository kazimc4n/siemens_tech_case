#!/bin/bash

echo "Starting 8D Problem Solving Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

echo "Building and starting containers..."
docker-compose down -v --remove-orphans
docker-compose up --build -d

echo "Waiting for services to be ready..."

# Wait for Backend
echo "   Checking Backend API..."
attempt=0
max_attempts=30
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8080/api/health > /dev/null; then
        echo "   Backend is ready!"
        break
    fi
    attempt=$((attempt+1))
    printf "."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "   Backend health check timed out. Please check logs with 'docker-compose logs api'"
fi

echo "   Checking Frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   Frontend is serving app!"
else
    echo "   Frontend might still be starting."
fi

echo ""
echo " Project is running!"
echo "Open App: http://localhost:3000/dashboard"

