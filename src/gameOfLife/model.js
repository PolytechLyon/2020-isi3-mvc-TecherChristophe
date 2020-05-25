import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor(callbackFunction) {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.callBack = callbackFunction;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      const temp = new Set();
      if (currentTime - date > RENDER_INTERVAL) {
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            if (this.state[j][i] === CELL_STATES.ALIVE) {
              if (nbAlive < 2)
                temp.add({ x: i, y: j, string: CELL_STATES.DEAD });
              if (nbAlive > 3)
                temp.add({ x: i, y: j, string: CELL_STATES.DEAD });
            } else if (nbAlive === 3)
              temp.add({ x: i, y: j, string: CELL_STATES.ALIVE });
            //console.log(i,j,nbAlive);
          }
        }
        //temp.forEach(value => console.log(value.x, value.y, this.state[value.y][value.x]));
        temp.forEach(value => (this.state[value.y][value.x] = value.string));
        //temp.forEach(value => console.log(value.x, value.y, this.state[value.y][value.x]));
        this.updated();
        console.log();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    if (this.isCellAlive(x - 1, y)) number += 1;
    if (this.isCellAlive(x - 1, y - 1)) number += 1;
    if (this.isCellAlive(x - 1, y + 1)) number += 1;
    if (this.isCellAlive(x + 1, y)) number += 1;
    if (this.isCellAlive(x + 1, y - 1)) number += 1;
    if (this.isCellAlive(x + 1, y + 1)) number += 1;
    if (this.isCellAlive(x, y - 1)) number += 1;
    if (this.isCellAlive(x, y + 1)) number += 1;
    return number;
  }

  updated() {
    this.callBack(this);
  }
}
