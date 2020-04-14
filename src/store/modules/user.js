import { setTicket, getTicket, removeTicket } from '@/utils/auth'
import { getInfo } from '@/services/account'
const user = {
  state: {
    id: '',
    account: '',
    avatar: '',
    nick: '',
    mobile: '',
    token: ''
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_NICK: (state, nick) => {
      state.nick = nick
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    updateToken({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_TOKEN', data)
        setTicket(data)
        resolve()
      })
    },
    clearUser({ commit }) {
      removeTicket()
      commit('SET_TOKEN', '')
      commit('SET_ID', '')
      commit('SET_ACCOUNT', '')
      commit('SET_NICK', '')
      commit('SET_MOBILE', '')
      commit('SET_AVATAR', '')
    },
    updateUser({ commit }) {
      return getInfo().then(data => {
        commit('SET_TOKEN', getTicket())
        commit('SET_ID', data.id)
        commit('SET_ACCOUNT', data.account)
        commit('SET_NICK', data.nick || data.name || data.mobile)
        commit('SET_MOBILE', data.mobile)
        commit('SET_AVATAR', data.headPic)
      })
    }
  }
}
export default user
