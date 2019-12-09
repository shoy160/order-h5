const app = {
  state: {
    isLoading: false,
    showFooter: true,
    showHeader: true,
    showBack: false
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.isLoading = payload.isLoading
    }
  }
}
export default app
