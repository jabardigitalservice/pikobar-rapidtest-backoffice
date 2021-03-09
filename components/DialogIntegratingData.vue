<template>
  <v-dialog v-model="open" hide-overlay persistent max-width="750">
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text v-if="items.length > 0">
        <v-alert prominent text outlined color="blue" type="info">
          <p>
            Berikut ini adalah data peserta yang akan diintegrasikan ke Aplikasi
            Simlab.
          </p>
          <p>
            Data yang diintegrasikan adalah data peserta yang telah melakukan
            checkin.
          </p>
        </v-alert>
        <div>
          <template>
            <v-data-table
              :headers="headers"
              :items="items"
              hide-default-footer
              style="border: 1px solid #cacaca;"
            >
              <template v-slot:[`item.status_on_simlab`]="{ item }">
                <v-layout v-if="item.status_on_simlab === null" justify-start>
                  <v-chip class="ma-2" color="default" label>
                    Belum Dikirim
                  </v-chip>
                </v-layout>
                <v-layout
                  v-else-if="item.status_on_simlab === 'SENT'"
                  justify-start
                >
                  <v-chip class="ma-2" color="green accent-1" label>
                    Sudah Dikirim
                  </v-chip>
                </v-layout>
                <v-layout
                  v-else-if="item.status_on_simlab === 'FAILED'"
                  justify-start
                >
                  <v-chip class="ma-2" color="deep-orange lighten-4" label>
                    Gagal Dikirim
                  </v-chip>
                </v-layout>
              </template>
            </v-data-table>
          </template>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <div>
          <v-alert text outlined color="deep-orange">
            <p>
              Mohon maaf data peserta pada kegiatan ini belum memiliki kode
              sampel sehingga belum bisa dikirim ke aplikasi Labkes.
            </p>
          </v-alert>
        </div>
      </v-card-text>
      <v-card-actions class="pb-6 mr-4 justify-end">
        <v-btn color="grey darken-1" outlined class="mr-2 px-2" @click="close">
          Batal
        </v-btn>
        <v-btn
          v-if="items.length > 0"
          color="success"
          class="ml-2 px-2"
          @click="send"
        >
          Kirim Data
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
  data() {
    return {
      status: null,
      color: null,
      headers: [
        {
          text: 'Nomor Pendaftaran',
          align: 'start',
          value: 'applicant.registration_code'
        },
        { text: 'Nama', value: 'applicant.name' },
        { text: 'Kode Sample', value: 'lab_code_sample' },
        { text: 'Status', value: 'status_on_simlab' }
      ]
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
