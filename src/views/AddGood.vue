<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
       <el-alert
        title="添加商品"
        type="info"
        show-icon
        center>
       </el-alert>
      <el-steps :active="active" align-center finish-status="success">
        <el-step  title="基本信息"></el-step>
        <el-step  title="商品参数"></el-step>
        <el-step  title="商品属性"></el-step>
        <el-step  title="商品图片"></el-step>
        <el-step  title="商品内容"></el-step>
        <el-step  title="完成"></el-step>
      </el-steps>
       <el-form :model="ruleForm" :rules="addFormRules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
      <el-tabs tab-position="left"  @tab-click="handleClick"  :before-leave="beforeTabLeave">
      <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="ruleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="ruleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="ruleForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="ruleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expandTrigger='hover'
              v-model="ruleForm.goods_cat"
              :options="cateList"
              :props="cateProps"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
      </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
           <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
             <el-checkbox-group v-model="item.attr_vals"  >
                 <el-checkbox :label="val" v-for="(val,i) in item.attr_vals" :key="i"  border></el-checkbox>
             </el-checkbox-group>
         </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
         </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success='handleSuccess'
          :file-list="ruleForm.pics.pic"
          :headers='Token'
          list-type="picture">
         <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
        <el-button type="primary" class="btnAdd" @click="addGood">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
   </el-form>
   </el-card>
   <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
  <img :src="previewPath" class="previewImg" />
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      previewVisible: false,
      previewPath: '',
      ruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        add_time: 0,
        goods_introduce: '',
        attrs: []
      },
      Token: { Authorization: window.sessionStorage.getItem('token') },
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
    handleChange () {
    },
    async handleClick (tab) {
      this.active = tab.name * 1
      if (this.active === 1) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } }
        )
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.active === 2) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } }
        )
        this.onlyTableData = res.data
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.ruleForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.ruleForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.ruleForm.goods_price.trim() === '0') {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.ruleForm.goods_weight.trim() === '0') {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.ruleForm.goods_number.trim() === '0') {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    handleSuccess (response) {
      console.log(response)
      this.ruleForm.pics.push({ pic: response.data.tmp_path })
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      // 显示预览图片对话框
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.ruleForm.pics.findIndex(item => {
        return item.pic === filePath
      })
      this.ruleForm.pics.splice(index, 1)
    },
    addGood () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.error('请填写不要参数')
        const coneform = this.deepCone(this.ruleForm)
        var timestape = Date.parse(new Date())
        console.log(timestape)
        coneform.add_time = timestape
        console.log(coneform)
        coneform.goods_cat = coneform.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          coneform.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') })
        })
        this.onlyTableData.forEach(item => {
          coneform.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        const { data: res } = await this.$http.post('goods', coneform)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    },
    deepCone (obj) {
      const cone = {}
      for (const key in obj) {
        cone[key] = obj[key]
      }
      return cone
    }
  },
  computed: {
    cateId () {
      if (this.ruleForm.goods_cat.length === 3) {
        return this.ruleForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped lang='less'>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs{
  margin-top: 50px;
}
/deep/.el-step__title{
    font-size: 8px;
}
.previewImg{
  width: 80%;
  height: 80%;
}
/deep/.ql-editor{
    min-height: 300px;
}
//给添加商品按钮添加间距
.btnAdd{
  margin-top:15px;
}
</style>
