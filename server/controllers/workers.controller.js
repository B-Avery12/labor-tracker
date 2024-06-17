export default class workerController {
    async getWorkerCost(req, res) {
        const cost = "This is the cost endpoint";
        res.json({ resp: cost});
    };    
}