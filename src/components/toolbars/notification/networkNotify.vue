<template>
  <div id="notification-update">
    <div class="bb-align not-align not-round" v-bind:class="{ active: checkAcitve }" @click="viewNotifications">N. {{ storeAI.countNotifications }}</div>
    <div class="box" v-if="storeAI.notifList.length > 0 && notifActive === true">
      <div v-for='noti in storeAI.notifList' :key='noti.id'>
        <div class="notification-item" @click="viewItemNotify(noti)">
          {{ noti.action }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  let notifActive = ref(false)

  const storeAI = aiInterfaceStore()

  const checkAcitve = computed(() => {
    let notAct = false
    if (storeAI.countNotifications > 0) {
      notAct = true
    }
    return notAct
  })

  /* methods */
  const viewNotifications = () => {
    notifActive.value = !notifActive.value
  }

  const viewItemNotify = (item) => {
    storeAI.startChat = false
    // reset count of notifications
    storeAI.countNotifications = 0
    viewNotifications()
    removeNotList(item.bbid)
  }

  const removeNotList = (boxid) => {
    let updateList = []
    for (let ni of storeAI.notifList) {
      if (ni.bbid = boxid) {

      } else {
        updateList.push(ni)
      }
    }
    storeAI.notifList = updateList
  }
   

  
</script>

<style scoped>

.not-round {
  background-color: rgb(123, 102, 102);
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
  color: rgb(61, 44, 44);
}

.active {
  background-color: red;
}

@media (min-width: 1024px) {

    #notification-update {
      display: grid;
      grid-template-columns: 1fr;
      z-index: 12;
    }

    .not-round {
    background-color:rgb(123, 102, 102);
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
    position: relative;
    top: 10px;
    left: 0;
    opacity: 0.88;
    background: #e5baca;
    width: 130%;
    padding: .4em;
  }

  .active {
    background-color: red;
    top: 20px;
  }
}

</style>