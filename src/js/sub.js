/* 색상 변경(공통) */
const savedTheme = localStorage.getItem("userTheme");
if (savedTheme) {
  const themes = {
    basic: { main: "#4c8ce4", light: "#A6C6F1" },
    green: { main: "#5bbf7a", light: "#A8DFB8" },
    pink: { main: "#f0857a", light: "#F7C0BB" },
    orange: { main: "#ffc81e", light: "#FFE99A" },
    purple: { main: "#8b7ec8", light: "#C4BDE8" },
    gray: { main: "#a5abbd", light: "#D4D7DF" },
  };
  document.documentElement.style.setProperty(
    "--main_color",
    themes[savedTheme].main,
  );
  /* var의 연한 색상 */
  document.documentElement.style.setProperty(
    "--main_color_light",
    themes[savedTheme].light,
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
  /* css의 root 값을 불러오는 기능(공백 제외) */
  const mainVarColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--main_color")
    .trim();
  const subVarColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--main_color_light")
    .trim();
  return maxData.map((value) =>
    value === maxValue ? mainVarColor : subVarColor,
  );
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
    /* 탭 버튼 효과 */
    chartBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    /* 탭 + 대사 효과 */
    const bubble = document.querySelector(".mascot-bubble p");

    if (btn.textContent === "주간") {
      updateChart(
        chartData.weekly,
        chartData.weeklyLabels,
        chartData.weeklyConfig,
      );
      mascotMessage.showMessage("weekly");
    } else {
      updateChart(
        chartData.monthly,
        chartData.monthlyLabels,
        chartData.monthlyConfig,
      );
      mascotMessage.showMessage("monthly");
    }
  });
});

/* === 타이핑 효과 === */
const mascotMessage = {
  currentTypeInterval: null,
  messages: {
    weekly: [
      "완벽하지 않아도 괜찮아요!",
      "쉴 땐 확실히 쉬는 것도 중요해요.",
      "이번 주는 어땠나요? 항상 응원해요.",
    ],
    monthly: [
      "돌아보면 많은 걸 해냈을 거예요.",
      "꾸준히 보다는, 멈추지 않는 게 중요해요.",
      "행복한 한 달이 되었길 바라요!",
    ],
  },
  init: function () {
    this.showMessage("weekly");
  },
  showMessage: function (type) {
    const bubble = document.querySelector(".mascot-bubble p");
    this.showRandomBubble(bubble, type);
  },
  typeEffect: function (element, text) {
    clearInterval(this.currentTypeInterval);
    element.textContent = "";
    let typeIndex = 0;

    this.currentTypeInterval = setInterval(() => {
      element.textContent += text[typeIndex];
      typeIndex++;
      if (typeIndex >= text.length) {
        clearInterval(this.currentTypeInterval);
      }
    }, 45);
  },
  /* 주간/월간 구별이 필요하므로 type 인자 */
  showRandomBubble: function (bubble, type) {
    const messageList = this.messages[type];

    /* 몇 번째를 꺼낼 것인지? */
    const randomIndex = Math.floor(Math.random() * messageList.length);
    /* 실제로 꺼내기(캐릭터 대사) */
    const randomBubble = messageList[randomIndex];
    this.typeEffect(bubble, randomBubble);
  },
};
mascotMessage.init();
