<template>
  <div class='container'>
    <div class="app-container">
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-row>
            <el-col :span="20">
              <el-form-item label="关键字">
                <el-input v-model="form.keyword"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="button">
              <el-form-item>
                <el-button @click="removeBtn">清除</el-button>
                <el-button type="primary" @click="searchBtn">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 弹窗 -->
        <el-alert
          :title="alertText"
          type="info"
          :closable="false"
          show-icon>
        </el-alert>
        <!-- 列表 -->
        <el-table
          :data="tableData"
          style="width: 100%; margin-top:20px;">
          <el-table-column
            prop="id"
            label="编号"
            width="190">
          </el-table-column>
          <el-table-column
            prop="questionType"
            label="题型"
            width="110">
            <template v-slot="scope">
              <span>{{ scope.row.questionType === "1" ? "单选" : scope.row.questionType === "2" ?"多选" : "简答"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="questionIDs"
            label="题目编号"
            width="190">
            <template v-slot="scope">
              <div
              v-for="(obj,index) in scope.row.questionIDs"
              :key="index">
                <el-button type="text" @click="previewBtn(obj)">{{ obj.number }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="录入时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="totalSeconds"
            label="答题时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="accuracyRate"
            label="真确率（%）"
            width="150">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="录入人"
            width="150">
          </el-table-column>
          <el-table-column
            label="操作"
            width="138">
            <template v-slot="scope">
              <el-button size="small" type="danger" icon="el-icon-delete" circle @click="delfandomBtn(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="pagination" >
          <div class="page">
            <el-pagination
              style="margin-top:20px;"
              background
              @current-change="handleCurrentChange"
              :current-page="page"
              @size-change="handleSizeChange"
              :page-sizes="[20, 30, 40, 50]"
              :page-size="pagesize"
              layout="prev, pager, next, sizes, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
        <!-- 预览组件使用 -->
        <Rpreview :questionsObj="questionsObj" :dialogB="dialogVisible" @dialogVisible="prevBtn"></Rpreview>
      </el-card>
    </div>
  </div>
</template>

<script>
import { randoms as randomsList, removeRandoms as delRandom } from '@/api/hmmm/questions.js'
import Rpreview from './../components/questions-preview'
export default {
  name: 'randoms',
  data () {
    return {
      form: {
        keyword: ''
      },
      questionsObj: {},
      dialogVisible: false,
      page: 1, // 第1页
      pagesize: 20, // 分页器-每页10条
      total: 0,
      alertText: '',
      tableData: []// 列表数据
    }
  },
  methods: {
    handleSizeChange (val) { // 分页器
      this.pagesize = val
      this.page = 1
      this.getrandomsList()
    },
    handleCurrentChange (val) { // 当前页数
      this.page = val
      this.getrandomsList()// 获取组题列表
    },
    removeBtn () { // 清除
      this.form.keyword = ''
    },
    searchBtn () { // 搜索
      this.page = 1
      this.pagesize = 20
      this.getrandomsList()// 获取组题列表
      this.form.keyword = ''
    },
    delfandomBtn (obj) { // 删除
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRandom(obj)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getrandomsList()// 获取组题列表
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    previewBtn (obj) { // 预览
      this.questionsObj = obj

      this.dialogVisible = true
    },
    prevBtn (val) { // 自定义事件
      this.dialogVisible = val
    },
    async getrandomsList () { // 获取组题列表
      const resrandomsparams = await randomsList({
        page: this.page,
        pagesize: this.pagesize,
        ...this.form
      })
      this.tableData = resrandomsparams.data.items// 表格数据
      this.total = resrandomsparams.data.counts// 数据总数
      this.alertText = `总条数为${this.total}条`
    }
  },
  created () {
    this.getrandomsList()// 获取组题列表
  },
  components: {
    Rpreview
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.button , .pagination{
  display: flex;
  flex-direction:row-reverse;
}
</style>
