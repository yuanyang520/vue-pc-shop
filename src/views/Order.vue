<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable>
                <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
            </el-input>
        </el-col>
    </el-row>
        <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status !== '0'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
            <template >
            </template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialogVisible(scope.row.user_id)"></el-button>
                <el-button size="mini" type="success" icon="el-icon-location" @click="showDialogVisible(scope.row.user_id)"></el-button>
            </template>
        </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>
   <el-dialog
      title="提示"
      :visible.sync="editdialogVisible"
      width="30%"
      :before-close="edithandleClose">
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%">
   <el-timeline :reverse="true">
    <el-timeline-item
      v-for="(item, index) in rogressInfo"
      :key="index"
      :timestamp="item.time">
      {{item.content}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import cityData from '../assets/js/citydata.js'
export default {
  data () {
    return {
      orderList: [],
      rogressInfo: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editdialogVisible: false,
      dialogVisible: false,
      userId: '',
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData: cityData
    }
  },

  created () {
    this.getOrderList()
  },

  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    showEditDialogVisible (id) {
      this.userId = id
      this.editdialogVisible = true
    },
    edithandleClose () {
      this.$refs.addressFormRef.resetFields()
    },
    async showDialogVisible (id) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('http://localhost:8080/api/express')
      this.rogressInfo = res.data
    }
  }
}
</script>

<style scoped lang='less'>
.el-row{
    margin-bottom: 20px;
}
.el-pagination {
    margin-top: 20px;
}
</style>
