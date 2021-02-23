// 导入 axios
import request from '@/utils/request.js'



// 导出 axios 请求：获取评论或评论回复
export const getcomments = (params) => {
    return request({
        method: 'get',
        url: `/app/v1_0/comments`,
        params
    })
}

// 导出 axios 请求：对评论或评论回复点赞
export const addCommentLike = (commentId) => {
    return request({
        method: 'post',
        url: `/app/v1_0/comment/likings`,
        data: {
            target: commentId
        }
    })
}


// 导出 axios 请求：取消对评论或评论回复点赞
export const deleteCommentLike = (commentId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/comment/likings/${commentId}`,

    })
}

// 导出 axios 请求：添加评论或评论回复
export const sendComments = (data) => {
    return request({
        method: 'post',
        url: `/app/v1_0/comments`,
        data
    })
}