<template>
  <div style="width: 100%;">
    <v-data-table
      v-model="tempValue"
      class="v-card v-sheet pkbr-table"
      :class="{ 'sticky-last': stickyActions }"
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      :options.sync="options"
      :loading="loading"
      :show-select="showSelect"
      fixed-header
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
      :footer-props="{
        'items-per-page-options': [50, 100, 500]
      }"
    >
      <template slot="top">
        <div v-if="!noHead" class="d-flex flex-wrap">
          <v-col v-if="title" cols="12">
            {{ title }}
          </v-col>
          <v-col lg="2" md="2" sm="12">
            <v-text-field
              v-model="listQuery.nameNik"
              label="NIK/Nama Peserta/Nomor Pendaftaran"
              placeholder="NIK/Nama Peserta/Nomor Pendaftaran"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col lg="2" md="2" sm="12">
            <v-text-field
              v-model="listQuery.sessionId"
              label="SessionId"
              placeholder="SessionId"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col lg="2" md="2" sm="12">
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
          <v-col lg="2" md="2" sm="12">
            <ValidationObserver ref="startDate">
              <pkbr-input-date
                v-model="listQuery.startDate"
                label="Tanggal Mulai"
                name="Tanggal Mulai"
                placeholder="Tanggal Mulai"
                :rules="validateStartDate"
              />
            </ValidationObserver>
          </v-col>
          <v-col lg="2" md="2" sm="12">
            <ValidationObserver ref="endDate">
              <pkbr-input-date
                v-model="listQuery.endDate"
                label="Tanggal Berakhir"
                name="Tanggal Berakhir"
                placeholder="Tanggal Berakhir"
                :rules="validate"
              />
            </ValidationObserver>
          </v-col>
          <v-col lg="2" md="2" sm="12">
            <pkbr-select
              v-model="listQuery.personStatus"
              :items="statusOptions"
              label="Status Kesehatan"
              name="Status Kesehatan"
              item-text="text"
              item-value="value"
              placeholder="Status Kesehatan"
              hide-details
              allow-null
            />
          </v-col>
          <v-col lg="3" md="3" sm="12" class="mt-n8">
            <v-btn color="primary" @click="searchFilter">
              Cari
            </v-btn>
            <v-btn color="primary" @click="doFilterReset">
              Reset
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col v-if="false" cols="auto">
            <v-btn
              v-if="allow.includes('create-applicants')"
              color="primary"
              @click="createDialog = true"
            >
              <v-icon class="mr-1">
                mdi-plus-circle
              </v-icon>
              Tambah Peserta
            </v-btn>
          </v-col>
        </div>
      </template>
      <template v-slot:[`item.gender`]="{ item }">
        <v-layout justify-start>
          <template v-if="item.gender === 'F'">
            Perempuan
          </template>
          <template v-if="item.gender === 'M'">
            Laki-Laki
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.symptoms_interaction`]="{ item }">
        <v-layout justify-center>
          <template v-if="item.symptoms_interaction === '0'">
            Ya
          </template>
          <template v-if="item.symptoms_interaction === '1'">
            Ya
          </template>
          <template v-if="item.symptoms_interaction === '2'">
            Tidak Tahu
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.age`]="{ item }">
        <v-layout justify-center>
          {{ item.age }}
        </v-layout>
      </template>
      <template v-slot:[`item.updated_at`]="{ item }">
        <v-layout justify-start>
          {{ $dateFns.format(new Date(item.updated_at), 'dd MMMM yyyy HH:mm') }}
        </v-layout>
      </template>
      <template v-slot:[`item.person_status`]="{ item }">
        <v-layout justify-center>
          <template v-for="data in statusOptions">
            <template v-if="item.person_status === data.value">
              {{ data.text }}
            </template>
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          v-if="allow.includes('view-applicants')"
          class="mr-2"
          @click="viewItem(item)"
        >
          mdi-card-search
        </v-icon>
        <v-icon
          v-if="allow.includes('edit-applicants')"
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="allow.includes('delete-applicants')"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <applicant-create-dialog
      :open="createDialog"
      @close="createClose"
      @save="createSave"
    />

    <applicant-view-dialog
      v-if="allow.includes('view-applicants')"
      :open="viewDialog"
      :record-id="viewRecordId"
      @close="viewClose"
    />

    <applicant-edit-dialog
      v-if="allow.includes('edit-applicants')"
      :open="editDialog"
      :record-id="editRecordId"
      @close="editClose"
      @save="editSave"
    />

    <applicant-delete-dialog
      :open="deleteDialog"
      :record="selectedData"
      @close="deleteClose"
      @remove="remove"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { mapGetters } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import { getPersonStatusText } from '@/utilities/personStatus'
import ApplicantCreateDialog from '@/components/ApplicantCreateDialog'
import ApplicantEditDialog from '@/components/ApplicantEditDialog'
import ApplicantViewDialog from '@/components/ApplicantViewDialog'
import ApplicantDeleteDialog from '@/components/ApplicantDeleteDialog'
import {
  SUCCESS_DELETE,
  FAILED_DELETE,
  CONFIRM_DELETE_PARTICIPANTS,
  STATUS_OPTIONS
} from '@/utilities/constant'

