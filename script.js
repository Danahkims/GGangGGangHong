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
