const MonthlyDao = require('./monthly.dao');
const MonthlyValidator = require('./monthly.validator');
const DatabaseColumns = require('../../utils/database_columns.enum');
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');


MonthlyService = {
    
    // Controller Helpers
    getAllData: async(db) => {
        const records = await MonthlyDao.getAllMonthlyData(db);
        return records;
    },
    convertMonthlyDbToJson: (data) => {
        return data.map(row => {
            let rowAsJs = {};
            Object.entries(row).forEach(entry => {
                let [key, value] = entry;
                if(key === DatabaseColumns.MonthlyColumns.FinanceDate || key === DatabaseColumns.MonthlyColumns.Id) {
                    rowAsJs[Convert.snakeToCamel(key)] = value;
                } else {
                    rowAsJs[Convert.snakeToCamel(key)] = Money.centsToMoney(value);
                }
            });
            return rowAsJs;
        });
    },
    convertMonthlyDbToSheet: (data) => {
        return data.map(row => {
            let data = [];
            MonthlyValidator.createColumns.forEach(column => {
                if(column === DatabaseColumns.MonthlyColumns.FinanceDate) {
                    data.push(row[column]);
                } else {
                    data.push(Money.centsToMoney(row[column]));
                }
            });
            return data;
        });
    },
    
    
}

module.exports = MonthlyService;
