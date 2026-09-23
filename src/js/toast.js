import { renderTasks } from "./render.js";

/* toast - 할 일 추가 */
function showToast(message) {
  const toast = document.querySelector(".toast");
  const toastMsg = document.querySelector(".toast-msg");
  const toastCancel = document.querySelector(".toast-cancel");
  toastMsg.textContent = message;
  toastCancel.style.display = "none";
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

let deleteToastTask = null;
let deleteToastTimer = null;

/* onTaskRestore: 콜백 함수 */
function showDeleteToast(tasks, taskDelete, onTaskRestore) {
  const toast = document.querySelector(".toast");
  const toastMsg = document.querySelector(".toast-msg");
  const toastCancel = document.querySelector(".toast-cancel");

  deleteToastTask = taskDelete;

  toastCancel.style.display = "block";
  toastMsg.textContent = "삭제되었습니다";
  toast.classList.add("show");

  /* 연속 작동으로 인한 타이머 혼선 방지 */
  clearTimeout(deleteToastTimer);

  /* cancel을 하지 않을 경우 */
  deleteToastTimer = setTimeout(() => {
    /* filter를 통해 조건에 따라 재배열이 이루어지고(=삭제), 이 값을 저장해야 하므로 로컬 스토리지에 반영 */
    localStorage.setItem("tasks", JSON.stringify(tasks));
    /* character.js랑 연결 */
    document.dispatchEvent(new CustomEvent("tasksUpdated", { detail: tasks }));
    deleteToastTask = null;
    toast.classList.remove("show");
  }, 3000);

  /* cancel을 할 경우 */
  toastCancel.onclick = () => {
    /* 타이머 정지 -> 다시 원상복구하고 스토리지에 저장, toast 숨기기 */
    clearTimeout(deleteToastTimer);
    if (deleteToastTask) {
      tasks.push(deleteToastTask);
      deleteToastTask = null;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks, onTaskRestore);
    }
    toast.classList.remove("show");
  };
}

export { showToast };
export { showDeleteToast };