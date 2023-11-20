const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');
const DatabaseColumns = require('../../utils/database_columns.enum');

MonthlyService = {
    updateColumns: ['id'],
    createColumns: ['finance_date', 'mortgage', 'utilities','insurance', 
    'car_payment', 'property_tax', 'taxes', 'groceries', 'entertainment', 'gifts', 
    'eating_out', 'furniture', 'repairs', 'misc', 'salary', 'bonus', 'tax_refund',
    ],
    validateCreateData: (body) => {
        let errors = [];
        MonthlyService.createColumns.forEach(c => {
            let key = Convert.snakeToCamel(c);
            if(c === 'finance_date') {
                if(body[key] === undefined) {
                    errors.push({property: key, error: `Is a required field`});
                } else if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(body[key]) === false) {
                    errors.push({property: key, error: `Must be in the format 'yyyy-mm-dd'`});
                } else if((new Date(body[key])).toString() === 'Invalid Date') {
                    errors.push({property: key, error: `Must be a valid date`});
                }
            } else {
                if(body[key] === undefined) {
                    // errors.push(`${key} is a required field`);
                    return;
                } else if(typeof(body[key]) !== 'number') {
                    errors.push({property: key, error: `${key} should be a number but is ${typeof(body[key])}`});
                } else if(body[key] < 0) {
                    errors.push({property: key, error: `${key} should be greater than 0`});
                }
                return;
            }
        });
        return errors;
    },
    getCreateData: (body) => {
        let columns = "(" + MonthlyService.createColumns.join(",") + ")";
        let placeholders = "(" + MonthlyService.createColumns.map(c => '?').join(',') + ")";
        let values = MonthlyService.createColumns.map(c => {
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
    }
    
}

module.exports = MonthlyService;
