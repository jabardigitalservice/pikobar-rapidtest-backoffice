<template>
  <div>
    <v-dialog :value="open" max-width="60%">
      <validation-observer
        v-slot="{ valid, handleSubmit }"
        ref="observerImport"
        tag="div"
      >
        <v-card>
          <v-card-title>
            <span class="col text-subtitle-1 font-weight-bold my-n5">
              Import Data Hasil Test
            </span>
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-10">
            <div>
              <p class="text-subtitle-1 pt-5 font-weight-medium">
                Untuk melakukan import, wajib menggunakan template excel yang
                sudah tersedia.
              </p>
              <a class="body-1" @click="getTemplateImport">
                Unduh template excel di sini
              </a>
            </div>
            <form ref="importForm" @submit.prevent="handleSubmit(doImport)">
              <div class="py-5">
                <div class="py-6 mb-4 text-center import-border">
                  <validation-provider
                    v-slot="{ errors }"
                    name="File"
                    rules="required"
                  >
                    <v-file-input
                      v-model="importFile"
                      :error-messages="errors"
                      counter
                      show-size
                      accept="xlsx"
                      label="Tambah file di sini"
                      name="file"
                    />
                  </validation-provider>
                </div>
                <div class="text-right">
                  <v-btn color="primary" :disabled="!valid" type="submit">
                    Impor
                  </v-btn>
                </div>
              </div>
            </form>
            <div class="mb-3">
              <p class="text-uppercase text-subtitle-1 font-weight-black">
                Panduan Penggunaan
              </p>
              <ol
                class="text-subtitle-1 font-weight-medium import-text-line-height"
              >
                <li>Siapkan data yang akan diimport</li>
                <ol type="a">
                  <li>Unduh template excel yang telah disediakan</li>
                  <li>Isi dan lengkapi data kasus pada template excel</li>
                  <li>
                    Setelah selesai melengkapi data, tekan simpan pada excel
                  </li>
                </ol>
                <li>
                  Masukan file yang akan diimport dengan klik pada bagian
                  "Tambah File". Kemudian klik tombol "Import"
                </li>
                <li>
                  Import akan gagal jika terdapat ketidaksesuaian format dalam
                  file
                </li>
                <li>
                  Jika proses import berhasil, data akan tersimpan secara
                  otomatis pada list kasus
                </li>
              </ol>
            </div>
          </v-card-text>
        </v-card>
      </validation-observer>
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
  data() {
    return {
      importFile: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    doImport() {
      this.$emit('doImport', this.importFile)
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
