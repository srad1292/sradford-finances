const AnalyticsService = require("./analytics.service");
const Database = require("../../db");
const MonthlyService = require("../monthly/monthly.service");
const path = require('path');
const fs = require('fs');


AnalyticsController = {
    getImage: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            console.log(filter);
            const records = await MonthlyService.getAllData(db, filter);
            const result = records.map(r => MonthlyService.convertMonthlyDbToJson(r));
            let chartImg = await AnalyticsService.createImage();
            chartImg = chartImg.replace("data:image/png;base64,", "");
            // console.log(chartImg);
            const filePath = path.join(__dirname, "example-chart.png");
            const buffer = Buffer.from(chartImg, 'base64');
            fs.writeFileSync(filePath, buffer);
            res.status(200).sendFile(filePath);
        } catch(e) {
            next(e);
        }
    },

}

module.exports = AnalyticsController;