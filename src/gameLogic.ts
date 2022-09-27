import { cloneDeep } from "lodash";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

enum ErrorCode {
  TooLittleTimePassed = 0,
}

export enum Direction {
  Up = 0,
  Left,
  Down,
  Right,
}

export enum Status {
  NotStarted = 0,
  Over,
  Ongoing,
  Win,
}

export enum Key {
  ArrowUp = 0,
  ArrowLeft,
  ArrowDown,
  ArrowRight,
}

export interface Coord {
  x: number;
  y: number;
}

export interface Segment {
  pos: Coord;
  dir: Direction;
  len: number;
}

export const useGameStore = defineStore("game", () => {
  /* ============================== Settings ============================== */
  const boardSize = ref<Coord>({ x: 15, y: 15 });
  const boardWidth = computed(() => boardSize.value.x);
  const boardHeight = computed(() => boardSize.value.y);
  /* ====================================================================== */

  /* ============================ Core Logic ============================== */
  const game = new Game();
  const initialized = ref<string[]>([]);
  const startTime = ref<number>(-1);
  const lastTime = ref<number>(-1);
  const executionTime = ref<number>(0);
  const isPlaying = ref<boolean>(false);
  const status = ref<Status>(Status.NotStarted);

  const highScoreFromStorage = Number.parseInt(localStorage.getItem("highScore")!);
  const highScore = ref<number>(!Number.isNaN(highScoreFromStorage) ? highScoreFromStorage : 0);
  const newHighScore = ref<boolean>(false);

  const snake = ref<Coord[]>([randPos(boardWidth.value, boardHeight.value)]);
  const oldSnake = ref<Coord[]>([]);
  const dir = ref([randDir()]);
  const dirKeyQueue = ref<Key[]>([]);

  const foodPos = ref<Coord>(randFoodPos(snake.value, boardWidth.value, boardHeight.value));

  const currentSpeed = ref<number>(1.0);
  const frameTime = computed<number>(() => 400 * (1 / currentSpeed.value));

  function reset() {
    game.reset();
  }
  function start() {
    game.start();
  }
  function pause() {
    game.pause();
  }
  function init(id: string) {
    game.init(id);
  }
  const allInitialized = computed(() => {
    return (
      initialized.value?.includes("snake") &&
      initialized.value?.includes("rat") &&
      initialized.value?.includes("canvas")
    );
  });

  const canvasRef = ref<HTMLDivElement>();

  /* ====================================================================== */

  return {
    snake,
    oldSnake,
    foodPos,
    dir,
    dirKeyQueue,
    boardWidth,
    boardHeight,
    reset,
    start,
    pause,
    init,
    initialized,
    allInitialized,
    startTime,
    isPlaying,
    currentSpeed,
    frameTime,
    lastTime,
    executionTime,
    canvasRef,
    status,
    highScore,
    newHighScore,
  };
});

class Game {
  private gameStore?: ReturnType<typeof useGameStore>;

  constructor() {
    this.reset = this.reset.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.init = this.init.bind(this);
    this.mainLoop = this.mainLoop.bind(this);
    this.advance = this.advance.bind(this);
  }

  reset() {
    if (this.gameStore) {
      const { snake, highScore, boardWidth, boardHeight } = this.gameStore;
      const newSnake = [randPos(boardWidth, boardHeight)];
      const dir = [randDir()];
      const newFoodPos = randFoodPos(newSnake, boardWidth, boardHeight);
      this.gameStore.$patch({
        startTime: performance.now(),
        snake: newSnake,
        dir,
        foodPos: newFoodPos,
        currentSpeed: 1.0,
        highScore: snake.length - 1 > highScore ? snake.length - 1 : highScore,
        newHighScore: false,
      });
    } else {
      console.error("Can't reset now. Game has not been initialized");
    }
  }
  start() {
    if (this.gameStore) {
      this.gameStore.$patch({ isPlaying: true, status: Status.Ongoing });

      requestAnimationFrame(this.mainLoop);
    } else {
      console.error("Can't start now. Game has not been initialized");
    }
  }
  pause() {
    if (this.gameStore) {
      this.gameStore.$patch({ isPlaying: false });
    } else {
      console.error("Can't pause now. Game has not been initialized");
    }
  }

  init(id: string) {
    if (!this.gameStore) this.gameStore = useGameStore();

    let initialized = this.gameStore.initialized;
    if (!initialized.includes(id)) {
      initialized.push(id);
    }
    this.gameStore.$patch({ initialized });
  }

  private mainLoop() {
    if (!this.gameStore) return;
    let { lastTime, isPlaying, frameTime, executionTime } = cloneDeep(this.gameStore);

    const now = performance.now();
    const deltaTime = now - lastTime;

    try {
      // Return if the game is paused
      if (!isPlaying) return;

      // Don't render more than 62 frames per second
      if (deltaTime < 16) {
        throw ErrorCode.TooLittleTimePassed;
      }

      // Only rerender when the position of the snake is updated
      if (deltaTime < frameTime) {
        throw ErrorCode.TooLittleTimePassed;
      }

      executionTime += deltaTime;
      lastTime = now;
      this.gameStore.$patch({ lastTime, executionTime });

      this.advance();
    } catch (_err) {
      const errorCode = _err as ErrorCode;
      if (errorCode === ErrorCode.TooLittleTimePassed) {
      }
    } finally {
      // Rerun loop
      requestAnimationFrame(this.mainLoop);
    }
  }

