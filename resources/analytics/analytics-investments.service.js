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
    convertStackedByPeriod: (data, period) => {
        /**
         * {
         *  labels: string[]
         *  datasets: [{label: string, data: investment[]}]
         * }
         */
        let labels = [];
        let initial = [];
        let contributions = [];
        let withdrawals = [];
        let gains = [];
        data.forEach(row => {
            labels.push(period === 'month' ? row[COLUMNS.RecordDate] : row[YearColumns.Year]);
            initial.push(Money.centsToMoney(row[COLUMNS.Initial]));
            contributions.push(Money.centsToMoney(row[COLUMNS.Contributions]));
            withdrawals.push(Money.centsToMoney(-1 * row[COLUMNS.Withdrawals]));
            gains.push(Money.centsToMoney(row[COLUMNS.Gains]));
        });

        return {
            labels,
            datasets: [
                {label: 'Initial', data: initial},
                {label: 'Contributions', data: contributions},
                {label: 'Withdrawals', data: withdrawals},
                {label: 'Gains', data: gains},
            ]
        };
    }
}

module.exports = AnalyticsInvestmentsService;