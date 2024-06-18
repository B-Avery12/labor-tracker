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
  (1000000000, 1, 1),
  (123123, 1 , 1),
  (1231231, 1, 1),
  (3600, 2, 1), -- 1 hour
  (3600, 3, 1), -- 1 hour
  (7200, 5, 5), -- 2 hours
  (3600, 5, 5),
  (10800, 8, 6),
  (1800, 5, 4),
  (3600, 6, 5),
  (86400, 7, 5),
  (86400, 8, 5);


-- Testing queries
-- By worker: Get total cost for worker across all taks and locations. Doesn't care if task finished or not
SELECT
  worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600) AS worker_total
FROM
  limble.workers AS worker
INNER JOIN
  limble.logged_time AS logged_time
ON
  worker.id = logged_time.worker_id
WHERE
  worker.id = 5
GROUP BY
  worker.id;

-- By worker: total cost across all tasks and locations. Where task is complete
SELECT
  worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600) AS task_total,
  task.id,
  worker.id,
  worker.hourly_wage
FROM
  limble.workers AS worker
INNER JOIN 
  limble.logged_time AS logged_time
ON
  worker.id = logged_time.worker_id
INNER JOIN
  limble.tasks AS task
ON
  logged_time.task_id = task.id
WHERE
  task.is_complete = FALSE
  AND worker.id = 5
GROUP BY
  worker.id, task.id;

-- By locastion: the total labor costs for tasks tied to a given location. Return total by task, then need to sum it in node code
SELECT
  location.name,
  location.id,
  worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600) AS task_total,
  worker.id
FROM
  limble.locations AS location
INNER JOIN
  limble.tasks AS task
ON
  location.id = task.location_id
INNER JOIN
  limble.logged_time AS logged_time
ON
  task.id = logged_time.task_id
LEFT JOIN
  limble.workers as worker
ON
  logged_time.worker_id = worker.id
WHERE
  location.id = 3
GROUP BY
  worker.id;

-- NOTES:
-- Completion status can be done on both of them by including `task.is_complete = true` in the where clause
-- Can filter to a slice of ID by using a where IN `WHERE country in ('USA', 'France')

-- TESTING
SELECT
  subquery.locationName,
  subquery.worker_id,
  loc_id,
  SUM(task_total) AS total_cost
FROM
  (
    SELECT
      location.name AS locationName,
      worker.id as worker_ID,
      location.id AS loc_id,
      worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600) AS task_total,
      worker.id
    FROM
      limble.locations AS location
    INNER JOIN
      limble.tasks AS task
    ON
      location.id = task.location_id
    INNER JOIN
      limble.logged_time AS logged_time
    ON
      task.id = logged_time.task_id
    LEFT JOIN
      limble.workers as worker
    ON
      logged_time.worker_id = worker.id
    GROUP BY
      worker.id, location.id
  ) AS subquery
GROUP BY
  subquery.loc_id;


SELECT
  worker.username AS name,
  worker.id AS worker_ID,
  worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600) AS task_total
FROM
  limble.locations AS location
INNER JOIN
  limble.tasks AS task
ON
  location.id = task.location_id
INNER JOIN
  limble.logged_time AS logged_time
ON
  task.id = logged_time.task_id
LEFT JOIN
  limble.workers as worker
ON
  logged_time.worker_id = worker.id
WHERE
  worker.id in (5,6)
  AND task.is_complete = TRUE
  AND location.id = 4
GROUP BY
  worker.id, location.id