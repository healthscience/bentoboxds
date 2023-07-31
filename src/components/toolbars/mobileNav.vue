<template>
  <div class="mobile-nav">
    <button id="menu-button" @click="selectMenuBB()">Menu</button>
    <div class="menu-holder">
      <div class="mobile-menu-options" v-for="mmi of menuItems">
        <div class="list-nav-mobile" v-if="menuLive === true">
          <button class="mobile-menu-button" @click="menuSelect(mmi)">{{ mmi }}</button>
        </div>
      </div>
    </div>
    <div id="menu-project">
      BentoBox-DS
    </div>
  </div>
</template>

<script setup>
import { ref} from 'vue'

const menuItems = ref(['Home', 'About', 'Language', 'Help', 'Sign-in'])
const menuLive = ref(false)

const selectMenuBB = () => {
  menuLive.value = !menuLive.value
}


function menuSelect (m) {
  console.log('route to right place')
  console.log(m)
}

</script>

<style scoped>
.mobile-nav {
  justify-content: center;
  z-index: 1;
}

#menu-button {
  border: 0px solid blue;
  background-color: rgb(198, 198, 232);
  width: 36vw;
  height: 3em;
}

#menu-button::before {
  content: "";
  background-image: url('@/assets/logo.png');
  background-size: 60px 60px;
  position: absolute;
  top: -13px;
  left: -100px;
  width: 60px;
  height: 60px;
  z-index:1;
}

#menu-project {
  position: absolute;
  top: 3px;
  left: 100%;
  width: 120px;
  font-size: 1.2em;
  padding-left: 1em;
  font-size: 1em;
  z-index:1;
}


.menu-holder {
  display: grid;
  justify-content: center;
  border: 0px solid green;
  background-color: white;
}

.mobile-menu-button {
  border: 0px solid blue;
  background-color: rgb(198, 198, 232);
  width: 30vw;
  height: 2em;
  margin: 10px;
}

.mobile-menu-options {
}

@media (min-width: 1024px) {

}

</style>
