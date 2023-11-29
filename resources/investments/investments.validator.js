const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;

InvestmentsValidator = {
    updateColumns: [COLUMNS.Id],
    createColumns: [COLUMNS.Initial, COLUMNS.Contributions, COLUMNS.Gains, COLUMNS.Final]
}

module.exports = {InvestmentsValidator};