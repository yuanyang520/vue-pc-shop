<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
       <el-button type="primary" @click='isDialogVisible = true'>添加角色</el-button>
    <el-table :data="roleList" style="width: 100%" border >
     <el-table-column type="expand">
       <template slot-scope="props">
             <el-row class="borderb" v-for="(item) in props.row.children" :key="item.id">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
                <el-tag disable-transitions>
                    {{item.authName}}
                </el-tag>
                <span class="el-icon-caret-right"></span>
            </el-col>
            <el-col :span="19">
                <el-row  :class="[index===0?'':'bordert']"  v-for="(item2,index) in item.children" :key="item2.id">
                    <el-col :span="6">
                        <el-tag type="success">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"  closable  @close="handleClose(props.row,item3.id)" :disable-transitions="false">
                            {{item3.authName}}
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
             </el-row>
       </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
           <!-- 修改 -->
           <el-button type="primary" icon="el-icon-edit" size='mini'  @click='editThisRole(props.row)'>编辑</el-button>
           <!-- 删除 -->
           <el-button type="danger" icon="el-icon-delete" size='mini' @click="showDelRightDialog(props.row)" >删除</el-button>
           <!-- 分配角色 -->
           <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
               <el-button type="warning" icon="el-icon-setting" size='mini' @click="showSetRightDialog(props.row)">分配权限</el-button>
           </el-tooltip>
        </template>
      </el-table-column>
  </el-table>
   </el-card>
   <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <el-tree
        :data='rightsList'
        :props="props"
        node-key="id"
        :default-checked-keys="defKeys"
        show-checkbox
        default-expand-all
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogClose">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
<el-dialog
  title="添加角色"
  :visible.sync="isDialogVisible"
  width="40%"
  :close-on-click-modal='false'
  :destroy-on-close='true'
  center>
 <el-form :model="addRoleForm" :rules="rules" ref="addruleForm" class="demo-ruleForm" label-width="80px">
        <el-form-item label="角色名"  prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isDialogVisible = false">取 消</el-button>
    <el-button type="warning" @click="resetForm">重置</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="添加角色"
  :visible.sync="DialogVisible"
  width="40%"
  :close-on-click-modal='false'
  :destroy-on-close='true'
  center>
 <el-form :model="editRoleForm" :rules="rules" ref="editruleForm" class="demo-ruleForm" label-width="80px">
        <el-form-item label="角色名"  prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="DialogVisible = false">取 消</el-button>
    <el-button type="warning" @click="editresetForm">重置</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      isDialogVisible: false,
      DialogVisible: false,
      rightsList: [],
      props: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: null,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述名称', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getList()
  },

  methods: {
    async getList () {
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
    },
    handleClose (role, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
        role.children = res.data
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
    async showSetRightDialog (role) {
      this.roleId = role.id
      this.setRightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    resetForm () {
      this.$refs.addruleForm.resetFields()
    },
    editresetForm () {
      this.$refs.editruleForm.resetFields()
    },
    addRole () {
      this.$refs.addruleForm.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.isDialogVisible = false
        this.addRoleForm.roleName = ''
        this.addRoleForm.roleDesc = ''
        this.getList()
      })
    },
    async editThisRole (rows) {
      this.roleId = rows.id
      const { data: res } = await this.$http.get('roles/' + rows.id)
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      this.DialogVisible = true
    },
    editRole () {
      this.$refs.editruleForm.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('roles/' + this.roleId, this.editRoleForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('编辑成功')
        this.DialogVisible = false
        this.getList()
      })
    },
    showDelRightDialog (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + row.id)
        if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
        this.getList()
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
    setRightDialogClose () {
      this.setRightDialogVisible = false
      this.defKeys = []
    },
    async allotRights () {
      const key = this.$refs.treeRef.getCheckedKeys()
      const helfkey = this.$refs.treeRef.getHalfCheckedKeys()
      const newkey = key.concat(helfkey)
      const str = newkey.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: str })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.setRightDialogVisible = false
      this.getList()
    }
  }
}
</script>

<style scoped lang='less'>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table{
    margin-top: 20px;
  }
  .el-tag{
    margin:10px 0px 10px 10px;
  }
  .el-row{
    display:flex;
    align-items: center;
  }
  .vcenter{
    display:flex;
    align-items:center
  }
  .borderb{
       border-bottom:1px solid #EBEEF5
  }
  .bordert{
    border-top:1px solid #EBEEF5
  }
</style>