const headers = [
  { text: 'NIK', value: 'nik', width: 200 },
  { text: 'Nama Peserta', value: 'name', width: 200 },
  { text: 'Jenis Kelamin', value: 'gender', width: 130 },
  {
    text: 'Usia (Thn)',
    value: 'age',
    width: 120,
    align: 'center'
  },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 175 },
  {
    text: 'Instansi Pekerjaan',
    value: 'workplace_name',
    sortable: false,
    width: 175
  },
  {
    text: 'Status Kesehatan',
    value: 'person_status',
    width: 150,
    align: 'center'
  },
  { text: 'Tanggal Terdaftar', value: 'registration_at', width: 200 },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]

export default {
  components: {
    ApplicantCreateDialog,
    ApplicantViewDialog,
    ApplicantEditDialog,
    ApplicantDeleteDialog,
    ValidationObserver
  },

  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: null
    },
    noHead: {
      type: Boolean,
      default: false
    },
    noActions: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    allow: {
      type: Array,
      default: () => []
    },
    stickyActions: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: 'participant'
    },
    eventId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      tempValue: this.value,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      editRecordId: null,
      viewDialog: false,
      viewRecordId: null,
      selectedData: null,
      validate: '',
      validateStartDate: '',
      listQuery: {
        nameNik: null,
        city: null,
        startDate: null,
        endDate: null,
        personStatus: null,
        sessionId: null
      },
      isFiltered: false,
      statusOptions: STATUS_OPTIONS,
      headers: this.noActions
        ? headers.filter((head) => head.value !== 'actions')
        : headers
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    records() {
      return this.$store.getters['applicants/getList']
    },
    loading() {
      return this.$store.getters['applicants/getLoading']
    },
    options: {
      set(value) {
        value.eventId = this.eventId
        this.$store.commit('applicants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['applicants/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['applicants/getTotalData']
    },
    confirmDeleteMsg() {
      return CONFIRM_DELETE_PARTICIPANTS
    }
  },

  watch: {
    options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        this.$emit('optionChanged', value)
      }
    },
    value(value) {
      this.tempValue = value
    },
    tempValue(value) {
      this.$emit('input', value)
    },
    'listQuery.startDate'(value) {
      this.validate = value ? 'required' : ''
    },
    'listQuery.endDate'(value) {
      this.validateStartDate = value ? 'required' : ''
    }
  },

  async mounted() {
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
      options.sortOrder = [this.$route.query.sortOrder]
    }
    this.options = options
    this.$emit('optionChanged', options)
    await this.$store.dispatch('applicants/resetOptions')
    this.options = {
      ...this.options,
      keyWords: null,
      city: null,
      startDate: null,
      endDate: null,
      personStatus: null,
      sessionId: null
    }
  },

  methods: {
    getPersonStatusText,
    async searchFilter() {
      const validStartDate = await this.$refs.startDate.validate()
      const validEndDate = await this.$refs.endDate.validate()
      if (validStartDate && validEndDate) {
        await this.$store.dispatch('applicants/resetOptions')
        this.options = {
          ...this.options,
          keyWords: this.listQuery.nameNik,
          city: this.listQuery.city,
          startDate: this.listQuery.startDate,
          endDate: this.listQuery.endDate,
          personStatus: this.listQuery.personStatus,
          sessionId: this.listQuery.sessionId
        }
        this.isFiltered = true
      }
    },
    async doFilterReset() {
      Object.assign(this.$data.listQuery, this.$options.data().listQuery)
      if (this.isFiltered) {
        await this.$store.dispatch('applicants/resetOptions')
        this.options = {
          ...this.options,
          keyWords: null,
          city: null,
          startDate: null,
          endDate: null,
          personStatus: null,
          sessionId: null
        }
        this.isFiltered = false
      }
    },

    createClose() {
      this.createDialog = false
    },

    async createSave() {
      this.createClose()
      await this.$store.dispatch('applicants/getList') // @TODO lost current state?
    },

    viewItem(item) {
      this.viewRecordId = item.id
      this.viewDialog = true
    },

    viewClose() {
      this.viewDialog = false
      this.viewRecordId = null
    },

    editItem(item) {
      this.editRecordId = item.id
      this.editDialog = true
    },

    deleteItem(item) {
      this.deleteDialog = true
      this.selectedData = item
    },

    deleteClose(payload) {
      this.deleteDialog = false
    },

    async remove(payload) {
      try {
        this.deleteDialog = false
        await this.$store.dispatch('applicants/delete', payload.id)
        this.$toast.show({
          message: SUCCESS_DELETE,
          type: 'success'
        })
        if (this.listType === 'applicant') {
          await this.$store.dispatch('applicants/getRecordsNew')
        } else {
          await this.$store.dispatch('applicants/getRecordsApproved')
        }
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_DELETE,
          type: 'error'
        })
      }
    },

    editClose() {
      this.editDialog = false
      this.editRecordId = null
    },

    async editSave() {
      this.editClose()
      if (this.listType === 'applicant') {
        await this.$store.dispatch('applicants/getRecordsNew')
      } else {
        await this.$store.dispatch('applicants/getRecordsApproved')
      }
    },

    getLatestInvitation(invitations) {
      if (invitations.length > 0) {
        const [latestInvitation] = invitations.slice(-1)

        if (latestInvitation.event) {
          return latestInvitation.event.event_name
        }

        return 'Pernah'
      }

      return 'Belum Pernah'
    }
  }
}
</script>
