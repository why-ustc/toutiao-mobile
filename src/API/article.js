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


// 导出 axios 请求：请求文章具体内容
export const getArticle = (articleId) => {
    return request({
        method: 'get',
        url: `/app/v1_0/articles/${articleId}`,
    })
}

// 导出 axios 请求：点击关注 作者
export const addFollow = (userId) => {
    return request({
        method: 'post',
        url: `/app/v1_0/user/followings`,
        // 因为是 post 请求，必须是 data,params 就报错，
        // 详情看官方文档
        data: {
            target: userId //作者ID
        }

    })
}

// 导出 axios 请求：点击取消关注 作者
export const deleteFollow = (authorId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/user/followings/${authorId}`,
    })
}

// 导出 axios 请求：点击 收藏文章
export const addCollect = (articleId) => {
    return request({
        method: 'post',
        url: `/app/v1_0/article/collections`,
        // 因为是 post 请求，必须是 data,params 就报错，
        // 详情看官方文档
        data: {
            target: articleId
        }

    })
}

// 导出 axios 请求：点击 取消收藏文章
export const deleteCollect = (articleId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/article/collections/${articleId}`,
    })
}

// 导出 axios 请求：给文章点赞
export const addLike = (articleId) => {
    return request({
        method: 'post',
        url: `/app/v1_0/article/likings`,
        // 因为是 post 请求，必须是 data,params 就报错，
        // 详情看官方文档
        data: {
            target: articleId //文章 id
        }

    })
}

// 导出 axios 请求：点击 取消点赞
export const deleteLike = (articleId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/article/likings/:target${articleId}`,
    })
}