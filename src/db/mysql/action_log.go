package mysql

const actionLogDdl = `
CREATE TABLE IF NOT EXISTS action_logs
(
	id VARCHAR(225) PRIMARY KEY NOT NULL,
	action VARCHAR(40) NOT NULL,
	user_id VARCHAR(225) NOT NULL,
	info VARCHAR(225),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=INNODB;
`
