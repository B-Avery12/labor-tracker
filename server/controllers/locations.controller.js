export default class locationController {
    async getLocationCost(req, res) {
        const cost = "This is the locatio endpoint";
        res.json({ resp: cost});
    };    
}