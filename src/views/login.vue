<template>
  <div class="loginbox">
       <div class="box">
           <div class='txbox'>
               <img src="../assets/logo.png" alt="">
           </div>
           <el-form class="login_form" :model="ruleForm" :rules="ruleFormrules" ref="LoginFormRef">
                <el-form-item prop="username" >
                    <el-input type="text"   v-model="ruleForm.username"></el-input>
                </el-form-item>
                 <el-form-item prop="password">
                    <el-input placeholder="请输入密码" show-password  v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary"  @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
           </el-form>
       </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      ruleFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },

  created () {

  },

  methods: {
    resetLoginForm () {
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      this.$refs.LoginFormRef.validate(async valid => {
        if (valid === false) return false
        const { data: res } = await this.$http.post('login', this.ruleForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败:' + res.meta.msg)
        }
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.loginbox{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: black;
}
.box{
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.txbox{
    height: 130px;
    width: 130px;
    border: 2px solid #eee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    background-color: #fff;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px #ddd;
    img{
        width: 80%;
        height: 80%;
        border-radius: 50%;
        margin-left: 65px;
        transform: translate(-50%,12%);
        position: absolute;
        background-color: #eee;
    }
}
.login_form {
  position: absolute;
  width: 100%;
  top: 80px;
  padding: 0 30px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
