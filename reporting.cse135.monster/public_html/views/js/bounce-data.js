// 初始化bounce value和总量
var bounceValue = 0;
var totalValue = 0;

// 初始化停留时间的各个范围的数量
var stayTimesData = [
  { range: '5 seconds and less', count: 0 },
  { range: '5 seconds to 1 minute', count: 0 },
  { range: '1 to 20 minutes', count: 0 },
  { range: 'More than 20 minutes', count: 0 }
];

// 从Express应用获取活动记录数据
axios.get('https://cse135.monster/api/activity')
  .then(response => {
    var records = response.data;
    if (!Array.isArray(records)) {
      console.error('Response data is not an array:', records);
      return;
    }
    for (var i = 0; i < records.length; i++) {
      var timeEntered = new Date(records[i].timeEntered);
      var timeLeft = new Date(records[i].timeLeft);

      // 计算停留时间（以秒为单位）
      var stayTimeInSeconds = (timeLeft - timeEntered) / 1000;

      // 归入不同的停留时间范围
      if (stayTimeInSeconds <= 5) {
        stayTimesData[0].count++;
        // 如果停留时间在5秒以内，则将bounce value增加1
        bounceValue++;
      } else if (stayTimeInSeconds <= 60) {
        stayTimesData[1].count++;
      } else if (stayTimeInSeconds <= 1200) {
        stayTimesData[2].count++;
      } else {
        stayTimesData[3].count++;
      }

      // 总量增加1
      totalValue++;
    }
    
    var bounceRate = bounceValue / totalValue;
    document.getElementById('stayTimesGrid').setData(stayTimesData);
    

    // 计算完停留时间数据后，构造ZingChart需要的数据格式
    
    // 计算完停留时间数据后，构造ZingChart需要的数据格式
    var barConfig = {
        type: 'bar',
        title: {
          text: 'Number of Records by Stay Time',
          fontSize: 24,
        },
        scaleX: {
          labels: stayTimesData.map(item => item.range),
          itemsOverlap: true,
          item: {
            angle: 0
          }
        },
        series: [
          {
            values: stayTimesData.map(item => item.count),
            text: 'Stay Time Distribution',
            backgroundColor: '#6B8E23',
          }
        ],
        labels: {
          template: '%v'
        }
      };
  
      // 渲染条形图
      zingchart.render({
        id: 'stayTimesBar',
        data: barConfig,
        height: 400,
        width: '100%'
      });
  
    

    // 创建饼图展示bounce rate和其他比例
    
    var pieConfig = {
        type: "pie",
        plot: {
          borderColor: "#2B313B",
          borderWidth: 5,
          // slice: 90,
          valueBox: {
            placement: 'out',
            text: '%t\n%npv%',
            fontFamily: "Open Sans"
          },
          tooltip: {
            fontSize: '18',
            fontFamily: "Open Sans",
            padding: "5 10",
            text: "%npv%"
          },
          animation: {
            effect: 2,
            method: 5,
            speed: 900,
            sequence: 1,
            delay: 3000
          }
        },
        source: {
          text: 'gs.statcounter.com',
          fontColor: "#8e99a9",
          fontFamily: "Open Sans"
        },
        title: {
          fontColor: "#8e99a9",
          text: 'Bounce Rate',
          align: "left",
          offsetX: 10,
          fontFamily: "Open Sans",
          fontSize: 25
        },
        subtitle: {
          offsetX: 10,
          offsetY: 10,
          fontColor: "#8e99a9",
          fontFamily: "Open Sans",
          fontSize: "16",
          text: 'June 2023',
          align: "left"
        },
        plotarea: {
          margin: "20 0 0 0"
        },
        series: [
            { text: 'Bounce (Less Than 5s)', values: [bounceValue] },
            { text: 'Non-Bounce', values: [totalValue - bounceValue] }
        ],
      };
    // 渲染饼图
    zingchart.render({
      id: 'bounceRatePie',
      data: pieConfig,
      height: 400,
      width: '100%'
    });

  });