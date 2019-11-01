import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: 'NaN',
    userData: {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      avatar: '',
      lang: '',
    }
  },
  getters: {
    status: state => {
      return (state.status)
    }
  },
  mutations: {
    userData: (state, payload) => {
      state.userData = payload
    },
    changeStatus: (state, payload) => {
      state.status = payload
    },
  },
  actions: {
    userData: (context, payload) => {
      context.commit('userData', payload)
    },
    changeStatus: (context, payload) => {
      context.commit('changeStatus', payload)
    },
  }
})
