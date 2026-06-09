import { newTask } from "./state.js";
import { alarmFunction } from "./alarm.js";
import { customFunction } from "./custom.js";

const taskFunction = {
  //   newTask: {
  //     title: "",
  //     duration: "15",
  //     icon: "default",
  //     color: "#2d2d2d",
  //     alarm: null,
  //     done: false,
  //   },

  /* 삭제 toast를 위한 변수 */
  deleteToastTimer: null,
  deleteToastTask: null,

  /* 수정/삭제를 위한 플래그 */
  mode: "add",
  editId: null,

  tasks: [],

  init: function () {
    const savedData = localStorage.getItem("tasks");
    /* 아무 데이터도 없을 때 파싱하는 걸 방지 */
    if (savedData) this.tasks = JSON.parse(savedData);
    this.taskOptions();
    this.modalActive();
    this.renderTasks();
  },

  /* ===== 데이터 처리 ===== */
  addTask: function () {
    if (newTask.title.trim() === "") {
      this.showToast("제목을 입력해주세요!");
      return;
    }

    /* 메인 화면에 렌더링 */
    const newTaskData = {
      ...newTask,
      id: Date.now(),
    };
    this.tasks.push(newTaskData);

    /* 로컬 스토리지에 저장 -> JSON으로 문자열 변환 */
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    document.dispatchEvent(
      new CustomEvent("tasksUpdated", { detail: this.tasks }),
    );

    this.renderTasks();
    this.closeAddModal();
  },
  /* 할 일 추가 */
  taskOptions: function () {
    const taskName = document.querySelector("#task-name");
    const timePreset = document.querySelectorAll(".time-list li");
    const timeDisplay = document.querySelector(".task-time span");
    const taskSetBtn = document.querySelector(".task-set");

    /* 제목 */
    taskName.addEventListener("input", (e) => {
      newTask.title = e.target.value;
      this.taskCheck();
    });

    /* 시간 */
    timePreset.forEach((timeSet) => {
      timeSet.addEventListener("click", () => {
        timePreset.forEach((item) => item.classList.remove("active"));
        timeSet.classList.add("active");

        const selectedTime = timeSet.dataset.time;
        newTask.duration = selectedTime;
        this.taskCheck();

        // if (timeDisplay) {
        //   timeDisplay.textContent = timeSet.textContent;
        // }
      });
    });
    /* 추가 버튼 */
    taskSetBtn.addEventListener("click", () => {
      if (this.mode === "add") {
        this.addTask();
      } else {
        this.fixTask();
      }
    });
  },
  deleteTask: function (taskId) {
    this.deleteToastTask = this.tasks.find((t) => t.id === taskId);
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.renderTasks();
    this.showDeleteToast();
  },
  fixTask: function () {
    const editTask = this.tasks.find((t) => t.id === this.editId);
    editTask.title = newTask.title;
    editTask.duration = newTask.duration;
    editTask.icon = newTask.icon;
    editTask.color = newTask.color;
    editTask.alarm = newTask.alarm;

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    document.dispatchEvent(
      new CustomEvent("tasksUpdated", { detail: this.tasks }),
    );
    /* closeAddModal까지 수행한 후 edit, id값을 초기화 해주기 위해 추가 */
    this.mode = "add";
    this.editId = null;
    this.renderTasks();
    this.closeAddModal();
  },
  resetTask: function () {
    newTask.title = "";
    newTask.duration = "15";
    newTask.icon = "default";
    newTask.color = "#2d2d2d";
    newTask.alarm = null;
    newTask.done = false;
    /* 재할당 불가로 변경 */

    this.mode = "add";
    this.editId = null;

    /* 커스텀 모달 초기화 */
    customFunction.customTask.selectedIcon = null;
    customFunction.customTask.selectedColor = null;

    /* 할 일 내용 초기화 - 추가 모달 */
    document.querySelector(".add-modal h2").textContent = "할 일을 추가하세요";
    document.querySelector(".alarm-result").classList.remove("active");
    document.querySelector(".task-set").classList.remove("active");
    document
      .querySelectorAll(".time-list li")
      .forEach((li) => li.classList.remove("active"));

    /* 15분 프리셋 기본 값 */
    document
      .querySelector('.time-list li[data-time="15"]')
      .classList.add("active");

    this.initTaskModal(newTask);
  },

  /* ===== 렌더링 ===== */
  renderTasks: function () {
    const doingAllList = document.querySelector(".list-doing");
    const doneAllList = document.querySelector(".list-done");

    /* 소요 시간 단위 변환 */
    const convertTime = (duration) => {
      /* 숫자로 변환 */
      const min = Number(duration);
      if (min >= 60) {
        /* '/'는 몫, '%'는 나머지 */
        const hours = Math.floor(min / 60);
        const remainMins = min % 60;
        return remainMins > 0 ? `${hours} h ${remainMins} m` : `${hours} hour`;
      }
      /* 1시간 미만일 시 */
      return `${min} min`;
    };

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

      const checkIcon = task.done ? "icon-aftercheck" : "icon-beforecheck";
      // const alarmIcon = task.alarm ? "icon-alarm" : "";

      todoItem.innerHTML = `
         <div class=
         "icon icon-doing"
         style="background-color: ${task.color};
         -webkit-mask-image: url('/public/icons/icon-${task.icon === "default" ? "doing" : task.icon}.svg');
         mask-image: url('/public/icons/icon-${task.icon === "default" ? "doing" : task.icon}.svg');">
         </div>
         <div class="todo-text">
            <h3 style="color: ${task.color}">${task.title}</h3>
            <span>${convertTime(task.duration)}</span>
         </div>
         <div class="todo-mark icon" style="
            mask-image: url('/public/icons/${checkIcon}.svg');
            -webkit-mask-image: url('/public/icons/${checkIcon}.svg');
            background-color: var(--main_color);">
         </div>`;

      /* 체크 박스(mark) 클릭 시 미완료 <-> 완료 */
      const taskMark = todoItem.querySelector(".todo-mark");
      taskMark.addEventListener("click", () => {
        task.done = !task.done;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        document.dispatchEvent(
          new CustomEvent("tasksUpdated", { detail: this.tasks }),
        );
        this.renderTasks();
      });

      /* 눌러서 삭제 */
      let taskPressTimer = null;

      const startPressTask = () => {
        taskPressTimer = setTimeout(() => {
          /* addTask에서 심어준 id */
          this.showActionSheet(task.id);
        }, 500);
      };
      const cancelPressTask = () => {
        clearTimeout(taskPressTimer);
      };
      const pressTask = {
        mousedown: startPressTask,
        mouseup: cancelPressTask,
        mouseleave: cancelPressTask,
        touchstart: startPressTask,
        touchend: cancelPressTask,
        touchmove: cancelPressTask,
      };
      Object.entries(pressTask).forEach(([eventName, handler]) => {
        todoItem.addEventListener(eventName, handler);
      });

      if (!task.done) {
        doingAllList.appendChild(todoItem);
      } else {
        doneAllList.appendChild(todoItem);
      }
    });
    /* 미완료/완료 갯수 실시간 반영 표시 */
    document.querySelector(".todo-doing span").textContent = this.tasks.filter(
      (number) => !number.done,
    ).length;
    document.querySelector(".todo-done span").textContent = this.tasks.filter(
      (number) => number.done,
    ).length;
  },
  initTaskModal: function (initTask) {
    /* remove 구문 제외 */
    const taskName = document.querySelector("#task-name");
    const taskTime = document.querySelector(".task-time span");
    const iconResult = document.querySelector(".icon-result");
    const iconPreview = document.querySelector(".icon-preview");
    const titleResult = document.querySelector(".title-result span");
    const previewTitle = document.querySelector(".preview-text h3");
    const maskURI =
      initTask.icon === "default"
        ? `url('/public/icons/icon-doing.svg')`
        : `url('/public/icons/icon-${initTask.icon}.svg')`;

    /* add-modal */
    taskName.value = initTask.title;
    taskTime.textContent = initTask.duration + " min";
    iconResult.style.backgroundColor = initTask.color;
    iconResult.style.maskImage = maskURI;
    iconResult.style.webkitMaskImage = maskURI;
    titleResult.style.backgroundColor = initTask.color;

    /* custom-modal */
    iconPreview.style.backgroundColor = initTask.color;
    previewTitle.style.color = initTask.color;
    iconPreview.style.maskImage = maskURI;
    iconPreview.style.webkitMaskImage = maskURI;
  },

  /* ===== UI 및 모달 ===== */
  /* 모달 활성화 관리 */
  modalActive: function () {
    /* common */
    const scrollArea = document.querySelector(".scroll-area");
    const container = document.querySelector(".container");
    const mainDimmed = document.querySelector(".main-dimmed");

    /* dimmed */
    mainDimmed.addEventListener("click", () => {
      /* 항상 클릭 시점에 modal을 찾아야 하므로 안에 선언 */
      const openModal = document.querySelector(".modal-area .open");
      const openSheet = document.querySelector(".action-sheet.open");
      if (openModal) openModal.classList.remove("open");
      if (openSheet) openSheet.classList.remove("open");
      mainDimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";
    });

    /* === add-modal === */
    const taskModal = document.querySelector(".add-modal");
    const openBtn = document.querySelector(".task-add-btn");
    const addCloseBtn = document.querySelector(".task-x-btn");

    const openAddModal = () => {
      this.resetTask();
      taskModal.classList.add("open");
      mainDimmed.classList.add("active");
      scrollArea.style.overflow = "hidden";
    };
    const closeAddModal = () => {
      taskModal.classList.remove("open");
      mainDimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";
    };
    /* fixTask, addTask에서 쓰기 위해 외부로 노출 */
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
      /* ★★★ 단, add-modal이 열린 상태에서는 이미 open이 붙고, 이 때 add-modal을 제외한 나머지의 open이 붙은 서브모달들만을 제한해서 잡아야만 본래의 add-modal이 닫힐 수 있음. */
      const otherModalOpen = () => {
        return (
          document.querySelector(".modal-area .open:not(.add-modal)") !== null
        );
      };

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
      /* ★ 수정하기에서 초기화 되면 안 됨 */
      if (this.mode !== "edit") {
        customFunction.resetCustom();
      }
    });
    /* 닫기 - 설정 버튼 */
    customSetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!customSetBtn.classList.contains("active")) return;

      newTask.color = customFunction.customTask.selectedColor;
      newTask.icon = customFunction.customTask.selectedIcon;
      customModal.classList.remove("open");
    });

    /* === alarm-modal === */
    const alarmAddBtn = document.querySelector(".alarm-btn");
    const alarmCloseBtn = document.querySelector(".alarm-x-btn");
    const alarmModal = document.querySelector(".alarm-modal");
    const alarmSetBtn = document.querySelector(".alarm-set");
    const alarmResetBtn = document.querySelector(".alarm-reset");
    const alarmResult = document.querySelector(".alarm-result");
    const subDimmed = document.querySelector(".sub-dimmed");

    /* 열기 */
    alarmAddBtn.addEventListener("click", () => {
      alarmModal.classList.add("open");
      subDimmed.classList.add("active");
    });
    /* 닫기 - x버튼 */
    alarmCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      alarmModal.classList.remove("open");
      subDimmed.classList.remove("active");
      alarmFunction.resetAlarm();
    });
    /* 설정하기 */
    alarmSetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!alarmSetBtn.classList.contains("active")) return;

      /* 1. 최종 데이터를 newTask(add 모달)에 넘기기 */
      // '...'은 복사본을 넣음
      //   taskFunction.newTask.alarm = { ...alarmFunction.alarmData };
      newTask.alarm = { ...alarmFunction.alarmData };

      /* 2. 알람 설정 텍스트 값을 add 모달에 업데이트 */
      // const alarmResult = document.querySelector(".alarm-result");

      /* update 구문에서 적용한 day-status값을 가져와서 textContent로 그림 */
      alarmResult.textContent =
        document.querySelector(".day-status").textContent;
      alarmResult.classList.add("active");
      alarmAddBtn.classList.add("set");

      alarmModal.classList.remove("open");
      subDimmed.classList.remove("active");
    });
    /* 초기화 */
    alarmResetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      alarmFunction.resetAlarm();
      /* 리셋 뿐만 아니라 현재 설정된 값과 텍스트 상태도 초기화 되어야 함. */
      //   taskFunction.newTask.alarm = null;
      newTask.alarm = null;
      alarmResult.classList.remove("active");
      alarmAddBtn.classList.remove("set");
    });
  },
  /* 수정/삭제 ui */
  showActionSheet: function (taskId) {
    const actionSheet = document.querySelector(".action-sheet");
    const mainDimmed = document.querySelector(".main-dimmed");
    const deleteBtn = document.querySelector(".action-delete");
    const editBtn = document.querySelector(".action-edit");
    const closeBtn = document.querySelector(".action-x-btn");
    const container = document.querySelector(".container");

    let isPressed = true;

    actionSheet.classList.add("open");
    mainDimmed.classList.add("active");

    /* 이벤트 리스너는 기존 이벤트를 제거하지 않는 이상 계속 누적, onclick은 덮어 씌우므로 누적되지 않음. 수정/삭제의 경우 다른 것과 다르게 누를 '때마다' 실행되므로 이벤트 리스너가 부적합 */
    /* 삭제 */
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this.deleteTask(taskId);
      actionSheet.classList.remove("open");
      mainDimmed.classList.remove("active");
    };
    /* 수정 */
    editBtn.onclick = (e) => {
      e.stopPropagation();
      this.mode = "edit";
      this.editId = taskId;
      const editTask = this.tasks.find((t) => t.id === taskId);

      /* editTask로 덮어야 수정 시에도 유지가 됨. */
      //   this.newTask = { ...editTask };
      // 스프레드 연산자 재할당 불가 -> 다 가져옴
      newTask.title = editTask.title;
      newTask.duration = editTask.duration;
      newTask.icon = editTask.icon;
      newTask.color = editTask.color;
      newTask.alarm = editTask.alarm;
      newTask.done = editTask.done;

      /* add, custom 모달 수정 시 값 유지(초기화) */
      this.initTaskModal(editTask);
      /* 수정하기 모달로 내용 교체 */
      document.querySelector(".add-modal h2").textContent =
        "할 일을 수정하세요";
      /* 해당 타임 프리셋에 맞게 active 활성화, 나머지는 비활성화 */
      document.querySelectorAll(".time-list li").forEach((li) => {
        if (li.dataset.time === editTask.duration) {
          li.classList.add("active");
        } else {
          li.classList.remove("active");
        }
      });
      document.querySelector(".task-set").classList.add("active");
      document.querySelector(".task-set h2").textContent = "수정하기";
      document.querySelector(".add-modal").classList.add("open");
      document.querySelector(".main-dimmed").classList.add("active");
      actionSheet.classList.remove("open");
    };
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      actionSheet.classList.remove("open");
      mainDimmed.classList.remove("active");
    };
  },
  /* toast - 할 일 추가 */
  showToast: function (message) {
    const toast = document.querySelector(".toast");
    const toastMsg = document.querySelector(".toast-msg");
    const toastCancel = document.querySelector(".toast-cancel");
    toastMsg.textContent = message;
    toastCancel.style.display = "none";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  },
  /* toast - 삭제 시 */
  showDeleteToast: function () {
    const toast = document.querySelector(".toast");
    const toastMsg = document.querySelector(".toast-msg");
    const toastCancel = document.querySelector(".toast-cancel");

    toastCancel.style.display = "block";
    toastMsg.textContent = "삭제되었습니다";
    toast.classList.add("show");

    /* 연속 작동으로 인한 타이머 혼선 방지 */
    clearTimeout(this.deleteToastTimer);

    /* cancel을 하지 않을 경우 */
    this.deleteToastTimer = setTimeout(() => {
      /* filter를 통해 조건에 따라 재배열이 이루어지고(=삭제), 이 값을 저장해야 하므로 로컬 스토리지에 반영 */
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      /* character.js랑 연결 */
      document.dispatchEvent(
        new CustomEvent("tasksUpdated", { detail: this.tasks }),
      );
      this.deleteToastTask = null;
      toast.classList.remove("show");
    }, 3000);

    /* cancel을 할 경우 */
    toastCancel.onclick = () => {
      /* 타이머 정지 -> 다시 원상복구하고 스토리지에 저장, toast 숨기기 */
      clearTimeout(this.deleteToastTimer);
      if (this.deleteToastTask) {
        this.tasks.push(this.deleteToastTask);
        this.deleteToastTask = null;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        this.renderTasks();
      }
      toast.classList.remove("show");
    };
  },
  /* 버튼 활성화 여부 */
  taskCheck: function () {
    const taskSetBtn = document.querySelector(".task-set");
    if (newTask.title.trim() !== "" && newTask.duration !== null) {
      taskSetBtn.classList.add("active");
    } else {
      taskSetBtn.classList.remove("active");
    }
  },
};
export { taskFunction };
