var express = require('express');
var { createPool } = require('../src/service/dbService');
var { port } = require('../src/config/config');
var { getPrizeId, getPrizeList, addPrizes, setPrizeSetting, addPrizeSpecialSetting, deletePrizeSpecialSetting } = require('../src/service/tool');

var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var pool = createPool();


/**  设置特定抽奖数据 */
app.post('/addPrizeSpecialSetting', function(req, res, next) {
    // const {params} = req.body;
    const params = [
        {telephone: '18706753477', wx: '1111', prize_setting_id: 1},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 2},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 3},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 4},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 5},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 6},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 7},
        {telephone: '18706753477', wx: '1111', prize_setting_id: 8}
    ];
    addPrizeSpecialSetting(pool, params, (_res) => {
        res.send({});
    });
});


/** 抽奖初始化设置 */
app.post('/setPrizeSetting', function(req, res, next) {
    const _params = { '1': 8, '2': 18, '3': 28, '4': 128, '5': 128, '6': 48, '7': 14, '8': 14};
    setPrizeSetting(pool, _params, (_res) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});