const InvestmentsValidator = require('./investments.validator');
const DatabaseTable = require('../../utils/database/database_table.enum');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;
const YearColumns = DatabaseColumns.InvestmentsYearColumns;
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');
const APIException = require('../../errors/api_exception');

const InvestmentsDao = {
    createInvestmentsData: async (db, body) => {
        let dbData = InvestmentsDao.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.investments}${columns} VALUES${placeholders}`;
        
        console.log(dbData);
        try {
            const runResult = await db.run(sql, values);
            return {id: runResult.lastID, ...body};
            // return {id: 1000, ...body};
        } catch (e) {
            throw new DatabaseException("Error creating investments data: " + e, 500);
        }
    },
    getRecordById: async (db, id) => {
        let sql = `SELECT * FROM ${DatabaseTable.investments} WHERE ${DatabaseColumns.InvestmentsColumns.Id} = ${id};`
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
    getAllRecords: async (db, filters = {}) => {
        let select = `SELECT * FROM ${DatabaseTable.investments}`;
        let where = '';
        if(!!filters.startDate && !!filters.endDate) {
            where = `WHERE ${COLUMNS.RecordDate} >= '${filters.startDate}' AND ${COLUMNS.RecordDate} <= '${filters.endDate}'`;
        } else if(!!filters.startDate) {
            where = `WHERE ${COLUMNS.RecordDate} >= '${filters.startDate}'`;
        } else if(!!filters.endDate) {
            where = `WHERE ${COLUMNS.RecordDate} <= '${filters.endDate}'`;
        }
        let order = `ORDER BY ${COLUMNS.RecordDate} ${filters.sort === 'DESC' ? 'DESC' : 'ASC'};`;
        let sql = where === '' ? select + " " + order : select + " " + where + " " + order;
        console.log(sql);
        try {
            let data = await db.all(sql);
            return data;
        } catch(e) {
            throw new DatabaseException("Error getting investment data: " + e, 500);
        }
    },
    getByYear: async(db, filter) => {
        let sql = `SELECT DISTINCT (${YearColumns.Year}) ${YearColumns.Year}, ${YearColumns.TotalContributions}, ${YearColumns.TotalGains}, FIRST_VALUE (${COLUMNS.Initial}) OVER (PARTITION BY ${YearColumns.Year} ORDER BY ${COLUMNS.RecordDate} ASC) AS ${YearColumns.InitialValue}, ${YearColumns.TotalContributions} + ${YearColumns.TotalGains} + FIRST_VALUE (${COLUMNS.Initial}) OVER (PARTITION BY ${YearColumns.Year} ORDER BY ${COLUMNS.RecordDate} ASC) as ${YearColumns.FinalValue}
        FROM (
          SELECT strftime ('%Y', ${COLUMNS.RecordDate}) AS ${YearColumns.Year}, SUM (${COLUMNS.Contributions}) AS ${YearColumns.TotalContributions}, SUM(${COLUMNS.Gains}) as ${YearColumns.TotalGains}, ${COLUMNS.Initial}, ${COLUMNS.Id}, ${COLUMNS.RecordDate}
          FROM ${DatabaseTable.investments}
          GROUP BY ${YearColumns.Year}
          HAVING ${COLUMNS.RecordDate} = MIN(${COLUMNS.RecordDate})
        ) AS subquery
        ORDER BY ${YearColumns.Year};`
        
        let data = await db.all(sql);
        // console.log(data);
        return data;
    },
    updateRecord: async(db, body) => {
        let dbData = InvestmentsDao.getUpdateData(body);
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `UPDATE ${DatabaseTable.investments}\nSET ${placeholders}\nWHERE ${COLUMNS.Id} = ?`;
        
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
            throw new DatabaseException("Error updating investment record: " + e, 500);
        }
    },
    deleteRecord: async (db, id) => {
        let sql = `DELETE FROM ${DatabaseTable.investments} WHERE ${COLUMNS.Id} = ${id};`
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
            throw new DatabaseException("Error getting investment record with id " + id + ": " + e, 500);
        }
    },
    // DAO helpers
    getCreateData: (body) => {
        let columns = "(" + InvestmentsValidator.getCreateColumns().join(",") + ")";
        let placeholders = "(" + InvestmentsValidator.getCreateColumns().map(c => '?').join(',') + ")";
        let values = InvestmentsValidator.getCreateColumns().map(c => {
            let key = Convert.snakeToCamel(c);
            if(c === COLUMNS.RecordDate) {
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
        let placeholders = InvestmentsValidator.getCreateColumns().join(" = ?,\n");
        placeholders = `${placeholders} = ?`; 
        let values = InvestmentsValidator.getCreateColumns().map(c => {
            let key = Convert.snakeToCamel(c);
            if(c === COLUMNS.RecordDate) {
                return body[key];
            } else {
                if(body[key] === undefined) {
                    return 0;
                }
                return Money.moneyToCents(body[key]);
            }
        });
        values.push(body[Convert.snakeToCamel(COLUMNS.Id)]);
    
        return {placeholders, values};
    },
};

module.exports = InvestmentsDao;