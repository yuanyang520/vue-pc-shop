<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
        <el-alert
            title="注意：只能允许第三级权限分类设置相关参数"
            type="warning"
            show-icon>
        </el-alert>
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类：</span>
                <el-cascader
                  expandTrigger='hover'
                  v-model="selectedCateKeys"
                  :options="cateList"
                  :props="props">
                </el-cascader>
            </el-col>
                <el-col></el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      selectedCateKeys: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      this.cateList = res.data
    }
  }
}
</script>

<style scoped lang='less'>
.el-alert{
    margin-bottom: 20px;
}
</style>
