# Debugging Lessons: Besearch Canvas Resize Issue

## Date: 2026-01-16

## Problem
Canvas element not expanding to fill available space when browser window is maximized.

## Root Cause
CSS Grid was operating in **content-sizing mode** instead of **available-space-sizing mode**.

### Symptoms:
- Computed styles showed fixed pixel values: `grid-template-rows: 831px 4px` instead of `1fr auto`
- Grid tracks calculated from content size, not available space
- Canvas stayed at initial size despite `width: 100%; height: 100%`

## Solution
Added `height: 100%` to `.modal-body` to give CSS Grid an explicit container size.

### Why It Worked:
CSS Grid's `1fr` unit means "1 fraction of AVAILABLE space". Without an explicit container size, Grid doesn't know what "available space" is, so it falls back to content-sizing (measuring the content and using that as the size).

## Key Lesson: **Always Use Browser Inspection First**

### What Worked:
1. Open browser dev tools
2. Inspect the problematic element
3. Check **Computed** tab for actual CSS values
4. Compare computed values to expected values
5. Work backwards up the DOM tree to find where sizing breaks

### What Didn't Work:
- Making assumptions about CSS behavior
- Adding more CSS rules without understanding the computed result
- Trying JavaScript solutions for CSS problems

## Diagnostic Approach for Future:
1. **Reproduce the issue** in browser
2. **Inspect computed styles** of affected elements
3. **Compare** computed vs expected values
4. **Identify** which CSS rule is causing the mismatch
5. **Fix** the specific rule
6. **Verify** with browser inspection again

## Technical Details:

### CSS Grid Content-Sizing vs Available-Space-Sizing:

**Content-Sizing** (what was happening):
```css
.parent { display: grid; grid-template-rows: 1fr auto; }
/* Without explicit height, Grid measures content */
/* Computed: grid-template-rows: 831px 4px; */
```

**Available-Space-Sizing** (what we needed):
```css
.parent { 
  display: grid; 
  grid-template-rows: 1fr auto;
  height: 100%; /* Explicit size triggers space distribution */
}
/* Computed: grid-template-rows: [calculated]fr auto; */
```

## Files Modified:
- `src/components/besearch/besearchModal.vue` - Added `height: 100%` to `.modal-body`
- `src/components/besearch/besearchCycle.vue` - Added `!important` to force responsive grid
- `src/canvas/managers/CanvasStateManager.js` - Implemented dynamic viewport getters
- `src/canvas/managers/BesearchCanvasManager.js` - Fixed initialization order
- `src/canvas/managers/CanvasRenderer.js` - Added force reflow, DPR scaling

## Bookmark:
Git commit `810dd3d`: "BOOKMARK: Before implementing dynamic viewport getters"

Revert if needed: `git reset --hard 810dd3d`
