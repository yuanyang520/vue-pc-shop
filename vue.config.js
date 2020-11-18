module.exports={
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://liufusong.top:8083',// 要跨域的域名
        changeOrigin: true, // 是否开启跨域
      }
    }
  }
}