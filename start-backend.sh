#!/bin/bash
cd "$(dirname "$0")/backend"
echo "Starting backend server on port 3001..."
node server.js
