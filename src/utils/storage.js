/* 
    本地存储封装模块-token

    节约写 window.localStorage.getItem(setItem)('token')
*/

// 导出 getItem, 它是一个函数.
// 获取 Item 需要参数：name
export const getItem = (name) => {
    // 先获取原本的数据
    let data = window.localStorage.getItem(name)

    // 为什么把 JSON.parse(data) 放到 try-catch 中
    // 因为 data 可能不是 Json 格式 字符串
    try {
        // data 是 Json 字符串，转化为 js 对象（数组 + 对象）
        return JSON.parse(data)
    } catch (error) {
        // data 不是 Json 字符串，原样返回
        return data
    }
}

// 设置 localStorage 需要俩个参数， 名字 +值
export const setItem = (name, value) => {

    // 不能直接存，如果 value 是对象，不可直接存 localStorage
    // window.localStorage.setItem(name,value)

    // 如果是对象，必须转成 JSON 格式字符串再存
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)

}


// 删除 本地存储 
export const removeItem = (name) => {
    window.localStorage.removeItem(name)
}