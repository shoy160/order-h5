import ajax from '@/utils/fetch'

export const orderMonths = (months = 6) => {
  return ajax.get('/statistics/order/months', {
    params: {
      months: months
    }
  })
}

export const orderCounts = (type = 0) => {
  return ajax.get('/statistics/order/statistic', {
    params: {
      type: type
    }
  })
}
