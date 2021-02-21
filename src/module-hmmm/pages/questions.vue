<template>
<!-- 题组管理页面 -->
  <div style="margin:10px 10px; background-color:white;padding:10px 10px;">
      <!-- 第一行 -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="color:pink;font-size:12px">说明：目前支持学科和关键字条件筛选</span>
          <el-button type="success" icon="el-icon-edit" style="">新增试题</el-button>
      </div>

<!-- 表单上添加变量进行数据绑定-->
      <el-form :inline="true" ref="form" :model="form" label-width="70px">
          <el-form-item label="学科">
             <el-select placeholder="请选择" size="small" v-model="form.subjectID">
             <el-option v-for="obj in subjectArr" :key="obj.value" :label="obj.label" :value="obj.value"></el-option>
             </el-select>
        </el-form-item>

         <el-form-item label="二级目录">
             <el-select placeholder="请选择" size="small" v-model="form.catalogID">
             <el-option label="无数据" value=""></el-option>
             </el-select>
        </el-form-item>

         <el-form-item label="标签">
             <el-select placeholder="请选择" size="small" v-model="form.tags">
             <el-option label="无数据" value=""></el-option>
             </el-select>
        </el-form-item>

        <el-form-item label="关键字">
        <el-input placeholder="根据题干搜索" size="small" v-model="form.keyword"></el-input>
       </el-form-item>

       <el-form-item label="试题类型">
             <el-select placeholder="请选择" size="small" v-model="form.questionType">
             <el-option v-for="item in questionTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
        </el-form-item>

        <el-form-item label="难度">
             <el-select placeholder="请选择" size="small" v-model="form.difficulty">
             <el-option v-for="item in difficultyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
        </el-form-item>

        <el-form-item label="方向">
             <el-select placeholder="请选择" size="small" v-model="form.direction">
             <el-option v-for="item in directionArr" :key="item" :label="item" :value="item"></el-option>
             </el-select>
        </el-form-item>

        <el-form-item label="录入人" >
             <el-select placeholder="请选择" size="small" v-model="form.creatorID">
             <el-option v-for="obj in userListArr" :label="obj.username" :value="obj.id" :key="obj.id"></el-option>
             </el-select>
        </el-form-item>

        <el-form-item label="题目备注">
        <el-input size="small" v-model="form.remarks"></el-input>
       </el-form-item>

       <el-form-item label="企业简称" size="small">
        <el-input size="small" v-model="form.shortName"></el-input>
       </el-form-item>

      <!-- 选择城市改变的时候触发事件 -->
       <el-form-item label="城市" style="">
        <el-select placeholder="请选择" size="small" v-model="form.province" @change="cityFn">
             <el-option v-for="item in cityArr" :key="item" :label="item" :value="item"></el-option>
             </el-select>
             <!-- 地区 -->
             <el-select placeholder="请选择" size="small" style="margin-left:5px" v-model="form.city">
             <el-option v-for="item in areaArr" :key="item" :label="item" :value="item"></el-option>
        </el-select>
       </el-form-item>
    <el-button size="small" @click="clearFn">清除</el-button>
    <el-button type="primary" size="small">搜索</el-button>
</el-form>
<!-- el文档里的警告模块 --想要在里面放变量,就需要用模板字符串-->
 <el-alert
    style="margin-top:20px"
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
        width="180">
      </el-table-column>
      <el-table-column
        prop="subjectID"
        label="学科"
        width="180">
      </el-table-column>
      <el-table-column
        prop="catalogID"
        label="目录">
      </el-table-column>
       <el-table-column
        prop="questionType"
        label="题型">
      </el-table-column>
       <el-table-column
        prop="question"
        label="题干">
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间">
      </el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="录入人">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <!-- el-icon-view:眼睛图标 -->
         <el-button type="primary" plain circle icon="el-icon-view"></el-button>
         <el-button type="success" plain circle icon="el-icon-edit"></el-button>
         <el-button type="danger" plain circle icon="el-icon-delete"></el-button>
        <el-button type="warning" plain circle icon="el-icon-check"></el-button>
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
    style="padding-top:20px">
    </el-pagination>
  </div>

</template>

<script>
// 导入学科列表请求方法
import { simple } from '@/api/hmmm/subjects'
// 导入录入人请求方法
import { list } from '@/api/base/users'
// 导入城市
import { provinces as getCity, citys as getArea } from '@/api/hmmm/citys'
// 导入表格数据-----as相当于取了个别名(不然容易重名)
import { list as typelist } from '@/api/hmmm/questions'
// 导入题型/难度/方向数组
import { questionType, difficulty, direction } from '@/api/hmmm/constants'
export default {
  name: 'questions',
  data () {
    return {
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
    // 分页
    currentPage (page) {
    //   console.log(page)
      this.form.page = page
      this.getListFn()
    },
    // 调用表格数据的请求方法---封装下--分页处需要
    async getListFn () {
      const listRes = await typelist(this.form)
      // console.log(listRes)
      // 将返回的数据保存到数组里
      this.tableData = listRes.data.items
      // 把后台返回的总数保存到变量里
      this.total = listRes.data.counts
    // console.log(listRes.data.counts)
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

    this.getListFn()
  }
}
</script>

<style scoped lang='less'></style>
