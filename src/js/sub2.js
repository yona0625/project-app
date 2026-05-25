/* 테마 설정 */
const selectTheme = {
  themeColor: {
    basic: "#4c8ce4",
    green: "#5bbf7a",
    pink: "#f0857a",
    orange: "#ffc81e",
    purple: "#8b7ec8",
    gray: "#a5abbd",
  },
  init: function () {
    const themeBtn = document.querySelector(".select-theme");
    const themeList = document.querySelector(".color-theme");
    const themeCloseBtn = document.querySelector(".theme-close-btn");
    const themeSetBtn = document.querySelector(".theme-set");
    const themeItems = document.querySelectorAll(".color-list .item");

    /* 테마 불러오기 */
    const savedThemeColor = localStorage.getItem("userTheme") || "basic";
    this.applyTheme(savedThemeColor, themeItems);

    /* 테마 색상 클릭 시 */
    themeItems.forEach((colorItem) => {
      colorItem.addEventListener("click", () => {
        /* themeColor의 key값만 선택해서 find. html상의 .item에서 다른 class명은 거르기 위해 classList 스프레드를 사용 */
        const themeName = [...colorItem.classList].find(
          (c) => this.themeColor[c],
        );
        /* 적용하고, 스토리지에 저장 */
        this.applyTheme(themeName, themeItems);
        localStorage.setItem("userTheme", themeName);
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
      themeList.classList.remove("open");
    });
  },
  applyTheme: function (themeName, themeItems) {
    /* document.documentElement = html 태그 */
    document.documentElement.style.setProperty(
      "--main-color",
      this.themeColor[themeName],
    );
    /* 체크 마크 관련 */
    themeItems.forEach((item) => {
      item.classList.remove("selected");
    });
    document
      .querySelector(`.color-list .${themeName}`)
      .classList.add("selected");
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
