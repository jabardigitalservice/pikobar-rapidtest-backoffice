<template>
  <v-flex>
    <EventView
      :data="getCurrent"
      :can-edit="permissions.includes('edit-events')"
    />
    <ApplicantsDatatable
      :id-event="$route.params.eventId - 0"
      :allow="permissions"
      no-actions
      @optionChanged="onOptionChange"
    />
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import { pickBy, identity } from 'lodash'
import EventView from '@/components/EventView'
import ApplicantsDatatable from '@/components/EventsApplicants'

export default {
  middleware: 'auth',

  components: {
    EventView,
    ApplicantsDatatable
  },
  computed: {
    ...mapGetters('auth', ['permissions']),
    ...mapGetters('events', ['getCurrent', 'getLoading']),
    options: {
      set(value) {
        this.$store.commit('eventParticipants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['eventParticipants/getTableOption']
      }
    }
  },
  watch: {
    '$route.query': {
      handler(value, oldValue) {
        this.$store.dispatch('eventParticipants/getRecords', {
          debounced:
            value.keyWords !== oldValue.keyWords ||
            value.page !== oldValue.page,
          eventId: this.$route.params.eventId
        })
      },
      deep: true
    }
  },
  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: false,
        text: 'Kegiatan',
        to: '/events'
      },
      {
        disabled: true,
        text: 'Detail Kegiatan'
      }
    ])
  },

  mounted() {
    if (this.$route.params.eventId) {
      this.$store.dispatch(
        'eventParticipants/getList',
        this.$route.params.eventId
      )
      this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
    } else {
      this.$router.replace('/events')
    }
  },

  methods: {
    onOptionChange(value) {
      let query = { ...this.$route.query }
      if (value.page) query.page = value.page
      query.perPage = value.itemsPerPage || null
      query.sortBy = value.sortBy.length > 0 ? value.sortBy[0] : null
      query.sortOrder = value.sortDesc[0] ? 'desc' : 'asc'
      query.keyWords = value.keyWords
      query.startDate = value.startDate
      query.endDate = value.endDate
      query = pickBy(query, identity)
      this.$router
        .replace({
          query
        })
        .catch(() => {})
    }
  }
}
</script>
