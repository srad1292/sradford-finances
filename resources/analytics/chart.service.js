const { ChartJSNodeCanvas  } = require('chartjs-node-canvas');
const Convert = require('../../utils/snake_and_camel');

ChartService = {
    basicColors: [
        'rgb(65, 158, 104)',
        'rgb(242, 124, 126)',
        'rgb(65, 250, 228)',
        'rgb(237, 157, 38)',
        'rgb(147, 51, 212)',
        'rgb(247, 230, 96)',
        'rgb(116, 237, 9)',
        'rgb(212, 44, 6)',
        'rgb(54, 52, 46)',
        'rgb(124, 222, 242)',
        'rgb(240, 134, 29)',
        'rgb(20, 150, 20)',
        'rgb(204, 80, 133)',
        'rgb(105, 101, 230)',
    ],
    gray: 'rgb(232,230,230)',
    createImage: async (configuration, height = 1000, width = 1000) => {
        const chartJSNodeCanvas = new ChartJSNodeCanvas ({ type: 'png', width: width, height: height });
        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration); // converts chart to image
        return dataUrl;
    },
    createVerticalBarChartConfig: (data, title, options) => {
        const labels = data.map(i => Convert.snakeToTitle(i.label));
        const vertData = data.map(i => i.value);
        return config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: vertData,
                        backgroundColor: options.mono === false ? ChartService.getChartColors(data) : 'rgb(110, 178, 230)',
                    }
                ]
            },
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: false
                    },
                }
            }
        };
    },
    createStackedBar: (stackedDataSets, title, options) => {
        return {
            type: 'bar',
            data: {
                labels: stackedDataSets.labels.map(i => Convert.snakeToTitle(i)),
                datasets: stackedDataSets.datasets.map((dataset, i) => { 
                    return {
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: i === 0 ? ChartService.gray : i < ChartService.basicColors.length ? ChartService.basicColors[i-1] : ChartService.getRandomColor(),
                        borderColor: i === 0 ? ChartService.gray : i < ChartService.basicColors.length ? ChartService.basicColors[i-1] : ChartService.getRandomColor(),
                    };
                }),
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                      },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: options.showLegend === true,
                    },
                }
            }
        };
    },
    createDoubleVerticalBarChartConfig: (datasets, title, options) => {
        return config = {
            type: 'bar',
            data: {
                labels: datasets[0].data.map(i => Convert.snakeToTitle(i.label)),
                datasets: datasets.map((dataset, i) => { 
                    return {
                        label: dataset.label,
                        data: dataset.data.map(i => i.value),
                        backgroundColor: i < ChartService.basicColors.length ? ChartService.basicColors[i] : ChartService.getRandomColor(),
                        borderColor: i < ChartService.basicColors.length ? ChartService.basicColors[i] : ChartService.getRandomColor(),
                    };
                }),
            },
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: options.showLegend === true,
                    },
                }
            }
        };
    },
    createHorizontalBarChartConfig: (data, title, options = {}) => {
        return config = {
            type: 'bar',
            data: {
                labels: data.map(i => Convert.snakeToTitle(i.label)),
                datasets: [
                    {
                        data: data.map(i => i.value),
                        backgroundColor: options.mono === false ? ChartService.getChartColors(data) : 'rgb(110, 178, 230)',
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: false
                    },
                }
            }
        };
    },
    /**
     * 
     * @param {String} label 
     * @param {[{key: string, value: number}]} data 
     * @param {String} title 
     * @returns DoughnutConfig
     */
    createDoughnutChartConfig: (label, data, title = "") => {
        return {
            type: 'doughnut',
            data: {
                labels: data.map(i => i.label),
                datasets: [
                    {
                        label: label,
                        data: data.map(i => i.value),
                        backgroundColor: ChartService.getChartColors(data),
                        hoverOffset: 2
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: title !== "",
                        text: title
                    }
                }
            }
        };
    },
    createPieChartConfig: (label, data, title = "") => {
        return {
            type: 'doughnut',
            data: {
                labels: data.map(i => i.label),
                datasets: [
                    {
                        label: label,
                        data: data.map(i => i.value),
                        backgroundColor: ChartService.getChartColors(data),
                        hoverOffset: 2
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: title !== "",
                        text: title
                    }
                }
            }
        };
    },
    createLineConfig: (datasets, title, options = {}) => {
        return config = {
            type: 'line',
            data: {
                labels: datasets[0].data.map(i => Convert.snakeToTitle(i.label)),
                datasets: datasets.map((dataset, i) => { 
                    return {
                        label: dataset.label,
                        data: dataset.data.map(i => i.value),
                        backgroundColor: options.mono === false || datasets.length > 1 ? ChartService.basicColors[i] : 'rgb(110, 178, 230)',
                        borderColor: options.mono === false || datasets.length > 1 ? ChartService.basicColors[i] : 'rgb(110, 178, 230)',
                    };
                }),
            },
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: options.showLegend === true,
                    },
                }
            }
        };
    },
    getChartColors: (data) => {
        let result = [];
        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
        for(let i = 0; i < data.length; i++) {
            if(i < ChartService.basicColors.length) {
                result.push(ChartService.basicColors[i]);
            } else {
                result.push(ChartService.getRandomColor());
            }
        }
        return result;
    },
    getRandomColor: () => {
      const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      return `rgb(${randomBetween(0, 207)}, ${randomBetween(0, 207)}, ${randomBetween(0, 207)})`;  
    }
}


module.exports = ChartService;
