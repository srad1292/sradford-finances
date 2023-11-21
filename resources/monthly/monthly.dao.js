const DatabaseTable = require('../../utils/database_table.enum');
const DatabaseColumns = require('../../utils/database_columns.enum');
const DatabaseException = require('../../errors/database_exception');
const MonthlyValidator = require('./monthly.validator');
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');

MonthlyDao = {
    createMonthlyData: async (db, body) => {
        let dbData = MonthlyDao.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.monthly}${columns} VALUES${placeholders}`;
        
        console.log(dbData);
        try {
            const runResult = await db.run(sql, values);
            return {id: runResult.lastID, ...body};
            // return {id: 1000, ...body};
        } catch (e) {
            throw new DatabaseException("Error creating monthly data: " + e, 500);
        }
    },
    getAllMonthlyData: async (db) => {
        let sql = `SELECT * FROM ${DatabaseTable.monthly} ORDER BY ${DatabaseColumns.MonthlyColumns.FinanceDate};`
        try {
            let data = await db.all(sql);
            return MonthlyDao.convertMonthlyDbToJson(data);  
        } catch(e) {
            throw new DatabaseException("Error getting monthly data: " + e, 500);
        }
    },
    // DAO Helpers
    getCreateData: (body) => {
        let columns = "(" + MonthlyValidator.createColumns.join(",") + ")";
        let placeholders = "(" + MonthlyValidator.createColumns.map(c => '?').join(',') + ")";
        let values = MonthlyValidator.createColumns.map(c => {
            let key = Convert.snakeToCamel(c);
            if(c === 'finance_date') {
                return body[key];
            } else {
                if(body[key] === undefined) {
                    return 0;
                }
                return Money.moneyToCents(body[key]);
            }
        });
    
        return {columns, placeholders, values};
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
}

module.exports = MonthlyDao;
