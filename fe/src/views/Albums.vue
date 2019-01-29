<template>
  <div class="albums">
    <v-container class="">
      <div class="headline grey--text">MANAGE ALBUMS</div>
      <v-layout row class="pt-4 pb-2">
        <v-btn small flat class="pink lighten-1 small white--text">Create album</v-btn>
      </v-layout>

      <v-layout row wrap fill-height class="pa-1 album">
        <v-flex xs-12 sm6 md3 v-for="album in albums" :key="album.name">
          <album-item :album="album" class="mx-1 my-3" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import AlbumItem from '@/components/AlbumItem'

export default {
  components: {
    AlbumItem
  },

  data () {
    return {
      loading: false,
      error: '',
      albums: [
        {
          name: 'layla',
          human_readable_name: 'Laya',
          created_at: '2019-01-27 16:04:49.298257'
        },
        {
          name: 'rasheed',
          human_readable_name: 'Rasheed',
          created_at: '2019-01-27 16:04:49.298257'
        },
        {
          name: 'arsenal-team',
          human_readable_name: 'Arsenal Team',
          created_at: '2019-01-27 16:04:49.298257'
        },
        {
          name: 'empire',
          human_readable_name: 'Empire',
          created_at: '2019-01-27 16:04:49.298257'
        },
        {
          name: 'fenty-wap',
          human_readable_name: 'Fenty wap',
          created_at: '2019-01-27 16:04:49.298257'
        }
      ]
    }
  }
}
</script>
