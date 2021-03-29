<template>
  <div style="width: 100%;">
    <h3 class="mb-1">{{ event_name }}</h3>
    <v-card class="rounded-b-0">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="8">
            <v-row>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Penyelenggara</label>
                <p class="font-weight-medium mt-2 mb-0">{{ host_name }}</p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">
                  Jumlah Peserta / Jumlah Hadir / Hasil Test
                </label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ invitations_count }} / {{ attendees_count }} /
                  {{ attendees_result_count }}
                </p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Status</label>
                <p class="font-weight-medium mt-2 mb-0">
                  <v-chip
                    label
                    small
                    class="ma-0"
                    :color="status | getChipColor"
                  >
                    {{ status }}
                  </v-chip>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Tanggal Mulai</label>
                <p class="font-weight-medium mt-2 mb-0">{{ start_at }}</p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Lokasi</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ event_location }}
                </p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Kode Kegiatan</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ event_code }}
                </p>
                <p class="font-weight-medium mt-2 mb-0">
                  <a :href="event_reg_url" target="_blank">
                    (Link Pendaftaran)
                  </a>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">
                  Tanggal Selesai
                </label>
                <p class="font-weight-medium mt-2 mb-0">{{ end_at }}</p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">Kab./Kota</label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ city ? city.name : '' }}
                </p>
              </v-col>
              <v-col cols="4">
                <label class="text-subtitle-2 grey--text">
                  Jenis Pendaftaran
                </label>
                <p class="font-weight-medium mt-2 mb-0">
                  {{ capitalizeFirstLetter(data.registration_type) }}
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <label class="text-subtitle-2 grey--text">Kloter</label>
            <ol class="mt-2 mb-0 pl-4">
              <li v-for="(sch, i) in kloter" :key="i" class="mb-1">
                <strong>ID {{ sch.id }}</strong
                >: {{ sch.start_at }} -
                {{ sch.end_at }}
              </li>
            </ol>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions v-if="canEdit">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          class="white--text"
          :to="`/events/${$route.params.eventId}/edit`"
        >
          Ubah
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { getChipColor } from '@/utilities/formater'

export default {
  filters: {
    getChipColor
  },

  props: {
    data: {
      type: Object,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      event_code: null,
      event_name: null,
      start_at: null,
      end_at: null,
      host_name: null,
      event_location: null,
      city: null,
      invitations_count: null,
      attendees_count: null,
      attendees_result_count: null,
      event_reg_url: null,
      status: 'DRAFT',
      kloter: []
    }
  },

  watch: {
    data(val) {
      this.event_code = val ? val.event_code : null
      this.event_name = val ? val.event_name : null
      this.status = val ? val.status : null
      this.host_name = val ? val.host_name : null
      this.event_location = val ? val.event_location : null
      this.event_reg_url = val ? val.event_reg_url : null
      this.city = val ? val.city : null
      this.start_at = val
        ? this.$dateFns.format(new Date(val.start_at), 'dd-MM-yyyy HH:mm')
        : null
      this.end_at = val
        ? this.$dateFns.format(new Date(val.end_at), 'dd-MM-yyyy HH:mm')
        : null
      this.invitations_count = val ? val.invitations_count : null
      this.attendees_count = val ? val.attendees_count : null
      this.attendees_result_count = val ? val.attendees_result_count : null
      this.kloter = val.schedules.map((sch) => ({
        ...sch,
        start_at: this.$dateFns.format(new Date(sch.start_at), 'HH:mm'),
        end_at: this.$dateFns.format(new Date(sch.end_at), 'HH:mm')
      }))
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>
