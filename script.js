import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// 여기를 본인 Firebase 설정값으로 바꾸세요.
const firebaseConfig = {
  apiKey: "여기에_API_KEY",
  authDomain: "여기에_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://여기에_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "여기에_PROJECT_ID",
  storageBucket: "여기에_PROJECT_ID.appspot.com",
  messagingSenderId: "여기에_SENDER_ID",
  appId: "여기에_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const countRef = ref(db, "hitCount");

const directors = [
  { normal: "person1.PNG", hit: "person1-hit.PNG" },
  { normal: "person2.PNG", hit: "person2-hit.PNG" }
];

const person = document.getElementById("person");
const hammer = document.getElementById("hammer");
const gameArea = document.getElementById("gameArea");
const countEl = document.getElementById("count");
const changeBtn = document.getElementById("changeBtn");
const hitSound = document.getElementById("hitSound");

let currentDirectorIndex = 0;
let isHitting = false;

onValue(countRef, (snapshot) => {
  const count = snapshot.val() ?? 0;
  countEl.textContent = count.toLocaleString();
});

changeBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (isHitting) return;

  currentDirectorIndex = (currentDirectorIndex + 1) % directors.length;
  person.src = directors[currentDirectorIndex].normal;
});

gameArea.addEventListener("click", async () => {
  if (isHitting) return;

  isHitting = true;
  const currentDirector = directors[currentDirectorIndex];

  person.src = currentDirector.hit;
  hammer.src = "hammer-hit.PNG";

  gameArea.classList.remove("hit");
  void gameArea.offsetWidth;
  gameArea.classList.add("hit");

  hitSound.currentTime = 0;
  hitSound.play().catch(() => {});

  try {
    await runTransaction(countRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });
  } catch (error) {
    console.error("카운트 증가 실패:", error);
  }

  setTimeout(() => {
    person.src = currentDirector.normal;
    hammer.src = "hammer.PNG";
    gameArea.classList.remove("hit");
    isHitting = false;
  }, 160);
});
