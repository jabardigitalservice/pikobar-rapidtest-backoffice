<template>
  <div>
    <v-dialog :value="open" persistent scrollable max-width="60%">
      <validation-observer
        v-slot="{ valid, handleSubmit }"
        ref="observerImport"
        tag="div"
      >
        <v-card>
          <v-card-title>
            <span class="col">Impor Data Hasil Test</span>
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-10">
            <div>
              <p class="text-subtitle-1 pt-5 font-weight-medium">
                Untuk melakukan impor, wajib menggunakan template excel yang
                sudah tersedia.
              </p>
              <a class="body-1" @click="getTemplateImport">
                Unduh template excel di sini
              </a>
            </div>
            <form ref="importForm" @submit.prevent="handleSubmit(doImport)">
              <div class="py-5">
                <div class="py-6 mb-4 text-center import-border">
                  <validation-provider name="File" rules="required">
                    <v-file-input
                      v-if="!loading"
                      v-model="importFile"
                      counter
                      show-size
                      accept="xlsx"
                      label="Tambah file di sini"
                      name="file"
                    />
                  </validation-provider>
                  <v-progress-circular
                    v-if="loading"
                    :indeterminate="loading"
                    :size="60"
                    :width="6"
                    color="primary"
                  />
                </div>
                <div class="text-right">
                  <v-btn color="primary" :disabled="!valid" type="submit">
                    Impor
                  </v-btn>
                </div>
              </div>
            </form>
            <div class="mb-3">
              <v-tabs v-model="tabs">
                <v-tab>Panduan Penggunaan</v-tab>
                <v-tab>Validasi</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tabs">
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <ol
                        class="text-subtitle-1 font-weight-medium import-text-line-height"
                      >
                        <li>Siapkan data yang akan diimpor</li>
                        <ol type="a">
                          <li>Unduh template excel yang telah disediakan</li>
                          <li>
                            Isi dan lengkapi data kasus pada template excel
                          </li>
                          <li>
                            Setelah selesai melengkapi data, tekan simpan pada
                            excel
                          </li>
                        </ol>
                        <li>
                          Masukan file yang akan diimpor dengan klik pada bagian
                          "Tambah File". Kemudian klik tombol "Impor"
                        </li>
                        <li>
                          Impor akan gagal jika terdapat ketidaksesuaian format
                          dalam file
                        </li>
                        <li>
                          Jika proses impor berhasil, data akan tersimpan secara
                          otomatis pada list kasus
                        </li>
                      </ol>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-alert
                        v-if="successMessage"
                        color="green"
                        outlined
                        text
                        type="success"
                      >
                        {{ successMessage }}
                      </v-alert>
                      <v-alert
                        v-for="(error, index) in errorMessage"
                        v-else-if="errorMessage"
                        :key="index"
                        text
                        outlined
                        type="error"
                        icon="mdi-alert-circle-outline"
                      >
                        {{ error }}
                      </v-alert>
                      <v-alert
                        v-else
                        class="text-center"
                        color="primary"
                        outlined
                        text
                      >
                        Tidak ada data. Silahkan pilih file kemudian tekan
                        tombol impor untuk mengimpor data hasil tes.
                      </v-alert>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </v-card-text>
        </v-card>
      </validation-observer>
    </v-dialog>
  </div>
</template>
<script>
import { FAILED_IMPORT } from '@/utilities/constant'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    event: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      importFile: null,
      tabs: 0,
      loading: false,
      successMessage: null,
      errorMessage: null
    }
  },
  methods: {
    resetData() {
      this.tabs = 0
      this.successMessage = null
      this.errorMessage = null
    },
    close() {
      this.importFile = null
      this.resetData()
      this.$emit('close')
    },
    async doImport() {
      this.loading = true
      this.resetData()
      const formData = new FormData()
      formData.append('file', this.importFile)
      try {
        const response = await this.$store.dispatch(
          'eventParticipants/importTestResult',
          {
            idEvent: this.event,
            formData
          }
        )
        this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
        this.successMessage = response.message
      } catch (error) {
        if (error.data.errors && error.data.errors.file) {
          this.errorMessage = error.data.errors.file
        } else if (error.data.errors) {
          this.errorMessage = error.data.errors
        } else {
          this.errorMessage = [FAILED_IMPORT]
        }
      } finally {
        this.tabs = 1
        this.loading = false
      }
    },
    async getTemplateImport() {
      try {
        const response = await this.$axios.get('template/import-result-test', {
          responseType: 'blob'
        })
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))

        const fileLink = document.createElement('a')

        fileLink.href = fileURL

        let fileName = 'Template_Import_Hasil_tes.xlsx'
        const contentDisposition = response.headers['content-disposition']
        const fileNameMatch = contentDisposition.match(/filename=(.+)/)
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1]
        }

        fileLink.setAttribute('download', fileName)

        document.body.appendChild(fileLink)

        fileLink.click()
      } catch (error) {
        this.$toast.show({
          message: error.response.message
        })
      }
    }
  }
}
</script>
