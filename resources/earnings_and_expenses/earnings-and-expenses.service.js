const EarningsAndExpensesDao = require('./earnings-and-expenses.dao');
const EarningsAndExpensesValidator = require('./earnings-and-expenses.validator');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.EarningsAndExpensesColumns;
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');


EarningsAndExpensesService = {
    updateMonthlyData: async(db, body) => {
        return await EarningsAndExpensesDao.updateMonthlyData(db, body);
    },
    getMonthlyDataById: async(db, id) => {
        return await EarningsAndExpensesDao.getMonthlyDataById(db, id);
    },
    getAllData: async(db, filter) => {
        const records = await EarningsAndExpensesDao.getAllMonthlyData(db, filter);
        return records;
    },
    getByYear: async(db, filter) => {
        const records = await EarningsAndExpensesDao.getByYear(db, filter);
        return records;
    },
    getExpensesByYear: async(db, filter) => {
        const records = await EarningsAndExpensesDao.getExpensesByYear(db, filter);
        return records;
    },
    getEarningsByYear: async(db, filter) => {
        const records = await EarningsAndExpensesDao.getEarningsByYear(db, filter);
        return records;
    },
    deleteMonthlyRecord: async (db, id) => {
        return await EarningsAndExpensesDao.deleteMonthlyRecord(db, id);
    },
    // Helpers
    convertMonthlyDbToJson: (data) => {
        let rowAsJs = {};
        Object.entries(data).forEach(entry => {
            let [key, value] = entry;
            if(key === DatabaseColumns.EarningsAndExpensesColumns.FinanceDate || key === DatabaseColumns.EarningsAndExpensesColumns.Id) {
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
            if(key === COLUMNS.Year) {
                rowAsJs[Convert.snakeToCamel(key)] = value;
            } else {
                rowAsJs[Convert.snakeToCamel(key)] = Money.centsToMoney(value);
            }
        });
        return rowAsJs;
    },
    convertMonthlyDbToSheet: (data) => {
        return data.map(row => {
            let data = [];
            EarningsAndExpensesValidator.getCreateColumns().forEach(column => {
                if(column === DatabaseColumns.EarningsAndExpensesColumns.FinanceDate) {
                    data.push({type: 'String', value: row[column]});
                } else {
                    data.push({type: 'Number', value: Money.centsToMoney(row[column])});
                }
            });
            return data;
        });
    },
    
    
}

module.exports = EarningsAndExpensesService;
