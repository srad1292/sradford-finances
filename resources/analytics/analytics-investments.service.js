const Money = require('../../utils/money');
const DatabaseColumns = require("../../utils/database/database_columns.enum");
const COLUMNS = DatabaseColumns.InvestmentsColumns;
const YearColumns = DatabaseColumns.InvestmentsYearColumns;
const InvestmentsValidator = require("../investments/investments.validator");

AnalyticsInvestmentsService = {
    convertNetContributionsByMonth: (data) => {
        return data.map(row => {
            return {
                label: row[COLUMNS.RecordDate],
                value: Money.centsToMoney(row[COLUMNS.NetContributions])
            }
        });
    },
    convertNetContributionsByYear: (data) => {
        return data.map(row => {
            return {
                label: row[YearColumns.Year],
                value: Money.centsToMoney(row[COLUMNS.NetContributions])
            }
        });
    },
    convertGainsByMonth: (data) => {
        return data.map(row => {
            return {
                label: row[COLUMNS.RecordDate],
                value: Money.centsToMoney(row[COLUMNS.Gains])
            }
        });
    },
    convertGainsByYear: (data) => {
        return data.map(row => {
            return {
                label: row[YearColumns.Year],
                value: Money.centsToMoney(row[COLUMNS.Gains])
            }
        });
    },
    convertGrowthByMonth: (data) => {
        return data.map(row => {
            return {
                label: row[COLUMNS.RecordDate],
                value: Money.centsToMoney(row[COLUMNS.Final])
            }
        });
    },
    convertGrowthByYear: (data) => {
        return data.map(row => {
            return {
                label: row[YearColumns.Year],
                value: Money.centsToMoney(row[COLUMNS.Final])
            }
        });
    },
}

module.exports = AnalyticsInvestmentsService;