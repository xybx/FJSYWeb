/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: ssq
 * @LastEditTime: 2022-10-23 18:06:55
 * @FilePath: \fjsy-web\vue.config.js
 * @Description: 请填写描述
 */
module.exports = {
    publicPath: '/manage/',
    devServer: {
        open: true,
        port: 8093
    },
    runtimeCompiler: true,
    productionSourceMap: false,
    css: {
        extract: false,
        sourceMap: false,
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-px-to-viewport')({
                        unitToConvert: 'px',
                        viewportWidth: 1920,
                        unitPrecision: 3,
                        propList: ['*'],
                        viewportUnit: 'vw',
                        fontViewportUnit: 'vw',
                        selectorBlackList: [],
                        minPixelValue: 1,
                        mediaQuery: false,
                        replace: true
                    })
                ]
            }
        }
    }
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
};
