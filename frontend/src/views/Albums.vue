<template>
  <section class="m-l-md m-r-md">
    <p class="is-size-4 has-text-weight-light" style="letter-spacing: 2px;">
      <span class="icon">
        <i class="fas fa-folder"></i>
      </span>
      <span> ALBUMS</span>
    </p>
    <div class="m-t-xl">
      <div v-if="error" class="has-text-centered">
        {{ error }}
      </div>
      <div v-else-if="items.length > 0" class="columns is-multiline m-t-lg">
        <div v-for="(album, index) in filteredItems"
          :key="index"
          class="column is-one-quarter">
          <router-link :to="`/album/${album.id}?name=${album.name}`" class="is-dark">
            <img v-if="album.thumbnail_url"
                 :src="album.thumbnail_url" alt="Image thumbnail"
                 class="inline-block responsive-img">

            <div class="is-size-3 has-text-centered" v-else
                  style="padding-top: 45%; width: 256px; height: 256px;">
            <span class="icon">
              <i class="far fa-image"></i>
            </span>
            </div>
          </router-link>

          <p class="m-t-md has-text-centered">
            <span class="icon">
              <i class="far fa-image"></i>
            </span>
            {{ album.name }}
          </p>
        </div>
      </div>

      <div v-else-if="!loading">
        <p class="has-text-centered">
          There are no existing albums.
        </p>
      </div>

      <spinner v-if="loading" />
      <div v-else-if="hasItemsLeftToFetch" class="has-text-left">

        <button class="button is-dark" @click="fetchAlbums">
          Load more...
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { fetchAlbums } from '../api'
import Spinner from '../components/spinner.vue'

const ITEMS_PER_FETCH_OP = 10

export default {
  name: 'albums',
  components: {
    Spinner
  },

  data () {
    return {
      loading: false,
      error: '',
      items: [],
      meta: {
        limit: ITEMS_PER_FETCH_OP,
        offset: 0,
        total: 0
      }
    }
  },

  computed: {
    hasItemsLeftToFetch () {
      return this.items.length < this.meta.total
    },

    filteredItems () {
      return this.items.filter((item) => item.thumbnail_url || this.isAdmin)
    },

    isAdmin () {
      return true
    }
  },

  methods: {
    shouldDisplayAlbum () {
      return true
    },

    async fetchAlbumsAndThumbnails () {
      this.error = ''
      this.loading = true
      try {
        const res = await fetchAlbums({
          offset: this.meta.offset,
          limit: this.meta.limit
        })
        this.meta.limit = res.limit
        this.meta.offset += res.limit
        this.meta.total = res.total
        this.items.push(...res.items)
      } catch (err) {
        this.error = err.message
      }
      this.loading = false
    }
  },

  mounted () {
    this.fetchAlbumsAndThumbnails()
  }
}
</script>

<style scoped>
.responsive-img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}
</style>
