const DEFAULT_GRID = 20;

export function createInitialState(options = {}) {
  const gridSize = options.gridSize ?? DEFAULT_GRID;
  const start = options.start ?? { x: 8, y: 10 };
  const direction = options.direction ?? { x: 1, y: 0 };
  const initialLength = options.initialLength ?? 3;
  const snake = [];
  for (let i = 0; i < initialLength; i += 1) {
    snake.push({ x: start.x - i, y: start.y });
  }
  const food = spawnFood({ snake, gridSize }, options.rng);

  return {
    gridSize,
    snake,
    direction,
    pendingDirection: direction,
    food,
    score: 0,
    isGameOver: false,
  };
}

export function spawnFood(state, rng = Math.random) {
  const { gridSize, snake } = state;
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const open = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) open.push({ x, y });
    }
  }
  if (open.length === 0) return null;
  const idx = Math.floor(rng() * open.length);
  return open[idx];
}

export function setDirection(state, nextDir) {
  const { direction } = state;
  if (!nextDir) return state;
  if (direction.x + nextDir.x === 0 && direction.y + nextDir.y === 0) return state;
  return { ...state, pendingDirection: nextDir };
}

export function stepState(state, rng = Math.random) {
  if (state.isGameOver || !state.food) return state;

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

  if (
    nextHead.x < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y < 0 ||
    nextHead.y >= state.gridSize
  ) {
    return { ...state, isGameOver: true };
  }

  const bodySet = new Set(state.snake.map((segment) => `${segment.x},${segment.y}`));
  if (bodySet.has(`${nextHead.x},${nextHead.y}`)) {
    return { ...state, isGameOver: true };
  }

  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) nextSnake.pop();

  const nextState = {
    ...state,
    snake: nextSnake,
    direction,
    food: ateFood ? spawnFood({ ...state, snake: nextSnake }, rng) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };

  if (!nextState.food) {
    return { ...nextState, isGameOver: true };
  }

  return nextState;
}

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
