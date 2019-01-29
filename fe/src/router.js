import Vue from 'vue'
import Router from 'vue-router'
import Albums from './views/Albums.vue'
import Home from './views/Home.vue'
import SearchResults from './views/SearchResults.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/admin/albums',
      name: 'albums',
      component: Albums
    },
    {
      path: '/search',
      name: 'searh-results',
      component: SearchResults
    }
  ]
})
