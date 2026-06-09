import { newTask } from "./state.js";
// import { taskFunction } from "./task.js";

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

    const resetColor = document.querySelector(".reset-color");
    resetColor.addEventListener("click", () => {
      this.resetCustom();
    });
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
        /* 체크 박스. 선언 시점 중요 */
        const allColorPreset = document.querySelectorAll(".color-list li");
        allColorPreset.forEach((li) => li.classList.remove("checked"));
        colorPreset.classList.add("checked");

        /* 컬러 지정(실시간 반영) */
        /* newTask가 아니라 customTask로 받아야 함 */
        this.customTask.selectedColor = customColor;

        const previewTitle = document.querySelector(".preview-text h3");
        const iconPreview = document.querySelector(".icon-preview");
        const titleResult = document.querySelector(".title-result span");
        const iconResult = document.querySelector(".icon-result");
        /* 미리보기에 적용 */
        previewTitle.style.color = customColor;
        iconPreview.style.backgroundColor = customColor;
        titleResult.style.backgroundColor = customColor;
        iconResult.style.backgroundColor = customColor;

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
          /* 체크 박스 */
          const allIconBox = document.querySelectorAll(".mark-section ul li");
          allIconBox.forEach((li) => li.classList.remove("selected"));
          iconBox.classList.add("selected");

          /* 아이콘 지정(실시간 반영) */
          this.customTask.selectedIcon = iconName;

          /* 이미지 마스크, css와 동일 */
          const iconResult = document.querySelector(".icon-result");
          iconResult.style.maskImage = `url("/public/icons/icon-${iconName}.svg")`;
          iconResult.style.webkitMaskImage = `url("/public/icons/icon-${iconName}.svg")`;

          /* 미리보기 반영 */
          const iconPreview = document.querySelector(".icon-preview");
          iconPreview.style.maskImage = `url("/public/icons/icon-${iconName}.svg")`;
          iconPreview.style.webkitMaskImage = `url("/public/icons/icon-${iconName}.svg")`;

          /* newTask가 아니라 customTask로 받아야 함 */
          /* 지금의 newTask는 흑백이 기본 값인데, 흑백이 아니라 커스텀으로 들어가야 하므로 */
          if (this.customTask.selectedColor) {
            iconPreview.style.backgroundColor = this.customTask.selectedColor;
          }
          this.customCheck();
        });
        ul.appendChild(iconBox);
      });
    });
  },
  resetCustom: function () {
    /* 체크박스, 아이콘 선택 시각 효과 초기화 */
    const allColorPreset = document.querySelectorAll(".color-list li");
    const allIconBox = document.querySelectorAll(".mark-section ul li");

    allColorPreset.forEach((li) => li.classList.remove("checked"));
    allIconBox.forEach((li) => li.classList.remove("selected"));

    /* 데이터 초기화 */
    this.customTask.selectedColor = null;
    this.customTask.selectedIcon = null;

    /* 초기화 - DOM 반영 */
    /* custom-modal : 흑백에 기본 아이콘 유지 */
    const iconPreview = document.querySelector(".icon-preview");
    const maskURI = "url('/public/icons/icon-doing.svg')";
    const previewTitle = document.querySelector(".preview-text h3");

    iconPreview.style.backgroundColor = "#2d2d2d";
    previewTitle.style.color = "#2d2d2d";
    iconPreview.style.maskImage = maskURI;
    iconPreview.style.webkitMaskImage = maskURI;

    /* add-modal */
    const iconResult = document.querySelector(".icon-result");
    const titleResult = document.querySelector(".title-result span");
    iconResult.style.backgroundColor = "#2d2d2d";
    titleResult.style.backgroundColor = "#2d2d2d";
    iconResult.style.maskImage = maskURI;
    iconResult.style.webkitMaskImage = maskURI;
  },
};

export { customFunction };
