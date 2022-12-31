<template>
  <div class="bentobox">bentobox
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
  </div>
  <router-view/>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.bentobox {
  display: grid;
  grid-template-columns: 1fr;
  border: 4px solid chocolate;
}

header {
  display: grid;
  grid-template-columns: 1fr;
  line-height: 1.5;
  /* max-height: 10vh; */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  border: 5px solid black;
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

@media (min-width: 1024px) {
  .bentobox {
    display: grid;
    grid-template-columns: 1fr;
    border: 4px solid rgb(189, 30, 210);
  }

  header {
    display: grid;
    grid-template-columns: 1fr 8fr;
    border: 2px solid blue;
    /*max-height: 10vh;*/
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    grid-template-columns: 1fr 1fr;
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    border: 5px solid red;
  }
}
</style>