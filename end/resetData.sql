UPDATE prize_setting AS p SET p.status = '1', p.update_time=null;
update prize_special_setting as p1 set p1.status='0', p1.update_time=null;
delete from prize_history;