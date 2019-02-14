<template>
  <section class="m-r-md">
    <p class="is-size-4 has-text-weight-light" style="letter-spacing: 2px;">
      <span class="icon">
        <i class="far fa-image"></i>
      </span>
      <span class="is-capitalized"> {{ $route.params.name }}</span>
    </p>

    <section class="m-t-md m-b-xl">
      <spinner v-if="ui.uploading" />
      <p v-else-if="ui.uploadMessage">{{ ui.uploadMessage }}</p>
      <div v-else class="field is-size-6">
        <div class="file is-danger">
          <label class="file-label is-small">
            <input class="file-input is-small" type="file" name="resume" multiple
                   @change="handlePhotosUpload">
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-image"></i>
              </span>
              <span class="file-label">
                Photos
              </span>
            </span>
            <span class="file-name">
              Add photos to album
            </span>
          </label>
        </div>
      </div>
    </section>

    <div class="m-t-md m-b-md">
      <vue-picture-swipe :items="items" />
    </div>

    <div v-if="ui.error">
      {{ ui.error }}
    </div>
    <spinner v-else-if="ui.loading" />

    <div v-else-if="items.length === 0">
      No images in this album yet.
    </div>

    <div v-else-if="!ui.loading" class="has-text-centered">
      <button class="button is-dark" @click="fetchAlbumPhotos">
        Load more...
      </button>
    </div>
  </section>
</template>

<script>
import { fetchPhotos, uploadPhoto } from '../api'
import Spinner from '../components/spinner.vue'

const ITEMS_PER_FETCH_OP = 20
const ERROR_TEXT = 'An error occurred; try again.'
const UPLOAD_SUCCESS_TEXT = 'Upload completed successfully.'
const UPLOAD_ERROR_TEXT = 'Unable to upload some photos; try again.'

export default {
  name: 'album',

  components: {
    Spinner
  },

  data () {
    return {
      items: [],
      nextToken: null,
      ui: {
        loading: false,
        error: '',
        uploading: '',
        uploadMessage: ''
      }
    }
  },

  methods: {
    async fetchAlbumPhotos () {
      this.ui.error = ''
      this.ui.loading = true

      try {
        const res = await fetchPhotos({
          nextToken: this.nextToken,
          size: ITEMS_PER_FETCH_OP,
          albumName: this.$route.params.name
        })

        this.nextToken = res.next_token
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
        this.ui.error = ERROR_TEXT
      }
      this.ui.loading = false
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
    },

    async handlePhotosUpload (event) {
      const photoList = event.target.files
      this.ui.uploading = true
      for (let i = 0; i < photoList.length; i++) {
        const photo = photoList.item(i)
        try {
          await uploadPhoto({
            photo,
            albumName: this.$route.params.name
          })

          this.ui.uploadMessage = UPLOAD_SUCCESS_TEXT
          const that = this
          setTimeout(function () {
            that.ui.uploadMessage = ''
          }, 7000)
        } catch (err) {
          this.ui.uploadMessage = UPLOAD_ERROR_TEXT
          const that = this
          setTimeout(function () {
            that.ui.uploadMessage = ''
          }, 7000)
        }
      }
    }
  },

  mounted () {
    this.fetchAlbumPhotos()
  }
}
</script>
