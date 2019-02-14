<template>
  <section class="m-l-md m-r-md">
    <p class="is-size-4 has-text-weight-light" style="letter-spacing: 2px;">
      <span class="icon">
        <i class="fas fa-folder"></i>
      </span>
      <span> ALBUMS</span>
    </p>
    <div class="m-t-xl">
      <div v-if="ui.error" class="has-text-centered">
        {{ ui.error }}
      </div>
      <div v-else-if="items.length > 0" class="columns flex is-multiline m-t-lg">
          <div v-for="(album, index) in items"
            :key="index"
            class="column"
            :style="{flex: album.thumbnail.aspectRatio}"
            >
          <router-link :to="`/album/${album.name}`" class="is-dark">
            <img :src="album.thumbnail.url" alt="Image thumbnail" class="block">
            <p class="m-t-sm">
              <span class="icon">
                <i class="far fa-image"></i>
              </span>
              {{ album.name }}
            </p>
          </router-link>
        </div>
      </div>
      <div v-else-if="!ui.loading">
        <p class="has-text-centered">
          There are no existing albums.
        </p>
      </div>
      <spinner v-if="ui.loading" />
      <div v-else-if="nextToken" class="has-text-centered">
        <button class="button is-dark" @click="fetchAlbumsAndThumbnails">
          Load more...
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { listAlbums, fetchPhotos } from '../api'
import Spinner from '../components/spinner.vue'

const ITEMS_PER_FETCH_OP = 20
const ERROR_TEXT = 'An error occurred; try again.'

export default {
  name: 'albums',
  components: {
    Spinner
  },

  data () {
    return {
      items: [],
      nextToken: null,
      ui: {
        error: '',
        loading: false
      }
    }
  },

  methods: {
    async fetchAlbumsAndThumbnails () {
      this.ui.error = ''
      this.ui.loading = true
      try {
        const res = await listAlbums({
          size: ITEMS_PER_FETCH_OP,
          nextToken: this.nextToken
        })
        this.nextToken = res.next_token
        for (let album, i = 0; i < res.items.length; i++) {
          album = {
            name: res.items[i].human_readable_name,
            thumbnail: { url: null, aspectRatio: 0 }
          }

          // Retrieves a single image in the current album, and uses it as the
          // album's thumbnail.
          const res2 = await fetchPhotos({
            albumName: res.items[i].name,
            size: 1,
            nextToken: null
          })
          if (res2.items.length > 0) {
            let that = this
            const imageURL = res2.items[0].image_url

            this.computeAspectRatio(imageURL, function (err, aspectRatio) {
              if (err) { /* pretend to handle error */ } else {
                album.thumbnail.url = imageURL
                album.thumbnail.aspectRatio = aspectRatio
                that.items.push(album)
              }
            })
          } else {
            this.items.push(album)
          }
        }
      } catch (err) {
        this.ui.error = ERROR_TEXT
      }
      this.ui.loading = false
    },

    computeAspectRatio (imageURL, cb) {
      const img = new Image()
      img.src = imageURL
      img.onload = function () {
        cb(null, this.width / this.height)
      }
    }
  },

  mounted () {
    this.fetchAlbumsAndThumbnails()
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
  vertical-align: middle;
}
</style>

<style lang="scss" scoped>
</style>
