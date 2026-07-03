import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3-yjV9GTUSTiuuj9RA8MvvqbDk9P62Fw",
  authDomain: "famous-director-hammer.firebaseapp.com",
  databaseURL: "https://famous-director-hammer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "famous-director-hammer",
  storageBucket: "famous-director-hammer.firebasestorage.app",
  messagingSenderId: "204291574432",
  appId: "1:204291574432:web:e460262f6e48f76f30d7c5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const countRef = ref(db, "hitCount");

const directors = [
  {
    normal: "person1.PNG",
    hit: "person1-hit.PNG"
  },
  {
    normal: "person2.PNG",
    hit: "person2-hit.PNG"
  }
];

const person = document.getElementById("person");
const hammer = document.getElementById("hammer");
const gameArea = document.getElementById("gameArea");
const countEl = document.getElementById("count");
const changeBtn = document.getElementById("changeBtn");
const hitSound = document.getElementById("hitSound");

let currentDirectorIndex = 0;
let hitResetTimer = null;

onValue(countRef, (snapshot) => {
  const count = snapshot.val() ?? 0;
  countEl.textContent = count.toLocaleString();
});

changeBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  currentDirectorIndex = (currentDirectorIndex + 1) % directors.length;
  person.src = directors[currentDirectorIndex].normal;
});

gameArea.addEventListener("click", async () => {
  const currentDirector = directors[currentDirectorIndex];
  // 맞는 순간 이미지로 변경
  person.src = currentDirector.hit;
  hammer.src = "hammer-hit.PNG";
  // 애니메이션 재시작
  gameArea.classList.remove("hit");
  void gameArea.offsetWidth;
  gameArea.classList.add("hit");
  // 효과음 겹쳐 재생
  const sound = new Audio("hit.mp3");
  sound.volume = 1;
  sound.play().catch(() => {});
  // Firebase 전체 누적 횟수 +1
  try {
    await runTransaction(countRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });
  } catch (error) {
    console.error("카운트 증가 실패:", error);
  }
  // 연타해도 마지막 클릭 기준으로 원래 이미지 복귀
  clearTimeout(hitResetTimer);
  hitResetTimer = setTimeout(() => {
    person.src = directors[currentDirectorIndex].normal;
    hammer.src = "hammer.PNG";
    gameArea.classList.remove("hit");
  }, 160);

});
let lastTouchTime = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = Date.now();
    if (now - lastTouchTime <= 300) {
      event.preventDefault();
    }
    lastTouchTime = now;
  },
  { passive: false }
);
