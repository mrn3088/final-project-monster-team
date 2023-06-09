// Initialize arrays to store the counts of each browser type and language
var browserData = [
    { browserType: 'Chrome', count: 0, loadTimes: [] },
    { browserType: 'Firefox', count: 0, loadTimes: [] },
    { browserType: 'Safari', count: 0, loadTimes: [] },
    { browserType: 'Internet Explorer', count: 0, loadTimes: [] },
    { browserType: 'Other', count: 0, loadTimes: [] }
  ];

  // Fetch data for browser usage from your Express app
  axios.get('https://cse135.monster/api/static')
    .then(response => {
      // Your existing logic for browserData here
      var records = response.data;
      if (!Array.isArray(records)) {
        console.error('Response data is not an array:', records);
        return;
      }
      for (var i = 0; i < records.length; i++) {
        var userAgent = records[i].userAgent;
        if (userAgent.includes('Chrome')) {
          browserData[0].count++;
        } else if (userAgent.includes('Firefox')) {
          browserData[1].count++;
        } else if (userAgent.includes('Safari')) {
          browserData[2].count++;
        } else if (userAgent.includes('Internet Explorer')) {
          browserData[3].count++;
        } else {
          browserData[4].count++;
        }
      }
      // Update the ZingGrid with the new data
      document.getElementById('browserGrid').setData(browserData);
    })
    .catch(error => {
      console.error('Error fetching browser data:', error);
    });

    axios.get('https://cse135.monster/api/static')
    .then(response => {
      let languageData = [];

      let data = response.data;
      let enCount = 0;
      let zhCount = 0;

      for (let i = 0; i < data.length; i++) {
        let value = data[i];
        let language = value.language;

        if (language.includes("en-US")) {
          enCount++;
        } else if (language.includes("zh-CN")) {
          zhCount++;
        }
      }

      languageData.push({
        language: "en-US",
        count: enCount
      });

      languageData.push({
        language: "zh-CN",
        count: zhCount
      });

      // Update the ZingGrid with the new data
      document.getElementById('languageGrid').setData(languageData);
    })
    .catch(error => {
      console.error('Error fetching language data:', error);
    });

    
  // Fetch data for performance from your Express app
  axios.get('https://cse135.monster/api/performance')
    .then(response => {
      let loadTimes = [];
      let loadTimeCounts = {};

      let data = response.data;

      for (let i = 0; i < data.length; i++) {
        let value = data[i];
        let startLoad = value.pageStartLoad;
        let endLoad = value.pageEndLoad;
        let loadTime = endLoad - startLoad;

        loadTimes.push(loadTime);
        
        let browserType = value.browserType;

        // Find the corresponding browser data and add the load time
        for (let j = 0; j < browserData.length; j++) {
          if (browserData[j].browserType === browserType) {
            browserData[j].loadTimes.push(loadTime);
            break;
          }
        }
      }

      for (let i = 0; i < loadTimes.length; i++) {
        let loadTime = loadTimes[i];
        let zone = getLoadTimeZone(loadTime);

        if (!loadTimeCounts[zone]) {
          loadTimeCounts[zone] = 0;
        }

        loadTimeCounts[zone]++;
      }

      let totalLoadTimes = loadTimes.length;
      
      
      
      
      let loadTimeDistribution = [];

      for (let zone of loadTimeZones) {
        let count = loadTimeCounts[zone] || 0;
        let percentage = ((count / totalLoadTimes) * 100).toFixed(2);

        loadTimeDistribution.push({
          zone: zone,
          percentage: parseFloat(percentage)
        });
      }
              


      // Create the ZingChart configuration for load time distribution
      let loadTimeDistributionConfig = {
        type: 'bar',
        series: [
          {
            values: loadTimeDistribution.map(data => data.percentage),
            text: 'Load Time Distribution',
            backgroundColor: '#7E7E7E'
          }
        ],
        labels: {
          template: '%v%'
        },
        scaleX: {
          labels: loadTimeDistribution.map(data => data.zone),
          itemsOverlap: true,
          item: {
            angle: -45
          }
        },
        title : {
          text: "Load Time Distribution Chart"
        }
      };

      // Render the load time distribution chart
      zingchart.render({
        id: 'loadTimeDistributionChart',
        data: loadTimeDistributionConfig,
        // height: '400',
        // width: '600'
      });
       let browserAverageLoadTimes = browserData.map(data => {
        let averageLoadTime = calculateAverageLoadTime(data.loadTimes);
        return {
          browserType: data.browserType,
          averageLoadTime: parseFloat(averageLoadTime)
        };
      });

    })
    .catch(error => {
      console.error('Error fetching performance data:', error);
    });

  // Function to determine the load time zone
  function getLoadTimeZone(loadTime) {
    if (loadTime >= 0 && loadTime <= 100) {
      return '0-100 ms';
    } else if (loadTime > 100 && loadTime <= 200) {
      return '100-200 ms';
    } else if (loadTime > 200 && loadTime <= 300) {
      return '200-300 ms';
    } else if (loadTime > 300 && loadTime <= 400) {
      return '300-400 ms';
    } else {
      return '> 400 ms';
    }
  }

  let loadTimeZones = ['0-100 ms', '100-200 ms', '200-300 ms', '300-400 ms', '> 400 ms'];


  // Fetch data for performance and language from your Express app
  Promise.all([
    axios.get('https://cse135.monster/api/performance'),
    axios.get('https://cse135.monster/api/static')
  ])
    .then(([performanceResponse, languageResponse]) => {
      let loadTimeData = performanceResponse.data;
      let languageData = languageResponse.data;

      // Create an object to store language load time data
      let languageLoadTimeData = {};

      // Process load time data
      for (let i = 0; i < loadTimeData.length; i++) {
        let loadTimeItem = loadTimeData[i];
        let id = loadTimeItem.id;
        let loadTime = loadTimeItem.totalLoadTime;

        if (!languageLoadTimeData[id]) {
          languageLoadTimeData[id] = {
            loadTimes: [],
            language: ''
          };
        }

        languageLoadTimeData[id].loadTimes.push(loadTime);
      }

      // Process language data and calculate average load time
      let enLoadTimes = [];
      let zhLoadTimes = [];

      for (let i = 0; i < languageData.length; i++) {
        let languageItem = languageData[i];
        let id = languageItem.id;
        let language = languageItem.language;

        if (languageLoadTimeData[id]) {
          languageLoadTimeData[id].language = language;

          if (language === 'en-US') {
            enLoadTimes.push(...languageLoadTimeData[id].loadTimes);
          } else if (language === 'zh-CN') {
            zhLoadTimes.push(...languageLoadTimeData[id].loadTimes);
          }
        }
      }

      // Calculate average load time for each language
      let enAverageLoadTime = calculateAverageLoadTime(enLoadTimes);
      let zhAverageLoadTime = calculateAverageLoadTime(zhLoadTimes);

      // Create the ZingChart configuration for language and load time relationship
      let languageLoadTimeConfig = {
        type: 'bar',
        series: [
          {
            values: [parseFloat(enAverageLoadTime), parseFloat(zhAverageLoadTime)],
            text: 'Average Load Time',
            backgroundColor: '#582396'
          }
        ],
        labels: {
          template: '%v ms'
        },
        scaleX: {
          labels: ['en-US', 'zh-CN']
        },
        scaleY: {
          values: '0:400:100',
            label: {
              text: "Average Load Time (ms)"
            }
        },
        title: {
          text: "Average loading time for different languages"
        }
      };

      // Render the language and load time relationship chart
      zingchart.render({
        id: 'languageLoadTimeChart',
        data: languageLoadTimeConfig,
        height: '400',
        width: '100%'
      });
    })
    .catch(error => {
      console.error('Error fetching performance and language data:', error);
    });

  // Function to calculate the average load time
  function calculateAverageLoadTime(loadTimes) {
    if (loadTimes.length === 0) {
      return '0.00';
    }

    let sum = loadTimes.reduce((acc, val) => acc + val, 0);
    let averageLoadTime = sum / loadTimes.length;

    return averageLoadTime.toFixed(2); // Keep as string to maintain decimal precision
  }
  // Initialize objects to store the counts of each browser type and the total load times
  
  var browserLoadData = [
    { browserType: 'Chrome', count: 0, loadTimes: [] },
    { browserType: 'Firefox', count: 0, loadTimes: [] },
    { browserType: 'Safari', count: 0, loadTimes: [] },
    { browserType: 'Internet Explorer', count: 0, loadTimes: [] },
    { browserType: 'Other', count: 0, loadTimes: [] }
  ];
  // 创建一个对象来存储浏览器与加载时间的数据
  var browserLoadTimeData = {};

  // 从你的Express应用获取性能数据
  axios.get('https://cse135.monster/api/performance')
  .then(response => {
      // 处理加载时间数据
      var loadTimeRecords = response.data;
      if (!Array.isArray(loadTimeRecords)) {
        console.error('Response data is not an array:', loadTimeRecords);
        return;
      }
      for (var i = 0; i < loadTimeRecords.length; i++) {
        var id = loadTimeRecords[i].id;
        var loadTime = loadTimeRecords[i].totalLoadTime;

        if (!browserLoadTimeData[id]) {
          browserLoadTimeData[id] = {
            loadTimes: [],
            browser: ''
          };
        }

        browserLoadTimeData[id].loadTimes.push(loadTime);
      }
  })
  .then(() => {
      // 获取静态数据
      return axios.get('https://cse135.monster/api/static')
  })
  .then(response => {
      // 处理浏览器数据
      var browserRecords = response.data;
      if (!Array.isArray(browserRecords)) {
        console.error('Response data is not an array:', browserRecords);
        return;
      }
      for (var i = 0; i < browserRecords.length; i++) {
        var id = browserRecords[i].id;
        var userAgent = browserRecords[i].userAgent;

        if (browserLoadTimeData[id]) {
          if (userAgent.includes('Chrome')) {
            browserLoadTimeData[id].browser = 'Chrome';
            browserLoadData[0].count++;
            browserLoadData[0].loadTimes.push(...browserLoadTimeData[id].loadTimes);
          } else if (userAgent.includes('Firefox')) {
            browserLoadTimeData[id].browser = 'Firefox';
            browserLoadData[1].count++;
            browserLoadData[1].loadTimes.push(...browserLoadTimeData[id].loadTimes);
          } else if (userAgent.includes('Safari')) {
            browserLoadTimeData[id].browser = 'Safari';
            browserLoadData[2].count++;
            browserLoadData[2].loadTimes.push(...browserLoadTimeData[id].loadTimes);
          } else if (userAgent.includes('Internet Explorer')) {
            browserLoadTimeData[id].browser = 'Internet Explorer';
            browserLoadData[3].count++;
            browserLoadData[3].loadTimes.push(...browserLoadTimeData[id].loadTimes);
          } else {
            browserLoadTimeData[id].browser = 'Other';
            browserLoadData[4].count++;
            browserLoadData[4].loadTimes.push(...browserLoadTimeData[id].loadTimes);
          }
        }
      }

      // 计算每种浏览器的平均加载时间
      for (var i = 0; i < browserLoadData.length; i++) {
        var totalLoadTime = browserLoadData[i].loadTimes.reduce((a, b) => a + b, 0);
        var averageLoadTime = totalLoadTime / browserLoadData[i].loadTimes.length;
        browserLoadData[i].averageLoadTime = averageLoadTime;
      }

      // 更新ZingGrid的数据
      document.getElementById('browserGrid').setData(browserLoadData);

      // 计算平均加载时间的函数
      function calculateAverageLoadTime(loadTimes) {
        var totalLoadTime = loadTimes.reduce((a, b) => a + b, 0);
        var result = totalLoadTime / loadTimes.length;
        return result.toFixed(2);
      }

      // Calculate average load time for each browser
      // Create the ZingChart configuration for browser and load time relationship
      
      

      var myConfig = {
        type: "bar",
        title: {
          text: "Average Load Time by Browser",
          fontSize: 24,
        },
        scaleX: {
          labels: browserLoadData.map(item => item.browserType),
        },
        scaleY: {
          label: {
            text: "Average Load Time (ms)"
          }
        },
        series: [
          {
            values: browserLoadData.map(item => item.averageLoadTime),
            text: 'Average Browser Load Time ',
            backgroundColor: '#FFA500'
          }
        ],
        labels: {
          template: 'Load Time: %v ms'
        }
      };


      
      // 渲染图表
      zingchart.render({
        id: "browserLoadTimeChart",
        data: myConfig,
        height: 400,
        width: "100%"
      });

      })
      .catch(error => {
        console.error('Error:', error);
  });