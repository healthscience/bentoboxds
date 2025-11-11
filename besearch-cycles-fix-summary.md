# Besearch Cycles Overlay Fix Summary

## Problem
The besearch cycles were overlaying the peer icon because:
1. Each cycle had its own animation loop using `requestAnimationFrame`
2. The cycles were clearing and redrawing parts of the canvas independently
3. This caused rendering conflicts with the peer icon

## Solution
1. **Unified Animation Loop**: Moved angle updates to the main game loop
2. **Single Clear Operation**: Clear the entire canvas once per frame
3. **Layer Ordering**: Draw cycles first (background), then peer (foreground)
4. **Image Optimization**: Load images once on mount instead of creating new ones each frame

## Changes Made

### Key Changes:
1. Added `beeCycleImage` and `peerImage` refs to store loaded images
2. Load both images once in `onMounted`
3. Updated game loop to handle angle animation for cycles
4. Simplified `drawBeeCycle` to not have its own animation loop
5. Updated `renderCuesMode` to:
   - Clear canvas once
   - Draw cycles first
   - Draw peer last
6. Removed unnecessary clearing in `drawPeer`

### Result:
- Besearch cycles now rotate smoothly in the background
- Peer icon always renders on top
- No more overlay issues
- Better performance with single animation loop

## Testing:
1. Open besearch modal
2. Verify cycles are visible and rotating
3. Move peer with keyboard or buttons
4. Peer should always appear on top of cycles