  private advance() {
    if (!this.gameStore) return;

    let {
      snake,
      oldSnake,
      dir,
      dirKeyQueue,
      foodPos,
      currentSpeed,
      boardHeight,
      boardWidth,
      highScore,
    } = this.gameStore;
    if (!snake.length) return;

    if (dirKeyQueue.length) {
      for (let i = 0; i < 2 && i < dirKeyQueue.length; i++) {
        switch (dirKeyQueue.shift()) {
          case Key.ArrowUp: {
            if (dir[dir.length - 1] === Direction.Up || dir[dir.length - 1] === Direction.Down)
              continue;
            dir.push(Direction.Up);
            break;
          }
          case Key.ArrowLeft: {
            if (dir[dir.length - 1] === Direction.Left || dir[dir.length - 1] === Direction.Right)
              continue;
            dir.push(Direction.Left);
            break;
          }
          case Key.ArrowDown: {
            if (dir[dir.length - 1] === Direction.Up || dir[dir.length - 1] === Direction.Down)
              continue;
            dir.push(Direction.Down);
            break;
          }
          case Key.ArrowRight: {
            if (dir[dir.length - 1] === Direction.Left || dir[dir.length - 1] === Direction.Right)
              continue;
            dir.push(Direction.Right);
            break;
          }
          default:
            break;
        }
      }
      this.gameStore.$patch({ dirKeyQueue, dir });
    }

    oldSnake = snake;
    snake = [
      getPosFromDir(snake[0], dir.length > 1 ? dir.shift()! : dir[0], boardHeight, boardWidth),
      ...snake,
    ];

    if (foodPos.x === snake[0].x && foodPos.y === snake[0].y) {
      // If snake ate food, add speed and move food

      // Increase the speed of the snake
      currentSpeed += 0.1;

      // Move food
      const newFoodPos = randFoodPos(snake, boardWidth, boardHeight);

      this.gameStore.$patch({ currentSpeed, foodPos: newFoodPos });
    } else {
      snake.pop();
    }

    this.gameStore.$patch({ snake, oldSnake });

    if (checkWin(snake, boardHeight, boardWidth)) {
      this.gameStore.$patch({ status: Status.Win, highScore: snake.length - 1, isPlaying: false });
    } else if (checkGameOver(snake)) {
      this.gameStore.$patch({
        status: Status.Over,
        isPlaying: false,
        newHighScore: snake.length - 1 > highScore,
        highScore: snake.length - 1 > highScore ? snake.length - 1 : highScore,
      });
    }
  }
}

function randFoodPos(snake: Coord[], boardWidth: number, boardHeight: number): Coord {
  let pos = randPos(boardWidth, boardHeight);
  while (snake.some((p) => p.x === pos.x && p.y === pos.y)) pos = randPos(boardWidth, boardHeight);
  return pos;
}

function randPos(boardWidth: number, boardHeight: number): Coord {
  return {
    x: Math.round(Math.random() * (boardWidth - 1)),
    y: Math.round(Math.random() * (boardHeight - 1)),
  };
}

function randDir(): Direction {
  return Math.round(Math.random() * 4);
}

function getPosFromDir(
  initPos: Coord,
  dir: Direction,
  boardHeight: number,
  boardWidth: number,
  len: number = 1,
): Coord {
  switch (dir) {
    case Direction.Up: {
      let forwardY = initPos.y - len;
      const overflow = forwardY < 0;
      if (overflow) forwardY = boardHeight - 1;
      return { x: initPos.x, y: forwardY };
    }
    case Direction.Left: {
      let forwardX = initPos.x - len;
      const overflow = forwardX < 0;
      if (overflow) forwardX = boardWidth - 1;
      return { x: forwardX, y: initPos.y };
    }
    case Direction.Down: {
      let forwardY = initPos.y + len;
      const overflow = forwardY >= boardHeight;
      if (overflow) forwardY = 0;
      return { x: initPos.x, y: forwardY };
    }
    case Direction.Right: {
      let forwardX = initPos.x + len;
      const overflow = forwardX >= boardWidth;
      if (overflow) forwardX = 0;
      return { x: forwardX, y: initPos.y };
    }
    default:
      throw Error(`Direction ${dir} is wrong...`);
  }
}

function checkWin(snake: Coord[], boardHeight: number, boardWidth: number): boolean {
  return snake.length === boardHeight * boardWidth;
}

function checkGameOver(snake: Coord[]): boolean {
  const head = snake[0];
  if (!head) return false;

  return snake.some((pos, i) => i !== 0 && pos.x === head.x && pos.y === head.y);
}
