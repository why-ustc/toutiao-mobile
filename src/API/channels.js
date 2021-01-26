/* 有关频道的 axios 请求 */

import request from "../utils/request"

// 请求所有频道的 axios 请求
export const getAllChannelsAxios = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/channels`
    })
}

// 批量添加用户频道列表
// 使用  部分覆盖那个
export const addUserChannels = data => {
    return request({
        method: 'patch',
        url: `/app/v1_0/user/channels`,
        data
    })
}

// 删除指定用户频道列表--路径参数
export const deleteUserChannels = (channelId) => {
    return request({
        method: 'delete',
        url: `/app/v1_0/user/channels/${channelId}`,
    })
}