const dayMessage = {
  isDefaultBubble: false,
  currentTypeInterval: null,
  animationTimer: null,
  // 시간 별 대사
  messages: {
    morning: {
      headerTitle: "좋은 아침,",
      bubble: [
        "기분 좋은 아침이에요!",
        "오늘도 반가워요!",
        "굿모닝! 활기찬 아침을 시작해봐요.",
      ],
    },
    afternoon: {
      headerTitle: "좋은 오후,",
      bubble: ["나른한 오후네요!", "잠시 쉬어가는 오후!", "오늘도 화이팅!"],
    },
    evening: {
      headerTitle: "좋은 저녁,",
      bubble: ["서서히 하루가 저물고 있네요.", "차분해진 저녁이군요."],
    },
    night: {
      headerTitle: "좋은 밤,",
      bubble: ["따뜻한 밤이에요.", "밤이 깊었네요.", "오늘 하루도 고생했어요."],
    },
  },
  conditions: [
    {
      check: function (tasks, doing, done) {
        return tasks.length === 1 && doing === 1;
      },
      message: "오늘의 첫 할 일 추가군요!",
      /* 스토리지에서 최초 추가되었을 때를 위한 플래그 키 */
      flagKey: "firstTaskAdded",
    },
    {
      check: function (tasks, doing, done) {
        return done === 1;
      },
      message: "첫 할 일을 완료했어요!",
      flagKey: "firstTaskDone",
    },
    {
      check: function (tasks, doing, done) {
        return done === 3;
      },
      message: "할 일을 3개째 완료했어요.",
      animation: "jump",
    },
    {
      check: function (tasks, doing, done) {
        return tasks.length >= 5 && done === 0;
      },
      message: "할 일이 많네요, 하나씩 해봐요!",
    },
    {
      check: function (tasks, doing, done) {
        return doing === 0 && done > 0;
      },
      message: "할 일을 전부 마쳤어요! 축하해요! 🎉",
      animation: "rainbow",
    },
    {
      check: function (tasks, doing, done) {
        return done > doing;
      },
      message: "실행력 만점! 대단해요!",
    },
  ],
  init: function () {
    const mascotFace = document.querySelector(".mascot-face");
    const bubble = document.querySelector(".mascot-bubble p");
    /* === 실시간 대사 반응(add/fix/delete/checkbox 대응) === */

    document.addEventListener("tasksUpdated", (e) => {
      const tasks = e.detail;
      const doing = tasks.filter(function (t) {
        return !t.done;
      }).length;
      const done = tasks.filter(function (t) {
        return t.done;
      }).length;

      /* 캐릭터 표정 관련 */
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
      mascotFace.classList.remove("jump", "rainbow");

      /* 상단 conditions와 match가 되는 경우 */
      const conMatch = this.conditions.find(function (c) {
        return c.check(tasks, doing, done);
      });
      // === 조건부 대사 출력 ===
      if (conMatch) {
        this.isDefaultBubble = false;
        /* flagKey가 있는 경우 */
        if (conMatch.flagKey) {
          /* 스토리지와 비교 - 스토리지에 없는 경우 */
          if (!localStorage.getItem(conMatch.flagKey)) {
            /* 스토리지에 key를 심어주고, 출력 */
            localStorage.setItem(conMatch.flagKey, "true");
            this.typeEffect(bubble, conMatch.message);
            this.playAnimation(mascotFace, conMatch.animation);
          }
          /* 스토리지에 있는 경우 */
        } else {
          /* 그냥 출력 */
          this.typeEffect(bubble, conMatch.message);
          this.playAnimation(mascotFace, conMatch.animation);
        }
      } else {
        // === 조건부 대사가 아닐 땐 기본 대사 출력 ===
        if (this.isDefaultBubble) return;
        this.isDefaultBubble = true;
        this.showRandomBubble(bubble);
      }
    });

    const headerTime = document.querySelector(".header-time");
    const headerUserName = document.querySelector(".header-user");
    // === 헤더 메시지 ===

    const timeMessage = this.getTime();
    const currentMessage = this.messages[timeMessage];

    if (headerTime) headerTime.textContent = currentMessage.headerTitle;
    if (headerUserName) headerUserName.textContent = " guest님";

    this.showRandomBubble(bubble);
  },
  playAnimation: function (mascotFace, aniClass) {
    if (!aniClass) return;
    mascotFace.classList.add(aniClass);

    if (this.animationTimer) {
      mascotFace.removeEventListener("animationend", handler);
    }

    mascotFace.addEventListener("animationend", function handler(e) {
      if (e.animationName === aniClass) {
        mascotFace.classList.remove(aniClass);
        mascotFace.removeEventListener("animationend", handler);
      }
    });
  },
  showRandomBubble: function (bubble) {
    const timeMessage = this.getTime();
    const currentMessage = this.messages[timeMessage];

    /* 몇 번째를 꺼낼 것인지? */
    const randomIndex = Math.floor(
      Math.random() * currentMessage.bubble.length,
    );
    /* 실제로 꺼내기(캐릭터 대사) */
    const randomBubble = currentMessage.bubble[randomIndex];
    this.typeEffect(bubble, randomBubble);
  },
  /* 시간 산출 */
  getTime: function () {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 21) return "evening";
    return "night";
  },
  /* 타이핑 효과 */
  typeEffect: function (element, text) {
    /* 기존 타이핑 중단 */
    clearInterval(this.currentTypeInterval);
    /* 초기화 */
    element.textContent = "";
    let typeIndex = 0;
    this.currentTypeInterval = setInterval(() => {
      /* 0.5초마다 한글자씩 추가 */
      element.textContent += text[typeIndex];
      typeIndex++;
      if (typeIndex >= text.length) {
        clearInterval(this.currentTypeInterval);
      }
    }, 45);
  },
};
dayMessage.init();
