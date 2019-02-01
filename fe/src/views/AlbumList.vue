<template>
  <div class="albums">
    <v-container class="">
      <div class="headline grey--text">MANAGE ALBUMS</div>

      <v-layout row class="pt-4 pb-2" style="display: none;">
        <v-dialog v-model="createAlbumDialog" persistent max-width="350px">
          <v-btn slot="activator" small flat class="pink lighten-1 small white--text">Create album</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Create Album</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Album Name*" required v-model="createAlbumField"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-layout row justify-center>
                <p v-if="createAlbumError" class="body-2">
                  {{ createAlbumError }}
                </p>
                <v-progress-circular
                  :size="40"
                  :width="4"
                  color="pink"
                  indeterminate
                  v-if="createAlbumLoading"
                ></v-progress-circular>
              </v-layout>
              <div>
                <v-btn v-if="!createAlbumLoading"
                       color="blue darken-1" flat @click="createAlbumDialog = false">Close</v-btn>
                <v-btn v-if="!createAlbumLoading"
                       color="blue darken-1" flat @click="onCreateAlbum">Create</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout row wrap fill-height class="pa-1 album">
        <v-flex xs-12 v-if="loading">
          <div>
            <v-progress-circular
              :size="60"
              :width="4"
              color="pink"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-flex>
        <v-flex xs-12 v-else-if="error">
          <p class="body-2">{{ error }}</p>
        </v-flex>
        <v-flex xs-12 v-else-if="albums.length == 0">
          <v-card flat class="pa-3">
            <p class="body-2">There are no albums created yet.</p>
          </v-card>
        </v-flex>
        <v-flex xs-12 sm6 md3 v-for="album in albums" :key="album.name" v-else>
          <album-item :album="album" class="mx-1 my-3" />
        </v-flex>
      </v-layout>

      <v-layout row justify-center class="py-4" v-if="nextToken">
        <v-flex xs-12 sm6>
          <v-btn block flat class="grey lighten-2" @click="fetchAlbums">Fetch more...</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from '../axios'
import AlbumItem from '@/components/AlbumItem'

const ITEM_PER_FETCH_OP = 10
const ERROR_TEXT = 'Unable to fetch albums. Try again.'

export default {
  components: {
    AlbumItem
  },

  data () {
    return {
      loading: false,
      error: '',
      albums: [],
      nextToken: null,

      createAlbumDialog: false,
      createAlbumError: '',
      createAlbumField: '',
      createAlbumLoading: false
    }
  },

  methods: {
    async fetchAlbums () {
      const params = {
        limit: ITEM_PER_FETCH_OP,
        nextToken: typeof this.nextToken === 'string' ? this.nextToken : undefined
      }

      this.error = ''
      this.loading = true
      try {
        const resp = await axios.get('/albums', { params })
        resp.data.items.forEach((album) => {
          this.albums.push(album)
        })
        this.nextToken = resp.data.next_token
      } catch (err) {
        this.error = ERROR_TEXT
        console.log(err, )
      }
      this.loading = false
    },

    async onCreateAlbum () {
      const albumName = this.createAlbumField
      console.log('albumname: ', albumName)
      try {
        await axios.post('/albums', {
          album_name: albumName
        })

        this.fetchAlbums()
      } catch (err) {
        this.createAlbumError = 'Cannot create. Try again.'
      }
    }
  },

  created () {
    this.fetchAlbums()
  }
}
</script>
