/* 색상 변경(공통) */
const savedTheme = localStorage.getItem("userTheme");
if (savedTheme) {
  const themes = {
    basic: "#4c8ce4",
    green: "#5BBF7A",
    pink: "#F0857A",
    orange: "#F0C355",
    purple: "#8B7EC8",
    gray: "#a5abbd",
  };
  document.documentElement.style.setProperty(
    "--main_color",
    themes[savedTheme],
  );
}
const todoChart = document.getElementById("todo-chart");
const chartInner = document.querySelector(".chart-inner");
const chartMainTitle = document.querySelector(".main-title");
const chartSubTitle = document.querySelector(".sub-title");
const reportTitle = document.querySelector(".report-title");
const dateTitle = document.querySelector(".date-title");
const dateDay = document.querySelector(".date-day");

/* === 기본 데이터 === */
const chartData = {
  /* 주간 */
  weekly: [30, 75, 10, 20, 50, 30, 60],
  weeklyLabels: ["2일", "3일", "4일", "5일", "6일", "7일", "8일"],
  weeklyConfig: {
    mainTitle: "2026년 4월",
    subTitle: "주간 총 달성률",
    reportTitle: "주간 요약 리포트",
    dateTitle: "가장 활발한 요일",
    dateDay: "금요일",
    chartWidth: "100%",
  },
  /* 월간 */
  monthly: [20, 60, 20, 40, 10, 80, 50, 20, 15, 35, 40, 60],
  monthlyLabels: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthlyConfig: {
    mainTitle: "2026년",
    subTitle: "월간 총 달성률",
    reportTitle: "월간 요약 리포트",
    dateTitle: "가장 활발한 달",
    dateDay: "6월",
    chartWidth: "520px",
  },
};
/* === 주간/월간 별 최댓값 bar 색상 === */
const updateMaxColors = (maxData) => {
  const maxValue = Math.max.apply(null, maxData);
  return maxData.map((value) => (value === maxValue ? "#4C8CE4" : "#A6C6F1"));
};
/* === 주간/월간 리포트 === */
// 1. UI 데이터
const updateChart = (data, labels, config) => {
  // 제목(년, 월), 소제목들, 리포트 내의 UI 텍스트들
  chartMainTitle.textContent = config.mainTitle;
  chartSubTitle.textContent = config.subTitle;
  reportTitle.textContent = config.reportTitle;
  dateTitle.textContent = config.dateTitle;
  dateDay.textContent = config.dateDay;
  chartInner.style.width = config.chartWidth;

  // 차트의 레이블, 데이터, 최댓값 bar 컬러
  allChart.data.labels = labels;
  allChart.data.datasets[0].data = data;
  allChart.data.datasets[0].backgroundColor = updateMaxColors(data);
  updateReport(data);
  allChart.update();
};
// 2. 내부(실질) 데이터
const updateReport = (reportData) => {
  const taskTotal = document.querySelector(".task-total");
  const taskPercent = document.querySelector(".task-percent");

  // 총합, 평균 달성률
  const taskTotalDone = reportData.reduce((sum, taskItem) => sum + taskItem, 0);
  taskTotal.textContent = `총 ${taskTotalDone}회`;
  const taskAvgRate = Math.round(taskTotalDone / reportData.length);
  taskPercent.textContent = `${taskAvgRate}%`;
};

/* === 차트 === */
const allChart = new Chart(todoChart, {
  type: "bar",
  data: {
    labels: chartData.weeklyLabels,
    datasets: [
      {
        data: chartData.weekly,
        // barThickness: 20,
        borderRadius: 5,
        /* bar 간격, 커질수록 가까워짐, thinkness 활성화 시 미작동 */
        barPercentage: 0.65,
        /* 바닥 경계 무시 = 아래 radius 적용 됨 */
        borderSkipped: false,
        backgroundColor: updateMaxColors(chartData.weekly),
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
        ticks: {
          /* label이 스킵(생략)되지 않고 모든 값을 띄울 수 있도록 false */
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
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
updateChart(chartData.weekly, chartData.weeklyLabels, chartData.weeklyConfig);

/* === 주간/월간 tab === */
const chartBtns = document.querySelectorAll(".chart-btn li");
chartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    chartBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    if (btn.textContent === "주간") {
      updateChart(
        chartData.weekly,
        chartData.weeklyLabels,
        chartData.weeklyConfig,
      );
    } else {
      updateChart(
        chartData.monthly,
        chartData.monthlyLabels,
        chartData.monthlyConfig,
      );
    }
  });
});
