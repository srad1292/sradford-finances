const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./db');
const APIException = require('./errors/api_exception');
const MonthlyController = require("./resources/monthly/monthly.controller");


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

  app.post('/monthly-data', MonthlyController.createMonthlyData);
  app.get('/monthly-data', MonthlyController.getAllMonthlyData);
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
    res.status(500).send({error: "An unexpected error has occurred", message: err.message});
  }
}

function startListening() {
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
}

