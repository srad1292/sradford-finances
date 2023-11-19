const monthlyDao = require("./monthly.dao");
const Database = require("../../db");
const MonthlyService = require("./monthly.service");
const APIException = require("../../errors/api_exception");

MonthlyController = {
    createMonthlyData: async (req, res, next) => {
        try {
            console.log("In createMonthlyData");
            const bodyErrors = MonthlyService.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                console.log(bodyErrors);
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            console.log("Past validation");
            const db = await Database.getDb();
            const record = await monthlyDao.createMonthlyData(db, req.body);
            console.log("Good to send 200");
            res.status(201).send(record);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = MonthlyController;