<template>
  <v-dialog v-model="open" hide-overlay persistent max-width="750">
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text>
        <div v-if="loading" class="text-center">
          <v-progress-circular
            indeterminate
            :size="70"
            :width="7"
            color="primary"
          ></v-progress-circular>
        </div>
        <div v-else>
          <div v-if="items.length > 0">
            <v-alert prominent text outlined color="blue" type="info">
              <p>
                Berikut adalah data peserta yang akan dikirim ke Aplikasi Sistem
                Informasi Manajemen Laboratorium (SIM Lab).
              </p>
            </v-alert>
            <template>
              <v-data-table
                :headers="headers"
                :items="items"
                :loading="loading"
                :footer-props="{
                  'items-per-page-options': [50, 100, 500]
                }"
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
          <div v-else-if="items.length < 1">
            <v-alert text outlined color="deep-orange">
              <p>
                Mohon maaf seluruh data peserta yang sudah dites telah dikirim
                atau tidak ada data peserta yang sudah dites.
              </p>
            </v-alert>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pb-6 mr-4 justify-end">
        <div v-if="!loading">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="close"
          >
            Batal
          </v-btn>
          <v-btn
            v-if="items.length > 0"
            color="success"
            class="ml-2 px-2"
            @click="openWarning"
          >
            Kirim Data
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <dialog-integration-warning
      :open="dialogWarning"
      @close="closeWarning"
      @send="send"
    />
  </v-dialog>
</template>

<script>
import DialogIntegrationWarning from '@/components/DialogIntegrationWarning'
export default {
  components: { DialogIntegrationWarning },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: null,
      color: null,
      dialogWarning: false,
      headers: [
        {
          text: 'Nomor Pendaftaran',
          align: 'start',
          value: 'applicant.registration_code',
          sortable: false
        },
        { text: 'Nama', value: 'applicant.name' },
        { text: 'Kode Sampel', value: 'lab_code_sample' },
        { text: 'Status', value: 'status_on_simlab', sortable: false }
      ]
    }
  },
  methods: {
    closeWarning() {
      this.dialogWarning = false
    },
    close() {
      this.$emit('close')
    },
    openWarning() {
      this.dialogWarning = true
    },
    send() {
      this.$emit('send')
    }
  }
}
</script>
