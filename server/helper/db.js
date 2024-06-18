import * as mariadb from "mariadb";

export default class dbHelper {
    async getUnfilteredWorkerCost(whereQuery) {
        let dbConn
        try {
            dbConn = mariadb.createPool({
                host: process.env["DATABASE_HOST"],
                user: process.env["DATABASE_USER"],
                password: process.env["DATABASE_PASSWORD"],
                database: process.env["DATABASE_NAME"]
            })

            // BUILD an in array like before than use that

            let query = `
                SELECT
                    worker.username AS name,
                    worker.id AS worker_ID,
                    ROUND((worker.hourly_wage * (SUM(logged_time.time_seconds) / 3600)), 2) AS worker_total
                FROM
                    limble.workers AS worker
                INNER JOIN
                    limble.logged_time AS logged_time
                ON
                    worker.id = logged_time.worker_id
                ${whereQuery}
                GROUP BY
                    worker.id;
                `

            let dbResp = await dbConn.query(query)
            if (dbResp.length < 1) {
                return "no results found with the given filter"
            }
            return dbResp
        } catch(error) {
            console.log("We had an error:", error)
            res.json(error)
        } finally {
            if (dbConn) dbConn.end();
        }
    }

    async getFilteredWorkerCost(whereClause) {
        let dbConn
        try {
            dbConn = mariadb.createPool({
                host: process.env["DATABASE_HOST"],
                user: process.env["DATABASE_USER"],
                password: process.env["DATABASE_PASSWORD"],
                database: process.env["DATABASE_NAME"]
            })

            // BUILD an in array like before than use that

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
            console.log("We had an error:", error)
            res.json(error)
        } finally {
            if (dbConn) dbConn.end();
        }
    }
}