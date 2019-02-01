import Vue from 'vue'
import Router from 'vue-router'
import AlbumList from './views/AlbumList.vue'
import Album from './views/Album.vue'
import Home from './views/Home.vue'

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
      path: '/a/albums',
      name: 'albums',
      component: AlbumList
    },
    {
      path: '/a/albums/:name',
      name: 'album',
      component: Album
    }
  ]
})
