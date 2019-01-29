<template>
  <v-card flat class="pa-2">
    <div class="pb-3 font-weight-medium">
      <v-icon small >photo_album</v-icon>
      <span class="pl-2 text-capitalize">{{ album.human_readable_name }}</span>
    </div>
    <div v-if="error"></div>
    <div v-else-if="loading"></div>
    <div v-else-if="images.length > 0">
      <v-layout row wrap>
        <v-flex v-for="(image, index) in images" :key="index" xs4>
          <div class="image-container">
            <img :src="image" :alt="`image ${index}`" class="image-item">
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
      <p>This album is empty.</p>
    </div>
    <v-layout class="pt-2">
      <v-btn flat fab small class="pink darken-1 white--text">
        <v-icon>add_a_photo</v-icon>
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      images: [
        'https://randomuser.me/api/portraits/men/23.jpg',
        'https://randomuser.me/api/portraits/women/20.jpg',
        'https://randomuser.me/api/portraits/men/21.jpg',
        'https://randomuser.me/api/portraits/women/24.jpg',
        'https://randomuser.me/api/portraits/men/20.jpg',
        'https://randomuser.me/api/portraits/women/30.jpg'
      ],
      loading: false,
      error: ''
    }
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
