#!/bin/bash
# Kill any existing processes on port 5173
kill $(lsof -t -i:5173) 2>/dev/null || true

# Start vite with test config (no SSL)
echo "Starting dev server with HTTP (no SSL)..."
vite --config vite.config.test.js &
DEV_PID=$!

# Wait for server to start
echo "Waiting for dev server to start..."
sleep 5

# Run Cypress test
echo "Running Cypress test..."
npx cypress run --spec cypress/e2e/chat/basicChat.cy.js

# Kill dev server
kill $DEV_PID 2>/dev/null || true

echo "Test complete!"