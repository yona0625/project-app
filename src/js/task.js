import { newTask } from "./state.js";
import { alarmFunction } from "./alarm.js";
import { customFunction } from "./custom.js";
import { openModal, closeModal } from "./modal.js";
import { renderTasks, initTaskModal } from "./render.js";

const taskFunction = {
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
    renderTasks(this.tasks, (id) => this.openActionSheet(id));
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

    renderTasks(this.tasks, (id) => this.openActionSheet(id));
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
        timePreset.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-checked", "false");
        });
        timeSet.classList.add("active");
        timeSet.setAttribute("aria-checked", "true");

        const selectedTime = timeSet.dataset.time;
        newTask.duration = selectedTime;
        this.taskCheck();

        timeDisplay.textContent = timeSet.textContent;
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
    renderTasks(this.tasks, (id) => this.openActionSheet(id));
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
    document.querySelector(".task-set h2").textContent = "추가하기";
    document
      .querySelectorAll(".time-list li")
      .forEach((li) => li.classList.remove("active"));

    /* 15분 프리셋 기본 값 */
    document
      .querySelector('.time-list li[data-time="15"]')
      .classList.add("active");

    initTaskModal(newTask);
  },
  /* ===== UI 및 모달 ===== */
  /* 모달 활성화 관리 */
  modalActive: function () {
    /* common */
    const scrollArea = document.querySelector(".scroll-area");
    const container = document.querySelector(".container");
    const mainDimmed = document.querySelector(".main-dimmed");
    const nav = document.querySelector("nav");

    /* dimmed */
    mainDimmed.addEventListener("click", () => {
      /* 항상 클릭 시점에 modal을 찾아야 하므로 안에 선언 */
      const activedModal = document.querySelector(".modal-area .open");
      const openSheet = document.querySelector(".action-sheet.open");
      if (activedModal) {
        closeModal(activedModal);
      }

      if (openSheet) {
        closeModal(openSheet);
      }
      /* 남아있는 모달이 있는지 확인 후 딤드 닫기 */
      mainDimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";
    });

    /* === add-modal === */
    const taskModal = document.querySelector(".add-modal");
    const openBtn = document.querySelector(".task-add-btn");
    const addCloseBtn = document.querySelector(".task-x-btn");

    const openAddModal = () => {
      this.resetTask();
      openModal(taskModal);
      mainDimmed.classList.add("active");
      scrollArea.style.overflow = "hidden";

      /* 모달이 열린 동안 tab 시에 외부 영역에 접근 못 하도록(=focus가 안 가도록) 잠금 */
      scrollArea.inert = true;
      nav.inert = true;
    };
    const closeAddModal = () => {
      closeModal(taskModal);
      mainDimmed.classList.remove("active");
      scrollArea.style.overflow = "auto";

      scrollArea.inert = false;
      nav.inert = false;
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
      openModal(customModal);
    });
    /* 닫기 */
    customCloseBtn.addEventListener("click", (e) => {
      /* 이벤트 버블링 방지 */
      e.stopPropagation();
      closeModal(customModal);
      /* ★ 수정하기든, 새로 추가한 일이든 마지막으로 설정한 newTask 값을 유지해야 함 */
      customFunction.setCustom(newTask.color, newTask.icon);
    });
    /* 설정(확정) */
    customSetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!customSetBtn.classList.contains("active")) return;

      newTask.color = customFunction.customTask.selectedColor;
      newTask.icon = customFunction.customTask.selectedIcon;

      closeModal(customModal);

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
      openModal(alarmModal);
      subDimmed.classList.add("active");
    });
    /* 닫기 - x버튼 */
    alarmCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal(alarmModal);
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
      alarmAddBtn.setAttribute("aria-checked", "true");

      closeModal(alarmModal);
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
      alarmAddBtn.setAttribute("aria-checked", "false");
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

    const scrollArea = document.querySelector(".scroll-area");
    const nav = document.querySelector("nav");

    actionSheet.classList.add("open");
    actionSheet.inert = false;
    mainDimmed.classList.add("active");

    /* 이벤트 리스너는 기존 이벤트를 제거하지 않는 이상 계속 누적, onclick은 덮어 씌우므로 누적되지 않음. 수정/삭제의 경우 다른 것과 다르게 누를 '때마다' 실행되므로 이벤트 리스너가 부적합 */
    /* 삭제 */
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this.deleteTask(taskId);
      actionSheet.classList.remove("open");
      actionSheet.inert = true;
      mainDimmed.classList.remove("active");

      scrollArea.inert = false;
      nav.inert = false;
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

      customFunction.customTask.selectedColor = editTask.color;
      customFunction.customTask.selectedIcon = editTask.icon;

      customFunction.setCustom(editTask.color, editTask.icon);

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
      document.querySelector(".add-modal").inert = false;
      document.querySelector(".main-dimmed").classList.add("active");
      actionSheet.classList.remove("open");

      scrollArea.inert = false;
      nav.inert = false;
    };
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      actionSheet.classList.remove("open");
      actionSheet.inert = true;
      mainDimmed.classList.remove("active");

      scrollArea.inert = false;
      nav.inert = false;
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
