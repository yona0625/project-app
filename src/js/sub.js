const todoChart = document.getElementById("todo-chart");
const chartData = {
  weekly: [30, 75, 10, 20, 50, 30, 60],
  labels: ["2일", "3일", "4일", "5일", "6일", "7일", "8일"],
};
const maxValue = Math.max.apply(null, chartData.weekly);
const varColors = [];
chartData.weekly.forEach((value) => {
  /* 가장 높은 값이면 더 진한 색 처리 */
  if (value === maxValue) {
    varColors.push("#4C8CE4");
  } else {
    varColors.push("#A6C6F1");
  }
});

new Chart(todoChart, {
  type: "bar",
  data: {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.weekly,
        // barThickness: 20,
        borderRadius: 5,
        /* bar 간격, 커질수록 가까워짐, thinkness 활성화 시 미작동 */
        barPercentage: 0.65,
        /* 바닥 경계 무시 = 아래 radius 적용 됨 */
        borderSkipped: false,
        backgroundColor: varColors,
      },
    ],
  },
  options: {
    /* 부모 영역에 맞춤, 2개 세트로 작성 */
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        /* 0부터 100까지 단위 25씩 */
        ticks: {
          /* y축의 글자를 왼쪽 정렬 */
          crossAlign: "far",
          stepSize: 25,
          /* = callback: function (value) {return value + "%";} */
          callback: (value) => value + "%",
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        top: 30,
        bottom: 15,
        left: 15,
        right: 15,
      },
    },
    plugins: {
      /* 범례 제거 */
      legend: {
        display: false,
      },
    },
  },
});
