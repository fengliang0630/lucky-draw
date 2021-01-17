import axios from 'axios';

let base = './api';

function pckParams(params) {
    return {
        headers: {'Content-Type': 'application/json'},
        params
    };
}

// 获取奖品列表
export const getPrizeList = () => {
    return axios.post(`${base}/getPrizeList`, null).then(res => res.data); 
};

// 获取获奖历史记录
export const getPrizeHistory = (_params) => {
    return axios.post(`${base}/getPrizeHistory`, pckParams(_params || {})).then(res => res.data); 
};

// 获取此人抽奖次数
export const getPrizeHistoryCount = (telephone) => {
    return axios.post(`${base}/getPrizeHistoryCount`, pckParams({ telephone })).then(res => res.data); 
};

// 获取中奖ID
export const getPrizeId = (telephone, wx) => {
    return axios.post(`${base}/getPrizeId`, pckParams({ telephone, wx })).then(res => res.data); 
};
// 兑奖
export const payLuck = (_id) => {
    const params = {id: _id};
    return axios.post(`${base}/payLuck`,pckParams(params)).then(res => res.data); 
}

/** 初始化设置奖品比例 */
export const setPrizeSetting = () => {
    const params = { '1': 8, '2': 18, '3': 14, '4': 28, '5': 128, '6': 14, '7': 128, '8': 48};
    return axios.post(`${base}/setPrizeSetting`,pckParams(params)).then(res => res.data); 
};

export const addPrizeSpecialSetting = () => {
    const params = [{telephone: '18706753477', wx: '1111', prize_setting_id: 1}]
    return axios.post(`${base}/addPrizeSpecialSetting`,pckParams(params)).then(res => res.data); 
}




