const AnalyticsService = require("./analytics.service");
const ChartService = require("./chart.service");
const Database = require("../../db");
const EarningsAndExpensesService = require("../earnings_and_expenses/earnings-and-expenses.service");
const path = require('path');
const fs = require('fs');

AnalyticsController = {
    createAndSendImage: async(config, fileTitle, res) => {
        let chartImg = await ChartService.createImage(config);
        chartImg = chartImg.replace("data:image/png;base64,", "");
        const filePath = path.join(__dirname, 'img', fileTitle);
        const buffer = Buffer.from(chartImg, 'base64');
        fs.writeFileSync(filePath, buffer);
        res.status(200).sendFile(filePath);
    },
    getExpensesByType: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            let data = AnalyticsService.convertMonthlyDbToExpenseTotals(records);
            data = data.sort((a,b) => req.query.sort === 'DESC' ? b.value - a.value : a.value - b.value);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createHorizontalBarChartConfig(data, "Expenses By Type", options);
            AnalyticsController.createAndSendImage(config, "expenses-by-type.png", res);
        } catch(e) {
            next(e);
        }
    },
    getExpensesPerMonth: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const data = AnalyticsService.convertMonthlyDbToExpensePerMonth(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createVerticalBarChartConfig(data, "Expenses By Month", options);
            AnalyticsController.createAndSendImage(config, "expenses-by-month.png", res);
        } catch(e) {
            next(e);
        }
    },
    getExpensesPerYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getExpensesByYear(db, filter);
            const expenses = AnalyticsService.convertToExpensesPerYear(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createVerticalBarChartConfig(expenses, "Expenses Per Year", options);
            AnalyticsController.createAndSendImage(config, "expenses-by-year.png", res);
        } catch(e) {
            next(e);
        }
    },
    getExpensesOverTime: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const data = AnalyticsService.convertMonthlyDbToExpenseOverTime(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createLineConfig([{label: '', data}], "Expenses Over Time", options);
            AnalyticsController.createAndSendImage(config, "expenses-over-time.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsPerMonth: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const data = AnalyticsService.convertMonthlyDbToEarningsPerMonth(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createVerticalBarChartConfig(data, "Earnings By Month", options);
            AnalyticsController.createAndSendImage(config, "earnings-by-month.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsPerYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getEarningsByYear(db, filter);
            const earnings = AnalyticsService.convertToEarningsPerYear(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createVerticalBarChartConfig(earnings, "Earnings Per Year", options);
            AnalyticsController.createAndSendImage(config, "earnings-by-year.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsOverTime: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const data = AnalyticsService.convertMonthlyDbToEarningsOverTime(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createLineConfig([{label: '', data}], "Earnings Over Time", options);
            AnalyticsController.createAndSendImage(config, "earnings-over-time.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsVsExpensesByMonth: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const earnings = AnalyticsService.convertMonthlyDbToEarningsPerMonth(records);
            const expenses = AnalyticsService.convertMonthlyDbToExpensePerMonth(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
                showLegend: true,
            };
            const config = ChartService.createDoubleVerticalBarChartConfig([{label: "Earnings", data: earnings},{label: "Expenses", data: expenses}], "Earnings vs Expenses Per Month", options);
            AnalyticsController.createAndSendImage(config, "earnings-vs-expenses-per-month.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsVsExpensesByYear: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getByYear(db, filter);
            const earnings = AnalyticsService.convertToEarningsPerYear(records);
            const expenses = AnalyticsService.convertToExpensesPerYear(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
                showLegend: true,
            };
            const config = ChartService.createDoubleVerticalBarChartConfig([{label: "Earnings", data: earnings},{label: "Expenses", data: expenses}], "Earnings vs Expenses Per Year", options);
            AnalyticsController.createAndSendImage(config, "earnings-vs-expenses-per-year.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsVsExpensesOverTimeYears: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                from: req.query.from,
                to: req.query.to
            }
            const records = await EarningsAndExpensesService.getByYear(db, filter);
            const expenses = AnalyticsService.convertMonthlyDbToExpenseOverTime(records, 'year');
            const earnings = AnalyticsService.convertMonthlyDbToEarningsOverTime(records, 'year');
            const options = {
                mono: req.query.mono === 'false' ? false : true,
                showLegend: true,
            };
            const config = ChartService.createLineConfig([{label: "Earnings", data: earnings},{label: "Expenses", data: expenses}], "Total Earnings vs Expenses Over Years", options);
            AnalyticsController.createAndSendImage(config, "total-earnings-vs-expenses-by-year.png", res);
        } catch(e) {
            next(e);
        }
    },
    getEarningsVsExpensesOverTime: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await EarningsAndExpensesService.getAllData(db, filter);
            const expenses = AnalyticsService.convertMonthlyDbToExpenseOverTime(records);
            const earnings = AnalyticsService.convertMonthlyDbToEarningsOverTime(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
                showLegend: true,
            };
            const config = ChartService.createLineConfig([{label: "Earnings", data: earnings},{label: "Expenses", data: expenses}], "Earnings vs Expenses Over Time", options);
            AnalyticsController.createAndSendImage(config, "earnings-vs-expenses-over-time.png", res);
        } catch(e) {
            next(e);
        }
    },

}

module.exports = AnalyticsController;