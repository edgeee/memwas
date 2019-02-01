<template>
  <div>
    <v-layout row wrap>
      <v-flex xs-12 sm6 md3 v-for="(image, index) in images" :key="index">
        <div class="image-container py-2 text-xs-center">
          <img :src="image" alt="" class="image-item">
        </div>
        <div class="text-xs-center">
          <v-btn small flat>
            <span class="pl-2">Download</span>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  }
}
</script>
