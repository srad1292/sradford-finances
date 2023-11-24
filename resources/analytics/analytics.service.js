const { ChartJSNodeCanvas  } = require('chartjs-node-canvas');

AnalyticsService = {
    createImage: async (configuration, height = 800, width = 800) => {
        const chartJSNodeCanvas = new ChartJSNodeCanvas ({ type: 'png', width: width, height: height });
        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration); // converts chart to image
        return dataUrl;
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
            type: 'pie',
            data: {
                labels: data.map(i => i.label),
                datasets: [
                    {
                        label: label,
                        data: data.map(i => i.value),
                        backgroundColor: AnalyticsService.getChartColors(data),
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
    createLineConfig: () => {
        return {
            type: 'line',   // for line chart
              data: {
                  labels: [150,300,450,600,750,900,1050,1200,1350,1500],
                  datasets: [{
                      label: "sample 1",
                      data: [100,43],
                      fill: false,
                      borderColor: ['rgba(255, 99, 132, 1)'],
                      borderWidth: 1,
                      xAxisID: 'xAxis1' //define top or bottm axis ,modifies on scale
                  },
                  {
                      label: "sample 2",
                      data: [72,83],
                      fill: false,
                      borderColor: ['rgba(265, 99, 132, 1)'],
                      borderWidth: 1,
                      xAxisID: 'xAxis1'
                  },
                  {
                      label: "sample3",
                      data: [30,56],
                      fill: false,
                      borderColor: ['rgba(235, 99, 122, 1)'],
                      borderWidth: 1,
                      xAxisID: 'xAxis1'
                  }
                  ],  
              },
              options: {
                      scales: {
                      xAxes:[
                          {
                          id:'xAxis1',
                          position: 'bottom',
                          type:"category",
    
                          },
                          {
                          id:'xAxis2',
                          position: 'top',
                          type:"category",
                          ticks:{
                              callback: function(value, index, values) {
                                  return xLabels[index];  // gives points of top x axis
                              }
                      },
                  }],
                      yAxes: [{
                      display: true,
                      ticks: {
                          max: 200,
                          stepSize: 10, //defines y axis step scale
                      }
                  }]
              ,
                  }
              }
            }
    },
    getChartColors: (data) => {
        let basicColors = [
            'rgb(212, 44, 6)',
            'rgb(20, 150, 20)',
            'rgb(237, 157, 38)',
            'rgb(65, 250, 228)',
            'rgb(247, 230, 96)',
            'rgb(147, 51, 212)',
            'rgb(116, 237, 9)',
            'rgb(242, 124, 126)',
            'rgb(54, 52, 46)',
            'rgb(124, 222, 242)',
            'rgb(240, 134, 29)',
            'rgb(65, 158, 104)',
            'rgb(204, 80, 133)',
            'rgb(105, 101, 230)',
        ];
        let result = [];
        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
        for(let i = 0; i < data.length; i++) {
            if(i < basicColors.length) {
                result.push(basicColors[i]);
            } else {
                result.push(randomBetween(0, 207), randomBetween(0, 207), randomBetween(0, 207));
            }
        }
        return result;
    }
}


module.exports = AnalyticsService;
