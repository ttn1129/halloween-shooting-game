const GAME_BOARD = {
  FONTSIZE: 24
};
const GAMES = [
  {
    title: "HalloweenShootingGame",
    thumbnail: "/games/HalloweenShootingGame/img/thumbnail.png",
    onclick: startHalloweenShootingGame
  }
];
function startHalloweenShootingGame() {
  const app = new HalloweenShootingGame();
  app.init();
  app.start();
}
class GameBoard {
  constructor() {
    // gameBoardsContainerElement
    const gameBoardsContainerElement = document.createElement("div");
    gameBoardsContainerElement.style.position = "absolute";
    gameBoardsContainerElement.style.display = "flex";
    gameBoardsContainerElement.style.justifyContent = "center";
    gameBoardsContainerElement.style.alignItems = "center";
    gameBoardsContainerElement.style.backgroundColor = "#202";
    gameBoardsContainerElement.style.width = `${DISPLAY.WIDTH}px`;
    gameBoardsContainerElement.style.height = `${(DISPLAY.HEIGHT * 2) / 3}px`;
    this.gameBoardsContainerElement = gameBoardsContainerElement;

    for (let game of GAMES) {
      // gameBoardElement
      const gameBoardElement = document.createElement("div");
      gameBoardsContainerElement.appendChild(gameBoardElement);
      gameBoardElement.style.width = `${(DISPLAY.WIDTH * 2) / 3}px`;
      gameBoardElement.style.height = `${DISPLAY.HEIGHT / 2}px`;
      gameBoardElement.style.border = "1px solid #ede";
      gameBoardElement.style.padding = "1rem";
      gameBoardElement.style.wordBreak = "break-word";
      gameBoardElement.style.display = "flex";
      gameBoardElement.style.justifyContent = "center";
      gameBoardElement.style.alignItems = "center";
      gameBoardElement.style.backgroundImage = `url(${game.thumbnail})`;
      gameBoardElement.onclick = () => this.startGame(game.onclick);
      const gameBoardTitleElement = document.createElement("h2");
      gameBoardElement.appendChild(gameBoardTitleElement);
      gameBoardTitleElement.style.fontSize = `${GAME_BOARD.FONTSIZE}`;
      gameBoardTitleElement.style.color = "#ede";
      gameBoardTitleElement.textContent = game.title;
    }
  }
  mount(container) {
    this.container = container;
    this.clearContainer(container);
    this.container.appendChild(this.gameBoardsContainerElement);
  }
  startGame(onclick) {
    this.clearContainer(this.container);
    onclick();
  }
  clearContainer(container) {
    container.textContent = null;
    while (container.lastElementChild) {
      container.removeChild(container.lastElementChild);
    }
  }
}

window.onload = () => {
  // startHalloweenShootingGame();
  const gameBoard = new GameBoard();
  gameBoard.mount(document.body);
};
