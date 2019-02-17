<template>
  <div>
    <photoswipe :items="items"></photoswipe>
  </div>
</template>

<script>
import Photoswipe from './photoswipe'

export default {
  name: 'gallery',

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  computed: {},

  components: {
    Photoswipe
  }
}
</script>
