<template>
  <v-card>
    <v-card-title>
      <p v-if="formType === 'create'" class="text-h6 text--primary">
        Tambah Kegiatan
      </p>
      <p v-else class="text-h6 text--primary">
        Edit Kegiatan
      </p>
    </v-card-title>
    <v-divider></v-divider>
    <validation-observer
      v-slot="{ valid, handleSubmit }"
      tag="div"
      class="v-card__text"
    >
      <form class="row justify-end" @submit.prevent="handleSubmit(doStore)">
        <v-col v-if="formType === 'edit'" cols="12" class="text-right">
          Status:
          <v-btn-toggle v-model="status" mandatory color="primary" class="pl-2">
            <v-btn small value="DRAFT">
              DRAFT
            </v-btn>
            <v-btn small value="PUBLISHED">
              PUBLISHED
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="6">
          <pkbr-input
            v-model="eventName"
            name="Nama Kegiatan"
            label="Nama Kegiatan"
            placeholder="Masukan Nama Kegiatan"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-select
            v-model="cityCode"
            :items="getKabkot"
            label="Kab./Kota"
            name="Kab./Kota"
            placeholder="Pilih Kab./Kota"
            rules="required"
            item-text="name"
            item-value="code"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-select
            v-model="hostType"
            :items="typeOptions"
            label="Jenis Penyelenggara"
            name="Jenis Penyelenggara"
            placeholder="Jenis Penyelenggara"
            rules="required"
            item-text="name"
            item-value="value"
            @change="getFasyankes"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input
            v-model="eventLocation"
            name="Lokasi"
            label="Lokasi"
            placeholder="Masukan Alamat Lokasi"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-combobox
            v-model="hostName"
            :items="getFasyankesListOptions"
            label="Penyelenggara"
            name="Penyelenggara"
            placeholder="Masukan Instansi Penyelenggara"
            rules="required"
            item-text="name"
            item-value="name"
            :return-object="false"
            outlined
            dense
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input-date
            v-model="startDate"
            label="Tanggal"
            name="Tanggal"
            placeholder="Masukan Tanggal Kegiatan"
            rules="required"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-checkbox
            v-model="isDateRange"
            color="success"
            label="Lebih dari 1 Hari"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input-date
            v-if="isDateRange"
            v-model="endDate"
            name="Tanggal"
            placeholder="Masukan Tanggal Kegiatan"
            rules="required"
            :min-date="startDate"
          />
        </v-col>
        <v-col cols="6">
          <pkbr-input-time
            v-for="(waktu, i) in kloter"
            :key="i"
            v-model="kloter[i]"
            :label="`Kloter ${i + 1}`"
            :name="`Kloter ${i + 1}`"
            placeholder="Masukan Jam Kloter"
            rules="required|time_range"
          >
            <template
              v-if="formType === 'create' && !isDateRange"
              v-slot:append-outer
            >
              <v-btn small icon color="success" @click="addKloter">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                :disabled="i < 1"
                small
                icon
                color="error"
                @click="removeKloter(i)"
              >
                <v-icon v-if="i > 0">mdi-minus</v-icon>
              </v-btn>
            </template>
          </pkbr-input-time>
        </v-col>
        <v-col cols="6">
          <v-btn color="success" :disabled="!valid" type="submit">
            Simpan
          </v-btn>
        </v-col>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

export default {
  props: {
    formData: {
      type: Object,
      default: null
    },
    formType: {
      type: String,
      default: 'create'
    }
  },

  data() {
    return {
      hostType: null,
      eventName: null,
      hostName: null,
      eventLocation: null,
      cityCode: null,
      status: 'DRAFT',
      startDate: null,
      endDate: null,
      isDateRange: false,
      kloter: [null],
      typeOptions: [
        { name: 'Rumah Sakit', value: 'rumah_sakit' },
        { name: 'Puskesmas', value: 'puskesmas' },
        { name: 'Dinkes', value: 'dinkes' }
      ]
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    ...mapGetters('events', ['getFasyankesListOptions'])
  },

  watch: {
    hostType(newVal, oldVal) {
      if (oldVal !== null && newVal !== oldVal) this.hostName = null
    },
    formData(val) {
      let kloter = [null]
      if (val) {
        kloter = val.schedules.map((sch) => {
          const scheduleStart = new Date(sch.start_at)
          const scheduleEnd = new Date(sch.end_at)

          const inputScheduleStart = format(scheduleStart, 'HH:mm')
          const inputScheduleEnd = format(scheduleEnd, 'HH:mm')

          return `${inputScheduleStart}-${inputScheduleEnd}`
        })
      }
      this.hostType = val ? val.host_type : null
      this.eventName = val ? val.event_name : null
      this.status = val ? val.status : null
      this.hostName = val ? val.host_name : null
      this.eventLocation = val ? val.event_location : null
      this.cityCode = val && val.city ? val.city.code : null
      this.startDate = val
        ? this.$dateFns.format(
            val.start_at.split(':')[0],
            "yyyy-MM-dd'T'HH:mm:ssxxx"
          )
        : null
      this.endDate = val
        ? this.$dateFns.format(
            val.end_at.split(':')[0],
            "yyyy-MM-dd'T'HH:mm:ssxxx"
          )
        : null
      this.kloter = kloter
    }
  },

  created() {
    this.getFasyankes()
    if (this.formType === 'edit') this.isDateRange = true
  },
  methods: {
    async getFasyankes() {
      await this.$store.dispatch('events/getFasyankes', this.hostType)
    },
    addKloter() {
      this.kloter.push(null)
    },

    removeKloter(index) {
      this.kloter.splice(index, 1)
    },

    doStore() {
      const schedules = this.kloter.map((waktu, i) => {
        let [start_atSch, end_atSch] = waktu.split('-')
        const { setHours, setMinutes } = this.$dateFns

        start_atSch = setHours(
          setMinutes(new Date(this.startDate), start_atSch.split(':')[1]),
          start_atSch.split(':')[0]
        )

        end_atSch = setHours(
          setMinutes(
            new Date(this.isDateRange ? this.endDate : this.startDate),
            end_atSch.split(':')[1]
          ),
          end_atSch.split(':')[0]
        )

        const id = (this.formData && this.formData.schedules[i].id) || null
        return id
          ? {
              id,
              start_at: start_atSch,
              end_at: end_atSch
            }
          : {
              start_at: start_atSch,
              end_at: end_atSch
            }
      })
      const start_at = schedules[0].start_at
      const end_at = schedules[schedules.length - 1].end_at
      const data = {
        event_name: this.eventName,
        host_name: this.hostName,
        event_location: this.eventLocation,
        city_code: this.cityCode,
        status: this.status,
        host_type: this.hostType,
        start_at,
        end_at,
        schedules
      }
      this.$emit('onStore', data)
    }
  }
}
</script>
