const monthlyDao = require("./monthly.dao");
const Database = require("../../db");
const MonthlyService = require("./monthly.service");
const APIException = require("../../errors/api_exception");
const DocumentManager = require("../../utils/document-manager");
const MonthlyValidator = require("../monthly/monthly.validator");
const XL = require('excel4node');


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
    },
    getMonthlyDataById: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const id = parseInt(await req.params['id']);
            const record = await MonthlyService.getMonthlyDataById(db, id);
            const result = MonthlyService.convertMonthlyDbToJson(record);
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getAllMonthlyData: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            console.log(filter);
            const records = await MonthlyService.getAllData(db, filter);
            const result = records.map(r => MonthlyService.convertMonthlyDbToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getAllMonthlyDataAsSpreadsheet: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const records = await MonthlyService.getAllData(db);
            const sheetData = MonthlyService.convertMonthlyDbToSheet(records);
            const financeWorkbook = await DocumentManager.CreateSpreadsheet('Finances', MonthlyValidator.createColumns, sheetData);
            financeWorkbook.write('AllFinanceData.xlsx', res);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = MonthlyController;