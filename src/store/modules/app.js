const app = {
  state: {
    isLoading: false,
    showFooter: true,
    showHeader: true,
    showBack: false,
    keyword: ''
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.isLoading = payload.isLoading
    },
    SET_KEYWORD(state, keyword) {
      state.keyword = keyword
    }
  },
  actions: {
    updateKeyword({ commit }, keyword) {
      commit('SET_KEYWORD', keyword)
    }
  }
}
export default app
