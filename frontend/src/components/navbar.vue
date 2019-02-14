<template>
  <nav class="p-t-lg container">
    <div class="level">
      <div class="level-left m-b-md">
        <div class="level-item">
          <p class="title has-text-weight-light is-uppercase text-logo">memwas</p>
        </div>
      </div>
      <div class="level-right m-b-md" style="margin-top: auto;">
        <div class="level-item">
          <div class="level">
            <div class="level-item">
              <router-link to="/" class="has-text-grey-light is-uppercase text-spaced-sm">home</router-link>
            </div>
            <div class="level-item">
              <router-link to="/search" class="has-text-grey-light is-uppercase">search</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.text-logo {
  letter-spacing: 0.2em;
}
</style>
