<template>
<!-- 题组管理页面 -->
  <div style="padding: 0 10px;margin:10px 0;">
    <el-card>
      <!-- 第一行 -->
      <div style="display:flex;justify-content:space-between;margin-bottom:15px">
          <span style="color:pink;font-size:12px">说明：目前支持学科和关键字条件筛选</span>
          <el-button type="success" icon="el-icon-edit" size="small" @click="addtestFn">新增试题</el-button>
      </div>

<!-- 表单上添加变量进行数据绑定-->
<!-- 表单上不要 :inline="true"这个就可以了 -->
      <el-form  ref="form" :model="form" label-width="80px" size="small">
          <el-row>
              <el-col :span="6">
                  <el-form-item label="学科">
                     <el-select placeholder="请选择" size="small" v-model="form.subjectID" style="width:100%">
                     <el-option v-for="obj in subjectArr" :key="obj.value" :label="obj.label" :value="obj.value"></el-option>
                     </el-select>
                 </el-form-item>
              </el-col>

         <el-col :span="6">
             <el-form-item label="二级目录">
             <el-select placeholder="请选择" size="small" v-model="form.catalogID" style="width:100%">
             <el-option label="无数据" value=""></el-option>
             </el-select>
        </el-form-item>
         </el-col>

         <el-col :span="6">
             <el-form-item label="标签">
             <el-select placeholder="请选择" size="small" v-model="form.tags" style="width:100%">
             <el-option label="无数据" value=""></el-option>
             </el-select>
        </el-form-item>
         </el-col>

        <el-col :span="6">
            <el-form-item label="关键字">
        <el-input placeholder="根据题干搜索" size="small" v-model="form.keyword"></el-input>
       </el-form-item>
        </el-col>

       <el-col :span="6">
           <el-form-item label="试题类型">
             <el-select placeholder="请选择" size="small" v-model="form.questionType" style="width:100%">
             <el-option v-for="item in questionTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
        </el-form-item>
       </el-col>

        <el-col :span="6">
            <el-form-item label="难度">
             <el-select placeholder="请选择" size="small" v-model="form.difficulty" style="width:100%">
             <el-option v-for="item in difficultyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
        </el-form-item>
        </el-col>

        <el-col :span="6">
            <el-form-item label="方向">
             <el-select placeholder="请选择" size="small" v-model="form.direction" style="width:100%">
             <el-option v-for="item in directionArr" :key="item" :label="item" :value="item"></el-option>
             </el-select>
        </el-form-item>
        </el-col>

        <el-col :span="6">
            <el-form-item label="录入人" >
             <el-select placeholder="请选择" v-model="form.creatorID" style="width:100%">
             <el-option v-for="obj in userListArr" :label="obj.username" :value="obj.id" :key="obj.id"></el-option>
             </el-select>
        </el-form-item>
        </el-col>

        <el-col :span="6">
            <el-form-item label="题目备注">
        <el-input v-model="form.remarks"></el-input>
       </el-form-item>
        </el-col>

       <el-col :span="6">
           <el-form-item label="企业简称">
        <el-input size="small" v-model="form.shortName"></el-input>
       </el-form-item>
       </el-col>

      <el-col :span="6">
          <!-- 选择城市改变的时候触发事件 -->
       <el-form-item label="城市">
        <el-select placeholder="请选择" v-model="form.province" @change="cityFn" style="width:48%;margin-right:2%">
             <el-option v-for="item in cityArr" :key="item" :label="item" :value="item"></el-option>
             </el-select>
             <!-- 地区 -->
             <el-select placeholder="请选择" size="small" style="width:50%" v-model="form.city">
             <el-option v-for="item in areaArr" :key="item" :label="item" :value="item"></el-option>
        </el-select>
       </el-form-item>
      </el-col>

      <el-col :span="6">
          <el-form-item style="text-align:right">
               <!-- 添加点击事件-清除功能 -->
                <el-button size="small" @click="clearFn">清除</el-button>
                <!-- 添加点击事件-搜索功能 -->
                <el-button type="primary" size="small" @click="searchFn">搜索</el-button>
          </el-form-item>
      </el-col>
   </el-row>
