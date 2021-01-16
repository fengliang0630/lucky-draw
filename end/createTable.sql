CREATE TABLE prize_history(
    id                  int          UNIQUE KEY AUTO_INCREMENT not null    comment '标识',
    random_id           char(36)    not null               comment '兑奖标识',
    telephone           char(11)                           comment '手机号',
    wx                  char(100)                          comment '微信号',
    status              char(1)      not null              comment '奖品状态(0: 未兑奖, 1:已兑奖)',
    prize_setting_id    int          not null              comment '奖品设置id',
    create_time         char(50)     not null              comment '创建时间',
    update_time         char(50)                           comment '更新时间',
    primary key (id)
) COMMENT= '中奖历史记录表';

CREATE TABLE prize(
    id           INT          UNIQUE KEY AUTO_INCREMENT NOT NULL    COMMENT '标识',
    label        CHAR(10)     NOT NULL               COMMENT '奖品label',
    description  CHAR(200)    NOT NULL               COMMENT '奖品描述信息',
    PRIMARY KEY (id)
) COMMENT= '奖品';

CREATE TABLE prize_setting(
    id             int          UNIQUE KEY AUTO_INCREMENT not null    comment '标识',
    status         char(5)    not null               comment '状态（0: 已抽中  1： 未抽中）',
    prize_id       int          not null               comment '奖品id',
    update_time         char(50)                           comment '更新时间',
    primary key (id)
) COMMENT= '抽奖设置';


CREATE TABLE prize_special_setting(
    id                  int          UNIQUE KEY AUTO_INCREMENT not null    comment '标识',
    telephone           char(11)                           comment '手机号',
    wx                  char(100)                          comment '微信号',
    prize_setting_id    int          not null              comment '奖品设置id',
    status              char(5)    not null               comment '状态（0: 未匹配  1： 已匹配）',
    create_time         char(50)     not null              comment '创建时间',
    update_time         char(50)                           comment '更新时间',
    primary key (id)
) COMMENT= '中奖特定表';