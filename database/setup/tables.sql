CREATE TABLE IF NOT EXISTS monthly(
    id INTEGER PRIMARY KEY,
    finance_date TEXT NOT NULL,
    mortgage INTEGER DEFAULT 0,
    utilities INTEGER DEFAULT 0,
    insurance INTEGER DEFAULT 0,
    car_payment INTEGER DEFAULT 0,
    property_tax INTEGER DEFAULT 0,
    taxes INTEGER DEFAULT 0,
    groceries INTEGER DEFAULT 0,
    entertainment INTEGER DEFAULT 0,
    gifts INTEGER DEFAULT 0,
    eating_out INTEGER DEFAULT 0,
    furniture INTEGER DEFAULT 0,
    repairs INTEGER DEFAULT 0,
    misc INTEGER DEFAULT 0,
    salary INTEGER DEFAULT 0,
    bonus INTEGER DEFAULT 0,
    tax_refund INTEGER DEFAULT 0 
);

