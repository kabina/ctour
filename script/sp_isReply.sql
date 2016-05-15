CREATE DEFINER=`root`@`192.168.0.142` PROCEDURE `sp_isReply`(
  IN ictour_seq INT,
  IN ireply_seq INT,
  IN irreply_seq INT,
  IN ireply_text VARCHAR(4000),
  IN iuser_id VARCHAR(500),
  OUT o_val INT(11)
)
BEGIN
DECLARE vseq INT ;

IF exists (select reply_seq from CTOUR.ctour_reply where ctour_seq = ictour_seq and reply_seq = ireply_seq)
Then
  update CTOUR.ctour_reply set reply_text = ireply_text, updt_dt = now() where ctour_seq=ictour_seq and reply_seq = ireply_seq;
  SET o_val  = ireply_seq;
else
	if not exists(select reply_seq  from CTOUR.ctour_reply where ctour_seq = ictour_seq)
    then
		set vseq = 1;
	else
    	select max(reply_seq)+1 into vseq from CTOUR.ctour_reply where ctour_seq = ictour_seq;
    end if;

	SET o_val = vseq;
    
    insert into CTOUR.ctour_reply(ctour_seq, reply_seq, rreply_seq, reply_text, user_id, regr_dt) 
    values(ictour_seq, vseq, irreply_seq, ireply_text, iuser_id, now());
END IF;

SELECT @o_val;

END