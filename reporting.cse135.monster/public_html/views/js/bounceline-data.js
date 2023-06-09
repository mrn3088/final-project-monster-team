// 获取和解析数据
axios.get('https://cse135.monster/api/activity')
  .then(response => {
    let activityRecords = response.data;

    // 将 timeEntered 和 timeLeft 从字符串转换为 Date 对象
    activityRecords.forEach(record => {
      record.timeEntered = new Date(record.timeEntered);
      record.timeLeft = new Date(record.timeLeft);
    });

    // 按照 timeEntered 对记录进行排序
    activityRecords.sort((a, b) => a.timeEntered - b.timeEntered);

    // 用来保存每天的跳出次数和总访问次数的对象
    let dailyData = {};

    // 遍历所有的记录
    activityRecords.forEach(record => {
      // 根据 timeEntered 计算哪一天
      let day = record.timeEntered.toISOString().slice(0, 10);

      // 如果这一天还没有数据，就初始化数据
      if (!dailyData[day]) {
        dailyData[day] = {
          bounceCount: 0,
          totalCount: 0
        };
      }

      // 如果停留时间小于5秒，就增加跳出次数
      if ((record.timeLeft - record.timeEntered) / 1000 < 5) {
        dailyData[day].bounceCount++;
      }

      // 总访问次数总是增加
      dailyData[day].totalCount++;
    });

    // 计算每天的跳出率并生成图表的数据
    let chartData = [];
    for (let day in dailyData) {
      let bounceRate = dailyData[day].bounceCount / dailyData[day].totalCount;
      chartData.push({day, bounceRate});
    }

    // 创建图表
    var myConfig = {
      type: 'line',
      title: {
        text: 'Daily Bounce Rate',
        fontSize: 24,
      },
      scaleX: {
        label: {
          text: 'Day'
        },
        values: chartData.map(data => data.day),
      },
      scaleY: {
        label: {
          text: 'Bounce Rate'
        },
      },
      series: [
        {
          values: chartData.map(data => data.bounceRate),
          lineColor: "#007790", // 设置线的颜色
          marker: {
            backgroundColor: "#007790" // 设置点的颜色
          }
        }
      ],
    };

    // 渲染图表
    zingchart.render({
      id: 'bounceRateLine',
      data: myConfig,
      height: 400,
      width: '100%'
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
