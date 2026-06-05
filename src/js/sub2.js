/* 데이터 리셋 */
const userDataReset = {
  init: function () {
    const resetArea = document.querySelector(".data-reset");
    const resetBtn = document.querySelector(".reset-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const resetModal = document.querySelector(".data-reset-modal");
    const dimmed = document.querySelector(".modal-dimmed");
    resetArea.addEventListener("click", () => {
      resetModal.classList.add("open");
      dimmed.classList.add("active");
    });
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("tasks");
      /* 플래그도 삭제 */
      localStorage.removeItem("firstTaskAdded");
      localStorage.removeItem("firstTaskDone");
      resetModal.classList.remove("open");
      dimmed.classList.remove("active");
    });
    cancelBtn.addEventListener("click", () => {
      resetModal.classList.remove("open");
      dimmed.classList.remove("active");
    });
  },
};
userDataReset.init();
/* 테마 설정 */
const selectTheme = {
  themeColor: {
    basic: { main: "#4c8ce4", light: "#A6C6F1" },
    green: { main: "#5bbf7a", light: "#A8DFB8" },
    pink: { main: "#f0857a", light: "#F7C0BB" },
    orange: { main: "#ffc81e", light: "#FFE99A" },
    purple: { main: "#8b7ec8", light: "#C4BDE8" },
    gray: { main: "#a5abbd", light: "#D4D7DF" },
  },
  selectedTheme: null,
  init: function () {
    const themeBtn = document.querySelector(".select-theme");
    const themeList = document.querySelector(".color-theme");
    const themeCloseBtn = document.querySelector(".theme-close-btn");
    const themeSetBtn = document.querySelector(".theme-set");
    const themeItems = document.querySelectorAll(".color-list .item");

    /* 테마 불러오기 */
    const savedThemeColor = localStorage.getItem("userTheme") || "basic";
    this.applyTheme(savedThemeColor);

    /* 맨 처음 초기 체크마크 표시, 이 경우 basic이므로 blue(기본) */
    /* 새로 고침해도 유지됨. */
    document
      .querySelector(`.color-list .${savedThemeColor}`)
      .classList.add("selected");

    /* 테마 색상 클릭 시 */
    themeItems.forEach((colorItem) => {
      colorItem.addEventListener("click", () => {
        /* themeColor의 key값만 선택해서 find. html상의 .item에서 다른 class명은 거르기 위해 classList 스프레드를 사용 */
        const themeName = [...colorItem.classList].find(
          (c) => this.themeColor[c],
        );
        /* 체크 마크 변경(실시간, 새로고침 시 없어짐) */
        themeItems.forEach((item) => item.classList.remove("selected"));
        colorItem.classList.add("selected");
        this.selectedTheme = themeName;
      });
    });

    /* 열기 */
    themeBtn.addEventListener("click", () => {
      themeList.classList.add("open");
    });
    /* 닫기 */
    themeCloseBtn.addEventListener("click", () => {
      themeList.classList.remove("open");
    });
    themeSetBtn.addEventListener("click", () => {
      /* selectedTheme(=즉 테마를 선택 시) */
      if (this.selectedTheme) {
        this.applyTheme(this.selectedTheme);
        localStorage.setItem("userTheme", this.selectedTheme);
      }
      themeList.classList.remove("open");
    });
  },
  applyTheme: function (themeName) {
    /* document.documentElement = html 태그 */
    document.documentElement.style.setProperty(
      "--main_color",
      this.themeColor[themeName].main,
    );
    document.documentElement.style.setProperty(
      "--main_color_light",
      this.themeColor[themeName].light,
    );
  },
};
selectTheme.init();
/* 언어 설정 */
const selectLang = {
  init: function () {
    const langBtn = document.querySelector(".select-lang");
    const langList = document.querySelector(".lang-setting");
    const dimmed = document.querySelector(".modal-dimmed");
    const langCloseBtn = document.querySelector(".lang-close-btn");
    const langSetBtn = document.querySelector(".lang-set");
    langBtn.addEventListener("click", () => {
      langList.classList.add("open");
      dimmed.classList.add("active");
    });
    langCloseBtn.addEventListener("click", () => {
      langList.classList.remove("open");
      dimmed.classList.remove("active");
    });
    langSetBtn.addEventListener("click", () => {
      langList.classList.remove("open");
      dimmed.classList.remove("active");
    });
  },
};
selectLang.init();
