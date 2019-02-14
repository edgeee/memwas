import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VuePictureSwipe from 'vue-picture-swipe'

// Require the main sass manifest file
require('./assets/sass/main.scss')

Vue.config.productionTip = false

Vue.component('vue-picture-swipe', VuePictureSwipe)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
