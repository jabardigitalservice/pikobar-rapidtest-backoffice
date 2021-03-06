/* eslint-disable vue/valid-v-bind */
<template>
  <div style="width: 100%;">
    <v-col sm="12" md="12" lg="12" class="d-flex justify-end mt-n12">
      <v-btn
        v-if="allow.includes('create-events')"
        color="primary"
        to="/events/create"
      >
        <v-icon class="mr-1">
          mdi-plus
        </v-icon>
        Tambah Kegiatan
      </v-btn>
    </v-col>
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
        <div class="d-flex flex-wrap">
          <v-col sm="12" md="12" lg="3">
            <v-text-field
              v-model="listQuery.searchKey"
              label="Nama Kegiatan"
              placeholder="Nama Kegiatan"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col sm="12" md="12" lg="2">
            <pkbr-select
              v-model="listQuery.status"
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
          <v-col sm="12" md="12" lg="3">
            <pkbr-select
              v-model="listQuery.city"
              :items="getKabkot"
              label="Kab./Kota"
              name="Kab./Kota"
              placeholder="Semua Kab./Kota"
              item-text="name"
              item-value="code"
              hide-details
              allow-null
            />
          </v-col>
          <v-col sm="12" md="12" lg="2">
            <ValidationObserver ref="startDate">
              <pkbr-input-date
                v-model="listQuery.startDate"
                label="Tanggal Mulai"
                name="Tanggal Mulai"
                placeholder="Tanggal Mulai"
                :rules="ruleValidationStartDate"
              />
            </ValidationObserver>
          </v-col>
          <v-col sm="12" md="12" lg="2">
            <ValidationObserver ref="endDate">
              <pkbr-input-date
                v-model="listQuery.endDate"
                label="Tanggal Berakhir"
                name="Tanggal Berakhir"
                placeholder="Tanggal Berakhir"
                :rules="ruleValidationEndDate"
              />
            </ValidationObserver>
          </v-col>
          <v-col sm="12" md="12" lg="3" class="mt-n8">
            <v-btn color="primary" @click="searchFilter">
              Cari
            </v-btn>
            <v-btn color="primary" @click="doFilterReset">
              Reset
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
          {{ toCapitalizeCase(value) }}
        </v-chip>
      </template>
      <template v-slot:[`item.city.name`]="{ item }">
        {{ toCapitalizeCase(item.city.name) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="allow.includes('view-events')"
              v-bind="attrs"
              color="primary"
              x-small
              dark
              class="py-4"
              v-on="on"
              @click="$router.push(`events/${item.id}`)"
            >
              <v-icon small>
                mdi-eye-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Detail</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="allow.includes('edit-events')"
              v-bind="attrs"
              color="warning"
              x-small
              dark
              class="py-4"
              v-on="on"
              @click="$router.push(`events/${item.id}/edit`)"
            >
              <v-icon small>
                mdi-pencil-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="allow.includes('delete-events')"
              v-bind="attrs"
              color="error"
              x-small
              dark
              class="py-4"
              v-on="on"
              @click="selectToRemove({ id: item.id, name: item.event_name })"
            >
              <v-icon small>
                mdi-trash-can-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Hapus</span>
        </v-tooltip>
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
import { mapGetters } from 'vuex'
import { isEqual } from 'lodash'
import {
  SUCCESS_DELETE,
  FAILED_DELETE,
  CONFIRM_DELETE,
  DEFAULT_FILTER,
  DEFAULT_PAGINATION
} from '@/utilities/constant'
import { ValidationObserver } from 'vee-validate'
import { getChipColor, toCapitalizeCase } from '@/utilities/formater'
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
  {
    text: 'Actions',
    value: 'actions',
    sortable: false,
    width: 175,
    align: 'center'
  }
]

export default {
  components: {
    EventDeleteDialog,
    ValidationObserver
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
      deleteModal: false,
      ruleValidationStartDate: '',
      ruleValidationEndDate: '',
      selectedEvent: {
        id: null,
        name: null
      },
      listQuery: {
        searchKey: null,
        status: DEFAULT_FILTER.status,
        city: null,
        startDate: null,
        endDate: null
      }
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
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
    }
  },

  watch: {
    options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        this.$emit('optionChanged', value)
      }
    },
    'listQuery.startDate'(value) {
      this.ruleValidationEndDate = value ? 'required' : ''
    },
    'listQuery.endDate'(value) {
      this.ruleValidationStartDate = value ? 'required' : ''
    }
  },

  async mounted() {
    const options = { ...this.options }
    options.page = this.$route.query.page
      ? parseInt(this.$route.query.page)
      : DEFAULT_PAGINATION.page
    options.itemsPerPage = this.$route.query.perPage
      ? parseInt(this.$route.query.perPage)
      : DEFAULT_PAGINATION.itemsPerPage
    options.sortDesc = this.$route.query.sortOrder
      ? [this.$route.query.sortOrder === 'desc']
      : DEFAULT_FILTER.sortDesc
    options.keyWords = this.$route.query.keyWords
      ? this.$route.query.keyWords
      : DEFAULT_FILTER.keyWords
    options.status = this.$route.query.status
      ? this.$route.query.status
      : DEFAULT_FILTER.status
    this.options = options
    this.$emit('optionChanged', options)
    await this.doFilterReset()
  },

  methods: {
    toCapitalizeCase,
    async searchFilter() {
      const validStartDate = await this.$refs.startDate.validate()
      const validEndDate = await this.$refs.endDate.validate()
      if (validStartDate && validEndDate) {
        await this.$store.dispatch('events/resetOptions')
        this.options = {
          ...this.options,
          status: this.listQuery.status,
          keyWords: this.listQuery.searchKey,
          city: this.listQuery.city,
          startDate: this.listQuery.startDate,
          endDate: this.listQuery.endDate
        }
        this.$emit('optionChanged', this.options)
      }
    },
    doFilterReset() {
      Object.assign(this.$data.listQuery, this.$options.data().listQuery)
      this.options = {
        ...this.options,
        keyWords: null,
        city: null,
        startDate: null,
        endDate: null
      }
      this.$emit('optionChanged', this.options)
    },
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
