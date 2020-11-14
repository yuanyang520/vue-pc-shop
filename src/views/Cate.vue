<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
      <el-button type="primary" @click="showaddCateDialogVisible">添加分类</el-button>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" class="tree-table"
        :expand-type="false" show-index index-text="#" border :show-row-hover="false">
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:red"></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showedit(scope.row.cat_id)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletCate(scope.row.cat_id)">删除</el-button>
      </template>
      </tree-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRuleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
           expandTrigger='hover' v-model="selectedKeys" :options="parentCateList" :props="Cateoptions" @change="parentCateChange">
          </el-cascader>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
        title="修改用户"
        :visible.sync="isDialogVisible"
        width="30%"
        :close-on-click-modal='false'
        :destroy-on-close='true'
        center>
        <el-form :model="editForm" :rules="addCateFormRules" ref="editruleForm" class="demo-ruleForm" label-width="70px">
              <el-form-item label="用户名"  prop="cat_name">
                  <el-input v-model="editForm.cat_name"></el-input>
              </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogVisible = false">取 消</el-button>
            <el-button type="warning" >重置</el-button>
            <el-button type="primary" @click="editCatName">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addCateDialogVisible: false,
      parentCateList: [],
      selectedKeys: [],
      addCateForm: {
        cat_name: '',
        cat_pid: '',
        cat_level: 0
      },
      editForm: {
        cat_name: ''
      },
      editId: '',
      Cateoptions: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      isDialogVisible: false
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      console.log(this.addCateForm)
    },
    addCate () {
      this.$refs.addCateFormRuleForm.validate(async valid => {
        if (valid === false) return false
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    addCateDialogClosed () {
      this.selectedKeys = []
      this.addCateForm.cat_name = ''
    },
    showaddCateDialogVisible () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    async showedit (id) {
      this.editId = id
      this.isDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm.cat_name = res.data.cat_name
    },
    editCatName () {
      this.$refs.editruleForm.validate(async valid => {
        const { data: res } = await this.$http.put('categories/' + this.editId, this.editForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('更新成功')
        console.log(res)
        this.isDialogVisible = false
        this.getCateList()
      })
    },
    deletCate (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCateList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.tree-table{
  margin:20px 0;
}
.el-cascader-menu{
  height:500px;
}
</style>
