const alarmFunction = {
  weekOrder: ["월", "화", "수", "목", "금", "토", "일"],
  ampm: ["오전", "오후"],
  hours: Array.from(
    {
      length: 12,
    },
    /* 시간은 1부터 시작하므로 + 1 */
    (_, i) => i + 1,
  ),
  minutes: Array.from(
    {
      length: 60,
    },
    (_, i) => i,
  ),
  alarmData: {
    ampm: "오전",
    hour: 7,
    minute: 0,
    days: [],
  },
  init: function () {
    this.renderAlarm(this.ampm, ".alarm-ampm", 0); // 오전
    this.renderAlarm(this.hours, ".alarm-hour", 6); // 7시 시작
    this.renderAlarm(this.minutes, ".alarm-minute", 0); // 00분
    this.timeSelect();
    this.daySelect();
    this.updateDayStatus();
  },
  resetAlarm: function () {
    this.alarmData = {
      ampm: "오전",
      hour: 7,
      minute: 0,
      days: [],
    };

    /* renderAlarm처럼 동일하게 7시로 초기화 */
    const ampmList = document.querySelector(".alarm-ampm");
    const hourList = document.querySelector(".alarm-hour");
    const minuteList = document.querySelector(".alarm-minute");
    const eachAlarmBlock = hourList.querySelector("li");

    setTimeout(() => {
      ampmList.scrollTop = 0;
      hourList.scrollTop = 6 * eachAlarmBlock.offsetHeight;
      minuteList.scrollTop = 0;
    }, 0);

    /* 오전/오후, 시간 스크롤, 버튼 스타일 초기화 */
    document.querySelectorAll(".day-item").forEach((day) => {
      day.classList.remove("select");
    });
    document.querySelector(".alarm-set").classList.remove("active");
    this.updateDayStatus();
  },
  /* 버튼 활성화 여부 */
  alarmCheck: function () {
    const alarmSetBtn = document.querySelector(".alarm-set");
    /* 나머지 데이터는 이미 있으니 요일이 하나라도 선택 되었다면 */
    if (this.alarmData.days.length > 0) {
      alarmSetBtn.classList.add("active");
    } else {
      alarmSetBtn.classList.remove("active");
    }
    this.updateDayStatus();
  },
  /* !== Object.entries로 배열의 key:value 가져오는 거랑 다름, 실제로 넘길 값 / 받을 곳 + index 추가 */
  renderAlarm: function (alarmData, dataTarget, defaultIndex) {
    const alarmDataList = document.querySelector(dataTarget);

    /* 여백을 만들어줘야 맨 상단을 가운데로 가져올 수 있음 */
    const emptyTopBlock = document.createElement("li");
    alarmDataList.appendChild(emptyTopBlock);

    /* 두 번째 인자 = 인덱스 */
    alarmData.forEach((item, i) => {
      /* 각각 한 칸 씩의 알람 설정 속 블록 */
      const eachAlarmBlock = document.createElement("li");
      eachAlarmBlock.textContent = item;
      if (i === defaultIndex) {
        eachAlarmBlock.classList.add("active");
        /* 7시로 스크롤 초기화, 인덱스 만큼 스크롤을 읽어서 내림 */
        setTimeout(() => {
          alarmDataList.scrollTop = i * eachAlarmBlock.offsetHeight;
        }, 0);
      }
      alarmDataList.appendChild(eachAlarmBlock);
    });

    /* 하단 여백 */
    const emptyBottomBlock = document.createElement("li");
    alarmDataList.appendChild(emptyBottomBlock);
  },
  timeSelect: function () {
    const timeItems = document.querySelectorAll(".alarm-item");
    timeItems.forEach((timeItem, index) => {
      timeItem.addEventListener("scroll", () => {
        /* 스크롤로 구분되는 오후/오전, 시간, 분을 한 칸인 높이 50으로 나누고, 스크롤(인덱스)로 선택된 특정 시간을 찾음 */
        const scrollIndex = Math.round(timeItem.scrollTop / 50);
        /* 만약 빈 li를 가리키면 통과(undefined가 뜸) */
        if (scrollIndex < 0) return;

        /* 볼드/크기 하이라이트 */
        /* 전체 특정 요소가 무엇이 올지 모르기 때문에 전체에서 active를 지우고 active에 붙이는 식으로 처리 */
        timeItem
          .querySelectorAll("li")
          .forEach((li) => li.classList.remove("active"));
        /* 앞뒤에 공백으로 li가 있으므로 +1을 해야 실제 데이터부터 시작 */
        const activeLi = timeItem.querySelectorAll("li")[scrollIndex + 1];
        if (activeLi) activeLi.classList.add("active");

        /* 순서대로 ampm, hour, minute */
        if (index === 0) this.alarmData.ampm = this.ampm[scrollIndex];
        if (index === 1) this.alarmData.hour = this.hours[scrollIndex];
        if (index === 2) this.alarmData.minute = this.minutes[scrollIndex];

        this.updateDayStatus();
      });
    });
  },
  daySelect: function () {
    const dayItems = document.querySelectorAll(".day-item");

    /* 요일 선택 */
    dayItems.forEach((dayItem) => {
      dayItem.addEventListener("click", () => {
        dayItem.classList.toggle("select");
        const alarmDay = dayItem.textContent;
        if (this.alarmData.days.includes(alarmDay)) {
          this.alarmData.days = this.alarmData.days.filter(
            (day) => day !== alarmDay,
          );
        } else {
          this.alarmData.days.push(alarmDay);
        }

        /* 요일 sort */
        this.alarmData.days.sort((a, b) => {
          return this.weekOrder.indexOf(a) - this.weekOrder.indexOf(b);
        });

        /* 요일까지 선택이 이루어진다음 값 체크 */
        this.alarmCheck();
      });
    });
  },
  updateDayStatus: function () {
    const dayStatus = document.querySelector(".day-status");
    const { ampm, hour, minute, days } = this.alarmData;

    /* 분을 두 자리 수로 설정 */
    /* 만약 10보다 작은 1, 2, 3이라면 앞에 0을 붙여야 01, 02, 03으로 나옴. */
    const minuteText = minute < 10 ? `0${minute}` : minute;

    /* 배열을 공백없는 문자열로 바꾸고 합쳐서 대조할 수 있도록 변환 */
    const dayStr = days.join("");

    /* 날짜 라벨링 */
    const labelList = {
      월화수목금토일: "매일",
      월화수목금: "평일",
      토일: "주말",
    };
    /* 라벨링 규칙에 맞는다면 labelList, 아니라면 원래대로 공백 넣어서 나열 */
    const dayLabel = labelList[dayStr] || days.join(" ");

    /* 요일이 하나라도 있다면 라벨링 패턴 혹은 공백 포함 나열 출력, 그게 아니라면 빈 내용 */
    const dayText = days.length > 0 ? ` ${dayLabel}` : "";

    dayStatus.textContent = `${ampm} ${hour}:${minuteText}${dayText}`;
  },
};

export { alarmFunction };
