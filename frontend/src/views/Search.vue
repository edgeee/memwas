<template>
  <section class="m-b-xxl m-t-lg">
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
      <p class="has-text-centered" v-else-if="doneSearch && items.length == 0">
        No matching photos found.
      </p>
      <div class="m-t-md m-b-md" v-else-if="doneSearch">
        <vue-picture-swipe :items="items" />
      </div>
    </div>
  </section>
</template>

<script>
import { searchPhotos } from '../api'
import Spinner from '../components/spinner.vue'

const ERROR_TEXT = 'An error occurred; try again.'

export default {
  name: 'search',

  components: {
    Spinner
  },

  data () {
    return {
      searching: false,
      doneSearch: false,
      error: '',
      items: []
    }
  },

  methods: {
    async handlePhotoSelect (event) {
      this.error = ''
      this.items = []
      this.searching = true
      this.doneSearch = false
      try {
        const photoFile = event.target.files[0]
        const res = await searchPhotos(photoFile)
        for (let item, i = 0; i < res.items.length; i++) {
          item = { src: res.items[i].image_url }

          const that = this
          this.getImageProps(item.src, function (err, props) {
            if (err) { /* pretend to handle error */ } else {
              item.w = props.w
              item.h = props.h
              item.thumbnail = props.thumbnail
              that.items.push(item)
            }
          })
        }
      } catch (err) {
        this.error = ERROR_TEXT
      }
      this.searching = false
      this.doneSearch = true
    },

    getImageProps (imageSrc, cb) {
      const img = new Image()
      img.src = imageSrc
      img.onload = function () {
        cb(null, {
          w: this.width,
          h: this.height,
          thumbnail: imageSrc
        })
      }
    }
  }
}
</script>
