const InvestmentsService = require('../investments/investments.service');
const AnalyticsInvestmentsService = require("./analytics-investments.service");
const Database = require("../../db");
const APIException = require("../../errors/api_exception");
const ChartService = require("./chart.service");


const AnalyticsInvestmentsController = {
    getStackedByMonth: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            sort: req.query.sort,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const records = await InvestmentsService.getAllRecords(db, filter);
        const stackedDataSets = AnalyticsInvestmentsService.convertStackedByMonth(records);
        const options = {
            showLegend: true,
        };
        const config = ChartService.createStackedBar(stackedDataSets, "Monthly Investments Breakdown", options);
        AnalyticsController.createAndSendImage(config, "monthly-investments-breakdown.png", res);
    },
    getNetContributionsVsGainsByMonth: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            sort: req.query.sort,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const records = await InvestmentsService.getNetContributionsVsGainsByMonth(db, filter);
        const netDataSet = AnalyticsInvestmentsService.convertNetContributionsByMonth(records);
        const gainsDataSet = AnalyticsInvestmentsService.convertGainsByMonth(records);
        const dataSets = [
            {label: 'Net Contributions', data: netDataSet},
            {label: 'Gains', data: gainsDataSet}
        ];
        const options = {
            mono: req.query.mono === 'false' ? false : true,
            showLegend: true,
        };

        const config = ChartService.createLineConfig(dataSets, "Net Contributions vs Gains - By Month", options);
        AnalyticsController.createAndSendImage(config, "net-contributions-vs-gains-by-month.png", res);
    },
    getNetContributionsVsGainsByYear: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            from: req.query.from,
            to: req.query.to,
        }
        const records = await InvestmentsService.getNetContributionsVsGainsByYear(db, filter);
        const netDataSet = AnalyticsInvestmentsService.convertNetContributionsByYear(records);
        const gainsDataSet = AnalyticsInvestmentsService.convertGainsByYear(records);
        const dataSets = [
            {label: 'Net Contributions', data: netDataSet},
            {label: 'Gains', data: gainsDataSet}
        ];
        const options = {
            mono: req.query.mono === 'false' ? false : true,
            showLegend: true,
        };
        const config = ChartService.createLineConfig(dataSets, "Net Contributions vs Gains - By Year", options);
        AnalyticsController.createAndSendImage(config, "net-contributions-vs-gains-by-year.png", res);
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
    getGainsByMonth: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            sort: req.query.sort,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const records = await InvestmentsService.getGainsByMonth(db, filter);
        const data = AnalyticsInvestmentsService.convertGainsByMonth(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createVerticalBarChartConfig(data, "Gains By Month", options);
        AnalyticsController.createAndSendImage(config, "gains-by-month.png", res);
    },
    getGainsByYear: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            from: req.query.from,
            to: req.query.to,
        }
        const records = await InvestmentsService.getGainsByYear(db, filter);
        const data = AnalyticsInvestmentsService.convertGainsByYear(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createVerticalBarChartConfig(data, "Gains By Year", options);
        AnalyticsController.createAndSendImage(config, "gains-by-year.png", res);
    },
    getGrowthByMonth: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            sort: req.query.sort,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        }
        const records = await InvestmentsService.getGrowthByMonth(db, filter);
        const data = AnalyticsInvestmentsService.convertGrowthByMonth(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createLineConfig([{label: '', data}], "Growth By Month", options);
        AnalyticsController.createAndSendImage(config, "growth-by-month.png", res);
    },
    getGrowthByYear: async (req, res, next) => {
        const db = await Database.getDb();
        const filter = {
            from: req.query.from,
            to: req.query.to,
        }
        const records = await InvestmentsService.getGrowthByYear(db, filter);
        const data = AnalyticsInvestmentsService.convertGrowthByYear(records);
        const options = {
            mono: req.query.mono === 'false' ? false : true,
        };
        const config = ChartService.createLineConfig([{label: '', data}], "Growth By Year", options);
        AnalyticsController.createAndSendImage(config, "growth-by-year.png", res);
    },
}

module.exports = AnalyticsInvestmentsController;