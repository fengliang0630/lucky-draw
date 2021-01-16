var express = require('express');
var { createPool } = require('./service/dbService');
var { port } = require('./config/config');
var { getPrizeId, getPrizeList, addPrizes, setPrizeSetting, addPrizeSpecialSetting, deletePrizeSpecialSetting } = require('./service/tool');

var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var pool = createPool();

/** 获取中将号码 */
app.post('/getPrizeId', function(req, res, next) {
    const {telephone, wx} = req.body;
    getPrizeId(pool, {telephone, wx}, () => {
        res.send({});
    });
});

/**  删除特定数据 */
app.post('/deletePrizeSpecialSetting', function(req, res, next) {
    // const {params} = req.body;
    const params = 4;
    deletePrizeSpecialSetting(pool, params, (_res) => {
        res.send({});
    });
});

/**  设置特定抽奖数据 */
app.post('/addPrizeSpecialSetting', function(req, res, next) {
    const {params} = req.body;
    addPrizeSpecialSetting(pool, params, (_res) => {
        res.send({});
    });
});


/** 抽奖初始化设置 */
app.post('/setPrizeSetting', function(req, res, next) {
    const {params} = req.body;
    setPrizeSetting(pool, params, (_res) => {
        res.send({});
    });
});

/** 添加奖品信息 */
app.post('/addPrizes', function(req, res, next) {
    const { label, description } = req.body;
    addPrizes(pool, {label, description}, (_res) => {
        res.send(_res);
    });
});

/** 获取奖品信息 */
app.post('/getPrizeList', function(req, res, next) {
    getPrizeList(pool, (_prizeList) => {
        res.send({prizeList: _prizeList});
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});