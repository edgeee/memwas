<template>
  <div>
    <v-container>
      <div class="headline grey--text">{{ $route.params.name }}'s Album</div>

      <v-layout row class="pt-4 pb-2">
        <div v-if="uploading">
          <div>
            <v-progress-circular
              :size="60"
              :width="4"
              color="pink"
              indeterminate
            ></v-progress-circular>
          </div>
          <div>
            <p class="body-2">Uploading photos for indexing...</p>
          </div>
        </div>
        <div v-else-if="uploadComplete">
          <p class="body-2">
            Photos successfully uploaded for indexing. Images without human face(s) in them
            will be ignored.
          </p>
        </div>
        <div v-else>
          <v-btn flat small class="pink darken-1 white--text" @click="$refs.photos.click()">
            <span>Add photos</span>
          </v-btn>
        </div>

        <input type="file" multiple ref="photos" style="display: none;" @change="onPhotosUpload">
      </v-layout>

      <v-layout row wrap>
        <v-flex sm12>
          <v-card flat class="pa-3">
            <div v-if="loading">
              <v-progress-circular
                :size="70"
                :width="4"
                color="pink"
                indeterminate
              ></v-progress-circular>
            </div>
            <div v-else-if="error">
              {{ error }}
            </div>
            <div v-else-if="images.length == 0">
              There are no photos in this album yet.
            </div>
            <div v-else>
              <image-list :images="images" />
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-center class="py-4" v-if="nextToken">
        <v-flex xs-12 sm6>
          <v-btn block flat class="grey lighten-2" @click="fetchPhotos">Fetch more...</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from '../axios'
import ImageList from '@/components/ImageList.vue'

const ITEMS_PER_FETCH_OP = 20
const ERROR_TEXT = 'Unable to fetch photos; please try again.'

export default {
  components: {
    ImageList
  },

  data () {
    return {
      images: [],
      loading: false,
      error: '',
      nextToken: null,

      uploading: false,
      uploadMeta: {
        uploadedItems: [],
        failedItems: [],
        total: 0
      },
      uploadComplete: false
    }
  },

  computed: {
    uploadItemsLeft () {
      const info = this.$data.uploadMeta
      return info.total - (info.failedItems.length + info.uploadedItems.length)
    }
  },

  methods: {
    async fetchPhotos () {
      const payload = {
        limit: ITEMS_PER_FETCH_OP,
        album_name: this.$route.params.name
      }

      if (this.nextToken) {
        payload.next_token = this.nextToken
      }

      this.loading = true
      try {
        const resp = await axios.get('/images', {
          params: payload
        })
        resp.data.items.forEach((item) => {
          this.images.push(item.image_url)
        })

        this.nextToken = resp.data.next_token
      } catch (err) {
        this.error = ERROR_TEXT
      }
      this.loading = false
    },

    async onPhotosUpload (event) {
      const photoList = event.target.files
      this.uploadMeta.total = photoList.length
      this.uploadComplete = false
      this.uploading = true

      for (let i = 0; i < photoList.length; i++) {
        const photo = photoList.item(i)
        try {
          await axios.post('/images', photo, {
            params: {
              album_name: this.$route.params.name
            }
          })
          this.uploading.uploadedItems.push(photo)
        } catch (err) {
          this.uploadMeta.failedItems.push(photo)
        }
      }

      this.uploading = false
      this.uploadComplete = true

      const that = this
      setTimeout(function () {
        that.images = []
        that.fetchPhotos()
      }, 10000)
    }
  },

  created () {
    this.fetchPhotos()
  }
}
</script>
