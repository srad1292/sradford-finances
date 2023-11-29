const Money = require('../../utils/money');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;

const InvestmentsService = {
    calculateFinal: (body) => {
        const initial = Money.moneyToCents(body[COLUMNS.Initial]);
        const contributions = Money.moneyToCents(body[COLUMNS.Contributions]);
        const gains = Money.moneyToCents(body[COLUMNS.Gains]);
        const final = Money.centsToMoney(initial+contributions+gains);
        body[COLUMNS.Final] = final;
        return body;
    }
}

module.exports = InvestmentsService;
