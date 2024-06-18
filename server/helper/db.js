import * as mariadb from "mariadb";

export default class dbHelper {
    async buildWhereClause(req) {
        // Parse body and create where filters :D
        let workerIDs = req.body.worker_ids;
        let locationIDs = req.body.location_ids;
        let isComplete = req.body.isComplete;
        let whereCondition = ``;
        let workerWhereCondition = ``;
        
        // Build our WHERE filter for worker IDs
        if (Array.isArray(workerIDs) && workerIDs.length > 0) {
            if (workerIDs.length == 1) {
                workerWhereCondition = `worker.id = ${workerIDs[0]}`
            } else {
                let joinedWorkerIDs = workerIDs.join(", ")
                workerWhereCondition = `worker.id IN (${joinedWorkerIDs})`
            }
        }
        let locationWhereCondition = ``;
        // Build our WHERE filter for location IDs
        if (Array.isArray(locationIDs) && locationIDs.length > 0) {
            if (locationIDs.length == 1) {
                locationWhereCondition = `location.id = ${locationIDs[0]}`
            } else {
                let joinedLocationIDs = locationIDs.join(", ")
                locationWhereCondition = `location.id IN (${joinedLocationIDs})`
            }
        }
        let isCompleteCondition = ``;
        // Build our WHERE filter for isComplete
        if (isComplete == "complete") {
            isCompleteCondition = `task.is_complete = TRUE`
        } else if (isComplete == "incomplete") {
            isCompleteCondition = `task.is_complete = FALSE`
        }

        if (workerWhereCondition !== `` || locationWhereCondition !== `` || isCompleteCondition !== ``) {
            // One of our where conditions is not empty
            let isFirstCondition = true
            whereCondition += "WHERE "
            if (workerWhereCondition !== ``) {
                    isFirstCondition = false
                    whereCondition += workerWhereCondition;
            }
            if (locationWhereCondition !== ``) {
                if (!isFirstCondition) {
                    whereCondition += " AND "
                }
                isFirstCondition = false
                whereCondition += locationWhereCondition
            }
            if (isCompleteCondition !== ``) {
                console.log(isFirstCondition)
                if (!isFirstCondition) {
                    isFirstCondition = false
                    whereCondition += " AND "
                }
                whereCondition += isCompleteCondition
            }
        }

        return whereCondition
    }

    async getWorkerCost(whereClause) {
        let dbConn
        try {
            dbConn = mariadb.createPool({
                host: process.env["DATABASE_HOST"],
                user: process.env["DATABASE_USER"],
                password: process.env["DATABASE_PASSWORD"],
                database: process.env["DATABASE_NAME"]
            })

            let query = `
                SELECT
                    worker.username AS name,
                    worker.id AS worker_ID,
                    ROUND((worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600)), 2) AS worker_total
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
                ${whereClause}
                GROUP BY
                    worker.id;
                `
            
            let dbResp = await dbConn.query(query)
            if (dbResp.length < 1) {
                return "no results found with the given filter"
            }
            return dbResp
        } catch(error) {
            return error
        } finally {
            if (dbConn) dbConn.end();
        }
    }

    async getLocationCost(whereClause) {
        let dbConn
        try {
            dbConn = mariadb.createPool({
                host: process.env["DATABASE_HOST"],
                user: process.env["DATABASE_USER"],
                password: process.env["DATABASE_PASSWORD"],
                database: process.env["DATABASE_NAME"]
            })

            let query = `
                SELECT
                    subquery.locationName,
                    loc_id,
                    ROUND(SUM(task_total), 2) AS total_cost
                FROM
                    (
                        SELECT
                            location.name AS locationName,
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
                        ${whereClause}
                        GROUP BY
                            worker.id, location.id
                    ) AS subquery
                GROUP BY
                    subquery.loc_id;
                `
            
            let dbResp = await dbConn.query(query)
            if (dbResp.length < 1) {
                return "no results found with the given filter"
            }
            return dbResp
        } catch(error) {
            return error
        } finally {
            if (dbConn) dbConn.end();
        }
    }
}