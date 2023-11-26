const AnalyticsService = require("./analytics.service");
const ChartService = require("./chart.service");
const Database = require("../../db");
const MonthlyService = require("../monthly/monthly.service");
const path = require('path');
const fs = require('fs');


AnalyticsController = {
    getExpensesByType: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            const records = await MonthlyService.getAllData(db, filter);
            let data = AnalyticsService.convertMonthlyDbToExpenseTotals(records);
            data = data.sort((a,b) => req.query.sort === 'DESC' ? b.value - a.value : a.value - b.value);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createHorizontalBarChartConfig(data, "Expenses Breakdown", options);
            let chartImg = await ChartService.createImage(config);
            chartImg = chartImg.replace("data:image/png;base64,", "");
            const filePath = path.join(__dirname, "expenses-breakdown.png");
            const buffer = Buffer.from(chartImg, 'base64');
            fs.writeFileSync(filePath, buffer);
            res.status(200).sendFile(filePath);
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
            const records = await MonthlyService.getAllData(db, filter);
            const data = AnalyticsService.convertMonthlyDbToExpenseOverTime(records);
            const options = {
                mono: req.query.mono === 'false' ? false : true,
            };
            const config = ChartService.createVerticalBarChartConfig(data, "Expenses Breakdown", options);
            let chartImg = await ChartService.createImage(config);
            chartImg = chartImg.replace("data:image/png;base64,", "");
            const filePath = path.join(__dirname, "expenses-breakdown.png");
            const buffer = Buffer.from(chartImg, 'base64');
            fs.writeFileSync(filePath, buffer);
            res.status(200).sendFile(filePath);
        } catch(e) {
            next(e);
        }
    },

}

module.exports = AnalyticsController;