<template>
  <v-layout>
    <events-datatable
      title="Kegiatan"
      router-name="events"
      :allow="permissions"
      @optionChanged="onOptionChange"
    />
  </v-layout>
</template>

<script>
import { pickBy, identity } from 'lodash'
import { mapGetters } from 'vuex'
import EventsDatatable from '@/components/EventsDatatable'

export default {
  middleware: 'auth',
  components: {
    EventsDatatable
  },

  computed: {
    ...mapGetters('auth', ['permissions'])
  },

  watch: {
    '$route.query': {
      handler(value, oldValue) {
        this.$store.dispatch(
          'events/getRecords',
          value.keyWords !== oldValue.keyWords || value.page !== oldValue.page
        )
      },
      deep: true
    }
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: true,
        text: 'Kegiatan'
      }
    ])
  },

  methods: {
    onOptionChange(value) {
      let query = { ...this.$route.query }
      if (value.page) query.page = value.page
      query.perPage = value.itemsPerPage || null
      query.sortBy = value.sortBy.length > 0 ? value.sortBy[0] : null
      query.sortOrder = value.sortDesc[0] ? 'desc' : 'asc'
      query.status = value.status
      query.keyWords = value.keyWords
      query.city = value.city
      query.startDate = value.startDate
      query.endDate = value.endDate
      query = pickBy(query, identity)
      this.$router
        .replace({
          query
        })
        .catch(() => {})
    }
  },

  head() {
    return {
      title: 'Kegiatan'
    }
  }
}
</script>
