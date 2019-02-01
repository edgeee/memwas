<template>
  <v-card flat class="pa-2">
    <div class="pb-3 font-weight-medium">
      <v-icon small >photo_album</v-icon>
      <span class="pl-2 tex-capitalize">{{ album.name }}</span>
    </div>
    <div v-if="error">
      <p class="body-2"></p>
    </div>
    <div v-else-if="loading">
      <v-progress-circular
        :size="40"
        :width="4"
        color="pink"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else-if="images.length > 0">
      <v-layout row wrap>
        <v-flex v-for="(image, index) in images" :key="index" xs4>
          <div class="image-container">
            <img :src="image" :alt="`image ${index}`" class="image-item"
                  style="max-height: 64px;">
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
      <p class="body-1">This album is empty.</p>
    </div>
    <v-layout class="pt-2">
      <v-btn flat fab small class="pink darken-1 white--text"
             :to="{name: 'album', params: {name: album.human_readable_name}}">
        <v-icon>add_a_photo</v-icon>
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import axios from '../axios'

const THUMBNAIL_FETCH_COUNT = 6
const ERROR_TEXT = 'Unable to fetch photo thumbnails.'

export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      images: [],
      loading: false,
      error: ''
    }
  },

  methods: {
    async fetchThumbnails () {
      const params = {
        album_name: this.$props.album.name,
        limit: THUMBNAIL_FETCH_COUNT
      }
      this.loading = true
      try {
        const resp = await axios.get('/images', { params })
        resp.data.items.forEach((item) => {
          this.images.push(item.image_url)
        })
      } catch (e) {
        this.error = ERROR_TEXT
      }
      this.loading = false
    }
  },

  mounted () {
    this.fetchThumbnails()
  }
}
</script>

<style>
.image-container {
  width: 100%;
}

.image-item {
  max-width: 95%;
  height: auto;
}
</style>
