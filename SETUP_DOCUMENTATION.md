# BentoBoxDS & HOP Complete Setup Documentation

## Environment
- **OS**: Debian GNU/Linux 13 (trixie)
- **Node Version**: v24.11.1
- **Working Directory**: /workspace/bentoboxds
- **Branch**: training

## Current Architecture Overview

### 1. BentoBoxDS (Main Application)
- **Location**: /workspace/bentoboxds
- **Dev Server**: Vite with HTTPS (basicSsl plugin)
- **Default Port**: 5173 (HTTPS)
- **Framework**: Vue 3 with Pinia stores

### 2. HOP Server (hop-ecs)
- **Port**: 9888
- **Version**: 0.4.7
- **Purpose**: Entity Component System for AI/chat functionality
- **Auto-starts**: Via Cypress config when running tests

### 3. Linked NPM Packages
All packages are npm linked to HOP:

1. **beebee-ai** (agent branch)
   - Location: /workspace/beebee-ai
   - Purpose: AI agent functionality

2. **node-safeflow** (master branch)
   - Location: /workspace/node-safeflow
   - Purpose: Flow control and safety mechanisms

3. **library-hop** (main branch)
   - Location: /workspace/library-hop
   - Purpose: Core HOP library functionality

4. **holepunch-hop**
   - Location: /workspace/holepunch-hop
   - Purpose: Network connectivity

5. **librarycomposer**
   - Location: /workspace/librarycomposer
   - Purpose: Component composition utilities

## Key Components for Chat Refactoring

### Stores
- **chatStore.js**: Main chat state management
- **aiInterface.js**: AI service integration
- **storeAI.js**: AI status and configuration

### UI Components
- **ChatInterface.vue**: Main chat UI component
- **BeeBeeHop.vue**: BeeBee integration component

### Services
- **aiService.js**: AI communication service
- **chatService.js**: Chat functionality service

## Current Issues

### 1. Testing Environment
- **Problem**: HTTPS/SSL certificate issues in containerized environment
- **Symptom**: Cypress gets ESOCKETTIMEDOUT when connecting to dev server
- **Local vs Container**: Works locally but fails in cloud container

### 2. Streaming Message Consolidation
- **Problem**: Messages not appearing in conversation div after sending
- **Test Case**: basicChat.cy.js sends "a good life in less than 20 words please."
- **Expected**: Message should appear in #conversation div
- **Actual**: Timeout after 4 seconds, message not found

## Setup Commands

### Initial Setup
```bash
# Clone repository
git clone <repo-url> bentoboxds
cd bentoboxds
git checkout training

# Install dependencies
npm install

# Link all required packages
cd /workspace/beebee-ai && npm link
cd /workspace/node-safeflow && npm link
cd /workspace/library-hop && npm link
cd /workspace/holepunch-hop && npm link
cd /workspace/librarycomposer && npm link

# Link packages to HOP
cd /workspace/bentoboxds
npm link beebee-ai node-safeflow library-hop holepunch-hop librarycomposer
```

### Running Development Environment
```bash
# Terminal 1: Start dev server
cd /workspace/bentoboxds
npm run dev

# Terminal 2: Run Cypress tests
cd /workspace/bentoboxds
npx cypress run --spec cypress/e2e/chat/basicChat.cy.js
```

## Refactoring Plan (5 Stages)

### Stage 1: Fix Immediate Issues ✓
- Fixed question content display
- Attempted streaming message consolidation fix

### Stage 2: Implement Streaming Support (TODO)
- Proper streaming message handling
- Progressive UI updates

### Stage 3: Unify Message Structure (TODO)
- Consistent message format across all contexts
- Standardized message properties

### Stage 4: Refactor State Management (TODO)
- Centralized chat state
- Proper separation of concerns

### Stage 5: Support All Contexts (TODO)
- Library chat
- Cues chat
- Direct chat
- Unified experience

## Known Environment Limitations

1. **SSL/HTTPS Issues**: Self-signed certificates cause connection problems
2. **Network Configuration**: Container network settings may block certain connections
3. **Missing Tools**: lsof, netstat, ss not available in container

## Next Steps

1. Resolve SSL/HTTPS issues for proper testing
2. Fix streaming message consolidation
3. Continue with Stage 2-5 of refactoring plan
4. Ensure all tests pass in both local and container environments