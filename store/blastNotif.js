/* eslint-disable camelcase */

export const state = () => ({
  loading: false
})

export const mutations = {
  SET_LOADING(state, payload) {
    const s = state
    s.loading = payload
  }
}

export const getters = {
  getLoading(state) {
    const s = state
    return s.loading
  }
}

export const actions = {
  async sendUndangan({ commit }, { idEvent, target, invitations_ids }) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$post(`rdt/events/${idEvent}/participants-notify`, {
        target,
        invitations_ids
      })
    } catch (e) {
      // console.log(e)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async sendHasilTest({ commit }, { idEvent, target, invitations_ids }) {
    commit('SET_LOADING', true)
    try {
      await this.$axios.$post(
        `rdt/events/${idEvent}/participants-notify-result`,
        {
          target,
          invitations_ids
        }
      )
    } catch (e) {
      return Promise.reject(e)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
