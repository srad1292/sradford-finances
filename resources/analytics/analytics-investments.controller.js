const InvestmentsService = require('../investments/investments.service');
const AnalyticsInvestmentsService = require("./analytics-investments.service");
const Database = require("../../db");
const APIException = require("../../errors/api_exception");
const ChartService = require("./chart.service");


const AnalyticsInvestmentsController = {

    getNetContributionsVsGainsByMonth: async (req, res, next) => {

    },
    getNetContributionsVsGainsByYear: async (req, res, next) => {

    },
    getNetContributionsByMonth: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            sort: req.query.sort,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const records = await InvestmentsService.getNetContributionsByMonth(db, filter);
        const data = AnalyticsInvestmentsService.convertNetContributionsByMonth(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createVerticalBarChartConfig(data, "Net Contributions By Month", options);
        AnalyticsController.createAndSendImage(config, "net-contributions-by-month.png", res);
    },
    getNetContributionsByYear: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            from: req.query.from,
            to: req.query.to,
        }
        const records = await InvestmentsService.getNetContributionsByYear(db, filter);
        const data = AnalyticsInvestmentsService.convertNetContributionsByYear(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createVerticalBarChartConfig(data, "Net Contributions By Year", options);
        AnalyticsController.createAndSendImage(config, "net-contributions-by-year.png", res);
    },
    getGainsByMonth: async (req, res, next) => {},
    getGainsByYear: async (req, res, next) => {},
    getGrowthByMonth: async (req, res, next) => {},
    getGrowthByYear: async (req, res, next) => {},
}

module.exports = AnalyticsInvestmentsController;