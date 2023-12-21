const Database = require("../../db");
const EarningsAndExpensesDao = require("./earnings-and-expenses.dao");
const EarningsAndExpensesService = require("./earnings-and-expenses.service");
const EarningsAndExpensesValidator = require("./earnings-and-expenses.validator");
const APIException = require("../../errors/api_exception");
const DocumentManager = require("../../utils/document-manager");
const XL = require('excel4node');


EarningsAndExpensesController = {
    createMonthlyData: async (req, res, next) => {
        try {
            const bodyErrors = EarningsAndExpensesValidator.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                console.log(bodyErrors);
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const db = await Database.getDb();
            const record = await EarningsAndExpensesDao.createMonthlyData(db, req.body);
            console.log("Good to send 200");
            res.status(201).send(record);
        } catch(e) {
            next(e);
        }
    },
    updateMonthlyData: async (req, res, next) => {
        try {
            const bodyErrors = EarningsAndExpensesValidator.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                console.log(bodyErrors);
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const db = await Database.getDb();
            const record = await EarningsAndExpensesDao.updateMonthlyData(db, req.body);
            console.log("Good to send 200");
            res.status(200).send(record);
        } catch(e) {
            next(e);
        }
    },
    getMonthlyDataById: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const id = parseInt(await req.params['id']);
            const record = await EarningsAndExpensesService.getMonthlyDataById(db, id);
            const result = EarningsAndExpensesService.convertMonthlyDbToJson(record);
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
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const result = records.map(r => EarningsAndExpensesService.convertMonthlyDbToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getByYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getByYear(db, filter);
            const result = records.map(r => EarningsAndExpensesService.convertYearRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getExpensesByYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getExpensesByYear(db, filter);
            const result = records.map(r => EarningsAndExpensesService.convertYearRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getEarningsByYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getEarningsByYear(db, filter);
            const result = records.map(r => EarningsAndExpensesService.convertYearRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getAllMonthlyDataAsSpreadsheet: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const records = await EarningsAndExpensesService.getAllData(db);
            const sheetData = EarningsAndExpensesService.convertMonthlyDbToSheet(records);
            const financeWorkbook = await DocumentManager.CreateSpreadsheet('Finances', EarningsAndExpensesValidator.getCreateColumns(), sheetData);
            financeWorkbook.write('AllFinanceData.xlsx', res);
        } catch(e) {
            next(e);
        }
    },
    deleteMonthlyRecord: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const result = await EarningsAndExpensesService.deleteMonthlyRecord(db, req.params['id']);
            res.status(200).send({status: 'success'});
        } catch(e) {
            next(e);
        }
    }
}

module.exports = EarningsAndExpensesController;