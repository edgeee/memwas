<template>
  <section class="m-b-xxl m-t-lg m-l-sm m-r-sm">
    <div class="has-text-centered ">
      <p class="is-size-4 has-text-weight-light" style="letter-spacing: 1px;">Search Photos</p>
      <p class="has-text-grey m-t-sm m-b-lg">Upload a photo of yourself, and get matching photos in our index.</p>
      <div class="field is-size-6">
        <div class="file is-centered is-danger">
          <label class="file-label is-small">
            <input class="file-input is-small" type="file" name="resume" @change="handlePhotoSelect">
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-image"></i>
              </span>
              <span class="file-label">
                Photo
              </span>
            </span>
            <span class="file-name">
              Select a photo
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="m-t-lg m-b-md">
      <spinner class="has-text-centered" v-if="searching" />
      <p class="has-text-centered" v-else-if="error">{{ error }}</p>
      <p class="has-text-centered" v-else-if="searchCompleted && items.length == 0">
        No matching photos found.
      </p>
      <div class="m-t-xl m-b-md" v-else-if="searchCompleted">
        <gallery :items="items" />
      </div>
    </div>
  </section>
</template>

<script>
import { searchPhotos } from '../api'
import Spinner from '../components/spinner.vue'
import Gallery from '../components/gallery.vue'

export default {
  name: 'search',

  components: {
    Spinner,
    Gallery
  },

  data () {
    return {
      searching: false,
      searchCompleted: false,
      error: '',
      items: []
    }
  },

  methods: {
    async handlePhotoSelect (event) {
      this.error = ''
      this.items = []
      this.searching = true
      this.searchCompleted = false
      try {
        const photoFile = event.target.files[0]
        const res = await searchPhotos(photoFile)
        for (let i = 0; i < res.items.length; i++) {
          this.items.push({
            src: res.items[i].photo_url,
            thumbnail: res.items[i].thumbnail_url,
            w: res.items[i].photo_dimensions.w,
            h: res.items[i].photo_dimensions.h
          })
        }
      } catch (err) {
        this.error = err.message
      }
      this.searching = false
      this.searchCompleted = true
    }
  }
}
</script>
