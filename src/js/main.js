const taskFunction = {
  newTask: {
    title: "",
    duration: "15",
    icon: null,
    color: null,
    alarm: null,
    done: false,
  },
  tasks: [],

  /* reset 필요 */

  init: function () {
    this.taskOptions();
    this.taskModalActive();
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
    console.log("새로운 할 일 데이터:", this.newTask);
  },

  /* 열고/닫기 */
  taskModalActive: function () {
    const openBtn = document.querySelector(".task-add-btn");
    const closeBtn = document.querySelector(".taskmodal-x-btn");
    const taskModal = document.querySelector(".add-modal");
    const scrollArea = document.querySelector(".scroll-area");
    const container = document.querySelector(".container");
    const dimmed = document.querySelector(".modal-dimmed");

    /* ---- 열기 ---- */
    openBtn.addEventListener("click", () => {
      taskModal.classList.add("open");
      dimmed.classList.add("active");
      scrollArea.style.overflow = "hidden";
    });
    /* ---- 닫기 ---- */
    closeBtn.addEventListener("click", () => {
      taskModal.classList.remove("open");
      dimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";
    });
    /* 바깥을 눌렀을 때 닫힘 */
    container.addEventListener("click", (e) => {
      const modalArea = taskModal.contains(e.target);
      const openBtnArea = openBtn.contains(e.target);
      if (!modalArea && !openBtnArea) {
        taskModal.classList.remove("open");
        dimmed.classList.remove("active");
        scrollArea.style.overflow = "auto";
      }
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
