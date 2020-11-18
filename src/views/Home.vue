<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <!-- 黑马logo -->
          <!-- 顶部标题 -->
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout"> 退出 </el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'250px'">
           <!-- 伸缩侧边栏按钮 -->
          <div class="toggle-button" @click="open()"><i class="el-icon-menu"></i></div>
          <!-- 侧边栏菜单 -->
          <el-menu
            router
           :collapse="isCollapse"
           :collapse-transition="false"
            unique-opened
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            default-active:activePath
            >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id.toString()" v-for="(item, index) in list" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[index]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item :index="'/'+chitem.path" v-for="chitem in item.children" :key="chitem.id" @click="saveNavState('/'+chitem.path)">
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{chitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体结构 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      list: null,
      isCollapse: true,
      iconsObj: ['el-icon-s-custom', 'el-icon-s-check', 'el-icon-shopping-bag-1', 'el-icon-s-claim', 'el-icon-s-data'],
      activePath: '',
      goodId: 0
    }
  },

  created () {
    this.getlist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    async getlist () {
      const { data: res } = await this.$http.get('menus')
      this.list = res.data
    },
    open () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (path) {
      // 点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },

  completed: {
  }
}
</script>

<style scoped lang='less'>
.home-container {
  height: 100%;
}
.el-header{
  position: relative;
  background-color:#373D41;
  button{
      position: absolute;
      bottom:10px;
      right: 10px;
  }
  span{
      position: absolute;
      font-size: 16px;
      color: white;
      left: 50px;
      top: 20px;
  }
}
.el-aside{
  background-color:#333744;
}
.el-main{
  background-color:#eaedf1;
}
.toggle-button{
  text-align: center;
  cursor: pointer;
  i{
    font-size: 20px;
    color:#fff
  }
}
.el-menu{
  border-right: 0;
}
</style>
