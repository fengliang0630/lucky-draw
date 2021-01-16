UPDATE prize_setting AS p SET p.status = '1', p.update_time=null;
delete from prize_history;