<template>
  <div class='container'>
    <el-card>
     <div slot="header">{{$route.query.id?'试题修改':'试题录入'}}</div>
      <el-form ref="form" :model="TestEntry" :rules="TestEntryRule" label-width="120px">
        <!-- 学科 -->
        <el-form-item label="学科：" prop="subjectID">
          <!-- 点击学科，目录才有内容,学科和目录联动 -->
          <el-select @change="changeSubject" v-model="TestEntry.subjectID" style="width:400px">
            <!-- key为了让每个变成唯一的，为了优化 -->
            <el-option v-for="item in subject" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
         <!-- 目录 -->
        <el-form-item label="目录：" prop="catalogID">
          <!-- v-model为了让其可以写内容 -->
          <el-select v-model="TestEntry.catalogID"  style="width:400px">
            <el-option v-for="item in catalog" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
         <!-- 企业 -->
        <el-form-item label="企业：" prop="enterpriseID">
          <el-select v-model="TestEntry.enterpriseID"  style="width:400px">
            <el-option v-for="item in enterprise" :key="item.id" :label="item.company" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
         <!-- 城市 -->
        <el-form-item label="城市：" prop="city">
          <el-select v-model="TestEntry.province" @change="changeArea" style="width:198px">
            <el-option v-for="item in citys" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="TestEntry.city" style="width:198px;margin-left:4px">
            <el-option v-for="item in areas" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
         <!-- 方向 -->
        <el-form-item label="方向：" prop="direction">
          <el-select v-model="TestEntry.direction" style="width:400px">
            <el-option v-for="item in direction" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
         <!-- 题型 -->
        <el-form-item label="题型：" prop="questionType">
          <el-radio-group @change="changeRadio({})" v-model="TestEntry.questionType">
            <el-radio v-for="item in questionType" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
         <!-- 难度 -->
        <el-form-item label="难度：" prop="difficulty">
          <el-radio-group v-model="TestEntry.difficulty">
            <el-radio v-for="item in difficulty" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
         <!-- 题干 -->
        <el-form-item label="题干：" prop="question">
         <!-- options: 是插件的配置 -->
         <!-- checkQustion没有想起来，看老师代码弄明白之后写上去的 -->
          <quill-editor @blur="checkQustion" v-model="TestEntry.question" :options="editorOptions"></quill-editor>
        </el-form-item>
         <!-- 选项 -->
        <el-form-item label="选项：" v-if="TestEntry.questionType!=='3'">
          <div style="padding-bottom: 20px;" v-for="item in TestEntry.options" :key="item.code">
            <el-radio v-if="TestEntry.questionType==='1'" @change="changeRadio(item)" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-radio>
            <el-checkbox v-if="TestEntry.questionType==='2'" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-checkbox>
            <el-input v-model="item.title" style="width:240px"></el-input>
            <!-- action:请求地址
                 headers：上传请求头
                 on-success:成功之后的回调函数
                 show-file-list：是否显示已上传文件列表
                  -->
            <!-- 成功回调看的老师的代码，但是弄明白了-->
            <el-upload
              style="margin-left:4px; display: inline-block; vertical-align: middle; line-height: 1;"
              action="https://jsonplaceholder.typicode.com/posts/"
              :headers="{'Authorization':'Bearer '+ token}"
              :on-success="(res,file)=>{uploadSuccess(item,res,file)}"
              :show-file-list="false">
              <img v-if="item.img" :src="item.img" style="width: 100px;height: 60px;display: block; overflow: hidden;">
              <span v-else>上传图片</span>
              <i class="el-icon-circle-close"></i>
            </el-upload>
          </div>
          <!-- 添加按钮 -->
          <el-button type="danger" :disabled="TestEntry.questionType!=='2'" @click="addOption" size="small">+增加选项与答案</el-button>
        </el-form-item>
         <!-- 解析视频 -->
        <el-form-item label="解析视频：">
          <el-input v-model="TestEntry.videoURL" style="width:400px"></el-input>
        </el-form-item>
         <!-- 答案解析 -->
        <el-form-item label="答案解析：" prop="question">
           <quill-editor v-model="TestEntry.answer" :options="editorOptions"></quill-editor>
        </el-form-item>
        <!-- 题目备注 -->
        <el-form-item label="题目备注：">
          <el-input type="textarea" :rows="4" v-model="TestEntry.remarks" style="width:400px"></el-input>
        </el-form-item>
         <!-- 试题标签 -->
        <el-form-item label="试题标签：">
          <!-- multiple：属性规定允许用户输入到 <input> 元素的多个值
               filterable：功能可以动态模糊搜索下拉列表中的选项 -->
            <el-select
              style="width:400px"
              v-model="TestEntry.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择试题标签">
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <!-- 提交按钮-->
        <el-form-item>
          <el-button v-if="!$route.query.id" @click="submit()" type="primary">确认提交</el-button>
          <el-button v-else @click="update()" type="success">确认修改</el-button>
        </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
// 接口名一样，simple as getSubjectOptions，给simple重新起一个名字，把simple的功能赋值给getSubjectOptions
// 学科接口
import { simple as getSubject } from '@/api/hmmm/subjects'
// 目录接口
import { simple as getCatalog } from '@/api/hmmm/directorys'
// 企业接口
import { list as getEnterprise } from '@/api/hmmm/companys'
// 城市接口
// provinces直接返回的就是城市名，没有用到axios
import { provinces, citys } from '@/api/hmmm/citys'
// 方向,题型，难度接口
import { direction, questionType, difficulty } from '@/api/hmmm/constants'
// 试题标签
import { simple as getTag } from '@/api/hmmm/tags'
// 添加，获取，修改
import { add, detail, update } from '@/api/hmmm/questions'

