<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
       <el-row :gutter="20">
          <el-col :span="7">
              <el-input placeholder="请输入内容" clearable @clear="getGoodsList" v-model="goodsinfo.query">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
              </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary"  @click="addGood">添加商品</el-button>
          </el-col>
        </el-row>
    <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
            <template slot-scope="scope">
                {{scope.row.add_time | datefilter}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
            <template  slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editGood(scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click='deleteGoods(scope.row)'></el-button>
            </template>
        </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="goodsinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      goodsinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodId: 0
    }
  },

  created () {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.goodsinfo.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.goodsinfo.pagenum = val
      this.getGoodsList()
    },
    deleteGoods (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('goods/' + row.goods_id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getGoodsList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addGood () {
      this.$router.push('/goods/addgood')
    },
    editGood (row) {
      this.$router.push({ path: '/goods/editgood', query: { goodsId: row.goods_id } })
    }
  }
}
</script>

<style scoped lang='less'>
.el-row{
  margin-bottom: 20px;
}
.el-pagination{
  margin-top: 20px;
}
</style>
