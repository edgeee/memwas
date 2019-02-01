<template>
  <div class="mt-4 mb-2">
    <v-container fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
       <v-flex >
         <h2 class="headline grey--text xs-text-center">
          SEARCH PHOTOS
         </h2>

         <v-layout row wrap justify-center class="py-4">
           <v-flex xs12 sm6>
             <v-btn flat class="pink lighten-1 white--text" @click="$refs.image.click()">
              <v-icon left>search</v-icon>
              Upload photo to search
             </v-btn>
            <input
              type="file"
              style="display: none"
              ref="image"
              accept="image/*"
              @change="onImagePicked">
           </v-flex>
         </v-layout>
       </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <div v-if="searching">
        <v-progress-circular
          :size="70"
          :width="4"
          color="pink"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-if="doneSearch">
        <h3 class="subheading grey--text pb-4">SEARCH RESULTS</h3>
          <p class="py-2 body-2" v-if="error">
            {{error}}
          </p>
          <p v-else-if="imageSearchResults.length == 0">
            No matching photos found.
          </p>
          <div v-else>
            <p class="pb-2 body-2"> These are the photos you appear in: </p>
            <image-list :images="imageSearchResults" />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from '../axios'
import ImageList from '@/components/ImageList.vue'

const ERROR_TEXT = 'An error occurred. Please try again.'

export default {
  components: {
    ImageList
  },
  data () {
    return {
      imageSearchResults: [],
      error: '',
      searching: false,
      doneSearch: false
    }
  },

  methods: {
    async onImagePicked (e) {
      this.error = ''
      this.imageSearchResults = []
      this.searching = true
      this.doneSearch = false
      try {
        const photoFile = e.target.files[0]
        const resp = await axios.post('/search', photoFile)
        resp.data.items.forEach((item) => {
          this.imageSearchResults.push(item.image_url)
        })
      } catch (err) {
        this.error = ERROR_TEXT
      }

      this.searching = false
      this.doneSearch = true
    }
  }
}
</script>