</el-form>
<!-- el文档里的警告模块 --想要在里面放变量,就需要用模板字符串-->
 <el-alert
    style="margin-bottom:15px"
    class="alert"
    :title="`数据一共${total}条`"
    type="info"
    show-icon>
  </el-alert>
  <!-- 表格 -->
   <el-table
      :data="tableData"
      style="width: 100%;padding-top:20px">
      <el-table-column
        prop="number"
        label="试题编号"
        width="120px">
      </el-table-column>
      <!-- 学科:需要将id转化下具体的文字 -->
      <el-table-column
        prop="subjectID" label="学科" >
        <!-- 用作用域插槽+v-if和v-else-if -->
        <template v-slot="scope">
            <div v-if="scope.row.subjectID === 16">大数据</div>
            <div v-else-if="scope.row.subjectID === 14">python</div>
            <div v-else-if="scope.row.subjectID === 13">c</div>
            <div v-else-if="scope.row.subjectID === 12">c#</div>
            <div v-else-if="scope.row.subjectID === 11">php</div>
            <div v-else-if="scope.row.subjectID === 10">运维</div>
            <div v-else-if="scope.row.subjectID === 9">算法</div>
            <div v-else-if="scope.row.subjectID === 8">数据库</div>
            <div v-else-if="scope.row.subjectID === 7">c++</div>
            <div v-else-if="scope.row.subjectID === 6">产品</div>
            <div v-else-if="scope.row.subjectID === 5">设计</div>
            <div v-else-if="scope.row.subjectID === 4">前端</div>
            <div v-else-if="scope.row.subjectID === 3">安卓</div>
            <div v-else-if="scope.row.subjectID === 2">ios</div>
            <div v-else-if="scope.row.subjectID === 1">java</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="catalogID"
        label="目录">
        <template v-slot="scope">
            <div v-if="scope.row.catalogID===5">css基础</div>
            <div v-else-if="scope.row.catalogID===2">javaWEB</div>
            <div v-else-if="scope.row.catalogID===1">java基础</div>
            <div v-else-if="scope.row.catalogID===6">js基础</div>
        </template>
      </el-table-column>
      <!-- 题型转换 -->
       <el-table-column prop="questionType" label="题型">
           <template v-slot="scope">
               <!-- 这里注意下:得到的值类型不一样,所以用==不要用全等 -->
                <!-- <div @click="fn(scope)">单选</div> -->
                <div v-if="scope.row.questionType==1">单选</div>
                <div v-else-if ="scope.row.questionType==2">多选</div>
                <div v-else-if ="scope.row.questionType==3">简答</div>
           </template>
      </el-table-column>
       <el-table-column
        prop="question"
        label="题干"  width="280px">
        <!-- 文字转换下html -->
        <template v-slot="scope">
            <div v-html="scope.row.question"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间" width="180">
        <template v-slot="scope">
            {{scope.row.addDate | parseTimeByString}}
        </template>
      </el-table-column>
      <!-- 转换 -->
      <el-table-column
        prop="difficulty"
        label="难度">
        <template v-slot="scope">
               <div v-if="scope.row.difficulty==1">简单</div>
               <div v-else-if="scope.row.difficulty==2">一般</div>
               <div v-else-if="scope.row.difficulty==3">困难</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="录入人">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" width="180px">
        <template v-slot="scope">
            <!-- 绑定事件 -->
         <el-button type="primary" plain circle icon="el-icon-view" size="small" title="预览" @click="previewFn(scope.row)"></el-button>
         <el-button type="success" plain circle icon="el-icon-edit" size="small" title="修改" @click="modifyFn(scope.$index,scope.row)"></el-button>
         <el-button type="danger" plain circle icon="el-icon-delete" size="small" title="删除" @click="deleteFn(scope.$index,scope.row)"></el-button>
        <el-button type="warning" plain circle icon="el-icon-check" size="small" title="加入精选" @click="addFeaturedFn(scope.$index,scope.row)"></el-button>
        </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 需求:点击页码.切换页面 page-size:每页显示条目个数-->
    <el-pagination
    background
    layout="prev, pager,next,sizes,jumper"
    :total="total"
    @size-change="handleSizeChange"
    :page-sizes="[5, 10, 20, 50]"
    :page-size="form.pagesize"
    :current-page="form.page"
    @current-change="currentPage"
    style="margin-top:20px;text-align:right">
    </el-pagination>
    </el-card>
    <!-- 使用预览的组件 -->
    <questions-preview :questionsObj="questionsObj" :dialogB="dialogVisible" @dialogVisible="prevBtn"></questions-preview>
  </div>

</template>

<script>
// 导入学科列表请求方法
import { simple } from '@/api/hmmm/subjects'
// 导入录入人请求方法
import { list } from '@/api/base/users'

