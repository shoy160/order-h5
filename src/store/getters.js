const getters = {
  isLoading: state => state.app.isLoading,
  token: state => state.user.token,
  userId: state => state.user.id,
  userAvatar: state => state.user.avatar,
  userNick: state => state.user.nick
}
export default getters
