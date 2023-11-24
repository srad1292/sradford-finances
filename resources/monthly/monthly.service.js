const MonthlyDao = require('./monthly.dao');
const MonthlyValidator = require('./monthly.validator');
const DatabaseColumns = require('../../utils/database_columns.enum');
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');


MonthlyService = {
    getMonthlyDataById: async(db, id) => {
        return await MonthlyDao.getMonthlyDataById(db, id);
    },
    getAllData: async(db, filter) => {
        const records = await MonthlyDao.getAllMonthlyData(db, filter);
        return records;
    },
    deleteMonthlyRecord: async (db, id) => {
        return await MonthlyDao.deleteMonthlyRecord(db, id);
    },
    // Helpers
    convertMonthlyDbToJson: (data) => {
        let rowAsJs = {};
        Object.entries(data).forEach(entry => {
            let [key, value] = entry;
            if(key === DatabaseColumns.MonthlyColumns.FinanceDate || key === DatabaseColumns.MonthlyColumns.Id) {
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
            MonthlyValidator.createColumns.forEach(column => {
                if(column === DatabaseColumns.MonthlyColumns.FinanceDate) {
                    data.push({type: 'String', value: row[column]});
                } else {
                    data.push({type: 'Number', value: Money.centsToMoney(row[column])});
                }
            });
            return data;
        });
    },
    
    
}

module.exports = MonthlyService;
