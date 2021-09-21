<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
      </div>
      <div class="text-center">
        <v-btn to="/about">about</v-btn>
        <button type="button" @click="onOpen">Open</button>
        <button type="button" @click="onSave">Save</button>
      </div>
      <div>
        <textarea v-model="text"></textarea>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '../components/Logo.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    Logo,
  },
  data: () => ({
    text: 'test',
  }),
  methods: {
    async onOpen() {
      await (window as any).electron.open()
    },
    async onSave() {
      await (window as any).electron.save(this.text)
    },
  },
})
</script>
