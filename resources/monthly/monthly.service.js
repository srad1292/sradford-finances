const Convert = require('../../utils/snake_and_camel');

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
                return body[key] * 100;
            }
        });
    
        return {columns, placeholders, values};
    }
    
}

module.exports = MonthlyService;
