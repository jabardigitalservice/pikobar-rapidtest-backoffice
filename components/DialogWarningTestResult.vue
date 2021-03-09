<template>
  <v-dialog v-model="open" hide-overlay persistent max-width="628">
    <v-card>
      <v-card-title class="text-center">
        <span class="col pl-10 red--text">Peringatan!</span>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="text-center">
          <p>Data Hasil Test peserta ada yang kosong.</p>
          <p>Silahkan lengkapi data hasil test pada peserta berikut.</p>
        </div>
        <div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th scope="col" class="text-left">
                    Nomor Pendaftaran
                  </th>
                  <th scope="col" class="text-left">
                    Nama
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in items" :key="data.id">
                  <td scope="row">
                    {{ data.applicant.registration_code }}
                  </td>
                  <td scope="row">{{ data.applicant.name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
      <v-card-actions class="pb-6 justify-end">
        <v-btn color="grey darken-1" outlined class="mr-2 px-2" @click="close">
          Keluar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
