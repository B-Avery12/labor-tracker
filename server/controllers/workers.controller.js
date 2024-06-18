import dbHelper from "../helper/db.js"

const db = new dbHelper();

export default class workerController {
    async getWorkerCost(req, res) {
            let whereCondition = await db.buildWhereClause(req)

            let resp = await db.getWorkerCost(whereCondition)

            console.log(resp)
            res.json(resp);
    };
}