/* eslint-disable vue/valid-v-bind */
<template>
  <div style="width: 100%;">
    <v-data-table
      class="v-card v-sheet pkbr-table sticky-last"
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      :options.sync="options"
      :loading="loading"
      fixed-header
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
      :footer-props="{
        'items-per-page-options': [50, 100, 500]
      }"
    >
      <template slot="top">
        <div class="d-flex">
          <v-col cols="auto">
            <v-text-field
              v-model="searchKey"
              label="Nama Kegiatan"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <pkbr-select
              v-model="stat"
              :items="[
                { text: 'Semua', value: 'all' },
                { text: 'Draft', value: 'draft' },
                { text: 'Published', value: 'published' }
              ]"
              label="Status"
              name="Status"
              hide-details
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              v-if="allow.includes('create-events')"
              color="primary"
              to="/events/create"
            >
              <v-icon class="mr-1">
                mdi-plus-circle
              </v-icon>
              Tambah Kegiatan
            </v-btn>
          </v-col>
        </div>
      </template>
      <template v-slot:[`item.start_at`]="{ item }">
        {{ formatTanggal(item.start_at, item.end_at) }}
      </template>
      <template v-slot:[`item.end_at`]="{ value }">
        {{ $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') }}
      </template>
      <template v-slot:[`item.status`]="{ value }">
        <v-chip small class="ma-0" :color="value | getChipColor">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          v-if="allow.includes('view-events')"
          class="mr-2"
          @click="$router.push(`events/${item.id}`)"
        >
          mdi-card-search
        </v-icon>
        <v-icon
          v-if="allow.includes('edit-events')"
          class="mr-2"
          @click="$router.push(`events/${item.id}/edit`)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="allow.includes('delete-events')"
          @click="selectToRemove({ id: item.id, name: item.event_name })"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <event-delete-dialog
      :open="deleteModal"
      :record="selectedEvent"
      @close="closeDeleteDialog"
      @remove="remove"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import {
  SUCCESS_DELETE,
  FAILED_DELETE,
  CONFIRM_DELETE
} from '@/utilities/constant'
import { getChipColor } from '@/utilities/formater'
import EventDeleteDialog from '@/components/EventDeleteDialog'

const headers = [
  { text: 'ID', value: 'id', width: 80 },
  { text: 'Nama Kegiatan', value: 'event_name', width: 250 },
  { text: 'Tanggal', value: 'start_at', width: 150 },
  { text: 'Lokasi', value: 'event_location', width: 225 },
  { text: 'Kota/Kab', value: 'city.name', width: 200 },
  { text: 'Peserta', value: 'invitations_count', width: 100, align: 'center' },
  { text: 'Status', value: 'status' },
  { text: 'Kloter', value: 'schedules_count', width: 100, align: 'center' },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]

export default {
  components: {
    EventDeleteDialog
  },
  filters: {
    getChipColor
  },

  props: {
    title: {
      type: String,
      default: 'Kegiatan'
    },

    allow: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      headers,
      selectedEvent: {
        id: null,
        name: null
      },
      deleteModal: false
    }
  },

  computed: {
    confirmDeleteMsg() {
      return CONFIRM_DELETE + this.selectedEvent.id
    },
    records() {
      return this.$store.getters['events/getList']
    },
    loading() {
      return this.$store.getters['events/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('events/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['events/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['events/getTotalData']
    },
    stat: {
      async set(value) {
        await this.$store.dispatch('events/resetOptions')
        this.options = {
          ...this.options,
          keyWords: this.searchKey,
          status: value
        }
      },
      get() {
        return this.$route.query.status
      }
    },
    searchKey: {
      async set(value) {
        await this.$store.dispatch('events/resetOptions')
        this.options = {
          ...this.options,
          status: this.stat,
          keyWords: value
        }
      },
      get() {
        return this.$route.query.keyWords
      }
    }
  },

  watch: {
    options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        this.$emit('optionChanged', value)
      }
    }
  },

  mounted() {
    const options = { ...this.options }
    if (this.$route.query.page) {
      options.page = parseInt(this.$route.query.page)
    }
    if (this.$route.query.perPage) {
      options.perPage = parseInt(this.$route.query.perPage)
    }
    if (this.$route.query.sortBy) {
      options.sortBy = [this.$route.query.sortBy]
    }
    if (this.$route.query.sortOrder) {
      options.sortDesc = [this.$route.query.sortOrder === 'desc']
    }
    if (this.$route.query.keyWords) {
      options.keyWords = this.$route.query.keyWords
    }
    if (this.$route.query.status) {
      options.status = this.$route.query.status
    }
    this.options = options
    this.$emit('optionChanged', options)
  },

  methods: {
    formatTanggal(startTanggal, endTanggal) {
      const start = this.$dateFns.format(new Date(startTanggal), 'dd MMM yyyy')
      const end = this.$dateFns.format(new Date(endTanggal), 'dd MMM yyyy')
      const [startDate, startMonth, startYear] = start.split(' ')
      const [endDate, endMonth, endYear] = end.split(' ')
      if (start === end) {
        return start
      } else if (startMonth === endMonth && startYear === endYear) {
        return `${startDate} - ${endDate} ${startMonth} ${startYear}`
      } else if (startMonth !== endMonth && startYear === endYear) {
        return `${startDate} ${startMonth} - ${endDate} ${endMonth} ${startYear}`
      }
      return `${start} - ${end}`
    },
    selectToRemove(payload) {
      this.selectedEvent = payload
      this.deleteModal = true
    },
    closeDeleteDialog() {
      this.deleteModal = false
    },
    async remove(id) {
      try {
        await this.$store.dispatch('events/delete', id)
        this.$toast.show({
          message: SUCCESS_DELETE,
          type: 'success'
        })
        await this.$store.dispatch('events/getList')
        this.deleteModal = false
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_DELETE,
          type: 'error'
        })
      }
    }
  }
}
</script>
