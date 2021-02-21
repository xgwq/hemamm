<template>
  <div class='container'>
    <div class="app-container">
      <el-dialog
        title="题目预览"
        :visible.sync="dialogVisible"
        :before-close="handleClose">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>{{`【${this.previewDetailData.questionType === "1"? "单选" : this.previewDetailData.questionType === "2" ? "多选" : "简答"}】`}}</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { previewDetail } from '@/api/randomsapi/randomsapi'
export default {
  name: 'preview',
  data () {
    return {
      previewDetailData: {},
      dialogVisible: false// 开关弹窗，标识
    }
  },
  props: {
    questionsObj: Object, // 试题预览id
    dialogB: Boolean// 点击预览-传入true
  },
  watch: {
    async questionsObj (newval) { // 监听试题id
      // console.log(newval)// 之后调用试题详情接口
      const respreviewDetail = await previewDetail(newval)
      console.log(respreviewDetail)
      this.previewDetailData = respreviewDetail.data
    },
    dialogB (newval) { // 监听传入布尔值
      // console.log(newval, oldval)
      this.dialogVisible = newval
    },
    dialogVisible (newval) { /// 监听 开关弹窗，标识，将false传出去
      this.$emit('dialogVisible', newval)
    }
  },
  methods: {
    handleClose (done) { // 关闭x
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
