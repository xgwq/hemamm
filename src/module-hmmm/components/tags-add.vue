<template>
  <div class="tags-add">
    <!-- 第一行 判断是新增还是修改 -->
    <el-dialog :title="`${data.id?'修改':'新增'}目录`" :visible.sync="show" width="400px">
      <el-form ref="form" size="small" label-width="80px" :model="formModel" :rules="formRules">
        <!-- 第二行 所属学科 -->
        <el-form-item label="所属学科" v-if="!$route.query.id" prop="subjectID">
          <el-select v-model="formModel.subjectID" style="width:100%">
            <el-option
              v-for="item in subjectOptions"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 第三行 目录名称 -->
        <el-form-item label="目录名称" prop="tagName">
          <el-input v-model="formModel.tagName" placeholder="请输入目录名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <!-- 底部 取消 确认 -->
        <!-- 如果点取消则赋值show为false -->
        <el-button @click="show=false">取消</el-button>
        <el-button @click="confirm()" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入标签新增,更新
import { add, update } from '@/api/hmmm/tags'
// 导入目录
import { simple as subjectList } from '@/api/hmmm/subjects'
export default {
  name: 'TagsAdd',
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      show: false, // 默认false
      formModel: {
        id: null, // 序号
        subjectID: null, // 目录id
        tagName: null // 标签名称
      },
      formRules: {
        subjectID: [ // 选择学科
          { type: 'number', message: '请选择所属学科', tirgger: 'blur' }
        ],
        tagName: [ // 输入标签名称
          { required: true, message: '请输入标签名称', tirgger: 'blur' }
        ]
      },
      subjectOptions: []
    }
  },
  async created () {
    // 所属学科
    const { data: subjectArr } = await subjectList()
    this.subjectOptions = subjectArr
  },
  methods: {
    open () {
      this.show = true // 显示窗口
      if (this.data.id) { // 如果是新增
        const { id, subjectID, tagName } = this.data
        this.formModel = { id, subjectID, tagName }
      } else { // 如果是修改
        this.formModel = {
          id: null,
          subjectID: +this.$route.query.id || null,
          tagName: null
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async confirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 点击提交后
          if (!this.data.id) {
            // 如果是新增
            await add(this.formModel) // 标签添加
          } else {
            // 如果是修改
            this.formModel.id = this.data.id
            await update(this.formModel) // 标签修改
          }
          this.$message.success('操作成功') // 提示操作成功
          this.show = false // 关闭窗口
          this.$emit('updateList')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
