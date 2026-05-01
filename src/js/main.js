const taskFunction = {
  newTask: {
    title: "",
    duration: "15",
    icon: "default",
    color: "#2d2d2d",
    alarm: null,
    done: false,
  },
  tasks: [],

  init: function () {
    this.taskOptions();
    this.modalActive();
  },

  /* 버튼 활성화 여부 */
  taskCheck: function () {
    const taskSetBtn = document.querySelector(".task-set");
    if (this.newTask.title.trim() !== "" && this.newTask.duration !== null) {
      taskSetBtn.classList.add("active");
    } else {
      taskSetBtn.classList.remove("active");
    }
  },

  /* 할 일 추가 */
  taskOptions: function () {
    const taskName = document.querySelector("#task-name");
    const timePreset = document.querySelectorAll(".time-list li");
    const timeDisplay = document.querySelector(".task-time span");
    const taskSetBtn = document.querySelector(".task-set");

    /* 제목 */
    taskName.addEventListener("input", (e) => {
      /* input 안의 값 */
      this.newTask.title = e.target.value;
      console.log(e.target.value);
      this.taskCheck();
    });

    /* 시간 */
    timePreset.forEach((timeSet) => {
      timeSet.addEventListener("click", () => {
        timePreset.forEach((item) => item.classList.remove("active"));
        timeSet.classList.add("active");

        const selectedTime = timeSet.dataset.time;
        this.newTask.duration = selectedTime;
        this.taskCheck();

        if (timeDisplay) {
          timeDisplay.textContent = timeSet.textContent;
        }
      });
    });
    /* 추가 버튼 */
    taskSetBtn.addEventListener("click", () => {
      this.addTask();
    });
  },
  showToast: function (message) {
    alert(message);
  },
  addTask: function () {
    if (this.newTask.title.trim() === "") {
      this.showToast("제목을 입력해주세요!");
      return;
    }

    /* 메인 화면에 렌더링 */
    const newTaskData = {
      ...this.newTask,
      id: Date.now(),
    };
    this.tasks.push(newTaskData);
    this.renderTasks();
    this.closeAddModal();

    /* !: reset 제작 필요 */
    // this.resetTask();
  },
  renderTasks: function () {
    const doingAllList = document.querySelector(".list-doing");
    const doingTask = doingAllList.querySelectorAll(".todo-item");
    /* remove()는 innerHTML과 다르게 선택한 요소 자신만 DOM에서 제거 */
    doingTask.forEach((item) => item.remove());

    this.tasks.forEach((task) => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";

      /* html과 동일하게 그리기 */
      todoItem.innerHTML = `
         <div class=
         "icon icon-doing"
         style="background-color: ${task.color};
         -webkit-mask-image: url('/public/icons/icon-${task.icon}.svg');
         mask-image: url('/public/icons/icon-${task.icon}.svg');">
         </div>
         <div class="todo-text">
            <h3>${task.title}</h3>
            <span>${task.duration}</span>
         </div>
         <div class="todo-mark"></div>
      `;
      doingAllList.appendChild(todoItem);
    });
    /* 미완료/완료 표시 숫자 */
    document.querySelector(".todo-doing span").textContent = this.tasks.filter(
      (number) => !number.done,
    ).length;
  },

  /* 모달 열고/닫기 */
  modalActive: function () {
    /* common */
    const dimmed = document.querySelector(".modal-dimmed");
    const scrollArea = document.querySelector(".scroll-area");
    const container = document.querySelector(".container");

    /* === add-modal === */
    const taskModal = document.querySelector(".add-modal");
    const openBtn = document.querySelector(".task-add-btn");
    const addCloseBtn = document.querySelector(".task-x-btn");

    const openAddModal = () => {
      taskModal.classList.add("open");
      dimmed.classList.add("active");
      scrollArea.style.overflow = "hidden";
    };
    const closeAddModal = () => {
      taskModal.classList.remove("open");
      dimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";
    };
    this.closeAddModal = closeAddModal;

    /* 열기*/
    openBtn.addEventListener("click", openAddModal);
    /* 닫기 */
    addCloseBtn.addEventListener("click", closeAddModal);
    /* 바깥을 눌렀을 때 닫힘 */
    container.addEventListener("click", (e) => {
      const modalArea = taskModal.contains(e.target);
      const openBtnArea = openBtn.contains(e.target);
      const customModalOpen = customModal.classList.contains("open");

      if (!modalArea && !openBtnArea && !customModalOpen) {
        closeAddModal();
      }
    });

    /* === custom-modal === */
    const customAddBtn = document.querySelector(".custom-btn");
    const customCloseBtn = document.querySelector(".custom-x-btn");
    const customModal = document.querySelector(".custom-modal");
    const customSetBtn = document.querySelector(".custom-set");

    /* 열기 */
    customAddBtn.addEventListener("click", () => {
      customModal.classList.add("open");
    });
    /* 닫기 - x버튼 */
    customCloseBtn.addEventListener("click", (e) => {
      /* 이벤트 버블링 방지 */
      e.stopPropagation();
      customModal.classList.remove("open");
    });
    /* 닫기 - 설정 버튼 */
    customSetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!customSetBtn.classList.contains("active")) return;
      customModal.classList.remove("open");
    });

    /* === alarm-modal === */
    const alarmAddBtn = document.querySelector(".alarm-btn");
    const alarmCloseBtn = document.querySelector(".alarm-x-btn");
    const alarmModal = document.querySelector(".alarm-modal");
    const alarmSetBtn = document.querySelector(".alarm-set");

    /* 열기 */
    alarmAddBtn.addEventListener("click", () => {
      alarmModal.classList.add("open");
    });
    /* 닫기 - x버튼 */
    alarmCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      alarmModal.classList.remove("open");
    });
    alarmSetBtn.addEventListener("click", () => {
      e.stopPropagation();
      if (!alarmSetBtn.classList.contains("active")) return;
      alarmModal.classList.remove("open");
    });
  },
};
taskFunction.init();
const customFunction = {
  icons: {
    routine: ["walk", "sleep", "music"],
    food: ["chicken", "fish", "cheese", "noodle"],
    animal: ["dog", "cat", "bird"],
    others: ["smile", "star", "plant"],
  },
  colors: [
    "#DA5C53",
    "#F89ABF",
    "#F3A72E",
    "#D9D90B",
    "#2D8B7D",
    "#4C8CE4",
    "#6151BB",
  ],
  customTask: {
    selectedIcon: null,
    selectedColor: null,
  },

  init: function () {
    this.renderColors();
    this.renderIcons();
  },

  /* 버튼 활성화 여부 */
  customCheck: function () {
    const customSetBtn = document.querySelector(".custom-set");
    if (this.customTask.selectedIcon && this.customTask.selectedColor) {
      customSetBtn.classList.add("active");
    } else {
      customSetBtn.classList.remove("active");
    }
  },
  renderColors: function () {
    const colorList = document.querySelector(".color-list");
    this.colors.forEach((customColor) => {
      /* li 만들어서 colors 안에 있는 색상표들 각 적용 */
      const colorPreset = document.createElement("li");
      colorPreset.style.backgroundColor = customColor;

      colorPreset.addEventListener("click", () => {
        this.customTask.selectedColor = customColor;

        /* 미리보기에 적용 */
        document.querySelector(".preview-text h3").style.color = customColor;
        document.querySelector(".icon-preview").style.backgroundColor =
          customColor;
        /* 할일 추가 모달에 적용 */
        taskFunction.newTask.color = customColor;
        document.querySelector(".title-result span").style.backgroundColor =
          customColor;
        document.querySelector(".icon-result").style.backgroundColor =
          customColor;

        this.customCheck();
      });
      colorList.appendChild(colorPreset);
    });
  },
  renderIcons: function () {
    Object.entries(this.icons).forEach(([category, iconList]) => {
      const iconSection = document.querySelector(`.mark-${category}`);
      const ul = iconSection.querySelector("ul");

      iconList.forEach((iconName) => {
        const iconBox = document.createElement("li");
        iconBox.innerHTML = `<img src="/public/icons/icon-${iconName}.svg" alt="${iconName}" />`;

        iconBox.addEventListener("click", () => {
          this.customTask.selectedIcon = iconName;

          taskFunction.newTask.icon = iconName;

          const iconResult = document.querySelector(".icon-result");

          /* 이미지 마스크, css와 동일 */
          iconResult.style.maskImage = `url("/public/icons/icon-${iconName}.svg")`;
          iconResult.style.webkitMaskImage = `url("/public/icons/icon-${iconName}.svg")`;

          /* 미리보기 반영 */
          const iconPreview = document.querySelector(".icon-preview");
          iconPreview.style.maskImage = `url("/public/icons/icon-${iconName}.svg")`;
          iconPreview.style.webkitMaskImage = `url("/public/icons/icon-${iconName}.svg")`;

          /* 할 일 추가 모달에 반영 */
          if (taskFunction.newTask.color) {
            iconPreview.style.backgroundColor = taskFunction.newTask.color;
          }
          this.customCheck();
        });
        ul.appendChild(iconBox);
      });
    });
  },
};
customFunction.init();
const alarmFunction = {
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
    this.renderAlarm(this.ampm, ".alarm-ampm");
    this.renderAlarm(this.hours, ".alarm-hour");
    this.renderAlarm(this.minutes, ".alarm-minute");
    this.daySelect();
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
  /* !== Object.entries로 배열의 key:value 가져오는 거랑 다름, 실제로 넘길 값 / 받을 곳 */
  renderAlarm: function (alarmData, dataTarget) {
    const alarmDataList = document.querySelector(dataTarget);

    /* ! 여백을 만들어줘야 맨 상단을 가운데로 가져올 수 있음 */
    const emptyTopBlock = document.createElement("li");
    alarmDataList.appendChild(emptyTopBlock);

    alarmData.forEach((item) => {
      /* 각각 한 칸 씩의 알람 설정 속 블록 */
      const eachAlarmBlock = document.createElement("li");
      eachAlarmBlock.textContent = item;
      alarmDataList.appendChild(eachAlarmBlock);
    });

    /* ! 이하 동일 */
    const emptyBottomBlock = document.createElement("li");
    alarmDataList.appendChild(emptyBottomBlock);
  },
  daySelect: function () {
    const dayItems = document.querySelectorAll(".day-item");
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
    /* 요일이 하나라도 있다면 맨 앞에 공백 + " "로 사이 공백, 그게 아니라면 빈 내용 */
    const dayText = days.length > 0 ? ` ${days.join(" ")}` : "";

    /* 두 자리 수의 minutes, 별도 설정한 요일 스타일을 textContent로 그림 */
    dayStatus.textContent = `${ampm} ${hour}:${minuteText}${dayText}`;
  },
};
alarmFunction.init();
