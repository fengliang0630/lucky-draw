var { query } = require('./dbService');
const { v4: uuidv4 } = require('uuid');

// 生成uuid作为兑奖标识
function getUuid() {
    return uuidv4(); 
}

// 包含最小 不包含最大
function randomRange(_min, _max) { 
    return Math.floor(Math.random() * (_max - _min)) + _min;
}

// 处理sql查询的结果集
function parseResults(_results) {
    var dataString = JSON.stringify(_results);
    var data = JSON.parse(dataString);
    return data;
}

/** 抽奖按钮 获取奖品id */
function getPrizeId(_pool, _params, _callBack) {
    const {telephone, wx} = _params;
    const sql = 'select * from prize_special_setting where status = ?';
    // 查询是否有匹配的定制化奖项数据
    query(_pool, sql, ['0'], (err, results) => {
        const prizeSpecialSettingList = parseResults(results);
        if (prizeSpecialSettingList.length > 0) {
            hasSpecialData(_pool, prizeSpecialSettingList, telephone, wx);
        } else {
            noHasSpecialData(_pool, (_prizeSettingId) => {
                updatePrizeSettingStatus(_pool, _prizeSettingId);
                addPrizeHistory(_pool, _prizeSettingId, telephone, wx);
            });
        }
        _callBack(1);
    });
}

// 定制化奖品表有数据
function hasSpecialData(_pool, _prizeSpecialSettingList, _telephone, _wx) {
    const one = _prizeSpecialSettingList.find((item) => {
        return (item.telephone === _telephone || item.wx === _wx);
    });
    console.log(_prizeSpecialSettingList);
    if (!one) {
        // 匹配到了数据

    } else {
        // 没有匹配到数据
        

    }
}

// 定制化奖品表没有数据
function noHasSpecialData(_pool, _callBack) {
    const sql = 'select * from prize_setting as p where p.status=?';
    query(_pool, sql, ['1'], (err, results) => {
        const prizeSettingList = parseResults(results);
        const randomNum = randomRange(0, prizeSettingList.length);
        const prizeSetting = prizeSettingList[randomNum];
        _callBack(prizeSetting.id);
    });
}

/** 修改奖品设置表状态 */
function updatePrizeSettingStatus(_pool, _prizeSettingId) {
    const sql = 'UPDATE prize_setting AS p SET p.status = ?, a.update_time = ? WHERE p.id = ?';
    query(_pool, sql, ['0', new Date(), _prizeSettingId]);
}

/** 添加奖品记录历史表 */
function addPrizeHistory(_pool, _prizeSettingId, _telephone, _wx) {
    const sql = `
    insert into 
        prize_history(random_id, telephone, wx, status, prize_setting_id, create_time) 
        values (?, ?, ?, ?, ?, ?)
    `;
    query(_pool, sql, [getUuid(), _telephone, _wx, '0', _prizeSettingId, new Date()]);
}

/** 删除定制奖品数据 */
function deletePrizeSpecialSetting(_pool, _params, _callBack) {
    const sql = 'delete from prize_special_setting where id = ?';
    query(_pool, sql, [_params], (err, results) => {
        _callBack(results);
    });
}

/** 添加定制奖品数据 */
function addPrizeSpecialSetting(_pool, _params, _callBack) {
    const sql = 'insert into prize_special_setting(telephone, wx, prize_setting_id, status, create_time) values ?';
    const params = [];
    for (var i = 0; i < _params.length; i++) {
        params.push([_params[i].telephone, _params[i].wx, _params[i].prize_setting_id, '0', new Date()]);
    }
    query(_pool, sql, [params], (err, results) => {
        _callBack(results);
    });
}

/** 抽奖初始化设置 */
function setPrizeSetting(_pool, _params, _callBack) {
    const sql = 'insert into prize_setting(status,prize_id) values ?';
    const params = [];

    for (var i = 0; i < Object.keys(_params).length; i++) {
        for (var j = 0; j < Object.values(_params)[i]; j++) {
            params.push(['1', Object.keys(_params)[i]]);
        }
    }
    query(_pool, sql, [params], (err, results) => {
        _callBack(results);
    });
}

/** 查询奖品数据 */
function getPrizeList(_pool, _callBack) {
    query(_pool, 'select * from prize', null, (err, results) => {
        _callBack(results);
    });
}

/** 添加奖品 */
function addPrizes(_pool, _params, _callBack) {
    const sql = 'insert into prize(label,description) values ?';
    const params = [[
        Object.values(_params)
    ]];

    query(_pool, sql, params, (err, results) => {
        if (!err) {
            _callBack({retCode: '0'});
        } else {
            _callBack({retCode: '1', msg: err});
        }
        
    });
}

module.exports = { getUuid, getPrizeId, getPrizeList, addPrizes, setPrizeSetting, addPrizeSpecialSetting, deletePrizeSpecialSetting };