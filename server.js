const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./db');
const APIException = require('./errors/api_exception');
const EarningsAndExpensesController = require("./resources/earnings_and_expenses/earnings-and-expenses.controller");
const AnalyticsController = require("./resources/analytics/analytics.controller");
const AnalyticsInvestmentsController = require("./resources/analytics/analytics-investments.controller");
const InvestmentsController = require("./resources/investments/investments.controller");

const app = express();
const port = 3001;

async function setup() {
  await Database.initDb();
  setupMiddleware();
  setupRoutes();
  setupErrorHandler();
  startListening();
}

setup();

function setupRoutes() {
  app.get('/', (request, response) => {
    response.json({ info: 'sradford finances api' });
  });

  app.get('/analytics/earnings-per-month', AnalyticsController.getEarningsPerMonth);
  app.get('/analytics/earnings-over-time', AnalyticsController.getEarningsOverTime);
  app.get('/analytics/earnings-vs-expenses-over-time', AnalyticsController.getEarningsVsExpensesOverTime);
  app.get('/analytics/earnings-vs-expenses-per-month', AnalyticsController.getEarningsVsExpensesByMonth);
  app.get('/analytics/expenses-by-type', AnalyticsController.getExpensesByType);
  app.get('/analytics/expenses-per-month', AnalyticsController.getExpensesPerMonth);
  app.get('/analytics/expenses-over-time', AnalyticsController.getExpensesOverTime);

  
  app.get('/analytics/investments/stacked/month', AnalyticsInvestmentsController.getStackedByMonth);
  app.get('/analytics/investments/stacked/year', AnalyticsInvestmentsController.getStackedByYear);
  app.get('/analytics/investments/net-contributions-vs-gains/month', AnalyticsInvestmentsController.getNetContributionsVsGainsByMonth);
  app.get('/analytics/investments/net-contributions-vs-gains/year', AnalyticsInvestmentsController.getNetContributionsVsGainsByYear);
  app.get('/analytics/investments/net-contributions/month', AnalyticsInvestmentsController.getNetContributionsByMonth);
  app.get('/analytics/investments/net-contributions/year', AnalyticsInvestmentsController.getNetContributionsByYear);
  app.get('/analytics/investments/gains/month', AnalyticsInvestmentsController.getGainsByMonth);
  app.get('/analytics/investments/gains/year', AnalyticsInvestmentsController.getGainsByYear);
  app.get('/analytics/investments/growth/month', AnalyticsInvestmentsController.getGrowthByMonth);
  app.get('/analytics/investments/growth/year', AnalyticsInvestmentsController.getGrowthByYear);


  

  app.post('/investments', InvestmentsController.createInvestmentsData);
  app.get('/investments', InvestmentsController.getAllRecords);
  app.put('/investments', InvestmentsController.updateRecord);
  app.get('/investments/spreadsheet/month', InvestmentsController.getMonthlySpreadsheet);
  app.get('/investments/spreadsheet/year', InvestmentsController.getYearlySpreadsheet);
  app.get('/investments/year', InvestmentsController.getByYear);
  app.get('/investments/net-contributions-vs-gains/month', InvestmentsController.getNetContributionsVsGainsByMonth);
  app.get('/investments/net-contributions-vs-gains/year', InvestmentsController.getNetContributionsVsGainsByYear);
  app.get('/investments/net-contributions/month', InvestmentsController.getNetContributionsByMonth);
  app.get('/investments/net-contributions/year', InvestmentsController.getNetContributionsByYear);
  app.get('/investments/gains/month', InvestmentsController.getGainsByMonth);
  app.get('/investments/gains/year', InvestmentsController.getGainsByYear);
  app.get('/investments/growth/month', InvestmentsController.getGrowthByMonth);
  app.get('/investments/growth/year', InvestmentsController.getGrowthByYear);
  app.get('/investments/:id', InvestmentsController.getRecordById);
  app.delete('/investments/:id', InvestmentsController.deleteRecord);

  app.post('/earnings-and-expenses', EarningsAndExpensesController.createMonthlyData);
  app.put('/earnings-and-expenses', EarningsAndExpensesController.updateMonthlyData);
  app.get('/earnings-and-expenses', EarningsAndExpensesController.getAllMonthlyData);
  app.get('/earnings-and-expenses/spreadsheet', EarningsAndExpensesController.getAllMonthlyDataAsSpreadsheet);
  app.get('/earnings-and-expenses/:id', EarningsAndExpensesController.getMonthlyDataById);
  app.delete('/earnings-and-expenses/:id', EarningsAndExpensesController.deleteMonthlyRecord);


  
}


function setupMiddleware() {
  app.use(bodyParser.json());

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
    
  app.use(cors({
      origin: true, 
      methods: 'POST,GET,PUT,OPTIONS,DELETE'
  }));
    
  app.use(logger);

}

function setupErrorHandler() {
  app.use(financeErrorHandler);
}

function logger(request, res, next) {
  console.log(
    JSON.stringify({
      timestamp: Date.now(),
      method: request.method,
      url: request.url
    })
  );
  next();
}

function financeErrorHandler(err, req, res, next) {
  console.log("In finance error handler");
  if(err instanceof APIException) {
    console.log("Message: " + err.message);
    console.log(err.errors);
    res.status(err.statusCode).send({message: err.message, errors: err.errors});
  } else {
    console.log(err);
    res.status(500).send({error: "An unexpected error has occurred", message: err.message});
  }
}

function startListening() {
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
}

