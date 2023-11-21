const MonthlyDao = require('./monthly.dao');

MonthlyService = {
    
    // Controller Helpers
    getAllData: async(db) => {
        const records = await MonthlyDao.getAllMonthlyData(db);
        return records;
    },
    
    
}

module.exports = MonthlyService;
