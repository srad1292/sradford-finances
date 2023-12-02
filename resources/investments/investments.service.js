const InvestmentsDao = require('./investments.dao');
const Money = require('../../utils/money');
const Convert = require('../../utils/snake_and_camel');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;
const YearColumns = DatabaseColumns.InvestmentsYearColumns;

const InvestmentsService = {
    // Endpoint Calls
    getRecordById: async(db, id) => {
        return await InvestmentsDao.getRecordById(db, id);
    },
    getAllRecords: async(db, filter) => {
        const records = await InvestmentsDao.getAllRecords(db, filter);
        return records;
    },
    getByYear: async(db, filter) => {
        const records = await InvestmentsDao.getByYear(db, filter);
        return records;
    },
    updateRecord: async(db, body) => {
        return await InvestmentsDao.updateRecord(db, body);
    },
    deleteRecord: async (db, id) => {
        return await InvestmentsDao.deleteRecord(db, id);
    },
    getNetContributionsByMonth: async(db, filters = {}) => {
        const records = await InvestmentsDao.getNetContributionsByMonth(db, filters);
        return records.map(r => InvestmentsService.convertRecordToJson(r));
    },
    getNetContributionsByYear: async(db, filters = {}) => {
        const records = await InvestmentsDao.getNetContributionsByYear(db, filters);
        return records.map(r => InvestmentsService.convertRecordToJson(r));
    },
    getGainsByMonth: async(db, filters = {}) => {
        const records = await InvestmentsDao.getGainsByMonth(db, filters);
        return records.map(r => InvestmentsService.convertRecordToJson(r));
    },
    getGrowthByMonth: async(db, filters = {}) => {
        const records = await InvestmentsDao.getGrowthByMonth(db, filters);
        return records.map(r => InvestmentsService.convertRecordToJson(r));
    },
    // Helpers
    calculateFinal: (body) => {
        const initial = Money.moneyToCents(body[COLUMNS.Initial]);
        const contributions = Money.moneyToCents(body[COLUMNS.Contributions]);
        const gains = Money.moneyToCents(body[COLUMNS.Gains]);
        const withdrawals = Money.moneyToCents(body[COLUMNS.Withdrawals]);
        const final = Money.centsToMoney(initial+contributions+gains-withdrawals);
        body[COLUMNS.Final] = final;
        return body;
    },
    convertRecordToJson: (data) => {
        let rowAsJs = {};
        Object.entries(data).forEach(entry => {
            let [key, value] = entry;
            if(key === YearColumns.Year || key === COLUMNS.RecordDate || key === COLUMNS.Id) {
                rowAsJs[Convert.snakeToCamel(key)] = value;
            } else {
                rowAsJs[Convert.snakeToCamel(key)] = Money.centsToMoney(value);
            }
        });
        return rowAsJs;
    },
    convertYearRecordToJson: (data) => {
        let rowAsJs = {};
        Object.entries(data).forEach(entry => {
            let [key, value] = entry;
            if(key === YearColumns.Year) {
                rowAsJs[Convert.snakeToCamel(key)] = value;
            } else {
                rowAsJs[Convert.snakeToCamel(key)] = Money.centsToMoney(value);
            }
        });
        return rowAsJs;
    }
    
}

module.exports = InvestmentsService;
