/* ===== 렌더링 ===== */
/* onActionSheetOpen: 콜백 함수 */
function renderTasks(tasks, onActionSheetOpen) {
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
  doingAllList.querySelectorAll(".todo-item").forEach((item) => item.remove());
  doneAllList.querySelectorAll(".todo-item").forEach((item) => item.remove());

  tasks.forEach((task) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    const checkIcon = task.done ? "icon-aftercheck" : "icon-beforecheck";
    const alarmIcon = task.alarm ? "icon-alarm" : "";

    todoItem.innerHTML = `
         <div class=
         "icon icon-doing"
         style="background-color: ${task.color};
         -webkit-mask-image: url('public/icons/icon-${task.icon === "default" ? "doing" : task.icon}.svg');
         mask-image: url('public/icons/icon-${task.icon === "default" ? "doing" : task.icon}.svg');">
         </div>
         <div class="todo-text">
            <h3 style="color: ${task.color}">${task.title}</h3>
           <div class="todo-title">
             <span>${convertTime(task.duration)}</span>
              ${task.alarm ? `<div class="icon icon-alarm" style="background-color: var(--main_color);"></div>` : ""}
           </div>
          </div>    
         </div>
         <div class="todo-mark icon" style="
            mask-image: url('public/icons/${checkIcon}.svg');
            -webkit-mask-image: url('public/icons/${checkIcon}.svg');
            background-color: var(--main_color);">
         </div>`;

    /* 체크 박스(mark) 클릭 시 미완료 <-> 완료 */
    const taskMark = todoItem.querySelector(".todo-mark");
    taskMark.addEventListener("click", () => {
      task.done = !task.done;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      document.dispatchEvent(
        new CustomEvent("tasksUpdated", { detail: tasks }),
      );
      /* 원래는 this.renderTasks() - 재귀 호출 */
      renderTasks(tasks, onActionSheetOpen);
    });

    /* 눌러서 삭제 */
    let taskPressTimer = null;

    const startPressTask = () => {
      taskPressTimer = setTimeout(() => {
        /* addTask에서 심어준 id */
        onActionSheetOpen(task.id);
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
  document.querySelector(".todo-doing span").textContent = tasks.filter(
    (number) => !number.done,
  ).length;
  document.querySelector(".todo-done span").textContent = tasks.filter(
    (number) => number.done,
  ).length;
}
function initTaskModal(initTask) {
  /* remove 구문 제외 */
  const taskName = document.querySelector("#task-name");
  const taskTime = document.querySelector(".task-time span");
  const iconResult = document.querySelector(".icon-result");
  const iconPreview = document.querySelector(".icon-preview");
  const titleResult = document.querySelector(".title-result span");
  const previewTitle = document.querySelector(".preview-text h3");
  const maskURI =
    initTask.icon === "default"
      ? `url('public/icons/icon-doing.svg')`
      : `url('public/icons/icon-${initTask.icon}.svg')`;

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
}

export { renderTasks, initTaskModal };
