<template>
  <div class="tags-container">
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="18">
          <el-form size="small" :inline="true">
            <!-- 标签搜索 -->
            <el-form-item label="标签名称">
              <el-input v-model="input"></el-input>
           </el-form-item>
           <!-- 状态搜索 -->
            <el-form-item label="状态">
              <el-select v-model="select" placeholder="请选择">
                <el-option value="1" label="启用"></el-option>
                <el-option value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="text-align:right">
              <!-- 清空搜索条件,显示所有状态 -->
              <el-button >清除</el-button>
              <el-button type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button icon="el-icon-edit" type="success" size="small">新增标签</el-button>
        </el-col>
      </el-row>
      <!-- 显示符合条件数据的条数 -->
      <el-alert
        :title="`数据一共 ${total} 条`"
        style="margin-bottom:15px"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 展示表格内容 -->
      <el-table :data="tags">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="所属学科" prop="subjectName"></el-table-column>
        <el-table-column label="标签名称" prop="tagName"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{scope.row.addDate|parseTimeByString}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.state===1?'已启用':'已禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.state===1?'禁用':'启用'}}</el-button>
            <el-button type="text" :disabled="scope.row.state===1">修改</el-button>
            <el-button type="text" :disabled="scope.row.state===1||scope.row.totals > 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px;text-align:right"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :page-size="requestParams.pagesize"
        :current-page="requestParams.page"
        @current-change="pager"
        @size-change="handleSizeChange"
        hide-on-single-page
      ></el-pagination>
    </el-card>
    <!-- 新增和修改功能 -->
    <tags-add ref="tagssAdd" :data="currTag"></tags-add>
  </div>
</template>

<script>
import { list } from '@/api/hmmm/tags'
import TagsAdd from '../components/tags-add'
export default {
  name: 'TagsList',
  components: { TagsAdd },
  data () {
    return {
      requestParams: { // 页码数,每页数量 (2个参数)
        tagName: null,
        state: null, // 显示全部
        page: 1, // 默认显示一页数据
        pagesize: 10 // 默认一页显示10条数据
      },
      total: 0,
      tags: [],
      currTag: {}
    }
  },
  computed: {
    subject () {
      return this.$route.query || {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    openDialog (tag = {}) {
      this.currTag = tag
      this.$nextTick(() => {
        this.$refs.tagssAdd.open()
      })
    },
    // 查询列表
    async getList () {
      this.requestParams.subjectID = this.subject.id || null
      const { data } = await list(this.requestParams)
      this.tags = data.items
      this.total = data.counts
    },
    // 切换条数
    handleSizeChange (size) {
      this.requestParams.page = 1
      this.requestParams.pagesize = size
      this.getList()
    },
    // 切换分页
    pager (np) {
      this.requestParams.page = np
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-container{
  padding: 10px;
}
</style>
