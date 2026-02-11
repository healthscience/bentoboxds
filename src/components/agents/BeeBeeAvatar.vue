<template>
  <div class="beebee-avatar">
    <inputBox @submit="handleGoalSubmission" />
  </div>
</template>

<script setup>
import inputBox from '@/components/beebeehelp/inputBox.vue';

  const emit = defineEmits(['goal-set']); // Define the outgoing event

  const handleGoalSubmission = (goal) => {
    console.log("Goal Received:", goal);
    emit('goal-set', goal); // Tell the parent (OrbitView) to move on
  };
</script>

<style scoped>

</style>