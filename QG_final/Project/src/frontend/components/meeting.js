let template = /* html */ `
<link rel="stylesheet" href="./css/meeting.css">
<div id="meeting">
    <div class="meeting-wrapper">
        <div class="up">
            <div class="left">
                <h2>会议数据可视化</h2>
                <div class="meeting-info">
                    <span class="name">会议名称</span>
                    <span class="time">会议时间</span>
                    <span class="schedule_time">计划人数</span>
                    <span class="update_time">数据最后更新时间</span>
                    <span class="view_count">页面查看次数</span>
                </div>
            </div>

            <div class="right">
                <div class="chart-wrapper square">
                    出勤情况
                    <canvas id="attandanceChart"></canvas>
                </div>
                <div class="chart-wrapper square">
                    男女比例
                    <canvas id="sexChart"></canvas>
                </div>
            </div>
        </div>


        <div class="down">
            <div class="chart-wrapper group">
                参会人员组别
                <canvas id="groupChart"></canvas>
            </div>
            <div class="chart-wrapper speak">
                发言时长可视化
                <canvas id="speakTimeChart"></canvas>
            </div>
        </div>

    </div>
</div>
`
var chartGroup = {};

function render() {
    const ctx = document.getElementById('speakTimeChart');
    chartGroup.speakTimeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0分钟以内', '10-30分钟', '30-50分钟', '50分钟以上'],
        datasets: [{
          label: '发言时长',
          data: [12, 19, 3, 5],
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)'
          ],
          borderRadius: 8,
        }]
      },
      options: {
        barThickness: 40,
        animation: {
          duration: 2000, // 2秒的动画效果
          easing: 'easeInOutQuart' // 使用缓动函数
        },
        scales: {
          x: {
            grid: {
              display: false // 隐藏x轴网格线
            },
            ticks: {
              font: {
                size: 14 // 调整x轴刻度的字体大小
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)' // 设置y轴网格线颜色
            },
            ticks: {
              font: {
                size: 14 // 调整y轴刻度的字体大小
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true, // 显示图例
            labels: {
              font: {
                size: 16 // 调整图例字体大小
              }
            }
          }
        }
      }
    });
    
    const ctx2 = document.getElementById('groupChart');

    chartGroup.groupChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['前端', '后台', '嵌入式', '移动', '人工智能', '图形', '设计'],
        datasets: [{
          label: '参会人数',
          data: [35, 28, 20, 15, 22, 18, 25],
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)',
            'rgba(153, 102, 255)',
            'rgba(255, 159, 64)',
            'rgba(128, 128, 128)'
          ],
          borderRadius: 8,
        }]
      },
      options: {
        barThickness: 40,
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 14
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                size: 14
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false // 隐藏图例
          }
        }
      }
    });

    // 出勤与缺勤人数比例图
    const ctx3 = document.getElementById('attandanceChart');
    groupChart.attandanceChart = new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['出勤', '缺勤'],
        datasets: [{
          label: '出勤与缺勤人数比例',
          data: [75, 25], // 举例数据，根据实际情况修改
          backgroundColor: [
            'rgba(54, 162, 235, 1)', // 蓝色
            'rgba(255, 99, 132, 1)' // 红色
          ],
          borderRadius: 8,
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'black' // 设置图例文本颜色
            }
          }
        }
      }
    });

    // 男女比例图
    const ctx4 = document.getElementById('sexChart');
    attandanceChart.sexChart = new Chart(ctx4, {
      type: 'doughnut',
      data: {
        labels: ['男', '女'],
        datasets: [{
          label: '男女比例',
          data: [60, 40], // 举例数据，根据实际情况修改
          backgroundColor: [
            'rgba(54, 162, 235, 1)', // 蓝色
            'rgba(255, 99, 132, 1)' // 红色
          ],
          borderRadius: 8,
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'black' // 设置图例文本颜色
            }
          }
        }
      }
    });

}


export { template as meetingHTML, render as meetingRender, chartGroup};