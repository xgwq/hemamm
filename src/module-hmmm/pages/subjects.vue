<template>
  <div class="container" style="padding: 0 10px; margin: 10px 0">
    <el-card>
      <!-- 第一行 -->
      <el-row>
        <el-col :span="18">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            size="small"
            :inline="true"
          >
            <el-form-item label="学科名称" style="200px">
              <el-input v-model="form.subjectName"></el-input>
            </el-form-item>

            <el-form-item style="margin-right: 60px">
              <!-- 添加点击事件-清除功能 -->
              <el-button size="small" @click="clearFn">清除</el-button>
              <!-- 添加点击事件-搜索功能 -->
              <el-button type="primary" size="small" @click="searchFn"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="6" style="text-align: right">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="openDialog()"
            >新增学科
            </el-button
          >
        </el-col>
      </el-row>

      <!-- el文档里的警告模块 --想要在里面放变量,就需要用模板字符串-->
      <el-alert
        style="margin-bottom: 15px"
        class="alert"
        :title="`数据一共${total}条`"
        type="info"
        show-icon
      >
      </el-alert>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>

        <el-table-column prop="subjectName" label="学科名称"> </el-table-column>

        <el-table-column prop="username" label="创建者"> </el-table-column>

        <el-table-column prop="addDate" label="创建日期">
          <template v-slot="scope">
            {{ scope.row.addDate | parseTimeByString }}
          </template>
        </el-table-column>

        <el-table-column prop="isFrontDisplay" label="前台是否显示">
          <template v-slot="scope">
            <div v-if="scope.row.isFrontDisplay === 1">是</div>
            <div v-else-if="scope.row.isFrontDisplay === 0">否</div>
          </template>
        </el-table-column>

        <el-table-column prop="twoLevelDirectory" label="二级目录">
        </el-table-column>

        <el-table-column prop="tags" label="标签"> </el-table-column>

        <el-table-column prop="totals" label="题目数量"> </el-table-column>

        <el-table-column prop="" label="操作" width="240px">
          <template v-slot="scope">
            <!-- 按钮类型改变下就是文本模式了 -->
            <el-button type="text" @click="subjectsortFn(scope.$index,scope.row)">学科分类</el-button>
            <el-button type="text" @click="subjecttagsFn(scope.$index,scope.row)">学科标签</el-button>
            <el-button type="text" @click="openDialog(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteFn(scope.$index,scope.row)">删除</el-button>
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

     <!-- 使用组件 -->
     <!-- data是变量,父向子传参用props所以,去子组件里声明下这变量(作用:传递当前点击的对象) @updateList="updateList()"自定义事件-->
    <subjectAdd ref="subjectAdd" :data="currSubject" @updateList="updateList()"/>
    </el-card>
  </div>
</template>

<script>
import { list, remove } from '@/api/hmmm/subjects'
// 引入组件
import subjectAdd from '@/module-hmmm/components/subjects-add.vue'
export default {
  name: 'subjects',
  components: {
    //   注册组件
    subjectAdd
  },
  data () {
    return {
      form: {
        subjectName: '',
        // 默认是第一页数据
        page: 1,
        pagesize: 10
      },
      tableData: [],
      //   默认总数是0
      total: 0,
      //   控制组件的显示与隐藏
      dialogVisible: false,
      //   用来保存点击的数据对象
      currSubject: {},
      //   声明一个数组
      subjects: []
    }
  },
  methods: {
    // 不管是新增还是修改,操作完更新列表
    updateList () {
      // 修改的话-就让页码改为1
      if (!this.currSubject.id) {
        this.form.page = 1
      }
      this.getListFn()
    },
    // 请求表格的数据
    async getListFn () {
      const res = await list(this.form)
      // console.log(res)
      this.tableData = res.data.items
      this.total = res.data.counts
    },
    // 清除功能
    clearFn () {
      // 就一个输入框需要清空,所以不用Object.assign()方法了
      this.form.subjectName = ''
    },
    // 搜索功能
    searchFn () {
      // 已经传入参数进去了,所以这里直接调用
      this.getListFn()
      //   把页码改成第一页
      this.form.page = 1
    },
    // 学科分类事件
    subjectsortFn (index, obj) {
      // 跳转页面,并把id和学科名传过去
      this.$router.push({
        path: '/subjects/directorys',
        query: {
          id: obj.id,
          name: obj.subjectName
        }
      })
    },
    // 学科标签事件
    subjecttagsFn (index, obj) {
      this.$router.push({
        path: '/subjects/tags',
        query: {
          id: obj.id,
          name: obj.subjectName
        }
      })
    },
    // 修改事件/新增事件--复用组件
    openDialog (subject) {
      // 现在新增和修改是同一个事件
      // 把点击的那个对象保存数组里-这里需要判断下(短路运算符)有对象就保存,没有就是新增给空对象
      this.currSubject = subject || {}
      //   console.log(this.subjectsObj)

      // 一点击,显示添加的组件
      // ref
      // (1)ref 加在普通的元素上，用this.ref.name 获取到的是dom元素
      // (2)ref 加在子组件上，用this.ref.name 获取到的是组件实例，可以使用组件的所有方法
      // 注意:ref 需要在dom渲染完成后才会有，在使用的时候确保dom已经渲染完成。比如在生命周期 mounted(){} 钩子中调用，或者在 this.$nextTick(()=>{}) 中调用
      this.$nextTick(() => {
        this.$refs.subjectAdd.open()
      })
    },
    // 删除事件
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
    // 页码事件---看文档
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.form.page = 1
      this.form.pagesize = val
      this.getListFn()
    },
    // 分页
    currentPage (page) {
      this.form.page = page
      this.getListFn()
    }
  },
  created () {
    // 页面一创建就请求表格的数据回来
    this.getListFn()
  }
}
// 父组件通过 属性props向下传递数据给子组件,子组件通过 事件events 给父组件发送消息。
</script>

<style scoped lang='less'></style>
