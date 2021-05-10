/* eslint-disable camelcase */

import { mapKeys, snakeCase, debounce } from 'lodash'
import { DEFAULT_FILTER, DEFAULT_PAGINATION } from '@/utilities/constant'

export const state = () => ({
  loading: false,
  data: [],
  current: null,
  pagination: { ...DEFAULT_PAGINATION },
  filter: { ...DEFAULT_FILTER },
  fasyankesListOptions: []
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
    s.pagination = { ...s.pagination, ...DEFAULT_PAGINATION }
  },
  SET_FILTER(state, payload) {
    const s = state
    s.filter = payload
  },
  RESET_FILTER(state) {
    const s = state
    s.filter = { ...s.filter, ...DEFAULT_FILTER }
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
      status: payload.status,
      keyWords: payload.keyWords,
      city: payload.city
    }
    s.pagination = {
      itemsPerPage: payload.itemsPerPage - 0,
      page: payload.page,
      total: payload.total
    }
  },
  SET_FASYANKES(state, payload) {
    const s = state
    s.fasyankesListOptions = payload
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
  getFasyankesListOptions(state) {
    const s = state
    return s.fasyankesListOptions
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

  async addAplicants({ commit }, { idEvent, applicants }) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$post(`/rdt/events/${idEvent}/participants`, {
        applicants
      })
    } catch (error) {
      throw new Error(error.response.data.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getRecords({ commit, dispatch, state }, debounced) {
    if (debounced) {
      if (!state.loading) commit('SET_LOADING', true)
      await dispatch('getListDebounced')
    } else {
      await dispatch('getList')
    }
  },

  getListDebounced: debounce(({ dispatch }) => dispatch('getList'), 500),

  async getList({ commit, state }) {
    commit('SET_LOADING', true)

    try {
      const { pagination, filter } = state
      const { page, itemsPerPage } = pagination
      const { sortBy, sortDesc, status, keyWords, city } = filter
      const query = mapKeys(
        {
          page,
          perPage: itemsPerPage,
          search: keyWords,
          cityCode: city,
          sortBy: sortBy[0] || null,
          sortOrder: sortDesc[0] ? 'desc' : 'asc',
          status
        },
        (value, key) => snakeCase(key)
      )
      const { data, meta } = await this.$axios.$get('/rdt/events', {
        params: query,
        progress: false
      })
      commit('SET_DATA', data)
      commit('SET_PAGINATION', {
        page: parseInt(meta.current_page),
        itemsPerPage: parseInt(meta.per_page),
        total: parseInt(meta.total)
      })
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getCurrent({ commit, state }, idEvent) {
    commit('SET_LOADING', true)

    try {
      const { data } = await this.$axios.$get(`/rdt/events/${idEvent}`)
      commit('SET_CURRENT', data)
    } catch (e) {
      //
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async create({ commit }, payload) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.$post('/rdt/events', payload)
      return res
    } catch (error) {
      throw new Error(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async edit({ commit, state }, payload) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$put(`/rdt/events/${state.current.id}`, payload)
    } catch (error) {
      throw new Error(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async delete({ commit, state }, id) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$delete(`/rdt/events/${id}`)
    } catch (error) {
      throw new Error(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async getFasyankes({ commit }, payload) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.$get('master/fasyankes', {
        headers: {
          Authorization: null
        },
        params: {
          type: payload
        }
      })
      commit('SET_FASYANKES', data)
    } catch (error) {
      throw new Error(error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
