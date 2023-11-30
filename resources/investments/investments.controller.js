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
    getRecordById: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const id = parseInt(await req.params['id']);
            const record = await InvestmentsService.getRecordById(db, id);
            const result = InvestmentsService.convertRecordToJson(record);
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getAllRecords: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            console.log(filter);
            const records = await InvestmentsService.getAllRecords(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
};

module.exports = InvestmentsController;