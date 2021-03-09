<template>
  <div>
    <v-dialog scrollable :value="open" persistent max-width="1000">
      <v-card>
        <v-card-title>
          <span class="headline" style="font-size: 52px;">Detail Peserta</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>NIK</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ nik }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Nomor Registrasi</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ registrationCode }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Nama Peserta</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Nomor Telepon</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ phoneNumber }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Tanggal Lahir</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ birthDate }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Kota/Kabupaten</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ cityName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Jenis Pekerjaan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ occupationType || '-' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Kecamatan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ districtName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Nama Pekerjaan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ occupationName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Kelurahan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ villageName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Tempat Bekerja</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ workplaceName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Alamat Domisili</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ address }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Status Kesehatan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ personStatus }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-divider class="mx-4" />
          <v-row>
            <v-col>
              <v-list-item two-line>
                <v-list-item-content v-if="congenitalDisease.length > 0">
                  <v-list-item-title>Penyakit Bawaan</v-list-item-title>
                  <v-list-item-subtitle
                    v-for="item in congenitalDisease"
                    :key="item"
                  >
                    {{ item }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-list-item-title>Penyakit Bawaan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ '-' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Kota Kunjungan</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ cityVisited || '-' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list-item two-line>
                <v-list-item-content v-if="symptoms.length > 0">
                  <v-list-item-title>Gejala</v-list-item-title>
                  <v-list-item-subtitle v-for="item in symptoms" :key="item">
                    {{ item }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-list-item-title>Gejala</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ '-' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Gejala Lainnya</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ symptomsNotes }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-container>
            <v-row>
              <v-col
                v-if="detailType === 'applicant' && invitations.length > 0"
                cols="12"
              >
                <h3>Riwayat Undangan / Hasil Tes</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th scope="col" class="text-left">Nama Kegiatan</th>
                        <th scope="col" class="text-left">Tanggal Kegiatan</th>
                        <th scope="col" class="text-left">Checkin</th>
                        <th scope="col" class="text-left">Jenis Tes</th>
                        <th scope="col" class="text-left">Tanggal Hasil Tes</th>
                        <th scope="col" class="text-left">Hasil Tes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="invitation in invitations"
                        :key="invitation.id"
                      >
                        <td scope="row">
                          {{
                            invitation.event ? invitation.event.event_name : '-'
                          }}
                        </td>
                        <td scope="row">
                          {{
                            invitation.event
                              ? $dateFns.format(
                                  new Date(invitation.event.start_at),
                                  'dd MMMM yyyy'
                                )
                              : '-'
                          }}
                        </td>
                        <td scope="row">
                          {{
                            invitation.attended_at
                              ? $dateFns.format(
                                  new Date(invitation.attended_at),
                                  'dd MMMM yyyy HH:mm'
                                )
                              : '-'
                          }}
                        </td>
                        <td scope="row">
                          {{
                            invitation.test_type ? invitation.test_type : '-'
                          }}
                        </td>
                        <td scope="row">
                          {{
                            invitation.result_at
                              ? $dateFns.format(
                                  new Date(invitation.result_at),
                                  'dd MMMM yyyy'
                                )
                              : '-'
                          }}
                        </td>
                        <td scope="row">
                          {{
                            invitation.lab_result_type
                              ? invitation.lab_result_type
                              : '-'
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            Keluar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getPersonStatusText } from '@/utilities/personStatus'
import {
  SYMPTOMS_OPTIONS,
  CONGENITAL_DESEASE_OPTIONS
} from '@/utilities/constant'
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

    detailType: {
      type: String,
      default: 'applicant'
    }
  },

  data() {
    return {
      registrationCode: null,
      nik: null,
      name: null,
      address: null,
      cityName: null,
      districtName: null,
      villageName: null,
      occupationType: null,
      occupationName: null,
      workplaceName: null,
      phoneNumber: null,
      birthDate: null,
      personStatus: null,
      symptoms: [],
      symptomsActivity: null,
      symptomsInteraction: null,
      symptomsNotes: null,
      cityVisited: null,
      congenitalDisease: [],
      invitations: []
    }
  },

  computed: {
    symptomsOptions() {
      return SYMPTOMS_OPTIONS
    },
    congenitalDiseaseOptions() {
      return CONGENITAL_DESEASE_OPTIONS
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
    getPersonStatusText,
    async fetchRecord() {
      const id = this.recordId
      let data = null
      if (this.detailType === 'invitation') {
        const response = await this.$axios.$get(`/rdt/invitation/${id}`)
        data = response.data.applicant
      } else {
        const response = await this.$axios.$get(`/rdt/applicants/${id}`)
        data = response.data
      }

      this.registrationCode = data.registration_code
      this.nik = data.nik
      this.name = data.name
      this.address = data.address
      this.cityName = data.city ? data.city.name : null
      this.districtName = data.district ? data.district.name : null
      this.villageName = data.village ? data.village.name : null
      this.occupationType = data.occupation_type_name
      this.occupationName = data.occupation_name
      this.workplaceName = data.workplace_name
      this.phoneNumber = data.phone_number
      this.birthDate = data.birth_date
      this.invitations = data.invitations
      this.personStatus = this.getPersonStatusText(data.person_status)
      this.symptomsActivity = data.symptoms_activity
      this.symptomsInteraction = data.symptoms_interaction
      this.symptomsNotes = data.symptoms_notes
      this.cityVisited = data.city_visited
      this.getCongenitalDesease(data.congenital_disease)
      this.getSymptoms(data.symptoms)
    },

    async save() {
      const id = this.recordId

      try {
        await this.$axios.$put(`/rdt/applicants/${id}`, {
          name: this.name
        })

        this.$emit('save')
      } catch (e) {
        //
      }
    },

    close() {
      this.symptoms.length = 0
      this.congenitalDisease.length = 0
      this.$emit('close')
    },

    getSymptoms(payload) {
      if (payload) {
        payload.map((element) => {
          const symptomsFilter = this.symptomsOptions.filter(
            (item) => item.value === element
          )
          symptomsFilter.forEach((item) => {
            this.symptoms.push(item.text)
          })
        })
      }
    },
    getCongenitalDesease(payload) {
      if (payload) {
        payload.map((element) => {
          const congenitalDeseaseFilter = this.congenitalDiseaseOptions.filter(
            (item) => item.value === element
          )
          congenitalDeseaseFilter.forEach((item) => {
            this.congenitalDisease.push(item.text)
          })
        })
      }
    }
  }
}
</script>
