<template>
  <div style="width: 100%;">
    <v-row>
      <v-col cols="12" class="d-flex align-center pb-0">
        <h3>Daftar Peserta</h3>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="`/events/${$route.params.eventId}/add`">
          <v-icon class="mr-1">mdi-plus-circle</v-icon>
          Tambah Peserta
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="openModalNotif('Undangan')">
          <v-icon class="mr-1">mdi-email-send</v-icon>
          Kirim Undangan
        </v-btn>
        <v-btn color="success" @click="openModalNotif('Hasil Test')">
          <v-icon class="mr-1">mdi-file-send-outline</v-icon>
          Kirim Hasil Test
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="pr-1" v-bind="attrs" color="success" v-on="on">
              Export
              <v-icon class="ml-1">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in [
                { icon: 'table', text: 'CSV' },
                { icon: 'pdf-box', text: 'PDF' },
                { icon: 'printer', text: 'PRINT' }
              ]"
              :key="i"
              @click="() => {}"
            >
              <v-list-item-title>
                <v-icon class="mr-1">mdi-{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-card>
      <v-data-table
        v-model="pesertaSelected"
        :headers="headers"
        :items="records"
        :loading="loading"
        show-select
        item-key="rdt_applicant_id"
      >
        <template v-slot:item.applicant.status="{ value }">
          <v-chip small class="ma-2" :color="vUndanganalue | getChipColor">
            {{ value }}
          </v-chip>
        </template>
        <template v-slot:item.applicant.gender="{ item }">
          <v-layout justify-start>
            <template v-if="item.applicant.gender === '1'">
              Laki-Laki
            </template>
            <template v-if="item.applicant.gender === '0'">
              Perempuan
            </template>
          </v-layout>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="$router.push(`events/${item.id}/edit`)">
            mdi-card-search
          </v-icon>
          <v-icon class="mr-2">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="blastNotifModal" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Kirim {{ modalType }}</span>
          <v-btn icon @click="blastNotifModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            Apakah anda akan mengirimkan notifikasi {{ modalType }} kepada
          </div>
          <strong>Peserta Terpilih</strong> atau <strong>Semua Peserta</strong>.
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="blastNotify"
          >
            Semua
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2 px-2"
            @click="
              blastNotify(
                pesertaSelected,
                `send${modalType.split(' ').join('')}`
              )
            "
          >
            Terpilih
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getChipColor } from '@/utilities/formater'
import {
  EVENT_BLAST_EMPTY,
  EVENT_BLAST_SUCCESS,
  EVENT_PARTICIPANTS_EMPTY
} from '@/utilities/constant'

const headers = [
  {
    text: 'Kode',
    value: 'applicant.registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Nama Lengkap', value: 'applicant.name', width: 180 },
  { text: 'Kloter', value: 'rdt_event_schedule_id', width: 100 },
  { text: 'Jenis Kelamin', value: 'applicant.gender', width: 200 },
  { text: 'Usia', value: 'applicant.age', width: 100 },
  { text: 'Status', value: 'applicant.status', sortable: false, width: 150 },
  { text: 'Actions', value: 'actions', sortable: false, width: 100 }
]

export default {
  filters: {
    getChipColor
  },

  props: {
    idEvent: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      headers,
      pesertaSelected: [],
      blastNotifModal: false,
      modalType: 'Undangan'
    }
  },

  computed: {
    records() {
      return this.$store.getters['eventParticipants/getList']
    },
    loading() {
      return this.$store.getters['eventParticipants/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('eventParticipants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['eventParticipants/getTableOption']
      }
    }
  },

  methods: {
    openModalNotif(type) {
      this.modalType = type || this.modalType
      this.blastNotifModal = true
    },
    async blastNotify(invitationsIds, type) {
      if (this.records.length === 0) {
        this.$toast.show({
          message: EVENT_PARTICIPANTS_EMPTY,
          type: 'error'
        })
      } else if (!!invitationsIds && invitationsIds.length === 0) {
        this.$toast.show({
          message: EVENT_BLAST_EMPTY,
          type: 'error'
        })
      } else {
        try {
          const typeBlast = type || 'sendUndangan'
          const target =
            !!invitationsIds && invitationsIds.length > 0 ? 'SELECTED' : 'ALL'
          // eslint-disable-next-line camelcase
          const invitations_ids =
            !!invitationsIds && invitationsIds.length > 0
              ? invitationsIds.map((inv) => inv.id)
              : null
          await this.$store.dispatch(`blastNotif/${typeBlast}`, {
            idEvent: this.idEvent,
            target,
            invitations_ids
          })
          this.$toast.show({
            message: EVENT_BLAST_SUCCESS,
            type: 'success'
          })
          this.blastNotifModal = false
        } catch (error) {
          this.$toast.show({
            message: error.message,
            type: 'error'
          })
        }
      }
    }
  }
}
</script>