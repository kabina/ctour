CREATE DEFINER=`root`@`192.168.0.142` PROCEDURE `sp_isTour`(
  IN seq INT,
  IN title VARCHAR(500),
  IN days INT,
  IN start_place VARCHAR(500),
  IN end_place VARCHAR(500),
  IN id VARCHAR(500),
  IN i_open_yn INT,
  IN i_desc VARCHAR(4000),
  OUT o_val INT(11)
)
BEGIN
DECLARE vseq INT ;

IF exists (select ctour_seq from CTOUR.ctour_master where ctour_seq = seq)
Then
  update CTOUR.ctour_master set ctour_title = title, ctour_days = days, ctour_start_place = start_place, ctour_end_place = end_place, open_yn = i_open_yn, ctour_desc = i_desc where ctour_seq=seq;
  SET o_val  = seq;
else
	select max(ifnull(ctour_seq,0))+1 into vseq from CTOUR.ctour_master;
    SET o_val = vseq;
  insert into CTOUR.ctour_master(ctour_seq, ctour_title, ctour_days, ctour_start_place, ctour_end_place, user_id, open_yn, ctour_desc) values(vseq, title, days, start_place, end_place, id, i_open_yn, i_desc);
END IF;

SELECT @o_val;

END