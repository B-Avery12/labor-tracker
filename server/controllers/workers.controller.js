import * as mariadb from "mariadb";
import dbHelper from "../helper/db.js"
import { where } from "sequelize";

const db = new dbHelper();

export default class workerController {
    async getWorkerCost(req, res) {
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
                        isFirstCondition = false
                        whereCondition += " AND "
                    }
                    whereCondition += locationWhereCondition
                }
                if (isCompleteCondition !== ``) {
                    if (!isFirstCondition) {
                        isFirstCondition = false
                        whereCondition += " AND "
                    }
                    whereCondition += isCompleteCondition
                }
            }

            let resp = ''

            if (isCompleteCondition !== `` || locationWhereCondition !== ``) {
                resp = await db.getFilteredWorkerCost(whereCondition)
            } else {
                resp = await db.getUnfilteredWorkerCost(whereCondition)
            }

            // Let's just return this now to see if it works haha
            console.log(resp)
            res.json(resp);
    };
}