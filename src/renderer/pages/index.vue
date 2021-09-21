<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <div>
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
import VuetifyLogo from '../components/VuetifyLogo.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    Logo,
    VuetifyLogo,
  },
  data: () => ({
    text: 'test',
  }),
  mounted() {
    const filelist = open()
    console.log('filelist', filelist)
  },
  methods: {
    async onOpen() {
      const responce = await (window as any).electron.open()
      console.log(responce);
    },
    async onSave() {
      await (window as any).electron.save(this.text)
    },
  },
})
</script>
