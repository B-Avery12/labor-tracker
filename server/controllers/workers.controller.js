import * as mariadb from "mariadb";

export default class workerController {
    async getWorkerCost(req, res) {
        const cost = "This is the cost endpoint";
        res.json({ resp: cost});
    };

    async getWorkerCost(req) {
        let dbConn
        try {
            dbConn = mariadb.createPool({
                host: process.env["DATABASE_HOST"],
                user: process.env["DATABASE_USER"],
                password: process.env["DATABASE_PASSWORD"],
                database: process.env["DATABASE_NAME"]
            })

            // Parse body and create where filters :D
            let workerIDs = req.body.worker_ids;
            let locationIDs = req.body.location_ids;
            let isComplete = req.body.isComplete;
            let whereCondition = ``;
            let workerWhereCondition = ``;
            // Build our WHERE filter for worker IDs
            if (workerIDs.length > 0) {
                if (workerIDs.length == 1) {
                    workerWhereCondition = `worker.id = ${workerIDs[0]}`
                } else {
                    let joinedWorkerIDs = workerIDs.join(", ")
                    workerWhereCondition = `worker.id IN (${joinedWorkerIDsS})`
                }
            }
            let locationWhereCondition = ``;
            // Build our WHERE filter for worker IDs
            if (locationIDs.length > 0) {
                if (locationIDs.length == 1) {
                    locationWhereCondition = `worker.id = ${locationIDs[0]}`
                } else {
                    let joinedLocationIDs = locationIDs.join(", ")
                    locationWhereCondition = `worker.id IN (${joinedLocationIDs})`
                }
            }
            let isCompleteCondition = ``;
            // Build our WHERE filter for isComplete
            if (isComplete == "complete") {
                isCompleteCondition = `task.is_complete = TRUE`
            } else if (isComplete == "incomplete") {
                isCompleteCondition = `task.is_complete = FALSE`
            }

        } catch(error) {

        } finally {
            if (dbConn) dbConn.end();
        }
    };
}