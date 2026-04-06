ALTER TABLE attempt DROP CONSTRAINT IF EXISTS chk_status;
ALTER TABLE attempt DROP COLUMN duration_seconds;
ALTER TABLE attempt DROP COLUMN points;
ALTER TABLE attempt DROP COLUMN score;
ALTER TABLE attempt DROP COLUMN max_score;
ALTER TABLE attempt DROP COLUMN status;
