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
                  :props="props"
                  @change="cascaderChange">
                </el-cascader>
            </el-col>
                <el-col></el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
  <!-- 添加动态参数的面板 将标签页改为many -->
  <el-tab-pane label="动态参数" name="many">
    <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="showmanyCateDialogVisible">添加参数</el-button>
    <!-- 动态参数表格 -->
    <el-table :data="manyTableData" border stripe>
      <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 循环生成的el-tag -->
            <el-tag closable v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
            <!-- 输入框 -->
            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <!-- 添加按钮 -->
            <el-button v-else class="button-new-tag" @click="showInput(scope.row)" >+ New Tag</el-button>
         </template>
        </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click='showeditdialogVisible(scope.row)'>编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click='deleteArrt(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
  <!-- 添加静态属性的面板 将标签页改为only -->
  <el-tab-pane label="静态属性" name="only">
    <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click='showmanyCateDialogVisible'>添加属性</el-button>
    <!-- 静态属性表格 -->
    <el-table :data="onlyTableData" border stripe>
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
            <!-- 循环生成的el-tag -->
            <el-tag closable v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
            <!-- 输入框 -->
            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <!-- 添加按钮 -->
            <el-button v-else class="button-new-tag" @click="showInput(scope.row)" >+ New Tag</el-button>
         </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click='showeditdialogVisible(scope.row)'>编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click='deleteArrt(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>

        </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog
  title="添加动态参数的面板"
  :visible.sync="manydialogVisible"
  width="30%"
  @close="manyhandleClose">
  <span>
   <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="manydialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改动态参数的面板"
  :visible.sync="editdialogVisible"
  width="30%"
  @close="edithandleClose">
  <span>
   <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
    <el-form-item label="参数名" prop="attr_name">
      <el-input v-model="editForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
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
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      manydialogVisible: false,
      editdialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      titleText: '',
      attrId: '',
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    async cascaderChange () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
      }
      const { data: res } = await this.$http.get(`categories/${this.getCateId()}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else if (this.activeName === 'only') {
        this.onlyTableData = res.data
      }
    },
    handleTabClick () {
      this.cascaderChange()
    },
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[this.selectedCateKeys.length - 1]
      }
      return null
    },
    async getEditfrom () {
      const { data: res } = await this.$http.get(`categories/${this.getCateId()}/attributes/${this.attrId}`)
      this.editForm.attr_name = res.data.attr_name
      console.log(res.data)
    },
    showmanyCateDialogVisible () {
      this.manydialogVisible = true
      if (this.activeName === 'many') {
        this.titleText = '添加参数'
      } else if (this.activeName === 'only') {
        this.titleText = '添加属性'
      }
    },
    showeditdialogVisible (row) {
      this.attrId = row.attr_id
      this.getEditfrom()
      this.editdialogVisible = true
    },
    manyhandleClose () {
      this.addForm.attr_name = ''
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.getCateId()}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.manydialogVisible = false
        this.cascaderChange()
      })
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.getCateId()}/attributes/${this.attrId}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editdialogVisible = false
        this.cascaderChange()
      })
    },
    edithandleClose () {
      this.editForm.attr_name = ''
    },
    deleteArrt (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.getCateId()}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.cascaderChange()
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
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveVals(row)
    },
    async saveVals (row) {
      const saveobj = { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') }
      const { data: res } = await this.$http.put(`categories/${this.getCateId()}/attributes/${row.attr_id}`, saveobj)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    },
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      row.inputVisible = false
      this.saveVals(row)
    }
  },
  computed: {
    isButtonDisabled () {
      return this.selectedCateKeys.length !== 3
    }
  }
}
</script>

<style scoped lang='less'>
.el-alert{
    margin-bottom: 20px;
}
.el-tabs{
  margin-top: 20px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
