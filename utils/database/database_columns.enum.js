const EarningsAndExpensesColumns = {
    Id: 'id',
    FinanceDate: 'finance_date',
    Mortgage: 'mortgage',
    Utilities: 'utilities',
    Hoa: "hoa",
    Insurance: 'insurance',
    CarPayment: 'car_payment',
    Gas: 'gas',
    PropertyTax: 'property_tax',
    Taxes: 'taxes',
    Groceries: 'groceries',
    Entertainment: 'entertainment',
    Gifts: 'gifts',
    EatingOut: 'eating_out',
    Clothes: 'clothes',
    HomeNeeds: 'home_needs',
    KitchenNeeds: 'kitchen_needs',
    LawnNeeds: 'lawn_needs',
    Maintenance: 'maintenance',
    Furniture: 'furniture',
    Repairs: 'repairs',
    Vacation: 'vacation',
    Lodging: 'lodging',
    Vet: 'vet',
    Medical: 'medical',
    Misc: 'misc',
    Salary: 'salary',
    Bonus: 'bonus',
    TaxRefund: 'tax_refund',
    RewardsSpent: 'rewards_spent',
    Interest: 'interest',

    // Not in database
    Year: 'year',
}

const InvestmentsColumns = {
    Id: 'id',
    RecordDate: 'record_date',
    Initial: 'initial',
    Contributions: 'contributions',
    Gains: 'gains',
    Withdrawals: 'withdrawals',
    Final: 'final',
    // Derived Columns, not part of table
    NetContributions: 'net_contributions',
    PercentChange: 'percent_change',
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


module.exports = {EarningsAndExpensesColumns, InvestmentsColumns, InvestmentsYearColumns};