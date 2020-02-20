<template>
  <div class="outdiv">
    <el-container class="container">
      <Category
        class="categorystyle"
      />
      <stockGoodsList v-show="ifGoodsShowFlag" class="wrapper" @changeFlag="changeFlag"/>
<!--      <Detail v-show="!ifGoodsShowFlag" :id="id" class="wrapper" @changeFlag="changeFlag"/>-->
    </el-container>
  </div>
</template>

<script>
// import {
//   getWarehouseList,
//   getSupplierList,
//   addStocks,
//   getWarehouseActionList,
//   queryGoodsList,
//   addOutAction
// } from '@/api/goods-stock-list/goods-stock-list.js'

import Category from './components/category'
import stockGoodsList from './components/stockGoodsList'
import Detail from './components/detail'

import store from '@/store'
export default {
  components: {
    Category,
    stockGoodsList,
    Detail
  },
  data() {
    return {
      title: '物品仓储列表',
      access_token: store.getters.access_token,
      ifGoodsShowFlag: 'true',
      changeFlag: 'true'
    }
  },
  created() {
    // this.getList()
    // this.useGetSupplierList()
    // this.useAddStocks()
    // this.useGetWarehouseActionList()
    // this.useQueryGoodsList()
    // this.useAddOutAction()
  },
  methods: {
    getList() {
      const access_token = this.access_token
      getWarehouseList({ access_token }).then(
        res => {
          console.log(res.data)
        }
      )
    },
    useGetSupplierList() {
      const access_token = this.access_token
      getSupplierList({ access_token }).then(
        res => {
          console.log(res.data)
        }
      )
    },
    useAddStocks() {
      const access_token = this.access_token
      const obj = {
        access_token,
        warehouses_id: '1',
        supplier_id: '1',
        barcode: 'aaa',
        mode: '1',
        storage_num: '10'
      }
      addStocks(obj).then(
        res => {
          console.log(res.data)
        }
      )
    },
    useGetWarehouseActionList() {
      const access_token = this.access_token
      getWarehouseActionList({ access_token }).then(
        res => {
          console.log(res.data)
        }
      )
    },
    useQueryGoodsList() {
      const access_token = this.access_token
      const code = '4JHe'
      queryGoodsList({ access_token, code }).then(
        res => {
          console.log(res.data)
        }
      )
    },
    useAddOutAction(){
      const access_token = this.access_token
      const barcode = '4JHe'
      const out_num = '1'
      const approver_id = "mike"
      let obj = {access_token,barcode,out_num,approver_id}
      addOutAction(obj).then(
        res => {
          console.log(res.data)
        }
      )
    }
  }

}
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
.setInline {
  display: inline-block;
}
.ActiveStatus {
  margin-left: 45px;
}
/* #goodlist {
  border: 2px solid blue;
} */
  .wrapper{
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
    overflow: auto;
  }
</style>
