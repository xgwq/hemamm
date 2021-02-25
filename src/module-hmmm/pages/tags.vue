<template>
  <div class="tags-container">
    <el-card>
      <!-- 第一行 搜索 -->
      <el-row>
        <el-col :span="18">
          <el-form size="small" :inline="true">
            <!-- 标签搜索 -->
            <el-form-item label="标签名称">
              <el-input v-model="requestParams.tagName"></el-input>
           </el-form-item>
           <!-- 状态搜索 -->
            <el-form-item label="状态">
              <el-select v-model="requestParams.state">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="text-align:right">
              <!-- 清空搜索条件,显示所有状态 -->
              <el-button @click="clear()">清空</el-button>
              <el-button @click="filter()" type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button icon="el-icon-edit" @click="openDialog()" type="success" size="small">新增标签</el-button>
        </el-col>
      </el-row>
      <!-- 第二行 显示符合条件数据的条数 -->
      <el-alert
        :title="`数据一共 ${total} 条`"
        style="margin-bottom:15px"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 第三行 展示表格内容 -->
      <el-table :data="tags">
        <el-table-column label="序号" type="index" width="80px"></el-table-column>
        <el-table-column label="所属学科" prop="subjectName"></el-table-column>
        <el-table-column label="标签名称" prop="tagName"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{scope.row.addDate|parseTimeByString}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.state===1?'已启用':'已禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="text" @click="toggleState(scope.row)">{{scope.row.state===1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="openDialog(scope.row)" :disabled="scope.row.state===1">修改</el-button>
            <el-button type="text" @click="delTag(scope.row)" :disabled="scope.row.state===1||scope.row.totals > 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 第四行 分页 -->
      <el-pagination
        style="margin-top:20px;text-align:right"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :page-size="requestParams.pagesize"
        :current-page="requestParams.page"
        @current-change="pager"
        :page-sizes="[5,10,20,50]"
        @size-change="handleSizeChange"
        hide-on-single-page
      ></el-pagination>
    </el-card>
    <!-- 右上侧 新增和修改功能 -->
    <tags-add ref="tagssAdd" :data="currTag" @updateList="updateList()"></tags-add>
  </div>
</template>

<script>
// 导入标签列表,状态,删除
import { list, remove, changeState } from '@/api/hmmm/tags'
// 导入新增标签功能
import TagsAdd from '../components/tags-add'
export default {
  name: 'TagsList',
  components: { TagsAdd },
  data () {
    return {
      requestParams: { // 页码数,每页数量 (2个参数)
        tagName: null, // 标签名称
        state: null, // 显示全部
        page: 1, // 默认显示一页数据
        pagesize: 10 // 默认一页显示10条数据
      },
      total: 0, // 默认总数为0
      tags: [], // 保存标签
      currTag: {}
    }
  },
  computed: {
    subject () {
      return this.$route.query || {}
    }
  },
  created () {
    this.getList() // 网页打开的时候触发created, 调用一次文章获取列表方法
  },
  watch: {
    '$route.query': function () {
      this.getList()
    }
  },
  methods: {
    openDialog (tag = {}) { // 弹窗功能
      this.currTag = tag
      this.$nextTick(() => {
        this.$refs.tagssAdd.open()
      })
    },
    async getList () { // 查询列表
      this.requestParams.subjectID = this.subject.id || null
      const { data } = await list(this.requestParams)
      this.tags = data.items
      this.total = data.counts // 数据总量保存起来
    },
    handleSizeChange (size) { // 切换条数
      this.requestParams.page = 1 // 查询的时候默认要显示第一页(不写这行默认显示原来第几页的数据)
      this.requestParams.pagesize = size
      this.getList() // 重新渲染页面
    },
    pager (page) { // 页码改变
      this.requestParams.page = page // 把新的页码富裕到查询参数对象上
      this.getList() // 从新渲染页面
    },
    async toggleState (tag) { // 切换状态 1是启用,0是禁用
      await changeState({
        id: tag.id,
        state: tag.state === 1 ? 0 : 1
      })
      this.$message.success('操作成功')
      tag.state = tag.state === 1 ? 0 : 1
    },
    async delTag (tag) {
      await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(tag)
      this.$message.success('删除成功')
      this.getList()
    },
    clear () { // 清除条件
      this.requestParams = {
        tagsName: null, // 清空标签名称
        state: null, // 清空状态
        page: 1, // 显示一页
        pagesize: 10 // 显示10条
      }
    },
    filter () { // 进行筛选
      this.requestParams.page = 1
      this.getList() // 重新渲染页面
    },
    updateList () { // 新增|修改 后更新列表
      if (!this.currTag.id) {
        this.requestParams.page = 1
      }
      this.getList() // 重新渲染页面
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-container{
  padding: 10px;
}
</style>
