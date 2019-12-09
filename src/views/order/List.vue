<template>
  <div>列表</div>
</template>
<script>
import { search } from '@/services/order'
export default {
  name: 'orderList',
  data() {
    return {
      input: {
        vin: '',
        policyNumber: '',
        state: -1,
        begin: '',
        end: '',
        page: 1,
        size: 15
      },
      list: [],
      total: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      search(this.input).then(json => {
        console.log(json)
      })
    }
  }
}
</script>