// 富文本配置项
// 富文本看的上个项目
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// 这个直接复制老师的代码
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
// token值
import { getToken } from '@/utils/auth'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // token值
      token: getToken(),
      // 富文本配置这个直接复制老师的代码
      // 富文本配置
      // 1. 使用 highlight.js 插件处理高亮
      // 2. 安装  npm i highlight.js
      // 3. 导入  代码语法风格的样式   转换文本插件
      // 4. 配置 富文本  实时输入的时候高亮效果
      editorOptions: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['code-block', 'image', 'link']
          ],
          // 语法高亮
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      TestEntry: {
        // 学科id
        subjectID: null,
        // 目录id
        catalogID: null,
        // 企业id
        enterpriseID: null,
        // 城市
        province: null,
        city: null,
        // 方向
        direction: null,
        // 题型
        questionType: '1',
        // 难度
        difficulty: '1',
        // 题干
        question: null,
        // 选项
        options: [
          { isRight: false, code: 'A', title: '', img: '' },
          { isRight: false, code: 'B', title: '', img: '' },
          { isRight: false, code: 'C', title: '', img: '' },
          { isRight: false, code: 'D', title: '', img: '' }
        ]
      },
      // 校验规则
      TestEntryRule: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        questionType: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' }
        ],
        question: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ]
      },
      // 学科
      subject: [],
      // 目录
      catalog: [],
      // 企业
      enterprise: [],
      // 城市
      // 这个接口没有应用axios，直接方法里面返回来的就是对应的数据，直接请求这个方法就行
      citys: provinces(),
      // 城市对应的区
      areas: [],
      // 方向
      // 这个接口里面直接就是对象的数据
      // es6简写
      direction,
      // 题型
      questionType,
      // 难度
      difficulty,
      // 标签选项
      tags: []
    }
  },
  watch: {
    '$route.query': function () {
      if (this.$route.query.id) {
        this.getModify()
      } else {
        this.qsForm = {
          subjectID: null,
          catalogID: null,
          enterpriseID: null,
          province: null,
          city: null,
          direction: null,
          questionType: '1',
          difficulty: '1',
          question: null,
          options: [
            { isRight: false, code: 'A', title: '', img: '' },
            { isRight: false, code: 'B', title: '', img: '' },
            { isRight: false, code: 'C', title: '', img: '' },
            { isRight: false, code: 'D', title: '', img: '' }
          ]
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    }
  },
  methods: {
    // 学科和目录联动，学科change改变获取对应的id，来使目录改变
    async changeSubject (subjectID) {
      this.TestEntry.catalogID = null
      // 把获取的学科id传给目录接口
      const res = await getCatalog({ subjectID: this.TestEntry.subjectID })
      this.catalog = res.data
      this.TestEntry.tags = null
      const res2 = await getTag({ subjectID: this.TestEntry.subjectID })
      this.tags = res2.data
    },
    // 获取学科列表
    async getSubject () {
      const res = await getSubject()
      this.subject = res.data
    },
    // 企业列表
    async getEnterprise () {
      // pagesize不写最多显示10条，写了可以显示多点但是最多是50条
      const res = await getEnterprise({ pagesize: 50 })
      this.enterprise = res.data.items
    },
    // 城区联动
    changeArea (province) {
      this.TestEntry.city = null
      this.areas = citys(province)
    },
    // 选择了题型
    // 选择单选框
    changeRadio (item) {
      // 1. 清除所有的选中
      this.TestEntry.options.forEach(item => {
        item.isRight = false
      })
      // 2. 自己选中
      item.isRight = true
    },
    addOption () {
      this.TestEntry.options.push({
        isRight: false,
        code: String.fromCharCode(65 + this.TestEntry.options.length),
        title: '',
        img: ''
      })
    },
    // 校验题干
    checkQustion () {
      // 调用el-form组件的 validateField 校验  question  字段
      this.$refs.form.validateField('question')
    },
    // 上传成功之后触发的回调函数
    // uploadSuccess带括号    接收直接的参数
    // uploadSuccess不带括号  接收默认值
    uploadSuccess (item, res, file) {
      // item：当前的选项对象
      // res:后台返回的响应结果
      // file:组件内上传文件
      // URL.createObjectURL(file.raw)  本地预览地址
      item.img = URL.createObjectURL(file.raw)
    },
    // 确定提交
    submit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const data = { ...this.TestEntry }
          data.tags = data.tags.join(',')
          await add(data)
          this.$message.success('添加成功')
          this.$router.push('/questions/list')
        }
      })
    },
    // 确定修改
    update () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const data = { ...this.TestEntry }
          data.tags = data.tags.join(',')
          await update(data)
          this.$message.success('修改成功')
          this.$router.push('/questions/list')
        }
      })
    },
    // 通过id传过来的数据
    async getModify () {
      const { data } = await detail({ id: this.$route.query.id })
      data.tags = data.tags.split(',')
      data.options = data.options.map(item => {
        item.isRight = item.isRight === 1
        return item
      })
      this.TestEntry = data
      const res = await getCatalog({ subjectID: this.TestEntry.subjectID })
      this.catalog = res.data
      const res2 = await getTag({ subjectID: this.TestEntry.subjectID })
      this.tags = res2.data
      // 滚动顶部
      this.$nextTick(() => {
        window.scrollTo(0, 0)
      })
    }
  },
  created () {
    // 获取学科列表
    this.getSubject()
    // 获取企业列表
    this.getEnterprise()
    // 如果后台传过来的有id，那就是修改，执行getQuestion方法
    if (this.$route.query.id) {
      this.getModify()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
