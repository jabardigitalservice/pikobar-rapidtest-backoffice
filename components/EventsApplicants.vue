<template>
  <div style="width: 100%;">
    <v-row>
      <v-col cols="6" class="d-flex align-center pb-0">
        <h3>Daftar Peserta</h3>
      </v-col>
      <v-col
        v-if="allow.includes('manage-events')"
        cols="6"
        class="d-flex align-center justify-end pb-0"
      >
        <v-btn color="primary" :to="`/events/${$route.params.eventId}/add`">
          <v-icon class="mr-1">mdi-plus-circle</v-icon>
          Tambah Peserta
        </v-btn>
      </v-col>
      <v-col cols="7">
        <v-btn
          v-if="allow.includes('notify-participants')"
          color="primary"
          @click="openModalNotif('Undangan')"
        >
          <v-icon class="mr-1">mdi-email-send</v-icon>
          Kirim Undangan
        </v-btn>
        <v-btn
          v-if="allow.includes('notify-participants')"
          color="success"
          @click="openModalNotif('Hasil Test')"
        >
          <v-icon class="mr-1">mdi-file-send-outline</v-icon>
          Kirim Hasil Test
        </v-btn>
        <v-btn
          v-if="configIntegration === 'true'"
          color="warning"
          @click="openModalIntegratingData"
        >
          <v-icon class="mr-1">mdi-file-send-outline</v-icon>
          Kirim data
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          v-if="allow.includes('manage-events')"
          color="success"
          @click="openModalImportHasil"
        >
          <v-icon class="mr-1">mdi-file-import-outline</v-icon>
          Import Hasil Test
        </v-btn>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="pr-1" v-bind="attrs" color="error" v-on="on">
              Export
              <v-icon class="ml-1">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in [
                { icon: 'table', format: 'xls', text: 'Excel F1' },
                { icon: 'table', format: 'xls', text: 'Excel F2' },
                { icon: 'table', format: 'xls', text: 'Excel Raw' }
              ]"
              :key="i"
              @click="downloadExport(item)"
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
    <v-data-table
      v-model="pesertaSelected"
      class="v-card v-sheet rounded-t-0 pkbr-table sticky-last"
      :headers="headers"
      :server-items-length="totalItems"
      :items="records"
      :loading="loading"
      :options.sync="options"
      fixed-header
      show-select
      item-key="rdt_applicant_id"
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
      :footer-props="{
        'items-per-page-options': [50, 100, 500]
      }"
    >
      <template slot="top">
        <div class="d-flex">
          <v-col cols="6">
            <v-text-field
              v-model="searchKey"
              label="Nama Peserta / No. Pendaftaran / Kode Sampel / Instansi Tempat Kerja"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
        </div>
      </template>
      <template v-slot:[`item.notified_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.notified_result_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.synchronization_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.created_at`]="{ value }">
        {{ $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') }}
      </template>
      <template v-slot:[`item.attended_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.result_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.lab_result_type`]="{ item }">
        <v-layout justify-center>
          <v-card-actions>
            <v-menu
              :close-on-content-click="false"
              :nudge-width="0"
              :nudge-left="0"
              :nudge-top="0"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ma-1"
                  color="#828282"
                  style="text-transform: none; height: 30px; min-width: 50px;"
                  outlined
                  v-on="on"
                >
                  <span v-if="item.lab_result_type">
                    {{ checkResultLabel(item.lab_result_type) }}
                  </span>
                  <span v-else>Pilih hasil test</span>
                  <v-icon style="color: #009d57; font-size: 2rem;" right
                    >mdi-menu-down</v-icon
                  >
                </v-btn>
              </template>
              <v-card>
                <v-list-item
                  v-for="data in testResultOptions"
                  :key="data.value"
                >
                  <v-btn
                    text
                    small
                    color="normal"
                    @click="openUpdateDialog(item, data.value)"
                  >
                    {{ data.label }}
                  </v-btn>
                </v-list-item>
              </v-card>
            </v-menu>
          </v-card-actions>
        </v-layout>
      </template>
      <template v-slot:[`item.lab_code_sample`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="item.lab_code_sample === null"
              small
              outlined
              v-bind="attrs"
              color="#828282"
              v-on="on"
              @click="modalEditLabCodeOpen(item.id)"
            >
              {{ 'Kode sampel' }}
            </v-btn>
            <v-btn
              v-else
              small
              outlined
              v-bind="attrs"
              color="success"
              v-on="on"
              @click="modalEditLabCodeOpen(item.id)"
            >
              {{ item.lab_code_sample }}
            </v-btn>
          </template>
          <span>Edit Kode Sample</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.applicant.status`]="{ value }">
        <v-chip small class="ma-2" :color="value | getChipColor">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:[`item.applicant.name`]="{ item }" class="flex wrap">
        <div v-if="item.status_on_simlab === 'FAILED'" class="ml-n2">
          <v-tooltip bottom color="error">
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                class="ma-2"
                color="deep-orange lighten-4"
                label
                v-bind="attrs"
                style="width: 200px;"
                v-on="on"
              >
                {{ item.applicant.name }}
              </v-chip>
            </template>
            Data gagal dikirim ke Aplikasi SIM Lab
          </v-tooltip>
        </div>
        <div v-else>
          {{ item.applicant.name }}
        </div>
      </template>
      <template v-slot:[`item.applicant.birth_date`]="{ item }">
        <v-layout justify-start>
          {{ item.applicant.age }}
        </v-layout>
      </template>
      <template v-slot:[`item.applicant.gender`]="{ item }">
        <v-layout
          v-if="typeof item.applicant.gender !== 'undefined'"
          justify-start
        >
          <template v-if="item.applicant.gender === 'M'">
            Laki-Laki
          </template>
          <template v-if="item.applicant.gender === 'F'">
            Perempuan
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.status_on_simlab`]="{ item }">
        <v-layout v-if="item.status_on_simlab === null" justify-start>
          Belum Dikirim
        </v-layout>
        <v-layout v-else-if="item.status_on_simlab === 'SENT'" justify-start>
          Sudah Dikirim
        </v-layout>
        <v-layout v-else-if="item.status_on_simlab === 'FAILED'" justify-start>
          Gagal Dikirim
        </v-layout>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.lab_code_sample === null"
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="uncheckWarning(item)"
            >
              mdi-checkbox-blank-outline
            </v-icon>
            <v-icon
              v-else-if="item.lab_code_sample !== null"
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="uncheck(item)"
            >
              mdi-check-box-outline
            </v-icon>
          </template>
          <span>Uncheck</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="viewItem(item)"
            >
              mdi-card-search
            </v-icon>
          </template>
          <span>Detail</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="editApplicantOpen(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit Data Peserta</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="selectToRemove(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Hapus</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <dialog-export-loader :open="modalLoader" />
    <event-applicant-edit-lab-code-dialog
      :open="modalEditLabCode"
      :record-id="modalEditLabCodeId"
      :lab-code-sample="labCodeSample"
      @close="modalEditLabCodeClose"
      @save="modalEditLabCodeSave"
    />
    <dialog-warning-test-result
      :open="blastNotifModalWarning"
      :items="incompleteResultTest"
      @close="closeDialogWarning"
    />
    <applicant-view-dialog
      v-if="allow.includes('view-applicants')"
      :open="viewDialog"
      :record-id="viewRecordId"
      :detail-type="'invitation'"
      @close="viewClose"
    />
    <applicant-delete-dialog
      :open="deleteDialog"
      :record="selectedData"
      dialog-type="event"
      @close="deleteClose"
      @remove="remove"
    />
    <applicant-edit-dialog
      :open="editApplicant"
      :record-id="idApplicant"
      :is-edit-applicant="false"
      @close="editClose"
      @save="editSave"
    />
    <event-update-result-dialog
      :open="updateResultDialog"
      :record="selectedData"
      :payload="updatePayload"
      @close="closeDialogUpdateResult"
      @update="setTestResult"
    />
    <event-blash-notif-dialog
      :open="blastNotifModal"
      :items="pesertaSelected"
      :modal-type="modalType"
      @close="closeDialogBlashNotif"
      @send="sendNotif"
    />
    <event-import-test-result-dialog
      :open="ImportModalTest"
      @close="closeDialogImport"
      @doImport="doImport"
    />
    <event-applicant-uncheck-dialog
      :open="uncheckDialog"
      :record="selectedData"
      @close="closeDialogUncheck"
      @save="resetDataCheckin"
    />
    <event-applicant-uncheck-warning-dialog
      :open="uncheckWarningDialog"
      @close="closeDialogUncheckWarning"
    />
    <dialog-integrating-data
      :open="integratingModal"
      :items="incompleteResultTest"
      :loading="integratingLoading"
      @close="closeDialogIntegratingData"
      @send="integrateData"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { getChipColor } from '@/utilities/formater'
import {
  EVENT_BLAST_EMPTY,
  EVENT_BLAST_SUCCESS,
  EVENT_PARTICIPANTS_EMPTY,
  SUCCESS_IMPORT,
  FAILED_IMPORT,
  SET_LABCODE_SUCCESS,
  SET_LABCODE_FAILED,
  DEFAULT_PAGINATION,
  DEFAULT_FILTER,
  CONFIRM_DELETE_PARTICIPANTS_EVENT,
  SUCCESS_DELETE,
  FAILED_DELETE,
  TEST_RESULT_OPTIONS,
  SUCCESS_UPDATE_TEST_RESULT,
  FAILED_UPDATE_TEST_RESULT,
  UNCHECK_SUCCESS,
  UNCHECK_FAILED
} from '@/utilities/constant'
import EventApplicantEditLabCodeDialog from '@/components/EventApplicantEditLabCodeDialog'
import DialogExportLoader from '@/components/DialogLoader'
import DialogWarningTestResult from '@/components/DialogWarningTestResult'
import DialogIntegratingData from '@/components/DialogIntegratingData'
import ApplicantViewDialog from '@/components/ApplicantViewDialog'
import ApplicantEditDialog from '@/components/ApplicantEditDialog'
import ApplicantDeleteDialog from '@/components/ApplicantDeleteDialog'
import EventUpdateResultDialog from '@/components/EventUpdateResultDialog'
import EventBlashNotifDialog from '@/components/EventBlashNotifDialog'
import EventImportTestResultDialog from '@/components/EventImportTestResultDialog'
import EventApplicantUncheckDialog from '@/components/EventApplicantUncheckDialog'
import EventApplicantUncheckWarningDialog from '@/components/EventApplicantUncheckWarningDialog'

const headers = [
  {
    text: 'Nomor Pendaftaran',
    value: 'applicant.registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Nama Lengkap', value: 'applicant.name', width: 200 },
  {
    text: 'Instansi Tempat Kerja',
    value: 'applicant.workplace_name',
    width: 200
  },
  { text: 'Kode Sampel', value: 'lab_code_sample', width: 150 },
  { text: 'Jenis Kelamin', value: 'applicant.gender', width: 140 },
  { text: 'Usia', value: 'applicant.birth_date', width: 85 },
  { text: 'Lokasi Checkin', value: 'attend_location', width: 200 },
  { text: 'Terdaftar di kegiatan', value: 'created_at', width: 200 },
  { text: 'Checkin', value: 'attended_at', width: 200 },
  { text: 'Hasil Test', value: 'lab_result_type', width: 150, align: 'center' },
  { text: 'Kirim Undangan', value: 'notified_at', width: 200 },
  {
    text: 'Kirim Hasil',
    value: 'notified_result_at',
    width: 200
  },
  {
    text: 'Data Terkirim ke SIM Lab',
    value: 'status_on_simlab',
    width: 200
  },
  {
    text: 'Tanggal Terkirim ke SIM Lab',
    value: 'synchronization_at',
    width: 225
  },
  {
    text: 'Actions',
    value: 'actions',
    align: 'center',
    sortable: false,
    width: 200
  }
]

export default {
  components: {
    EventApplicantEditLabCodeDialog,
    DialogExportLoader,
    ApplicantViewDialog,
    DialogWarningTestResult,
    ApplicantDeleteDialog,
    EventUpdateResultDialog,
    EventBlashNotifDialog,
    EventImportTestResultDialog,
    EventApplicantUncheckDialog,
    EventApplicantUncheckWarningDialog,
    DialogIntegratingData,
    ApplicantEditDialog
  },
  filters: {
    getChipColor
  },

  props: {
    idEvent: {
      type: [Number, String],
      default: null
    },
    allow: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      configIntegration: process.env.featureIntegrationLabkes,
      headers,
      pesertaSelected: [],
      blastNotifModal: false,
      ImportModalTest: false,
      modalType: 'Undangan',
      modalLoader: false,
      modalEditLabCode: false,
      modalEditLabCodeId: null,
      deleteDialog: false,
      selectedData: null,
      viewDialog: false,
      viewRecordId: null,
      labCodeSample: null,
      blastNotifModalWarning: false,
      updateResultDialog: false,
      updatePayload: null,
      uncheckDialog: false,
      uncheckWarningDialog: false,
      integratingModal: false,
      integratingLoading: false,
      incompleteResultTest: [],
      editApplicant: false,
      idApplicant: null
    }
  },

  computed: {
    testResultOptions() {
      return TEST_RESULT_OPTIONS
    },
    confirmDeleteMsg() {
      return CONFIRM_DELETE_PARTICIPANTS_EVENT
    },
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
    },
    totalItems() {
      return this.$store.getters['eventParticipants/getTotalData']
    },
    searchKey: {
      async set(value) {
        await this.$store.dispatch('eventParticipants/resetOptions')
        this.options = {
          ...this.options,
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
    options.page = this.$route.query.page
      ? parseInt(this.$route.query.page)
      : DEFAULT_PAGINATION.page
    options.itemsPerPage = this.$route.query.perPage
      ? parseInt(this.$route.query.perPage)
      : DEFAULT_PAGINATION.itemsPerPage
    options.sortBy = this.$route.query.sortBy
      ? [this.$route.query.sortBy]
      : DEFAULT_FILTER.sortBy
    options.sortDesc = this.$route.query.sortOrder
      ? [this.$route.query.sortOrder === 'desc']
      : DEFAULT_FILTER.sortDesc
    options.keyWords = this.$route.query.keyWords
      ? this.$route.query.keyWords
      : DEFAULT_FILTER.keyWords
    this.options = options
    this.$emit('optionChanged', options)
  },

  methods: {
    async resetDataCheckin(payload) {
      try {
        await this.$store.dispatch(
          'eventParticipants/resetDataCheckin',
          payload.id
        )
        this.$toast.show({
          message: UNCHECK_SUCCESS,
          type: 'success'
        })
        await this.$store.dispatch(
          'events/getCurrent',
          this.$route.params.eventId
        )
        await this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      } catch (error) {
        this.$toast.show({
          message: error.message || UNCHECK_FAILED,
          type: 'error'
        })
      } finally {
        this.uncheckDialog = false
      }
    },
    uncheckWarning() {
      this.uncheckWarningDialog = true
    },
    closeDialogUncheckWarning() {
      this.uncheckWarningDialog = false
    },
    uncheck(payload) {
      this.uncheckDialog = true
      this.selectedData = payload
    },
    closeDialogUncheck() {
      this.uncheckDialog = false
    },
    checkResultLabel(payload) {
      let testResultLabel = null
      const testResultFilter = this.testResultOptions.filter(
        (item) => item.value === payload
      )
      testResultFilter.forEach((element) => {
        testResultLabel = element.label
      })
      return testResultLabel
    },
    openUpdateDialog(item, payload) {
      this.selectedData = item
      this.updatePayload = payload
      this.updateResultDialog = true
    },
    closeDialogUpdateResult() {
      this.updateResultDialog = false
    },
    async setTestResult(data) {
      try {
        await this.$store.dispatch('eventParticipants/updateTestResult', data)
        this.$toast.show({
          message: SUCCESS_UPDATE_TEST_RESULT,
          type: 'success'
        })
        await this.$store.dispatch(
          'events/getCurrent',
          this.$route.params.eventId
        )
        await this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_UPDATE_TEST_RESULT,
          type: 'error'
        })
      } finally {
        this.updateResultDialog = false
      }
    },
    editApplicantOpen(item) {
      this.editApplicant = true
      this.idApplicant = item.applicant.id
    },
    editClose() {
      this.editApplicant = false
    },
    async editSave() {
      this.editApplicant = false
      await this.$store.dispatch(
        'eventParticipants/getList',
        this.$route.params.eventId
      )
    },
    viewItem(payload) {
      this.viewRecordId = payload.id
      this.viewDialog = true
    },
    viewClose() {
      this.viewDialog = false
      this.viewRecordId = null
    },
    selectToRemove(payload) {
      this.selectedData = payload
      this.deleteDialog = true
    },
    deleteClose() {
      this.deleteDialog = false
    },
    async remove(payload) {
      try {
        const data = {
          eventId: this.$route.params.eventId,
          participantId: payload.rdt_applicant_id
        }
        await this.$store.dispatch('eventParticipants/deleteParticipant', data)
        this.$toast.show({
          message: SUCCESS_DELETE,
          type: 'success'
        })
        await this.$store.dispatch(
          'events/getCurrent',
          this.$route.params.eventId
        )
        await this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
        this.deleteDialog = false
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_DELETE,
          type: 'error'
        })
      }
    },
    async integrateData() {
      try {
        this.modalLoader = true
        const response = await this.$store.dispatch(
          'eventParticipants/integrateDataToLabkes',
          this.idEvent
        )
        const message = response.message
        this.$toast.show({
          message,
          type: 'success'
        })
      } catch (error) {
        const messageCustom =
          'Silahkan cek kembali format kode sample dan duplikasi kode sample'
        this.$toast.show({
          message:
            error.status === 422
              ? error.data.message + '. ' + messageCustom
              : error.data.message,
          type: 'error'
        })
      } finally {
        this.modalLoader = false
        this.integratingModal = false
        await this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      }
    },
    closeDialogIntegratingData() {
      this.integratingModal = false
    },
    async openModalIntegratingData() {
      this.integratingModal = true
      this.integratingLoading = true
      const getAllDataParticipant = await this.$axios.$get(
        `/rdt/events/${this.$route.params.eventId}/participants`
      )
      const participantFiltered = getAllDataParticipant.data.filter(
        (item) => item.attended_at !== null && item.synchronization_at === null
      )
      this.incompleteResultTest = participantFiltered
      this.integratingLoading = false
    },
    closeDialogWarning() {
      this.blastNotifModalWarning = false
    },
    closeDialogBlashNotif() {
      this.blastNotifModal = false
    },
    openModalNotif(type) {
      if (type === 'Undangan') {
        this.modalType = type || this.modalType
        this.blastNotifModal = true
      } else {
        const data =
          this.pesertaSelected.length > 0 ? this.pesertaSelected : this.records

        const incompleteData = data.filter(
          (item) => item.lab_result_type === null
        )
        if (incompleteData.length === 0) {
          this.modalType = type || this.modalType
          this.blastNotifModal = true
        } else {
          this.blastNotifModalWarning = true
          this.incompleteResultTest = incompleteData
        }
      }
    },
    openModalImportHasil() {
      this.ImportModalTest = true
    },
    sendNotif(data) {
      if (data.length === 0) {
        this.blastNotify(null, `send${data.type.split(' ').join('')}`)
      } else {
        this.blastNotify(
          this.pesertaSelected,
          `send${data.type.split(' ').join('')}`
        )
      }
    },
    closeDialogImport() {
      this.ImportModalTest = false
    },
    async doImport(data) {
      const formData = new FormData()
      formData.append('file', data)
      try {
        await this.$store.dispatch('eventParticipants/importTestResult', {
          idEvent: this.idEvent,
          formData
        })
        this.$toast.show({
          message: SUCCESS_IMPORT,
          type: 'success'
        })
        this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_IMPORT,
          type: 'error'
        })
      } finally {
        this.ImportModalTest = false
      }
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
        } finally {
          this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
          this.pesertaSelected = []
        }
      }
    },
    modalEditLabCodeOpen(id) {
      this.modalEditLabCodeId = id
      this.modalEditLabCode = true
      this.getSampleCode(id)
    },
    modalEditLabCodeClose() {
      this.modalEditLabCodeId = null
      this.modalEditLabCode = false
    },
    async modalEditLabCodeSave(payload) {
      try {
        await this.$store.dispatch('eventParticipants/setLabcode', {
          idEvent: this.idEvent,
          ...payload
        })
        this.$toast.show({
          message: SET_LABCODE_SUCCESS,
          type: 'success'
        })
        this.modalEditLabCodeClose()
      } catch (error) {
        this.$toast.show({
          message: error.message || SET_LABCODE_FAILED,
          type: 'error'
        })
      } finally {
        this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      }
    },
    async getSampleCode(id) {
      const sample = await this.$axios.$get(`/rdt/invitation/${id}`)
      this.labCodeSample = sample.data.lab_code_sample
    },
    async downloadExport(param) {
      try {
        this.modalLoader = true
        const exportFormatF1 = `/rdt/events/${this.idEvent}/participants-export-f1?format=${param.format}`
        const exportFormatF2 = `/rdt/events/${this.idEvent}/participants-export-f2?format=${param.format}`
        const exportFormatRaw = `/rdt/events/${this.idEvent}/participants-export?format=${param.format}`
        const exportType =
          param.text === 'Excel F1'
            ? exportFormatF1
            : param.text === 'Excel F2'
            ? exportFormatF2
            : exportFormatRaw

        const response = await this.$axios.get(exportType, {
          responseType: 'blob'
        })
        const blob = new Blob([response.data], { type: response.data.type })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url

        const contentDisposition = response.headers['content-disposition']
        let fileName = 'unknown'

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(.+)/)
          if (fileNameMatch.length === 2) {
            const data = fileNameMatch[1].includes('"')
              ? fileNameMatch[1].slice(1, -2)
              : fileNameMatch[1]
            fileName = data
          }
        }

        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.modalLoader = false
      } catch (error) {
        this.$toast.show({
          message:
            error.response.message ||
            'Export gagal, silahkan lengkapi Kode Sample untuk dapat melakukan Export.',
          type: 'error'
        })
        this.modalLoader = false
      }
    }
  }
}
</script>
