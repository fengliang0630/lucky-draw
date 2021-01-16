module.exports = {
    port: 3000,
    dbConfig: {
        host:'127.0.0.1',
        port:3306,
        protocol:'mysql',
        user:'root',
        password:'root',
        database:'luckDraw',
        connectionLimit:100 //最大连接数
    }
};