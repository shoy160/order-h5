import { shopList, unitList, versionTree } from '@/services/account'
import pinyin from 'js-pinyin'

const indexTypes = (types) => {
  var list = []
  for (var i in types) {
    var factory = types[i]
    //获取首字母
    var index = pinyin.getCamelChars(factory.name[0]).toUpperCase()
    for (var f in factory.children) {
      var brand = factory.children[f]
      for (var b in brand.children) {
        var version = brand.children[b]
        var chars = pinyin
          .getCamelChars(`${factory.name}${brand.name}${version.name}`)
          .toUpperCase()
        list.push({
          index: index,
          pinyin: chars,
          id: version.id,
          name: version.name,
          factoryId: factory.id,
          factory: factory.name,
          brandId: brand.id,
          brand: brand.name,
          desc: `${factory.name},${brand.name},${version.name}`,
        })
      }
    }
  }
  list.sort((a, b) => {
    return a.pinyin > b.pinyin ? 1 : -1
  })
  return list
}
const order = {
  state: {
    //保险公司
    insurances: [],
    //金融公司
    finances: [],
    //车型
    carTypes: [],
    motoTypes: [],
    //店铺
    shops: [],
  },
  mutations: {
    SET_INSURANCES(state, insurances) {
      state.insurances = insurances
    },
    SET_FINANCES(state, finances) {
      state.finances = finances
    },
    SET_SHOPS(state, shops) {
      state.shops = shops
    },
    SET_CARTYPES(state, types) {
      state.carTypes = types
    },
    SET_MOTOTYPES(state, types) {
      state.motoTypes = types
    },
  },
  actions: {
    getInsurances({ commit, state }, callback) {
      if (state.insurances.length > 0) {
        callback && callback.call()
        return
      }
      unitList(1).then((json) => {
        commit('SET_INSURANCES', json)
        callback && callback.call()
      })
    },
    getFinances({ commit, state }, callback) {
      if (state.finances.length > 0) {
        callback && callback.call()
        return
      }
      unitList(2).then((json) => {
        commit('SET_FINANCES', json)
        callback && callback.call()
      })
    },
    getTypes({ commit, state }, payload) {
      var type = payload.type || 4
      var callback = payload.callback
      var types = type === 4 ? state.carTypes : state.motoTypes
      if (types.length > 0) {
        callback && callback.call()
        return
      }
      versionTree(type).then((json) => {
        types = indexTypes(json.data)
        commit(type === 4 ? 'SET_CARTYPES' : 'SET_MOTOTYPES', types)
        callback && callback.call()
      })
    },
    getShops({ commit, state }, callback) {
      if (state.shops.length > 0) {
        callback && callback.call()
      } else {
        shopList(1, 5000).then((json) => {
          commit('SET_SHOPS', json)
          callback && callback.call()
        })
      }
    },
  },
}
export default order
