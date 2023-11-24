const Convert = require('../../utils/snake_and_camel');

MonthlyValidator = {
    expenseColumns: ['mortgage', 'utilities','insurance', 
    'car_payment', 'property_tax', 'taxes', 'groceries', 'entertainment', 'gifts', 
    'eating_out', 'furniture', 'repairs', 'misc'],
    earningsColumns: ['salary', 'bonus', 'tax_refund',],
    updateColumns: ['id'],
    getCreateColumns: () => { return ['finance_date', ...MonthlyValidator.expenseColumns, ...MonthlyValidator.earningsColumns]; },
    validateCreateData: (body) => {
        let errors = [];
        MonthlyValidator.getCreateColumns().forEach(c => {
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

    
}

module.exports = MonthlyValidator;
