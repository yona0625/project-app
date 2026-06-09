/* 색상 변경(공통) */
const savedTheme = localStorage.getItem("userTheme");
if (savedTheme) {
  const themes = {
    basic: { main: "#4c8ce4" },
    green: { main: "#5bbf7a" },
    pink: { main: "#f0857a" },
    orange: { main: "#ffc81e" },
    purple: { main: "#8b7ec8" },
    gray: { main: "#a5abbd" },
  };
  document.documentElement.style.setProperty(
    "--main_color",
    themes[savedTheme].main,
  );
}
import { taskFunction } from "./task.js";
import { customFunction } from "./custom.js";
import { alarmFunction } from "./alarm.js";

customFunction.init();
alarmFunction.init();
taskFunction.init();
