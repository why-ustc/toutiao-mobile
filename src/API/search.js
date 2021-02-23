/* 
    封装有关搜索框的 axios 请求
*/

import request from "@/utils/request.js"


// 搜索联想建议 axios 请求封装
export const getSearchSuggests = (q) => {
    return request({
        method: 'get',
        url: `/app/v1_0/suggestion`,
        params: {
            q
        }
    })
}


// 搜索结果 axios 请求封装
// 参数有三个，所以直接当成 一个对象传入
export const getSearchResults = (params) => {
    return request({
        method: 'get',
        url: `/app/v1_0/search`,
        params
    })
}


// 获取搜索历史记录 axios 请求封装
export const getSearchHistorys = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/search/histories`,
    })
}

// 删除全部历史记录 axios 请求封装
export const deleteAllHistories = () => {
    return request({
        method: 'delete',
        url: `/app/v1_0/search/histories`,
    })
}