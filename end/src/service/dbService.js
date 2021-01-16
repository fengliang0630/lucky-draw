var mysql = require('mysql');
var config = require('../config/config');

// 初始化数据库配置
function createPool() {
    return mysql.createPool(config.dbConfig);
}

// 查询
function query(_pool, _sql, _params, _callBack) {
    _pool.getConnection(function(err1, conn){
        conn.query(_sql, _params || {},function(err2, data){
            conn.release(); //释放连接
            !!_callBack && _callBack(err2, data);
        })
    })
}

module.exports = { createPool, query };