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

    // 计算bounce rate
    var bounceRate = bounceValue / totalValue;

    // 更新ZingGrid的数据
    document.getElementById('stayTimesGrid').setData(stayTimesData);

    // 创建饼图展示bounce rate和其他比例
    var pieConfig = {
      type: 'pie',
      title: {
        text: 'Bounce Rate',
        fontSize: 24,
      },
      series: [
        { text: 'Bounce', values: [bounceValue] },
        { text: 'Non-Bounce', values: [totalValue - bounceValue] }
      ]
    };

    // 渲染饼图
    zingchart.render({
      id: 'bounceRatePie',
      data: pieConfig,
      height: 400,
      width: '100%'
    });

    // 计算完停留时间数据后，构造ZingChart需要的数据格式
    var barConfig = {
      type: 'bar',
      title: {
        text: 'Number of Records by Stay Time',
        fontSize: 24,
      },
      scaleX: {
        label: {
          text: 'Stay Time Range'
        },
        values: stayTimesData.map(item => item.range),
      },
      series: stayTimesData.map(item => ({
        text: item.range,
        values: [item.count]
      }))
    };

    // 渲染条形图
    zingchart.render({
      id: 'stayTimesBar',
      data: barConfig,
      height: 400,
      width: '100%'
    });
  });
