#!/bin/bash

echo "Starting ngrok tunnel on port 3001..."
echo ""
echo "⚠️  IMPORTANT: After ngrok starts, copy the HTTPS URL and update .env file"
echo ""

ngrok http 3001
