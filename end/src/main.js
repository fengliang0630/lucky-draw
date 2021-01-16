var express = require('express');
var { createPool } = require('./service/dbService');
var { port } = require('./config/config');
var { getPrizeId, getPrizeList, setPrizeSetting, getPrizeHistory, getPrizeHistoryCount,
    addPrizeSpecialSetting, deletePrizeSpecialSetting } = require('./service/tool');

var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var pool = createPool();

/** 获取中将号码 */
app.post('/getPrizeId', function(req, res, next) {
    const {params} = req.body;
    getPrizeId(pool, params, (prizeId, randomId) => {
        res.send({ prizeId, randomId });
    });
});

/** 获取中将历史记录 */
app.post('/getPrizeHistoryCount', function(req, res, next) {
    const {params} = req.body;
    getPrizeHistoryCount(pool, {telephone: params.telephone}, (count) => {
        res.send({ count });
    });
});

/** 获取中将历史记录 */
app.post('/getPrizeHistory', function(req, res, next) {
    getPrizeHistory(pool, {}, (prizeHistoryList) => {
        res.send({ prizeHistoryList });
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

/** 获取奖品信息 */
app.post('/getPrizeList', function(req, res, next) {
    getPrizeList(pool, (_prizeList) => {
        res.send({prizeList: _prizeList});
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});