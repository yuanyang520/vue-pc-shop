<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
       <el-row :gutter="20">
          <el-col :span="7">
              <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="centerDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="usersList" style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button type="primary" icon="el-icon-edit" size='mini' @click="geteditusers(scope.row.id)"></el-button>
                    <!-- 删除 -->
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="Delete(scope.row.id)"></el-button>
                    <!-- 分配角色 -->
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
   </el-card>
   <el-dialog
  title="添加用户"
  :visible.sync="centerDialogVisible"
  width="30%"
  :close-on-click-modal='false'
  :destroy-on-close='true'
  center>
  <m-ss></m-ss>
 <el-form :model="ruleForm" :rules="rules" ref="addruleForm" class="demo-ruleForm" label-width="70px">
        <el-form-item label="用户名"  prop="username">
            <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="warning" @click="resetForm">重置</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改用户"
  :visible.sync="isDialogVisible"
  width="30%"
  :close-on-click-modal='false'
  :destroy-on-close='true'
  center>
  <m-ss></m-ss>
 <el-form :model="editForm" :rules="rules" ref="editruleForm" class="demo-ruleForm" label-width="70px">
        <el-form-item label="用户名"  prop="username">
            <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isDialogVisible = false">取 消</el-button>
    <el-button type="warning" @click="reseteditForm">重置</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import aa from './a.vue'
export default {
  data () {
    var checkMobile = (rule, value, next) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return next()
      }
      next(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      },
      total: 0,
      centerDialogVisible: false,
      isDialogVisible: false,
      usersList: []
    }
  },

  components: {
    'm-ss': aa
  },

  created () {
    this.getUserInfo()
  },

  methods: {
    async getUserInfo () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.usersList = res.data.users
      this.total = res.data.total
    },
    async geteditusers (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.isDialogVisible = true
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserInfo()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserInfo()
    },
    async changeState (row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      console.log(res)
    },
    async addUser () {
      this.$refs.addruleForm.validate(async valid => {
        if (valid === false) return false
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('获取数据成功')
        this.centerDialogVisible = false
        this.resetForm()
        this.getUserInfo()
      })
    },
    async editUser () {
      this.$refs.editruleForm.validate(async valid => {
        if (valid === false) return false
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('获取数据成功')
        this.isDialogVisible = false
        this.getUserInfo()
      })
    },
    Delete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id)
        this.getUserInfo()
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
    resetForm () {
      this.$refs.addruleForm.resetFields()
    },
    reseteditForm () {
      this.$refs.editruleForm.resetFields()
    }
  }
}
</script>

<style scoped lang='less'>
.el-breadcrumb{
    margin-bottom:20px;
}
.el-row{
    margin-bottom:20px;
}
.block{
    margin-top: 50px;
}
.el-dialog .el-input{
    width: 90%;
    margin-bottom: 20px;
}
</style>
