const DatabaseTable = require('../../utils/database/database_table.enum');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.EarningsAndExpensesColumns;
const DatabaseException = require('../../errors/database_exception');
const EarningsAndExpensesValidator = require('./earnings-and-expenses.validator');
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');
const APIException = require('../../errors/api_exception');

EarningsAndExpensesDao = {
    createMonthlyData: async (db, body) => {
        let dbData = EarningsAndExpensesDao.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.EarningsAndExpenses}${columns} VALUES${placeholders}`;
        
        try {
            const runResult = await db.run(sql, values);
            return {id: runResult.lastID, ...body};
        } catch (e) {
            throw new DatabaseException("Error creating monthly data: " + e, 500);
        }
    },
    updateMonthlyData: async(db, body) => {
        let dbData = EarningsAndExpensesDao.getUpdateData(body);
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `UPDATE ${DatabaseTable.EarningsAndExpenses}\nSET ${placeholders}\nWHERE ${DatabaseColumns.EarningsAndExpensesColumns.Id} = ?`;
        
        try {
            const result = await db.run(sql, values);
            if(result === null || result === undefined || result.changes === 0) {
                throw new APIException("No record found with ID: " + body.id, [], 404);
            }
            return {id: body.id, ...body};
            // return {id: 1000, ...body};
        } catch (e) {
            if(e instanceof APIException) {
                throw(e);
            }
            throw new DatabaseException("Error updating monthly data: " + e, 500);
        }
    },
    getMonthlyDataById: async (db, id) => {
        let colQuery = EarningsAndExpensesValidator.getUpdateColumns().join(", ");
        let sql = `SELECT ${colQuery} FROM ${DatabaseTable.EarningsAndExpenses} WHERE ${DatabaseColumns.EarningsAndExpensesColumns.Id} = ${id};`
        try {
            let data = await db.get(sql);
            if(data === null || data === undefined) {
                throw new APIException("No record found with ID: " + id, [], 404);
            }
            return data;
        } catch(e) {
            if(e instanceof APIException) {
                throw(e);
            }
            throw new DatabaseException("Error getting monthly data with id " + id + ": " + e, 500);
        }
    },
    getAllMonthlyData: async (db, filters = {}) => {
        let colQuery = EarningsAndExpensesValidator.getUpdateColumns().join(", ");
        let select = `SELECT ${colQuery} FROM ${DatabaseTable.EarningsAndExpenses}`;
        let where = '';
        if(!!filters.startDate && !!filters.endDate) {
            where = `WHERE ${DatabaseColumns.EarningsAndExpensesColumns.FinanceDate} >= '${filters.startDate}' AND ${DatabaseColumns.EarningsAndExpensesColumns.FinanceDate} <= '${filters.endDate}'`;
        } else if(!!filters.startDate) {
            where = `WHERE ${DatabaseColumns.EarningsAndExpensesColumns.FinanceDate} >= '${filters.startDate}'`;
        } else if(!!filters.endDate) {
            where = `WHERE ${DatabaseColumns.EarningsAndExpensesColumns.FinanceDate} <= '${filters.endDate}'`;
        }
        let order = `ORDER BY ${DatabaseColumns.EarningsAndExpensesColumns.FinanceDate} ${filters.sort === 'DESC' ? 'DESC' : 'ASC'};`;
        let sql = where === '' ? select + " " + order : select + " " + where + " " + order;
        try {
            let data = await db.all(sql);
            return data;
        } catch(e) {
            throw new DatabaseException("Error getting monthly data: " + e, 500);
        }
    },
    getByYear: async(db, filters = {}) => {
        let innerSelectValues = EarningsAndExpensesValidator.getValueColumns().map(c => `SUM (${c}) AS total_${c}`);
        let outerSelectValues = EarningsAndExpensesValidator.getValueColumns().map(c => `total_${c} AS ${c}`);

        let sql = `SELECT DISTINCT (${COLUMNS.Year}) ${COLUMNS.Year}, ${outerSelectValues.join(', ')} 
        FROM (
          SELECT strftime ('%Y', ${COLUMNS.FinanceDate}) AS ${COLUMNS.Year}, ${innerSelectValues.join(", ")}
          FROM ${DatabaseTable.EarningsAndExpenses}
          ${EarningsAndExpensesDao.buildWhereClauseWithYears(filters)}
          GROUP BY ${COLUMNS.Year}
          HAVING ${COLUMNS.FinanceDate} = MIN(${COLUMNS.FinanceDate})
        ) AS subquery
        ORDER BY ${COLUMNS.Year};`
        let data = await db.all(sql);
        return data;
    },
    getExpensesByYear: async(db, filters = {}) => {
        let innerSelectValues = EarningsAndExpensesValidator.expenseColumns.map(c => `SUM (${c}) AS total_${c}`);
        let outerSelectValues = EarningsAndExpensesValidator.expenseColumns.map(c => `total_${c} AS ${c}`);

        let sql = `SELECT DISTINCT (${COLUMNS.Year}) ${COLUMNS.Year}, ${outerSelectValues.join(', ')} 
        FROM (
          SELECT strftime ('%Y', ${COLUMNS.FinanceDate}) AS ${COLUMNS.Year}, ${innerSelectValues.join(", ")}
          FROM ${DatabaseTable.EarningsAndExpenses}
          ${EarningsAndExpensesDao.buildWhereClauseWithYears(filters)}
          GROUP BY ${COLUMNS.Year}
          HAVING ${COLUMNS.FinanceDate} = MIN(${COLUMNS.FinanceDate})
        ) AS subquery
        ORDER BY ${COLUMNS.Year};`
        let data = await db.all(sql);
        return data;
    },
    getEarningsByYear: async(db, filters = {}) => {
        let innerSelectValues = EarningsAndExpensesValidator.earningsColumns.map(c => `SUM (${c}) AS total_${c}`);
        let outerSelectValues = EarningsAndExpensesValidator.earningsColumns.map(c => `total_${c} AS ${c}`);

        let sql = `SELECT DISTINCT (${COLUMNS.Year}) ${COLUMNS.Year}, ${outerSelectValues.join(', ')} 
        FROM (
          SELECT strftime ('%Y', ${COLUMNS.FinanceDate}) AS ${COLUMNS.Year}, ${innerSelectValues.join(", ")}
          FROM ${DatabaseTable.EarningsAndExpenses}
          ${EarningsAndExpensesDao.buildWhereClauseWithYears(filters)}
          GROUP BY ${COLUMNS.Year}
          HAVING ${COLUMNS.FinanceDate} = MIN(${COLUMNS.FinanceDate})
        ) AS subquery
        ORDER BY ${COLUMNS.Year};`
        let data = await db.all(sql);
        return data;
    },

    deleteMonthlyRecord: async (db, id) => {
        let sql = `DELETE FROM ${DatabaseTable.EarningsAndExpenses} WHERE ${DatabaseColumns.EarningsAndExpensesColumns.Id} = ${id};`
        try {
            let result = await db.run(sql);
            if(result === null || result === undefined || result.changes === 0) {
                throw new APIException("No record found with ID: " + id, [], 404);
            }
            return result;
        } catch(e) {
            if(e instanceof APIException) {
                throw(e);
            }
            throw new DatabaseException("Error getting monthly data with id " + id + ": " + e, 500);
        }
    },
    // DAO Helpers
    getCreateData: (body) => {
        let columns = "(" + EarningsAndExpensesValidator.getCreateColumns().join(",") + ")";
        let placeholders = "(" + EarningsAndExpensesValidator.getCreateColumns().map(c => '?').join(',') + ")";
        let values = EarningsAndExpensesValidator.getCreateColumns().map(c => {
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
    getUpdateData: (body) => {
        let placeholders = EarningsAndExpensesValidator.getCreateColumns().join(" = ?,\n");
        placeholders = `${placeholders} = ?`; 
        let values = EarningsAndExpensesValidator.getCreateColumns().map(c => {
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
        values.push(body[Convert.snakeToCamel(DatabaseColumns.EarningsAndExpensesColumns.Id)]);
    
        return {placeholders, values};
    },
    buildWhereClauseWithYears: (filters = {}) => {
        let where = '';
        if(!!filters.from && !!filters.to) {
            where = `WHERE ${COLUMNS.Year} >= '${filters.from}' AND ${COLUMNS.Year} <= '${filters.to}'`;
        } else if(!!filters.from) {
            where = `WHERE ${COLUMNS.Year} >= '${filters.from}'`;
        } else if(!!filters.to) {
            where = `WHERE ${COLUMNS.Year} <= '${filters.to}'`;
        }
        return where;
    },
    
}

module.exports = EarningsAndExpensesDao;
