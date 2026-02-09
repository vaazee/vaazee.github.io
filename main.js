import { createInitialState, stepState, setDirection, DIRECTIONS } from "./snake.js";

const canvas = document.querySelector("#board");
const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#highScore");
const statusEl = document.querySelector("#status");
const restartBtn = document.querySelector("#restartBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const dpad = document.querySelector(".dpad");
const ctx = canvas.getContext("2d");

const GRID = 20;
const TICK_MS = 120;

let state = createInitialState({ gridSize: GRID });
let isPaused = false;
let tickId = null;
let highScore = 0;

function startLoop() {
  if (tickId) clearInterval(tickId);
  tickId = setInterval(() => {
    if (isPaused || state.isGameOver) return;
    state = stepState(state);
    render();
    if (state.isGameOver) updateStatus();
  }, TICK_MS);
}

function resetGame() {
  state = createInitialState({ gridSize: GRID });
  isPaused = false;
  updateStatus();
  render();
}

function togglePause() {
  if (state.isGameOver) return;
  isPaused = !isPaused;
  updateStatus();
}

function updateStatus() {
  if (state.isGameOver) {
    statusEl.textContent = "Game Over";
    statusEl.classList.add("show");
    return;
  }
  if (isPaused) {
    statusEl.textContent = "Paused";
    statusEl.classList.add("show");
    return;
  }
  statusEl.textContent = "";
  statusEl.classList.remove("show");
}

function render() {
  const cell = canvas.width / GRID;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#d9d1c3";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(canvas.width, i * cell);
    ctx.stroke();
  }

  ctx.fillStyle = "#2d6b5f";
  state.snake.forEach((segment, idx) => {
    ctx.fillStyle = idx === 0 ? "#1f1d1a" : "#2d6b5f";
    ctx.fillRect(segment.x * cell + 1, segment.y * cell + 1, cell - 2, cell - 2);
  });

  if (state.food) {
    ctx.fillStyle = "#9f2f2f";
    ctx.fillRect(state.food.x * cell + 2, state.food.y * cell + 2, cell - 4, cell - 4);
  }

  scoreEl.textContent = String(state.score);
  if (state.score > highScore) highScore = state.score;
  highScoreEl.textContent = String(highScore);

  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
}

function handleKey(event) {
  const key = event.key.toLowerCase();
  const map = {
    arrowup: DIRECTIONS.up,
    w: DIRECTIONS.up,
    arrowdown: DIRECTIONS.down,
    s: DIRECTIONS.down,
    arrowleft: DIRECTIONS.left,
    a: DIRECTIONS.left,
    arrowright: DIRECTIONS.right,
    d: DIRECTIONS.right,
  };

  if (key === " ") {
    event.preventDefault();
    togglePause();
    return;
  }

  const nextDir = map[key];
  if (!nextDir) return;
  event.preventDefault();
  state = setDirection(state, nextDir);
}

function handleDpad(event) {
  const button = event.target.closest("button[data-dir]");
  if (!button) return;
  const dirKey = button.getAttribute("data-dir");
  const nextDir = DIRECTIONS[dirKey];
  state = setDirection(state, nextDir);
}

restartBtn.addEventListener("click", () => {
  resetGame();
});

pauseBtn.addEventListener("click", () => {
  togglePause();
});

dpad.addEventListener("click", handleDpad);
window.addEventListener("keydown", handleKey);

resetGame();
startLoop();
