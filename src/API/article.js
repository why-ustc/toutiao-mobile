// 导入 axios
import request from '@/utils/request.js'



// 导出 axios 请求：请求文章列表内容
export const getArticlesContent = (params) => {
    return request({
        method: 'get',
        url: `/app/v1_1/articles`,
        params
    })
}