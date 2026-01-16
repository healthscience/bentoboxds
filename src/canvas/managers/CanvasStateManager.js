/**
 * CanvasStateManager - Manages viewport, bounds, and state for the besearch canvas
 */
export class CanvasStateManager {
  constructor(config = {}) {
    this.config = config;

    // Viewport state
    this.viewport = {
      x: 0,
      y: 0,
      width: config.width || window.innerWidth,
      height: config.height || window.innerHeight
    };

    // World bounds
    this.worldBounds = config.worldBounds || { width: 5000, height: 5000 };

    // Zoom and pan state
    this.zoom = 1.0;
    this.panOffset = { x: 0, y: 0 };

    // Current mode
    this.currentMode = 'cues';

    // Animation state
    this.animationAngle = 0;

    // Event callbacks
    this.onStateChange = null;
    
    console.log('CanvasStateManager: Initialized with viewport:', this.viewport);
    console.log('CanvasStateManager: World bounds:', this.worldBounds);
  }

  /**
   * Set viewport position
   */
  setViewport(x, y) {
    // Allow negative viewport positions to support centering
    // Only clamp if viewport would go beyond world bounds
    const maxX = this.worldBounds.width - this.viewport.width;
    const maxY = this.worldBounds.height - this.viewport.height;
    
    // If viewport is larger than world, center it (allow negative values)
    this.viewport.x = maxX < 0 ? maxX / 2 : Math.max(0, Math.min(maxX, x));
    this.viewport.y = maxY < 0 ? maxY / 2 : Math.max(0, Math.min(maxY, y));
    
    this.emitStateChange('viewport', { x: this.viewport.x, y: this.viewport.y });
  }

  /**
   * Pan the viewport by delta
   */
  pan(deltaX, deltaY) {
    this.setViewport(this.viewport.x + deltaX, this.viewport.y + deltaY);
  }

  /**
   * Set zoom level
   */
  setZoom(zoom, center = null) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(0.1, Math.min(3.0, zoom));

    // Adjust pan offset to zoom towards center point if provided
    if (center) {
      const zoomFactor = this.zoom / oldZoom;
      this.panOffset.x = center.x - (center.x - this.panOffset.x) * zoomFactor;
      this.panOffset.y = center.y - (center.y - this.panOffset.y) * zoomFactor;
    }

    this.emitStateChange('zoom', this.zoom);
  }

  /**
   * Zoom in
   */
  zoomIn(center = null) {
    this.setZoom(this.zoom * 1.2, center);
  }

  /**
   * Zoom out
   */
  zoomOut(center = null) {
    this.setZoom(this.zoom / 1.2, center);
  }

  /**
   * Reset zoom to 1.0
   */
  resetZoom() {
    this.setZoom(1.0);
  }

  /**
   * Set current mode
   */
  setMode(mode) {
    this.currentMode = mode;

    // Update world bounds for the new mode
    if (this.config.modeSettings && this.config.modeSettings[mode]) {
      this.worldBounds = { ...this.config.modeSettings[mode].worldBounds };
    }

    // Clamp viewport to new bounds
    this.viewport.x = Math.max(0, Math.min(this.worldBounds.width - this.viewport.width, this.viewport.x));
    this.viewport.y = Math.max(0, Math.min(this.worldBounds.height - this.viewport.height, this.viewport.y));

    this.emitStateChange('mode', mode);
  }

  /**
   * Update animation angle
   */
  updateAnimation(deltaTime = 1) {
    this.animationAngle += 0.02 * deltaTime;
    if (this.animationAngle >= 2 * Math.PI) {
      this.animationAngle = 0;
    }
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenPos) {
    return {
      x: (screenPos.x - this.panOffset.x) / this.zoom + this.viewport.x,
      y: (screenPos.y - this.panOffset.y) / this.zoom + this.viewport.y
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldPos) {
    return {
      x: (worldPos.x - this.viewport.x) * this.zoom + this.panOffset.x,
      y: (worldPos.y - this.viewport.y) * this.zoom + this.panOffset.y
    };
  }

  /**
   * Check if a world position is visible in the current viewport
   */
  isVisible(worldPos, margin = 0) {
    const screenPos = this.worldToScreen(worldPos);
    return screenPos.x >= -margin &&
           screenPos.x <= this.viewport.width + margin &&
           screenPos.y >= -margin &&
           screenPos.y <= this.viewport.height + margin;
  }

  /**
   * Get visible bounds in world coordinates
   */
  getVisibleBounds() {
    const topLeft = this.screenToWorld({ x: 0, y: 0 });
    const bottomRight = this.screenToWorld({
      x: this.viewport.width,
      y: this.viewport.height
    });

    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y
    };
  }

  /**
   * Center viewport on a world position
   */
  centerOn(worldPos) {
    const screenCenterX = this.viewport.width / 2;
    const screenCenterY = this.viewport.height / 2;

    const newViewportX = worldPos.x - screenCenterX / this.zoom;
    const newViewportY = worldPos.y - screenCenterY / this.zoom;

    this.setViewport(newViewportX, newViewportY);
  }

  /**
   * Fit viewport to show all entities
   */
  fitToEntities(entities) {
    if (!entities || entities.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    entities.forEach(entity => {
      if (entity.x !== undefined && entity.y !== undefined) {
        minX = Math.min(minX, entity.x);
        minY = Math.min(minY, entity.y);
        maxX = Math.max(maxX, entity.x);
        maxY = Math.max(maxY, entity.y);
      }
    });

    if (minX === Infinity) return; // No valid entities

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX || 100;
    const height = maxY - minY || 100;

    // Calculate zoom to fit with some margin
    const zoomX = this.viewport.width / (width * 1.2);
    const zoomY = this.viewport.height / (height * 1.2);
    const fitZoom = Math.min(zoomX, zoomY, 1.0); // Don't zoom in beyond 1:1

    this.setZoom(fitZoom);
    this.centerOn({ x: centerX, y: centerY });
  }

  /**
   * Emit state change event
   */
  emitStateChange(type, data) {
    if (this.onStateChange) {
      this.onStateChange(type, data);
    }
  }

  /**
   * Set state change callback
   */
  setStateChangeCallback(callback) {
    this.onStateChange = callback;
  }

  /**
   * Get current state for serialization
   */
  getState() {
    return {
      viewport: { ...this.viewport },
      zoom: this.zoom,
      panOffset: { ...this.panOffset },
      currentMode: this.currentMode,
      animationAngle: this.animationAngle
    };
  }

  /**
   * Set state from serialized data
   */
  setState(state) {
    if (state.viewport) {
      this.viewport = { ...state.viewport };
    }
    if (state.zoom !== undefined) {
      this.zoom = state.zoom;
    }
    if (state.panOffset) {
      this.panOffset = { ...state.panOffset };
    }
    if (state.currentMode) {
      this.currentMode = state.currentMode;
    }
    if (state.animationAngle !== undefined) {
      this.animationAngle = state.animationAngle;
    }
  }

  /**
   * Handle window resize
   */
  handleResize(newWidth, newHeight) {
    this.viewport.width = newWidth;
    this.viewport.height = newHeight;
    this.emitStateChange('resize', { width: newWidth, height: newHeight });
  }
}

export default CanvasStateManager;