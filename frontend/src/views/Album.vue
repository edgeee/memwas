<template>
  <div class="m-l-md m-r-md">
    <p class="is-size-4 has-text-weight-light" style="letter-spacing: 2px;">
      <span class="icon">
        <i class="far fa-image"></i>
      </span>
      <span class="is-capitalized"> {{ $route.query.name }}</span>
    </p>

    <section class="m-t-md m-b-xl">
      <div v-if="uploading">
        <spinner />
        <p>Uploaded {{ uploadCount }} of {{ uploadTotal }}</p>
      </div>
      <p v-else-if="uploadText">{{ uploadText }}</p>
      <p v-else-if="uploadError">{{ uploadError }}</p>

      <div v-else class="field is-size-6">
        <div class="file is-danger">
          <label class="file-label is-small">
            <input class="file-input is-small"
                   type="file"
                   name="resume"
                   accept="image/png,image/jpeg"
                   multiple
                   @change="doBulkUpload">

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

    <div class="m-t-sm m-b-sm">
      <gallery :items="items" />
    </div>

    <div v-if="error">
      {{ error }}
    </div>

    <div class="m-t-xl" v-else-if="loading">
      <spinner  />
    </div>

    <div v-else-if="items.length === 0">
      No images in this album yet.
    </div>

    <div v-else-if="hasItemsLeftToFetch" class="has-text-left m-t-xl">
      <button class="button is-dark" @click="fetchAlbumPhotos">
        Load more...
      </button>
    </div>
  </div>
</template>

<script>
import { fetchPhotos, uploadPhoto } from '../api'
import Spinner from '../components/spinner.vue'
import Gallery from '../components/gallery.vue'

const ITEMS_PER_FETCH_OP = 10

export default {
  name: 'album',

  components: {
    Spinner,
    Gallery
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
      },

      uploadError: '',
      uploadTotal: 0,
      uploadCount: 0,
      uploading: false,
      uploadFailedItems: [],
      uploadText: ''
    }
  },

  computed: {
    hasItemsLeftToFetch () {
      return this.items.length < this.meta.total
    }
  },

  methods: {
    async fetchAlbumPhotos () {
      this.error = ''
      this.loading = true
      try {
        const res = await fetchPhotos({
          offset: this.meta.offset,
          limit: this.meta.limit,
          albumId: this.$route.params.id
        })

        this.meta.limit = res.limit
        this.meta.offset += res.limit
        this.meta.total = res.total
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
      this.loading = false
    },

    async doBulkUpload (event) {
      const files = event.target.files
      const uploadFuncs = []

      for (let i = 0; i < files.length; i++) {
        uploadFuncs.push(async () => {
          try {
            await uploadPhoto({
              photo: files.item(i),
              albumId: this.$route.params.id
            })
            this.uploadCount += 1
          } catch (err) {
            this.uploadFailedItems.push(files.item(i))
          }
        })
      }

      this.uploading = true
      this.uploadTotal = files.length
      this.uploadFailedItems = []
      this.uploadCount = 0
      await Promise.all(uploadFuncs.map(async fn => fn()))

      this.uploading = false
      let uploadText = `Successully uploaded ${this.uploadCount} of ${this.uploadTotal} items.`
      if (this.uploadFailedItems.length > 0) {
        uploadText += ` ${this.uploadFailedItems.length} failed to upload.`
      }
      this.uploadText = uploadText
      setTimeout(() => {
        this.uploadText = ''
      }, 5000)
    }
  },

  mounted () {
    this.fetchAlbumPhotos()
  }
}
</script>
