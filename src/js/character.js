const dayMessage = {
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
  init: function () {
    const timeMessage = this.getTime();
    const currentMessage = this.messages[timeMessage];

    const headerTime = document.querySelector(".header-time");
    const headerUserName = document.querySelector(".header-user");
    const bubble = document.querySelector(".mascot-bubble p");
    // 헤더 메시지
    headerTime.textContent = currentMessage.headerTitle;
    headerUserName.textContent = " 00님";

    /* 몇 번째를 꺼낼 것인지? */
    const randomIndex = Math.floor(
      Math.random() * currentMessage.bubble.length,
    );
    /* 실제로 꺼내기(캐릭터 대사) */
    const randomBubble = currentMessage.bubble[randomIndex];

    // 캐릭터 메시지
    // bubble.textContent = randomBubble;
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
    /* 초기화 */
    element.textContent = "";
    let typeIndex = 0;
    const typeInterval = setInterval(function () {
      /* 0.5초마다 한글자씩 추가 */
      element.textContent += text[typeIndex];
      typeIndex++;
      if (typeIndex >= text.length) {
        clearInterval(typeInterval);
      }
    }, 45);
  },
};
dayMessage.init();
