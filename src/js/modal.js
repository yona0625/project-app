function openModal(modal) {
  modal.classList.add("open");
  modal.inert = false;
}
function closeModal(modal) {
  modal.classList.remove("open");
  modal.inert = true;
}

export { openModal, closeModal };
