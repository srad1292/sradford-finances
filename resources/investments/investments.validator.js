const Convert = require('../../utils/snake_and_camel');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;
const YearColumns = DatabaseColumns.InvestmentsYearColumns;

InvestmentsValidator = {
    updateColumns: [COLUMNS.Id],
    givenColumns: [COLUMNS.RecordDate, COLUMNS.Initial, COLUMNS.Contributions, COLUMNS.Gains, COLUMNS.Withdrawals],
    derivedColumns: [COLUMNS.Final],
    getCreateColumns: () => {
        return [...InvestmentsValidator.givenColumns, ...InvestmentsValidator.derivedColumns];
    },
    getYearlyColumns: () => {
        let result = InvestmentsValidator.getCreateColumns();
        result[0] = YearColumns.Year;
        return result;
    },
    validateCreateData: (body) => {
        let errors = [];
        InvestmentsValidator.givenColumns.forEach(c => {
            let key = Convert.snakeToCamel(c);
            if(c === COLUMNS.RecordDate) {
                if(body[key] === undefined) {
                    errors.push({property: key, error: `Is a required field`});
                } else if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(body[key]) === false) {
                    errors.push({property: key, error: `Must be in the format 'yyyy-mm-dd'`});
                } else if((new Date(body[key])).toString() === 'Invalid Date') {
                    errors.push({property: key, error: `Must be a valid date`});
                }
            } else {
                if(body[key] === undefined) {
                    errors.push(`${key} is a required field`);
                    return;
                } else if(typeof(body[key]) !== 'number') {
                    errors.push({property: key, error: `${key} should be a number but is ${typeof(body[key])}`});
                } else if((key === COLUMNS.Contributions || key === COLUMNS.Withdrawals) && body[key] < 0) {
                    errors.push({property: key, error: `${key} should be positive`});
                }
                return;
            }
        });
        return errors;
    },
}

module.exports = InvestmentsValidator;