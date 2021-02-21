<template>
  <div class='container'>
    <el-card>
      <div slot="header">试题录入</div>
      <el-form ref="form" :model="TestEntry" :rules="TestEntryRule" label-width="120px">
        <!-- 学科 -->
        <el-form-item label="学科：" prop="subjectID">
          <!-- 点击学科，目录才有内容,学科和目录联动 -->
          <el-select @change="changeSubject" v-model="TestEntry.subjectID" style="width:400px">
            <!-- key为了让每个变成唯一的，为了优化 -->
            <el-option v-for="item in subject" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
         <!-- 目录 -->
        <el-form-item label="目录：" prop="catalogID">
          <!-- v-model为了让其可以写内容 -->
          <el-select v-model="TestEntry.catalogID"  style="width:400px">
            <el-option v-for="item in catalog" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
         <!-- 企业 -->
         <el-form-item label="企业：" prop="enterpriseID">
          <el-select v-model="TestEntry.enterpriseID"  style="width:400px">
            <el-option v-for="item in enterprise" :key="item.id" :label="item.company" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
         <!-- 城市 -->
         <el-form-item label="城市：" prop="city">
          <el-select v-model="TestEntry.province" @change="changeArea" style="width:198px">
            <el-option v-for="item in citys" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="TestEntry.city" style="width:198px;margin-left:4px">
            <el-option v-for="item in areas" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
         <!-- 方向 -->
        <el-form-item label="方向：" prop="direction">
          <el-select v-model="TestEntry.direction" style="width:400px">
            <el-option v-for="item in direction" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card></div>
</template>

<script>
// 接口名一样，simple as getSubjectOptions，给simple重新起一个名字，把simple的功能赋值给getSubjectOptions
// 学科接口
import { simple as getSubject } from '@/api/hmmm/subjects'
// 目录接口
import { simple as getCatalog } from '@/api/hmmm/directorys'
// 企业接口
import { list as getEnterprise } from '@/api/hmmm/companys'
// 城市接口
// provinces直接返回的就是城市名，没有用到axios
import { provinces, citys } from '@/api/hmmm/citys'
// 方向接口
import { direction } from '@/api/hmmm/constants'
export default {
  data () {
    return {
      TestEntry: {
        // 学科id
        subjectID: null,
        // 目录id
        catalogID: null,
        // 企业id
        enterpriseID: null,
        // 城市
        province: null,
        city: null,
        // 方向
        direction: null
      },
      // 校验规则
      TestEntryRule: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ]
      },
      // 学科
      subject: [],
      // 目录
      catalog: [],
      // 企业
      enterprise: [],
      // 城市
      // 这个接口没有应用axios，直接方法里面返回来的就是对应的数据，直接请求这个方法就行
      citys: provinces(),
      // 城市对应的区
      areas: [],
      // 方向
      // 这个接口里面直接就是对象的数据
      // es6简写
      direction
    }
  },
  methods: {
    // 学科和目录联动，学科change改变获取对应的id，来使目录改变
    async changeSubject (subjectID) {
      this.TestEntry.catalogID = null
      // 把获取的学科id传给目录接口
      const res = await getCatalog({ subjectID: this.TestEntry.subjectID })
      this.catalog = res.data
    },
    // 获取学科列表
    async getSubjectOptions () {
      const res = await getSubject()
      this.subject = res.data
    },
    // 企业列表
    async getEnterprise () {
      // pagesize不写最多显示10条，写了可以显示多点但是最多是50条
      const res = await getEnterprise({ pagesize: 50 })
      this.enterprise = res.data.items
    },
    // 城区联动
    changeArea (province) {
      this.TestEntry.city = null
      this.areas = citys(province)
    }
  },
  created () {
    // 获取学科列表
    this.getSubjectOptions()
    // 获取企业列表
    this.getEnterprise()
  }
}
</script>

<style scoped lang='less'></style>
