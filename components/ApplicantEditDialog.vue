<template>
  <div>
    <v-dialog :value="open" persistent max-width="700">
      <v-card>
        <v-card-title>
          <span class="headline font-weight-medium pl-4 pt-4"
            >Edit Peserta Tes</span
          >
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="registrationCode"
              label="Nomor Pendaftaran"
              filled
              readonly
              outlined
              dense
            />
            <v-text-field
              v-if="isEditApplicant"
              v-model="nik"
              label="NIK"
              outlined
              dense
            />
            <v-text-field v-model="name" label="Nama Peserta" outlined dense />
            <v-select
              v-model="gender"
              :items="[
                { text: 'Laki-Laki', value: 'M' },
                { text: 'Perempuan', value: 'F' }
              ]"
              label="Jenis Kelamin"
              outlined
              dense
            ></v-select>
            <v-text-field
              v-model="workPlace"
              label="Instansi Tempat Bekerja"
              outlined
              dense
            />
            <v-text-field
              v-if="isEditApplicant"
              v-model="phone_number"
              label="Nomor Telepon"
              outlined
              dense
            />
            <v-select
              v-if="isEditApplicant"
              v-model="city_code"
              :items="getKabkot"
              label="Kab/Kota Tinggal Sekarang"
              item-text="name"
              item-value="code"
              outlined
              dense
            />
            <v-text-field
              v-if="isEditApplicant"
              v-model="address"
              label="Alamat Tempat Tinggal Sekarang"
              outlined
              dense
            />
            <v-select
              v-if="isEditApplicant"
              v-model="status"
              :items="statusOptions"
              item-text="text"
              item-value="value"
              label="Status Kesehatan"
              outlined
              dense
            ></v-select>
          </v-container>
        </v-card-text>

        <v-card-actions class="pb-8 mr-7 mt-n8 justify-end">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="close"
          >
            Batal
          </v-btn>
          <v-btn color="primary" class="ml-2 px-2" @click="save">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { STATUS_OPTIONS } from '@/utilities/constant'
import { mapGetters } from 'vuex'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },

    recordId: {
      type: Number,
      default: null
    },

    isEditApplicant: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      registrationCode: null,
      name: null,
      nik: null,
      gender: null,
      city_code: null,
      address: null,
      phone_number: null,
      status: null,
      workPlace: null
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    statusOptions() {
      return STATUS_OPTIONS
    }
  },

  watch: {
    recordId(value) {
      if (value) {
        this.fetchRecord()
      }
    }
  },

  methods: {
    async fetchRecord() {
      const id = this.recordId
      const { data } = await this.$axios.$get(`/rdt/applicants/${id}`)

      this.registrationCode = data.registration_code
      this.name = data.name
      this.nik = data.nik
      this.gender = data.gender
      this.city_code = data.city_code
      this.address = data.address
      this.phone_number = data.phone_number
      this.status = data.person_status
      this.workPlace = data.workplace_name
    },

    async save() {
      const id = this.recordId

      try {
        await this.$axios.$put(`/rdt/applicants/${id}`, {
          name: this.name,
          gender: this.gender,
          nik: this.nik,
          city_code: this.city_code,
          address: this.address,
          phone_number: this.phone_number,
          person_status: this.status,
          workplace_name: this.workPlace
        })

        this.$emit('save')
      } catch (e) {
        //
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>
