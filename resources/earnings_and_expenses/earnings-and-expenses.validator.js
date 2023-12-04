const Convert = require('../../utils/snake_and_camel');
const DatabaseColumns = require("../../utils/database/database_columns.enum");
const COLUMNS = DatabaseColumns.EarningsAndExpensesColumns;

EarningsAndExpensesValidator = {
    expenseColumns: [
        COLUMNS.Mortgage, COLUMNS.Utilities, COLUMNS.Insurance, 
        COLUMNS.CarPayment, COLUMNS.PropertyTax, COLUMNS.Taxes, COLUMNS.Groceries, COLUMNS.Entertainment, 
        COLUMNS.Gifts, COLUMNS.EatingOut, COLUMNS.Furniture, COLUMNS.Repairs, COLUMNS.Misc
    ],
    earningsColumns: [COLUMNS.Salary, COLUMNS.Bonus, COLUMNS.TaxRefund],
    getUpdateColumns: () => [COLUMNS.Id, ...EarningsAndExpensesValidator.getCreateColumns()],
    getCreateColumns: () => { return [COLUMNS.FinanceDate, ...EarningsAndExpensesValidator.expenseColumns, ...EarningsAndExpensesValidator.earningsColumns]; },
    validateCreateData: (body) => {
        let errors = [];
        EarningsAndExpensesValidator.getCreateColumns().forEach(c => {
            let key = Convert.snakeToCamel(c);
            if(c === COLUMNS.FinanceDate) {
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

module.exports = EarningsAndExpensesValidator;
