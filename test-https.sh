#!/bin/bash
# Test script that respects HTTPS configuration

echo "Running tests with HTTPS configuration..."
echo "This script uses the main vite.config.js which has HTTPS enabled via basicSsl plugin"

# Run Cypress tests with HTTPS
echo "Running Cypress tests..."
npx cypress run --spec cypress/e2e/chat/basicChat.cy.js

echo "Test complete!"
echo "Note: Make sure the dev server is running with 'npm run dev' which uses HTTPS"