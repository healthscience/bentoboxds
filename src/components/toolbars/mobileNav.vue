<template>
  <div class="mobile-nav">
    <button id="menu-button" @click="selectMenuBB()">Menu</button>
    <div class="mobile-menu-options" v-for="mmi of menuItems">
      <div class="list-nav-mobile" v-if="menuLive === true">
        <button class="mobile-menu-button" @click="menuSelect(mmi)">{{ mmi }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref} from 'vue'

const menuItems = ref(['Home', 'About', 'Language', 'Help', 'Sign-in'])
const menuLive = ref(false)

function selectMenuBB () {
  this.menuLive = !this.menuLive
}

function menuSelect (m) {
  console.log('route to right place')
  console.log(m)
}

</script>

<style scoped>

#menu-button::before {
  content: "";
  background-image: url('@/assets/logo.png');
  background-size: 60px 60px;
  position: absolute;
  top: -13px;
  left: -130px;
  width: 60px;
  height: 60px;
  z-index:1;
}

#menu-button::after {
  content: "BentoBox-DS";
  position: absolute;
  top: -3px;
  left: 60px;
  width: 120px;
  font-size: 1.2em;
  z-index:1;
}

.mobile-nav {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 1;
}

.mobile-menu-button {
  border: 0px solid white;
  width: 80%;
  padding: .2rem;
  margin: .5rem;
}

.mobile-menu-options {
  background-color: white;
}

@media (min-width: 1024px) {

}

</style>
