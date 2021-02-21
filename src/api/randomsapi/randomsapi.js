// 导入请求接口
import { createAPI } from '@/utils/request'
//

// 组题列表
export const randomsList = data => createAPI('/questions/randoms', 'get', data)

// 组题删除/questions/randoms/:id
export const delRandom = data => createAPI(`/questions/randoms/${data.id}`, 'DELETE', data)

// 基础题库详情
export const previewDetail = data => createAPI(`/questions/${data.id}`, 'get', data)
