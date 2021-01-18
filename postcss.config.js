/* 
postcss配置文件
*/

// postcss
module.exports = {
    plugins: {
        autoprefixer: {
            browsers: ['Android >= 4.0', 'iOS >= 8'],
        },
        // 把 px 转成 rem
        'postcss-pxtorem': {
            // 转换的根元素基准值，正常情况按照自己设计稿来
            // 根据 iphone6-7-8宽度 375px来设置 基准值
            rootValue: 37.5,
            // 需要转换的属性--*表示所有属性
            propList: ['*'],
        },
    },
};