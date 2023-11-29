const Database = require("../../db");
const APIException = require("../../errors/api_exception");
const InvestmentsValidator = require('./investments.validator');
const InvestmentsService = require('./investments.service');
const InvestmentsDao = require('./investments.dao');


InvestmentsController = {
    createInvestmentsData: async (req, res, next) => {
        try {
            const bodyErrors = InvestmentsValidator.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                console.log(bodyErrors);
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const body = InvestmentsService.calculateFinal(req.body);
            const db = await Database.getDb();
            const record = await InvestmentsDao.createInvestmentsData(db, body);
            console.log("Good to send 200");
            res.status(201).send(record);
        } catch(e) {
            next(e);
        }
    },
};

module.exports = InvestmentsController;