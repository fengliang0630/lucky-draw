# 中奖后台

## 表结构

prize
/**
    id      奖品lable       奖品描述信息  
    1       一等奖          价值388元私人定制阿胶糕一份         
    2       二等奖          购买私人定制阿胶糕立减188
    。。。。。
*/
prize_setting
/*
初始化奖项的时候  入库数据  一共100个奖  就100条数据
*/

drop table prize_history;
drop table prize;
drop table prize_setting;
drop table prize_special_setting;

## 执行顺序  

打开mysql commandLine 
root/root  3306
CREATE DATABASE luckDraw

## 逻辑顺序

1. 初始化奖品表信息
2. 初始化抽奖设置表信息
3. 点击抽奖时

    prize_special_setting是否有数据
        有
            匹配中
                prize_setting_id = prize_special_setting.prize_setting_id;
            未匹配中
                list = 查询prize_setting中未抽中的个数[排除掉 prize_special_setting中的数据]  
                const r = 取一个随机数
                prize_setting_id = list[r].id;
        无
            list = 查询prize_setting中未抽中的个数  
            r = 取一个随机数 
            prize_setting_id = list[r].id;

    根据prize_setting_id  将prize_setting数据状态改为已抽中
    return prize_setting.prize_id
    在prize_history中添加一条中奖历史记录
    

4. 兑奖时 将prize_history的状态改为已兑奖
