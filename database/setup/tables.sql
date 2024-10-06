CREATE TABLE IF NOT EXISTS earnings_and_expenses(
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

CREATE TABLE IF NOT EXISTS investments(
id INTEGER PRIMARY KEY,
record_date TEXT NOT NULL,
initial INTEGER DEFAULT 0,
contributions INTEGER DEFAULT 0,
gains INTEGER DEFAULT 0,
withdrawals INTEGER DEFAULT 0,
final INTEGER DEFAULT 0
);

ALTER TABLE earnings_and_expenses ADD COLUMN hoa INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN clothes INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN vacation INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN lodging INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN gas INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN vet INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN medical INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN rewards_spent INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN home_needs INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN kitchen_needs INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN interest INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN lawn_needs INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN maintenance INTEGER DEFAULT 0;
ALTER TABLE earnings_and_expenses ADD COLUMN software INTEGER DEFAULT 0;

