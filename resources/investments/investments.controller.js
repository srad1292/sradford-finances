const InvestmentsValidator = require('./investments.validator');
const InvestmentsService = require('./investments.service');
const InvestmentsDao = require('./investments.dao');
const Database = require("../../db");
const APIException = require("../../errors/api_exception");
const DocumentManager = require("../../utils/document-manager");
const XL = require('excel4node');

InvestmentsController = {
    createInvestmentsData: async (req, res, next) => {
        try {
            const bodyErrors = InvestmentsValidator.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const body = InvestmentsService.calculateFinal(req.body);
            const db = await Database.getDb();
            const record = await InvestmentsDao.createInvestmentsData(db, body);
            res.status(201).send(record);
        } catch(e) {
            next(e);
        }
    },
    bulkCreateInvestmentsData: async (req, res, next) => {
        try {
            const bodyErrors = InvestmentsValidator.validateBulkCreateData(req.body);
            if(bodyErrors.length > 0) {
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const body = InvestmentsService.bulkCalculateFinal(req.body);
            const db = await Database.getDb();
            const result = await InvestmentsDao.bulkCreateInvestmentsData(db, body);
            res.status(201).send(result);
        } catch(e) {
            next(e);
        }
    },
    createInvestmentsDataByFirm: async (req, res, next) => {
        try {
            const bodyErrors = InvestmentsValidator.validateCreateByFirm(req.body);
            if(bodyErrors.length > 0) {
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const combined = InvestmentsService.combineFirms(req.body); 
            const body = InvestmentsService.calculateFinal(combined);
            const db = await Database.getDb();
            const record = await InvestmentsDao.createInvestmentsData(db, body);
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
            const records = await InvestmentsService.getAllRecords(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
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
            const records = await InvestmentsService.getByYear(db, filter);
            const result = records.map(r => InvestmentsService.convertYearRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    updateRecord: async (req, res, next) => {
        try {
            const bodyErrors = InvestmentsValidator.validateCreateData(req.body);
            if(bodyErrors.length > 0) {
                throw new APIException("Invalid request body", bodyErrors, 400);
            }
            const body = InvestmentsService.calculateFinal(req.body);
            const db = await Database.getDb();
            const record = await InvestmentsService.updateRecord(db, body);
            res.status(200).send(record);
        } catch(e) {
            next(e);
        }
    },
    deleteRecord: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const result = await InvestmentsService.deleteRecord(db, req.params['id']);
            res.status(200).send({status: 'success'});
        } catch(e) {
            next(e);
        }
    },
    // Spreadsheet Endpoints
    getMonthlySpreadsheet: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await InvestmentsService.getAllRecords(db, filter);
            const sheetData = InvestmentsService.convertToMonthlySheet(records);
            // res.status(200).send(sheetData);
            const financeWorkbook = await DocumentManager.CreateSpreadsheet('Monthly-Investments', InvestmentsValidator.getMonthlyDocumentColumns(), sheetData);
            financeWorkbook.write('Monthly-Investments.xlsx', res);
        } catch(e) {
            next(e);
        }
    },
    getYearlySpreadsheet: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to,
            }
            const records = await InvestmentsService.getByYear(db, filter);
            const sheetData = InvestmentsService.convertToYearlySheet(records);
            const financeWorkbook = await DocumentManager.CreateSpreadsheet('Yearly-Investments', InvestmentsValidator.getYearlyDocumentColumns(), sheetData);
            financeWorkbook.write('Yearly-Investments.xlsx', res);
        } catch(e) {
            next(e);
        }
    },
    // Analytics Data Endpoints
    getNetContributionsVsGainsByMonth: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await InvestmentsService.getNetContributionsVsGainsByMonth(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getNetContributionsVsGainsByYear: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await InvestmentsService.getNetContributionsVsGainsByYear(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));

            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getNetContributionsByMonth: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await InvestmentsService.getNetContributionsByMonth(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getNetContributionsByYear: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await InvestmentsService.getNetContributionsByYear(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getGainsByMonth: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await InvestmentsService.getGainsByMonth(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getGainsByYear: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await InvestmentsService.getGainsByYear(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getGrowthByMonth: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await InvestmentsService.getGrowthByMonth(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));

            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
    getGrowthByYear: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await InvestmentsService.getGrowthByYear(db, filter);
            const result = records.map(r => InvestmentsService.convertRecordToJson(r));
            res.status(200).send(result);
        } catch(e) {
            next(e);
        }
    },
};

module.exports = InvestmentsController;