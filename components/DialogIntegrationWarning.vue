<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <v-card>
        <v-card-title>
          <span class="col pl-10 text-center">Perhatian!</span>
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 font-weight-medium">
            Dimohon untuk memastikan bahwa data peserta yang akan dikirim sudah
            benar. Data peserta yang sudah dikirim tidak dapat diubah, dihapus,
            atau dikirim kembali.
          </p>
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="close"
          >
            Tidak
          </v-btn>
          <v-btn color="primary" class="ml-2 px-2" @click="send">
            Kirim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    send() {
      this.$emit('send')
    }
  }
}
</script>
