var express = require('express');
var { createPool } = require('./service/dbService');
var { port } = require('./config/config');
var { getPrizeId, getPrizeList, setPrizeSetting, getPrizeHistory, getPrizeHistoryCount, payLuck,
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
    const {params} = req.body;
    getPrizeHistory(pool, params, (prizeHistoryList) => {
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
app.get('/addPrizeSpecialSetting', function(req, res, next) {
    const {params} = req.body;
    addPrizeSpecialSetting(pool, params, (_res) => {
        res.send({});
    });
});

/** 抽奖初始化设置 */
app.get('/setPrizeSetting', function(req, res, next) {
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

/** 兑奖 */
app.post('/payLuck', function(req, res, next) {
    const {params} = req.body;
    payLuck(pool, params.id, (_prizeList) => {
        res.send({prizeList: _prizeList});
    });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});