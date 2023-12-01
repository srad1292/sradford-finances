const MonthlyColumns = {
    Id: 'id',
    FinanceDate: 'finance_date',
    Mortgage: 'mortgage',
    Utilities: 'utilities',
    Insurance: 'insurance',
    CarPayment: 'car_payment',
    PropertyTax: 'property_tax',
    Taxes: 'taxes',
    Groceries: 'groceries',
    Entertainment: 'entertainment',
    Gifts: 'gifts',
    EatingOut: 'eating_out',
    Furniture: 'furniture',
    Repairs: 'repairs',
    Misc: 'misc',
    Salary: 'salary',
    Bonus: 'bonus',
    TaxRefund: 'tax_refund',
}

const InvestmentsColumns = {
    Id: 'id',
    RecordDate: 'record_date',
    Initial: 'initial',
    Contributions: 'contributions',
    Gains: 'gains',
    Withdrawals: 'withdrawals',
    Final: 'final',
}

// Result table from query, not a persistent table
const InvestmentsYearColumns = {
    Year: 'year',
    InitialValue: 'initial_value',
    TotalContributions: 'total_contributions',
    TotalGains: 'total_gains',
    TotalWithdrawals: 'total_withdrawals',
    FinalValue: 'final_value',
}


module.exports = {MonthlyColumns, InvestmentsColumns, InvestmentsYearColumns};