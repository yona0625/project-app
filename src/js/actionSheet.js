import { openModal, closeModal } from "./modal.js";

/* 수정/삭제 ui */
function showActionSheet(taskId, { onDelete, onEdit }) {
  const actionSheet = document.querySelector(".action-sheet");
  const mainDimmed = document.querySelector(".main-dimmed");
  const deleteBtn = document.querySelector(".action-delete");
  const editBtn = document.querySelector(".action-edit");
  const closeBtn = document.querySelector(".action-x-btn");
  const container = document.querySelector(".container");

  const scrollArea = document.querySelector(".scroll-area");
  const nav = document.querySelector("nav");

  openModal(actionSheet);
  mainDimmed.classList.add("active");
  scrollArea.style.overflow = "hidden";
  scrollArea.inert = true;
  nav.inert = true;

  /* 삭제 */
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    onDelete(taskId);
    closeModal(actionSheet);
    mainDimmed.classList.remove("active");

    scrollArea.style.overflow = "auto";
    scrollArea.inert = false;
    nav.inert = false;
  };
  /* 수정 */
  editBtn.onclick = (e) => {
    e.stopPropagation();
    onEdit(taskId);

    const taskModal = document.querySelector(".add-modal");
    document.querySelector(".task-set").classList.add("active");
    document.querySelector(".task-set h2").textContent = "수정하기";
    openModal(taskModal);
    mainDimmed.classList.add("active");
    closeModal(actionSheet);

    scrollArea.style.overflow = "auto";
    scrollArea.inert = true;
    nav.inert = true;
  };
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeModal(actionSheet);
    mainDimmed.classList.remove("active");

    scrollArea.style.overflow = "auto";
    scrollArea.inert = false;
    nav.inert = false;
  };
}

export { showActionSheet };
