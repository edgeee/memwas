<template>
  <div id="app">
    <navbar v-if="showNavbar" />
    <div :class="{'has-background-white-ter': showNavbar}">
      <div class="container fluid m-t-lg p-t-lg p-b-xl">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
  },

  computed: {
    showNavbar () {
      return this.$route.path !== '/'
    }
  }
}
</script>

<style>
</style>
