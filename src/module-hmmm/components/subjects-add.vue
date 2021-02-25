<template>
  <div class="container">
    <!-- 因为只有一个组件/而页面上添加和修改都要用到这个页面,所以要判断打开的到底是新增还是修改 :title="change()"-->
    <!-- visible是否显示dialog弹出层 sync修饰符作用:子组件(el-dialog)内部能修改父组件(subjects-add)的变量-->
     <el-dialog :title="`${data.id?'修改':'新增'}学科`" :visible.sync="show" width="400px">
      <!-- 验证规则: rules-->
      <el-form
        :rules="formRules"
        ref="form"
        label-width="80px"
        :model="formModel"
        size="small"
      >
        <!-- 第一行 -->
        <el-form-item label="学科名称" style="200px" prop="subjectName">
          <el-input
            placeholder="请输入学科名称"
            style="width: 200px"
            v-model="formModel.subjectName"
          ></el-input>
        </el-form-item>
        <!-- 第二行 -->
        <el-form-item label="是否显示" style="200px" prop="isFrontDisplay">
          <!-- Switch 开关 -->
          <!--active-value  打开时的值 -->
          <!--inactive-value 关闭时的值 -->
          <el-switch
            v-model="formModel.isFrontDisplay"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入增加/修改请求方法
import { add, update } from '@/api/hmmm/subjects.js'
export default {
  name: 'subjectsAdd',
  data () {
    return {
      show: false,
      formModel: {
        // id,用来判断是新增还是修改
        id: null,
        subjectName: null,
        // 用来接收用户点的是 是还是否
        isFrontDisplay: 1
      },
      //   指定验证规则
      formRules: {
        subjectName: [
          {
            required: true,
            message: '请输入学科名称',
            tirgger: 'blur'
          }
        ],
        isFrontDisplay: [
          {
            type: 'number',
            message: '请选择是否显示',
            tirgger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    data: {
    // (父) 传入对象进来
      type: Object
    }
  },
  methods: {
    // 声明一个方法--控制这个组件显示与隐藏(在父页面里调用这个方法this.$refs.subjectsAdd.open())
    open () {
      this.show = true
      //   判断下--打开的时候,如果是新增就直接是空,如果是修改,就把父组件具体的对象给这个组件里面,显示出来
      if (this.data.id) {
        const { id, subjectName, isFrontDisplay } = this.data
        this.formModel = { id, subjectName, isFrontDisplay }
      } else {
        //   新增
        this.formModel = {
          id: null,
          subjectName: null,
          isFrontDisplay: 1
        }
      }
      // 清除校验效果---一打开组件不要校验
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 确认事件
    confirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 提交
          if (!this.data.id) {
            // 新增
            await add(this.formModel)
          } else {
            // 修改
            this.formModel.id = this.data.id
            await update(this.formModel)
          }
          // 给用户一个提示
          this.$message.success('操作成功')
          // 关闭弹窗
          this.show = false
          //   把更新的对象传出去
          this.$emit('updateList')
        }
      })
    }
  }
}
</script>

<style scoped lang='less'></style>
