const MonthlyService = require('./monthly.service');
const DatabaseTable = require('../../utils/database_table.enum');

MonthlyDao = {
    createMonthlyData: async (db, body) => {
        let dbData = MonthlyService.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.getCreateData;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.monthly}${columns} VALUES${placeholders}`;
        
        console.log(dbData);
        //const runResult = await db.run(sql, values);
        // return {id: runResult.lastID, ...body};
        return {id: 1000, ...body};
    }    
}

module.exports = MonthlyDao;
