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
    const savedData = localStorage.getItem("tasks");
    if (savedData) this.tasks = JSON.parse(savedData);
    this.taskOptions();
    this.modalActive();
    this.renderTasks();
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
  /* 수정할 것(toast) */
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

    /* 로컬 스토리지에 저장 -> JSON으로 문자열 변환 */
    localStorage.setItem("tasks", JSON.stringify(this.tasks));

    this.renderTasks();
    this.closeAddModal();
  },
  renderTasks: function () {
    const doingAllList = document.querySelector(".list-doing");
    const doneAllList = document.querySelector(".list-done");

    /* remove()는 innerHTML과 다르게 선택한 요소 자신만 DOM에서 제거 */
    doingAllList
      .querySelectorAll(".todo-item")
      .forEach((item) => item.remove());
    doneAllList.querySelectorAll(".todo-item").forEach((item) => item.remove());

    /* 몇 번째를 선택했는지 알아야 하기에 index 추가 */
    this.tasks.forEach((task, index) => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";
      /* data-index의 형태로 html에 index 부여 */
      todoItem.dataset.index = index;

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

      /* 체크 박스(mark) 클릭 시 미완료 <-> 완료 */
      const taskMark = todoItem.querySelector(".todo-mark");
      console.log(taskMark);
      taskMark.addEventListener("click", () => {
        /* 상태 반전 후 렌더링 */
        task.done = !task.done;
        this.renderTasks();
      });

      /* 눌러서 삭제 로직 */
      let taskPressTimer = null;

      // 누를시
      const startPressTask = () => {
        taskPressTimer = setTimeout(() => {
          /* addTask에서 심어준 id */
          this.showActionSheet(task.id);
        }, 500);
      };
      // 중도 취소
      const cancelPressTask = () => {
        clearTimeout(taskPressTimer);
      };

      todoItem.addEventListener("mousedown", startPressTask);
      todoItem.addEventListener("mouseup", cancelPressTask);
      todoItem.addEventListener("mouseleave", cancelPressTask);

      /* 모바일 용 */
      todoItem.addEventListener("touchstart", startPressTask);
      todoItem.addEventListener("touchend", cancelPressTask);
      todoItem.addEventListener("touchmove", cancelPressTask);

      if (!task.done) {
        doingAllList.appendChild(todoItem);
      } else {
        doneAllList.appendChild(todoItem);
      }
    });
    /* 미완료/완료 갯수 실시간 반영 표시 */
    /* 미완료 */
    document.querySelector(".todo-doing span").textContent = this.tasks.filter(
      (number) => !number.done,
    ).length;
    /* 완료 */
    document.querySelector(".todo-done span").textContent = this.tasks.filter(
      /* done의 반대로 역전 */
      (number) => number.done,
    ).length;
  },
  deleteTask: function (taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);

    /* filter를 통해 조건에 따라 재배열이 이루어지고(=삭제), 이 값을 저장해야 하므로 로컬 스토리지에 반영 */
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.renderTasks();
  },
  resetTask: function () {
    this.newTask = {
      title: "",
      duration: "15",
      icon: "default",
      color: "#2d2d2d",
      alarm: null,
      done: false,
    };
    /* 할 일 내용 초기화 */
    document.querySelector("#task-name").value = "";
    document.querySelector(".task-time span").textContent = "15 min";
    document.querySelector(".alarm-result").classList.remove("active");
    document.querySelector(".task-set").classList.remove("active");
    document
      .querySelectorAll(".time-list li")
      .forEach((li) => li.classList.remove("active"));

    /* 색상과 아이콘 초기화 */
    document.querySelector(".icon-result").style.backgroundColor = "#2d2d2d";
    document.querySelector(".icon-result").style.maskImage = "";
    document.querySelector(".icon-result").style.webkitMaskImage = "";
    document.querySelector(".title-result span").style.backgroundColor =
      "#2d2d2d";
  },
  /* 수정/삭제 ui */
  showActionSheet: function (taskId) {
    const actionSheet = document.querySelector(".action-sheet");
    const dimmed = document.querySelector(".modal-dimmed");
    const deleteBtn = document.querySelector(".action-delete");
    const closeBtn = document.querySelector(".action-x-btn");

    actionSheet.classList.add("open");
    dimmed.classList.add("active");

    /* 이벤트 리스너는 기존 이벤트를 제거하지 않는 이상 계속 누적, onclick은 덮어 씌우므로 누적되지 않음. 수정/삭제의 경우 다른 것과 다르게 누를 '때마다' 실행되므로 이벤트 리스너가 부적합 */
    deleteBtn.onclick = () => {
      /* 테스트용 */
      if (confirm("정말 삭제하시겠습니까?")) {
        this.deleteTask(taskId);
        actionSheet.classList.remove("open");
        dimmed.classList.remove("active");
      }
    };
    closeBtn.onclick = () => {
      actionSheet.classList.remove("open");
      dimmed.classList.remove("active");
    };
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
      this.resetTask();
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
      /* custom/alarm 모달은 클릭 이벤트가 이루어지기 전 선언이 먼저 되므로 하단에 쓰여도 사용 가능(콜백) */

      /* 다른 모달이 계속 추가되었을 때 하단 if문을 간소화 하기 위한 함수. */
      /* 만약 모달이 한 개라도 열려있다면 그걸로 접근을 제한하면 되므로 그냥 셀렉터로 선택 */
      const otherModalOpen = () => {
        return document.querySelector(".modal-area .open") !== null;
      };

      const customModalOpen = customModal.classList.contains("open");
      const alarmModalOpen = alarmModal.classList.contains("open");

      /* 다른 모달이 '열려'있을 때 add-modal이 닫히면 안되므로 이를 역전해 모달이 '닫혔을 때' 닫게 함 */
      if (!modalArea && !openBtnArea && !otherModalOpen()) {
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
    /* 설정하기 */
    alarmSetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!alarmSetBtn.classList.contains("active")) return;

      /* 1. 최종 데이터를 newTask(add 모달)에 넘기기 */
      // '...'은 복사본을 넣음
      taskFunction.newTask.alarm = { ...alarmFunction.alarmData };

      /* 2. 알람 설정 텍스트 값을 add 모달에 업데이트 */
      const alarmResult = document.querySelector(".alarm-result");

      /* update 구문에서 적용한 day-status값을 가져와서 textContent로 그림 */
      alarmResult.textContent =
        document.querySelector(".day-status").textContent;
      alarmResult.classList.add("active");

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
    this.timeSelect();
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
  timeSelect: function () {
    const timeItems = document.querySelectorAll(".alarm-item");
    timeItems.forEach((timeItem, index) => {
      timeItem.addEventListener("scroll", () => {
        /* 스크롤로 구분되는 오후/오전, 시간, 분을 한 칸인 높이 50으로 나누고, 스크롤(인덱스)로 선택된 특정 시간을 찾음 */
        const scrollIndex = Math.round(timeItem.scrollTop / 50);
        /* 만약 빈 li를 가리키면 통과(undefined가 뜸) */
        if (scrollIndex < 0) return;

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
