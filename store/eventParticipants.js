/* eslint-disable camelcase */

import { mapKeys, camelCase, snakeCase, debounce } from 'lodash'
import { DEFAULT_FILTER, DEFAULT_PAGINATION } from '@/utilities/constant'

const defaultFilter = { ...DEFAULT_FILTER }
delete defaultFilter.status
defaultFilter.sortBy = ['updated_at']

export const state = () => ({
  loading: false,
  loadingImport: false,
  data: [],
  dataParticipants: [],
  current: null,
  pagination: { ...DEFAULT_PAGINATION },
  filter: { ...defaultFilter }
})

export const mutations = {
  SET_LOADING(state, payload) {
    const s = state
    s.loading = payload
  },
  SET_DATA(state, payload) {
    const s = state
    s.data = payload
  },
  SET_CURRENT(state, payload) {
    const s = state
    s.current = payload
  },
  SET_PAGINATION(state, payload) {
    const s = state
    s.pagination = payload
  },
  RESET_PAGINATION(state) {
    const s = state
    s.pagination.page = 1
    s.pagination.itemsPerPage = 10
  },
  SET_FILTER(state, payload) {
    const s = state
    s.filter = payload
  },
  RESET_FILTER(state) {
    const s = state
    s.filter = defaultFilter
  },
  SET_TABLE_OPTIONS(state, payload) {
    const s = state
    s.filter = {
      groupBy: payload.groupBy,
      groupDesc: payload.groupDesc,
      multiSort: payload.multiSort,
      mustSort: payload.mustSort,
      sortBy: payload.sortBy,
      sortDesc: payload.sortDesc,
      keyWords: payload.keyWords
    }
    s.pagination = {
      itemsPerPage: payload.itemsPerPage - 0,
      page: payload.page,
      total: payload.total
    }
  },
  SET_LOADING_IMPORT(state, payload) {
    const s = state
    s.loadingImport = payload
  }
}

export const getters = {
  getLoading(state) {
    const s = state
    return s.loading
  },
  getList(state) {
    const s = state
    return s.data
  },
  getCurrent(state) {
    const s = state
    return s.current
  },
  getPagination(state) {
    const s = state
    return s.pagination
  },
  getFilter(state) {
    const s = state
    return s.filter
  },
  getTableOption(state) {
    const s = state
    return { ...s.filter, ...s.pagination }
  },
  getTotalData(state) {
    const s = state
    return s.pagination.total
  },
  getLoadingImport() {
    const s = state
    return s.loadingImport
  }
}

export const actions = {
  resetOptions({ commit }) {
    commit('RESET_PAGINATION')
    commit('RESET_FILTER')
  },

  resetPagination({ commit }) {
    commit('RESET_PAGINATION')
  },

  resetFilter({ commit }) {
    commit('RESET_FILTER')
  },

  async getRecords({ commit, dispatch, state }, { debounced, eventId }) {
    if (debounced) {
      if (!state.loading) commit('SET_LOADING', true)
      await dispatch('getListDebounced', eventId)
    } else {
      await dispatch('getList', eventId)
    }
  },

  getListDebounced: debounce(
    ({ dispatch }, eventId) => dispatch('getList', eventId),
    500
  ),

  async getList({ commit, state }, eventId) {
    commit('SET_LOADING', true)

    try {
      const { pagination, filter } = state
      const { page, itemsPerPage } = pagination
      const { keyWords, sortBy, sortDesc } = filter
      const query = mapKeys(
        {
          page,
          perPage: itemsPerPage,
          search: keyWords,
          sortBy: sortBy[0] || null,
          sortOrder: sortDesc[0] ? 'desc' : 'asc'
        },
        (value, key) => snakeCase(key)
      )
      const { data, meta } = await this.$axios.$get(
        `/rdt/events/${eventId}/participants`,
        {
          params: query,
          progress: false
        }
      )
      const tablePagination = mapKeys(
        {
          itemsPerPage: parseInt(meta.per_page),
          page: meta.current_page,
          total: meta.total
        },
        (value, key) => camelCase(key)
      )
      commit('SET_DATA', data)
      commit('SET_PAGINATION', tablePagination)
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async importPeserta({ commit }, { idEvent, formData }) {
    commit('SET_LOADING_IMPORT', true)
    try {
      await this.$axios.$post(
        `/rdt/events/${idEvent}/participants-import`,
        formData
      )
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING_IMPORT', false)
    }
  },

  async importTestResult({ commit }, { idEvent, formData }) {
    commit('SET_LOADING_IMPORT', true)
    try {
      await this.$axios.$post(
        `/rdt/events/${idEvent}/participants-import-results`,
        formData
      )
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING_IMPORT', false)
    }
  },

  async setLabcode(
    { commit },
    { idEvent, rdt_invitation_id, lab_code_sample }
  ) {
    commit('SET_LOADING_IMPORT', true)
    try {
      await this.$axios.$put(
        `/rdt/events/${idEvent}/participants-set-labcode`,
        {
          rdt_invitation_id,
          lab_code_sample
        }
      )
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING_IMPORT', false)
    }
  },

  async deleteParticipant({ commit }, data) {
    commit('SET_LOADING', true)
    const id = data.eventId
    try {
      await this.$axios.$post(`rdt/events/${id}/participants-remove`, {
        applicants: [{ rdt_applicant_id: data.participantId }]
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateTestResult({ commit }, data) {
    commit('SET_LOADING', true)
    const id = data.id
    try {
      await this.$axios.$put(`rdt/invitation/${id}`, {
        lab_result_type: data.payload
      })
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async resetDataCheckin({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$put(`rdt/invitation/${id}/reset`)
    } catch (e) {
      throw new Error(e.response.data.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async integrateDataToLabkes({ commit }, idEvent) {
    commit('SET_LOADING', true)
    try {
      const response = await this.$axios.$post(`/synctolabkes/${idEvent}`)
      return response
    } catch (e) {
      throw e.response
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