// 导入城市
import { provinces as getCity, citys as getArea } from '@/api/hmmm/citys'
// 导入表格数据和基础题库删除和精选题库加入取消请求方法-----as相当于取了个别名(不然容易重名)
import { list as typelist, remove, choiceAdd } from '@/api/hmmm/questions'
// 导入题型/难度/方向数组-------与上面的代码重名了,显示不出来
import { questionType, difficulty, direction } from '@/api/hmmm/constants'
import questionsPreview from './../components/questions-preview'
export default {
  name: 'questions',
  //   组件
  components: {
    questionsPreview
  },
  data () {
    return {
      questionsObj: {},
      dialogVisible: false,
      form: {
        subjectID: null,
        catalogID: null,
        tags: null,
        keyword: null,
        questionType: null,
        difficulty: null,
        direction: null,
        creatorID: null,
        remarks: null,
        shortName: null,
        province: null,
        city: null,
        // 默认是第一页数据
        page: 1,
        // 默认要5条数据
        pagesize: 5
      },
      //   默认总数是0
      total: 0,
      //   学科保存数据
      subjectArr: [],
      //   试题类型保存数据---直接在pages/constants.js下面保存着
      questionTypeArr: questionType,
      //   难度
      difficultyArr: difficulty,
      //   方向
      directionArr: direction,
      //   录入人
      userListArr: [],
      //   城市---以getCity()方式才能获取到???
      cityArr: getCity(),
      //   地区---点击城市之后赋值进去
      areaArr: [],
      // 保存请求回来的表格的数据
      tableData: []
    }
  },
  methods: {
    // fn (s) {
    //   console.log(s.row.questionType)
    // },
    //   新增试题功能
    addtestFn () {
    //   console.log(1)
    // 点击按钮--去试题录入页面
      this.$router.push('/questions/new')
    },
    // 预览功能事件
    previewFn (questionInfo) {
      // 点击按钮,显示提示预览的框---页面在components/questions-preview.vue
      this.questionsObj = questionInfo
      this.dialogVisible = true
    },
    prevBtn (val) { // 自定义事件
      this.dialogVisible = val
    },
    // 修改功能
    modifyFn (index, obj) {
      // 点击修改按钮-把id传过去,跳转试题录入页面-并把值回填(数据进行回填是试题录入这个页面开始要写的功能)
    //   console.log(1)
      this.$router.push({
        path: '/questions/new',
        query: {
          id: obj.id
        }
      })
    },
    // 删除功能
    deleteFn (index, obj) {
      // 点击删除-出现MessageBox弹框
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(obj.id)
        // 点击确定--调用接口(要传参id)删除---注意:这里需要传入两个参数进去,只传id是不可行的
        await remove(obj, obj.id)
        // 删除成功--给个提示
        this.$message.success('删除成功')
        // 重新获取下表格数据
        this.getListFn()
      })
    },
    // 加入精选
    addFeaturedFn (index, obj) {
      // 点击精选按钮-弹出提示框-将这条试题加入精选题库
      // 成功后：提示加入精选题库成功+跳转到精选题库。
      this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        // 点击确认-调用接口(传参,两个参数-注意形式--choiceState固定的-请求方法里的)
        await choiceAdd({ id: obj.id, choiceState: 1 })
        this.$message.success('加入精选成功')
        this.getListFn()
      })
    },
    // 页码事件---看文档
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.form.page = 1
      this.form.pagesize = val
      this.getListFn()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    // 接受参数--跟据城市名改变
    cityFn (cityName) {
      // 将城市里的地区保存到数组里--渲染到页面上
      this.areaArr = getArea(cityName)
      // 再次点击城市时,把数据清空
      this.form.city = null
    },
    // 点击清除按钮-清除数据
    clearFn () {
      // 初始值
      // console.log(this.$options.data().form)
    //   object.assign()浅拷贝,将后面参数里的key+value直接拷贝给前面的参数
      Object.assign(this.form, this.$options.data().form)
    },
    // 搜索功能
    searchFn () {
      // 一点击请求数据
      this.getListFn()
      //   并且回到第一页
      this.form.page = 1
    },
    // 分页
    currentPage (page) {
    //   console.log(page)
      this.form.page = page
      this.getListFn()
    },
    // 调用表格数据的请求方法---封装下--分页处需要
    async getListFn () {
      const listRes = await typelist(this.form)
      // 将返回的数据保存到数组里
      this.tableData = listRes.data.items
      // 把后台返回的总数保存到变量里
      this.total = listRes.data.counts
      // console.log(listRes.data.counts)
      console.log(this.difficultyArr)
    }
  },
  async created () {
    //   请求学科的请求方法
    const res = await simple(this.form)
    // console.log(res)// 得到了返回的数据
    this.subjectArr = res.data

    // 请求录入人的请求方法
    const userRes = await list()
    // console.log(userRes)
    this.userListArr = userRes.data.list
    // 页面一创建就请求数据回来
    this.getListFn()
  }
}
</script>

<style scoped lang='less'></style>
