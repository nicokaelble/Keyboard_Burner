DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS testresult;


CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE testresult(
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  testdate VARCHAR NOT NULL,
  userId INTEGER,
  characters INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  accuracy DOUBLE NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id)
);