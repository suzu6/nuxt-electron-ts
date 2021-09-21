<template>
  <v-layout>
    <v-flex class="text-center">
      <vuetify-logo />
      <v-btn to="/">Home</v-btn>
      <NuxtLink to="/"> Home page </NuxtLink>
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import VuetifyLogo from '../components/VuetifyLogo.vue'

export default Vue.extend({
  name: 'About',
  components: {
    VuetifyLogo,
  },
})
</script>
