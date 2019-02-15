<template>
  <div class="m-r-md">
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
    <photoswipe :items="items"></photoswipe>

    <div v-if="ui.error">
      {{ ui.error }}
    </div>
    <spinner v-else-if="ui.loading" />

    <div v-else-if="items.length === 0">
      No images in this album yet.
    </div>

    <div v-else-if="!ui.loading && canFetch" class="has-text-centered">
      <button class="button is-dark" @click="fetchAlbumPhotos">
        Load more...
      </button>
    </div>
  </div>
</template>

<script>
import { fetchPhotos, uploadPhoto } from '../api'
import Spinner from '../components/spinner.vue'
import Photoswipe from '../components/photoswipe'

const ITEMS_PER_FETCH_OP = 20
const ERROR_TEXT = 'An error occurred; try again.'
const UPLOAD_SUCCESS_TEXT = 'Upload completed successfully.'
const UPLOAD_ERROR_TEXT = 'Unable to upload some photos; try again.'

export default {
  name: 'album',

  components: {
    Spinner,
    Photoswipe
  },

  data () {
    return {
      items: [],
      nextToken: null,
      canFetch: false,
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
        this.canFetch = !!this.next_token
        this.nextToken = res.next_token
        for (let item, i = 0; i < res.items.length; i++) {
          item = {
            src: res.items[i].image_url,
            thumbnail: res.items[i].image_thumbnail_url
          }

          const that = this
          this.getImageDimensions(item.src, function (err, props) {
            if (err) { /* pretend to handle error */ } else {
              item.w = props.w
              item.h = props.h
              that.items.push(item)
            }
          })
        }
      } catch (err) {
        this.ui.error = ERROR_TEXT
      }
      this.ui.loading = false
    },

    getImageDimensions (imageSrc, cb) {
      const img = new Image()
      img.src = imageSrc
      img.onload = function () {
        cb(null, {
          w: this.width,
          h: this.height
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
            that.fetchAlbumPhotos()
          }, 7000)
        } catch (err) {
          this.ui.uploadMessage = UPLOAD_ERROR_TEXT
          const that = this
          setTimeout(function () {
            that.ui.uploadMessage = ''
          }, 7000)
        }
      }

      this.ui.uploading = false
    }
  },

  mounted () {
    this.fetchAlbumPhotos()
  }
}
</script>
