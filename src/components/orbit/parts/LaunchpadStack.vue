<template>
  <div id="launchpad-experience">
    <div v-if="isInitialState" class="launchpad-stack">
      <div class="avatar-zone"><BeeBeeAvatar /></div>
      <div class="input-zone">
        <div class="input-constraint"><inputBox/></div>
      </div>
      <div class="demo-zone">
        <button class="sov-demo-btn" @click="launchDemo('sport')">🏊 Experience 400IM</button>
        <button class="sov-demo-btn" @click="launchDemo('water')">Water</button>
        <button class="sov-demo-btn" @click="launchDemo('earth')">Earth</button>
      </div>
    </div>
  </div>

</template>

<script setup>

</script>

<style scoped>

.launchpad-stack {
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  height: 100%;
  width: 100%;
}

</style>