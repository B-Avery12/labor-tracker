import dbHelper from "../helper/db.js"

const db = new dbHelper();

export default class locationController {
    async getLocationCost(req, res) {
            let whereCondition = await db.buildWhereClause(req)

            let resp = await db.getLocationCost(whereCondition)

            res.json(resp);
    };
}