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
    getMonthlyDocumentColumns: () => {
        return [...InvestmentsValidator.getCreateColumns(), COLUMNS.PercentChange];
    },
    getYearlyDocumentColumns: () => {
        let result = [...InvestmentsValidator.getCreateColumns(), COLUMNS.PercentChange];
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
    validateBulkCreateData: (body) => {
        let errors = [];
        body.forEach((record, idx) => {
            let recordErrors = InvestmentsValidator.validateCreateData(record);
            recordErrors.forEach(error => {
                errors.push({index: idx, ...error});
            });
        });
        return errors;
    },
    validateCreateByFirm: (body) => {
        let errors = [];
        let recordDate;
        let camelDate = Convert.snakeToCamel(COLUMNS.RecordDate);
        body.forEach((record, idx) => {
            let firm = record['firm'];
            if(firm === undefined) {
                errors.push({index: idx, property: 'firm', error: 'firm is required'});
            }

            if(idx === 0) { 
                recordDate = record[camelDate];
            }
            else if(record[camelDate] !== recordDate) {
                errors.push({index: idx, firm: !!firm ? firm : 'unknown', property: camelDate, error: 'Record date should be the same for each firm'});
            }

            // if(idx !== 0) {
            //     console.log(`record: ${record[COLUMNS.RecordDate]} -- date: ${recordDate} -- not eq ${record[COLUMNS.RecordDate] !== recordDate}`);
            // }

            let recordErrors = InvestmentsValidator.validateCreateData(record);
            recordErrors.forEach(error => {
                errors.push({index: idx, firm: !!firm ? firm : 'unknown', ...error});
            });
        });
        return errors;
    },
}

module.exports = InvestmentsValidator;