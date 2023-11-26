const Money = require('../../utils/money');
const DatabaseColumns = require("../../utils/database/database_columns.enum");

AnalyticsService = {
    convertMonthlyDbToExpenseTotals: (data) => {
        let result = [];
        MonthlyValidator.expenseColumns.forEach((c) => result.push({label: c, value: 0}));
        
        for(let row = 0; row < data.length; row++) {
            MonthlyValidator.expenseColumns.forEach((c, i) => {
                if(!!data[row][c]) {
                    result[i].value += data[row][c];
                }

                if(row === data.length-1) {
                    result[i].value = Money.centsToMoney(result[i].value);
                }
            });
        }

        // console.log("Converted to expenses");
        // console.log(result);
        return result;
        
    },
    convertMonthlyDbToExpensePerMonth: (data) => {
        let result = [];
        
        for(let row = 0; row < data.length; row++) {
            let sum = 0;
            MonthlyValidator.expenseColumns.forEach((c, i) => {
                if(!!data[row][c]) {
                    sum += data[row][c];
                }
            });

            sum = Money.centsToMoney(sum);
            result.push({label: data[row][DatabaseColumns.MonthlyColumns.FinanceDate], value: sum});
        }

        // console.log("Converted to expenses");
        // console.log(result);
        return result;
        
    },
    convertMonthlyDbToExpenseOverTime: (data) => {
        let result = [];

        let sum = 0;
        for(let row = 0; row < data.length; row++) {
            MonthlyValidator.expenseColumns.forEach((c, i) => {
                if(!!data[row][c]) {
                    sum += data[row][c];
                }
            });

            result.push({label: data[row][DatabaseColumns.MonthlyColumns.FinanceDate], value: Money.centsToMoney(sum)});
        }

        // console.log("Converted to expenses");
        // console.log(result);
        return result;
        
    },
    convertMonthlyDbToEarningsPerMonth: (data) => {
        let result = [];
        
        for(let row = 0; row < data.length; row++) {
            let sum = 0;
            MonthlyValidator.earningsColumns.forEach((c, i) => {
                if(!!data[row][c]) {
                    sum += data[row][c];
                }
            });

            sum = Money.centsToMoney(sum);
            result.push({label: data[row][DatabaseColumns.MonthlyColumns.FinanceDate], value: sum});
        }

        // console.log("Converted to expenses");
        // console.log(result);
        return result;
        
    },
    convertMonthlyDbToEarningsOverTime: (data) => {
        let result = [];

        let sum = 0;
        for(let row = 0; row < data.length; row++) {
            MonthlyValidator.earningsColumns.forEach((c, i) => {
                if(!!data[row][c]) {
                    sum += data[row][c];
                }
            });

            result.push({label: data[row][DatabaseColumns.MonthlyColumns.FinanceDate], value: Money.centsToMoney(sum)});
        }

        // console.log("Converted to expenses");
        // console.log(result);
        return result;
        
    },
}


module.exports = AnalyticsService;
