<template>
  <div class="bentobox">
    <header>
      <div class="bentobox-top" id="logo-bb">
        <img alt="BentoBox-DS" class="logo" src="@/assets/logo.png" width="80" height="80" />
        <span>BentoBox-DS</span>
      </div>
      <div class="bentobox-top">
        <div class="bb-align"></div>
      </div>
      <div class="bentobox-top"  id="main-nav">  
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
      <div class="bentobox-top">
        <div class="bb-align">Language</div>
      </div>
      <div class="bentobox-top">
        <div class="bb-align alpha-round">Alpha</div>
      </div>
      <div class="bentobox-top">
        <div class="bb-align">Help</div>
      </div>
      <div class="bentobox-top">
        <div class="bb-align">Sign-in</div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { useSocketStore } from '@/stores/socket.js'

  const storeWebsocket = useSocketStore()
  storeWebsocket.init_chat()

</script>

<style scoped>
.bentobox {
  display: grid;
  grid-template-columns: 1fr;
  width: 90vw;
  border: 0px solid rgb(183, 30, 210);
  background-color: white;
}

header {
  display: grid;
  grid-template-columns: 1fr;
  line-height: 1.5;
  /* max-height: 10vh; */
}

.bentoxbox-top {
  border: 0px dash blue;
}

.logo {
  display: block;
  margin: 0 auto .2rem;
}

nav {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  border: 0px solid black;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.bb-align {
  font-size: 12px;
  text-align: center;
}

@media (min-width: 1024px) {
  .bentobox {
    position: fixed;
    top: 0;
    display: grid;
    grid-template-columns: 1fr;
    border: 0px solid rgb(189, 30, 210);
    background-color: rgb(250, 246, 246);
    z-index: 12;
  }

  header {
    display: grid;
    grid-template-columns: 4fr 1fr 2fr 1fr 1fr 1fr 1fr;
    border: 0px solid blue;
    /*max-height: 10vh;*/
  }

  .bentobox-top {
    border: 0px solid blue;
  }

  .logo {
    margin: 0 1rem 0 0;
  }

  nav {
    grid-template-columns: 1fr 1fr;
    text-align: left;
    margin-left: 0rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    border: 0px solid red;
  }

  .bb-align {
    margin-left: 0rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }

  .alpha-round {
    background-color: rgb(235, 135, 63);
    border-radius: 15px;
    justify-self: end;
    margin-top: 1.5em;
    padding: 0.2rem 0;
    color: white;
  }
}
</style>