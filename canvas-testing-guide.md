# Canvas Testing Guide for BentoBoxDS

## Testing Strategy Overview

### 1. Unit Tests (Recommended Priority)
Test the business logic separately from canvas rendering:

```javascript
// tests/unit/besearchLogic.test.js
import { describe, it, expect } from 'vitest'

describe('Besearch Game Logic', () => {
  describe('Peer Movement', () => {
    it('should calculate correct position based on direction', () => {
      const peer = {
        x: 100,
        y: 100,
        speed: 5,
        direction: { x: 1, y: 0 }
      }
      
      const newX = peer.x + (peer.direction.x * peer.speed)
      const newY = peer.y + (peer.direction.y * peer.speed)
      
      expect(newX).toBe(105)
      expect(newY).toBe(100)
    })

    it('should enforce canvas boundaries', () => {
      const peer = { x: 795, y: 100, width: 40, height: 40 }
      const canvas = { width: 800, height: 600 }
      
      const maxX = canvas.width - peer.width
      const boundedX = Math.min(peer.x, maxX)
      
      expect(boundedX).toBe(760)
    })
  })

  describe('Besearch Cycles Animation', () => {
    it('should calculate correct orbital position', () => {
      const angle = Math.PI / 2 // 90 degrees
      const radius = 100
      const centerX = 200
      const centerY = 200
      
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      expect(Math.round(x)).toBe(200)
      expect(Math.round(y)).toBe(300)
    })
  })
})
```

### 2. Canvas Snapshot Testing

```javascript
// tests/visual/canvasSnapshot.test.js
import { describe, it, expect } from 'vitest'
import { createCanvas } from 'canvas' // node-canvas for testing

describe('Canvas Rendering', () => {
  it('should render peer at correct position', () => {
    const canvas = createCanvas(800, 600)
    const ctx = canvas.getContext('2d')
    
    // Draw peer
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(100, 100, 40, 40)
    
    // Get pixel data at peer position
    const imageData = ctx.getImageData(100, 100, 1, 1)
    const [r, g, b] = imageData.data
    
    expect(r).toBe(255)
    expect(g).toBe(0)
    expect(b).toBe(0)
  })
})
```

### 3. Mock Canvas Context for Component Tests

```javascript
// tests/unit/besearchCycle.test.js
import { mount } from '@vue/test-utils'
import BesearchCycle from '@/components/besearch/besearchCycle.vue'

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  fillText: vi.fn()
}

const mockCanvas = {
  getContext: () => mockContext,
  width: 800,
  height: 600
}

describe('BesearchCycle Component', () => {
  it('should clear canvas on update', () => {
    const wrapper = mount(BesearchCycle)
    
    // Mock the canvas element
    wrapper.vm.canvas = mockCanvas
    wrapper.vm.ctx = mockContext
    
    // Trigger update
    wrapper.vm.updateCanvas()
    
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600)
  })
})
```

### 4. E2E Tests with Playwright

```javascript
// tests/e2e/besearchInteraction.spec.js
import { test, expect } from '@playwright/test'

test.describe('Besearch Canvas Interactions', () => {
  test('peer moves with keyboard controls', async ({ page }) => {
    await page.goto('/besearch')
    
    // Wait for canvas to load
    await page.waitForSelector('#besearch-cycles')
    
    // Inject position tracking
    await page.evaluate(() => {
      window.peerPositions = []
      const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage
      CanvasRenderingContext2D.prototype.drawImage = function(...args) {
        if (args.length >= 4) {
          window.peerPositions.push({ x: args[1], y: args[2] })
        }
        return originalDrawImage.apply(this, args)
      }
    })
    
    // Press arrow key
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
    
    // Check positions changed
    const positions = await page.evaluate(() => window.peerPositions)
    expect(positions.length).toBeGreaterThan(1)
    expect(positions[positions.length - 1].x).toBeGreaterThan(positions[0].x)
  })

  test('life tools buttons control peer', async ({ page }) => {
    await page.goto('/besearch')
    await page.click('button:has-text("be")')
    
    // Click right arrow button
    await page.click('button[aria-label="Move right"]')
    
    // Verify movement (similar to above)
  })
})
```

### 5. Performance Testing

```javascript
// tests/performance/canvasPerf.test.js
describe('Canvas Performance', () => {
  it('should maintain 60fps during animation', async () => {
    const frameTimings = []
    let lastTime = performance.now()
    
    const measureFrame = () => {
      const currentTime = performance.now()
      const delta = currentTime - lastTime
      frameTimings.push(delta)
      lastTime = currentTime
      
      if (frameTimings.length < 60) {
        requestAnimationFrame(measureFrame)
      }
    }
    
    // Start animation
    gameLoop()
    measureFrame()
    
    // Wait for measurement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check average frame time
    const avgFrameTime = frameTimings.reduce((a, b) => a + b) / frameTimings.length
    expect(avgFrameTime).toBeLessThan(17) // ~60fps
  })
})
```

## Recommended Testing Stack

1. **Vitest** - Fast unit testing
2. **@testing-library/vue** - Component testing
3. **Playwright** - E2E testing with good canvas support
4. **jest-image-snapshot** - Visual regression testing
5. **node-canvas** - Server-side canvas for unit tests

## Testing Priority for BentoBoxDS

1. **High Priority**
   - Peer movement logic (unit tests)
   - Collision detection (unit tests)
   - State management (unit tests)
   - Key user interactions (E2E)

2. **Medium Priority**
   - Visual regression tests for major views
   - Animation timing tests
   - Canvas boundary tests

3. **Lower Priority**
   - Pixel-perfect rendering tests
   - Complex animation sequences
   - Performance benchmarks

## Example Test Setup for Your Project

```bash
# Install testing dependencies
npm install -D vitest @testing-library/vue @vue/test-utils
npm install -D playwright @playwright/test
npm install -D canvas jest-image-snapshot

# Create test structure
mkdir -p tests/unit tests/e2e tests/visual
```

## Key Testing Principles for Canvas

1. **Separate Logic from Rendering** - Test business logic without canvas
2. **Mock Canvas API** - Use mock contexts for unit tests
3. **Snapshot Key States** - Capture visual states at important moments
4. **Test Interactions** - Focus E2E tests on user interactions
5. **Monitor Performance** - Ensure smooth animations

This approach gives you comprehensive coverage while keeping tests maintainable and fast.