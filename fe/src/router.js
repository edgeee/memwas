import Vue from 'vue'
import Router from 'vue-router'
import AlbumList from './views/AlbumList.vue'
import Album from './views/Album.vue'
import Home from './views/Home.vue'
import Splash from './views/Splash.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/search',
      name: 'home',
      component: Home
    },
    {
      path: '/a/albums',
      name: 'albums',
      component: AlbumList
    },
    {
      path: '/a/albums/:name',
      name: 'album',
      component: Album
    },
    {
      path: '/',
      name: 'splash',
      component: Splash
    }
  ]
})
