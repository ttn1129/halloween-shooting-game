const DISPLAY = {
  WIDTH: 320,
  HEIGHT: 480
};
const PLAYER = {
  SIZE: DISPLAY.WIDTH / 10
};
const BULLET = {
  SIZE: DISPLAY.WIDTH / 40,
  SPEED: 15
};
const GHOST = {
  SIZE: DISPLAY.WIDTH / 10,
  SPEED: 4
};

class GameContent {
  constructor(x, y, size, angle, speed, container) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = angle;
    this.speed = speed;
    this.container = container;
    this.removed = false;
    const element = document.createElement("div");
    container.appendChild(element);
    element.style.position = "absolute";
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    this.element = element;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.element.style.left = `${this.x - this.size / 2}px`;
    this.element.style.top = `${this.y - this.size / 2}px`;
  }

  remove() {
    this.element.remove();
    this.removed = true;
  }

  isAvailable() {
    if (this.removed) return false;
    if (
      this.x < -this.size ||
      this.x > DISPLAY.WIDTH + this.size ||
      this.y < -this.size ||
      this.y > DISPLAY.HEIGHT + this.size
    ) {
      return false;
      this.remove();
    }
    return true;
  }
}
class Bullet extends GameContent {
  constructor(x, y, angle, container) {
    super(x, y, BULLET.SIZE, angle, BULLET.SPEED, container);
    this.element.style.backgroundColor = "#ff0";
    this.element.style.borderRadius = "50%";
  }
}
class Ghost extends GameContent {
  constructor(x, y, angle, speed, container) {
    super(x, y, GHOST.SIZE, angle, speed, container);

    this.power = Math.random() * 5;

    this.element.style.display = "flex";
    this.element.style.justifyContent = "center";
    this.element.style.alignItems = "center";
    this.element.style.fontSize = `${GHOST.SIZE}px`;
    this.element.textContent = "👻";
  }
  hit() {
    this.power--;
    if (this.power < 0) {
      this.remove();
    } else {
      this.element.style.filter = "brightness(100)";
    }
  }
}

function App() {
  const _this = this;
  _this.running = false;
  let displayElement = null;
  let score = 0;
  let scoreElement = null;
  let restartButtonElement = null;
  let playerElement = null;
  let playerX = DISPLAY.WIDTH / 2;
  let playerY = DISPLAY.HEIGHT / 2;

  let bulletList = [];
  let ghostList = [];

  _this.init = () => {
    // displayElement
    displayElement = document.createElement("div");
    displayElement.style.position = "relative";
    displayElement.style.overflow = "hidden";
    displayElement.style.width = `${DISPLAY.WIDTH}px`;
    displayElement.style.height = `${DISPLAY.HEIGHT}px`;
    displayElement.style.backgroundColor = "#202";
    document.body.appendChild(displayElement);

    // scoreElement
    scoreElement = document.createElement("div");
    document.body.appendChild(scoreElement);

    // restartButtonElement
    restartButtonElement = document.createElement("button");
    restartButtonElement.textContent = "restart";
    restartButtonElement.onclick = (e) => {
      window.location.reload();
    };
    document.body.appendChild(restartButtonElement);

    // playerElement
    playerElement = document.createElement("div");
    playerElement.style.position = "absolute";
    playerElement.style.display = "flex";
    playerElement.style.justifyContent = "center";
    playerElement.style.alignItems = "center";
    playerElement.style.width = `${PLAYER.SIZE}px`;
    playerElement.style.height = `${PLAYER.SIZE}px`;
    playerElement.style.fontSize = `${PLAYER.SIZE}px`;
    playerElement.textContent = "🎃";
    displayElement.appendChild(playerElement);
    _this.update();

    {
      let originalX = -1;
      let originalY = -1;
      let originalPlayerX = -1;
      let originalPlayerY = -1;
      document.onpointerdown = (e) => {
        e.preventDefault();
        originalX = e.pageX;
        originalY = e.pageY;
        originalPlayerX = playerX;
        originalPlayerY = playerY;
      };
      document.onpointermove = (e) => {
        e.preventDefault();
        if (originalX !== -1) {
          const dx = e.pageX - originalX;
          const dy = e.pageY - originalY;
          playerX = originalPlayerX + dx;
          playerY = originalPlayerY + dy;
          playerX = Math.min(
            DISPLAY.WIDTH - PLAYER.SIZE / 2,
            Math.max(PLAYER.SIZE / 2, playerX)
          );
          playerY = Math.min(
            DISPLAY.HEIGHT - PLAYER.SIZE / 2,
            Math.max(PLAYER.SIZE / 2, playerY)
          );
          _this.update();
        }
      };
      document.onpointerup = (e) => {
        e.preventDefault();
        originalX = -1;
      };
    }
  };

  _this.update = () => {
    playerElement.style.left = `${playerX - PLAYER.SIZE / 2}px`;
    playerElement.style.top = `${playerY - PLAYER.SIZE / 2}px`;
  };

  _this.start = async () => {
    _this.gameOver = false;
    let ghostInterval = 0;
    let bulletInterval = 0;

    while (true) {
      scoreElement.textContent = score;
      if (_this.gameOver) break;
      await new Promise((r) => setTimeout(r, 16));
      if (bulletInterval === 0) {
        bulletInterval = 5;
        bulletList.push(
          new Bullet(playerX, playerY, (-90 * Math.PI) / 180, displayElement)
        );
        bulletList.push(
          new Bullet(playerX, playerY, (-45 * Math.PI) / 180, displayElement)
        );
        bulletList.push(
          new Bullet(playerX, playerY, (-135 * Math.PI) / 180, displayElement)
        );
        bulletList.push(
          new Bullet(playerX, playerY, (45 * Math.PI) / 180, displayElement)
        );
        bulletList.push(
          new Bullet(playerX, playerY, (90 * Math.PI) / 180, displayElement)
        );
        bulletList.push(
          new Bullet(playerX, playerY, (135 * Math.PI) / 180, displayElement)
        );
      }
      bulletInterval--;
      if (ghostInterval === 0) {
        ghostInterval = 5;
        const gx = Math.random() * DISPLAY.WIDTH;
        const gy = Math.random() > 0.5 ? 0 : DISPLAY.HEIGHT;
        const angle = Math.atan2(playerY - gy, playerX - gx);
        const speed = GHOST.SPEED;
        ghostList.push(new Ghost(gx, gy, angle, speed, displayElement));
      }
      ghostInterval--;
      for (let bullet of bulletList) {
        bullet.update();
      }
      for (let ghost of ghostList) {
        ghost.update();
      }

      bulletList = bulletList.filter((v) => v.isAvailable());
      ghostList = ghostList.filter((v) => v.isAvailable());

      for (const ghost of ghostList) {
        for (const bullet of bulletList) {
          const dx = ghost.x - bullet.x;
          const dy = ghost.y - bullet.y;
          const diff = ((GHOST.SIZE + BULLET.SIZE) / 2) * 0.8;
          if (dx ** 2 + dy ** 2 < diff ** 2) {
            ghost.hit();
            score += 10;
            bullet.remove();
          }
        }
        if (!ghost.removed) continue;
        const dx = ghost.x - playerX;
        const dy = ghost.y - playerY;
        const diff = ((GHOST.SIZE + PLAYER.SIZE) / 2) * 0.6;
        if (dx ** 2 + dy ** 2 < diff ** 2) {
          _this.stop();
          return;
        }
      }
    }
  };

  _this.stop = () => {
    _this.gameOver = true;
  };
}

window.onload = () => {
  const app = new App();
  app.init();
  app.start();
};
