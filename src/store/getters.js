const getters = {
  isLoading: state => state.app.isLoading,
  token: state => state.user.token,
  userId: state => state.user.id,
  userAvatar: state => state.user.avatar,
  userNick: state => state.user.nick,
  insurances: state => state.order.insurances,
  finances: state => state.order.finances,
  carTypes: state => state.order.carTypes,
  motoTypes: state => state.order.motoTypes,
  shops: state => state.order.shops
}
export default getters
