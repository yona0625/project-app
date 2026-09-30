const alarmFunction = {
  weekOrder: ["월", "화", "수", "목", "금", "토", "일"],
  ampm: ["오전", "오후"],
  hours: Array.from(
    {
      length: 12,
    },
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
    this.renderAlarm(this.ampm, ".alarm-ampm", 0); 
    this.renderAlarm(this.hours, ".alarm-hour", 6); 
    this.renderAlarm(this.minutes, ".alarm-minute", 0);
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
    if (this.alarmData.days.length > 0) {
      alarmSetBtn.classList.add("active");
    } else {
      alarmSetBtn.classList.remove("active");
    }
    this.updateDayStatus();
  },
  renderAlarm: function (alarmData, dataTarget, defaultIndex) {
    const alarmDataList = document.querySelector(dataTarget);

    /* 상단 요소를 가운데 선택하기 위한 여백 생성 */
    const emptyTopBlock = document.createElement("li");
    alarmDataList.appendChild(emptyTopBlock);

    /* 두 번째 인자 = 인덱스 */
    alarmData.forEach((item, i) => {
      const eachAlarmBlock = document.createElement("li");
      eachAlarmBlock.textContent = item;
      if (i === defaultIndex) {
        eachAlarmBlock.classList.add("active");
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
        const scrollIndex = Math.round(timeItem.scrollTop / 50);
        if (scrollIndex < 0) return;

        /* 볼드/크기 하이라이트 */
        timeItem
          .querySelectorAll("li")
          .forEach((li) => li.classList.remove("active"));
        /* 앞뒤에 공백으로 인해 +1을 해야 실제 데이터부터 시작 */
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
    const minuteText = minute < 10 ? `0${minute}` : minute;
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
