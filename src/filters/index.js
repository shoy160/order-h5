export { formatDate } from 'singerjs'

export { time, attr } from '@/utils/filters'

export const formatMoney = money => {
  return (money * 1.0).toFixed(1)
}

export const hiddenMobile = mobile => {
  if (!mobile || mobile.length !== 11) {
    return mobile
  }
  return `${mobile.substring(0, 3)}****${mobile.substring(7)}`
}

export const defAvatar = avatar => {
  return avatar || '/static/img/avatar.png'
}
