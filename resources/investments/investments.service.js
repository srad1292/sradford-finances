const InvestmentsDao = require('./investments.dao');
const Money = require('../../utils/money');
const Convert = require('../../utils/snake_and_camel');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;


const InvestmentsService = {
    // Endpoint Calls
    getRecordById: async(db, id) => {
        return await InvestmentsDao.getRecordById(db, id);
    },
    getAllRecords: async(db, filter) => {
        const records = await InvestmentsDao.getAllRecords(db, filter);
        return records;
    },
    // Helpers
    calculateFinal: (body) => {
        const initial = Money.moneyToCents(body[COLUMNS.Initial]);
        const contributions = Money.moneyToCents(body[COLUMNS.Contributions]);
        const gains = Money.moneyToCents(body[COLUMNS.Gains]);
        const final = Money.centsToMoney(initial+contributions+gains);
        body[COLUMNS.Final] = final;
        return body;
    },
    convertRecordToJson: (data) => {
        let rowAsJs = {};
        Object.entries(data).forEach(entry => {
            let [key, value] = entry;
            if(key === COLUMNS.RecordDate || key === COLUMNS.Id) {
                rowAsJs[Convert.snakeToCamel(key)] = value;
            } else {
                rowAsJs[Convert.snakeToCamel(key)] = Money.centsToMoney(value);
            }
        });
        return rowAsJs;
    },
    
}

module.exports = InvestmentsService;
