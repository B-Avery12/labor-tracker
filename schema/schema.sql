CREATE TABLE locations (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=INNODB;

CREATE TABLE tasks (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  is_complete BOOLEAN NOT NULL,
  location_id INT(11) NOT NULL,

  FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE workers (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  hourly_wage DECIMAL(5, 2) NOT NULL
) ENGINE=INNODB;

CREATE TABLE logged_time (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  time_seconds INT(11) NOT NULL,

  task_id INT(11) NOT NULL,
  worker_id INT(11) NOT NULL,

  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=INNODB;

-- Set up some dummy data to test with

INSERT INTO 
  limble.locations (name)
VALUES
  ("Salt Lake"),
  ("Lehi"),
  ("Orem"),
  ("Eagle Mountain");

INSERT INTO
  limble.workers (username, hourly_wage)
VALUES
  ("user 1", 1.00),
  ("user 2", 1.23),
  ("user 3", 2.34),
  ("user 4", 0.01),
  ("user 5", 100.00),
  ("user 6", 0.00);

INSERT INTO 
  limble.tasks (description, is_complete, location_id)
VALUES
  ("Task 1 - Get docker running", FALSE, 1),
  ("Task 2 - Get test DB data", TRUE, 1),
  ("Task 3 - Test DB queries", FALSE, 2),
  ("Task 4 - Write out API paths", TRUE, 2),
  ("Task 5 - Write code", FALSE, 3),
  ("Task 6 - Test code", TRUE, 3),
  ("Task 7 - Submit code", FALSE, 4),
  ("Task 8 - Add an 8th task", TRUE, 4);


INSERT INTO
  limble.logged_time(time_seconds, task_id, worker_id)
VALUES
  (1000000000, 1, 16),
  (3600, 2, 16), -- 1 hour
  (3600, 3, 16), -- 1 hour
  (7200, 5, 20), -- 2 hours
  (10800, 8, 19),
  (1800, 7, 26);
