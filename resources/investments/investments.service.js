const InvestmentsDao = require('./investments.dao');
const InvestmentsValidator = require('./investments.validator');
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
    getNetContributionsVsGainsByMonth: async(db, filters = {}) => {
        return await InvestmentsDao.getNetContributionsVsGainsByMonth(db, filters);
    },
    getNetContributionsVsGainsByYear: async(db, filters = {}) => {
        return await InvestmentsDao.getNetContributionsVsGainsByYear(db, filters);    
    },
    getNetContributionsByMonth: async(db, filters = {}) => {
        return await InvestmentsDao.getNetContributionsByMonth(db, filters);
    },
    getNetContributionsByYear: async(db, filters = {}) => {
        return await InvestmentsDao.getNetContributionsByYear(db, filters);
    },
    getGainsByMonth: async(db, filters = {}) => {
        return await InvestmentsDao.getGainsByMonth(db, filters);
    },
    getGainsByYear: async(db, filters = {}) => {
        return await InvestmentsDao.getGainsByYear(db, filters);
    },
    getGrowthByMonth: async(db, filters = {}) => {
        return await InvestmentsDao.getGrowthByMonth(db, filters);
    },
    getGrowthByYear: async(db, filters = {}) => {
        return await InvestmentsDao.getGrowthByYear(db, filters);
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
    bulkCalculateFinal: (body) => {
        return body.map(record => InvestmentsService.calculateFinal(record));
    },
    combineFirms: (body) => {
        const camelInitial = Convert.snakeToCamel(COLUMNS.Initial);
        const camelContributions = Convert.snakeToCamel(COLUMNS.Contributions);
        const camelGains = Convert.snakeToCamel(COLUMNS.Gains);
        const camelWithdrawals = Convert.snakeToCamel(COLUMNS.Withdrawals);
        let result = {
            [camelInitial]: 0,
            [camelContributions]: 0,
            [camelGains]: 0,
            [camelWithdrawals]: 0
        };
        body.forEach(firm => {
            result[Convert.snakeToCamel(COLUMNS.RecordDate)] = firm[Convert.snakeToCamel(COLUMNS.RecordDate)];
            result[camelInitial] += Money.moneyToCents(firm[camelInitial]);
            result[camelContributions] += Money.moneyToCents(firm[camelContributions]);
            result[camelGains] += Money.moneyToCents(firm[camelGains]);
            result[camelWithdrawals] += Money.moneyToCents(firm[camelWithdrawals]);
        });
        
        result[camelInitial] = Money.centsToMoney(result[camelInitial]);
        result[camelContributions] = Money.centsToMoney(result[camelContributions]);
        result[camelGains] = Money.centsToMoney(result[camelGains]);
        result[camelWithdrawals] = Money.centsToMoney(result[camelWithdrawals]);
        return result;
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
    },
    convertToMonthlySheet: (data) => {
        return data.map(row => {
            let data = [];
            InvestmentsValidator.getCreateColumns().forEach(column => {
                if(column === COLUMNS.RecordDate) {
                    data.push({type: 'String', value: row[column]});
                } else {
                    data.push({type: 'Number', value: Money.centsToMoney(row[column])});
                }
            });
            return data;
        });
    },
    convertToYearlySheet: (data) => {
        return data.map(row => {
            let data = [];
            InvestmentsValidator.getYearlyColumns().forEach(column => {
                if(column === YearColumns.Year) {
                    data.push({type: 'String', value: row[column]});
                } else {
                    data.push({type: 'Number', value: Money.centsToMoney(row[column])});
                }
            });
            return data;
        });
    },
    
}

module.exports = InvestmentsService;
