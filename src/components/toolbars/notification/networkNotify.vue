<template>
  <div class="bb-align not-align not-round" @click="viewNotifications">N. {{ storeAI.countNotifications }}</div>
  <div class="box" v-if="storeAI.notifList.length > 0 && notifActive === true">
    <div v-for='noti in storeAI.notifList' :key='noti.id'>
      <div class="notification-item" @click="viewItemNotify(noti)">
        {{ noti.action }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  let notifActive = ref(false)

  const storeAI = aiInterfaceStore()
  /* methods */
  const viewNotifications = () => {
    notifActive.value = !notifActive.value
  }

  const viewItemNotify = () => {
    storeAI.startChat = false
    viewNotifications()
  }

</script>

<style scoped>

.not-round {
  background-color: red;
  border-radius: 15px;
  justify-self: center;
  margin-top: 1.5em;
  padding: 0.2rem 0;
  color: white;
}

.not-align {
  width: 60px;
  margin-left: 20px;
  text-align: center;
}

.box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 10;
  left: 0;
  opacity: 0.7;
  background: #e5baca;
}

.notification-item {
  color: red;
}

@media (min-width: 1024px) {

    .not-round {
    background-color: red;
    border-radius: 15px;
    justify-self: center;
    margin-top: 1.5em;
    padding: 0.2rem 0;
    color: white;
  }

  .not-align {
    width: 60px;
    margin-left: 20px;
    text-align: center;
  }

  .box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 10;
    left: 0;
    opacity: 0.7;
    background: #e5baca;
  }
}

</style>