<template>
  <div class='container'>
    <div class="app-container">
      <el-dialog
        title="题目预览"
        :visible.sync="dialogVisible"
        :before-close="handleClose">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>{{`【题型】：`}}{{this.questionT}}</span>
            </el-col>
            <el-col :span="6">
              <span>{{`【编号】：`}}{{this.previewDetailData.id}}</span>
            </el-col>
            <el-col :span="6">
              <span>{{`【难度】：`}}{{this.previewDetailData.difficulty === "1"? "简单" : this.previewDetailData.questionType === "2" ? "一般" : "困难"}}</span>
            </el-col>
            <el-col :span="6">
              <span>{{`【标签】：`}}{{this.previewDetailData.tags}}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 30px;">
            <el-col :span="6">
              <span>{{`【学科】：`}}{{this.previewDetailData.subjectName}}</span>
            </el-col>
            <el-col :span="6">
              <span>{{`【目录】：`}}{{this.previewDetailData.directoryName}}</span>
            </el-col>
            <el-col :span="6">
              <span>{{`【方向】：`}}{{this.previewDetailData.direction}}</span>
            </el-col>
          </el-row>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 题干:正确答案 -->
            <el-row>
              <span>{{`【题干】：`}}</span>
            </el-row>
            <el-row>
              <span v-html="this.previewDetailData.question" style="color:blue"></span>
            </el-row>
            <el-row v-if="this.questionT !== '简答题'">
                <span>{{this.questionT + " 选项：（以下选中的为正确答案）"}}</span>
            </el-row>
            <el-row v-if="this.questionT === '单选题'">
              <el-radio-group v-model="radio">
                <el-radio
                style="display:block; margin-top: 20px;"
                v-for="(item,index) in OptionData"
                :key="index"
                :label="item.isRight === 1 ? '':null">{{ item.title }}</el-radio>
              </el-radio-group>
            </el-row>
            <el-row v-else-if="this.questionT === '多选题'">
              <el-col style="display:block; margin-top: 20px;"  v-for="(item,index) in OptionData"
                :key="index">
                 <input  id="checkbox1" type="checkbox" :checked="item.isRight === 1" /><span style="margin-left: 15px;">{{item.title }}</span>
              </el-col>
            </el-row>
             <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 视频 -->
          <el-row>
            <el-col>
              <span>{{`【答案】：`}}</span>
              <el-button type="danger" @click="videoBtn">点击后观看视频答案预览</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px">
            <el-col>
              <video width="500" :src="urlVideo" preload controls="controls" :style="{'display':bool}"></video>
            </el-col>
          </el-row>
           <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 答案解析 answer-->
          <el-row>
              <span>{{`【答案解析】：`}}</span>
              <span style="display:inline-block" v-html="this.previewDetailData.answer"></span>
          </el-row>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <el-row>
              <span>{{`【题目备注】：`}}{{this.previewDetailData.remarks}}</span>
          </el-row>
          <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="dialogVisible = false , urlVideo='',bool = 'none'">关闭</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { detail as previewDetail } from '@/api/hmmm/questions'
export default {
  name: 'preview',
  data () {
    return {
      OptionData: [], // previewDetailData对象里的options数组对象
      previewDetailData: {}, // 当前的试题对象
      dialogVisible: false, // 开关弹窗，标识
      urlVideo: '', // 视频地址
      bool: 'none', // 隐藏播放器
      radio: '', // 单选双向数据绑定
      checkList: []// 多选双向数据绑定
    }
  },
  props: {
    questionsObj: Object, // 试题预览
    dialogB: Boolean// 点击预览-传入true
  },
  watch: {
    async questionsObj (newval) { // 监听试题id
      const respreviewDetail = await previewDetail(newval)
      this.previewDetailData = respreviewDetail.data
      if (this.previewDetailData.options !== undefined) {
        this.OptionData = this.previewDetailData.options
      }
    },
    dialogB (newval) { // 监听传入布尔值
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
          this.urlVideo = ''
          this.bool = 'none'
          done()
        })
        .catch(_ => {})
    },
    videoBtn () { // 视频播放
      this.urlVideo = this.previewDetailData.videoURL
      this.bool = 'block'
    }
  },
  computed: {
    questionT () {
      return this.previewDetailData.questionType === '1' ? '单选题' : (this.previewDetailData.questionType === '2' ? '多选题' : '简答题')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
