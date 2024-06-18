import * as mariadb from "mariadb";
import dbHelper from "../helper/db.js"
import { where } from "sequelize";

const db = new dbHelper();

export default class workerController {
    async getWorkerCost(req, res) {
            let whereCondition = await db.buildWhereClause(req)

            let resp = await db.getWorkerCost(whereCondition)

            // Let's just return this now to see if it works haha
            console.log(resp)
            res.json(resp);
    };
}