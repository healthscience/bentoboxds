import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrbitStore = defineStore('orbit', () => {
  const tools = ref({
    pulse: { x: 50, y: 34 },
    heli: { x: 80, y: 20 }
  });

  const draggingToolId = ref(null);

  const startDragging = (id) => {
    draggingToolId.value = id;
    document.body.style.cursor = 'move';
  };

  const updatePosition = (id, x, y) => {
    if (tools.value[id]) {
      tools.value[id].x = Math.max(2, Math.min(x, 98));
      tools.value[id].y = Math.max(2, Math.min(y, 98));
    }
  };

  const stopDragging = () => {
    draggingToolId.value = null;
    document.body.style.cursor = 'default';
  };

  return {
    tools,
    draggingToolId,
    startDragging,
    updatePosition,
    stopDragging
  };
});
